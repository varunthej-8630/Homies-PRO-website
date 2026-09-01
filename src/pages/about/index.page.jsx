/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'About Homies Studio — Technical Ecosystem & Creator Platform',
  description: 'Learn about Homies Studio: bridging the gap between student innovation, creator monetization, academic institutions, and enterprise engineering solutions.',
  keywords: [
    'HOMIES STUDIO',
    'About Homies Studio',
    'Technical Project Marketplace',
    'Student Innovation',
    'Engineering Ecosystem',
    'Creator Monetization',
    'Academic Projects',
    'College Solutions',
    'EdTech Partnerships',
    'Turn Ideas into Opportunities',
  ],
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
