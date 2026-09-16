import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputSize = 'medium' | 'mini';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  /** Standalone field label above the input, styled like Field's title
   * (Helvetica, base). Distinct from `label` below -- this is for a normal
   * named field ("Name"), not the repeatable-list-row pattern. */
  title?: string;
  /** Leading label, outside the input's own border (e.g. a row index or field name).
   * Also becomes the placeholder when no explicit `placeholder` is given. */
  label?: string;
  /** Trailing icon, outside the input's own border (e.g. a remove/delete action). */
  icon?: ReactNode;
  onIconClick?: () => void;
  /** Accessible name for the icon button — required if `icon` is passed. */
  iconLabel?: string;
}

const fieldClasses: Record<InputSize, string> = {
  medium: 'h-[36px] border-[var(--eileen-text)] px-4 text-sm font-sans',
  mini: 'h-6 border-meringue px-1 text-xs font-mono',
};

const labelClasses: Record<InputSize, string> = {
  medium: 'font-mono text-xs text-[var(--eileen-text-muted)]',
  mini: 'font-mono text-micro text-[var(--eileen-text-muted)]',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { size = 'medium', title, label, icon, onIconClick, iconLabel, placeholder, id, className = '', ...props },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className={`flex w-full flex-col gap-2 ${className}`}>
        {title && (
          <label htmlFor={inputId} className="text-base font-sans text-[var(--eileen-text)]">
            {title}
          </label>
        )}
        <div className="flex w-full items-center gap-2">
          {label && (
            <label htmlFor={inputId} className={`shrink-0 ${labelClasses[size]}`}>
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            placeholder={placeholder ?? label}
            className={[
              'min-w-0 flex-1 rounded-[var(--eileen-radius)] border bg-white text-[var(--eileen-text)]',
              'outline-none transition-colors placeholder:text-[var(--eileen-text-muted)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--eileen-accent)] focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:pointer-events-none',
              fieldClasses[size],
            ].join(' ')}
            {...props}
          />
          {icon && (
            <button
              type="button"
              aria-label={iconLabel}
              onClick={onIconClick}
              className="inline-flex h-2 w-2 shrink-0 items-center justify-center text-[var(--eileen-text-muted)] transition-colors hover:text-[var(--eileen-text)]"
            >
              {icon}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
