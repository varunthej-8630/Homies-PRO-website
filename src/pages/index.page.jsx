/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'HOMIES STUDIO — Build, Launch & Grow Digital Products',
  description:
    'Homies Studio is a premier digital product and engineering studio empowering students, creators, startups, and businesses to build, launch, and scale exceptional digital products and engineering solutions.',
  keywords: [
    'HOMIES STUDIO',
    'Homies Studio',
    'Digital Product Studio',
    'Engineering Projects',
    'Creator Ecosystem',
    'Full Stack Web Applications',
    'AI ML Engineering',
    'IoT Prototypes',
    'Embedded Systems',
    'Startup Development',
    'Next.js',
    'React',
  ],
  canonical: '/',
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />
      <Home />
      <About />
      <Quote />
    </>
  );
}

export default Page;
