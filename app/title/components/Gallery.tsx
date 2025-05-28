'use client';

import Image from 'next/image';
import { TMDBImagesResponse, getImageUrl } from '../../utils/tmdb-api';

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
}

interface GalleryProps {
  images: TMDBImagesResponse | null;
  productionCompanies: ProductionCompany[];
}

export default function Gallery({ images, productionCompanies }: GalleryProps) {
  const hasImages = images && (images.backdrops.length > 0 || images.posters.length > 0);
  const hasCompanies = productionCompanies && productionCompanies.length > 0;
  
  if (!hasImages && !hasCompanies) {
    return null;
  }

  return (
    <div className="mb-8">
      {hasImages && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Gallery</h2>
          {/* Display a few backdrops */} 
          {images!.backdrops.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Backdrops</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {images!.backdrops.slice(0, 6).map((img, index) => (
                  <div key={`${img.file_path}-${index}`} className="aspect-video relative bg-[#1a1a1a] rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(img.file_path, 'w780')}
                      alt="Backdrop image"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Display a few posters */} 
          {images!.posters.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Posters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {images!.posters.slice(0, 10).map((img, index) => (
                  <div key={`${img.file_path}-${index}`} className="aspect-[2/3] relative bg-[#1a1a1a] rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(img.file_path, 'w342')}
                      alt="Poster image"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Production Companies */}
      {hasCompanies && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#FF6B6B] mb-4">Production Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {productionCompanies.slice(0, 6).map((company, index) => (
              <div key={`${company.id}-${index}`} className="bg-[#1a1a1a] p-4 rounded-lg text-center">
                {company.logo_path ? (
                  <div className="h-12 relative mb-2">
                    <Image
                      src={getImageUrl(company.logo_path, 'w200')}
                      alt={company.name}
                      fill
                      sizes="200px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-12 flex items-center justify-center mb-2">
                    <span className="text-gray-500 text-xs">No Logo</span>
                  </div>
                )}
                <p className="text-sm text-gray-300">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}