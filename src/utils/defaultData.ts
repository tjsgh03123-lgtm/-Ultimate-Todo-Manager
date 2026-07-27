import { AppData, TodoPage } from '../types';
import { generateId } from './id';
import { todayDateString, currentMonthString, mondayOfWeekString } from './dateUtils';

function createDefaultPage(
  defaultKind: 'daily' | 'weekly' | 'monthly',
  name: string,
  color: string,
  order: number
): TodoPage {
  return {
    id: generateId(),
    name,
    defaultKind,
    resetType: defaultKind,
    color,
    order,
    todos: [],
    isDefault: true,
  };
}

export function createInitialAppData(): AppData {
  return {
    version: 1,
    darkMode:
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    pages: [
      createDefaultPage('daily', 'Daily', '#3b82f6', 0),
      createDefaultPage('weekly', 'Weekly', '#10b981', 1),
      createDefaultPage('monthly', 'Monthly', '#f59e0b', 2),
    ],
    lastReset: {
      daily: todayDateString(),
      weekly: mondayOfWeekString(),
      monthly: currentMonthString(),
    },
  };
}
