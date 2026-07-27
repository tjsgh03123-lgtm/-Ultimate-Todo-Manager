import { motion } from 'framer-motion';
import { TodoPage } from '../types';
import ProgressBar from './ProgressBar';
import { useCountUp } from '../hooks/useCountUp';
import { formatDisplayDate } from '../utils/dateUtils';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

interface DashboardProps {
  pages: TodoPage[];
  onNavigate: (pageId: string) => void;
}

function pageStats(page: TodoPage) {
  const total = page.todos.length;
  const completed = page.todos.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}

function OverallSummary({ pages }: { pages: TodoPage[] }) {
  const totals = pages.reduce(
    (acc, page) => {
      const { total, completed } = pageStats(page);
      return { total: acc.total + total, completed: acc.completed + completed };
    },
    { total: 0, completed: 0 }
  );
  const percent = totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100);
  const animatedPercent = useCountUp(percent);
  const animatedCompleted = useCountUp(totals.completed);

  return (
    <div className="rounded-xl2 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <CalendarDaysIcon className="w-4 h-4" />
          <span className="text-xs font-medium">{formatDisplayDate()}</span>
        </div>
      </div>
      <div className="flex items-end justify-between mt-3 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">전체 달성률</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
            {animatedPercent}
            <span className="text-xl align-top ml-0.5">%</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">완료</p>
          <p className="text-lg font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
            {animatedCompleted}
            <span className="text-gray-400 dark:text-gray-500"> / {totals.total}</span>
          </p>
        </div>
      </div>
      <ProgressBar percent={percent} color="#3b82f6" height={10} />
    </div>
  );
}

function PageCard({ page, index, onClick }: { page: TodoPage; index: number; onClick: () => void }) {
  const { total, completed, percent } = pageStats(page);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left rounded-xl2 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark p-5 active:shadow-none transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: page.color }}
          />
          <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[9rem]">
            {page.name}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-400 dark:text-gray-500 tabular-nums">
          {completed} / {total}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar percent={percent} color={page.color} height={7} />
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color: page.color }}>
          {percent}%
        </span>
      </div>
    </motion.button>
  );
}

export default function Dashboard({ pages, onNavigate }: DashboardProps) {
  const sortedPages = [...pages].sort((a, b) => a.order - b.order);

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
      <OverallSummary pages={pages} />

      <div>
        <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3 px-1">
          페이지별 현황
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedPages.map((page, index) => (
            <PageCard key={page.id} page={page} index={index} onClick={() => onNavigate(page.id)} />
          ))}
        </div>
      </div>

      {sortedPages.length === 0 && (
        <div className="text-center text-gray-400 dark:text-gray-500 py-16">
          아직 페이지가 없어요. + 버튼으로 새 페이지를 만들어보세요.
        </div>
      )}
    </div>
  );
}
