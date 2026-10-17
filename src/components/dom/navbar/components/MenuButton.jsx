import PerspectiveText from '@src/components/animationComponents/perspectiveText/Index';
import styles from '@src/components/dom/navbar/styles/menuButton.module.scss';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function MenuButton() {
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading] = useStore(useShallow((state) => [state.isMenuOpen, state.setIsMenuOpen, state.lenis, state.isLoading]));

  const handleClick = useCallback(() => {
    if (!isLoading) {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
        lenis?.stop();
      }
    }
  }, [isLoading, isMenuOpen, setIsMenuOpen, lenis]);

  return (
    <button type="button" onClick={handleClick} aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'} aria-expanded={isMenuOpen} aria-controls="menu" className={styles.button}>
      <PerspectiveText label={isMenuOpen ? 'Close' : 'Menu'} className={styles.label} />
    </button>
  );
}

export default MenuButton;
