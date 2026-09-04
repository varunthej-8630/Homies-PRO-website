import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import clsx from 'clsx';
import styles from '@src/pages/about/components/hero/styles/hero.module.scss';

function Hero() {
  return (
    <section className={clsx(styles.root, 'layout-block-inner')}>
      <header className={styles.titleContainer}>
        <AppearTitle>
          <h1 className={clsx(styles.title, 'h2')}>Building ideas, academic requirements, and real-world problems into working technology.</h1>
        </AppearTitle>
      </header>
    </section>
  );
}

export default Hero;
