import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { CheckIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  color: string;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
}

export default function TodoItem({
  todo,
  color,
  onToggle,
  onDelete,
  onEdit,
  dragHandleProps,
  isDragging,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commitEdit = () => {
    if (draft.trim() && draft.trim() !== todo.text) {
      onEdit(draft.trim());
    } else {
      setDraft(todo.text);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      role="listitem"
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl px-3 py-3 shadow-card dark:shadow-card-dark ${
        isDragging ? 'ring-2 ring-brand-400' : ''
      }`}
    >
      <button
        {...dragHandleProps}
        className="touch-none text-gray-300 dark:text-gray-600 active:text-gray-400 shrink-0 px-1 cursor-grab active:cursor-grabbing"
        aria-label="순서 변경"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      <button
        onClick={onToggle}
        className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
        style={{
          borderColor: todo.completed ? color : '#d1d5db',
          backgroundColor: todo.completed ? color : 'transparent',
        }}
        aria-label={todo.completed ? '완료 취소' : '완료 체크'}
      >
        {todo.completed && <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitEdit();
            }
            if (e.key === 'Escape') {
              setDraft(todo.text);
              setIsEditing(false);
            }
          }}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white border-b border-brand-400"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 break-all cursor-text select-none ${
            todo.completed
              ? 'line-through text-gray-400 dark:text-gray-600'
              : 'text-gray-800 dark:text-gray-100'
          }`}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={onDelete}
        className="shrink-0 text-gray-300 dark:text-gray-600 active:text-red-500 p-1"
        aria-label="삭제"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
