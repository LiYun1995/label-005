import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { clsx } from 'clsx';
import type { AnnotationType } from '@/types';
import { ANNOTATION_TYPE_META } from '@/types';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Input';

interface AnnotationFormProps {
  highlightedText: string;
  defaultType?: AnnotationType;
  defaultContent?: string;
  submitLabel?: string;
  onSubmit: (data: { type: AnnotationType; content: string }) => void;
  onCancel: () => void;
}

export function AnnotationForm({
  highlightedText,
  defaultType = 'text_error',
  defaultContent = '',
  submitLabel = '保存批注',
  onSubmit,
  onCancel,
}: AnnotationFormProps) {
  const [type, setType] = useState<AnnotationType>(defaultType);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    setType(defaultType);
    setContent(defaultContent);
  }, [defaultType, defaultContent]);

  const canSubmit = content.trim().length > 0;

  const typeOptions: AnnotationType[] = ['text_error', 'format_issue', 'content_question'];

  return (
    <div className="bg-ink-50 rounded-lg p-3 border border-ink-100 animate-slide-up">
      {highlightedText && (
        <div className="mb-3">
          <p className="text-[11px] text-ink-400 uppercase tracking-wider mb-1">原文摘录</p>
          <blockquote className="text-sm text-ink-700 bg-white rounded-md px-3 py-2 border-l-2 border-ink-300 italic">
            "{highlightedText}"
          </blockquote>
        </div>
      )}

      <div className="mb-3">
        <p className="text-[11px] text-ink-400 uppercase tracking-wider mb-1.5">批注类型</p>
        <div className="flex flex-wrap gap-1.5">
          {typeOptions.map((t) => {
            const meta = ANNOTATION_TYPE_META[t];
            const selected = t === type;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                  selected
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
                )}
                style={selected ? { backgroundColor: meta.color } : undefined}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[11px] text-ink-400 uppercase tracking-wider mb-1.5">批注内容</p>
        <TextArea
          rows={3}
          placeholder="请输入批注说明..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-ink-500 hover:text-ink-700 hover:bg-ink-100 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          取消
        </button>
        <Button
          size="sm"
          disabled={!canSubmit}
          onClick={() => canSubmit && onSubmit({ type, content: content.trim() })}
          icon={<Check className="w-3.5 h-3.5" />}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
