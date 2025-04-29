import Header from '../components/Header';
import Navigation from '../components/Navigation';
import MovieCard from '../components/MovieCard';

export default function WatchedPage() {
  // Sample watched content
  const watchedItems = [
    {
      id: '8',
      title: 'Stranger Things S1',
      imageUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      rating: 8.7,
      year: 2016,
      isWatched: true
    },
    {
      id: '9',
      title: 'The Dark Knight',
      imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      rating: 9.0,
      year: 2008,
      isWatched: true
    },
    {
      id: '10',
      title: 'Inception',
      imageUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      rating: 8.8,
      year: 2010,
      isWatched: true
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-20">
      <Header />
      
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Watched</h1>
        
        {watchedItems.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg">
                You&apos;ve watched <span className="text-tab-watched font-bold">{watchedItems.length}</span> items
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-md text-sm">Sort</button>
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-md text-sm">Filter</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchedItems.map(item => (
                <MovieCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  imageUrl={item.imageUrl}
                  rating={item.rating}
                  year={item.year}
                  isWatched={item.isWatched}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven&apos;t watched anything yet</p>
            <button className="bg-purple-alt text-white px-4 py-2 rounded-md">
              Browse content
            </button>
          </div>
        )}
      </div>
      
      <Navigation />
    </main>
  );
} 