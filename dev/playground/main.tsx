import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Field, Slider, Button } from '../../src';
import '../../src/styles.css';

function Playground() {
  const [segments, setSegments] = useState(6);
  const [amount, setAmount] = useState(42);

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
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>
);
