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