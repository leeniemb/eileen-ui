import { ChevronDown, ChevronUp } from '../../icons';

export interface SectionHeaderProps {
  /** Step number, zero-padded to two digits (e.g. 1 -> "01"). */
  number?: number;
  title: string;
  /** Shows a collapse chevron and makes the header a toggle button. */
  collapsible?: boolean;
  /** Controlled: whether the section this header labels is collapsed. Only
   * meaningful when `collapsible` -- the header renders no content of its
   * own to hide, so pass this through to whatever it controls. */
  collapsed?: boolean;
  onChange?: (collapsed: boolean) => void;
  className?: string;
}

export function SectionHeader({
  number,
  title,
  collapsible = false,
  collapsed = false,
  onChange,
  className = '',
}: SectionHeaderProps) {
  const label = (
    <span className="flex items-baseline gap-4">
      {number != null && (
        <span className="font-mono text-2xl text-[var(--eileen-text-muted)]">
          {String(number).padStart(2, '0')}
        </span>
      )}
      <span className="font-sans text-2xl font-bold text-[var(--eileen-text)]">{title}</span>
    </span>
  );

  return (
    <div className={`w-full ${className}`}>
      <div style={{ borderTop: '1px solid var(--eileen-border)' }} />
      {collapsible ? (
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={() => onChange?.(!collapsed)}
          className={[
            'flex w-full items-center justify-between gap-4 pt-8 text-left outline-none',
            'focus-visible:ring-2 focus-visible:ring-[var(--eileen-accent)] focus-visible:ring-offset-2',
          ].join(' ')}
        >
          {label}
          {collapsed ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-[var(--eileen-text)]" />
          ) : (
            <ChevronUp className="h-4 w-4 shrink-0 text-[var(--eileen-text)]" />
          )}
        </button>
      ) : (
        <div className="flex w-full items-center justify-between gap-4 pt-8">{label}</div>
      )}
    </div>
  );
}
