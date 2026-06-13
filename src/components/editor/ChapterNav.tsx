import { ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { Chapter } from '@/types';
import { useAnnotationStore } from '@/store/annotationStore';

interface ChapterNavProps {
  chapters: Chapter[];
  activeChapterId: string;
  activePageId: string;
  onSelectChapter: (chapterId: string) => void;
  onSelectPage: (chapterId: string, pageId: string) => void;
}

export function ChapterNav({
  chapters,
  activeChapterId,
  activePageId,
  onSelectChapter,
  onSelectPage,
}: ChapterNavProps) {
  const { getByChapter } = useAnnotationStore();

  return (
    <nav className="h-full overflow-y-auto scrollbar-thin py-4 px-3">
      <div className="px-2 mb-3">
        <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wider">章节目录</h2>
      </div>
      <ul className="space-y-1">
        {chapters.map((chapter) => {
          const chapterAnns = getByChapter(chapter.id);
          const isActive = chapter.id === activeChapterId;
          const chapterReviewed = chapterAnns.length > 0;
          return (
            <li key={chapter.id}>
              <button
                onClick={() => onSelectChapter(chapter.id)}
                className={clsx(
                  'w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors group',
                  isActive ? 'bg-ink-100 text-ink-900 font-medium' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-800'
                )}
              >
                <ChevronRight
                  className={clsx(
                    'w-3.5 h-3.5 text-ink-400 flex-shrink-0 transition-transform',
                    isActive && 'rotate-90'
                  )}
                />
                <span className="flex-1 text-left truncate">{chapter.title}</span>
                {chapterReviewed && (
                  <span className="text-[10px] text-ink-400">
                    {chapterAnns.length}
                  </span>
                )}
              </button>

              {isActive && (
                <ul className="ml-5 mt-1 space-y-0.5 animate-fade-in">
                  {chapter.pages.map((page) => {
                    const pageAnns = chapterAnns.filter((a) => a.pageId === page.id);
                    const isPageActive = page.id === activePageId;
                    return (
                      <li key={page.id}>
                        <button
                          onClick={() => onSelectPage(chapter.id, page.id)}
                          className={clsx(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors',
                            isPageActive
                              ? 'bg-ink-700 text-white'
                              : 'text-ink-500 hover:bg-ink-100 hover:text-ink-700'
                          )}
                        >
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          <span className="flex-1 text-left">第 {page.pageNumber} 页</span>
                          {pageAnns.length > 0 ? (
                            <CheckCircle2
                              className={clsx(
                                'w-3 h-3 flex-shrink-0',
                                isPageActive ? 'text-white/80' : 'text-green-500'
                              )}
                            />
                          ) : (
                            <span className="w-3 h-3" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
