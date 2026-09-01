export const MARKETPLACE_CATEGORIES = [
  {
    id: 'all',
    name: 'All Categories',
    slug: 'all',
    count: 18,
    description: 'Explore the complete ecosystem of ready-to-deploy digital projects.',
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    count: 6,
    icon: '🧠',
    description: 'Deep learning models, computer vision, LLM integrations & neural prediction pipelines.',
  },
  {
    id: 'web-dev',
    name: 'Web & Full Stack',
    slug: 'web-dev',
    count: 5,
    icon: '⚡',
    description: 'Modern Next.js, React, Node.js and full-stack web applications with sleek aesthetics.',
  },
  {
    id: 'iot-robotics',
    name: 'IoT & Robotics',
    slug: 'iot-robotics',
    count: 4,
    icon: '🤖',
    description: 'Hardware-software integrated microcontrollers, sensor nodes, and ROS automation systems.',
  },
  {
    id: 'embedded-vlsi',
    name: 'Embedded & VLSI',
    slug: 'embedded-vlsi',
    count: 3,
    icon: '🔬',
    description: 'Synthesizable Verilog HDL, ARM Cortex firmware, FPGA bitstreams, and digital logic circuits.',
  },
  {
    id: 'automation-saas',
    name: 'Automation & SaaS',
    slug: 'automation-saas',
    count: 4,
    icon: '⚙️',
    description: 'Automated scrapers, workflow bots, API microservices, and specialized internal tools.',
  },
  {
    id: 'mobile-apps',
    name: 'Mobile Applications',
    slug: 'mobile-apps',
    count: 3,
    icon: '📱',
    description: 'Cross-platform React Native and Flutter mobile applications with cloud syncing.',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Cloud',
    slug: 'cybersecurity',
    count: 2,
    icon: '🛡️',
    description: 'Network intrusion detection, cryptographic systems, and automated cloud deployments.',
  },
];

export const TECHNOLOGIES_LIST = [
  'Python',
  'React',
  'Next.js',
  'PyTorch',
  'TensorFlow',
  'OpenCV',
  'ESP32',
  'Arduino',
  'Raspberry Pi',
  'Verilog HDL',
  'STM32 / ARM',
  'Node.js',
  'FastAPI',
  'PostgreSQL',
  'Docker',
  'ROS',
  'React Native',
  'TypeScript',
  'Three.js',
  'GSAP',
  'Scikit-Learn',
];

export const DIFFICULTY_LEVELS = ['Beginner Friendly', 'Intermediate', 'Advanced', 'Industry Grade'];

export const PROJECT_TYPES = ['Full-Stack Application', 'Hardware & Software Prototype', 'Research & Academic Build', 'Automation Suite', 'AI/ML Model & Web Interface'];

export const PLATFORMS = ['Web (Cross-browser)', 'Desktop / Embedded', 'Mobile (iOS & Android)', 'Cloud Server', 'Hardware / Microcontroller'];

export const DEFAULT_PLATFORM_FEE_PERCENT = 20; // 20% platform fee, 80% creator share

export const MOCK_CREATOR_PROFILE = {
  id: 'creator-homies',
  name: 'Homies Creator Studio',
  handle: '@homies_studio',
  verified: true,
  avatar: '/homies/header-logo.png',
  bio: 'Building, testing, and curating battle-tested digital engineering projects, AI models, and hardware prototypes for the next generation of builders.',
  rating: 4.96,
  totalReviews: 128,
  projectsCount: 8,
  totalSales: 436,
  responseTime: 'Within 2 hours',
  badges: ['Top Verified Creator', 'Fast Support', 'IEEE Standard Code', '100% Working Guarantee'],
  skills: ['AI/ML', 'Full Stack Web', 'Embedded Systems', 'IoT Prototyping', 'Computer Vision', 'VLSI Design'],
  wallet: {
    availableBalance: 48500,
    pendingEarnings: 12200,
    totalEarnings: 186400,
    withdrawn: 125700,
    salesCount: 142,
  },
};

export const MOCK_ORDERS = [
  {
    id: 'ORD-88219',
    projectId: 'project1',
    projectTitle: 'AI / ML Solutions & Real-Time Computer Vision',
    date: '2026-08-28',
    amount: 2999,
    status: 'Completed',
    downloadToken: 'dl_token_88219_exp2026',
    downloadCount: 3,
    maxDownloads: 10,
    license: 'Single Academic & Commercial License',
    creator: 'Homies Creator Studio',
  },
  {
    id: 'ORD-77402',
    projectId: 'project3',
    projectTitle: 'IoT & Robotics Systems Prototyping',
    date: '2026-08-14',
    amount: 3499,
    status: 'Completed',
    downloadToken: 'dl_token_77402_exp2026',
    downloadCount: 1,
    maxDownloads: 10,
    license: 'Single Academic & Commercial License',
    creator: 'Homies Creator Studio',
  },
];

export const MOCK_WITHDRAWALS = [
  {
    id: 'WTH-401',
    amount: 25000,
    date: '2026-08-15',
    method: 'Bank Transfer (HDFC ****4812)',
    status: 'Completed',
    transactionRef: 'UTR9988220194',
  },
  {
    id: 'WTH-402',
    amount: 18500,
    date: '2026-08-25',
    method: 'UPI (homies@upi)',
    status: 'Completed',
    transactionRef: 'UPI2026881900',
  },
];

export const MOCK_MODERATION_QUEUE = [
  {
    id: 'sub-01',
    title: 'Autonomous Drone Obstacle Avoidance using YOLOv8 & ROS2',
    creatorName: 'Arjun Verma',
    creatorHandle: '@arjun_v',
    category: 'IoT & Robotics',
    price: 3499,
    submittedDate: '2026-08-30',
    status: 'PENDING_REVIEW',
    techStack: ['Python', 'ROS2', 'YOLOv8', 'OpenCV', 'Gazebo'],
    filesCount: 6,
    hasDocumentation: true,
    hasLiveDemo: true,
  },
  {
    id: 'sub-02',
    title: 'SaaS Multi-Tenant Project Management Platform with Stripe',
    creatorName: 'Devika Sharma',
    creatorHandle: '@devika_builds',
    category: 'Web & Full Stack',
    price: 4999,
    submittedDate: '2026-08-29',
    status: 'CHANGES_REQUESTED',
    notes: 'Please add database migration seed scripts for initial admin setup.',
    techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind', 'Stripe'],
    filesCount: 5,
    hasDocumentation: true,
    hasLiveDemo: true,
  },
];

export const CREATOR_STEPS = [
  {
    step: '01',
    title: 'Create Your Profile',
    desc: 'Set up your creator identity, showcase your technical skills, portfolio links, and domain expertise.',
  },
  {
    step: '02',
    title: 'Upload Your Project',
    desc: 'Package your clean source code, detailed IEEE/academic documentation, setup guides, and project assets.',
  },
  {
    step: '03',
    title: 'Set Details & Pricing',
    desc: 'Choose your category, tags, and price. See your transparent 80% creator earnings calculated automatically.',
  },
  {
    step: '04',
    title: 'Quality Review',
    desc: 'Our technical moderation team validates code cleanliness, documentation depth, and working demo completeness.',
  },
  {
    step: '05',
    title: 'Get Discovered',
    desc: 'Your approved project is published to thousands of students, developers, startups, and institutions.',
  },
  {
    step: '06',
    title: 'Earn & Withdraw',
    desc: 'Receive transparent sales royalties on every purchase with fast, hassle-free payouts to your Bank or UPI.',
  },
];
