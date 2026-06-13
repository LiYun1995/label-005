import { useRef, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Highlighter } from 'lucide-react';
import { clsx } from 'clsx';
import type { Page, Annotation } from '@/types';
import { ANNOTATION_TYPE_META } from '@/types';
import { renderHighlightedContent, getTextSelection, clearSelection, type SelectionInfo } from '@/utils';

interface ContentViewerProps {
  page: Page;
  annotations: Annotation[];
  activeAnnotationId: string | null;
  totalPages: number;
  currentPageIdx: number;
  chapterTitle: string;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectAnnotation: (id: string) => void;
  onAddAnnotation: (selection: SelectionInfo) => void;
}

export function ContentViewer({
  page,
  annotations,
  activeAnnotationId,
  totalPages,
  currentPageIdx,
  chapterTitle,
  onPrevPage,
  onNextPage,
  onSelectAnnotation,
  onAddAnnotation,
}: ContentViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const toolBarRef = useRef<HTMLDivElement>(null);
  const pendingSelection = useRef<SelectionInfo | null>(null);

  const segments = useMemo(
    () => renderHighlightedContent(page.content, annotations, activeAnnotationId, onSelectAnnotation),
    [page.content, annotations, activeAnnotationId]
  );

  useEffect(() => {
    function handleMouseUp() {
      if (!contentRef.current) return;
      setTimeout(() => {
        const sel = getTextSelection(contentRef.current!);
        if (sel && sel.rect) {
          pendingSelection.current = sel;
          if (toolBarRef.current) {
            const containerRect = contentRef.current!.getBoundingClientRect();
            const top = sel.rect.top - containerRect.top - 48;
            const left = sel.rect.left - containerRect.left + sel.rect.width / 2 - 70;
            toolBarRef.current.style.top = `${Math.max(4, top)}px`;
            toolBarRef.current.style.left = `${Math.max(4, left)}px`;
            toolBarRef.current.style.display = 'flex';
          }
        }
      }, 10);
    }
    function handleDocMouseDown(e: MouseEvent) {
      if (toolBarRef.current && !toolBarRef.current.contains(e.target as Node)) {
        if (toolBarRef.current) toolBarRef.current.style.display = 'none';
      }
    }
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleDocMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleDocMouseDown);
    };
  }, []);

  function handleAddAnnotation() {
    const sel = pendingSelection.current;
    if (!sel) return;
    onAddAnnotation(sel);
    if (toolBarRef.current) toolBarRef.current.style.display = 'none';
    clearSelection();
    pendingSelection.current = null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-ink-100 bg-white/50">
        <div>
          <p className="text-xs text-ink-400">{chapterTitle}</p>
          <p className="text-sm font-medium text-ink-700">第 {page.pageNumber} 页 / 共 {totalPages} 页</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevPage}
            disabled={currentPageIdx === 0}
            className="p-2 rounded-md text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-ink-500 px-2">
            {currentPageIdx + 1} / {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPageIdx >= totalPages - 1}
            className="p-2 rounded-md text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin bg-paper-100">
        <div className="max-w-3xl mx-auto p-8 sm:p-12 relative min-h-full">
          <div
            ref={contentRef}
            className="bg-paper-50 rounded-lg shadow-paper p-8 sm:p-12 min-h-[600px] select-text"
          >
            <div className="content-text whitespace-pre-wrap">
              {segments.map((seg, idx) => {
                if (seg.annotationId == null) {
                  return <span key={idx}>{seg.text}</span>;
                }
                const ann = annotations.find((a) => a.id === seg.annotationId);
                if (!ann) return <span key={idx}>{seg.text}</span>;
                const meta = ANNOTATION_TYPE_META[ann.type];
                return (
                  <mark
                    key={idx}
                    className={clsx(meta.highlightClass, activeAnnotationId === ann.id && 'active')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAnnotation(ann.id);
                    }}
                    title={`${meta.label}：${ann.content.slice(0, 30)}${ann.content.length > 30 ? '...' : ''}`}
                  >
                    {seg.text}
                  </mark>
                );
              })}
            </div>
          </div>

          <div
            ref={toolBarRef}
            className="absolute z-20 items-center gap-1 px-2 py-1 bg-ink-800 text-white rounded-lg shadow-lg animate-scale-in"
            style={{ display: 'none', top: 0, left: 0 }}
          >
            <button
              onClick={handleAddAnnotation}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium hover:bg-ink-700 rounded-md transition-colors"
            >
              <Highlighter className="w-3.5 h-3.5" />
              添加批注
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t border-ink-100 bg-white/50">
        <div className="flex items-center gap-2">
          <p className="text-xs text-ink-400">提示：选中文本即可添加批注</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(ANNOTATION_TYPE_META).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1 text-[11px] text-ink-500">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: v.color + '40', borderBottom: `2px solid ${v.color}` }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
