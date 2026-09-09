export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  github: string;
  demo?: string;
  accent: string;
  scene: string;
  stats: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    id: 'nexusflow',
    index: '01',
    title: 'NEXUSFLOW',
    subtitle: 'Premium CRUD application',
    description:
      'A production-grade CRUD platform with authentication, optimistic UI, server pagination, search, and role-aware data flows. Designed as a calm, fast operations console — not a demo todo app.',
    stack: ['React', 'TypeScript', 'REST API', 'PostgreSQL', 'Tailwind'],
    github: 'https://github.com/hemanthhemanth1834-bit',
    demo: undefined,
    accent: '#22d3ee',
    scene: 'Flow fields of records stream through a central nexus — create, read, update, delete as light.',
    stats: [
      { label: 'LATENCY', value: '<120ms' },
      { label: 'MODULES', value: '8' },
      { label: 'MODE', value: 'Full-stack' },
    ],
  },
  {
    id: 'aiml',
    index: '02',
    title: 'AI / ML EXPERIMENTS',
    subtitle: 'Machine learning and AI experiments',
    description:
      'A lab of notebooks and pipelines — classification, embeddings, RAG prototypes and evaluation harnesses. Focus on reproducible training, clean data splits and honest metrics.',
    stack: ['Python', 'scikit-learn', 'PyTorch', 'Embeddings', 'RAG'],
    github: 'https://github.com/hemanthhemanth1834-bit',
    accent: '#a78bfa',
    scene: 'Model graphs bloom into constellations — every experiment a star, every metric a pulse.',
    stats: [
      { label: 'MODELS', value: '12+' },
      { label: 'FOCUS', value: 'NLP + Vision' },
      { label: 'PIPELINE', value: 'End-to-end' },
    ],
  },
  {
    id: 'python',
    index: '03',
    title: 'PYTHON SYSTEMS',
    subtitle: 'Automation, APIs and data apps',
    description:
      'Python applications spanning automation bots, REST services, data analysis dashboards and CLI tools. Emphasis on readable architecture, typed code and tested utilities.',
    stack: ['Python', 'FastAPI', 'Pandas', 'SQL', 'Power BI'],
    github: 'https://github.com/hemanthhemanth1834-bit',
    accent: '#38bdf8',
    scene: 'Serpentine data rivers converge into structured reservoirs — raw input refined into insight.',
    stats: [
      { label: 'APPS', value: '6+' },
      { label: 'STYLE', value: 'Typed' },
      { label: 'DATA', value: 'SQL + BI' },
    ],
  },
  {
    id: 'arduino',
    index: '04',
    title: 'ARDUINO LAB',
    subtitle: 'Embedded sensing and control',
    description:
      'Microcontroller builds with sensors, actuators and telemetry — obstacle avoidance, environmental sensing and serial dashboards. Hardware meets software with careful circuit design.',
    stack: ['Arduino', 'C++', 'Sensors', 'IoT', 'Serial'],
    github: 'https://github.com/hemanthhemanth1834-bit',
    accent: '#34d399',
    scene: 'Circuits breathe — sensor halos expand with every reading, actuators answer in light.',
    stats: [
      { label: 'BUILDS', value: '5+' },
      { label: 'SENSORS', value: 'Multi-modal' },
      { label: 'MODE', value: 'Embedded' },
    ],
  },
  {
    id: 'drone',
    index: '05',
    title: 'DRONE / SURVEY',
    subtitle: 'Aerial mapping and survey concepts',
    description:
      'Drone-assisted survey workflows — flight planning concepts, orthomosaic thinking, and geospatial visualization. Built for inspection, agriculture and mapping narratives.',
    stack: ['Drones', 'Survey', 'GIS', 'Computer Vision', 'Mapping'],
    github: 'https://github.com/hemanthhemanth1834-bit',
    accent: '#f472b6',
    scene: 'A survey grid sweeps the terrain — altitude becomes insight, flight paths become memory.',
    stats: [
      { label: 'DOMAIN', value: 'Geo + Vision' },
      { label: 'OUTPUT', value: 'Maps' },
      { label: 'MODE', value: 'Field + Lab' },
    ],
  },
];
