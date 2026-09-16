import { useEffect, useRef } from 'react';

type ElRef = { current: HTMLElement | null };

/**
 * Calls `onDismiss` on a pointerdown outside every element in `refs`, or on
 * Escape. Each ref's `.current` is read fresh when the event fires rather
 * than captured as a dependency, so passing a fresh array/callback each
 * render (the normal case for inline refs and closures) never causes the
 * listener to be needlessly torn down and rebuilt.
 */
export function useDismissOnOutsideOrEscape(refs: ElRef[], onDismiss: () => void, active = true) {
  const refsRef = useRef(refs);
  refsRef.current = refs;
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!active) return;

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (refsRef.current.some((ref) => ref.current?.contains(target))) return;
      onDismissRef.current();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismissRef.current();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);
}
