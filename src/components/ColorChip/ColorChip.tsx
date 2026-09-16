import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';

export interface ColorChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'onClick'> {
  /** Hex color. Omit to render the "add a color" variant. */
  color?: string;
  /** Shows a remove (x) badge on hover. */
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  /** Highlights the chip (e.g. while its picker is open). */
  active?: boolean;
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-[14px] w-[14px]">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-[10px] w-[10px]">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export const ColorChip = forwardRef<HTMLDivElement, ColorChipProps>(
  ({ color, removable, onRemove, onClick, active, className = '', ...props }, ref) => {
    const isAdd = !color;
    const style: CSSProperties | undefined = color ? { backgroundColor: color } : undefined;

    return (
      <div ref={ref} className={`group relative inline-flex h-6 w-6 shrink-0 ${className}`}>
        <button
          type="button"
          onClick={onClick}
          style={style}
          className={[
            'h-6 w-6 rounded-full border transition-transform hover:scale-110',
            active ? 'ring-2 ring-[var(--eileen-accent)] ring-offset-2' : '',
            isAdd
              ? 'flex items-center justify-center border-[var(--eileen-text)] bg-white text-[var(--eileen-text)] hover:bg-meringue'
              : 'border-[rgba(23,23,23,0.1)]',
          ].join(' ')}
          {...props}
        >
          {isAdd && <PlusIcon />}
        </button>
        {!isAdd && removable && (
          <button
            type="button"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-[var(--eileen-surface)] text-[var(--eileen-text)] shadow group-hover:flex"
          >
            <XIcon />
          </button>
        )}
      </div>
    );
  }
);

ColorChip.displayName = 'ColorChip';
