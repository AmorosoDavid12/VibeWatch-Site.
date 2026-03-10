'use client';

import { Suspense } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import Header from '../components/Header';
import {
  searchMulti,
  searchMovies,
  searchTV,
  searchPerson,
  getTrending,
  getPopularMovies,
  getPopularTV,
  getImageUrl,
  getTitle,
  getYear,
  type TMDBMedia,
  type TMDBPerson,
} from '../utils/tmdb-api';

// ===== Types =====

type TabType = 'all' | 'movies' | 'tv' | 'people';

const TABS: { key: TabType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movies', label: 'Movies' },
  { key: 'tv', label: 'TV Shows' },
  { key: 'people', label: 'People' },
];

const RECENT_SEARCHES_KEY = 'vibewatch-recent-searches';
const MAX_RECENT = 10;

// ===== Skeleton Loaders =====

function MediaSkeleton() {
  return (
    <div>
      <div className="aspect-[2/3] bg-elevated rounded-lg animate-shimmer"
        style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
      />
      <div className="mt-1.5 px-0.5">
        <div className="h-3.5 bg-elevated rounded w-3/4 mb-1.5 animate-shimmer"
          style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
        />
        <div className="h-3 bg-elevated rounded w-1/3 animate-shimmer"
          style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
        />
      </div>
    </div>
  );
}

function PersonSkeleton() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-lg border border-border-subtle">
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-elevated flex-shrink-0 animate-shimmer"
        style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
      />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-elevated rounded w-2/3 mb-2 animate-shimmer"
          style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
        />
        <div className="h-3 bg-elevated rounded w-1/2 animate-shimmer"
          style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
        />
      </div>
    </div>
  );
}

function SkeletonGrid({ type }: { type: 'media' | 'people' }) {
  if (type === 'people') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => <PersonSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: 10 }).map((_, i) => <MediaSkeleton key={i} />)}
    </div>
  );
}

function ScrollRowSkeleton() {
  return (
    <div className="flex gap-3 md:gap-4 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[130px] sm:w-[150px] lg:w-[160px]">
          <div className="aspect-[2/3] bg-elevated rounded-lg animate-shimmer"
            style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
          />
          <div className="mt-2 h-3 bg-elevated rounded w-3/4 animate-shimmer"
            style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
          />
        </div>
      ))}
    </div>
  );
}

// ===== Poster Card (for horizontal scroll rows) =====

function PosterCard({ item }: { item: TMDBMedia }) {
  const title = getTitle(item);
  const year = getYear(item);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <Link
      href={`/title?id=${item.id}&type=${item.media_type}`}
      className="flex-shrink-0 w-[130px] sm:w-[150px] lg:w-[160px] scroll-snap-align-start group"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-elevated border border-border-subtle transition-all duration-normal hover-lift">
        {item.poster_path ? (
          <Image
            src={getImageUrl(item.poster_path, 'w342')}
            alt={title}
            fill
            draggable={false}
            className="object-cover"
            sizes="160px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        )}
        {/* Rating badge */}
        {rating && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 rounded-[var(--radius-sm)] px-1.5 py-0.5">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px] text-white font-medium">{rating}</span>
          </div>
        )}
      </div>
      <div className="mt-1.5 px-0.5">
        <h3 className="text-xs sm:text-sm text-primary font-medium truncate">{title}</h3>
        <p className="text-[10px] sm:text-xs text-secondary">{year}</p>
      </div>
    </Link>
  );
}

// ===== Horizontal Scroll Row (Embla Carousel + Auto Scroll) =====

const DRAG_THRESHOLD = 6; // px — movement below this counts as a click, not a drag

function ScrollRow({
  title,
  items,
  isLoading: loading,
  speed = 0.8,
}: {
  title: string;
  items: TMDBMedia[];
  isLoading?: boolean;
  speed?: number;
}) {
  const startPos = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    [AutoScroll({ speed, startDelay: 1000, stopOnInteraction: false })]
  );

  // Merge refs: emblaRef (callback) + viewportRef (for cursor toggling)
  const setRef = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    emblaRef(node);
  }, [emblaRef]);

  // Grab cursor while dragging
  useEffect(() => {
    if (!emblaApi) return;

    const onPointerDown = () => {
      viewportRef.current?.classList.add('is-dragging');
    };
    const onPointerUp = () => {
      viewportRef.current?.classList.remove('is-dragging');
    };

    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);
    return () => {
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerUp);
    };
  }, [emblaApi]);

  // Manually pause/resume auto-scroll on hover (more reliable than stopOnMouseEnter
  // which can miss re-entry after a hard drag release)
  useEffect(() => {
    if (!emblaApi) return;
    const wrapper = viewportRef.current?.parentElement; // .scroll-row-mask
    if (!wrapper) return;

    const onEnter = () => {
      const plugin = emblaApi.plugins()?.autoScroll;
      if (plugin) {
        plugin.stop();
        console.log(`[ScrollRow:${title}] mouseenter → autoScroll stopped`);
      }
    };
    const onLeave = () => {
      const plugin = emblaApi.plugins()?.autoScroll;
      if (plugin) {
        plugin.play();
        console.log(`[ScrollRow:${title}] mouseleave → autoScroll resumed`);
      }
    };

    wrapper.addEventListener('mouseenter', onEnter);
    wrapper.addEventListener('mouseleave', onLeave);
    return () => {
      wrapper.removeEventListener('mouseenter', onEnter);
      wrapper.removeEventListener('mouseleave', onLeave);
    };
  }, [emblaApi, title]);

  // Record pointer start position
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    console.log(`[ScrollRow:${title}] pointerDown at (${e.clientX}, ${e.clientY})`);
  }, [title]);

  // Block link clicks only if pointer actually moved beyond threshold
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    const wasDrag = dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD;
    console.log(`[ScrollRow:${title}] click — dx=${dx.toFixed(0)} dy=${dy.toFixed(0)} threshold=${DRAG_THRESHOLD} → ${wasDrag ? 'BLOCKED (drag)' : 'ALLOWED (click)'}`);
    if (wasDrag) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [title]);

  if (loading) {
    return (
      <section>
        <h2 className="text-lg md:text-xl font-semibold text-primary mb-3">{title}</h2>
        <ScrollRowSkeleton />
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg md:text-xl font-semibold text-primary mb-3">{title}</h2>
      <div className="scroll-row-mask">
        <div className="embla-viewport overflow-hidden cursor-grab" ref={setRef}>
          <div
            className="flex gap-3 md:gap-4 pb-2"
            onPointerDown={handlePointerDown}
            onClickCapture={handleClickCapture}
          >
            {items.map((item) => (
              <PosterCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== Media Card (matches PosterCard style) =====

function MediaCard({ item }: { item: TMDBMedia }) {
  const title = getTitle(item);
  const year = getYear(item);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const typeLabel = item.media_type === 'movie' ? 'Movie' : 'TV';

  return (
    <Link
      href={`/title?id=${item.id}&type=${item.media_type}`}
      className="group"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-elevated border border-border-subtle transition-all duration-normal hover-lift">
        {item.poster_path ? (
          <Image
            src={getImageUrl(item.poster_path, 'w342')}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <span className="absolute top-1.5 left-1.5 bg-black/70 text-[10px] font-medium text-white px-1.5 py-0.5 rounded-[var(--radius-sm)]">
          {typeLabel}
        </span>
        {/* Rating badge */}
        {rating && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 rounded-[var(--radius-sm)] px-1.5 py-0.5">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px] text-white font-medium">{rating}</span>
          </div>
        )}
      </div>
      <div className="mt-1.5 px-0.5">
        <h3 className="text-xs sm:text-sm text-primary font-medium truncate">{title}</h3>
        <p className="text-[10px] sm:text-xs text-secondary">{year}</p>
      </div>
    </Link>
  );
}

// ===== Person Card =====

function PersonCard({ person }: { person: TMDBPerson }) {
  const knownFor = person.known_for
    ?.filter(k => k.title || k.name)
    .map(k => k.title || k.name)
    .slice(0, 3);

  return (
    <Link
      href={`/person?id=${person.id}`}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-lg border border-border-subtle transition-all duration-normal hover-lift"
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-elevated flex-shrink-0">
        {person.profile_path ? (
          <Image
            src={getImageUrl(person.profile_path, 'w185')}
            alt={person.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-tertiary">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base text-primary truncate">{person.name}</h3>
        {person.known_for_department && (
          <p className="text-xs sm:text-sm text-secondary">{person.known_for_department}</p>
        )}
        {knownFor && knownFor.length > 0 && (
          <p className="text-xs text-tertiary mt-0.5 truncate">
            {knownFor.join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
}

// ===== Media Results Grid =====

function MediaResultsGrid({ results }: { results: TMDBMedia[] }) {
  if (results.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {results.map((item) => (
        <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

// ===== People Results Grid =====

function PeopleResultsGrid({ results }: { results: TMDBPerson[] }) {
  if (results.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
      {results.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}

// ===== No Results =====

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <svg className="w-12 h-12 text-tertiary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <h3 className="text-lg font-semibold text-primary mb-2">No results found</h3>
      <p className="text-secondary text-sm max-w-[400px]">
        We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking your spelling or using different keywords.
      </p>
    </div>
  );
}

// ===== Empty State =====

function EmptyState({
  recentSearches,
  trendingItems,
  popularMovies,
  popularTV,
  isLoadingDiscover,
  onSearchClick,
  onRemoveRecent,
  onClearRecent,
}: {
  recentSearches: string[];
  trendingItems: TMDBMedia[];
  popularMovies: TMDBMedia[];
  popularTV: TMDBMedia[];
  isLoadingDiscover: boolean;
  onSearchClick: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  onClearRecent: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-primary">Recent Searches</h2>
            <button
              onClick={onClearRecent}
              className="text-xs text-search hover:underline min-h-[44px] flex items-center px-2"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-0.5">
            {recentSearches.map((query) => (
              <div key={query} className="flex items-center group">
                <button
                  onClick={() => onSearchClick(query)}
                  className="flex-1 flex items-center gap-3 text-left py-2.5 px-3 rounded-lg hover:bg-surface transition-colors min-h-[44px]"
                >
                  <svg className="w-4 h-4 text-tertiary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-primary truncate">{query}</span>
                </button>
                <button
                  onClick={() => onRemoveRecent(query)}
                  className="p-2 text-tertiary hover:text-primary transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Remove "${query}" from recent searches`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Keys prevent React from unmounting these when the recent-searches section above appears/disappears */}
      <ScrollRow key="trending" title="Trending Now" items={trendingItems.slice(0, 20)} isLoading={isLoadingDiscover && trendingItems.length === 0} speed={0.64} />

      <ScrollRow key="popular-movies" title="Popular Movies" items={popularMovies.slice(0, 20)} isLoading={isLoadingDiscover && popularMovies.length === 0} speed={0.48} />

      <ScrollRow key="popular-tv" title="Popular TV Shows" items={popularTV.slice(0, 20)} isLoading={isLoadingDiscover && popularTV.length === 0} speed={0.56} />
    </div>
  );
}

// ===== Search Content (uses useSearchParams) =====

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = (searchParams.get('tab') as TabType) || 'all';

  // State
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [mediaResults, setMediaResults] = useState<TMDBMedia[]>([]);
  const [personResults, setPersonResults] = useState<TMDBPerson[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingItems, setTrendingItems] = useState<TMDBMedia[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMedia[]>([]);
  const [popularTV, setPopularTV] = useState<TMDBMedia[]>([]);
  const [isLoadingDiscover, setIsLoadingDiscover] = useState(true);

  // Refs
  const searchIdRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTabRef = useRef(activeTab);

  // Keep ref in sync
  activeTabRef.current = activeTab;

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Load discover data (trending + popular)
  useEffect(() => {
    setIsLoadingDiscover(true);
    Promise.all([
      getTrending(),
      getPopularMovies(),
      getPopularTV(),
    ]).then(([trending, movies, tv]) => {
      setTrendingItems(trending.filter(i => i.media_type === 'movie' || i.media_type === 'tv'));
      setPopularMovies(movies.results);
      setPopularTV(tv.results);
    }).finally(() => {
      setIsLoadingDiscover(false);
    });
  }, []);

  // Auto-focus on desktop only
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop && inputRef.current && !initialQuery) {
      inputRef.current.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Execute search
  const executeSearch = useCallback(async (query: string, tab: TabType, page: number = 1, append: boolean = false) => {
    if (!query.trim()) return;

    const currentSearchId = ++searchIdRef.current;

    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setMediaResults([]);
      setPersonResults([]);
    }

    try {
      let newMedia: TMDBMedia[] = [];
      let newPeople: TMDBPerson[] = [];
      let pages = 0;

      if (tab === 'all') {
        const data = await searchMulti(query, page);
        newMedia = data.results;
        newPeople = data.person_results || [];
        pages = data.total_pages;
      } else if (tab === 'movies') {
        const data = await searchMovies(query, page);
        newMedia = data.results;
        pages = data.total_pages;
      } else if (tab === 'tv') {
        const data = await searchTV(query, page);
        newMedia = data.results;
        pages = data.total_pages;
      } else if (tab === 'people') {
        const data = await searchPerson(query, page);
        newPeople = data.results;
        pages = data.total_pages;
      }

      // Discard stale response
      if (currentSearchId !== searchIdRef.current) return;

      if (append) {
        setMediaResults(prev => {
          const existingKeys = new Set(prev.map(m => `${m.media_type}-${m.id}`));
          const unique = newMedia.filter(m => !existingKeys.has(`${m.media_type}-${m.id}`));
          return [...prev, ...unique];
        });
        setPersonResults(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const unique = newPeople.filter(p => !existingIds.has(p.id));
          return [...prev, ...unique];
        });
      } else {
        setMediaResults(newMedia);
        setPersonResults(newPeople);
      }

      setCurrentPage(page);
      setTotalPages(pages);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      if (currentSearchId === searchIdRef.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  // Update URL params
  const updateURL = useCallback((query: string, tab: TabType) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tab !== 'all') params.set('tab', tab);
    const paramString = params.toString();
    router.replace(`/search${paramString ? `?${paramString}` : ''}`, { scroll: false });
  }, [router]);

  // On mount: if URL has a query, execute search
  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery, initialTab);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search on input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!value.trim()) {
      setHasSearched(false);
      setMediaResults([]);
      setPersonResults([]);
      updateURL('', activeTab);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      updateURL(value, activeTab);
      executeSearch(value, activeTab);
    }, 300);
  };

  // Save to recent searches
  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  };

  // Enter key handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      const query = inputValue.trim();
      if (query) {
        saveRecentSearch(query);
        updateURL(query, activeTab);
        executeSearch(query, activeTab);
        if (window.innerWidth < 768) {
          inputRef.current?.blur();
        }
      }
    }
  };

  // Clear input
  const handleClear = () => {
    setInputValue('');
    setHasSearched(false);
    setMediaResults([]);
    setPersonResults([]);
    updateURL('', activeTab);
    inputRef.current?.focus();
  };

  // Tab switch
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const query = inputValue.trim();
    updateURL(query, tab);
    if (query) {
      executeSearch(query, tab);
    }
  };

  // Recent search click
  const handleRecentSearchClick = (query: string) => {
    setInputValue(query);
    setActiveTab('all');
    updateURL(query, 'all');
    executeSearch(query, 'all');
    saveRecentSearch(query);
  };

  // Remove individual recent search
  const handleRemoveRecent = (query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== query);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  };

  // Clear all recent searches
  const handleClearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch { /* ignore */ }
  };

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && !isLoadingMore && currentPage < totalPages) {
          const query = inputValue.trim();
          if (query) {
            executeSearch(query, activeTabRef.current, currentPage + 1, true);
          }
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentPage, totalPages, isLoading, isLoadingMore, inputValue, executeSearch]);

  const hasResults = mediaResults.length > 0 || personResults.length > 0;
  const showEmptyState = !hasSearched && !isLoading && !inputValue.trim();
  const showNoResults = hasSearched && !isLoading && !hasResults;

  return (
    <div className="min-h-screen bg-page">
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-6 pb-20">
        {/* Search Bar — primary and only search bar on this page */}
        <div className="max-w-2xl mx-auto lg:max-w-none mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for movies, TV shows, people..."
              className="w-full h-12 md:h-[52px] pl-12 pr-10 bg-input border border-border-default rounded-lg text-primary text-sm placeholder:text-tertiary transition-colors focus:outline-none focus:border-search"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-tertiary hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {(hasSearched || isLoading || inputValue.trim()) && (
          <div className="mb-6 border-b border-border-subtle overflow-x-auto scrollbar-hide">
            <div className="flex flex-nowrap">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] whitespace-nowrap ${
                    activeTab === key
                      ? 'text-search border-b-2 border-search'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {showEmptyState && (
          <EmptyState
            recentSearches={recentSearches}
            trendingItems={trendingItems}
            popularMovies={popularMovies}
            popularTV={popularTV}
            isLoadingDiscover={isLoadingDiscover}
            onSearchClick={handleRecentSearchClick}
            onRemoveRecent={handleRemoveRecent}
            onClearRecent={handleClearRecent}
          />
        )}

        {isLoading && !isLoadingMore && (
          <SkeletonGrid type={activeTab === 'people' ? 'people' : 'media'} />
        )}

        {!isLoading && hasResults && (
          <div className="space-y-8">
            {/* Media results */}
            {mediaResults.length > 0 && (
              <section>
                {activeTab === 'all' && personResults.length > 0 && (
                  <h2 className="text-lg md:text-xl font-semibold text-primary mb-3">Movies & TV Shows</h2>
                )}
                <MediaResultsGrid results={mediaResults} />
              </section>
            )}

            {/* People results */}
            {personResults.length > 0 && (
              <section>
                {activeTab === 'all' && mediaResults.length > 0 && (
                  <h2 className="text-lg md:text-xl font-semibold text-primary mb-3">People</h2>
                )}
                <PeopleResultsGrid results={personResults} />
              </section>
            )}
          </div>
        )}

        {showNoResults && <NoResults query={inputValue} />}

        {/* Loading more skeleton row */}
        {isLoadingMore && (
          <div className="mt-4">
            <SkeletonGrid type={activeTab === 'people' ? 'people' : 'media'} />
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {/* End of results indicator */}
        {hasSearched && hasResults && currentPage >= totalPages && !isLoading && (
          <p className="text-center text-tertiary text-sm py-8">
            All results loaded
          </p>
        )}
      </div>
    </div>
  );
}

// ===== Default Export with Suspense =====

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-page">
        <Header />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-6">
          <div className="max-w-2xl mx-auto lg:max-w-none mb-6">
            <div className="h-12 md:h-[52px] bg-input rounded-lg animate-shimmer"
              style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
            />
          </div>
          <SkeletonGrid type="media" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
