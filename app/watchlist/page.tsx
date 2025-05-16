'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../utils/auth-provider';
import { useEffect, useState } from 'react';
import { getWatchlist, removeFromWatchlist } from '../utils/watchlist';
import Header from '../components/Header';

interface WatchlistItem {
  id: number | string;
  title: string;
  imageUrl: string;
  rating: number;
  year: number | string;
  userRating?: number;
  mediaType: string;
  dbId: number; // Original database ID for removal operations
}

export default function Watchlist() {
  const { user } = useAuth();
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWatchlist() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Use the getWatchlist utility function
        const items = await getWatchlist(user.id);
        setWatchlistItems(items);
      } catch (error) {
        console.error('Error processing watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWatchlist();
  }, [user]);

  // Handle removing an item from watchlist
  const removeFromWatchlistHandler = async (dbId: number, mediaId: number, mediaType: string) => {
    try {
      if (!user) return;
      const success = await removeFromWatchlist(user.id, mediaId, mediaType, dbId);
      if (!success) {
        console.error('Error removing from watchlist');
        return;
      }
      // Update the local state
      setWatchlistItems(prev => prev.filter(item => item.dbId !== dbId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // User must be logged in to see a populated watchlist
  const hasWatchlistItems = user && watchlistItems.length > 0;

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      {/* Header/Navigation */}
    <Header />
      
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#FF6B6B]">My Watchlist</h1>
          {hasWatchlistItems && (
            <Link href="/watchlist/all" className="text-[#3498db] text-sm">
              See all
            </Link>
          )}
        </div>
        
        {!user ? (
          <div className="bg-[#1a1a1a] rounded-md p-8 text-center mb-8">
            <div className="text-3xl mb-4 text-gray-500">🔐</div>
            <h3 className="text-lg font-semibold mb-2">Sign in to see your watchlist</h3>
            <p className="text-gray-400 mb-4">Track movies and shows you want to watch</p>
            <Link href="/signin" className="bg-[#3498db] text-white border-none px-4 py-2 rounded-md inline-block">
              Sign In
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B6B]"></div>
          </div>
        ) : hasWatchlistItems ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlistItems.map(item => (
              <div key={`${item.mediaType}_${item.id}`} className="bg-[#1a1a1a] rounded overflow-hidden transition-transform hover:-translate-y-1">
                <div className="relative">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title}
                    width={180}
                    height={270}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <button 
                    onClick={() => removeFromWatchlistHandler(item.dbId, Number(item.id), item.mediaType)}
                    className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2.5">
                  <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{item.year}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span>{item.rating}</span>
                      {item.userRating && (
                        <span className="ml-2 text-[#3498db]">💜 {item.userRating}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-md p-8 text-center mb-8">
            <div className="text-3xl mb-4 text-gray-500">🍿</div>
            <h3 className="text-lg font-semibold mb-2">Your Watchlist is empty</h3>
            <p className="text-gray-400 mb-4">Save shows and movies to keep track of what you want to watch.</p>
            <Link href="/" className="bg-[#3498db] text-white border-none px-4 py-2 rounded-md inline-block">
              Browse popular movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}