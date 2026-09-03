/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Final Year Projects, IoT, AI/ML & Robotics | Homies Studio – India',
  description:
    'Homies Studio helps B.Tech & M.Tech students across India (Bangalore, Hyderabad, Andhra Pradesh & nationwide) complete final year projects in IoT, Robotics, AI/ML, and Embedded Systems. Also builds AI agents, web apps & SaaS for startups.',
  keywords: [
    'HOMIES STUDIO',
    'Homies Studio',
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
      <Quote />
    </>
  );
}

export default Page;
