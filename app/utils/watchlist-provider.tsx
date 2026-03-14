'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './auth-provider';
import { supabase } from './supabase';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from './watchlist';
import type { TMDBMedia } from './tmdb-api';

type WatchlistContextType = {
  watchlistIds: Set<number>;
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (media: TMDBMedia) => Promise<void>;
  isLoading: boolean;
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const togglingRef = useRef<Set<number>>(new Set());

  // Fetch all watchlist IDs when user changes
  useEffect(() => {
    if (!user) {
      setWatchlistIds(new Set());
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    getWatchlist(user.id).then((items) => {
      if (cancelled) return;
      const ids = new Set(items.map((item) => item.id as number));
      setWatchlistIds(ids);
      setIsLoading(false);
    });

    // Subscribe to realtime changes for cross-tab sync
    const subscription = supabase
      .channel('watchlist_provider_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_items', filter: `user_id=eq.${user.id}` },
        (payload) => {
          // Only react to watchlist type changes
          const record = (payload.new as Record<string, unknown>) || (payload.old as Record<string, unknown>);
          if (record?.type !== 'watchlist') return;

          // Skip if we're currently toggling (we already updated optimistically)
          const value = record?.value as string | undefined;
          if (value) {
            try {
              const parsed = JSON.parse(value);
              if (togglingRef.current.has(parsed.id)) return;
            } catch { /* ignore */ }
          }

          // Re-fetch to stay in sync
          getWatchlist(user.id).then((items) => {
            if (cancelled) return;
            setWatchlistIds(new Set(items.map((item) => item.id as number)));
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [user]);

  const isInWatchlistFn = useCallback(
    (id: number) => watchlistIds.has(id),
    [watchlistIds]
  );

  const toggleWatchlist = useCallback(
    async (media: TMDBMedia) => {
      if (!user) return;

      const mediaId = media.id;
      const wasInWatchlist = watchlistIds.has(mediaId);

      // Mark as toggling to skip realtime echo
      togglingRef.current.add(mediaId);

      // Optimistic update
      setWatchlistIds((prev) => {
        const next = new Set(prev);
        if (wasInWatchlist) {
          next.delete(mediaId);
        } else {
          next.add(mediaId);
        }
        return next;
      });

      try {
        let success: boolean;
        if (wasInWatchlist) {
          success = await removeFromWatchlist(user.id, mediaId);
        } else {
          success = await addToWatchlist(user.id, media);
        }

        if (!success) {
          // Revert on failure
          setWatchlistIds((prev) => {
            const next = new Set(prev);
            if (wasInWatchlist) {
              next.add(mediaId);
            } else {
              next.delete(mediaId);
            }
            return next;
          });
          throw new Error('Failed to update watchlist');
        }
      } finally {
        togglingRef.current.delete(mediaId);
      }
    },
    [user, watchlistIds]
  );

  return (
    <WatchlistContext.Provider value={{ watchlistIds, isInWatchlist: isInWatchlistFn, toggleWatchlist, isLoading }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
