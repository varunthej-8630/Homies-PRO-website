import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from 'react-use';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

const useIntersected = (ref, threshold = 0) => {
  // Default to true so all content is immediately visible by default
  const [intersected, setIntersected] = useState(true);
  const intersectionOptions = useMemo(() => ({ threshold }), [threshold]);
  const intersection = useIntersection(ref, intersectionOptions);

  useIsomorphicLayoutEffect(() => {
    if (intersection?.isIntersecting) {
      setIntersected(true);
    }
  }, [intersection]);

  // Safety net: force visible state after 300ms on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntersected(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return intersected;
};

export default useIntersected;
