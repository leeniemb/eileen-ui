import type { SVGProps } from 'react';

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 9 9" fill="none" aria-hidden="true" {...props}>
      <path d="M8.5 0.5L0.5 8.5M8.5 8.5L0.5 0.499998" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
