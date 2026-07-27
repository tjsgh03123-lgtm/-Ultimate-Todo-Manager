/** 충돌 가능성이 매우 낮은 고유 ID 생성 (crypto.randomUUID 대체 포함) */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
