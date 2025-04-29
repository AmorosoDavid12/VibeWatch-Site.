'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/' ? 'text-tab-watchlist font-bold' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs mt-1">Watchlist</span>
        </Link>
        
        <Link 
          href="/search" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/search' ? 'text-tab-search font-bold' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link 
          href="/watched" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/watched' ? 'text-tab-watched font-bold' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs mt-1">Watched</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation; 