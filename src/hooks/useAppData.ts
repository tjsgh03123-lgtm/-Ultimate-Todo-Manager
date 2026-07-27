import { useCallback, useEffect, useState } from 'react';
import { AppData, ResetType, Todo, TodoPage } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { createInitialAppData } from '../utils/defaultData';
import { applyAutoReset } from '../utils/resetLogic';
import { generateId } from '../utils/id';

function initializeData(): AppData {
  const loaded = loadFromStorage<AppData>();
  const base = loaded ?? createInitialAppData();
  return applyAutoReset(base);
}

export function useAppData() {
  const [data, setData] = useState<AppData>(initializeData);

  // 변경사항 즉시 LocalStorage 저장 (새로고침/앱 종료 후에도 유지)
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  // 앱이 백그라운드에 있다가 날짜가 바뀐 채로 돌아왔을 때도 자동 초기화되도록 주기 점검
  useEffect(() => {
    const check = () => setData((prev) => applyAutoReset(prev));
    const interval = setInterval(check, 60_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const toggleDarkMode = useCallback(() => {
    setData((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const addPage = useCallback((name: string, resetType: ResetType, color: string) => {
    setData((prev) => {
      const maxOrder = prev.pages.reduce((max, p) => Math.max(max, p.order), -1);
      const newPage: TodoPage = {
        id: generateId(),
        name: name.trim() || '새 페이지',
        resetType,
        color,
        order: maxOrder + 1,
        todos: [],
        isDefault: false,
      };
      return { ...prev, pages: [...prev.pages, newPage] };
    });
  }, []);

  const deletePage = useCallback((pageId: string) => {
    setData((prev) => ({
      ...prev,
      pages: prev.pages.filter((p) => p.id !== pageId || p.isDefault),
    }));
  }, []);

  const renamePage = useCallback((pageId: string, name: string) => {
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.id === pageId ? { ...p, name: name.trim() || p.name } : p)),
    }));
  }, []);

  const changePageColor = useCallback((pageId: string, color: string) => {
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.id === pageId ? { ...p, color } : p)),
    }));
  }, []);

  const reorderPages = useCallback((orderedIds: string[]) => {
    setData((prev) => {
      const idToPage = new Map(prev.pages.map((p) => [p.id, p]));
      const reordered = orderedIds
        .map((id) => idToPage.get(id))
        .filter((p): p is TodoPage => Boolean(p))
        .map((p, index) => ({ ...p, order: index }));
      return { ...prev, pages: reordered };
    });
  }, []);

  const addTodo = useCallback((pageId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => {
        if (p.id !== pageId) return p;
        const maxOrder = p.todos.reduce((max, t) => Math.max(max, t.order), -1);
        const newTodo: Todo = {
          id: generateId(),
          text: trimmed,
          completed: false,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        return { ...p, todos: [...p.todos, newTodo] };
      }),
    }));
  }, []);

  const deleteTodo = useCallback((pageId: string, todoId: string) => {
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId ? { ...p, todos: p.todos.filter((t) => t.id !== todoId) } : p
      ),
    }));
  }, []);

  const toggleTodo = useCallback((pageId: string, todoId: string) => {
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId
          ? {
              ...p,
              todos: p.todos.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t)),
            }
          : p
      ),
    }));
  }, []);

  const editTodo = useCallback((pageId: string, todoId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId
          ? { ...p, todos: p.todos.map((t) => (t.id === todoId ? { ...t, text: trimmed } : t)) }
          : p
      ),
    }));
  }, []);

  const reorderTodos = useCallback((pageId: string, orderedTodoIds: string[]) => {
    setData((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => {
        if (p.id !== pageId) return p;
        const idToTodo = new Map(p.todos.map((t) => [t.id, t]));
        const reordered = orderedTodoIds
          .map((id) => idToTodo.get(id))
          .filter((t): t is Todo => Boolean(t))
          .map((t, index) => ({ ...t, order: index }));
        return { ...p, todos: reordered };
      }),
    }));
  }, []);

  const restoreData = useCallback((newData: AppData) => {
    setData(applyAutoReset(newData));
  }, []);

  return {
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
  };
}
