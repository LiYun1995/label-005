import { ArrowLeft, Download, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import type { Manuscript } from '@/types';
import { exportCsv, exportJson } from '@/utils';
import { StatusBadge } from '@/components/ui/Badge';
import type { Annotation } from '@/types';

interface ToolbarProps {
  manuscript: Manuscript;
  currentChapterTitle: string;
  progress: number;
  annotations: Annotation[];
  onToggleSidebar?: () => void;
  onTogglePanel?: () => void;
}

export function Toolbar({ manuscript, currentChapterTitle, progress, annotations, onToggleSidebar, onTogglePanel }: ToolbarProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-ink-100 shadow-paper">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-ink-600 hover:bg-ink-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">返回列表</span>
          </button>

          <div className="h-5 w-px bg-ink-200 hidden sm:block" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base sm:text-lg font-semibold text-ink-800 truncate">
                {manuscript.title}
              </h1>
              <StatusBadge status={manuscript.status} />
            </div>
            <p className="text-xs text-ink-500 truncate">
              {manuscript.author} · {currentChapterTitle}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 min-w-[260px]">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                <span>审校进度</span>
                <span className="font-medium text-ink-700">{progress}%</span>
              </div>
              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ink-500 to-ink-700 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 bg-ink-700 text-white text-sm font-medium rounded-md hover:bg-ink-800 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">导出报告</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card border border-ink-100 py-1 animate-scale-in origin-top-right">
                <button
                  onClick={() => {
                    exportCsv(manuscript, annotations);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                >
                  导出 CSV 报告
                </button>
                <button
                  onClick={() => {
                    exportJson(manuscript, annotations);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                >
                  导出 JSON 报告
                </button>
                <div className="h-px bg-ink-100 my-1" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full px-4 py-2 text-left text-sm text-ink-400 hover:bg-ink-50 transition-colors"
                >
                  共 {annotations.length} 条批注
                </button>
              </div>
            )}
          </div>

          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md text-ink-600 hover:bg-ink-100 transition-colors"
              aria-label="章节导航"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
                <line x1="3" y1="18" x2="18" y2="18" />
              </svg>
            </button>
          )}

          {onTogglePanel && (
            <button
              onClick={onTogglePanel}
              className="lg:hidden p-2 rounded-md text-ink-600 hover:bg-ink-100 transition-colors"
              aria-label="批注面板"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}
        </div>

        <div className="md:hidden mt-3">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
            <span>审校进度</span>
            <span className="font-medium text-ink-700">{progress}%</span>
          </div>
          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ink-500 to-ink-700 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
