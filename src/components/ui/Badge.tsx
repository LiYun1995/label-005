import { clsx } from 'clsx';
import type { AnnotationType, ManuscriptStatus } from '@/types';
import { ANNOTATION_TYPE_META, STATUS_META } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'error' | 'warning' | 'info' | 'success';
}

export function Badge({ children, className, color = 'default' }: BadgeProps) {
  const colorMap: Record<string, string> = {
    default: 'bg-ink-100 text-ink-700',
    error: 'bg-annotate-error/10 text-annotate-error',
    warning: 'bg-annotate-format/10 text-annotate-format',
    info: 'bg-annotate-question/10 text-annotate-question',
    success: 'bg-green-50 text-green-600',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}

export function AnnotationTypeBadge({ type }: { type: AnnotationType }) {
  const meta = ANNOTATION_TYPE_META[type];
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        meta.bgClass,
        meta.textClass
      )}
    >
      {meta.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: ManuscriptStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        meta.bgClass,
        meta.textClass
      )}
    >
      <span
        className={clsx('w-1.5 h-1.5 rounded-full mr-1.5')}
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}
