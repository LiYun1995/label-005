import { useMemo } from 'react';
import { BookMarked } from 'lucide-react';
import { useManuscriptStore } from '@/store/manuscriptStore';
import { useAnnotationStore } from '@/store/annotationStore';
import { ManuscriptCard } from './ManuscriptCard';

export function ManuscriptList() {
  const { manuscripts, searchQuery, statusFilter } = useManuscriptStore();
  const { annotations } = useAnnotationStore();

  const filtered = useMemo(() => {
    return manuscripts.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!m.title.toLowerCase().includes(q) && !m.author.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [manuscripts, searchQuery, statusFilter]);

  const countsByMs = useMemo(() => {
    const map: Record<string, number> = {};
    annotations.forEach((a) => {
      map[a.manuscriptId] = (map[a.manuscriptId] || 0) + 1;
    });
    return map;
  }, [annotations]);

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-ink-100 shadow-paper p-16 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ink-50 flex items-center justify-center">
          <BookMarked className="w-8 h-8 text-ink-400" />
        </div>
        <h3 className="text-lg font-medium text-ink-700 mb-1">暂无匹配的书稿</h3>
        <p className="text-sm text-ink-500">尝试调整筛选条件或搜索关键词</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {filtered.map((m, i) => (
        <div key={m.id} style={{ animationDelay: `${i * 60}ms` }}>
          <ManuscriptCard manuscript={m} annotationCount={countsByMs[m.id] || 0} />
        </div>
      ))}
    </div>
  );
}
