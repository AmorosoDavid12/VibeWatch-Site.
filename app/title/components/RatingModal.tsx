'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TMDBMovieDetails, TMDBTVDetails, getImageUrl, getTitle, getYear } from '../../utils/tmdb-api';
import { addToWatchedList } from '../../utils/watchlist';
import { useAuth } from '../../utils/auth-provider';

type MediaDetails = TMDBMovieDetails | TMDBTVDetails;

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaDetails;
  mediaType: 'movie' | 'tv';
  onSubmitRating: (rating: number) => void;
  initialRating?: number; // Optional initial rating (e.g., if already rated)
}

const StarIcon = ({
  fillLevel,
  starNumber,
  onStarHover,
  onStarClick,
  onMouseLeave,
  onMouseDown,
  overrideFillColor
}: {
  fillLevel: number; // 0 = empty, 0.5 = half, 1 = full
  starNumber: number;
  onStarHover?: (rating: number) => void;
  onStarClick?: (rating: number) => void;
  onMouseLeave?: () => void;
  onMouseDown?: (rating: number) => void;
  overrideFillColor?: string;
}) => {
  const getRatingFromPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    return isLeftHalf ? starNumber - 0.5 : starNumber;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rating = getRatingFromPosition(e);
    onStarHover?.(rating);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rating = getRatingFromPosition(e);
    onStarClick?.(rating);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rating = getRatingFromPosition(e);
    onMouseDown?.(rating);
  };

  return (
    <div
      className="relative w-10 h-10 cursor-pointer transition-all duration-200 hover:scale-110 select-none"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={handleMouseDown}
    >
      {/* Background star (empty) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="gray"
        className="absolute inset-0 w-10 h-10"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>

      {/* Filled portion */}
      {fillLevel > 0 && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillLevel * 100}%` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={overrideFillColor || "#8c52ff"}
            className="w-10 h-10"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default function RatingModal({ isOpen, onClose, media, mediaType, onSubmitRating, initialRating = 0 }: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setSelectedRating(initialRating);
  }, [initialRating, isOpen]);

  // Add global mouse up listener to handle drag end
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedRating > 0 && user) {
      onSubmitRating(selectedRating);
      const success = await addToWatchedList(user.id, media, selectedRating);
      if (!success) {
        console.error("Failed to add item to watched list");
      }
      onClose();
    } else if (!user) {
      console.error("User not logged in. Cannot add to watched list.");
      onClose();
    }
  };

  const mediaTitle = getTitle(media);
  const mediaYear = getYear(media);
  // For our modal, we use 1-10. The screenshot shows X.Y / 10 for TMDB
  const displayTmdbRating = media.vote_average ? media.vote_average.toFixed(1) + "/10" : "N/A";

  // Determine if this is a new rating or updating existing rating
  const isUpdating = initialRating > 0;
  const modalTitle = isUpdating ? "Update Rating" : `Rate ${mediaTitle}`;
  const buttonText = isUpdating ? "Update" : "Rate";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStarHover = (rating: number) => {
    if (isDragging) {
      setSelectedRating(rating);
    } else {
      setHoverRating(rating);
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleMouseDown = (rating: number) => {
    setIsDragging(true);
    setSelectedRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1e1e1e] p-8 rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-xl relative transform transition-all duration-300 ease-out scale-100 animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-semibold text-white mb-6 text-center">{modalTitle}</h2>

        <div className="flex mb-9 py-2">
          {media.poster_path && (
            <div className="w-36 h-52 relative rounded-lg overflow-hidden flex-shrink-0 mr-7 shadow-lg">
              <Image
                src={getImageUrl(media.poster_path, 'w200')}
                alt={mediaTitle}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-6 flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">{mediaTitle}</h3>
            <p className="text-base text-gray-400 mb-3">
              {mediaYear} • {mediaType === 'movie' ? 'Movie' : 'TV Show'}
            </p>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FBBF24" className="w-6 h-6">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="ml-1 mt-1 text-base text-gray-300">{displayTmdbRating} TMDB</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xl font-medium text-center text-white mb-4">Your Rating</p>
          <div className="flex justify-center space-x-2 mb-3">
            {[...Array(10)].map((_, index) => {
              const starNumber = index + 1;
              const currentRating = hoverRating || selectedRating;

              let fillLevel = 0;
              if (currentRating >= starNumber) {
                fillLevel = 1; // Full star
              } else if (currentRating >= starNumber - 0.5) {
                fillLevel = 0.5; // Half star
              }

              return (
                <StarIcon
                  key={starNumber}
                  fillLevel={fillLevel}
                  starNumber={starNumber}
                  onStarHover={handleStarHover}
                  onStarClick={handleStarClick}
                  onMouseLeave={handleMouseLeave}
                  onMouseDown={handleMouseDown}
                />
              );
            })}
          </div>
          {selectedRating > 0 && (
            <p className="text-center text-2xl font-semibold text-[#8c52ff] mb-2">{selectedRating}/10</p>
          )}
          <p className="text-sm text-center text-gray-500">Tap or drag to adjust rating</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedRating === 0}
          className={`w-full mt-6 py-4 rounded-xl text-white text-lg font-semibold transition-all duration-200 transform hover:scale-105 ${selectedRating > 0 ? 'bg-[#8c52ff] hover:bg-[#7A48CC] shadow-lg hover:shadow-xl' : 'bg-gray-600 cursor-not-allowed'}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
} 