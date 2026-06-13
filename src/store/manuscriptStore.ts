import { create } from 'zustand';
import type { Manuscript, ManuscriptStatus } from '@/types';
import { loadInitialData } from '@/data/mockData';

const initial = loadInitialData();

interface ManuscriptStore {
  manuscripts: Manuscript[];
  searchQuery: string;
  statusFilter: ManuscriptStatus | 'all';
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: ManuscriptStatus | 'all') => void;
  getManuscript: (id: string) => Manuscript | undefined;
  updateManuscript: (id: string, patch: Partial<Manuscript>) => void;
  persist: () => void;
}

export const useManuscriptStore = create<ManuscriptStore>((set, get) => ({
  manuscripts: initial.manuscripts,
  searchQuery: '',
  statusFilter: 'all',
  setSearchQuery: (q) => set({ searchQuery: q }),
  setStatusFilter: (s) => set({ statusFilter: s }),
  getManuscript: (id) => get().manuscripts.find((m) => m.id === id),
  updateManuscript: (id, patch) => {
    set({
      manuscripts: get().manuscripts.map((m) =>
        m.id === id ? { ...m, ...patch, updatedAt: new Date().toISOString() } : m
      ),
    });
    get().persist();
  },
  persist: () => {
    localStorage.setItem('manuscripts', JSON.stringify(get().manuscripts));
  },
}));
