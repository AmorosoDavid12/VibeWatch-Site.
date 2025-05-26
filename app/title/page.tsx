'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMovieDetails, getTVDetails, getImageUrl, getTitle, getYear, formatRuntime, formatCurrency, TMDBMovieDetails, TMDBTVDetails } from '../utils/tmdb-api';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../utils/watchlist';
import { useAuth } from '../utils/auth-provider';
import Header from '../components/Header';

type MediaDetails = TMDBMovieDetails | TMDBTVDetails;

export default function TitlePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type') as 'movie' | 'tv';
  
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id || !type) return;
      
      setIsLoading(true);
      try {
        let mediaData: MediaDetails | null = null;
        
        if (type === 'movie') {
          mediaData = await getMovieDetails(parseInt(id));
        } else if (type === 'tv') {
          mediaData = await getTVDetails(parseInt(id));
        }
        
        setMedia(mediaData);
        
        // Check if in watchlist
        if (user && mediaData) {
          const watchlist = await getWatchlist(user.id);
          const isInWatchlist = watchlist.some(item => 
            item.id === mediaData.id && item.mediaType === type
          );
          setInWatchlist(isInWatchlist);
        }
      } catch (error) {
        console.error('Error fetching media details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id, type, user]);

  // Toast effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleWatchlistToggle = async () => {
    if (!user || !media) {
      alert('Please sign in to add items to your watchlist');
      return;
    }

    setWatchlistLoading(true);
    try {
      let success;
      if (inWatchlist) {
        // Get dbId from watchlist
        const watchlist = await getWatchlist(user.id);
        const found = watchlist.find(item => item.id === media.id && item.mediaType === type);
        success = await removeFromWatchlist(user.id, media.id, type, found?.dbId);
      } else {
        success = await addToWatchlist(user.id, { ...media, media_type: type });
      }

      if (success) {
        setInWatchlist(!inWatchlist);
        setToast(`${getTitle(media)} ${!inWatchlist ? 'added to' : 'removed from'} watchlist`);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert('Failed to update watchlist. Please try again.');
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="bg-[#121212] text-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl">Media not found</div>
        </div>
      </div>
    );
  }

  const isMovie = type === 'movie';
  const movieData = media as TMDBMovieDetails;
  const tvData = media as TMDBTVDetails;

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Header />
      
      {/* Toast notification */}
      {toast && (
        <div
          className="fixed left-1/2 bottom-10 z-50 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-lg shadow-lg text-base font-medium transition-opacity duration-700 animate-fade-in-out"
          style={{ pointerEvents: 'none' }}
        >
          {toast}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={getImageUrl(media.backdrop_path, 'original')}
          alt={getTitle(media)}
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/50 to-transparent" />
        
        <div className="absolute bottom-8 left-8 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 text-shadow">{getTitle(media)}</h1>
          {media.tagline && (
            <p className="text-xl italic mb-4 opacity-90 text-shadow">{media.tagline}</p>
          )}
          <div className="flex items-center gap-6 mb-4">
            <span className="flex items-center">
              <span className="text-yellow-400 mr-1">⭐</span> 
              {media.vote_average.toFixed(1)} TMDB
            </span>
            <span>{getYear(media)}</span>
            {isMovie && movieData.runtime && (
              <span>{formatRuntime(movieData.runtime)}</span>
            )}
            {!isMovie && tvData.number_of_seasons && (
              <span>{tvData.number_of_seasons} Season{tvData.number_of_seasons > 1 ? 's' : ''}</span>
            )}
          </div>
          
          <button
            onClick={handleWatchlistToggle}
            disabled={watchlistLoading}
            className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            {inWatchlist ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Remove from Watchlist
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Add to Watchlist
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
              <div className="aspect-[2/3] relative">
                <Image
                  src={getImageUrl(media.poster_path, 'w500')}
                  alt={getTitle(media)}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Genres */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#FF6B6B] mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {media.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-[#1a1a1a] px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 space-y-3">
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2">{media.status}</span>
              </div>
              <div>
                <span className="text-gray-400">Original Language:</span>
                <span className="ml-2">{media.original_language.toUpperCase()}</span>
              </div>
              {isMovie && movieData.budget > 0 && (
                <div>
                  <span className="text-gray-400">Budget:</span>
                  <span className="ml-2">{formatCurrency(movieData.budget)}</span>
                </div>
              )}
              {isMovie && movieData.revenue > 0 && (
                <div>
                  <span className="text-gray-400">Revenue:</span>
                  <span className="ml-2">{formatCurrency(movieData.revenue)}</span>
                </div>
              )}
              {!isMovie && (
                <div>
                  <span className="text-gray-400">Episodes:</span>
                  <span className="ml-2">{tvData.number_of_episodes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {media.overview || 'No overview available.'}
              </p>
            </div>

            {/* Production Companies */}
            {media.production_companies.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#FF6B6B] mb-4">Production Companies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {media.production_companies.slice(0, 6).map((company) => (
                    <div key={company.id} className="bg-[#1a1a1a] p-4 rounded-lg text-center">
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

            {/* TV Show Specific Info */}
            {!isMovie && tvData.created_by.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#FF6B6B] mb-4">Created By</h3>
                <div className="flex flex-wrap gap-4">
                  {tvData.created_by.map((creator) => (
                    <div key={creator.id} className="bg-[#1a1a1a] p-4 rounded-lg text-center">
                      {creator.profile_path ? (
                        <div className="w-16 h-16 relative mx-auto mb-2">
                          <Image
                            src={getImageUrl(creator.profile_path, 'w200')}
                            alt={creator.name}
                            fill
                            sizes="64px"
                            className="object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Photo</span>
                        </div>
                      )}
                      <p className="text-sm">{creator.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}