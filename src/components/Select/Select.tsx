import { useId, useRef, useState } from 'react';
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
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
  className = '',
  ...props
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const { popoverRef, position } = usePopoverPosition(triggerRef.current, 'below', 4);
  useDismissOnOutsideOrEscape([popoverRef, triggerRef], () => setOpen(false), open);

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
    <>
      <button
        ref={triggerRef}
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
          'disabled:opacity-50 disabled:pointer-events-none',
          className,
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
            {options.map((opt, i) => (
              <div
                key={opt.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={opt.value === value}
                aria-disabled={opt.disabled}
                onClick={() => selectOption(i)}
                onPointerEnter={() => !opt.disabled && setHighlighted(i)}
                className={[
                  'flex h-8 cursor-pointer items-center justify-between gap-2 rounded-[var(--eileen-radius)] px-3 text-sm font-sans transition-colors',
                  opt.disabled ? 'pointer-events-none opacity-50' : '',
                  i === highlighted ? 'bg-meringue' : '',
                ].join(' ')}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && <CheckIcon className="h-[10px] w-[10px] shrink-0" />}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
