/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'About Homies Studio — Technology Studio for Students & Startups',
  description: 'Learn about Homies Studio: a technology studio empowering engineering students, businesses, and startups with custom development and mentorship.',
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

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.homiesstudio.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://www.homiesstudio.com/about',
        },
      ],
    },
  ],
};

function Page() {
  return (
    <>
      <CustomHead {...seo} pageSchema={aboutSchema} />

      <Hero />
      <Overview />
      <Services />
      <Process />
    </>
  );
}

export default Page;
