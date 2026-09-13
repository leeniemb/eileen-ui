import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'regular' | 'mini';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders before the label. Omit `children` for an icon-only button
   * (remember to pass `aria-label` in that case — there's no visible text). */
  icon?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  regular: 'h-[36px] px-4 text-sm font-sans gap-1',
  mini: 'h-6 px-2 text-xs font-mono gap-1',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  regular: 'h-[36px] w-[36px] px-0',
  mini: 'h-6 w-6 px-0',
};

const iconWrapperClasses: Record<ButtonSize, string> = {
  regular: 'h-4 w-4',
  mini: 'h-2 w-2',
};

const variantClasses: Record<ButtonVariant, string> = {
  solid: 'bg-[var(--eileen-accent)] text-[var(--eileen-accent-fg)] hover:opacity-90',
  outline: 'border border-[var(--eileen-accent)] text-[var(--eileen-accent)] hover:bg-meringue',
  ghost: 'text-[var(--eileen-accent)] hover:bg-meringue',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'regular', icon, children, className = '', ...props }, ref) => {
    const iconOnly = Boolean(icon) && !children;

    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center rounded-[var(--eileen-radius)] font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
          iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          variantClasses[variant],
          className,
        ].join(' ')}
        {...props}
      >
        {icon && <span className={`inline-flex shrink-0 ${iconWrapperClasses[size]}`}>{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
