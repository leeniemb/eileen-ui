import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

// Track 40x24 (w-10 h-6), thumb 16x16 (h-4 w-4) with a 4px inset on each
// side -- thumb travels from translateX(4) at rest to translateX(20) when
// checked (40 - 4 - 16 = 20).
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onChange, disabled, className = '', ...props }, ref) => {
    return (
      <label
        className={[
          'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-150',
          'focus-within:ring-2 focus-within:ring-[var(--eileen-accent)] focus-within:ring-offset-2',
          checked ? 'bg-[var(--eileen-accent)]' : 'bg-meringue',
          disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
          className,
        ].join(' ')}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className="block h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ease-out"
          style={{ transform: `translateX(${checked ? 20 : 4}px)` }}
        />
      </label>
    );
  }
);

Switch.displayName = 'Switch';
