/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'About Homies Studio – Tech Studio for Students & Startups | Pan-India',
  description:
    'Learn about Homies Studio — a premier tech studio connecting engineering students, startups, and colleges across India (Bangalore, Hyderabad, Andhra Pradesh & nationwide) through project-based work and AI solutions.',
  keywords: [
    'About Homies Studio',
    'Homies Studio India',
    'Tech Studio for Students India',
    'Final Year Project Mentorship Bangalore',
    'Engineering Projects Hyderabad',
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
