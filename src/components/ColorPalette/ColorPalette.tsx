import { useCallback, useReducer, useRef, useState } from 'react';
import { Field } from '../Field';
import { ColorChip } from '../ColorChip';
import { ColorPicker } from '../ColorPicker';

export interface ColorPaletteProps {
  title: string;
  description?: string;
  colors: string[];
  onChange: (colors: string[]) => void;
  /** Shows the trailing "+" chip and per-chip remove badges. */
  editable?: boolean;
  className?: string;
}

export function ColorPalette({
  title,
  description,
  colors,
  onChange,
  editable = true,
  className = '',
}: ColorPaletteProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openIndexRef = useRef(openIndex);
  openIndexRef.current = openIndex;

  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  // A chip added and opened in the same action doesn't have a DOM node yet
  // when this render reads chipRefs for the ColorPicker's anchorEl prop --
  // refs only attach during commit, after render. Forcing one more render
  // when that ref actually attaches picks up the now-real node.
  const [, forceRerender] = useReducer((c: number) => c + 1, 0);

  // Memoized per-index ref setters. An inline `ref={(el) => ...}` gets a new
  // identity every render, which makes React null-then-reattach *every*
  // chip's ref on *every* render -- combined with the wasEmpty check above,
  // that null-then-reattach cycle looked like a fresh mount on every render
  // and drove forceRerender into an infinite loop.
  const refSetters = useRef(new Map<number, (el: HTMLDivElement | null) => void>());
  function getChipRefSetter(i: number) {
    let setter = refSetters.current.get(i);
    if (!setter) {
      setter = (el) => {
        const wasEmpty = chipRefs.current[i] == null;
        chipRefs.current[i] = el;
        if (el && wasEmpty && i === openIndexRef.current) forceRerender();
      };
      refSetters.current.set(i, setter);
    }
    return setter;
  }

  function updateColor(index: number, hex: string) {
    onChange(colors.map((c, i) => (i === index ? hex : c)));
  }

  function removeColor(index: number) {
    onChange(colors.filter((_, i) => i !== index));
    setOpenIndex((current) => (current === index ? null : current));
  }

  function addColor() {
    onChange([...colors, '#171717']);
    setOpenIndex(colors.length);
  }

  const closePicker = useCallback(() => setOpenIndex(null), []);

  return (
    <Field title={title} description={description} className={className}>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color, i) => (
          <ColorChip
            key={i}
            ref={getChipRefSetter(i)}
            color={color}
            removable={editable}
            active={openIndex === i}
            onClick={() => setOpenIndex((current) => (current === i ? null : i))}
            onRemove={() => removeColor(i)}
            aria-label={`Edit color ${i + 1}, ${color}`}
          />
        ))}
        {editable && <ColorChip onClick={addColor} aria-label="Add color" />}
      </div>

      {openIndex !== null && colors[openIndex] && (
        <ColorPicker
          color={colors[openIndex]}
          onChange={(hex) => updateColor(openIndex, hex)}
          onClose={closePicker}
          anchorEl={chipRefs.current[openIndex]}
        />
      )}
    </Field>
  );
}
