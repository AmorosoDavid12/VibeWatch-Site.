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
  TMDBCastMember,
  TMDBCrewMember,
  TMDBVideo,
  TMDBImage,
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
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../utils/watchlist';
import { useAuth } from '../utils/auth-provider';
import Header from '../components/Header';

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

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id || !type) return;
      
      setIsLoading(true);
      setCertification(null); // Reset on new fetch
      setFullReleaseDate(null); // Reset on new fetch
      setCredits(null); // Reset on new fetch
      setVideos([]); // Reset on new fetch
      setImages(null); // Reset on new fetch
      // --- Reset new states ---
      setKeywords([]);
      setExternalIds(null);
      setCollectionDetails(null);
      setRecommendations([]);
      setSimilarTitles([]);

      try {
        let mediaData: MediaDetails | null = null;
        let releaseDatesData: TMDBReleaseDatesResponse | null = null;
        let contentRatingsData: TMDBContentRatingsResponse | null = null;
        let creditsData: TMDBCreditsResponse | null = null;
        let videosData: TMDBVideosResponse | null = null;
        let imagesData: TMDBImagesResponse | null = null;
        // --- Variables for new data ---
        let keywordsData: TMDBKeywordsResponse | null = null;
        let externalIdsData: TMDBExternalIdsResponse | null = null;
        let recommendationsData: TMDBResponse | null = null; // TMDBResponse contains TMDBMedia[]
        let similarData: TMDBResponse | null = null;
        
        if (type === 'movie') {
          const movieId = parseInt(id);
          mediaData = await getMovieDetails(movieId);
          releaseDatesData = await getMovieReleaseDates(movieId);
          creditsData = await getMovieCredits(movieId);
          videosData = await getMovieVideos(movieId);
          imagesData = await getMovieImages(movieId);
          // --- Fetch new movie data ---
          keywordsData = await getMovieKeywords(movieId);
          externalIdsData = await getMovieExternalIds(movieId);
          recommendationsData = await getMovieRecommendations(movieId);
          similarData = await getMovieSimilar(movieId);

          if (releaseDatesData) {
            const usRelease = releaseDatesData.results.find(r => r.iso_3166_1 === 'US');
            const releaseInfo = usRelease?.release_dates.find(rd => rd.certification !== '');
            setCertification(releaseInfo?.certification || null);
          }

          // Fetch collection details if movie belongs to one
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
          // --- Fetch new TV data ---
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
        // --- Set new states ---
        setKeywords(keywordsData?.keywords || keywordsData?.results || []);
        setExternalIds(externalIdsData);
        setRecommendations(recommendationsData?.results.slice(0, 10) || []);
        setSimilarTitles(similarData?.results.slice(0, 10) || []);

        if (mediaData) {
          setFullReleaseDate(mediaData.release_date || mediaData.first_air_date || null);
        }
        
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

  // Helper to format date as Month Day, Year
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
            {/* Display Certification and Full Release Date */}
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

            {/* Additional Info */}
            <div className="mt-6 space-y-3">
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
              {/* Original Title (if different) */}
              {(isMovie ? (media as TMDBMovieDetails).original_title : (media as TMDBTVDetails).original_name) &&
               (getTitle(media) !== (isMovie ? (media as TMDBMovieDetails).original_title : (media as TMDBTVDetails).original_name)) && (
                <div>
                  <span className="text-gray-400">Original Title:</span>
                  <span className="ml-2">{isMovie ? (media as TMDBMovieDetails).original_title : (media as TMDBTVDetails).original_name}</span>
                </div>
              )}
              {/* Spoken Languages */}
              {media.spoken_languages && media.spoken_languages.length > 0 && (
                <div>
                  <span className="text-gray-400">Spoken Languages:</span>
                  <span className="ml-2">{media.spoken_languages.map(lang => lang.english_name || lang.name).join(', ')}</span>
                </div>
              )}
              {/* Production Countries */}
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

            {/* Keywords/Tags - Placed in the left column for discoverability */}
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

            {/* External Links - Placed in the left column */}
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

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {media.overview || 'No overview available.'}
              </p>
            </div>

            {/* Movie Collection Section */}
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
                {/* Optional: Link to a dedicated collection page or show other movies in the collection */}
                {/* <Link href={`/collection/${collectionDetails.id}`} className="text-[#FF6B6B] hover:underline">View Collection</Link> */}
                <div className="clear-both"></div>
              </div>
            )}

            {/* TV Seasons List - Placed in the main content area for TV shows */}
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
                        {/* Add more season details or link to season page if desired */}
                      </div>
                    </div>
                  ))}
                  {tvData.seasons.filter(s => s.season_number > 0).length > 5 && (
                     <p className="text-sm text-gray-400">More seasons available...</p>
                  )}
                </div>
              </div>
            )}

            {/* Director and Writers */}
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

            {/* Cast Section */}
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
                {/* TODO: Link to a full cast page or modal */} 
              </div>
            )}

            {/* Media Gallery - Videos (Trailers) */}
            {videos && videos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Trailers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video, index) => (
                    <div key={`${video.id}-${index}`} className="aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Gallery - Images (Backdrops and Posters) */}
            {images && (images.backdrops.length > 0 || images.posters.length > 0) && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#FF6B6B] mb-4">Gallery</h2>
                {/* Display a few backdrops */} 
                {images.backdrops.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Backdrops</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {images.backdrops.slice(0, 6).map((img, index) => (
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
                {images.posters.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Posters</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {images.posters.slice(0, 10).map((img, index) => (
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
                 {/* TODO: Link to a full image gallery page or modal */} 
              </div>
            )}

            {/* Production Companies */}
            {media.production_companies.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#FF6B6B] mb-4">Production Companies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {media.production_companies.slice(0, 6).map((company, index) => (
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

            {/* TV Show Specific Info */}
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

      {/* Recommendations and Similar Titles (Full Width Below Main Grid) */}
      {(recommendations.length > 0 || similarTitles.length > 0) && (
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
      )}
    </div>
  );
}

// Main page component that wraps the client component with Suspense
export default function TitlePage() {
  return (
    <Suspense fallback={<div className="bg-[#121212] text-white min-h-screen flex justify-center items-center"><div className="animate-pulse text-xl">Loading...</div></div>}>
      <TitleContent />
    </Suspense>
  );
}