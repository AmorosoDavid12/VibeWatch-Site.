import { useRef, useCallback } from 'react';

const DRAG_THRESHOLD = 6;

/**
 * Adds mouse-drag-to-scroll on horizontally scrollable containers.
 * Touch devices use native overflow scroll — this only activates for mouse.
 *
 * Returns: { ref, onPointerDown, onClickCapture } — spread the handlers onto
 * the same element you attach `ref` to.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const didDrag = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;

    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;

    const onMove = (ev: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = ev.clientX - startX.current;
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        if (!didDrag.current) {
          didDrag.current = true;
          el.style.cursor = 'grabbing';
          el.style.userSelect = 'none';
        }
        el.scrollLeft = scrollStart.current - dx;
      }
    };

    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.style.cursor = '';
      el.style.userSelect = '';
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, []);

  // Suppress child clicks that were actually drags
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
      didDrag.current = false;
    }
  }, []);

  return { ref, onPointerDown, onClickCapture };
}
