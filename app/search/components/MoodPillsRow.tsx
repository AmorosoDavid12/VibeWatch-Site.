'use client';

import { MOODS } from '../../config/moods';
import { MOOD_ICON_MAP } from '../../config/mood-icons';
import { useDragScroll } from '../hooks/useDragScroll';

interface MoodPillsRowProps {
  activeMood: string | null;
  onMoodChange: (moodId: string | null) => void;
}

export default function MoodPillsRow({ activeMood, onMoodChange }: MoodPillsRowProps) {
  const { ref, onPointerDown, onClickCapture } = useDragScroll();

  return (
    <div>
      <p className="filter-label">How are you feeling?</p>
      <div
        className="filter-row"
        ref={ref}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {MOODS.map((mood) => {
          const IconComponent = MOOD_ICON_MAP[mood.icon];
          return (
            <button
              key={mood.id}
              onClick={() => onMoodChange(activeMood === mood.id ? null : mood.id)}
              className={`chip chip-mood ${activeMood === mood.id ? 'chip-active' : ''}`}
              style={{ '--mood-color': mood.color } as React.CSSProperties}
            >
              {IconComponent && (
                <IconComponent
                  size={16}
                  weight={activeMood === mood.id ? 'fill' : 'duotone'}
                  style={{ color: mood.color }}
                />
              )}
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
