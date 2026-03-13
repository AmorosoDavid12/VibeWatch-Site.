import type { DiscoverParams } from '../utils/tmdb-api';

export interface CollectionConfig {
  id: string;
  title: string;
  icon: string;
  gradient: [string, string];
  discoverParams: DiscoverParams;
}

export const COLLECTIONS: CollectionConfig[] = [
  {
    id: 'oscar-worthy',
    title: 'Oscar Worthy',
    icon: 'trophy',
    gradient: ['#A07B28', '#D4A843'],
    discoverParams: {
      voteAverageGte: 8.0,
      voteCountGte: 2000,
      sort_by: 'vote_average.desc',
    },
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    icon: 'diamond',
    gradient: ['#0E8A6F', '#17B890'],
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
    icon: 'scroll',
    gradient: ['#C45E10', '#E07820'],
    discoverParams: {
      with_keywords: '9672',
      sort_by: 'popularity.desc',
    },
  },
  {
    id: '90s-classics',
    title: '90s Classics',
    icon: 'film-reel',
    gradient: ['#7B3FA0', '#A855C8'],
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
    icon: 'lightning',
    gradient: ['#B80710', '#E50914'],
    discoverParams: {
      with_genres: '28',
      voteCountGte: 2000,
      sort_by: 'popularity.desc',
    },
  },
  {
    id: 'international-cinema',
    title: 'International Cinema',
    icon: 'globe-hemisphere-west',
    gradient: ['#1A5F8A', '#2980B9'],
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
    icon: 'couch',
    gradient: ['#D48020', '#F0A030'],
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
    icon: 'magic-wand',
    gradient: ['#6A30A0', '#3080C0'],
    discoverParams: {
      with_genres: '16',
      voteAverageGte: 7.0,
      voteCountGte: 500,
      sort_by: 'vote_average.desc',
    },
  },
];
