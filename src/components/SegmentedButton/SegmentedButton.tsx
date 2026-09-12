import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

export type SegmentedButtonVariant = 'text' | 'icon' | 'text-icon';

export interface SegmentedButtonOption {
  value: string;
  /** Used by 'text' and 'text-icon' variants. */
  label?: string;
  /** Used by 'icon' variant — the segment's sole content. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedButtonOption[];
  value: string;
  onChange?: (value: string) => void;
  variant?: SegmentedButtonVariant;
  disabled?: boolean;
  /** Radio group name; auto-generated if omitted. */
  name?: string;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SegmentedButton({
  options,
  value,
  onChange,
  variant = 'text',
  disabled,
  name,
  className = '',
  ...props
}: SegmentedButtonProps) {
  const autoName = useId();
  const groupName = name ?? autoName;

  return (
    <div
      role="radiogroup"
      className={`inline-flex h-10 items-center gap-1 rounded-[var(--eileen-radius)] border border-meringue bg-white p-1 ${className}`}
      {...props}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        const isDisabled = disabled || opt.disabled;
        return (
          <label
            key={opt.value}
            className={[
              'flex h-8 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[var(--eileen-radius)] px-3 text-sm font-sans transition-colors',
              selected ? 'bg-black-sesame text-white' : 'text-[var(--eileen-text)] hover:bg-meringue',
              isDisabled ? 'pointer-events-none opacity-50' : '',
            ].join(' ')}
          >
            <input
              type="radio"
              name={groupName}
              value={opt.value}
              checked={selected}
              disabled={isDisabled}
              onChange={() => onChange?.(opt.value)}
              className="sr-only"
            />
            {variant === 'icon' ? (
              opt.icon
            ) : (
              <>
                {variant === 'text-icon' && selected && <CheckIcon />}
                {opt.label && <span>{opt.label}</span>}
              </>
            )}
          </label>
        );
      })}
    </div>
  );
}
