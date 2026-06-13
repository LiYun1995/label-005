import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { BookMarked } from 'lucide-react';
import { Toolbar } from '@/components/editor/Toolbar';
import { ChapterNav } from '@/components/editor/ChapterNav';
import { ContentViewer } from '@/components/editor/ContentViewer';
import { AnnotationPanel } from '@/components/editor/AnnotationPanel';
import { useManuscriptStore } from '@/store/manuscriptStore';
import { useAnnotationStore } from '@/store/annotationStore';
import type { SelectionInfo } from '@/utils';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getManuscript, updateManuscript } = useManuscriptStore();
  const { getByManuscript, getByPage, activeAnnotationId, setActiveAnnotationId } = useAnnotationStore();

  const manuscript = getManuscript(id || '');
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [activePageId, setActivePageId] = useState<string>('');
  const [pendingSelection, setPendingSelection] = useState<SelectionInfo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    if (!manuscript) return;
    if (!activeChapterId) {
      const first = manuscript.chapters[0];
      if (first) {
        setActiveChapterId(first.id);
        if (first.pages[0]) setActivePageId(first.pages[0].id);
      }
    }
    if (manuscript.status === 'pending') {
      updateManuscript(manuscript.id, { status: 'in_progress' });
    }
  }, [manuscript, activeChapterId]);

  const annotations = useMemo(
    () => (manuscript ? getByManuscript(manuscript.id) : []),
    [manuscript, getByManuscript]
  );

  const currentChapter = useMemo(
    () => manuscript?.chapters.find((c) => c.id === activeChapterId),
    [manuscript, activeChapterId]
  );

  const currentPage = useMemo(() => {
    if (!currentChapter) return undefined;
    return currentChapter.pages.find((p) => p.id === activePageId) || currentChapter.pages[0];
  }, [currentChapter, activePageId]);

  const pageAnnotations = useMemo(
    () => (currentPage ? getByPage(currentPage.id) : []),
    [currentPage, getByPage]
  );

  const progress = useMemo(() => {
    if (!manuscript || manuscript.totalPages === 0) return 0;
    const uniquePages = new Set(annotations.map((a) => a.pageId));
    const reviewedPages = Math.min(manuscript.totalPages, Math.max(manuscript.reviewedPages, uniquePages.size));
    return Math.round((reviewedPages / manuscript.totalPages) * 100);
  }, [manuscript, annotations]);

  useEffect(() => {
    if (!manuscript) return;
    const uniquePages = new Set(annotations.map((a) => a.pageId));
    const reviewedPages = Math.min(manuscript.totalPages, Math.max(manuscript.reviewedPages, uniquePages.size));
    if (reviewedPages !== manuscript.reviewedPages) {
      updateManuscript(manuscript.id, {
        reviewedPages,
        status: reviewedPages >= manuscript.totalPages ? 'completed' : 'in_progress',
      });
    }
  }, [annotations]);

  if (!manuscript || !currentChapter || !currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="text-center">
          <BookMarked className="w-12 h-12 mx-auto mb-4 text-ink-300" />
          <h2 className="text-lg text-ink-600 mb-2">书稿不存在</h2>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-ink-500 hover:text-ink-700 underline"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const allPages = manuscript.chapters.flatMap((c) => c.pages);
  const currentPageIdx = allPages.findIndex((p) => p.id === currentPage.id);

  function selectChapter(chapterId: string) {
    setActiveChapterId(chapterId);
    const ch = manuscript.chapters.find((c) => c.id === chapterId);
    if (ch && ch.pages[0]) setActivePageId(ch.pages[0].id);
    setSidebarOpen(false);
  }

  function selectPage(chapterId: string, pageId: string) {
    setActiveChapterId(chapterId);
    setActivePageId(pageId);
    setSidebarOpen(false);
  }

  function prevPage() {
    const idx = allPages.findIndex((p) => p.id === currentPage.id);
    if (idx > 0) {
      const prev = allPages[idx - 1];
      setActivePageId(prev.id);
      const ch = manuscript.chapters.find((c) => c.id === prev.chapterId);
      if (ch) setActiveChapterId(ch.id);
    }
  }

  function nextPage() {
    const idx = allPages.findIndex((p) => p.id === currentPage.id);
    if (idx < allPages.length - 1) {
      const next = allPages[idx + 1];
      setActivePageId(next.id);
      const ch = manuscript.chapters.find((c) => c.id === next.chapterId);
      if (ch) setActiveChapterId(ch.id);
    }
  }

  function handleSelectAnnotation(id: string) {
    setActiveAnnotationId(id);
    setPanelOpen(true);
  }

  function handleAddAnnotation(sel: SelectionInfo) {
    setPendingSelection(sel);
    setPanelOpen(true);
    setActiveAnnotationId(null);
  }

  return (
    <div className="h-screen flex flex-col bg-ink-50 overflow-hidden">
      <Toolbar
        manuscript={manuscript}
        currentChapterTitle={currentChapter.title}
        progress={progress}
        annotations={annotations}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onTogglePanel={() => setPanelOpen((v) => !v)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 章节导航侧栏 */}
        <aside
          className={clsx(
            'fixed md:relative z-20 md:z-0 h-full w-60 bg-white border-r border-ink-100 transition-transform duration-300 md:translate-x-0 flex-shrink-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}
        >
          <ChapterNav
            chapters={manuscript.chapters}
            activeChapterId={activeChapterId}
            activePageId={activePageId}
            onSelectChapter={selectChapter}
            onSelectPage={selectPage}
          />
        </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 原文显示区 */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <ContentViewer
            page={currentPage}
            annotations={pageAnnotations}
            activeAnnotationId={activeAnnotationId}
            totalPages={allPages.length}
            currentPageIdx={currentPageIdx}
            chapterTitle={currentChapter.title}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            onSelectAnnotation={handleSelectAnnotation}
            onAddAnnotation={handleAddAnnotation}
          />
        </main>

        {/* 批注面板 */}
        {panelOpen && (
          <aside className="w-full lg:w-96 xl:w-[420px] h-full lg:relative z-30 lg:z-0 fixed lg:static bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-auto max-h-[60vh] lg:max-h-none rounded-t-2xl lg:rounded-none shadow-2xl lg:shadow-none overflow-hidden">
            <AnnotationPanel
              manuscript={manuscript}
              currentChapterId={activeChapterId}
              currentPageId={activePageId}
              currentChapterTitle={currentChapter.title}
              currentPageNumber={currentPage.pageNumber}
              pendingSelection={pendingSelection}
              activeAnnotationId={activeAnnotationId}
              onClose={() => setPanelOpen(false)}
              onActivate={handleSelectAnnotation}
              onClearPending={() => setPendingSelection(null)}
            />
          </aside>
        )}
        {panelOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
