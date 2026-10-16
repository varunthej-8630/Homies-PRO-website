/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import HomeMiddleSections from '@src/pages/components/home/HomeMiddleSections';
import Quote from '@src/pages/components/quote/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'HOMIES STUDIO | Building Ideas Into Reality — Projects, Websites & AI',
  description:
    'Homies Studio transforms ideas into reality. We help students bring engineering projects to life and help businesses build custom websites, applications, AI solutions, and technology.',
  keywords: [
    'HOMIES STUDIO',
    'Homies Studio',
    'Website Development India',
    'Custom Web Applications',
    'Final Year Projects',
    'FYP Guidance India',
    'IoT Projects India',
    'Robotics Projects India',
    'AI ML Projects',
    'Embedded Systems',
    'Engineering Projects Bangalore',
    'Engineering Projects Hyderabad',
    'Engineering Projects Andhra Pradesh',
    'B.Tech Projects India',
    'Final Year Project Help',
    'AI Agent Development',
    'SaaS Development India',
    'Startup Solutions',
    'Digital Product Studio India',
    'Hyderabad Tech Studio',
    'Bangalore Tech Studio',
    'Ongole',
    'Pan India Engineering Projects',
  ],
  canonical: '/',
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />
      <Home />
      <About />
      <HomeMiddleSections />
      <Quote />
    </>
  );
}

export default Page;
