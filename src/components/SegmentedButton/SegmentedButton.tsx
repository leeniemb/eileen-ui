import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef(new Map<string, HTMLLabelElement>());
  // Stable (memoized) per-option ref callbacks. An inline `ref={(el) => ...}`
  // gets a new identity every render, which makes React null-then-reattach
  // *every* segment's ref on *every* render -- that briefly empties
  // segmentRefs mid-render, and a measure() that lands in that window
  // silently no-ops, leaving the indicator stuck on the previous segment.
  const segmentRefSetters = useRef(new Map<string, (el: HTMLLabelElement | null) => void>());
  const getSegmentRefSetter = useCallback((key: string) => {
    let setter = segmentRefSetters.current.get(key);
    if (!setter) {
      setter = (el) => {
        if (el) segmentRefs.current.set(key, el);
        else segmentRefs.current.delete(key);
      };
      segmentRefSetters.current.set(key, setter);
    }
    return setter;
  }, []);
  const valueRef = useRef(value);
  valueRef.current = value;
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);

  // Reads the *current* value/segment at call time rather than closing over
  // a render's snapshot, so a resize callback firing late can never stomp a
  // newer selection with a stale position.
  const measure = useCallback(() => {
    const segment = segmentRefs.current.get(valueRef.current);
    if (!segment) return;
    setIndicator({ x: segment.offsetLeft, width: segment.offsetWidth });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [value, options, variant, measure]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      className={`relative flex h-10 w-full items-center gap-1 rounded-[var(--eileen-radius)] border border-meringue bg-white p-1 ${className}`}
      {...props}
    >
      {indicator && (
        <div
          aria-hidden="true"
          className="absolute inset-y-1 left-0 rounded-[var(--eileen-radius)] bg-black-sesame transition-[transform,width] duration-200 ease-out"
          style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
        />
      )}
      {options.map((opt) => {
        const selected = opt.value === value;
        const isDisabled = disabled || opt.disabled;
        return (
          <label
            key={opt.value}
            ref={getSegmentRefSetter(opt.value)}
            className={[
              'relative z-10 flex flex-auto cursor-pointer items-center justify-center gap-2 self-stretch whitespace-nowrap rounded-[var(--eileen-radius)] px-1 text-sm font-sans transition-colors duration-200',
              selected ? 'text-white' : 'text-[var(--eileen-text)] hover:bg-meringue',
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
