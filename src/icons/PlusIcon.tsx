import type { SVGProps } from 'react';

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 0C5.27614 0 5.5 0.223858 5.5 0.5V4.5H9.5C9.77614 4.5 10 4.72386 10 5C10 5.24171 9.82855 5.44371 9.60059 5.49023L9.5 5.5H5.5V9.5C5.5 9.77614 5.27614 10 5 10C4.72386 10 4.5 9.77614 4.5 9.5V5.5H0.5L0.399414 5.49023C0.171447 5.44371 1.96363e-07 5.24171 0 5C1.96443e-07 4.75829 0.171447 4.55629 0.399414 4.50977L0.5 4.5H4.5V0.5C4.5 0.223858 4.72386 0 5 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
