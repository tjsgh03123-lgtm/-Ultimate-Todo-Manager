export const STORAGE_KEY = 'ultimate-todo-manager-data';

export function loadFromStorage<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('LocalStorage 읽기 실패:', err);
    return null;
  }
}

export function saveToStorage<T>(data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage 저장 실패:', err);
  }
}

/** 현재 데이터를 JSON 파일로 다운로드 (백업) */
export function exportBackup<T>(data: T): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate()
  ).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
  a.href = url;
  a.download = `todo-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** JSON 파일을 읽어 파싱된 객체를 Promise로 반환 (복원) */
export function importBackup<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as T;
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
