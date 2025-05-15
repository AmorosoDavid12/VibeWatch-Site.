'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getTrending, getImageUrl, getYear, getTitle, TMDBMedia, getPopularCelebrities, TMDBPerson } from '../utils/tmdb-api';
import Header from './Header';
export default function Home() {
  const [trendingMedia, setTrendingMedia] = useState<TMDBMedia[]>([]);
  const [popularCelebrities, setPopularCelebrities] = useState<TMDBPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCelebsLoading, setIsCelebsLoading] = useState(true);
  const celebsScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselInterval = 11000; // 11 seconds between slides
  
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
        // Set random starting index for carousel
        setCurrentCarouselIndex(Math.floor(Math.random() * Math.min(data.length, 6)));
      } catch (error) {
        console.error('Error fetching trending data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrending();
  }, []);
  
  // Set up carousel auto-rotation with ref to track interval
  useEffect(() => {
    // Clear any existing interval
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
      carouselIntervalRef.current = null;
    }
    
    if (!isLoading && trendingMedia.length > 0) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % trendingMedia.length);
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
      prevIndex === 0 ? trendingMedia.length - 1 : prevIndex - 1
    );
    
    // Restart interval
    carouselIntervalRef.current = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % trendingMedia.length);
    }, carouselInterval);
  };
  
  const handleNextCarousel = () => {
    // Reset interval when manually changing slides
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
      carouselIntervalRef.current = null;
    }
    
    setCurrentCarouselIndex((prevIndex) => 
      (prevIndex + 1) % trendingMedia.length
    );
    
    // Restart interval
    carouselIntervalRef.current = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % trendingMedia.length);
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
  
  return (
    <div className="bg-[#121212] text-white min-h-screen">
      {/* Header/Navigation */}
      <Header />
      
      {/* Featured Content Carousel */}
      <div className="relative mb-8">
        <div className="max-w-[1300px] mx-auto relative h-[420px] overflow-hidden">
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
            className="absolute top-1/2 left-2.5 -translate-y-1/2 bg-black/50 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl"
          >
            ❮
          </button>
          <button 
            onClick={handleNextCarousel}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 bg-black/50 text-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl"
          >
            ❯
          </button>
        </div>
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