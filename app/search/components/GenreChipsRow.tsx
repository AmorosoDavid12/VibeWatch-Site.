'use client';

import { useEffect, useState } from 'react';
import { getMovieGenres, type TMDBGenre } from '../../utils/tmdb-api';
import { useDragScroll } from '../hooks/useDragScroll';

interface GenreChipsRowProps {
  activeGenre: number | null;
  onGenreChange: (genre: number | null) => void;
}

export default function GenreChipsRow({ activeGenre, onGenreChange }: GenreChipsRowProps) {
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const { ref, onPointerDown, onClickCapture } = useDragScroll();

  useEffect(() => {
    getMovieGenres().then(setGenres);
  }, []);

  const toggleGenre = (genreId: number) => {
    onGenreChange(activeGenre === genreId ? null : genreId);
  };

  if (genres.length === 0) return null;

  return (
    <div>
      <p className="filter-label">Genres</p>
      <div
        className="filter-row"
        ref={ref}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => toggleGenre(genre.id)}
            className={`chip ${activeGenre === genre.id ? 'chip-active' : ''}`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
