/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'About Homies Studio — Digital Product & Engineering Studio',
  description: 'Discover how Homies Studio empowers creators, students, and businesses by delivering end-to-end digital product development, engineering deliverables, and technical innovation.',
  keywords: [
    'About HOMIES STUDIO',
    'Homies Studio Agency',
    'Digital Product Studio',
    'Engineering Services',
    'Student Innovation',
    'Technical Solutions',
    'Next.js Development',
    'Full Stack Engineering',
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
