import { forwardRef, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, MouseEvent, PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon, XIcon } from '../../icons';
import { usePopoverPosition } from '../../hooks/usePopoverPosition';
import { useDismissOnOutsideOrEscape } from '../../hooks/useDismissOnOutsideOrEscape';

export interface ColorChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'onClick'> {
  /** Hex color. Omit to render the "add a color" variant. */
  color?: string;
  /** Shows a remove (x) badge on hover, plus a long-press (touch) /
   * right-click (mouse, keyboard via Shift+F10 or the Menu key) menu with a
   * Remove item -- the badge alone is unreachable without hover. */
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  /** Highlights the chip (e.g. while its picker is open). */
  active?: boolean;
}

const LONG_PRESS_MS = 500;

export const ColorChip = forwardRef<HTMLDivElement, ColorChipProps>(
  ({ color, removable, onRemove, onClick, active, className = '', ...props }, ref) => {
    const isAdd = !color;
    const canRemove = !isAdd && removable;
    const style: CSSProperties | undefined = color ? { backgroundColor: color } : undefined;

    const swatchRef = useRef<HTMLButtonElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const pressTimer = useRef<number | null>(null);
    const suppressClick = useRef(false);

    const { popoverRef, position } = usePopoverPosition(swatchRef.current, 'below', 4);
    useDismissOnOutsideOrEscape([popoverRef], () => setMenuOpen(false), menuOpen);

    function clearPressTimer() {
      if (pressTimer.current != null) {
        window.clearTimeout(pressTimer.current);
        pressTimer.current = null;
      }
    }

    function handlePointerDown(e: PointerEvent<HTMLButtonElement>) {
      // Mouse already has the hover badge and right-click; a timed hold
      // there would just make normal clicks feel unreliable.
      if (!canRemove || e.pointerType === 'mouse') return;
      suppressClick.current = false;
      pressTimer.current = window.setTimeout(() => {
        suppressClick.current = true;
        setMenuOpen(true);
      }, LONG_PRESS_MS);
    }

    function handleContextMenu(e: MouseEvent<HTMLButtonElement>) {
      if (!canRemove) return;
      e.preventDefault();
      setMenuOpen(true);
    }

    function handleClick() {
      if (suppressClick.current) {
        suppressClick.current = false;
        return;
      }
      onClick?.();
    }

    return (
      <div ref={ref} className={`group relative inline-flex h-6 w-6 shrink-0 ${className}`}>
        <button
          ref={swatchRef}
          type="button"
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={clearPressTimer}
          onPointerLeave={clearPressTimer}
          onPointerCancel={clearPressTimer}
          onContextMenu={handleContextMenu}
          style={style}
          className={[
            'h-6 w-6 rounded-full border transition-transform hover:scale-110 active:scale-95',
            active ? 'ring-2 ring-[var(--eileen-accent)] ring-offset-2' : '',
            isAdd
              ? 'flex items-center justify-center border-[var(--eileen-text)] bg-white text-[var(--eileen-text)] hover:bg-meringue'
              : 'border-[rgba(23,23,23,0.1)]',
          ].join(' ')}
          {...props}
        >
          {isAdd && <PlusIcon className="h-[14px] w-[14px]" />}
        </button>

        {canRemove && (
          <button
            type="button"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-[var(--eileen-surface)] text-[var(--eileen-text-muted)] shadow group-hover:flex"
          >
            <XIcon className="h-[10px] w-[10px]" />
          </button>
        )}

        {canRemove &&
          menuOpen &&
          createPortal(
            <div
              ref={popoverRef}
              role="menu"
              className="fixed z-50 min-w-[120px] rounded-[var(--eileen-radius)] border border-meringue bg-[var(--eileen-surface)] p-1 shadow-lg"
              style={{
                top: position?.top ?? -9999,
                left: position?.left ?? -9999,
                visibility: position ? 'visible' : 'hidden',
              }}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onRemove?.();
                }}
                className="flex h-8 w-full items-center gap-2 rounded-[var(--eileen-radius-sm)] px-[12px] text-left text-sm font-sans text-[var(--eileen-text)] hover:bg-meringue"
              >
                <XIcon className="h-[10px] w-[10px] shrink-0" />
                Remove
              </button>
            </div>,
            document.body
          )}
      </div>
    );
  }
);

ColorChip.displayName = 'ColorChip';
