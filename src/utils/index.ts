import type { Annotation, AnnotationType, Manuscript, Chapter } from '@/types';
import { ANNOTATION_TYPE_META } from '@/types';

export interface SelectionInfo {
  text: string;
  startOffset: number;
  endOffset: number;
  rect: DOMRect | null;
}

export function getTextSelection(container: HTMLElement): SelectionInfo | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) {
    return null;
  }

  const preRange = document.createRange();
  preRange.selectNodeContents(container);
  preRange.setEnd(range.startContainer, range.startOffset);
  const startOffset = preRange.toString().length;

  const selectedText = selection.toString();
  if (!selectedText.trim()) return null;

  const endOffset = startOffset + selectedText.length;
  const rect = range.getBoundingClientRect();

  return {
    text: selectedText,
    startOffset,
    endOffset,
    rect,
  };
}

export function clearSelection() {
  window.getSelection()?.removeAllRanges();
}

export function renderHighlightedContent(
  content: string,
  annotations: Annotation[],
  activeId: string | null,
  onClick: (id: string) => void
) {
  if (annotations.length === 0) return [{ text: content, annotationId: null as string | null }];

  const sorted = [...annotations].sort((a, b) => a.startOffset - b.startOffset);
  const segments: { text: string; annotationId: string | null }[] = [];
  let cursor = 0;

  for (const ann of sorted) {
    if (ann.startOffset < cursor) continue;
    if (ann.startOffset > cursor) {
      segments.push({ text: content.slice(cursor, ann.startOffset), annotationId: null });
    }
    segments.push({
      text: content.slice(ann.startOffset, ann.endOffset),
      annotationId: ann.id,
    });
    cursor = ann.endOffset;
  }
  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor), annotationId: null });
  }
  return segments;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

export interface ExportReportItem {
  章节: string;
  页码: number;
  批注类型: string;
  原文摘录: string;
  批注内容: string;
  创建时间: string;
}

function escapeCsv(val: string | number) {
  const s = String(val);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportCsv(manuscript: Manuscript, annotations: Annotation[]) {
  const chapterMap: Record<string, Chapter> = {};
  manuscript.chapters.forEach((c) => {
    chapterMap[c.id] = c;
    c.pages.forEach(() => {});
  });

  const pageMap: Record<string, { chapterId: string; pageNumber: number; chapterTitle: string }> = {};
  manuscript.chapters.forEach((c) => {
    c.pages.forEach((p) => {
      pageMap[p.id] = { chapterId: c.id, pageNumber: p.pageNumber, chapterTitle: c.title };
    });
  });

  const rows = annotations
    .slice()
    .sort((a, b) => {
      const pa = pageMap[a.pageId];
      const pb = pageMap[b.pageId];
      if (!pa || !pb) return 0;
      if (pa.chapterId !== pb.chapterId) {
        return (chapterMap[pa.chapterId]?.order ?? 0) - (chapterMap[pb.chapterId]?.order ?? 0);
      }
      if (pa.pageNumber !== pb.pageNumber) return pa.pageNumber - pb.pageNumber;
      return a.startOffset - b.startOffset;
    })
    .map((a) => {
      const pageInfo = pageMap[a.pageId];
      return {
        章节: pageInfo?.chapterTitle ?? '',
        页码: pageInfo?.pageNumber ?? 0,
        批注类型: ANNOTATION_TYPE_META[a.type].label,
        原文摘录: a.highlightedText,
        批注内容: a.content,
        创建时间: formatDate(a.createdAt),
      };
    });

  const header = ['章节', '页码', '批注类型', '原文摘录', '批注内容', '创建时间'];
  const lines = [header.map(escapeCsv).join(',')];
  rows.forEach((r) => {
    lines.push(
      [r.章节, r.页码, r.批注类型, r.原文摘录, r.批注内容, r.创建时间].map(escapeCsv).join(',')
    );
  });

  const bom = '\uFEFF';
  const content = bom + lines.join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${manuscript.title}-审校报告.csv`);
}

export function exportJson(manuscript: Manuscript, annotations: Annotation[]) {
  const payload = {
    manuscript: {
      title: manuscript.title,
      author: manuscript.author,
      exportedAt: new Date().toISOString(),
    },
    annotations: annotations.map((a) => ({
      type: ANNOTATION_TYPE_META[a.type].label,
      typeKey: a.type,
      highlightedText: a.highlightedText,
      content: a.content,
      createdAt: formatDate(a.createdAt),
    })),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `${manuscript.title}-审校报告.json`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function getAnnotationTypeLabel(type: AnnotationType) {
  return ANNOTATION_TYPE_META[type].label;
}
