'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../utils/auth-provider';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getTrending, getImageUrl, getYear, getTitle, TMDBMedia, getPopularCelebrities, TMDBPerson } from '../utils/tmdb-api';

export default function Home() {
  const { user, signOut } = useAuth();
  const [trendingMedia, setTrendingMedia] = useState<TMDBMedia[]>([]);
  const [popularCelebrities, setPopularCelebrities] = useState<TMDBPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCelebsLoading, setIsCelebsLoading] = useState(true);
  const celebsScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  
  // Check scroll position for celebrity carousel
  const handleCelebsScroll = useCallback(() => {
    if (celebsScrollRef.current) {
      setShowLeftArrow(celebsScrollRef.current.scrollLeft > 0);
    }
  }, []);
  
  // Set up scroll event listener
  useEffect(() => {
    const scrollContainer = celebsScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleCelebsScroll);
      // Check initial state
      handleCelebsScroll();
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleCelebsScroll);
      }
    };
  }, [handleCelebsScroll, isCelebsLoading]);
  
  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const data = await getTrending();
        setTrendingMedia(data.slice(0, 6)); // Only take the first 6 items
      } catch (error) {
        console.error('Error fetching trending data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrending();
  }, []);
  
  useEffect(() => {
    const fetchCelebrities = async () => {
      setIsCelebsLoading(true);
      try {
        const data = await getPopularCelebrities();
        setPopularCelebrities(data.slice(0, 20)); // Display 20 celebrities instead of 5
      } catch (error) {
        console.error('Error fetching celebrities data:', error);
      } finally {
        setIsCelebsLoading(false);
      }
    };
    
    fetchCelebrities();
  }, []);
  
  return (
    <div className="bg-[#121212] text-white min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-black px-4 py-2 flex items-center justify-between shadow-md sticky top-0 z-50">
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
        
        <div className="flex items-center">
          <Link href="/watchlist" className="text-white mx-5 text-sm">Watchlist</Link>
          {user ? (
            <div className="text-white flex items-center text-sm group relative">
              <span className="mr-1.5">{user.email?.split('@')[0]}</span>
              <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center ml-1.5">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              
              <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] rounded-md shadow-lg p-2 hidden group-hover:block">
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-[#333] rounded">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-[#333] rounded">
                  Settings
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#333] rounded text-red-400"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/signin" className="text-white flex items-center text-sm">
              Sign In
              <div className="w-8 h-8 rounded-full bg-[#555] flex items-center justify-center ml-1.5">
                👤
              </div>
            </Link>
          )}
        </div>
      </header>
      
      {/* Featured Content Carousel */}
      <div className="relative mb-8">
        <div className="relative h-[360px] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-500 text-5xl text-white">
            1200 × 360
          </div>
          <div className="absolute left-5 bottom-5 max-w-[600px]">
            <h1 className="text-3xl font-bold mb-2 text-shadow">The Lord of the Rings: The Two Towers</h1>
            <p className="text-lg mb-3 opacity-90 text-shadow">Watch the teaser for Peter Jackson&apos;s epic fantasy adventure</p>
            <div className="flex items-center mb-3">
              <span className="flex items-center mr-4">
                <span className="text-yellow-400 mr-1">⭐</span> 8.4 TMDB
              </span>
              <span className="flex items-center mr-4">
                <span className="text-purple-400 mr-1">💜</span> 10/10
              </span>
              <span>2002 • Action, Adventure, Fantasy</span>
            </div>
            <button className="bg-white/20 border-none text-white py-2 px-4 rounded flex items-center transition-colors hover:bg-white/30">
              ▶ <span className="ml-2">Watch the Teaser</span>
            </button>
          </div>
        </div>
        
        <button className="absolute top-1/2 left-2.5 -translate-y-1/2 bg-black/50 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl">
          ❮
        </button>
        <button className="absolute top-1/2 right-2.5 -translate-y-1/2 bg-black/50 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl">
          ❯
        </button>
      </div>
      
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Featured today */}
        <div className="flex justify-between items-center my-8">
          <h2 className="text-2xl font-semibold text-[#FF6B6B]">Featured today</h2>
          <Link href="/featured" className="text-[#3498db] text-sm">See all</Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {isLoading ? (
            // Loading skeleton
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded overflow-hidden transition-transform hover:-translate-y-1 animate-pulse">
                <div className="relative">
                  <div className="flex items-center justify-center bg-gray-500 text-white aspect-[2/3]">
                    Loading...
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-3 w-10 bg-gray-600 rounded"></div>
                    <div className="h-3 w-16 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            trendingMedia.map((media) => (
              <div key={media.id} className="bg-[#1a1a1a] rounded overflow-hidden transition-transform hover:-translate-y-1">
                <div className="relative">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={getImageUrl(media.poster_path)}
                      alt={getTitle(media)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center">
                    +
                  </button>
                </div>
                <div className="p-2.5">
                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {getTitle(media)}
                  </h3>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{getYear(media)}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span>{media.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Most popular friends */}
        <div className="flex justify-between items-center my-8">
          <h2 className="text-2xl font-semibold text-[#FF6B6B]">Most popular celebrities</h2>
          <Link href="/friends" className="text-[#3498db] text-sm">See all</Link>
        </div>
        
        <div className="relative">
          <div 
            ref={celebsScrollRef}
            className="flex overflow-x-auto gap-4 pb-4 mb-8 scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isCelebsLoading ? (
              // Loading skeleton
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex-none text-center animate-pulse">
                  <div className="w-[160px] h-[160px] bg-gray-500 rounded-full mb-3 flex items-center justify-center text-white">
                    Loading...
                  </div>
                  <div className="h-5 bg-gray-600 rounded mb-2 mx-auto w-28"></div>
                  <div className="h-4 bg-gray-600 rounded mx-auto w-32"></div>
                </div>
              ))
            ) : (
              popularCelebrities.map((celebrity) => (
                <div key={celebrity.id} className="flex-none text-center" style={{ minWidth: '160px' }}>
                  <div className="relative w-[160px] h-[160px] rounded-full mb-3 overflow-hidden">
                    <Image 
                      src={getImageUrl(celebrity.profile_path, 'w185')} 
                      alt={celebrity.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-base font-medium mb-1.5 px-1">{celebrity.name}</div>
                  <div className="text-sm text-gray-400">{celebrity.known_for_department}</div>
                </div>
              ))
            )}
          </div>
          
          {!isCelebsLoading && (
            <>
              {showLeftArrow && (
                <button 
                  onClick={() => {
                    if (celebsScrollRef.current) {
                      // Scroll by 5 cards (card width + gap)
                      const cardWidth = 176; // 160px + 16px gap
                      celebsScrollRef.current.scrollLeft -= cardWidth * 5;
                    }
                  }}
                  className="absolute top-1/3 left-0.5 -translate-y-1/2 bg-black/70 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl z-10 hover:bg-black/90"
                  aria-label="Scroll left"
                >
                  ❮
                </button>
              )}
              <button 
                onClick={() => {
                  if (celebsScrollRef.current) {
                    // Scroll by 5 cards (card width + gap)
                    const cardWidth = 176; // 160px + 16px gap
                    celebsScrollRef.current.scrollLeft += cardWidth * 5;
                  }
                }}
                className="absolute top-1/3 right-0.5 -translate-y-1/2 bg-black/70 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl z-10 hover:bg-black/90"
                aria-label="Scroll right"
              >
                ❯
              </button>
            </>
          )}
        </div>
        
        {/* What to watch */}
        <div className="flex justify-between items-center my-8">
          <h2 className="text-2xl font-semibold text-[#FF6B6B]">What to watch</h2>
          <Link href="/recommendations" className="text-[#3498db] text-sm">Get more recommendations</Link>
        </div>
      </div>
    </div>
  );
} 