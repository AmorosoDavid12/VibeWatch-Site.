'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../utils/auth-provider';
import { supabase } from '../utils/supabase';
import { getWatchlist } from '../utils/watchlist';

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

const Header = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Try to get profile from localStorage first to prevent flashing
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
          // Cache the profile data
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
        // Use the getWatchlist utility function
        const items = await getWatchlist(user.id);
        setWatchlistCount(items.length);
      } catch (error) {
        console.error('Failed to fetch watchlist count:', error);
      }
    };
    
    fetchWatchlistCount();

    // Set up a subscription to user_items changes for watchlist
    let subscription: ReturnType<typeof supabase.channel> | undefined;
    if (user) {
      subscription = supabase
        .channel('watchlist_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'user_items' },
          (payload) => {
            console.log('Realtime event received:', payload);
            fetchWatchlistCount();
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [user]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  // Render placeholder during loading state
  const renderUserSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center animate-pulse">
          <div className="h-4 w-16 bg-gray-700 rounded mr-2"></div>
          <div className="w-8 h-8 rounded-full bg-gray-700"></div>
        </div>
      );
    }
    
    if (user && profile) {
      return (
        <div className="text-white flex items-center text-sm relative" ref={dropdownRef}>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={toggleDropdown}
          >
            <span className="mr-1.5">
              {profile.username 
                ? profile.username.split('#')[0] 
                : user.email?.split('@')[0]}
            </span>
            {profile.avatar_url ? (
              <div className="w-8 h-8 rounded-full overflow-hidden ml-1.5">
                <Image 
                  src={profile.avatar_url} 
                  alt={profile.username || "User"} 
                  width={32} 
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center ml-1.5">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <svg 
              className={`h-4 w-4 text-gray-400 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] rounded-md shadow-lg p-2 z-50">
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-sm hover:bg-[#333] rounded"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/watched" 
                className="block px-4 py-2 text-sm hover:bg-[#333] rounded"
                onClick={() => setIsDropdownOpen(false)}
              >
                Watched
              </Link>
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  signOut();
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-[#333] rounded text-red-400"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }
    
    // Not logged in
    return (
      <Link href="/signin" className="text-white flex items-center text-sm">
        Sign In
        <div className="w-8 h-8 rounded-full bg-[#555] flex items-center justify-center ml-1.5">
          👤
        </div>
      </Link>
    );
  };
  
  return (
    <header className="bg-black px-4 py-2 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="max-w-[1300px] mx-auto flex flex-1 justify-around">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-[#FF6B6B] mr-5">VibeWatch</Link>
          <button className="bg-transparent border-none text-white mr-5 flex items-center cursor-pointer">
            <span className="mr-2">☰</span> Menu
          </button>
          <select className="bg-[#121212] border border-[#333] text-white py-1.5 px-2.5 rounded mr-2.5 text-sm">
            <option>All</option>
            <option>Movies</option>
            <option>TV Shows</option>
            <option>Anime</option>
            <option>Documentaries</option>
          </select>
        </div>
        
        <div className="flex flex-1 max-w-xl mx-4">
          <input 
            type="text" 
            placeholder="Search for a movie, TV show, person..." 
            className="bg-white border-none py-1.5 px-2.5 w-full rounded-l-md text-black text-sm"
          />
          <button className="bg-white border-none py-1.5 px-3.5 rounded-r-md">
            🔍
          </button>
        </div>
        
        <div className="flex items-center space-x-6 md:space-x-8">
          <Link href="/watchlist" className="text-white flex items-center text-sm">
            Watchlist
            {watchlistCount > 0 && (
              <span className="ml-1.5 bg-[#FF6B6B] text-white text-xs rounded-full px-2 py-0.5 inline-flex items-center justify-center min-w-[20px]">
                {watchlistCount}
              </span>
            )}
          </Link>
          {renderUserSection()}
        </div>
      </div>
    </header>
  );
};

export default Header;