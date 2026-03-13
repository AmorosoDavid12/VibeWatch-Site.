import type { DiscoverParams } from '../utils/tmdb-api';

export interface MoodConfig {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  movieGenreIds: number[];
  tvGenreIds: number[];
  sortBy: string;
  ratingGte?: number;
  dateGte?: string;
  dateLte?: string;
}

// Movie genre IDs: Action=28, Adventure=12, Animation=16, Comedy=35, Crime=80,
// Drama=18, Family=10751, Fantasy=14, Horror=27, Mystery=9648, Romance=10749,
// Sci-Fi=878, Thriller=53
//
// TV genre IDs: Action&Adventure=10759, Animation=16, Comedy=35, Crime=80,
// Drama=18, Family=10751, Mystery=9648, Sci-Fi&Fantasy=10765, Western=37

export const MOODS: MoodConfig[] = [
  {
    id: 'comfort',
    label: 'Comfort',
    subtitle: 'Feel-good & heartwarming',
    color: '#FFB347',
    movieGenreIds: [35, 10749, 10751],
    tvGenreIds: [35, 10751, 18],
    sortBy: 'popularity.desc',
    ratingGte: 6.5,
  },
  {
    id: 'intense',
    label: 'Intense',
    subtitle: 'Edge-of-your-seat thrills',
    color: '#E74C3C',
    movieGenreIds: [53, 28],
    tvGenreIds: [10759, 80],
    sortBy: 'popularity.desc',
  },
  {
    id: 'funny',
    label: 'Funny',
    subtitle: 'Laugh out loud',
    color: '#F1C40F',
    movieGenreIds: [35],
    tvGenreIds: [35],
    sortBy: 'popularity.desc',
  },
  {
    id: 'emotional',
    label: 'Emotional',
    subtitle: 'Stories that move you',
    color: '#9B59B6',
    movieGenreIds: [18, 10749],
    tvGenreIds: [18],
    sortBy: 'vote_average.desc',
    ratingGte: 7.0,
  },
  {
    id: 'mind-bending',
    label: 'Mind-Bending',
    subtitle: 'Twist your reality',
    color: '#1ABC9C',
    movieGenreIds: [878, 9648],
    tvGenreIds: [10765, 9648],
    sortBy: 'popularity.desc',
    ratingGte: 7.0,
  },
  {
    id: 'chill',
    label: 'Chill',
    subtitle: 'Easy watching, no stress',
    color: '#3498DB',
    movieGenreIds: [16, 35, 10751],
    tvGenreIds: [16, 35, 10751],
    sortBy: 'popularity.desc',
  },
  {
    id: 'date-night',
    label: 'Date Night',
    subtitle: 'Romance & chemistry',
    color: '#E91E63',
    movieGenreIds: [10749],
    tvGenreIds: [18],
    sortBy: 'popularity.desc',
    ratingGte: 6.5,
  },
  {
    id: 'dark-gritty',
    label: 'Dark & Gritty',
    subtitle: 'Raw & unfiltered',
    color: '#2C3E50',
    movieGenreIds: [80, 18, 53],
    tvGenreIds: [80, 18],
    sortBy: 'popularity.desc',
    ratingGte: 7.0,
  },
  {
    id: 'epic-adventure',
    label: 'Epic Adventure',
    subtitle: 'Grand quests & journeys',
    color: '#E67E22',
    movieGenreIds: [12, 14],
    tvGenreIds: [10759, 10765],
    sortBy: 'popularity.desc',
  },
  {
    id: 'nostalgia',
    label: 'Nostalgia',
    subtitle: 'Classics from the past',
    color: '#D4A574',
    movieGenreIds: [],
    tvGenreIds: [],
    sortBy: 'vote_average.desc',
    ratingGte: 7.0,
    dateGte: '1980-01-01',
    dateLte: '1999-12-31',
  },
  {
    id: 'sci-fi-future',
    label: 'Sci-Fi & Future',
    subtitle: 'Tomorrow\'s worlds today',
    color: '#00BCD4',
    movieGenreIds: [878],
    tvGenreIds: [10765],
    sortBy: 'popularity.desc',
  },
  {
    id: 'horror',
    label: 'Horror',
    subtitle: 'Fear & the unknown',
    color: '#8B0000',
    movieGenreIds: [27],
    tvGenreIds: [9648],
    sortBy: 'popularity.desc',
  },
];

export function buildDiscoverParams(
  mood: MoodConfig,
  type: 'movie' | 'tv'
): DiscoverParams {
  const genreIds = type === 'movie' ? mood.movieGenreIds : mood.tvGenreIds;

  return {
    with_genres: genreIds.length > 0 ? genreIds.join('|') : undefined,
    sort_by: mood.sortBy,
    voteAverageGte: mood.ratingGte,
    dateGte: mood.dateGte,
    dateLte: mood.dateLte,
  };
}
