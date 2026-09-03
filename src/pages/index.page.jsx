/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Final Year Projects, IoT, AI/ML & Robotics | Homies Studio – Hyderabad, India',
  description:
    'Homies Studio helps B.Tech & M.Tech students complete final year projects in IoT, Robotics, AI/ML, and Embedded Systems. Also builds AI agents, web apps & SaaS for startups. Based in Hyderabad, India.',
  keywords: [
    'HOMIES STUDIO',
    'Homies Studio',
    'Final Year Projects',
    'FYP Guidance',
    'IoT Projects',
    'Robotics Projects',
    'AI ML Projects',
    'Embedded Systems',
    'Engineering Projects Hyderabad',
    'B.Tech Projects India',
    'Final Year Project Help',
    'AI Agent Development',
    'SaaS Development India',
    'Startup Solutions',
    'Digital Product Studio',
    'Hyderabad Tech Studio',
    'Ongole',
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
