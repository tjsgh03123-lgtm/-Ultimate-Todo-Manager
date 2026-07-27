import { AppData } from '../types';
import { todayDateString, currentMonthString, mondayOfWeekString } from './dateUtils';

/**
 * 앱 실행 시 호출되어 Daily / Weekly / Monthly 페이지의 체크 상태를 필요할 때만 초기화한다.
 * - Daily: 마지막 초기화 날짜(YYYY-MM-DD)가 오늘과 다르면 -> 오늘 초기화
 * - Weekly: 마지막 초기화 기준 '월요일 날짜'가 이번 주 월요일과 다르면 -> 이번 주 초기화
 * - Monthly: 마지막 초기화 월(YYYY-MM)이 이번 달과 다르면 -> 이번 달 초기화
 * Todo 자체는 절대 삭제하지 않고 completed 값만 false로 되돌린다.
 */
export function applyAutoReset(data: AppData): AppData {
  const now = new Date();
  const today = todayDateString(now);
  const monday = mondayOfWeekString(now);
  const month = currentMonthString(now);

  const needsDailyReset = data.lastReset.daily !== today;
  const needsWeeklyReset = data.lastReset.weekly !== monday;
  const needsMonthlyReset = data.lastReset.monthly !== month;

  if (!needsDailyReset && !needsWeeklyReset && !needsMonthlyReset) {
    return data;
  }

  const pages = data.pages.map((page) => {
    const shouldReset =
      (page.resetType === 'daily' && needsDailyReset) ||
      (page.resetType === 'weekly' && needsWeeklyReset) ||
      (page.resetType === 'monthly' && needsMonthlyReset);

    if (!shouldReset) return page;

    return {
      ...page,
      todos: page.todos.map((todo) => ({ ...todo, completed: false })),
    };
  });

  return {
    ...data,
    pages,
    lastReset: {
      daily: needsDailyReset ? today : data.lastReset.daily,
      weekly: needsWeeklyReset ? monday : data.lastReset.weekly,
      monthly: needsMonthlyReset ? month : data.lastReset.monthly,
    },
  };
}
