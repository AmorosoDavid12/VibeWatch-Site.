'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getTrending, getImageUrl, getYear, getTitle, TMDBMedia, getPopularCelebrities, TMDBPerson } from '../utils/tmdb-api';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../utils/watchlist';
import { useAuth } from '../utils/auth-provider';
import Header from './Header';

type TrendingMediaWithWatchlist = TMDBMedia & { inWatchlist: boolean };

export default function Home() {
  const { user } = useAuth();
  const [trendingMedia, setTrendingMedia] = useState<TrendingMediaWithWatchlist[]>([]);
  const [popularCelebrities, setPopularCelebrities] = useState<TMDBPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCelebsLoading, setIsCelebsLoading] = useState(true);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const celebsScrollRef = useRef<HTMLDivElement>(null);
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showFeaturedLeftArrow, setShowFeaturedLeftArrow] = useState(false);
  const [showFeaturedRightArrow, setShowFeaturedRightArrow] = useState(true);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselInterval = 11000; // 11 seconds between slides
  
  const handleScroll = useCallback((ref: React.RefObject<HTMLDivElement | null>, setShowL: Function, setShowR: Function) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setShowL(scrollLeft > 0);
      setShowR(scrollLeft + clientWidth < scrollWidth - 1);
    }
  }, []);

  // Check scroll position for celebrity carousel
  const handleCelebsScroll = useCallback(() => {
    handleScroll(celebsScrollRef, setShowLeftArrow, setShowRightArrow);
  }, [handleScroll]);
  
  // Check scroll position for featured items
  const handleFeaturedScroll = useCallback(() => {
    handleScroll(featuredScrollRef, setShowFeaturedLeftArrow, setShowFeaturedRightArrow);
  }, [handleScroll]);
  
  // Set up scroll event listener
  useEffect(() => {
    const celebsContainer = celebsScrollRef.current;
    const featuredContainer = featuredScrollRef.current;
    
    if (celebsContainer) {
      celebsContainer.addEventListener('scroll', handleCelebsScroll);
      handleCelebsScroll();
    }
    
    if (featuredContainer) {
      featuredContainer.addEventListener('scroll', handleFeaturedScroll);
      handleFeaturedScroll();
    }
    
    return () => {
      if (celebsContainer) {
        celebsContainer.removeEventListener('scroll', handleCelebsScroll);
      }
      if (featuredContainer) {
        featuredContainer.removeEventListener('scroll', handleFeaturedScroll);
      }
    };
  }, [handleCelebsScroll, handleFeaturedScroll, isCelebsLoading, isLoading]);
  
  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const data = await getTrending();
        let mediaWithWatchlist = data.map(item => ({
          ...item,
          inWatchlist: false
        }));

        if (user) {
          // Fetch all watchlist items once
          const watchlist = await getWatchlist(user.id);
          // Create a Set of item_keys for fast lookup
          const watchlistKeys = new Set(watchlist.map(item => `${item.mediaType}_${item.id}`));
          mediaWithWatchlist = mediaWithWatchlist.map(item => ({
            ...item,
            inWatchlist: watchlistKeys.has(`${item.media_type}_${item.id}`)
          }));
        }

        setTrendingMedia(mediaWithWatchlist); // Use all items instead of just first 6
        setCurrentCarouselIndex(Math.floor(Math.random() * data.length)); // Remove Math.min(data.length, 6)
        setTimeout(() => {
          handleFeaturedScroll();
          handleCelebsScroll();
        }, 0);
      } catch (error) {
        console.error('Error fetching trending data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrending();
  }, [user?.id]); // Add user?.id as a dependency to refetch when user changes
  
  // Set up carousel auto-rotation with ref to track interval
  useEffect(() => {
    // Clear any existing interval
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
      carouselIntervalRef.current = null;
    }
    
    if (!isLoading && trendingMedia.length > 0) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % trendingMedia.length); // Remove Math.min(trendingMedia.length, 6)
      }, carouselInterval);
      
      return () => {
        if (carouselIntervalRef.current) {
          clearInterval(carouselIntervalRef.current);
          carouselIntervalRef.current = null;
        }
      };
    }
  }, [isLoading, trendingMedia, carouselInterval]);
  
  const handlePrevCarousel = () => {
    // Reset interval when manually changing slides
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
      carouselIntervalRef.current = null;
    }
    
    setCurrentCarouselIndex((prevIndex) => 
      prevIndex === 0 ? trendingMedia.length - 1 : prevIndex - 1 // Remove Math.min(trendingMedia.length, 6)
    );
    
    // Restart interval
    carouselIntervalRef.current = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % trendingMedia.length); // Remove Math.min(trendingMedia.length, 6)
    }, carouselInterval);
  };
  
  const handleNextCarousel = () => {
    // Reset interval when manually changing slides
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
      carouselIntervalRef.current = null;
    }
    
    setCurrentCarouselIndex((prevIndex) => 
      (prevIndex + 1) % trendingMedia.length // Remove Math.min(trendingMedia.length, 6)
    );
    
    // Restart interval
    carouselIntervalRef.current = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % trendingMedia.length); // Remove Math.min(trendingMedia.length, 6)
    }, carouselInterval);
  };
  
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
  
  const currentMedia = trendingMedia[currentCarouselIndex];
  
  // Toast effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  return (
    <div className="bg-[#121212] text-white min-h-screen">
      {/* Header/Navigation */}
      <Header />
      {/* Toast notification */}
      {toast && (
        <div
          className="fixed left-1/2 bottom-10 z-50 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-lg shadow-lg text-base font-medium transition-opacity duration-700 animate-fade-in-out"
          style={{ pointerEvents: 'none' }}
        >
          {toast}
        </div>
      )}
      
      {/* Featured Content Carousel */}
      <div className="relative mb-8">
        <div className="max-w-[1300px] mx-auto relative h-[500px] overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-500 text-5xl text-white">
              Loading...
            </div>
          ) : (
            <>
              <div className="absolute inset-0">
                <Image
                  src={getImageUrl(currentMedia?.backdrop_path, 'original')}
                  alt={getTitle(currentMedia)}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="absolute left-5 bottom-5 max-w-[600px] z-10">
                <h1 className="text-3xl font-bold mb-2 text-shadow">{getTitle(currentMedia)}</h1>
                <p className="text-lg mb-3 opacity-90 text-shadow line-clamp-2">
                  {currentMedia?.overview?.substring(0, 120)}
                  {currentMedia?.overview && currentMedia.overview.length > 120 ? '...' : ''}
                </p>
                <div className="flex items-center mb-3">
                  <span className="flex items-center mr-4">
                    <span className="text-yellow-400 mr-1">⭐</span> {currentMedia?.vote_average?.toFixed(1)} TMDB
                  </span>
                  <span>{getYear(currentMedia)} • {currentMedia?.media_type}</span>
                </div>
                <button className="bg-white/20 border-none text-white py-2 px-4 rounded flex items-center transition-colors hover:bg-white/30">
                  ▶ <span className="ml-2">Watch Trailer</span>
                </button>
              </div>
            </>
          )}
          
          <button 
            onClick={handlePrevCarousel}
            className="absolute top-[45%] left-1 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg z-10 hover:bg-black hover:text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
            ❮
          </button>
          <button 
            onClick={handleNextCarousel}
            className="absolute top-[45%] right-1 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg z-10 hover:bg-black hover:text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
            ❯
          </button>
        </div>
      </div>
      
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Featured today */}
        <div className="flex justify-between items-center my-4 mt-8">
          <h2 className="text-2xl font-semibold text-[#FF6B6B]">Featured today</h2>
          <Link href="/featured" className="text-[#3498db] text-sm">See all</Link>
        </div>
        
        <div className="relative">
          <div 
            ref={featuredScrollRef}
            className="flex overflow-x-auto gap-4 py-4 mb-8 scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
              // Loading skeleton
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex-none bg-[#1a1a1a] rounded overflow-hidden transition-transform hover:-translate-y-1 animate-pulse" style={{ minWidth: '180px', width: '180px' }}>
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
                <div key={media.id} className="flex-none bg-[#1a1a1a] rounded overflow-hidden transition-transform hover:-translate-y-1" style={{ minWidth: '180px', width: '180px' }}>
                  <div className="relative">
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={getImageUrl(media.poster_path)}
                        alt={getTitle(media)}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                    </div>
                    <button 
                      className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center hover:text-yellow-400 transition-colors group"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (!user) {
                          alert('Please sign in to add items to your watchlist');
                          return;
                        }
                        
                        setWatchlistLoading(true);
                        try {
                          // Create a copy of the media array to update state properly
                          const updatedMedia = [...trendingMedia];
                          const mediaIndex = updatedMedia.findIndex(item => item.id === media.id);
                          
                          if (mediaIndex !== -1) {
                            const currentStatus = updatedMedia[mediaIndex].inWatchlist;
                            let success;
                            let dbId: number | undefined = undefined;
                            if (currentStatus) {
                              // Try to find dbId from the user's watchlist
                              const watchlist = await getWatchlist(user.id);
                              const found = watchlist.find(item => `${item.mediaType}_${item.id}` === `${media.media_type}_${media.id}`);
                              dbId = found?.dbId;
                              // Remove from watchlist using dbId if available
                              success = await removeFromWatchlist(user.id, media.id, media.media_type, dbId);
                            } else {
                              // Add to watchlist
                              success = await addToWatchlist(user.id, media);
                            }
                            
                            if (success) {
                              // Re-fetch the watchlist and update trendingMedia state
                              const watchlist = await getWatchlist(user.id);
                              const watchlistKeys = new Set(watchlist.map(item => `${item.mediaType}_${item.id}`));
                              const newTrendingMedia = updatedMedia.map(item => ({
                                ...item,
                                inWatchlist: watchlistKeys.has(`${item.media_type}_${item.id}`)
                              }));
                              setTrendingMedia(newTrendingMedia);
                              // Show feedback to user
                              setToast(`${getTitle(media)} ${!currentStatus ? 'added to' : 'removed from'} watchlist`);
                            }
                          }
                        } catch (error) {
                          console.error('Error updating watchlist:', error);
                          alert('Failed to update watchlist. Please try again.');
                        } finally {
                          setWatchlistLoading(false);
                        }
                      }}
                      disabled={watchlistLoading}
                      title={media.inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      {media.inWatchlist ? (
                        // Filled bookmark icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      ) : (
                        // Outline bookmark icon that fills on hover
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" stroke="currentColor" fill="none">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" className="group-hover:fill-current transition-all duration-200" />
                        </svg>
                      )}
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
          
          {!isLoading && (
            <>
              {showFeaturedLeftArrow && (
                <button 
                  onClick={() => {
                    if (featuredScrollRef.current) {
                      // Scroll by 5 cards (card width + gap)
                      const cardWidth = 196; // 180px + 16px gap
                      featuredScrollRef.current.scrollLeft -= cardWidth * 5;
                    }
                  }}
                  className="absolute top-[45%] left-1 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg z-10 hover:bg-black hover:text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  aria-label="Scroll left"
                >
                  ❮
                </button>
              )}
              {showFeaturedRightArrow && (
                <button 
                  onClick={() => {
                    if (featuredScrollRef.current) {
                      // Scroll by 5 cards (card width + gap)
                      const cardWidth = 196; // 180px + 16px gap
                      featuredScrollRef.current.scrollLeft += cardWidth * 5;
                    }
                  }}
                  className="absolute top-[45%] right-1 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg z-10 hover:bg-black hover:text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  aria-label="Scroll right"
                >
                  ❯
                </button>
              )}
            </>
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
            className="flex overflow-x-auto gap-4 pb-4 mb-8 scroll-smooth hide-scrollbar max-w-[1300px] mx-auto"
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
                  {/* <div className="text-sm text-gray-400">{celebrity.known_for_department}</div> */}
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
                  className="absolute top-[40%] left-1 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg z-10 hover:bg-black hover:text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  aria-label="Scroll left"
                >
                  ❮
                </button>
              )}
              {showRightArrow && (
                <button 
                  onClick={() => {
                    if (celebsScrollRef.current) {
                      // Scroll by 5 cards (card width + gap)
                      const cardWidth = 176; // 160px + 16px gap
                      celebsScrollRef.current.scrollLeft += cardWidth * 5;
                    }
                  }}
                  className="absolute top-[40%] right-1 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg z-10 hover:bg-black hover:text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  aria-label="Scroll right"
                >
                  ❯
                </button>
              )}
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