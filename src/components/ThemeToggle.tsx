import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="다크모드 전환"
      className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center px-1 transition-colors"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center"
        style={{ marginLeft: darkMode ? 'auto' : 0 }}
      >
        {darkMode ? (
          <MoonIcon className="w-3.5 h-3.5 text-brand-400" />
        ) : (
          <SunIcon className="w-3.5 h-3.5 text-amber-400" />
        )}
      </motion.div>
    </button>
  );
}
