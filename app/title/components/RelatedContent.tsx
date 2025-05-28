'use client';

import Image from 'next/image';
import { TMDBMedia as TMDBRelatedMedia, getImageUrl, getTitle, getYear } from '../../utils/tmdb-api';

interface RelatedContentProps {
  recommendations: TMDBRelatedMedia[];
  similarTitles: TMDBRelatedMedia[];
}

export default function RelatedContent({ recommendations, similarTitles }: RelatedContentProps) {
  if (recommendations.length === 0 && similarTitles.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {recommendations.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-5">Recommendations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((rec, index) => (
              <a href={`/title?id=${rec.id}&type=${rec.media_type}`} key={`${rec.id}-${index}`} className="block bg-[#1a1a1a] rounded-lg overflow-hidden group">
                <div className="aspect-[2/3] relative">
                  <Image 
                    src={getImageUrl(rec.poster_path, 'w342')} 
                    alt={getTitle(rec)}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate group-hover:text-[#FF6B6B]">{getTitle(rec)}</h3>
                  <p className="text-xs text-gray-400">{getYear(rec)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {similarTitles.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-5">Similar Titles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarTitles.map((sim, index) => (
              <a href={`/title?id=${sim.id}&type=${sim.media_type}`} key={`${sim.id}-${index}`} className="block bg-[#1a1a1a] rounded-lg overflow-hidden group">
                <div className="aspect-[2/3] relative">
                  <Image 
                    src={getImageUrl(sim.poster_path, 'w342')}
                    alt={getTitle(sim)}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate group-hover:text-[#FF6B6B]">{getTitle(sim)}</h3>
                  <p className="text-xs text-gray-400">{getYear(sim)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}