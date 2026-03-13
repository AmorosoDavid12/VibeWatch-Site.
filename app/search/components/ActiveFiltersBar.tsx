'use client';

import { MOODS } from '../../config/moods';

interface ActiveFiltersBarProps {
  activeMood: string | null;
  activeGenre: number | null;
  activeDecade: string | null;
  activeRating: number | null;
  activeCollectionTitle: string | null;
  genreNames: Record<number, string>;
  onRemoveMood: () => void;
  onRemoveGenre: () => void;
  onRemoveDecade: () => void;
  onRemoveRating: () => void;
  onRemoveCollection: () => void;
  onClearAll: () => void;
}

export default function ActiveFiltersBar({
  activeMood,
  activeGenre,
  activeDecade,
  activeRating,
  activeCollectionTitle,
  genreNames,
  onRemoveMood,
  onRemoveGenre,
  onRemoveDecade,
  onRemoveRating,
  onRemoveCollection,
  onClearAll,
}: ActiveFiltersBarProps) {
  const hasFilters = activeMood || activeGenre !== null || activeDecade || activeRating || activeCollectionTitle;
  if (!hasFilters) return null;

  const moodConfig = activeMood ? MOODS.find(m => m.id === activeMood) : null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-tertiary font-medium mr-1">Filters:</span>

      {activeCollectionTitle && (
        <button onClick={onRemoveCollection} className="chip chip-active chip-removable text-xs">
          {activeCollectionTitle}
          <span className="chip-x">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}

      {moodConfig && (
        <button onClick={onRemoveMood} className="chip chip-active chip-removable text-xs">
          {moodConfig.label}
          <span className="chip-x">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}

      {activeGenre !== null && (
        <button onClick={onRemoveGenre} className="chip chip-active chip-removable text-xs">
          {genreNames[activeGenre] || `Genre ${activeGenre}`}
          <span className="chip-x">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}

      {activeDecade && (
        <button onClick={onRemoveDecade} className="chip chip-active chip-removable text-xs">
          {activeDecade}
          <span className="chip-x">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}

      {activeRating && (
        <button onClick={onRemoveRating} className="chip chip-active chip-removable text-xs">
          {activeRating}+ Rating
          <span className="chip-x">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}

      <button
        onClick={onClearAll}
        className="text-xs text-search min-h-[44px] px-2 flex items-center"
      >
        Clear all
      </button>
    </div>
  );
}
