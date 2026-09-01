import projects from '@src/constants/projects';

const projectsLinks = projects.map((project) => ({
  title: project.title,
  href: project.link,
}));

export default projectsLinks;
