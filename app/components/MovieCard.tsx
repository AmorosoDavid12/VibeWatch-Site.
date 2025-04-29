import React from 'react';
import Image from 'next/image';

interface MovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
  rating?: number;
  year?: number;
  isWatched?: boolean;
}

const MovieCard = ({ id, title, imageUrl, rating, year, isWatched = false }: MovieCardProps) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[280px] w-[180px]">
      <div className="relative h-[220px] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        
        {isWatched && (
          <div className="absolute top-2 right-2 bg-purple-alt rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        
        {rating && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            ★ {rating.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="p-2">
        <h3 className="font-semibold text-sm truncate">{title}</h3>
        {year && <p className="text-xs text-gray-500">{year}</p>}
      </div>
      
      <button className="absolute bottom-2 right-2 p-1 rounded-full bg-netflix-red text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default MovieCard; 