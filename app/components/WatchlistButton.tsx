'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkSimple } from '@phosphor-icons/react';
import { useAuth } from '../utils/auth-provider';
import { useWatchlist } from '../utils/watchlist-provider';
import { useToast } from './Toast';
import type { TMDBMedia } from '../utils/tmdb-api';

interface WatchlistButtonProps {
  media: TMDBMedia;
  size?: 'sm' | 'md';
}

export default function WatchlistButton({ media, size = 'md' }: WatchlistButtonProps) {
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { showToast } = useToast();
  const router = useRouter();

  const inWatchlist = isInWatchlist(media.id);
  const iconSize = size === 'sm' ? 18 : 20;

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        router.push('/signin');
        return;
      }

      try {
        await toggleWatchlist(media);
        showToast(
          inWatchlist ? 'Removed from Watchlist' : 'Added to Watchlist'
        );
      } catch {
        showToast('Something went wrong', 'error');
      }
    },
    [user, router, toggleWatchlist, media, inWatchlist, showToast]
  );

  return (
    <button
      onClick={handleClick}
      className={`watchlist-btn ${size === 'sm' ? 'watchlist-btn-sm' : ''}`}
      aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <BookmarkSimple
        size={iconSize}
        weight={inWatchlist ? 'fill' : 'regular'}
        className={inWatchlist ? 'text-accent' : 'text-white'}
      />
    </button>
  );
}
