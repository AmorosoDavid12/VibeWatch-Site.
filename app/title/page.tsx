'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  getMovieDetails,
  getTVDetails,
  getImageUrl,
  getTitle,
  getYear,
  formatRuntime,
  formatCurrency,
  TMDBMovieDetails,
  TMDBTVDetails,
  getMovieReleaseDates,
  getTVContentRatings,
  getMovieCredits,
  getTVAggregateCredits,
  getMovieVideos,
  getTVVideos,
  getMovieImages,
  getTVImages,
  TMDBCreditsResponse,
  TMDBVideosResponse,
  TMDBImagesResponse,
  TMDBReleaseDatesResponse,
  TMDBContentRatingsResponse,
  TMDBVideo,
  getMovieKeywords,
  getTVKeywords,
  getMovieExternalIds,
  getTVExternalIds,
  getCollectionDetails,
  getMovieRecommendations,
  getTVRecommendations,
  getMovieSimilar,
  getTVSimilar,
  TMDBKeywordsResponse,
  TMDBExternalIdsResponse,
  TMDBCollectionDetails,
  TMDBKeyword,
  TMDBMedia as TMDBRelatedMedia,
  TMDBResponse
} from '../utils/tmdb-api';
import { addToWatchlist, removeFromWatchlist, getWatchlist, getWatchedItem, removeFromWatchedList } from '../utils/watchlist';
import { useAuth } from '../utils/auth-provider';
import Header from '../components/Header';
import Trailers from './components/Trailers';
import Gallery from './components/Gallery';
import RelatedContent from './components/RelatedContent';
import RatingModal from './components/RatingModal';

type MediaDetails = TMDBMovieDetails | TMDBTVDetails;

// Create a client component that uses useSearchParams
function TitleContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type') as 'movie' | 'tv';
  
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New state variables for additional details
  const [certification, setCertification] = useState<string | null>(null);
  const [fullReleaseDate, setFullReleaseDate] = useState<string | null>(null);
  const [credits, setCredits] = useState<TMDBCreditsResponse | null>(null);
  const [videos, setVideos] = useState<TMDBVideo[]>([]);
  const [images, setImages] = useState<TMDBImagesResponse | null>(null);

  // --- New state variables for Points 4 & 5 ---
  const [keywords, setKeywords] = useState<TMDBKeyword[]>([]);
  const [externalIds, setExternalIds] = useState<TMDBExternalIdsResponse | null>(null);
  const [collectionDetails, setCollectionDetails] = useState<TMDBCollectionDetails | null>(null);
  const [recommendations, setRecommendations] = useState<TMDBRelatedMedia[]>([]);
  const [similarTitles, setSimilarTitles] = useState<TMDBRelatedMedia[]>([]);

  // State for Rating Modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState<number | undefined>(undefined);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id || !type) return;
      
      setIsLoading(true);
      setCertification(null);
      setFullReleaseDate(null);
      setCredits(null);
      setVideos([]);
      setImages(null);
      setKeywords([]);
      setExternalIds(null);
      setCollectionDetails(null);
      setRecommendations([]);
      setSimilarTitles([]);
      setIsRatingModalOpen(false);
      setCurrentUserRating(undefined);
      setIsWatched(false);

      try {
        let mediaData: MediaDetails | null = null;
        let releaseDatesData: TMDBReleaseDatesResponse | null = null;
        let contentRatingsData: TMDBContentRatingsResponse | null = null;
        let creditsData: TMDBCreditsResponse | null = null;
        let videosData: TMDBVideosResponse | null = null;
        let imagesData: TMDBImagesResponse | null = null;
        let keywordsData: TMDBKeywordsResponse | null = null;
        let externalIdsData: TMDBExternalIdsResponse | null = null;
        let recommendationsData: TMDBResponse | null = null;
        let similarData: TMDBResponse | null = null;
        
        if (type === 'movie') {
          const movieId = parseInt(id);
          mediaData = await getMovieDetails(movieId);
          releaseDatesData = await getMovieReleaseDates(movieId);
          creditsData = await getMovieCredits(movieId);
          videosData = await getMovieVideos(movieId);
          imagesData = await getMovieImages(movieId);
          keywordsData = await getMovieKeywords(movieId);
          externalIdsData = await getMovieExternalIds(movieId);
          recommendationsData = await getMovieRecommendations(movieId);
          similarData = await getMovieSimilar(movieId);

          if (releaseDatesData) {
            const usRelease = releaseDatesData.results.find(r => r.iso_3166_1 === 'US');
            const releaseInfo = usRelease?.release_dates.find(rd => rd.certification !== '');
            setCertification(releaseInfo?.certification || null);
          }

          if (mediaData && (mediaData as TMDBMovieDetails).belongs_to_collection) {
            const collectionId = (mediaData as TMDBMovieDetails).belongs_to_collection!.id;
            const collectionData = await getCollectionDetails(collectionId);
            setCollectionDetails(collectionData);
          }

        } else if (type === 'tv') {
          const tvId = parseInt(id);
          mediaData = await getTVDetails(tvId);
          contentRatingsData = await getTVContentRatings(tvId);
          creditsData = await getTVAggregateCredits(tvId);
          videosData = await getTVVideos(tvId);
          imagesData = await getTVImages(tvId);
          keywordsData = await getTVKeywords(tvId);
          externalIdsData = await getTVExternalIds(tvId);
          recommendationsData = await getTVRecommendations(tvId);
          similarData = await getTVSimilar(tvId);

          if (contentRatingsData) {
            const usRating = contentRatingsData.results.find(r => r.iso_3166_1 === 'US');
            setCertification(usRating?.rating || null);
          }
        }
        
        setMedia(mediaData);
        setCredits(creditsData);
        setVideos(videosData?.results.filter(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')).slice(0, 3) || []);
        setImages(imagesData);
        setKeywords(keywordsData?.keywords || keywordsData?.results || []);
        setExternalIds(externalIdsData);
        setRecommendations(recommendationsData?.results.slice(0, 10) || []);
        setSimilarTitles(similarData?.results.slice(0, 10) || []);

        if (mediaData) {
          setFullReleaseDate(mediaData.release_date || mediaData.first_air_date || null);
        }
        
        if (user && mediaData) {
          const watchlist = await getWatchlist(user.id);
          const isInWatchlist = watchlist.some(item => 
            item.id === mediaData.id && item.mediaType === type
          );
          setInWatchlist(isInWatchlist);

          // Check if the item is in the watched list
          const watchedItem = await getWatchedItem(user.id, mediaData.id);
          if (watchedItem) {
            setIsWatched(true);
            setCurrentUserRating(watchedItem.user_rating);
          }
        }
      } catch (error) {
        console.error('Error fetching media details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id, type, user]);

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
        const watchlist = await getWatchlist(user.id);
        const found = watchlist.find(item => item.id === media.id && item.mediaType === type);
        success = await removeFromWatchlist(user.id, media.id, type, found?.dbId);
      } else {
        success = await addToWatchlist(user.id, { ...media, media_type: type });
        // Remove from watched list if present
        await removeFromWatchedList(user.id, media.id, type);
        setIsWatched(false);
        setCurrentUserRating(undefined);
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

  const handleOpenRatingModal = () => {
    if (!user || !media) {
      alert('Please sign in to rate titles.');
      return;
    }
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleSubmitRating = async (rating: number) => {
    if (!user || !media) return;
    console.log(`Submitting rating ${rating} for ${getTitle(media)}`);
    setToast(`Rated ${getTitle(media)} ${rating}/10`);
    setCurrentUserRating(rating);
    setIsWatched(true);
    // Remove from watchlist if present
    if (inWatchlist) {
      const watchlist = await getWatchlist(user.id);
      const found = watchlist.find(item => item.id === media.id && item.mediaType === type);
      await removeFromWatchlist(user.id, media.id, type, found?.dbId);
      setInWatchlist(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
          <div className="animate-pulse text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="bg-[#121212] text-white min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Title not found</h1>
            <p>The requested title could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const isMovie = type === 'movie';
  const movieData = media as TMDBMovieDetails;
  const tvData = media as TMDBTVDetails;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const mainDirector = credits?.crew.find(member => member.department === 'Directing' && member.job === 'Director');
  const mainWriters = credits?.crew.filter(member => member.department === 'Writing' && (member.job === 'Screenplay' || member.job === 'Writer' || member.job === 'Story')).slice(0, 2);

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Header />
      
      {toast && (
        <div
          className="fixed left-1/2 bottom-10 z-50 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-lg shadow-lg text-base font-medium transition-opacity duration-700 animate-fade-in-out"
          style={{ pointerEvents: 'none' }}
        >
          {toast}
        </div>
      )}

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
      </div>

      <div className="max-w-[1300px] mx-auto px-8 py-8 -mt-80 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#FF6B6B] mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {media.genres.map((genre, index) => (
                  <span
                    key={`${genre.id}-${index}`}
                    className="bg-[#1a1a1a] px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {keywords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#FF6B6B] mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.slice(0, 10).map((keyword, index) => (
                    <span
                      key={`${keyword.id}-${index}`}
                      className="bg-[#2a2a2a] px-3 py-1 rounded-full text-sm text-gray-300 hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                    >
                      {keyword.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {externalIds && (externalIds.imdb_id || externalIds.facebook_id || externalIds.instagram_id || externalIds.twitter_id) && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#FF6B6B] mb-3">External Links</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  {externalIds.imdb_id && (
                    <a href={`https://www.imdb.com/title/${externalIds.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF6B6B]">IMDb</a>
                  )}
                  {externalIds.facebook_id && (
                    <a href={`https://www.facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF6B6B]">Facebook</a>
                  )}
                  {externalIds.instagram_id && (
                    <a href={`https://www.instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF6B6B]">Instagram</a>
                  )}
                  {externalIds.twitter_id && (
                    <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF6B6B]">Twitter</a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{getTitle(media)}</h1>
              {media.tagline && (
                <p className="text-xl italic mb-4 opacity-90">{media.tagline}</p> 
              )}
              <div className="flex items-center gap-6 mb-4">
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span> 
                  {media.vote_average.toFixed(1)} TMDB
                </span>
                <span>{getYear(media)}</span>
                {certification && (
                  <span className="border border-gray-500 px-2 py-0.5 rounded text-sm">{certification}</span>
                )}
                {isMovie && movieData.runtime && (
                  <span>{formatRuntime(movieData.runtime)}</span>
                )}
                {!isMovie && tvData.number_of_seasons && (
                  <span>{tvData.number_of_seasons} Season{tvData.number_of_seasons > 1 ? 's' : ''}</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 cursor-pointer"
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

                <button
                  onClick={handleOpenRatingModal} 
                  className="bg-[#8c52ff] hover:bg-[#7A48CC] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {isWatched ? `Rated ${currentUserRating}/10` : 'Mark as Watched'}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {media.overview || 'No overview available.'}
              </p>
            </div>

            {isMovie && collectionDetails && (
              <div className="mb-8 p-4 bg-[#1a1a1a] rounded-lg">
                <h2 className="text-xl font-semibold text-[#FF6B6B] mb-3">Part of the {collectionDetails.name}</h2>
                {collectionDetails.poster_path && (
                  <div className="float-left mr-4 mb-2 w-24 aspect-[2/3] relative rounded overflow-hidden">
                    <Image 
                      src={getImageUrl(collectionDetails.poster_path, 'w185')}
                      alt={collectionDetails.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {collectionDetails.overview.length > 250 ? `${collectionDetails.overview.substring(0, 250)}...` : collectionDetails.overview}
                </p>
                <div className="clear-both"></div>
              </div>
            )}

            {!isMovie && tvData.seasons && tvData.seasons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Seasons</h2>
                <div className="space-y-3">
                  {tvData.seasons.filter(s => s.season_number > 0).slice(0,5).map((season,index) => (
                    <div key={`${season.id}-${index}`} className="bg-[#1a1a1a] p-3 rounded-lg flex items-start gap-3">
                      {season.poster_path && (
                        <div className="w-16 flex-shrink-0 aspect-[2/3] relative rounded overflow-hidden">
                          <Image 
                            src={getImageUrl(season.poster_path, 'w185')}
                            alt={season.name}
                            fill
                            sizes="64px"
                            className="object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-md">{season.name}</h3>
                        <p className="text-xs text-gray-400">
                          {new Date(season.air_date).getFullYear()} | {season.episode_count} Episode{season.episode_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  {tvData.seasons.filter(s => s.season_number > 0).length > 5 && (
                     <p className="text-sm text-gray-400">More seasons available...</p>
                  )}
                </div>
              </div>
            )}

            {(mainDirector || mainWriters && mainWriters.length > 0) && (
              <div className="mb-8">
                {mainDirector && (
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-[#FF6B6B] mb-2">Director</h3>
                    <p className="text-gray-300">{mainDirector.name}</p>
                  </div>
                )}
                {mainWriters && mainWriters.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-[#FF6B6B] mb-2">Writers</h3>
                    {mainWriters.map((writer, index) => (
                      <p key={`${writer.credit_id}-${index}`} className="text-gray-300">{writer.name} ({writer.job})</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {credits && credits.cast && credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Top Billed Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {credits.cast.slice(0, 10).map((actor, index) => (
                    <div key={`${actor.credit_id}-${index}`} className="bg-[#1a1a1a] p-3 rounded-lg text-center">
                      <div className="w-full aspect-[2/3] relative mx-auto mb-2 rounded overflow-hidden">
                        <Image
                          src={getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          fill
                          sizes="185px"
                          className="object-cover"
                        />
                      </div>
                      <p className="font-semibold text-sm">{actor.name}</p>
                      <p className="text-xs text-gray-400">{type === 'movie' ? actor.character : actor.roles?.map(r => r.character).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Trailers videos={videos} />

            <Gallery images={images} />

            {!isMovie && tvData.created_by.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#FF6B6B] mb-4">Created By</h3>
                <div className="flex flex-wrap gap-4">
                  {tvData.created_by.map((creator, index) => (
                    <div key={`${creator.id}-${index}`} className="bg-[#1a1a1a] p-4 rounded-lg text-center">
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

      <div className="max-w-[1300px] mx-auto px-8 py-8">
        <div className="bg-[#1a1a1a] p-6 rounded-lg flex flex-col md:flex-row gap-8"> 
          {/* Stats/Info Section */}
          <div className="flex-1 min-w-[250px]">
            <h2 className="text-xl font-semibold text-[#FF6B6B] mb-4">Additional Information</h2>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="ml-2">{media.status}</span>
            </div>
            {fullReleaseDate && (
              <div>
                <span className="text-gray-400">Release Date:</span>
                <span className="ml-2">{formatDate(fullReleaseDate)}</span>
              </div>
            )}
            <div>
              <span className="text-gray-400">Original Language:</span>
              <span className="ml-2">{media.original_language.toUpperCase()}</span>
            </div>
            {(isMovie ? (media as TMDBMovieDetails).original_title : (media as TMDBTVDetails).original_name) &&
              (getTitle(media) !== (isMovie ? (media as TMDBMovieDetails).original_title : (media as TMDBTVDetails).original_name)) && (
                <div>
                  <span className="text-gray-400">Original Title:</span>
                  <span className="ml-2">{isMovie ? (media as TMDBMovieDetails).original_title : (media as TMDBTVDetails).original_name}</span>
                </div>
              )}
            {media.spoken_languages && media.spoken_languages.length > 0 && (
              <div>
                <span className="text-gray-400">Spoken Languages:</span>
                <span className="ml-2">{media.spoken_languages.map(lang => lang.english_name || lang.name).join(', ')}</span>
              </div>
            )}
            {media.production_countries && media.production_countries.length > 0 && (
              <div>
                <span className="text-gray-400">Production Countries:</span>
                <span className="ml-2">{media.production_countries.map(country => country.name).join(', ')}</span>
              </div>
            )}
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
          {/* Production Companies Section */}
          {media.production_companies && media.production_companies.length > 0 && (
            <div className="flex-1 min-w-[250px]">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Production Companies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
                {media.production_companies.slice(0, 8).map((company, index) => (
                  <div key={`${company.id}-${index}`} className="bg-[#2a2a2a] p-3 rounded-lg text-center">
                    {company.logo_path ? (
                      <div className="h-10 relative mb-1.5">
                        <Image
                          src={getImageUrl(company.logo_path, 'w200')}
                          alt={company.name}
                          fill
                          sizes="150px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-10 flex items-center justify-center mb-1.5">
                        <span className="text-gray-500 text-xs">No Logo</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">{company.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <RelatedContent recommendations={recommendations} similarTitles={similarTitles} />

      {media && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={handleCloseRatingModal}
          media={media}
          mediaType={type}
          onSubmitRating={handleSubmitRating}
          initialRating={currentUserRating}
        />
      )}
    </div>
  );
}

export default function TitlePage() {
  return (
    <Suspense fallback={<div className="bg-[#121212] text-white min-h-screen flex justify-center items-center"><div className="animate-pulse text-xl">Loading...</div></div>}>
      <TitleContent />
    </Suspense>
  );
}