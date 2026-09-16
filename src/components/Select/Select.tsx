import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, CheckIcon } from '../../icons';
import { usePopoverPosition } from '../../hooks/usePopoverPosition';
import { useDismissOnOutsideOrEscape } from '../../hooks/useDismissOnOutsideOrEscape';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Standalone field label above the trigger, styled like Field's title
   * (Helvetica, base). */
  title?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
  className = '',
  title,
  id,
  ...props
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const autoId = useId();
  const triggerId = id ?? autoId;

  const { popoverRef, position } = usePopoverPosition(triggerRef.current, 'below', 4);
  useDismissOnOutsideOrEscape([popoverRef, triggerRef], () => setOpen(false), open);

  // Sliding highlight behind whichever option is currently highlighted,
  // same approach as SegmentedButton's indicator: measure the option's own
  // offsetTop/offsetHeight and animate a separate absolutely-positioned
  // element to match, rather than each option toggling its own background.
  const optionRefs = useRef(new Map<number, HTMLDivElement>());
  const optionRefSetters = useRef(new Map<number, (el: HTMLDivElement | null) => void>());
  function getOptionRefSetter(i: number) {
    let setter = optionRefSetters.current.get(i);
    if (!setter) {
      setter = (el) => {
        if (el) optionRefs.current.set(i, el);
        else optionRefs.current.delete(i);
      };
      optionRefSetters.current.set(i, setter);
    }
    return setter;
  }
  const highlightedRef = useRef(highlighted);
  highlightedRef.current = highlighted;
  const [highlightRect, setHighlightRect] = useState<{ top: number; height: number } | null>(null);

  const measureHighlight = useCallback(() => {
    const el = optionRefs.current.get(highlightedRef.current);
    if (!el) return;
    setHighlightRect({ top: el.offsetTop, height: el.offsetHeight });
  }, []);

  useLayoutEffect(() => {
    if (open) measureHighlight();
    else setHighlightRect(null);
  }, [open, highlighted, options, measureHighlight]);

  const selected = options.find((o) => o.value === value);
  const enabledIndices = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  function openList() {
    if (disabled || options.length === 0) return;
    const currentIndex = value ? options.findIndex((o) => o.value === value) : -1;
    setHighlighted(currentIndex >= 0 ? currentIndex : (enabledIndices[0] ?? 0));
    setOpen(true);
  }

  function selectOption(index: number) {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveHighlight(delta: number) {
    if (enabledIndices.length === 0) return;
    const currentPos = enabledIndices.indexOf(highlighted);
    const nextPos = (currentPos + delta + enabledIndices.length) % enabledIndices.length;
    setHighlighted(enabledIndices[nextPos]);
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveHighlight(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveHighlight(-1);
        break;
      case 'Home':
        e.preventDefault();
        setHighlighted(enabledIndices[0] ?? 0);
        break;
      case 'End':
        e.preventDefault();
        setHighlighted(enabledIndices[enabledIndices.length - 1] ?? 0);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectOption(highlighted);
        break;
    }
  }

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {title && (
        <label htmlFor={triggerId} className="text-base font-sans text-[var(--eileen-text)]">
          {title}
        </label>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleTriggerKeyDown}
        className={[
          'flex h-[36px] w-full items-center justify-between gap-2 rounded-[var(--eileen-radius)]',
          'border border-[var(--eileen-text)] bg-white px-4 text-sm font-sans text-[var(--eileen-text)]',
          'outline-none focus-visible:border-2',
          'disabled:opacity-50 disabled:pointer-events-none',
        ].join(' ')}
        {...props}
      >
        <span className={selected ? 'truncate' : 'truncate text-[var(--eileen-text-muted)]'}>
          {selected ? selected.label : placeholder}
        </span>
        {open ? (
          <ChevronUp className="h-[10px] w-[10px] shrink-0" />
        ) : (
          <ChevronDown className="h-[10px] w-[10px] shrink-0" />
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            id={listId}
            role="listbox"
            aria-activedescendant={`${listId}-${highlighted}`}
            className="fixed z-50 max-h-64 overflow-auto rounded-[var(--eileen-radius)] border border-meringue bg-[var(--eileen-surface)] p-1 shadow-lg"
            style={{
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              width: triggerRef.current?.getBoundingClientRect().width,
              visibility: position ? 'visible' : 'hidden',
            }}
          >
            {highlightRect && (
              <div
                aria-hidden="true"
                className="absolute inset-x-1 rounded-[var(--eileen-radius-sm)] bg-meringue transition-[transform,height] duration-150 ease-out"
                style={{ top: 0, height: highlightRect.height, transform: `translateY(${highlightRect.top}px)` }}
              />
            )}
            {options.map((opt, i) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  ref={getOptionRefSetter(i)}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onClick={() => selectOption(i)}
                  onPointerEnter={() => !opt.disabled && setHighlighted(i)}
                  className={[
                    // Panel has p-1 (4px); this padding is 12px so option text
                    // lands 16px from the panel edge, matching the trigger's
                    // own px-4 -- the two need to add up, not match each other.
                    'relative z-10 flex h-8 cursor-pointer items-center justify-between gap-2 px-[12px] text-sm font-sans transition-colors',
                    opt.disabled ? 'pointer-events-none opacity-50' : '',
                    isSelected ? 'font-medium' : '',
                  ].join(' ')}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <CheckIcon className="h-[10px] w-[10px] shrink-0" />}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
