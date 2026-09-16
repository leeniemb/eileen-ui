import { useEffect, useState } from 'react';

/**
 * True when the device's primary pointer is coarse (touch), matching CSS's
 * `(pointer: coarse)`. A mouse/trackpad reports `fine` even on a touch-
 * capable laptop, so this reflects how the user is actually pointing right
 * now rather than what the hardware merely supports.
 */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    setCoarse(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return coarse;
}
