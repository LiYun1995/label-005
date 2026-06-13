import { BookOpen, Search, Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-ink-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ink-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-paper-100" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold tracking-wide text-paper-100">
                墨审稿台
              </h1>
              <p className="text-[11px] text-ink-300 -mt-0.5">电子书稿审校工作台</p>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                placeholder="搜索书稿、作者..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-ink-700/60 border border-ink-600 rounded-md text-ink-100 placeholder:text-ink-400 focus:outline-none focus:border-ink-400 focus:bg-ink-700 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-ink-700 transition-colors">
              <Bell className="w-5 h-5 text-ink-200" />
            </button>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-ink-700 transition-colors">
              <div className="w-7 h-7 rounded-full bg-ink-600 flex items-center justify-center">
                <User className="w-4 h-4 text-ink-200" />
              </div>
              <span className="hidden sm:inline text-sm text-ink-100">编辑 · 沈墨</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
