import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PlusIcon, PencilSquareIcon, HomeIcon } from '@heroicons/react/24/outline';
import { TodoPage } from '../types';

export const MAIN_TAB_ID = 'main';

interface NavbarProps {
  pages: TodoPage[];
  activeId: string;
  onSelect: (id: string) => void;
  onReorderPages: (orderedIds: string[]) => void;
  onAddClick: () => void;
  onEditClick: (pageId: string) => void;
}

export default function Navbar({
  pages,
  activeId,
  onSelect,
  onReorderPages,
  onAddClick,
  onEditClick,
}: NavbarProps) {
  const sortedPages = [...pages].sort((a, b) => a.order - b.order);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const ids = sortedPages.map((p) => p.id);
    const [moved] = ids.splice(result.source.index, 1);
    ids.splice(result.destination.index, 0, moved);
    onReorderPages(ids);
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div
        ref={scrollRef}
        className="flex items-stretch gap-1 px-2 overflow-x-auto no-scrollbar max-w-2xl mx-auto"
      >
        <TabButton
          label="MAIN"
          isActive={activeId === MAIN_TAB_ID}
          onClick={() => onSelect(MAIN_TAB_ID)}
          icon={<HomeIcon className="w-4 h-4" />}
        />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="page-tabs" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex items-stretch"
              >
                {sortedPages.map((page, index) => (
                  <Draggable key={page.id} draggableId={page.id} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                      >
                        <TabButton
                          label={page.name.toUpperCase()}
                          color={page.color}
                          isActive={activeId === page.id}
                          onClick={() => onSelect(page.id)}
                          onEdit={
                            activeId === page.id ? () => onEditClick(page.id) : undefined
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={onAddClick}
          className="shrink-0 flex items-center justify-center px-3 my-2 rounded-xl text-brand-500 active:bg-brand-50 dark:active:bg-gray-800"
          aria-label="새 페이지 추가"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
  color,
  icon,
  onEdit,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
  icon?: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="relative flex items-center shrink-0">
      <button
        onClick={onClick}
        className="relative flex items-center gap-1.5 px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
      >
        <span
          className={
            isActive
              ? 'text-gray-900 dark:text-white flex items-center gap-1.5'
              : 'text-gray-400 dark:text-gray-500 flex items-center gap-1.5'
          }
        >
          {icon}
          {color && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isActive ? color : '#d1d5db' }}
            />
          )}
          {label}
        </span>
        {isActive && (
          <motion.div
            layoutId="active-tab-underline"
            className="absolute left-2 right-2 -bottom-[1px] h-[2.5px] rounded-full"
            style={{ backgroundColor: color ?? '#111827' }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        )}
      </button>
      {onEdit && (
        <button
          onClick={onEdit}
          className="pr-2 text-gray-300 dark:text-gray-600 active:text-gray-500"
          aria-label="페이지 편집"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
