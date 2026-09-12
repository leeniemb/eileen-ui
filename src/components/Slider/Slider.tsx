import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type' | 'size'> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  /** Shows a truffle dot at every valid step along the track. */
  segmented?: boolean;
  onChange?: (value: number) => void;
}

// Handle is 4px wide; tracks stop 2px short of each handle edge.
const TRACK_GAP_PX = 4;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    { value, min = 0, max = 100, step = 1, segmented = false, onChange, disabled, className = '', id, ...props },
    ref
  ) => {
    const [active, setActive] = useState(false);
    const autoId = useId();
    const inputId = id ?? autoId;
    const percent = ((value - min) / (max - min)) * 100;

    const stops: number[] = [];
    if (segmented) {
      for (let v = min; v <= max; v += step) {
        stops.push(((v - min) / (max - min)) * 100);
      }
    }

    return (
      <div className={`relative flex h-4 items-center ${disabled ? 'opacity-50' : ''} ${className}`}>
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black-sesame"
          style={{ width: `calc(${percent}% - ${TRACK_GAP_PX}px)` }}
        />
        <div
          className="absolute right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-meringue"
          style={{ width: `calc(${100 - percent}% - ${TRACK_GAP_PX}px)` }}
        />
        {stops.map((stop, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-truffle"
            style={{ left: `calc(${stop}% - 2px)` }}
          />
        ))}
        <div
          aria-hidden
          className="absolute top-1/2 w-1 -translate-y-1/2 rounded-full bg-black-sesame transition-[height] duration-150 ease-out"
          style={{ left: `calc(${percent}% - 2px)`, height: active ? 16 : 8 }}
        />
        <input
          ref={ref}
          id={inputId}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => onChange?.(Number(e.target.value))}
          onPointerDown={() => setActive(true)}
          onPointerUp={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className="absolute inset-0 z-10 w-full cursor-pointer opacity-0 disabled:cursor-default"
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
