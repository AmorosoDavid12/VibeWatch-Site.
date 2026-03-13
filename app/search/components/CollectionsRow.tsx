'use client';

import { useRef, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { COLLECTIONS, type CollectionConfig } from '../../config/collections';

const DRAG_THRESHOLD = 6;

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
              return (
                <div key={`${col.id}-${idx}`} className="flex-shrink-0 px-1.5 md:px-2">
                  <button
                    onClick={() => onCollectionClick(col)}
                    className="collection-card md:!min-w-[220px]"
                    style={{
                      background: `linear-gradient(135deg, ${col.gradient[0]}, ${col.gradient[1]})`,
                    }}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-accent/30 z-[1]" />
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent z-[2]" />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 z-[3]">
                      <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                        {col.title}
                      </h3>
                      <p className="text-white/70 text-xs mt-0.5 leading-snug">
                        {col.description}
                      </p>
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
