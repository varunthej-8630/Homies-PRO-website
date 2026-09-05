/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: "About Homies Studio | India's Tech Studio for Students, Colleges & Startups",
  description:
    'Learn about Homies Studio — an India-wide tech studio connecting engineering students, colleges, and startups through final year project guidance, Homies Mart, and AI product development.',
  keywords: [
    'About Homies Studio',
    'Homies Studio India',
    'Tech Studio for Students India',
    'Final Year Project Mentorship Bangalore',
    'Engineering Projects Hyderabad',
    'College Partnership Program',
    'Startup AI Solutions India',
    'Student Innovation India',
    'B.Tech Projects Pan-India',
  ],
  canonical: '/about',
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />

      <Hero />
      <Overview />
      <Services />
      <Process />
    </>
  );
}

export default Page;
