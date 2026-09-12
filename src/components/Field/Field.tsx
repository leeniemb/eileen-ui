import type { ReactNode } from 'react';

export interface FieldProps {
  /** Field title — Helvetica, base (16px). */
  title: string;
  /** Optional caption below the title — IBM Plex Mono, micro (10px). */
  description?: string;
  /** Optional value/counter, right-aligned to the title. */
  value?: ReactNode;
  /** Associates the title with a control's `id` (e.g. a Slider) for accessibility. */
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ title, description, value, htmlFor, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="text-base font-sans text-[var(--eileen-text)]">
          {title}
        </label>
        {value != null && (
          <span className="text-base font-sans text-[var(--eileen-text)]">{value}</span>
        )}
      </div>
      {description && (
        <p className="mt-1 font-mono text-micro text-[var(--eileen-text-muted)]">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}
