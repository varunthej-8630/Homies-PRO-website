/* eslint-disable react/jsx-props-no-spreading */

import '@src/styles/global.scss';
import '@src/styles/global.css';

import * as THREE from 'three';

import { useMemo, useRef } from 'react';

import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '@src/context/AuthContext';
import Background from '@src/components/canvas/background/Index';
import { Canvas } from '@react-three/fiber';
import ConversationModal from '@src/components/dom/conversationModal/Index';
import { EffectComposer } from '@react-three/postprocessing';
import Fluid from '@src/components/canvas/fluid/Fluid';
import Layout from '@src/components/dom/Layout';
import Lenis from 'lenis';
import Loader from '@src/components/dom/Loader';
import Navbar from '@src/components/dom/navbar/Index';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Scrollbar from '@src/components/dom/Scrollbar';
import Tempus from '@darkroom.engineering/tempus';
import { View } from '@react-three/drei';
import { gsap } from 'gsap';
import styles from '@src/pages/app.module.scss';
import useFoucFix from '@src/hooks/useFoucFix';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

if (typeof window !== 'undefined') {
  gsap.defaults({ ease: 'none' });
  gsap.registerPlugin(ScrollTrigger);

  gsap.ticker.lagSmoothing(0);
  gsap.ticker.remove(gsap.updateRoot);
  Tempus?.add((time) => {
    gsap.updateRoot(time / 1000);
  }, 0);

  window.scrollTo(0, 0);
  window.history.scrollRestoration = 'manual';
  ScrollTrigger.clearScrollMemory(window.history.scrollRestoration);
}

function MyApp({ Component, pageProps, router }) {
  const [lenis, setLenis, fluidColor, isAbout] = useStore(useShallow((state) => [state.lenis, state.setLenis, state.fluidColor, state.isAbout]));
  const isMobile = useIsMobile();

  const mainRef = useRef();
  const mainContainerRef = useRef();
  const layoutRef = useRef();

  useFoucFix();

  useIsomorphicLayoutEffect(() => {
    const lenisInstance = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: false,
      wrapper: mainRef.current || undefined,
      content: mainContainerRef.current || undefined,
    });

    setLenis(lenisInstance);

    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenisInstance.on('scroll', onScroll);

    const removeTicker = Tempus?.add((time) => {
      lenisInstance.raf(time);
    }, 0);

    return () => {
      lenisInstance.off('scroll', onScroll);
      removeTicker?.();
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh();
    }
  }, [lenis]);

  const domElements = useMemo(
    () => (
      <>
        <Loader />
        <div className={styles.background}>
          <Background />
        </div>
        <Scrollbar />
        <Navbar />
        <ConversationModal />
        <Analytics />
      </>
    ),
    [],
  );

  const canvasElements = useMemo(
    () => (
      <Canvas
        gl={{
          pixelRatio: 0.5,
          outputColorSpace: isAbout === false ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace,
        }}
        style={{ zIndex: 0 }}
        resize={{ debounce: { resize: 0, scroll: 0 }, polyfill: undefined }}
        className={styles.canvasContainer}
        dpr={[0.5, 1.5]}
      >
        <View.Port />
      </Canvas>
    ),
    [isAbout],
  );

  return (
    <AuthProvider>
      <div className={styles.root}>
        {domElements}
        <div ref={layoutRef} id="layout" className={styles.layout}>
          {canvasElements}
          {!isMobile && (
            <Canvas
              id="fluidCanvas"
              flat
              gl={{
                antialias: false,
                stencil: false,
                depth: false,
                pixelRatio: 0.1,
              }}
              style={{ mixBlendMode: 'difference', background: 'black' }}
              linear
              className={styles.canvasContainer}
              eventSource={mainRef.current}
              dpr={[0.1, 0.5]}
            >
              <EffectComposer>
                <Fluid fluidColor={fluidColor} mainRef={mainRef} />
              </EffectComposer>
            </Canvas>
          )}
          <main ref={mainRef} className={styles.main}>
            <div ref={mainContainerRef} id="mainContainer" className={styles.mainContainer}>
              <Layout layoutRef={layoutRef} mainRef={mainRef} router={router}>
                <Component {...pageProps} />
              </Layout>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default MyApp;
