const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTViOWRlZmFjZjM2M2U4NTA3YTZhZDc2YWRlYmMwOCIsIm5iZiI6MTc0MjAzMTM3Ny43NTksInN1YiI6IjY3ZDU0YTExOTE2NWYzNzExODAxMWRlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._prxjv8E4jhpdNT-R8zJyikr1pvObvjtQhDUrx2Yyyg';

export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv' | 'person';
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  known_for_department: string;
  known_for: TMDBMedia[];
}

export interface TMDBResponse {
  page: number;
  results: TMDBMedia[];
  total_pages: number;
  total_results: number;
}

export interface TMDBPersonResponse {
  page: number;
  results: TMDBPerson[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails extends TMDBMedia {
  adult: boolean;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  imdb_id: string;
  original_language: string;
  original_title: string;
  popularity: number;
  production_companies: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  revenue: number;
  runtime: number;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  video: boolean;
  vote_count: number;
  belongs_to_collection: TMDBCollectionInfo | null;
}

export interface TMDBTVDetails extends TMDBMedia {
  adult: boolean;
  created_by: { id: number; credit_id: string; name: string; gender: number; profile_path: string | null }[];
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
  };
  networks: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
  production_companies: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  type: string;
  vote_count: number;
}

export interface TMDBReleaseDate {
  iso_3166_1: string;
  release_dates: {
    certification: string;
    iso_639_1: string;
    note: string;
    release_date: string;
    type: number;
  }[];
}

export interface TMDBReleaseDatesResponse {
  id: number;
  results: TMDBReleaseDate[];
}

export interface TMDBContentRating {
  iso_3166_1: string;
  rating: string;
}

export interface TMDBContentRatingsResponse {
  id: number;
  results: TMDBContentRating[];
}

export interface TMDBCastMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id?: number; // For movie cast
  character?: string;
  credit_id: string;
  order?: number; // For movie cast
  roles?: { // For TV aggregate_credits
    credit_id: string;
    character: string;
    episode_count: number;
  }[];
  total_episode_count?: number; // For TV aggregate_credits
}

export interface TMDBCrewMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department?: string;
  job?: string;
  jobs?: { // For TV aggregate_credits
    credit_id: string;
    job: string;
    episode_count: number;
  }[];
  total_episode_count?: number; // For TV aggregate_credits
}

export interface TMDBCreditsResponse {
  id: number;
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string; // e.g., "Trailer", "Teaser"
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

export interface TMDBImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBImagesResponse {
  id: number;
  backdrops: TMDBImage[];
  logos: TMDBImage[];
  posters: TMDBImage[];
  stills?: TMDBImage[]; // For TV images (e.g. episode stills)
}

export interface TMDBKeyword {
  id: number;
  name: string;
}

export interface TMDBKeywordsResponse {
  id?: number; // Movie keywords have id, TV keywords have results directly
  keywords?: TMDBKeyword[]; // For movies
  results?: TMDBKeyword[]; // For TV
}

export interface TMDBExternalIdsResponse {
  imdb_id: string | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  // Add other IDs as needed e.g. tvdb_id for TV
  tvdb_id?: number | null; 
}

export interface TMDBCollectionInfo {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface TMDBCollectionDetails extends TMDBCollectionInfo {
  overview: string;
  parts: TMDBMedia[]; // Simplified, TMDBMedia should cover basic movie info
}

export const getTrending = async (): Promise<TMDBMedia[]> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/trending/all/day?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 } // Revalidate once per hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending data');
    }
    
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending data:', error);
    return [];
  }
};

export const getPopularCelebrities = async (): Promise<TMDBPerson[]> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/person/popular?language=en-US&page=1`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 } // Revalidate once per hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular celebrities');
    }
    
    const data: TMDBPersonResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular celebrities:', error);
    return [];
  }
};

export const getMovieDetails = async (id: number): Promise<TMDBMovieDetails | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    const data: TMDBMovieDetails = await response.json();
    return { ...data, media_type: 'movie' };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const getTVDetails = async (id: number): Promise<TMDBTVDetails | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch TV details');
    }
    
    const data: TMDBTVDetails = await response.json();
    return { ...data, media_type: 'tv' };
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-poster.jpg'; // You'll need to add this placeholder image
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Function to get year from release_date or first_air_date
export const getYear = (media: TMDBMedia): string => {
  const date = media.release_date || media.first_air_date;
  if (!date) return '';
  return new Date(date).getFullYear().toString();
};

// Function to get title from title or name
export const getTitle = (media: TMDBMedia): string => {
  return media.title || media.name || 'Unknown';
};

// Function to format runtime
export const formatRuntime = (runtime: number): string => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

// Function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getMovieReleaseDates = async (id: number): Promise<TMDBReleaseDatesResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/release_dates`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 } // Revalidate once per day
    });
    if (!response.ok) {
      console.error('Failed to fetch movie release dates, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie release dates:', error);
    return null;
  }
};

export const getTVContentRatings = async (id: number): Promise<TMDBContentRatingsResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/content_ratings`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 } // Revalidate once per day
    });
    if (!response.ok) {
      console.error('Failed to fetch TV content ratings, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV content ratings:', error);
    return null;
  }
};

export const getMovieCredits = async (id: number): Promise<TMDBCreditsResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/credits?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch movie credits, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return null;
  }
};

export const getTVAggregateCredits = async (id: number): Promise<TMDBCreditsResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/aggregate_credits?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch TV aggregate credits, status:', response.status);
      return null;
    }
    // The aggregate_credits endpoint nests crew under 'crew' and cast under 'cast'
    // which matches TMDBCreditsResponse structure.
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV aggregate credits:', error);
    return null;
  }
};

export const getMovieVideos = async (id: number): Promise<TMDBVideosResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/videos?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 6 } // Revalidate every 6 hours
    });
    if (!response.ok) {
      console.error('Failed to fetch movie videos, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return null;
  }
};

export const getTVVideos = async (id: number): Promise<TMDBVideosResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/videos?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 6 }
    });
    if (!response.ok) {
      console.error('Failed to fetch TV videos, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV videos:', error);
    return null;
  }
};

export const getMovieImages = async (id: number): Promise<TMDBImagesResponse | null> => {
  try {
    // We can specify include_image_language to get localized images if needed, e.g. include_image_language=en,null
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/images`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch movie images, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie images:', error);
    return null;
  }
};

export const getTVImages = async (id: number): Promise<TMDBImagesResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/images`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch TV images, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV images:', error);
    return null;
  }
};

export const getMovieKeywords = async (id: number): Promise<TMDBKeywordsResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/keywords`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 } 
    });
    if (!response.ok) {
      console.error('Failed to fetch movie keywords, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie keywords:', error);
    return null;
  }
};

export const getTVKeywords = async (id: number): Promise<TMDBKeywordsResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/keywords`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 } 
    });
    if (!response.ok) {
      console.error('Failed to fetch TV keywords, status:', response.status);
      return null;
    }
    return await response.json(); // TV keywords response has 'results' array directly
  } catch (error) {
    console.error('Error fetching TV keywords:', error);
    return null;
  }
};

export const getMovieExternalIds = async (id: number): Promise<TMDBExternalIdsResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/external_ids`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 * 7 } // Revalidate weekly
    });
    if (!response.ok) {
      console.error('Failed to fetch movie external IDs, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie external IDs:', error);
    return null;
  }
};

export const getTVExternalIds = async (id: number): Promise<TMDBExternalIdsResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/external_ids`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 * 7 }
    });
    if (!response.ok) {
      console.error('Failed to fetch TV external IDs, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV external IDs:', error);
    return null;
  }
};

export const getCollectionDetails = async (collectionId: number): Promise<TMDBCollectionDetails | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/collection/${collectionId}?language=en-US`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch collection details, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching collection details:', error);
    return null;
  }
};

export const getMovieRecommendations = async (id: number, page: number = 1): Promise<TMDBResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/recommendations?language=en-US&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch movie recommendations, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return null;
  }
};

export const getTVRecommendations = async (id: number, page: number = 1): Promise<TMDBResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/recommendations?language=en-US&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch TV recommendations, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV recommendations:', error);
    return null;
  }
};

export const getMovieSimilar = async (id: number, page: number = 1): Promise<TMDBResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/similar?language=en-US&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch similar movies, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return null;
  }
};

export const getTVSimilar = async (id: number, page: number = 1): Promise<TMDBResponse | null> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}/similar?language=en-US&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      next: { revalidate: 3600 * 24 }
    });
    if (!response.ok) {
      console.error('Failed to fetch similar TV shows, status:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching similar TV shows:', error);
    return null;
  }
};