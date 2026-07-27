import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Navbar, { MAIN_TAB_ID } from './components/Navbar';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import AddPageModal from './components/AddPageModal';
import SettingsModal from './components/SettingsModal';
import Toast, { ToastState } from './components/Toast';
import { useAppData } from './hooks/useAppData';
import { useTheme } from './hooks/useTheme';
import { AppData, TodoPage } from './types';
import { exportBackup, importBackup } from './utils/storage';

export default function App() {
  const {
    data,
    toggleDarkMode,
    addPage,
    deletePage,
    renamePage,
    changePageColor,
    reorderPages,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    reorderTodos,
    restoreData,
  } = useAppData();

  useTheme(data.darkMode);

  const [activeId, setActiveId] = useState<string>(MAIN_TAB_ID);
  const [direction, setDirection] = useState(1);
  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<TodoPage | null>(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const sortedPages = useMemo(() => [...data.pages].sort((a, b) => a.order - b.order), [data.pages]);

  const tabOrder = useMemo(() => [MAIN_TAB_ID, ...sortedPages.map((p) => p.id)], [sortedPages]);

  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const navigateTo = (id: string) => {
    const currentIndex = tabOrder.indexOf(activeId);
    const nextIndex = tabOrder.indexOf(id);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveId(id);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = tabOrder.indexOf(activeId);
      if (currentIndex < tabOrder.length - 1) {
        setDirection(1);
        setActiveId(tabOrder[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      const currentIndex = tabOrder.indexOf(activeId);
      if (currentIndex > 0) {
        setDirection(-1);
        setActiveId(tabOrder[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: true,
    delta: 60,
  });

  const activePage = sortedPages.find((p) => p.id === activeId) ?? null;

  const handleOpenCreateModal = () => {
    setEditingPage(null);
    setPageModalOpen(true);
  };

  const handleOpenEditModal = (pageId: string) => {
    const page = sortedPages.find((p) => p.id === pageId) ?? null;
    setEditingPage(page);
    setPageModalOpen(true);
  };

  const handleDeletePage = (pageId: string) => {
    if (activeId === pageId) setActiveId(MAIN_TAB_ID);
    deletePage(pageId);
    showToast('페이지를 삭제했어요');
  };

  const handleExport = () => {
    exportBackup<AppData>(data);
    showToast('백업 파일을 다운로드했어요');
  };

  const handleImport = async (file: File) => {
    try {
      const parsed = await importBackup<AppData>(file);
      if (!parsed || !Array.isArray(parsed.pages)) {
        throw new Error('invalid');
      }
      restoreData(parsed);
      setActiveId(MAIN_TAB_ID);
      showToast('백업을 복원했어요');
    } catch (err) {
      showToast('올바른 백업 파일이 아니에요', 'error');
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Toast toast={toast} />

      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-1 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Ultimate Todo
          </h1>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 -mr-2 text-gray-500 dark:text-gray-400 active:text-gray-700"
            aria-label="설정 열기"
          >
            <Cog6ToothIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <Navbar
        pages={sortedPages}
        activeId={activeId}
        onSelect={navigateTo}
        onReorderPages={reorderPages}
        onAddClick={handleOpenCreateModal}
        onEditClick={handleOpenEditModal}
      />

      <main {...swipeHandlers} className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={activeId}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeId === MAIN_TAB_ID ? (
              <Dashboard pages={sortedPages} onNavigate={navigateTo} />
            ) : activePage ? (
              <TodoList
                page={activePage}
                onAddTodo={(text) => addTodo(activePage.id, text)}
                onToggleTodo={(todoId) => toggleTodo(activePage.id, todoId)}
                onDeleteTodo={(todoId) => deleteTodo(activePage.id, todoId)}
                onEditTodo={(todoId, text) => editTodo(activePage.id, todoId, text)}
                onReorderTodos={(orderedIds) => reorderTodos(activePage.id, orderedIds)}
              />
            ) : (
              <div className="p-8 text-center text-gray-400">페이지를 찾을 수 없어요.</div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AddPageModal
        isOpen={isPageModalOpen}
        onClose={() => setPageModalOpen(false)}
        onCreate={(name, resetType, color) => {
          addPage(name, resetType, color);
          showToast('새 페이지를 만들었어요');
        }}
        onUpdate={(pageId, name, color) => {
          renamePage(pageId, name);
          changePageColor(pageId, color);
          showToast('페이지를 수정했어요');
        }}
        onDelete={handleDeletePage}
        editingPage={editingPage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={data.darkMode}
        onToggleDarkMode={toggleDarkMode}
        onExport={handleExport}
        onImportFile={handleImport}
      />
    </div>
  );
}
