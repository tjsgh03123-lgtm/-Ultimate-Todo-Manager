import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { PAGE_COLORS, ResetType, TodoPage } from '../types';

interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, resetType: ResetType, color: string) => void;
  onUpdate?: (pageId: string, name: string, color: string) => void;
  onDelete?: (pageId: string) => void;
  editingPage?: TodoPage | null;
}

const RESET_OPTIONS: { value: ResetType; label: string; desc: string }[] = [
  { value: 'daily', label: 'Daily', desc: '매일 체크만 자동 해제' },
  { value: 'weekly', label: 'Weekly', desc: '매주 월요일 체크만 자동 해제' },
  { value: 'monthly', label: 'Monthly', desc: '매월 1일 체크만 자동 해제' },
  { value: 'none', label: '없음', desc: '자동 초기화하지 않음' },
];

export default function AddPageModal({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  editingPage,
}: AddPageModalProps) {
  const isEditMode = Boolean(editingPage);
  const [name, setName] = useState(editingPage?.name ?? '');
  const [resetType, setResetType] = useState<ResetType>(editingPage?.resetType ?? 'none');
  const [color, setColor] = useState(editingPage?.color ?? PAGE_COLORS[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 모달은 언마운트되지 않고 계속 재사용되므로, 열릴 때마다(또는 편집 대상이 바뀔 때마다)
  // 입력값을 편집 대상 페이지 기준으로 다시 동기화한다.
  useEffect(() => {
    if (!isOpen) return;
    if (editingPage) {
      setName(editingPage.name);
      setResetType(editingPage.resetType);
      setColor(editingPage.color);
    } else {
      setName('');
      setResetType('none');
      setColor(PAGE_COLORS[0]);
    }
    setConfirmDelete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingPage]);

  const reset = () => {
    setName('');
    setResetType('none');
    setColor(PAGE_COLORS[0]);
    setConfirmDelete(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (isEditMode && editingPage && onUpdate) {
      onUpdate(editingPage.id, name, color);
    } else {
      onCreate(name, resetType, color);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (editingPage && onDelete) {
      onDelete(editingPage.id);
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEditMode ? '페이지 편집' : '새 페이지 만들기'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 active:text-gray-600 p-1"
                aria-label="닫기"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 block">
                  페이지 이름
                </label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                  }}
                  placeholder="예: 운동, 독서, 프로젝트"
                  maxLength={20}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {!isEditMode && (
                <div>
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 block">
                    초기화 방식
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {RESET_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setResetType(opt.value)}
                        className={`text-left rounded-xl border-2 px-3 py-2 transition-colors ${
                          resetType === opt.value
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-transparent bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 block">
                  페이지 색상
                </label>
                <div className="flex flex-wrap gap-2">
                  {PAGE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
                      style={{ backgroundColor: c }}
                      aria-label={`색상 ${c}`}
                    >
                      {color === c && <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              {isEditMode && editingPage && !editingPage.isDefault && onDelete && (
                <button
                  onClick={confirmDelete ? handleDelete : () => setConfirmDelete(true)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    confirmDelete
                      ? 'bg-red-500 text-white'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                  }`}
                >
                  <TrashIcon className="w-4 h-4" />
                  {confirmDelete ? '정말 삭제?' : '삭제'}
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="flex-1 bg-brand-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 rounded-xl py-2.5 text-sm font-semibold active:scale-[0.98] transition-transform"
              >
                {isEditMode ? '저장' : '만들기'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
