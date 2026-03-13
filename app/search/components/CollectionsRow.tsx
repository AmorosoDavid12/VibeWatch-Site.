'use client';

import { useRef, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import {
  Trophy,
  Diamond,
  Scroll,
  FilmReel,
  Lightning,
  GlobeHemisphereWest,
  Couch,
  MagicWand,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { COLLECTIONS, type CollectionConfig } from '../../config/collections';

const DRAG_THRESHOLD = 6;

const ICON_MAP: Record<string, Icon> = {
  'trophy': Trophy,
  'diamond': Diamond,
  'scroll': Scroll,
  'film-reel': FilmReel,
  'lightning': Lightning,
  'globe-hemisphere-west': GlobeHemisphereWest,
  'couch': Couch,
  'magic-wand': MagicWand,
};

interface CollectionsRowProps {
  activeCollectionId?: string | null;
  onCollectionClick: (collection: CollectionConfig) => void;
}

export default function CollectionsRow({ activeCollectionId, onCollectionClick }: CollectionsRowProps) {
  const startPos = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    [AutoScroll({ speed: 0.4, startDelay: 1000, stopOnInteraction: false })]
  );

  const setRef = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    emblaRef(node);
  }, [emblaRef]);

  // Grab cursor while dragging
  useEffect(() => {
    if (!emblaApi) return;
    const onDown = () => viewportRef.current?.classList.add('is-dragging');
    const onUp = () => viewportRef.current?.classList.remove('is-dragging');
    emblaApi.on('pointerDown', onDown);
    emblaApi.on('pointerUp', onUp);
    return () => {
      emblaApi.off('pointerDown', onDown);
      emblaApi.off('pointerUp', onUp);
    };
  }, [emblaApi]);

  // Pause on hover
  useEffect(() => {
    if (!emblaApi) return;
    const wrapper = viewportRef.current?.parentElement;
    if (!wrapper) return;
    const onEnter = () => emblaApi.plugins()?.autoScroll?.stop();
    const onLeave = () => emblaApi.plugins()?.autoScroll?.play();
    wrapper.addEventListener('mouseenter', onEnter);
    wrapper.addEventListener('mouseleave', onLeave);
    return () => {
      wrapper.removeEventListener('mouseenter', onEnter);
      wrapper.removeEventListener('mouseleave', onLeave);
    };
  }, [emblaApi]);

  // Drag vs click detection
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <section>
      <h2 className="text-lg md:text-xl font-semibold text-primary mb-3">Collections</h2>
      <div className="scroll-row-mask">
        <div className="embla-viewport overflow-hidden cursor-grab" ref={setRef}>
          <div
            className="flex"
            onPointerDown={handlePointerDown}
            onClickCapture={handleClickCapture}
          >
            {/* Render twice so Embla has enough slides to loop without overlapping */}
            {[...COLLECTIONS, ...COLLECTIONS].map((col, idx) => {
              const isActive = activeCollectionId === col.id;
              const IconComponent = ICON_MAP[col.icon];

              return (
                <div key={`${col.id}-${idx}`} className="flex-shrink-0 px-1.5 md:px-2">
                  <button
                    onClick={() => onCollectionClick(col)}
                    className={`collection-card md:!min-w-[220px] ${isActive ? 'collection-card-active' : ''}`}
                    style={{
                      background: `linear-gradient(140deg, ${col.gradient[0]} 0%, ${col.gradient[1]} 100%)`,
                    }}
                  >
                    {/* Top-left light source */}
                    <div
                      className="absolute inset-0 z-[1] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at 15% 10%, rgba(255,255,255,0.18) 0%, transparent 55%)',
                      }}
                    />

                    {/* Bottom vignette for text readability */}
                    <div
                      className="absolute inset-0 z-[2] pointer-events-none"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                      }}
                    />

                    {/* Decorative icon — right-center, rotated, semi-transparent */}
                    {IconComponent && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-2.5 z-[3] pointer-events-none opacity-[0.28] rotate-[-8deg]">
                        <IconComponent size={64} weight="duotone" color="white" />
                      </div>
                    )}

                    {/* Active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-accent/20 z-[4]" />
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent z-[5]" />
                    )}

                    {/* Title — bottom-left with text shadow */}
                    <div className="absolute inset-0 flex items-end p-3 md:p-3.5 z-[6]">
                      <h3
                        className="text-white font-bold text-[13px] md:text-sm leading-tight tracking-[0.01em]"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                      >
                        {col.title}
                      </h3>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
