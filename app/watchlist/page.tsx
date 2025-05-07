import Link from 'next/link';

export default function Home() {
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
          <Link href="/signin" className="text-white flex items-center text-sm">
            Sign In
            <div className="w-8 h-8 rounded-full bg-[#555] flex items-center justify-center ml-1.5">
              👤
            </div>
          </Link>
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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded overflow-hidden transition-transform hover:-translate-y-1">
              <div className="relative">
                <div className="flex items-center justify-center bg-gray-500 text-white aspect-[2/3]">
                  180 × 270
                </div>
                <button className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center">
                  +
                </button>
              </div>
              <div className="p-2.5">
                <h3 className="font-semibold text-sm mb-1 truncate">
                  {i === 0 && "The Lord of the Rings: The Two Towers"}
                  {i === 1 && "The Wolf of Wall Street"}
                  {i === 2 && "Finding Nemo"}
                  {i === 3 && "The Revenant"}
                  {i === 4 && "Titanic"}
                  {i === 5 && "Inception"}
                </h3>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>
                    {i === 0 && "2002"}
                    {i === 1 && "2013"}
                    {i === 2 && "2003"}
                    {i === 3 && "2015"}
                    {i === 4 && "1997"}
                    {i === 5 && "2010"}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span>
                      {i === 0 && "8.4"}
                      {i === 1 && "8.0"}
                      {i === 2 && "7.8"}
                      {i === 3 && "7.5"}
                      {i === 4 && "7.9"}
                      {i === 5 && "8.4"}
                    </span>
                    {i !== 5 && (
                      <span className="ml-2 text-[#3498db]">
                        💜 
                        {i === 0 && "10"}
                        {i === 1 && "9"}
                        {i === 2 && "9.5"}
                        {i === 3 && "8.5"}
                        {i === 4 && "8"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Most popular friends */}
        <div className="flex justify-between items-center my-8">
          <h2 className="text-2xl font-semibold text-[#FF6B6B]">Most popular friends</h2>
          <Link href="/friends" className="text-[#3498db] text-sm">See all</Link>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 mb-8">
          {[
            { name: "MrWhite", movies: 42 },
            { name: "DavidM", movies: 28 },
            { name: "Steven", movies: 15 }
          ].map((friend, i) => (
            <div key={i} className="flex-none text-center">
              <div className="w-[120px] h-[120px] bg-gray-500 rounded-full mb-2 flex items-center justify-center text-white">
                120 × 120
              </div>
              <div className="text-sm font-medium mb-1">{friend.name}</div>
              <div className="text-xs text-gray-400">{friend.movies} movies watched</div>
            </div>
          ))}
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