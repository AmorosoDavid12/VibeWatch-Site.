'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../utils/auth-provider';

export default function Watchlist() {
  const { user, signOut } = useAuth();
  
  // Sample watchlist data
  const watchlistItems = [
    {
      id: '1',
      title: 'Stranger Things',
      imageUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      rating: 8.7,
      year: 2016,
      userRating: 9
    },
    {
      id: '2',
      title: 'The Witcher',
      imageUrl: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
      rating: 8.2,
      year: 2019,
      userRating: 8.5
    },
    {
      id: '3',
      title: 'Money Heist',
      imageUrl: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
      rating: 8.3,
      year: 2017,
      userRating: 7.5
    },
    {
      id: '4',
      title: 'The Queens Gambit',
      imageUrl: 'https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg',
      rating: 8.6,
      year: 2020,
      userRating: 9.5
    }
  ];

  // User must be logged in to see a populated watchlist
  const hasWatchlistItems = user && watchlistItems.length > 0;

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
        ) : hasWatchlistItems ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlistItems.map(item => (
              <div key={item.id} className="bg-[#1a1a1a] rounded overflow-hidden transition-transform hover:-translate-y-1">
                <div className="relative">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title}
                    width={180}
                    height={270}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <button className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center">
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