import type { SVGProps } from 'react';

export function ChevronUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 11 6" fill="none" aria-hidden="true" {...props}>
      <path
        d="M0.5 5.08344L5.50081 0.5L10.5 5.08344"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
