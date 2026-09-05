/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useMemo, useRef } from 'react';

import CustomHead from '@src/components/dom/CustomHead';
import NextProject from '@src/pages/projects/components/nextProject/NextProject';
import ProjectDetails from '@src/pages/projects/components/projectDetails/ProjectDetails';
import ProjectImages from '@src/pages/projects/components/projectsImages/ProjectImages';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { getProjectBySlugOrId, getAllPublishedProjectIdentifiers, getPublishedProjects } from '@src/lib/services/projectService';
import styles from '@src/pages/projects/project.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

function Page({ project, nextProject, id }) {
  const isMobile = useIsMobile();
  const rightContainerRef = useRef();
  const leftContainerRef = useRef();
  const [isLoading, setFluidColor, lenis] = useStore(useShallow((state) => [state.isLoading, state.setFluidColor, state.lenis]));
  const windowSize = useWindowSize();

  const currentProject = project;

  const updateCSSVariables = (proj) => {
    if (!proj) return;
    gsap.set('html', {
      '--black': proj.primary || '#28282b',
      '--white': proj.secondary || '#f0f4f1',
      '--accentColor': proj.accentColor || '#f9f9f9',
      '--fillColor': proj.fillColor || '#f2ffbd',
      '--menuColor': proj.menuColor || '#28282b',
      '--menuFontColor': proj.menuFontColor || '#f0f4f1',
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
      setFluidColor(currentProject.fluidColor || '#d7d7d4');
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

  const seo = useMemo(() => {
    if (!currentProject) return { title: 'Project Details — Homies Studio' };
    let descText = currentProject.tagline || `Explore technical engineering details, interactive models, and deliverables for ${currentProject.title}, crafted by Homies Studio.`;
    if (Array.isArray(currentProject.desc) && currentProject.desc.length > 0) {
      [descText] = currentProject.desc;
    } else if (typeof currentProject.desc === 'string') {
      descText = currentProject.desc;
    }

    return {
      title: `${currentProject.title} — Homies Studio Project`,
      description: descText,
      keywords: [`${currentProject.title}`, 'HOMIES STUDIO Project', 'Engineering Deliverable', 'Full Stack Architecture', 'Homies Studio'],
      canonical: `/projects/${id || currentProject.id || currentProject.slug}`,
    };
  }, [currentProject, id]);

  if (!currentProject) return null;

  return (
    <>
      <CustomHead {...seo} />
      <section className={clsx(styles.root, 'layout-grid-inner')}>
        <div ref={leftContainerRef} className={styles.leftContainer}>
          <ProjectDetails project={currentProject} />
        </div>
        <div ref={rightContainerRef} className={styles.rightContainer}>
          <ProjectImages project={currentProject} />
        </div>
      </section>
      {nextProject && <NextProject nextProject={nextProject} />}
    </>
  );
}

export async function getStaticPaths() {
  const identifiers = await getAllPublishedProjectIdentifiers();
  const paths = identifiers.map((id) => ({ params: { id } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps(context) {
  const { params } = context;
  const project = await getProjectBySlugOrId(params.id);

  if (!project) {
    return { notFound: true, revalidate: 30 };
  }

  const allPublished = await getPublishedProjects();
  const currentIndex = allPublished.findIndex((p) => p.id === project.id || p.slug === project.slug);
  const nextProject = currentIndex >= 0 && currentIndex < allPublished.length - 1 ? allPublished[currentIndex + 1] : allPublished[0] || null;

  return {
    props: {
      project,
      nextProject,
      id: params.id,
    },
    revalidate: 60,
  };
}

export default Page;
