export type ResetType = 'daily' | 'weekly' | 'monthly' | 'none';

export type DefaultPageKind = 'daily' | 'weekly' | 'monthly';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  order: number;
  createdAt: string;
}

export interface TodoPage {
  id: string;
  name: string;
  /** 기본 제공 페이지(daily/weekly/monthly)인 경우에만 값이 존재. custom 페이지는 undefined */
  defaultKind?: DefaultPageKind;
  resetType: ResetType;
  color: string;
  order: number;
  todos: Todo[];
  isDefault: boolean;
}

export interface LastResetInfo {
  /** 마지막으로 daily 초기화를 수행한 날짜 (YYYY-MM-DD) */
  daily: string | null;
  /** 마지막으로 weekly 초기화를 수행한 날짜 (YYYY-MM-DD, 해당 주의 월요일 날짜) */
  weekly: string | null;
  /** 마지막으로 monthly 초기화를 수행한 날짜 (YYYY-MM) */
  monthly: string | null;
}

export interface AppData {
  version: number;
  darkMode: boolean;
  pages: TodoPage[];
  lastReset: LastResetInfo;
}

export const PAGE_COLORS: string[] = [
  '#3b82f6', // blue
  '#0ea5e9', // sky
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#84cc16', // lime
  '#f59e0b', // amber
  '#f97316', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#a855f7', // purple
  '#6366f1', // indigo
  '#64748b', // slate
];
