import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TodoPage } from '../types';
import TodoItem from './TodoItem';
import SearchBar from './SearchBar';
import ProgressBar from './ProgressBar';

interface TodoListProps {
  page: TodoPage;
  onAddTodo: (text: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onEditTodo: (todoId: string, text: string) => void;
  onReorderTodos: (orderedIds: string[]) => void;
}

export default function TodoList({
  page,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onReorderTodos,
}: TodoListProps) {
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');

  const sortedTodos = useMemo(() => [...page.todos].sort((a, b) => a.order - b.order), [page.todos]);

  const filteredTodos = useMemo(() => {
    if (!query.trim()) return sortedTodos;
    const q = query.trim().toLowerCase();
    return sortedTodos.filter((t) => t.text.toLowerCase().includes(q));
  }, [sortedTodos, query]);

  const isSearching = query.trim().length > 0;
  const total = page.todos.length;
  const completed = page.todos.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleSubmit = () => {
    if (!draft.trim()) return;
    onAddTodo(draft);
    setDraft('');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const ids = sortedTodos.map((t) => t.id);
    const [moved] = ids.splice(result.source.index, 1);
    ids.splice(result.destination.index, 0, moved);
    onReorderTodos(ids);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24 space-y-4">
      <div className="rounded-xl2 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: page.color }}
            />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{page.name}</h1>
          </div>
          <span className="text-sm font-semibold tabular-nums" style={{ color: page.color }}>
            {completed} / {total} ({percent}%)
          </span>
        </div>
        <ProgressBar percent={percent} color={page.color} height={7} />
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder={`${page.name}에서 검색`} />

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="할 일 추가하고 Enter"
          className="flex-1 bg-white dark:bg-gray-900 shadow-card dark:shadow-card-dark rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-400 transition-shadow"
        />
        <button
          onClick={handleSubmit}
          disabled={!draft.trim()}
          className="shrink-0 w-11 h-11 rounded-xl bg-brand-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 flex items-center justify-center active:scale-95 transition-transform shadow-card"
          aria-label="할 일 추가"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {isSearching && (
        <p className="text-xs text-gray-400 px-1">
          검색 중에는 순서 변경이 비활성화됩니다. ({filteredTodos.length}개 검색됨)
        </p>
      )}

      {filteredTodos.length === 0 ? (
        <div className="text-center text-gray-400 dark:text-gray-500 py-16">
          {isSearching ? '검색 결과가 없어요.' : '할 일을 추가해보세요!'}
        </div>
      ) : isSearching ? (
        <div role="list" className="space-y-2">
          <AnimatePresence initial={false}>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                color={page.color}
                onToggle={() => onToggleTodo(todo.id)}
                onDelete={() => onDeleteTodo(todo.id)}
                onEdit={(text) => onEditTodo(todo.id, text)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`todos-${page.id}`}>
            {(provided) => (
              <div
                role="list"
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                <AnimatePresence initial={false}>
                  {filteredTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          style={dragProvided.draggableProps.style}
                        >
                          <TodoItem
                            todo={todo}
                            color={page.color}
                            onToggle={() => onToggleTodo(todo.id)}
                            onDelete={() => onDeleteTodo(todo.id)}
                            onEdit={(text) => onEditTodo(todo.id, text)}
                            dragHandleProps={dragProvided.dragHandleProps}
                            isDragging={dragSnapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
