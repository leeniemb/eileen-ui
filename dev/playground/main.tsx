import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Field, Slider, Button, SegmentedButton } from '../../src';
import '../../src/styles.css';

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

function Playground() {
  const [segments, setSegments] = useState(6);
  const [amount, setAmount] = useState(42);
  const [speed, setSpeed] = useState('1x');
  const [stop, setStop] = useState('precise');
  const [align, setAlign] = useState('left');

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 24px' }} className="flex flex-col gap-16">
      <div className="flex gap-4">
        <Button>Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
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
            options={[
              { value: 'precise', label: 'Precise stop' },
              { value: 'loose', label: 'Loose stop' },
              { value: 'off', label: 'Off', disabled: true },
            ]}
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">text only</p>
          <SegmentedButton
            variant="text"
            value={speed}
            onChange={setSpeed}
            options={[
              { value: '1x', label: '1x' },
              { value: '2x', label: '2x' },
              { value: '3x', label: '3x' },
              { value: '4x', label: '4x' },
            ]}
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-label uppercase text-[var(--eileen-text-muted)]">icon only</p>
          <SegmentedButton
            variant="icon"
            value={align}
            onChange={setAlign}
            options={[
              { value: 'left', icon: <AlignLeftIcon /> },
              { value: 'center', icon: <AlignCenterIcon /> },
              { value: 'right', icon: <AlignRightIcon /> },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>
);
