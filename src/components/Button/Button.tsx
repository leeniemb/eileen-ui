import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    'bg-[var(--eileen-accent)] text-[var(--eileen-accent-fg)] hover:opacity-90',
  outline:
    'border border-[var(--eileen-accent)] text-[var(--eileen-accent)] hover:bg-[var(--eileen-accent)]/10',
  ghost:
    'text-[var(--eileen-accent)] hover:bg-[var(--eileen-accent)]/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center rounded-[var(--eileen-radius)] font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
          sizeClasses[size],
          variantClasses[variant],
          className,
        ].join(' ')}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
