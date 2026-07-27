/** 로컬 타임존 기준 YYYY-MM-DD 문자열 반환 */
export function todayDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 로컬 타임존 기준 YYYY-MM 문자열 반환 */
export function currentMonthString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/** 주어진 날짜가 속한 주(월요일 시작)의 월요일 날짜 문자열(YYYY-MM-DD)을 반환 */
export function mondayOfWeekString(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0(일) ~ 6(토)
  const diff = day === 0 ? -6 : 1 - day; // 월요일까지의 차이
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return todayDateString(d);
}

export function formatDisplayDate(date: Date = new Date()): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayName = days[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dayName})`;
}
