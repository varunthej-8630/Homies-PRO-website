import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function useScroll(callback, deps = []) {
  const [lenis] = useStore(useShallow((state) => [state.lenis]));
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useIsomorphicLayoutEffect(() => {
    if (!lenis) return undefined;
    const scrollHandler = (e) => {
      callbackRef.current?.(e);
    };

    lenis.on('scroll', scrollHandler);
    lenis.emit();

    return () => {
      lenis.off('scroll', scrollHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, ...deps]);
}
export default useScroll;
