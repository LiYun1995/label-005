import { useState } from 'react';
import { Pencil, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import type { Annotation } from '@/types';
import { ANNOTATION_TYPE_META } from '@/types';
import { AnnotationTypeBadge } from '@/components/ui/Badge';
import { AnnotationForm } from './AnnotationForm';
import { formatDate } from '@/utils';

interface AnnotationItemProps {
  annotation: Annotation;
  isActive: boolean;
  chapterTitle: string;
  pageNumber: number;
  onActivate: (id: string) => void;
  onUpdate: (id: string, data: { type: Annotation['type']; content: string }) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export function AnnotationItem({
  annotation,
  isActive,
  chapterTitle,
  pageNumber,
  onActivate,
  onUpdate,
  onDelete,
  compact,
}: AnnotationItemProps) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const meta = ANNOTATION_TYPE_META[annotation.type];

  function handleSubmit(data: { type: Annotation['type']; content: string }) {
    onUpdate(annotation.id, data);
    setEditing(false);
  }

  return (
    <div
      onClick={() => onActivate(annotation.id)}
      className={clsx(
        'group rounded-lg border transition-all cursor-pointer overflow-hidden',
        isActive
          ? 'border-ink-300 bg-white shadow-paper'
          : 'border-ink-100 bg-white hover:border-ink-200 hover:shadow-paper'
      )}
      style={{ borderLeftColor: meta.color, borderLeftWidth: '3px' }}
    >
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <AnnotationTypeBadge type={annotation.type} />
            {!compact && (
              <span className="text-[11px] text-ink-400">
                {chapterTitle} · 第 {pageNumber} 页
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing((v) => !v);
                setExpanded(true);
              }}
              className="p-1 rounded text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
              title="编辑"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('确定删除这条批注吗？')) onDelete(annotation.id);
              }}
              className="p-1 rounded text-ink-400 hover:text-annotate-error hover:bg-annotate-error/10 transition-colors"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
              className="p-1 rounded text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
              title={expanded ? '收起' : '展开'}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {expanded && !editing && (
          <div className="animate-fade-in">
            <blockquote className="text-xs text-ink-500 italic bg-ink-50 rounded px-2 py-1.5 mb-2 border-l-2" style={{ borderColor: meta.color }}>
              "{annotation.highlightedText}"
            </blockquote>
            <p className="text-sm text-ink-700 leading-relaxed">{annotation.content}</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-ink-400">
              <Clock className="w-3 h-3" />
              {formatDate(annotation.createdAt)}
            </div>
          </div>
        )}

        {expanded && editing && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <AnnotationForm
              highlightedText={annotation.highlightedText}
              defaultType={annotation.type}
              defaultContent={annotation.content}
              submitLabel="保存修改"
              onSubmit={handleSubmit}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
