'use client';

import Image from 'next/image';
import { TMDBVideo } from '../../utils/tmdb-api';
import { useState, useRef, useEffect, useCallback } from 'react';

interface TrailersProps {
  videos: TMDBVideo[];
}

const PEEK_AMOUNT_PX = 60; // How much of the adjacent card to show
const SPACE_BETWEEN_ITEMS_PX = 24; // Corresponds to space-x-6 in Tailwind

export default function Trailers({ videos }: TrailersProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const performScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !container.children.length || videos.length === 0) return;

    const items = Array.from(container.children) as HTMLElement[];
    if (activeIndex < 0 || activeIndex >= items.length) return; // Safety check

    const isOverflowing = container.scrollWidth > container.clientWidth;
    if (!isOverflowing) {
      if (container.scrollLeft !== 0) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      }
      return;
    }

    let targetScrollLeft = 0;
    if (activeIndex > 0) {
      let currentOffset = 0;
      for (let i = 0; i < activeIndex; i++) {
        if (items[i]) {
          currentOffset += items[i].offsetWidth + SPACE_BETWEEN_ITEMS_PX;
        }
      }
      targetScrollLeft = currentOffset - PEEK_AMOUNT_PX;
    }
    
    const maxScroll = container.scrollWidth - container.clientWidth;
    const finalScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScroll));

    if (Math.abs(container.scrollLeft - finalScrollLeft) > 1) { // Only scroll if significantly different
        container.scrollTo({ left: finalScrollLeft, behavior: 'smooth' });
    }
  }, [activeIndex, videos]); // videos dependency for length and potential offsetWidth changes

  // Effect for updating scroll position when activeIndex or videos change
  useEffect(() => {
    const timer = setTimeout(() => {
      performScroll();
    }, 50); // Short delay for DOM to settle
    return () => clearTimeout(timer);
  }, [activeIndex, videos, performScroll]);

  // Effect for managing arrow states and resize handling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateStates = () => {
      if (videos.length === 0) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      const isOverflowing = container.scrollWidth > container.clientWidth;
      if (isOverflowing) {
        setCanScrollLeft(activeIndex > 0);
        setCanScrollRight(activeIndex < videos.length - 1);
      } else {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
      performScroll(); // Recalculate scroll on resize or videos change
    };

    const initTimer = setTimeout(updateStates, 100); // Initial state update after layout
    window.addEventListener('resize', updateStates);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('resize', updateStates);
    };
  }, [activeIndex, videos, performScroll]);

  const handleNavigation = (direction: 'left' | 'right') => {
    setActiveIndex(prev => {
      const newIndex = prev + (direction === 'left' ? -1 : 1);
      return Math.max(0, Math.min(newIndex, videos.length - 1));
    });
  };

  return (
    <div className="mb-12 relative">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6">Trailers</h2>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => handleNavigation('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full shadow-md transition-colors duration-200 transform -translate-x-1/2 cursor-pointer"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        <div 
          ref={scrollContainerRef} 
          className="flex overflow-x-auto space-x-6 pb-1 no-scrollbar"
          // onScroll is not strictly needed if navigation is only via arrows
        >
          {videos.map((video, index) => (
            <div 
              key={`${video.id}-${index}`} 
              className="flex-none w-full sm:w-[560px] md:w-[640px] aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg"
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.key}?rel=0&modestbranding=1`}
                title={video.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              ></iframe>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            onClick={() => handleNavigation('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full shadow-md transition-colors duration-200 transform translate-x-1/2 cursor-pointer"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>
      {/* CSS to hide scrollbar - works in Next.js with styled-jsx */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}

// Helper class to hide scrollbar (add to your global CSS or a <style jsx global> tag if needed)
// If using Tailwind JIT, you might not need this if your purge settings are correct.
// .no-scrollbar::-webkit-scrollbar {
//   display: none;
// }
// .no-scrollbar {
//   -ms-overflow-style: none;  /* IE and Edge */
//   scrollbar-width: none;  /* Firefox */
// }