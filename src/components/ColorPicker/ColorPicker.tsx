import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '../Input';
import { Button } from '../Button';
import { CheckIcon, XIcon } from '../../icons';
import { usePopoverPosition } from '../../hooks/usePopoverPosition';
import { useDismissOnOutsideOrEscape } from '../../hooks/useDismissOnOutsideOrEscape';
import { useCoarsePointer } from '../../hooks/useCoarsePointer';
import { hexToHsv, hsvToHex, isValidHex, type Hsv } from './colorUtils';

export interface ColorPickerProps {
  /** Current color, controlled. */
  color: string;
  onChange: (hex: string) => void;
  onClose: () => void;
  /** Shows a Remove button next to Confirm when provided -- the only way
   * to remove a color on a touch device, since there's no hover state
   * for ColorChip's own remove badge there. */
  onRemove?: () => void;
  /** Element the popover anchors above (or below, if there's no room) and
   * excludes from outside-click dismissal. A plain node (not a ref object)
   * so it stays referentially stable across re-renders -- wrapping it in a
   * fresh `{ current }` object every render would tear down and rebuild the
   * position/outside-click effects on every render, including every
   * pointermove while dragging. */
  anchorEl: HTMLElement | null;
}

export function ColorPicker({ color, onChange, onClose, onRemove, anchorEl }: ColorPickerProps) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(color));
  const [hexText, setHexText] = useState(color.replace('#', '').toUpperCase());
  // Bigger, still-square tap targets on touch; mouse/trackpad keeps the
  // compact mini size. The hex input isn't given a size of its own here --
  // it just flexes into whatever width the buttons leave behind.
  const isCoarse = useCoarsePointer();
  const controlSize = isCoarse ? 'regular' : 'mini';

  const { popoverRef, position } = usePopoverPosition(anchorEl, 'above', 16);
  useDismissOnOutsideOrEscape([popoverRef, { current: anchorEl }], onClose);

  function commit(next: Hsv) {
    setHsv(next);
    const hex = hsvToHex(next.h, next.s, next.v);
    setHexText(hex.replace('#', ''));
    onChange(hex);
  }

  function updateFromSvPointer(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    commit({ ...hsv, s: x / rect.width, v: 1 - y / rect.height });
  }

  function updateFromHuePointer(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    commit({ ...hsv, h: (x / rect.width) * 360 });
  }

  function handleHexChange(value: string) {
    const clean = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase();
    setHexText(clean);
    if (isValidHex(clean)) {
      setHsv(hexToHsv(`#${clean}`));
      onChange(`#${clean}`);
    }
  }

  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-50 w-[240px]"
      style={{
        top: position?.top ?? -9999,
        left: position?.left ?? -9999,
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      <div className="overflow-hidden rounded-[var(--eileen-radius-lg)] bg-[var(--eileen-surface)] shadow-lg">
        <div
          className="relative h-[240px] w-full touch-none cursor-crosshair"
          style={{
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h}, 100%, 50%)`,
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            updateFromSvPointer(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) updateFromSvPointer(e);
          }}
        >
          <div
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: currentHex }}
          />
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div
            className="relative h-1 w-full touch-none cursor-pointer rounded-full"
            style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              updateFromHuePointer(e);
            }}
            onPointerMove={(e) => {
              if (e.buttons === 1) updateFromHuePointer(e);
            }}
          >
            <div
              className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow"
              style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Input
              size="mini"
              value={hexText}
              onChange={(e) => handleHexChange(e.target.value)}
              className="min-w-0 flex-1"
              aria-label="Hex color"
            />
            {onRemove && (
              <Button
                size={controlSize}
                variant="outline"
                icon={<XIcon className="h-full w-full" />}
                aria-label="Remove"
                className="shrink-0"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
              />
            )}
            <Button
              size={controlSize}
              variant="outline"
              icon={<CheckIcon className="h-full w-full" />}
              aria-label="Confirm"
              className="shrink-0"
              onClick={onClose}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute h-3 w-3 rotate-45 bg-[var(--eileen-surface)] shadow-lg"
        style={
          position?.placement === 'below'
            ? { top: -6, left: '50%', marginLeft: -6 }
            : { bottom: -6, left: '50%', marginLeft: -6 }
        }
      />
    </div>,
    document.body
  );
}
