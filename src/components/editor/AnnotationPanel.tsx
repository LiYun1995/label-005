import { useMemo, useState } from 'react';
import { X, Plus, MessageSquare, Filter, AlertCircle, Layout, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import type { Annotation, AnnotationType, Manuscript, Chapter } from '@/types';
import { ANNOTATION_TYPE_META } from '@/types';
import { AnnotationItem } from './AnnotationItem';
import { AnnotationForm } from './AnnotationForm';
import { useAnnotationStore } from '@/store/annotationStore';
import type { SelectionInfo } from '@/utils';

interface AnnotationPanelProps {
  manuscript: Manuscript;
  currentChapterId: string;
  currentPageId: string;
  currentChapterTitle: string;
  currentPageNumber: number;
  pendingSelection: SelectionInfo | null;
  activeAnnotationId: string | null;
  onClose: () => void;
  onActivate: (id: string) => void;
  onClearPending: () => void;
}

type ViewScope = 'page' | 'chapter' | 'all';

export function AnnotationPanel({
  manuscript,
  currentChapterId,
  currentPageId,
  currentChapterTitle,
  currentPageNumber,
  pendingSelection,
  activeAnnotationId,
  onClose,
  onActivate,
  onClearPending,
}: AnnotationPanelProps) {
  const {
    annotations,
    typeFilter,
    setTypeFilter,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getByManuscript,
  } = useAnnotationStore();

  const [scope, setScope] = useState<ViewScope>('chapter');

  const chapterMap: Record<string, Chapter> = {};
  const pageMap: Record<string, { chapterId: string; pageNumber: number; chapterTitle: string }> = {};
  manuscript.chapters.forEach((c) => {
    chapterMap[c.id] = c;
    c.pages.forEach((p) => {
      pageMap[p.id] = { chapterId: c.id, pageNumber: p.pageNumber, chapterTitle: c.title };
    });
  });

  const allAnnotations = getByManuscript(manuscript.id);

  const filteredAnnotations = useMemo(() => {
    let list = allAnnotations;
    if (scope === 'page') {
      list = list.filter((a) => a.pageId === currentPageId);
    } else if (scope === 'chapter') {
      list = list.filter((a) => a.chapterId === currentChapterId);
    }
    if (typeFilter !== 'all') {
      list = list.filter((a) => a.type === typeFilter);
    }
    return list;
  }, [allAnnotations, scope, currentPageId, currentChapterId, typeFilter]);

  const countsByType = useMemo(() => {
    const map: Record<string, number> = { all: filteredAnnotations.length };
    filteredAnnotations.forEach((a) => {
      map[a.type] = (map[a.type] || 0) + 1;
    });
    return map;
  }, [filteredAnnotations]);

  const typeOptions: Array<{ value: AnnotationType | 'all'; label: string; icon: React.ReactNode }> = [
    { value: 'all', label: '全部', icon: <Filter className="w-3.5 h-3.5" /> },
    { value: 'text_error', label: ANNOTATION_TYPE_META.text_error.label, icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { value: 'format_issue', label: ANNOTATION_TYPE_META.format_issue.label, icon: <Layout className="w-3.5 h-3.5" /> },
    { value: 'content_question', label: ANNOTATION_TYPE_META.content_question.label, icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  function handleAddSubmit(data: { type: AnnotationType; content: string }) {
    if (!pendingSelection) return;
    addAnnotation({
      pageId: currentPageId,
      chapterId: currentChapterId,
      manuscriptId: manuscript.id,
      type: data.type,
      content: data.content,
      highlightedText: pendingSelection.text,
      startOffset: pendingSelection.startOffset,
      endOffset: pendingSelection.endOffset,
    });
    onClearPending();
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-ink-100">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-ink-600" />
          <h3 className="text-sm font-semibold text-ink-800">批注面板</h3>
          <span className="text-xs text-ink-400">共 {filteredAnnotations.length} 条</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md text-ink-500 hover:bg-ink-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-ink-100 space-y-3">
        <div className="flex items-center gap-1 p-1 bg-ink-50 rounded-lg">
          {(['page', 'chapter', 'all'] as ViewScope[]).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={clsx(
                'flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all',
                scope === s ? 'bg-white text-ink-800 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              )}
            >
              {s === 'page' ? '当前页' : s === 'chapter' ? '当前章' : '全部'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {typeOptions.map((opt) => {
            const count = countsByType[opt.value] || 0;
            const selected = typeFilter === opt.value;
            const meta = opt.value !== 'all' ? ANNOTATION_TYPE_META[opt.value as AnnotationType] : null;
            return (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value)}
                className={clsx(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border',
                  selected
                    ? 'bg-ink-700 text-white border-ink-700'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'
                )}
                style={selected && meta ? { backgroundColor: meta.color, borderColor: meta.color } : undefined}
              >
                {opt.icon}
                {opt.label}
                <span className={clsx('px-1.5 py-0.5 rounded-full text-[10px]', selected ? 'bg-white/20' : 'bg-ink-100 text-ink-500')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-2">
        {pendingSelection && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-ink-700 inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                新增批注
              </span>
              <button
                onClick={onClearPending}
                className="text-xs text-ink-400 hover:text-ink-600"
              >
                取消
              </button>
            </div>
            <AnnotationForm
              highlightedText={pendingSelection.text}
              onSubmit={handleAddSubmit}
              onCancel={onClearPending}
            />
          </div>
        )}

        {filteredAnnotations.length === 0 && !pendingSelection && (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-ink-50 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-ink-300" />
            </div>
            <p className="text-sm text-ink-500 mb-1">暂无批注</p>
            <p className="text-xs text-ink-400">选中原文文字开始添加批注</p>
          </div>
        )}

        {filteredAnnotations.map((ann) => {
          const pageInfo = pageMap[ann.pageId];
          return (
            <AnnotationItem
              key={ann.id}
              annotation={ann}
              isActive={activeAnnotationId === ann.id}
              chapterTitle={pageInfo?.chapterTitle ?? ''}
              pageNumber={pageInfo?.pageNumber ?? 0}
              onActivate={onActivate}
              onUpdate={updateAnnotation}
              onDelete={deleteAnnotation}
              compact={scope === 'all'}
            />
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-ink-100 bg-ink-50/50">
        <div className="grid grid-cols-3 gap-2 text-center">
          {(['text_error', 'format_issue', 'content_question'] as AnnotationType[]).map((t) => {
            const meta = ANNOTATION_TYPE_META[t];
            const count = allAnnotations.filter((a) => a.type === t).length;
            return (
              <div key={t}>
                <p className="text-lg font-bold" style={{ color: meta.color }}>
                  {count}
                </p>
                <p className="text-[11px] text-ink-500">{meta.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
