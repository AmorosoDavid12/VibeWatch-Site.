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