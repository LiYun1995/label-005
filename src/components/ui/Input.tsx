import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={clsx(
        'w-full px-3 py-2 rounded-md text-sm text-ink-800',
        'bg-white border border-ink-200',
        'placeholder:text-ink-400',
        'focus:outline-none focus:border-ink-500 focus:ring-2 focus:ring-ink-200',
        'transition-all duration-150',
        className
      )}
    />
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className, ...rest }: TextAreaProps) {
  return (
    <textarea
      {...rest}
      className={clsx(
        'w-full px-3 py-2 rounded-md text-sm text-ink-800 leading-relaxed resize-y',
        'bg-white border border-ink-200',
        'placeholder:text-ink-400',
        'focus:outline-none focus:border-ink-500 focus:ring-2 focus:ring-ink-200',
        'transition-all duration-150',
        className
      )}
    />
  );
}
