'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Sample search results
  const searchResults = [
    {
      id: '5',
      title: 'Breaking Bad',
      imageUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      rating: 9.5,
      year: 2008
    },
    {
      id: '6',
      title: 'Game of Thrones',
      imageUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
      rating: 9.3,
      year: 2011
    },
    {
      id: '7',
      title: 'The Mandalorian',
      imageUrl: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
      rating: 8.8,
      year: 2019
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // In a real app, we'd fetch search results here
      // For now, we'll just simulate a search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 800);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-20">
      <Header />
      
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, TV shows..."
              className="w-full p-3 pl-10 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            />
            <span className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <button 
              type="submit" 
              className="absolute right-2 top-2 bg-tab-search text-white p-2 rounded-md"
            >
              Search
            </button>
          </div>
        </form>
        
        {isSearching ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-indigo rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : searchQuery ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Results for "{searchQuery}"</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map(item => (
                <MovieCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  imageUrl={item.imageUrl}
                  rating={item.rating}
                  year={item.year}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Search for your favorite movies and TV shows</p>
          </div>
        )}
      </div>
      
      <Navigation />
    </main>
  );
} 