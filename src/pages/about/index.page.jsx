/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'About Homies Studio – Tech Studio for Students & Startups | Hyderabad',
  description: 'Learn about Homies Studio — a Hyderabad-based tech studio connecting engineering students, startups, and colleges through project-based work and AI solutions.',
  keywords: [
    'About Homies Studio',
    'HOMIES STUDIO Hyderabad',
    'Tech Studio for Students',
    'Final Year Project Mentorship',
    'Startup AI Solutions',
    'Engineering Services Hyderabad',
    'Student Innovation India',
    'B.Tech Projects Hyderabad',
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
