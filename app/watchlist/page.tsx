import Header from '../components/Header';
import Navigation from '../components/Navigation';
import MovieCard from '../components/MovieCard';
import Link from 'next/link';

export default function Watchlist() {
  // Sample watchlist data
  const watchlistItems = [
    {
      id: '1',
      title: 'Stranger Things',
      imageUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      rating: 8.7,
      year: 2016
    },
    {
      id: '2',
      title: 'The Witcher',
      imageUrl: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
      rating: 8.2,
      year: 2019
    },
    {
      id: '3',
      title: 'Money Heist',
      imageUrl: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
      rating: 8.3,
      year: 2017
    },
    {
      id: '4',
      title: 'The Queens Gambit',
      imageUrl: 'https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg',
      rating: 8.6,
      year: 2020
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-20">
      <Header />
      
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Watchlist</h1>
        
        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchlistItems.map(item => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Your watchlist is empty</p>
            <button className="bg-netflix-red text-white px-4 py-2 rounded-md">
              Find something to watch
            </button>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/privacy-policy" 
            className="text-sm text-gray-500 hover:text-netflix-red transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
      
      <Navigation />
    </main>
  );
} 