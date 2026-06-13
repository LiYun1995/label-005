import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, FileText } from 'lucide-react';
import type { Manuscript } from '@/types';
import { STATUS_META } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/utils';

interface ManuscriptCardProps {
  manuscript: Manuscript;
  annotationCount: number;
}

export function ManuscriptCard({ manuscript, annotationCount }: ManuscriptCardProps) {
  const navigate = useNavigate();
  const progress = manuscript.totalPages
    ? Math.round((manuscript.reviewedPages / manuscript.totalPages) * 100)
    : 0;
  const statusMeta = STATUS_META[manuscript.status];

  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="group bg-white rounded-xl border border-ink-100 shadow-paper hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden animate-slide-up"
      onClick={() => navigate(`/manuscript/${manuscript.id}`)}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: statusMeta.color }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={manuscript.status} />
              <span className="text-xs text-ink-400">共 {manuscript.chapters.length} 章</span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-ink-800 truncate group-hover:text-ink-600 transition-colors">
              {manuscript.title}
            </h3>
            <p className="text-sm text-ink-500 mt-0.5">作者：{manuscript.author}</p>
          </div>

          <div className="relative w-16 h-16 flex-shrink-0 ml-3">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#e8edf4"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={statusMeta.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-ink-700">{progress}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {manuscript.totalPages} 页
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {annotationCount} 条批注
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(manuscript.updatedAt).slice(0, 10)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm font-medium text-ink-600 group-hover:text-ink-800 transition-colors">
            审校
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
