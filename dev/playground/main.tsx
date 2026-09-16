import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Field, Slider, Button, SegmentedButton, Input, ColorPalette } from '../../src';
import '../../src/styles.css';

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AlignLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
      <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function AlignCenterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
      <path d="M2 4h12M4 8h8M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function AlignRightIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
      <path d="M2 4h12M6 8h8M4 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const STOP_OPTIONS = [
  { value: 'precise', label: 'Precise stop' },
  { value: 'loose', label: 'Loose stop' },
];

const SPEED_OPTIONS = [
  { value: '1x', label: '1x' },
  { value: '2x', label: '2x' },
  { value: '3x', label: '3x' },
  { value: '4x', label: '4x' },
];

const ALIGN_OPTIONS = [
  { value: 'left', icon: <AlignLeftIcon /> },
  { value: 'center', icon: <AlignCenterIcon /> },
  { value: 'right', icon: <AlignRightIcon /> },
];

function Playground() {
  const [segments, setSegments] = useState(6);
  const [amount, setAmount] = useState(42);
  const [speed, setSpeed] = useState('1x');
  const [stop, setStop] = useState('precise');
  const [align, setAlign] = useState('left');
  const [rows, setRows] = useState([
    { id: 'r1', value: 'One' },
    { id: 'r2', value: 'Two' },
    { id: 'r3', value: '' },
  ]);
  const [plainValue, setPlainValue] = useState('');
  const [miniValue, setMiniValue] = useState('');
  const [paletteColors, setPaletteColors] = useState(['#0084DB', '#A3E8A0', '#FF4500', '#9C4FC4']);

  function updateRow(id: string, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
  }
  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 24px' }} className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-label uppercase text-[var(--eileen-text-muted)]">regular — text</p>
        <div className="flex items-center gap-4">
          <Button>Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>

        <p className="font-mono text-label uppercase text-[var(--eileen-text-muted)]">regular — text + icon</p>
        <div className="flex items-center gap-4">
          <Button icon={<PlusIcon />}>Solid</Button>
          <Button variant="outline" icon={<PlusIcon />}>Outline</Button>
          <Button variant="ghost" icon={<PlusIcon />}>Ghost</Button>
        </div>

        <p className="font-mono text-label uppercase text-[var(--eileen-text-muted)]">regular — icon only</p>
        <div className="flex items-center gap-4">
          <Button icon={<PlusIcon />} aria-label="Add" />
          <Button variant="outline" icon={<PlusIcon />} aria-label="Add" />
          <Button variant="ghost" icon={<PlusIcon />} aria-label="Add" />
        </div>

        <p className="font-mono text-label uppercase text-[var(--eileen-text-muted)]">mini — text</p>
        <div className="flex items-center gap-4">
          <Button size="mini">Solid</Button>
          <Button size="mini" variant="outline">Outline</Button>
          <Button size="mini" variant="ghost">Ghost</Button>
          <Button size="mini" disabled>Disabled</Button>
        </div>

        <p className="font-mono text-label uppercase text-[var(--eileen-text-muted)]">mini — text + icon</p>
        <div className="flex items-center gap-4">
          <Button size="mini" icon={<PlusIcon />}>Solid</Button>
          <Button size="mini" variant="outline" icon={<PlusIcon />}>Outline</Button>
          <Button size="mini" variant="ghost" icon={<PlusIcon />}>Ghost</Button>
        </div>

        <p className="font-mono text-label uppercase text-[var(--eileen-text-muted)]">mini — icon only</p>
        <div className="flex items-center gap-4">
          <Button size="mini" icon={<PlusIcon />} aria-label="Add" />
          <Button size="mini" variant="outline" icon={<PlusIcon />} aria-label="Add" />
          <Button size="mini" variant="ghost" icon={<PlusIcon />} aria-label="Add" />
        </div>
      </div>

      <Field title="Segment count" description="2-20 wedges" value={segments} htmlFor="segments">
        <Slider id="segments" value={segments} min={2} max={20} step={1} segmented onChange={setSegments} />
      </Field>

      <Field title="Amount" value={amount} htmlFor="amount">
        <Slider id="amount" value={amount} min={0} max={100} onChange={setAmount} />
      </Field>

      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">text + icon</p>
          <SegmentedButton
            variant="text-icon"
            value={stop}
            onChange={setStop}
            options={STOP_OPTIONS}
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">text only</p>
          <SegmentedButton
            variant="text"
            value={speed}
            onChange={setSpeed}
            options={SPEED_OPTIONS}
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">icon only</p>
          <SegmentedButton
            variant="icon"
            value={align}
            onChange={setAlign}
            options={ALIGN_OPTIONS}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6" style={{ maxWidth: 320 }}>
        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">
            medium — label + remove
          </p>
          <div className="flex flex-col gap-2">
            {rows.map((row, i) => (
              <Input
                key={row.id}
                label={String(i + 1).padStart(2, '0')}
                value={row.value}
                onChange={(e) => updateRow(row.id, e.target.value)}
                icon={<XIcon />}
                iconLabel="Remove"
                onIconClick={() => removeRow(row.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">medium — plain</p>
          <Input value={plainValue} onChange={(e) => setPlainValue(e.target.value)} placeholder="One" />
        </div>

        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">mini</p>
          <Input size="mini" value={miniValue} onChange={(e) => setMiniValue(e.target.value)} placeholder="RGB" />
        </div>
      </div>

      <ColorPalette
        title="Size"
        description="Edit a swatch to update every component using it."
        colors={paletteColors}
        onChange={setPaletteColors}
      />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>
);
