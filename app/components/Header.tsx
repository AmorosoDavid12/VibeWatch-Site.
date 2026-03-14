'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../utils/auth-provider';
import { supabase } from '../utils/supabase';
import { getWatchlist } from '../utils/watchlist';
import { searchMulti, getTrending, getImageUrl, getTitle, getYear, type TMDBMedia, type TMDBPerson } from '../utils/tmdb-api';
import { Compass, TrendUp, MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import { MOODS } from '../config/moods';
import { MOOD_ICON_MAP } from '../config/mood-icons';

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

const HEADER_MOOD_HINTS = MOODS.slice(0, 4);

const Header = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Search dropdown state
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [instantResults, setInstantResults] = useState<{
    movies: TMDBMedia[];
    tv: TMDBMedia[];
    people: TMDBPerson[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingTitles, setTrendingTitles] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch trending titles for search dropdown (once)
  useEffect(() => {
    let cancelled = false;
    getTrending().then((items) => {
      if (cancelled) return;
      const titles = items
        .map((item) => getTitle(item))
        .filter((t) => t.length > 0)
        .slice(0, 5);
      setTrendingTitles(titles);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Close search popover on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchFocused(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const cachedProfile = localStorage.getItem('userProfile');
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
        setIsLoading(false);
      } catch {
        // Invalid JSON, ignore
      }
    }

    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsLoading(false);
          return;
        }

        if (data) {
          localStorage.setItem('userProfile', JSON.stringify(data));
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch watchlist count
  useEffect(() => {
    const fetchWatchlistCount = async () => {
      if (!user) {
        setWatchlistCount(0);
        return;
      }
      try {
        const items = await getWatchlist(user.id);
        setWatchlistCount(items.length);
      } catch (error) {
        console.error('Failed to fetch watchlist count:', error);
      }
    };

    fetchWatchlistCount();

    let subscription: ReturnType<typeof supabase.channel> | undefined;
    if (user) {
      subscription = supabase
        .channel('watchlist_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'user_items' },
          () => { fetchWatchlistCount(); }
        )
        .subscribe();
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Header instant search
  const handleHeaderSearchChange = useCallback((value: string) => {
    setHeaderSearchQuery(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!value.trim()) {
      setInstantResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const data = await searchMulti(value.trim(), 1);
        const movies = data.results.filter(r => r.media_type === 'movie').slice(0, 3);
        const tv = data.results.filter(r => r.media_type === 'tv').slice(0, 3);
        const people = (data.person_results || []).slice(0, 2);
        setInstantResults({ movies, tv, people });
      } catch {
        setInstantResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const handleSearchSubmit = () => {
    if (headerSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(headerSearchQuery.trim())}&tab=all`);
      setHeaderSearchQuery('');
      setSearchFocused(false);
      setInstantResults(null);
    }
  };

  const handleMoodClick = (moodId: string) => {
    router.push(`/search?mood=${moodId}`);
    setSearchFocused(false);
    setHeaderSearchQuery('');
    setInstantResults(null);
  };

  const showPopover = searchFocused && !isSearchPage;
  const showExplorePopover = showPopover && !headerSearchQuery.trim();
  const showResultsPopover = showPopover && headerSearchQuery.trim().length > 0;

  const displayName = profile?.username
    ? profile.username.split('#')[0]
    : user?.email?.split('@')[0];

  return (
    <header className="bg-surface border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 h-14 md:h-16 flex items-center gap-3 md:gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-accent flex-shrink-0">
          VibeWatch
        </Link>

        {/* Desktop search — hidden on /search page */}
        {!isSearchPage && (
          <div className="hidden md:flex flex-1 max-w-xl mx-4" ref={searchContainerRef}>
            <div className="relative w-full">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none"
                weight="bold"
              />
              <input
                type="text"
                value={headerSearchQuery}
                onChange={(e) => handleHeaderSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                }}
                placeholder="Search movies, TV shows, people..."
                className="w-full h-9 pl-9 pr-3 bg-input border border-border-default rounded-lg text-primary text-sm placeholder:text-tertiary transition-colors focus:outline-none focus:border-search"
              />

              {/* Explore popover (empty input, focused) */}
              {showExplorePopover && (
                <div className="search-popover py-2">
                  {/* Explore CTA */}
                  <Link
                    href="/search"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-overlay transition-colors group"
                    onClick={() => setSearchFocused(false)}
                  >
                    <Compass className="w-5 h-5 text-search flex-shrink-0" weight="duotone" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary">Explore & Discover</p>
                      <p className="text-xs text-tertiary">Browse movies, shows, collections & more</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-tertiary group-hover:text-secondary group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
                  </Link>

                  <div className="border-t border-border-subtle mx-3 my-1.5" />

                  {/* Trending searches */}
                  {trendingTitles.length > 0 && (
                    <div className="px-4 py-2">
                      <p className="text-[11px] font-semibold text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <TrendUp className="w-3.5 h-3.5" weight="bold" />
                        Trending now
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {trendingTitles.map((title) => (
                          <Link
                            key={title}
                            href={`/search?q=${encodeURIComponent(title)}&tab=all`}
                            onClick={() => { setSearchFocused(false); setHeaderSearchQuery(''); setInstantResults(null); }}
                            className="flex items-center gap-2.5 py-1.5 text-sm text-secondary hover:text-primary transition-colors text-left"
                          >
                            <MagnifyingGlass className="w-3.5 h-3.5 text-tertiary flex-shrink-0" />
                            <span className="truncate">{title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border-subtle mx-3 my-1.5" />

                  {/* Mood pills */}
                  <div className="px-4 py-2">
                    <p className="text-[11px] font-semibold text-tertiary uppercase tracking-wider mb-2">
                      Try a mood
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {HEADER_MOOD_HINTS.map((mood) => {
                        const MoodIcon = MOOD_ICON_MAP[mood.icon];
                        return (
                          <button
                            key={mood.id}
                            onClick={() => handleMoodClick(mood.id)}
                            className="chip chip-mood text-xs"
                            style={{ '--mood-color': mood.color } as React.CSSProperties}
                          >
                            {MoodIcon && <MoodIcon size={14} weight="duotone" style={{ color: mood.color }} />}
                            {mood.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Results popover (typing) */}
              {showResultsPopover && (
                <div className="search-popover py-2">
                  {isSearching && !instantResults && (
                    <div className="px-4 py-6 text-center text-sm text-tertiary">
                      Searching...
                    </div>
                  )}

                  {instantResults && (
                    <>
                      {/* Movies */}
                      {instantResults.movies.length > 0 && (
                        <div className="mb-1">
                          <p className="px-4 py-1.5 text-[11px] font-semibold text-tertiary uppercase tracking-wider">
                            Movies
                          </p>
                          {instantResults.movies.map((item) => (
                            <Link
                              key={item.id}
                              href={`/title?id=${item.id}&type=movie`}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-overlay transition-colors"
                              onClick={() => { setSearchFocused(false); setHeaderSearchQuery(''); setInstantResults(null); }}
                            >
                              <div className="w-8 h-12 rounded overflow-hidden bg-elevated flex-shrink-0">
                                {item.poster_path ? (
                                  <Image
                                    src={getImageUrl(item.poster_path, 'w92')}
                                    alt={getTitle(item)}
                                    width={32}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-primary truncate">{getTitle(item)}</p>
                                <p className="text-xs text-tertiary">{getYear(item)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* TV Shows */}
                      {instantResults.tv.length > 0 && (
                        <div className="mb-1">
                          <p className="px-4 py-1.5 text-[11px] font-semibold text-tertiary uppercase tracking-wider">
                            TV Shows
                          </p>
                          {instantResults.tv.map((item) => (
                            <Link
                              key={item.id}
                              href={`/title?id=${item.id}&type=tv`}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-overlay transition-colors"
                              onClick={() => { setSearchFocused(false); setHeaderSearchQuery(''); setInstantResults(null); }}
                            >
                              <div className="w-8 h-12 rounded overflow-hidden bg-elevated flex-shrink-0">
                                {item.poster_path ? (
                                  <Image
                                    src={getImageUrl(item.poster_path, 'w92')}
                                    alt={getTitle(item)}
                                    width={32}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-primary truncate">{getTitle(item)}</p>
                                <p className="text-xs text-tertiary">{getYear(item)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* People */}
                      {instantResults.people.length > 0 && (
                        <div className="mb-1">
                          <p className="px-4 py-1.5 text-[11px] font-semibold text-tertiary uppercase tracking-wider">
                            People
                          </p>
                          {instantResults.people.map((person) => (
                            <Link
                              key={person.id}
                              href={`/person?id=${person.id}`}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-overlay transition-colors"
                              onClick={() => { setSearchFocused(false); setHeaderSearchQuery(''); setInstantResults(null); }}
                            >
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-elevated flex-shrink-0">
                                {person.profile_path ? (
                                  <Image
                                    src={getImageUrl(person.profile_path, 'w92')}
                                    alt={person.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-primary truncate">{person.name}</p>
                                <p className="text-xs text-tertiary">{person.known_for_department}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* No results */}
                      {instantResults.movies.length === 0 && instantResults.tv.length === 0 && instantResults.people.length === 0 && !isSearching && (
                        <div className="px-4 py-6 text-center text-sm text-tertiary">
                          No results found
                        </div>
                      )}

                      {/* See all results footer */}
                      {(instantResults.movies.length > 0 || instantResults.tv.length > 0 || instantResults.people.length > 0) && (
                        <>
                          <div className="border-t border-border-subtle mx-3 my-1" />
                          <Link
                            href={`/search?q=${encodeURIComponent(headerSearchQuery.trim())}&tab=all`}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-search hover:bg-overlay transition-colors"
                            onClick={() => { setSearchFocused(false); setHeaderSearchQuery(''); setInstantResults(null); }}
                          >
                            <span>See all results for &quot;{headerSearchQuery.trim()}&quot;</span>
                            <span>&rarr;</span>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spacer on search page to push actions right */}
        {isSearchPage && <div className="hidden md:block flex-1" />}

        {/* Right-side actions */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {/* Mobile search icon — hidden on /search page */}
          {!isSearchPage && (
            <Link
              href="/search"
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-secondary transition-colors hover:text-primary"
              aria-label="Search"
            >
              <MagnifyingGlass className="w-5 h-5" weight="bold" />
            </Link>
          )}

          {/* Explore */}
          <Link
            href="/search"
            className={`flex items-center gap-1.5 h-11 px-2 md:px-3 rounded-lg transition-colors ${
              isSearchPage ? 'text-primary' : 'text-secondary hover:text-primary'
            }`}
          >
            <Compass className="w-5 h-5 flex-shrink-0" weight={isSearchPage ? 'fill' : 'regular'} />
            <span className="hidden md:inline text-sm">Explore</span>
          </Link>

          {/* Watchlist */}
          <Link
            href="/watchlist"
            className={`flex items-center gap-1.5 h-11 px-2 md:px-3 rounded-lg transition-colors ${
              pathname === '/watchlist' ? 'text-primary' : 'text-secondary hover:text-primary'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="hidden md:inline text-sm">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-accent text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                {watchlistCount}
              </span>
            )}
          </Link>

          {/* User section */}
          {isLoading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="hidden md:block h-3 w-14 bg-elevated rounded" />
              <div className="w-8 h-8 rounded-full bg-elevated" />
            </div>
          ) : user && profile ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-1.5 h-11 px-1.5 md:px-2 rounded-lg transition-colors hover:bg-overlay cursor-pointer"
              >
                <span className="hidden md:inline text-sm text-primary truncate max-w-[120px]">
                  {displayName}
                </span>
                {profile.avatar_url ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.username || 'User'}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white">
                    {(displayName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <svg
                  className={`hidden md:block w-3.5 h-3.5 text-tertiary transition-transform duration-fast ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-elevated border border-border-subtle rounded-lg shadow-lg py-1.5 z-50 animate-fade-in">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 min-h-[44px] text-sm text-primary hover:bg-overlay rounded-md mx-1.5 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    href="/watched"
                    className="flex items-center gap-2.5 px-3 min-h-[44px] text-sm text-primary hover:bg-overlay rounded-md mx-1.5 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Watched
                  </Link>

                  {/* Divider */}
                  <div className="border-t border-border-subtle my-1.5 mx-3" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-2.5 px-3 min-h-[44px] text-sm text-secondary hover:bg-overlay rounded-md mx-1.5 w-[calc(100%-12px)] text-left transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Sign Out
                  </button>
                  <button
                    onClick={async () => {
                      setIsDropdownOpen(false);
                      if (!confirm('Delete your account? This cannot be undone.')) return;
                      try {
                        console.log('[Auth] Deleting profile for user:', user.id);
                        const { error: profileErr } = await supabase.from('profiles').delete().eq('id', user.id);
                        if (profileErr) console.error('[Auth] Profile delete error:', profileErr.message);

                        const { data: { session: currentSession } } = await supabase.auth.getSession();
                        const accessToken = currentSession?.access_token;
                        const res = await fetch('/api/delete-account', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ userId: user.id, accessToken }),
                        });
                        console.log('[Auth] Delete account API response:', res.status);
                      } catch (err) {
                        console.error('[Auth] Delete account error:', err);
                      }
                      signOut();
                    }}
                    className="flex items-center gap-2.5 px-3 min-h-[44px] text-sm text-error hover:bg-overlay rounded-md mx-1.5 w-[calc(100%-12px)] text-left transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in */
            <Link
              href="/signin"
              className="flex items-center gap-1.5 h-11 px-2 md:px-3 rounded-lg text-secondary transition-colors hover:text-primary"
            >
              <span className="hidden md:inline text-sm">Sign In</span>
              <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
