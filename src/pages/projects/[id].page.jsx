/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useMemo, useRef } from 'react';

import CustomHead from '@src/components/dom/CustomHead';
import NextProject from '@src/pages/projects/components/nextProject/NextProject';
import ProjectDetails from '@src/pages/projects/components/projectDetails/ProjectDetails';
import ProjectImages from '@src/pages/projects/components/projectsImages/ProjectImages';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import clsx from 'clsx';
import { gsap } from 'gsap';
import projects from '@src/constants/projects';
import styles from '@src/pages/projects/project.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

function Page({ id }) {
  const isMobile = useIsMobile();
  const rightContainerRef = useRef();
  const leftContainerRef = useRef();
  const [isLoading, setFluidColor, lenis] = useStore(useShallow((state) => [state.isLoading, state.setFluidColor, state.lenis]));
  const windowSize = useWindowSize();

  const projectIndex = useMemo(() => projects.findIndex((project) => project.id === id), [id]);
  const currentProject = useMemo(() => projects[projectIndex], [projectIndex]);

  const updateCSSVariables = (project) => {
    gsap.set('html', {
      '--black': project.primary,
      '--white': project.secondary,
      '--accentColor': project.accentColor,
      '--fillColor': project.fillColor,
      '--menuColor': project.menuColor,
      '--menuFontColor': project.menuFontColor,
    });
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!isLoading && !isMobile && rightContainerRef.current && leftContainerRef.current) {
        ScrollTrigger.create({
          id: 'project',
          trigger: rightContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: leftContainerRef.current,
          scrub: true,
          scroller: document?.querySelector('main'),
          invalidateOnRefresh: true,
          pinSpacing: false,
        });

        if (lenis) {
          lenis.resize();
        }
        ScrollTrigger.refresh();
      }
    });

    return () => {
      ctx.kill();
      ScrollTrigger.getById('project')?.kill();
    };
  }, [isMobile, isLoading, windowSize.width, lenis]);

  useEffect(() => {
    if (currentProject) {
      updateCSSVariables(currentProject);
      setFluidColor(currentProject.fluidColor);
    }
    return () => {
      updateCSSVariables({
        primary: '#28282b',
        secondary: '#f0f4f1',
        accentColor: '#f9f9f9',
        fillColor: '#f2ffbd',
        menuColor: '#28282b',
        menuFontColor: '#f0f4f1',
      });
      setFluidColor('#d7d7d4');
    };
  }, [currentProject, setFluidColor]);

  const seo = useMemo(
    () => ({
      title: `${currentProject.title} — Homies Studio Project`,
      description: currentProject.description || `Explore technical engineering details, interactive models, and deliverables for ${currentProject.title}, crafted by Homies Studio.`,
      keywords: [`${currentProject.title}`, 'HOMIES STUDIO Project', 'Engineering Deliverable', 'Full Stack Architecture', 'Homies Studio'],
      canonical: `/projects/${currentProject.id || currentProject.slug}`,
    }),
    [currentProject],
  );

  const projectSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          '@id': `https://www.homiesstudio.com/projects/${currentProject.id}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://www.homiesstudio.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Projects',
              item: 'https://www.homiesstudio.com/mart',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: currentProject.title,
              item: `https://www.homiesstudio.com/projects/${currentProject.id}`,
            },
          ],
        },
        {
          '@type': 'CreativeWork',
          '@id': `https://www.homiesstudio.com/projects/${currentProject.id}#work`,
          name: currentProject.title,
          description: currentProject.description || `Engineering build and interactive deliverables for ${currentProject.title}.`,
          creator: {
            '@id': 'https://www.homiesstudio.com/#organization',
          },
          url: `https://www.homiesstudio.com/projects/${currentProject.id}`,
        },
      ],
    }),
    [currentProject],
  );

  return (
    <>
      <CustomHead {...seo} pageSchema={projectSchema} />
      <section className={clsx(styles.root, 'layout-grid-inner')}>
        <div ref={leftContainerRef} className={styles.leftContainer}>
          <ProjectDetails project={currentProject} />
        </div>
        <div ref={rightContainerRef} className={styles.rightContainer}>
          <ProjectImages project={currentProject} />
        </div>
      </section>
      <NextProject nextProject={projectIndex === projects.length - 1 ? projects[0] : projects[projectIndex + 1]} />
    </>
  );
}

export async function getStaticPaths() {
  const paths = projects.map((project) => ({ params: { id: project.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const { params } = context;
  return { props: { id: params.id } };
}

export default Page;
