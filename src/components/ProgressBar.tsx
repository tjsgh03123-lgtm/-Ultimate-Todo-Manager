import { motion } from 'framer-motion';

interface ProgressBarProps {
  percent: number; // 0 ~ 100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  percent,
  color = '#3b82f6',
  height = 8,
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="w-full">
      <div
        className="w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 text-right">
          {clamped}%
        </div>
      )}
    </div>
  );
}
