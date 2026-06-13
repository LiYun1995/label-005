import { BookOpen } from 'lucide-react';
import { useManuscriptStore } from '@/store/manuscriptStore';
import { useAnnotationStore } from '@/store/annotationStore';
import { Header } from '@/components/layout/Header';
import { ManuscriptFilter } from '@/components/manuscript/ManuscriptFilter';
import { ManuscriptList } from '@/components/manuscript/ManuscriptList';

export default function ManuscriptListPage() {
  const { manuscripts } = useManuscriptStore();
  const { annotations } = useAnnotationStore() as unknown as { annotations: unknown[] };

  const stats = {
    total: manuscripts.length,
    pending: manuscripts.filter((m) => m.status === 'pending').length,
    inProgress: manuscripts.filter((m) => m.status === 'in_progress').length,
    completed: manuscripts.filter((m) => m.status === 'completed').length,
    annotations: annotations.length,
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-ink-700 text-paper-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold text-ink-800">我的待审书稿</h2>
              <p className="text-sm text-ink-500">共 {stats.total} 部书稿待处理</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: '全部书稿', value: stats.total, color: 'text-ink-700', bg: 'bg-ink-100' },
            { label: '待审校', value: stats.pending, color: 'text-ink-600', bg: 'bg-ink-50' },
            { label: '审校中', value: stats.inProgress, color: 'text-annotate-format', bg: 'bg-annotate-format/10' },
            { label: '批注总数', value: stats.annotations, color: 'text-annotate-question', bg: 'bg-annotate-question/10' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-ink-100 shadow-paper p-4 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={['w-8 h-8 rounded-lg flex items-center justify-center mb-2', stat.bg].join(' ')}>
                <span className={['text-lg font-bold', stat.color].join(' ')}>{stat.value}</span>
              </div>
              <p className="text-xs text-ink-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <ManuscriptFilter />
        <ManuscriptList />
      </main>
    </div>
  );
}
