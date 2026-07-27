import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = '검색' }: SearchBarProps) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-400 transition-shadow"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:text-gray-500"
          aria-label="검색어 지우기"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
