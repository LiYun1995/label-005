import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  const variantClasses: Record<Variant, string> = {
    primary:
      'bg-ink-700 text-white hover:bg-ink-800 active:bg-ink-900 shadow-sm',
    secondary:
      'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 active:bg-ink-100',
    ghost:
      'bg-transparent text-ink-600 hover:bg-ink-100 active:bg-ink-200',
    danger:
      'bg-annotate-error text-white hover:bg-red-600 active:bg-red-700',
  };

  const sizeClasses: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-400 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-inherit',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}
