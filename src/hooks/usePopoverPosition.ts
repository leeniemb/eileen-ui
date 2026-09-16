import { useLayoutEffect, useRef, useState } from 'react';

export interface PopoverPosition {
  top: number;
  left: number;
  placement: 'above' | 'below';
}

/**
 * Measures `anchorEl` and this hook's own popover element, and computes a
 * fixed-position placement centered under (or over) the anchor: on
 * `preferredPlacement`'s side by default, flipping to the other side when
 * there isn't room.
 */
export function usePopoverPosition(
  anchorEl: HTMLElement | null,
  preferredPlacement: 'above' | 'below' = 'below',
  gap = 8
) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  useLayoutEffect(() => {
    const anchor = anchorEl;
    const popover = popoverRef.current;
    if (!anchor || !popover) return;

    const anchorRect = anchor.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    const fitsAbove = anchorRect.top - popoverRect.height - gap >= 0;
    const fitsBelow = anchorRect.bottom + popoverRect.height + gap <= window.innerHeight;
    const placement: 'above' | 'below' =
      preferredPlacement === 'above' ? (fitsAbove ? 'above' : 'below') : fitsBelow ? 'below' : 'above';

    setPosition({
      top: placement === 'above' ? anchorRect.top - popoverRect.height - gap : anchorRect.bottom + gap,
      left: Math.min(
        Math.max(anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2, 8),
        window.innerWidth - popoverRect.width - 8
      ),
      placement,
    });
  }, [anchorEl, preferredPlacement, gap]);

  return { popoverRef, position };
}
