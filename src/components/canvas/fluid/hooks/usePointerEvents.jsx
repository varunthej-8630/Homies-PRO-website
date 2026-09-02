import { useEffect, useRef } from 'react';
import { Vector2 } from 'three';

const usePointerEvents = (mainRef, size, force) => {
  const splatStack = useRef([]);
  const lastMouse = useRef(new Vector2());
  const hasMoved = useRef(false);
  const sizeRef = useRef(size);
  const forceRef = useRef(force);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    forceRef.current = force;
  }, [force]);

  useEffect(() => {
    if (!mainRef.current) {
      return undefined;
    }

    const element = mainRef.current;

    const handlePointerMove = (event) => {
      const clientX = event.clientX ?? event.touches?.[0]?.clientX;
      const clientY = event.clientY ?? event.touches?.[0]?.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const currentSize = sizeRef.current;
      const currentForce = forceRef.current;

      if (!currentSize?.width || !currentSize?.height) return;

      const deltaX = clientX - lastMouse.current.x;
      const deltaY = clientY - lastMouse.current.y;

      if (!hasMoved.current) {
        hasMoved.current = true;
        lastMouse.current.set(clientX, clientY);
        return;
      }

      lastMouse.current.set(clientX, clientY);

      if (splatStack.current.length < 16) {
        splatStack.current.push({
          mouseX: clientX / currentSize.width,
          mouseY: 1.0 - clientY / currentSize.height,
          velocityX: deltaX * currentForce,
          velocityY: -deltaY * currentForce,
        });
      }
    };

    element.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    return () => {
      element.removeEventListener('pointermove', handlePointerMove);
    };
  }, [mainRef]);

  return splatStack;
};

export default usePointerEvents;
