'use client';

import { useDragScroll } from '../hooks/useDragScroll';

const DECADES = [
  { label: 'All', value: null },
  { label: "'70s", value: '1970s' },
  { label: "'80s", value: '1980s' },
  { label: "'90s", value: '1990s' },
  { label: '2000s', value: '2000s' },
  { label: '2010s', value: '2010s' },
  { label: '2020s', value: '2020s' },
];

const RATINGS = [
  { label: '6+', value: 6 },
  { label: '7+', value: 7 },
  { label: '8+', value: 8 },
];

const SORTS = [
  { label: 'Trending', value: 'popularity.desc' },
  { label: 'Top Rated', value: 'vote_average.desc' },
  { label: 'New Releases', value: 'primary_release_date.desc' },
];

interface QuickFiltersRowProps {
  activeDecade: string | null;
  activeRating: number | null;
  activeSort: string;
  onDecadeChange: (decade: string | null) => void;
  onRatingChange: (rating: number | null) => void;
  onSortChange: (sort: string) => void;
}

export default function QuickFiltersRow({
  activeDecade,
  activeRating,
  activeSort,
  onDecadeChange,
  onRatingChange,
  onSortChange,
}: QuickFiltersRowProps) {
  const decade = useDragScroll();
  const rating = useDragScroll();
  const sort = useDragScroll();

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {/* Decade filter */}
      <div className="flex-shrink-0">
        <p className="filter-label">Decade</p>
        <div
          className="filter-row"
          ref={decade.ref}
          onPointerDown={decade.onPointerDown}
          onClickCapture={decade.onClickCapture}
        >
          {DECADES.map((d) => (
            <button
              key={d.label}
              onClick={() => onDecadeChange(activeDecade === d.value ? null : d.value)}
              className={`chip ${(d.value === null ? activeDecade === null : activeDecade === d.value) ? 'chip-active' : ''}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div className="flex-shrink-0">
        <p className="filter-label">Rating</p>
        <div
          className="filter-row"
          ref={rating.ref}
          onPointerDown={rating.onPointerDown}
          onClickCapture={rating.onClickCapture}
        >
          {RATINGS.map((r) => (
            <button
              key={r.value}
              onClick={() => onRatingChange(activeRating === r.value ? null : r.value)}
              className={`chip ${activeRating === r.value ? 'chip-active' : ''}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex-shrink-0">
        <p className="filter-label">Sort by</p>
        <div
          className="filter-row"
          ref={sort.ref}
          onPointerDown={sort.onPointerDown}
          onClickCapture={sort.onClickCapture}
        >
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => onSortChange(s.value)}
              className={`chip ${activeSort === s.value ? 'chip-active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Utility to convert decade string to date range
export function decadeToDateRange(decade: string | null): { gte?: string; lte?: string } {
  if (!decade) return {};
  const startYear = parseInt(decade.replace('s', ''));
  return {
    gte: `${startYear}-01-01`,
    lte: `${startYear + 9}-12-31`,
  };
}
