import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { useManuscriptStore } from '@/store/manuscriptStore';
import type { ManuscriptStatus } from '@/types';
import { STATUS_META } from '@/types';
import { clsx } from 'clsx';

export function ManuscriptFilter() {
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useManuscriptStore();

  const filters: Array<{ value: ManuscriptStatus | 'all'; label: string }> = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: STATUS_META.pending.label },
    { value: 'in_progress', label: STATUS_META['in_progress'].label },
    { value: 'completed', label: STATUS_META.completed.label },
  ];

  return (
    <div className="bg-white rounded-xl border border-ink-100 shadow-paper p-4 mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="搜索书名或作者..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-ink-500 focus:bg-white focus:ring-2 focus:ring-ink-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink-500" />
          <div className="flex items-center gap-1 p-1 bg-ink-50 rounded-lg">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  statusFilter === f.value
                    ? 'bg-white text-ink-800 shadow-sm'
                    : 'text-ink-500 hover:text-ink-700'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 ml-auto p-1 bg-ink-50 rounded-lg">
          <button className="p-1.5 rounded-md bg-white text-ink-800 shadow-sm">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md text-ink-500 hover:text-ink-700 transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
