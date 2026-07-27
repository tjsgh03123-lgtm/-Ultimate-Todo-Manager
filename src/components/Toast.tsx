import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toast: ToastState | null;
}

export default function Toast({ toast }: ToastProps) {
  return (
    <div className="fixed top-4 inset-x-0 z-[60] flex justify-center pointer-events-none px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center gap-2 bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 px-4 py-2.5 rounded-full shadow-floating text-sm font-medium"
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            ) : (
              <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
