import { useEffect, useState } from 'react';

/** 값이 바뀔 때마다 0(또는 이전 값)에서 target까지 부드럽게 증가하는 숫자를 반환 */
export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = value;
    const to = target;

    if (from === to) return;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}
