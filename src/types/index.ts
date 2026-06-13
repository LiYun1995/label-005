export type AnnotationType = 'text_error' | 'format_issue' | 'content_question';

export type ManuscriptStatus = 'pending' | 'in_progress' | 'completed';

export interface Annotation {
  id: string;
  pageId: string;
  chapterId: string;
  manuscriptId: string;
  type: AnnotationType;
  content: string;
  highlightedText: string;
  startOffset: number;
  endOffset: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  chapterId: string;
  pageNumber: number;
  content: string;
}

export interface Chapter {
  id: string;
  manuscriptId: string;
  title: string;
  order: number;
  pages: Page[];
}

export interface Manuscript {
  id: string;
  title: string;
  author: string;
  status: ManuscriptStatus;
  totalPages: number;
  reviewedPages: number;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export const ANNOTATION_TYPE_META: Record<AnnotationType, { label: string; color: string; bgClass: string; textClass: string; highlightClass: string }> = {
  text_error: {
    label: '文字错误',
    color: '#e74c3c',
    bgClass: 'bg-annotate-error/10',
    textClass: 'text-annotate-error',
    highlightClass: 'mark-highlight-error',
  },
  format_issue: {
    label: '排版问题',
    color: '#f39c12',
    bgClass: 'bg-annotate-format/10',
    textClass: 'text-annotate-format',
    highlightClass: 'mark-highlight-format',
  },
  content_question: {
    label: '内容疑问',
    color: '#3498db',
    bgClass: 'bg-annotate-question/10',
    textClass: 'text-annotate-question',
    highlightClass: 'mark-highlight-question',
  },
};

export const STATUS_META: Record<ManuscriptStatus, { label: string; color: string; bgClass: string; textClass: string }> = {
  pending: {
    label: '待审校',
    color: '#9bb0cb',
    bgClass: 'bg-ink-100',
    textClass: 'text-ink-600',
  },
  in_progress: {
    label: '审校中',
    color: '#f39c12',
    bgClass: 'bg-annotate-format/10',
    textClass: 'text-annotate-format',
  },
  completed: {
    label: '已完成',
    color: '#27ae60',
    bgClass: 'bg-green-50',
    textClass: 'text-green-600',
  },
};
