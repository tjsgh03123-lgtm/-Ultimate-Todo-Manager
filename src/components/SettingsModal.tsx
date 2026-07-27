import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  darkMode,
  onToggleDarkMode,
  onExport,
  onImportFile,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed inset-x-4 bottom-4 sm:inset-x-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-floating p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">설정</h2>
              <button
                onClick={onClose}
                className="text-gray-400 active:text-gray-600 p-1"
                aria-label="닫기"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">다크 모드</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">설정은 자동 저장됩니다</p>
              </div>
              <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
            </div>

            <div className="py-3 space-y-2">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                데이터 백업 / 복원
              </p>
              <button
                onClick={onExport}
                className="w-full flex items-center gap-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 active:scale-[0.98] transition-transform"
              >
                <ArrowDownTrayIcon className="w-5 h-5 text-brand-500" />
                JSON으로 백업하기
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 active:scale-[0.98] transition-transform"
              >
                <ArrowUpTrayIcon className="w-5 h-5 text-brand-500" />
                JSON 파일에서 복원하기
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImportFile(file);
                  e.target.value = '';
                }}
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed pt-1">
                복원 시 현재 데이터는 백업 파일의 내용으로 완전히 대체됩니다.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
