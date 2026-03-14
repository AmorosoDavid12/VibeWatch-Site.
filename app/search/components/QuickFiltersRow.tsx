'use client';

import { useDragScroll } from '../hooks/useDragScroll';

export type MediaType = 'all' | 'movies' | 'tv';

const MEDIA_TYPES: { label: string; value: MediaType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movies' },
  { label: 'TV Shows', value: 'tv' },
];

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
  activeMediaType: MediaType;
  activeDecade: string | null;
  activeRating: number | null;
  activeSort: string;
  onMediaTypeChange: (type: MediaType) => void;
  onDecadeChange: (decade: string | null) => void;
  onRatingChange: (rating: number | null) => void;
  onSortChange: (sort: string) => void;
}

export default function QuickFiltersRow({
  activeMediaType,
  activeDecade,
  activeRating,
  activeSort,
  onMediaTypeChange,
  onDecadeChange,
  onRatingChange,
  onSortChange,
}: QuickFiltersRowProps) {
  const media = useDragScroll();
  const decade = useDragScroll();
  const rating = useDragScroll();
  const sort = useDragScroll();

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {/* Media type filter */}
      <div className="flex-shrink-0 min-w-0 w-full md:w-auto">
        <p className="filter-label mb-1.5">Type</p>
        <div
          className="filter-row gap-1.5"
          ref={media.ref}
          onPointerDown={media.onPointerDown}
          onClickCapture={media.onClickCapture}
        >
          {MEDIA_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onMediaTypeChange(t.value)}
              className={`chip chip-sm ${activeMediaType === t.value ? 'chip-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decade filter */}
      <div className="flex-shrink-0 min-w-0 w-full md:w-auto">
        <p className="filter-label mb-1.5">Decade</p>
        <div
          className="filter-row gap-1.5"
          ref={decade.ref}
          onPointerDown={decade.onPointerDown}
          onClickCapture={decade.onClickCapture}
        >
          {DECADES.map((d) => (
            <button
              key={d.label}
              onClick={() => onDecadeChange(activeDecade === d.value ? null : d.value)}
              className={`chip chip-sm ${(d.value === null ? activeDecade === null : activeDecade === d.value) ? 'chip-active' : ''}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div className="flex-shrink-0 min-w-0 w-full md:w-auto">
        <p className="filter-label mb-1.5">Rating</p>
        <div
          className="filter-row gap-1.5"
          ref={rating.ref}
          onPointerDown={rating.onPointerDown}
          onClickCapture={rating.onClickCapture}
        >
          {RATINGS.map((r) => (
            <button
              key={r.value}
              onClick={() => onRatingChange(activeRating === r.value ? null : r.value)}
              className={`chip chip-sm ${activeRating === r.value ? 'chip-active' : ''}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex-shrink-0 min-w-0 w-full md:w-auto">
        <p className="filter-label mb-1.5">Sort by</p>
        <div
          className="filter-row gap-1.5"
          ref={sort.ref}
          onPointerDown={sort.onPointerDown}
          onClickCapture={sort.onClickCapture}
        >
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => onSortChange(s.value)}
              className={`chip chip-sm ${activeSort === s.value ? 'chip-active' : ''}`}
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
