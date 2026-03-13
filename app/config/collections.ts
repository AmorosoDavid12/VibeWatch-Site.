import type { DiscoverParams } from '../utils/tmdb-api';

export interface CollectionConfig {
  id: string;
  title: string;
  description: string;
  gradient: [string, string];
  discoverParams: DiscoverParams;
}

export const COLLECTIONS: CollectionConfig[] = [
  {
    id: 'oscar-worthy',
    title: 'Oscar Worthy',
    description: 'Award-caliber masterpieces',
    gradient: ['#BF953F', '#FCF6BA'],
    discoverParams: {
      voteAverageGte: 8.0,
      voteCountGte: 2000,
      sort_by: 'vote_average.desc',
    },
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    description: 'Great films few have seen',
    gradient: ['#1ABC9C', '#16A085'],
    discoverParams: {
      voteAverageGte: 7.5,
      voteCountGte: 50,
      voteCountLte: 1000,
      sort_by: 'vote_average.desc',
    },
  },
  {
    id: 'based-on-true-stories',
    title: 'Based on True Stories',
    description: 'Real events, real drama',
    gradient: ['#E67E22', '#D35400'],
    discoverParams: {
      with_keywords: '9672',
      sort_by: 'popularity.desc',
    },
  },
  {
    id: '90s-classics',
    title: '90s Classics',
    description: 'The golden decade of cinema',
    gradient: ['#9B59B6', '#8E44AD'],
    discoverParams: {
      dateGte: '1990-01-01',
      dateLte: '1999-12-31',
      voteAverageGte: 7.0,
      voteCountGte: 500,
      sort_by: 'vote_average.desc',
    },
  },
  {
    id: 'action-blockbusters',
    title: 'Action Blockbusters',
    description: 'High-octane thrills',
    gradient: ['#E50914', '#B71C1C'],
    discoverParams: {
      with_genres: '28',
      voteCountGte: 2000,
      sort_by: 'popularity.desc',
    },
  },
  {
    id: 'international-cinema',
    title: 'International Cinema',
    description: 'The best from around the world',
    gradient: ['#2980B9', '#3498DB'],
    discoverParams: {
      with_original_language: 'ko|ja|fr|es|hi|de|it|zh|pt|th',
      voteAverageGte: 7.0,
      voteCountGte: 100,
      sort_by: 'vote_average.desc',
    },
  },
  {
    id: 'comfort-rewatches',
    title: 'Comfort Rewatches',
    description: 'Familiar favorites to enjoy again',
    gradient: ['#FFB347', '#FF8C42'],
    discoverParams: {
      with_genres: '35|10751',
      voteAverageGte: 7.0,
      voteCountGte: 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    id: 'animated-worlds',
    title: 'Animated Worlds',
    description: 'The finest in animation',
    gradient: ['#8E44AD', '#3498DB'],
    discoverParams: {
      with_genres: '16',
      voteAverageGte: 7.0,
      voteCountGte: 500,
      sort_by: 'vote_average.desc',
    },
  },
];
