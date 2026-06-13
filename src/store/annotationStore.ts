import { create } from 'zustand';
import type { Annotation, AnnotationType } from '@/types';
import { loadInitialData } from '@/data/mockData';

const initial = loadInitialData();

interface AnnotationStore {
  annotations: Annotation[];
  activeAnnotationId: string | null;
  typeFilter: AnnotationType | 'all';
  setActiveAnnotationId: (id: string | null) => void;
  setTypeFilter: (t: AnnotationType | 'all') => void;
  addAnnotation: (data: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => Annotation;
  updateAnnotation: (id: string, patch: Partial<Pick<Annotation, 'type' | 'content'>>) => void;
  deleteAnnotation: (id: string) => void;
  getByManuscript: (manuscriptId: string) => Annotation[];
  getByPage: (pageId: string) => Annotation[];
  getByChapter: (chapterId: string) => Annotation[];
  persist: () => void;
}

function genId() {
  return `ann-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export const useAnnotationStore = create<AnnotationStore>((set, get) => ({
  annotations: initial.annotations,
  activeAnnotationId: null,
  typeFilter: 'all',
  setActiveAnnotationId: (id) => set({ activeAnnotationId: id }),
  setTypeFilter: (t) => set({ typeFilter: t }),
  addAnnotation: (data) => {
    const now = new Date().toISOString();
    const annotation: Annotation = {
      ...data,
      id: genId(),
      createdAt: now,
      updatedAt: now,
    };
    set({ annotations: [annotation, ...get().annotations] });
    get().persist();
    return annotation;
  },
  updateAnnotation: (id, patch) => {
    set({
      annotations: get().annotations.map((a) =>
        a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
      ),
    });
    get().persist();
  },
  deleteAnnotation: (id) => {
    set({ annotations: get().annotations.filter((a) => a.id !== id) });
    if (get().activeAnnotationId === id) set({ activeAnnotationId: null });
    get().persist();
  },
  getByManuscript: (manuscriptId) =>
    get().annotations.filter((a) => a.manuscriptId === manuscriptId),
  getByPage: (pageId) =>
    get().annotations
      .filter((a) => a.pageId === pageId)
      .sort((a, b) => a.startOffset - b.startOffset),
  getByChapter: (chapterId) =>
    get().annotations.filter((a) => a.chapterId === chapterId),
  persist: () => {
    localStorage.setItem('annotations', JSON.stringify(get().annotations));
  },
}));
