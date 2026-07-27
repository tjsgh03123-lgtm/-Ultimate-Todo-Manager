import { useEffect } from 'react';

/** darkMode 값에 따라 <html> 요소에 'dark' 클래스를 동기화한다 (Tailwind darkMode: 'class') */
export function useTheme(darkMode: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);
}
