/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import Projects from '@src/pages/components/projects/Index';
import Clients from '@src/pages/components/clients/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'HOMIES STUDIO — Where Projects Become Possibilities',
  description: 'Digital project marketplace and creator ecosystem. Discover ready-to-build projects, showcase your technical work, sell your creations, and turn ideas into real opportunities.',
  keywords: [
    'HOMIES STUDIO',
    'Homies Studio',
    'Project Marketplace',
    'Creator Ecosystem',
    'Buy Code Projects',
    'Sell Digital Projects',
    'AI ML Projects',
    'Full Stack Web Applications',
    'IoT Hardware Prototypes',
    'Embedded Systems',
    'VLSI Projects',
    'College Projects',
    'IEEE Projects',
    'Engineering Solutions',
    'Next.js',
    'React',
    'Python',
  ],
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />
      <Home />
      <About />
      <Clients />
      <Quote />
      <Projects />
    </>
  );
}

export default Page;
