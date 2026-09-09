export interface BrainRegion {
  id: string;
  label: string;
  color: string;
  position: [number, number, number];
  title: string;
  items: string[];
  blurb: string;
}

export const brainRegions: BrainRegion[] = [
  {
    id: 'vision',
    label: 'VISION',
    color: '#22d3ee',
    position: [-2.1, 0.9, 0.6],
    title: 'Computer Vision',
    items: ['Object Detection', 'Image Understanding', 'Segmentation'],
    blurb: 'Machines that see — pixels become perception, frames become understanding.',
  },
  {
    id: 'language',
    label: 'LANGUAGE',
    color: '#a78bfa',
    position: [2.1, 0.9, 0.6],
    title: 'NLP · Transformers · LLMs',
    items: ['NLP', 'Transformers', 'LLMs'],
    blurb: 'Language as latent geometry — meaning compressed into vectors, then released as thought.',
  },
  {
    id: 'reasoning',
    label: 'REASONING',
    color: '#38bdf8',
    position: [0, 1.9, -0.4],
    title: 'Logic · Planning · Inference',
    items: ['Logic', 'Planning', 'Inference'],
    blurb: 'The deliberation layer — chains of logic folding into decisions.',
  },
  {
    id: 'memory',
    label: 'MEMORY',
    color: '#34d399',
    position: [-1.2, -1.3, 0.8],
    title: 'Embeddings · Vector Search · RAG',
    items: ['Embeddings', 'Vector Search', 'RAG'],
    blurb: 'A living archive — every memory a vector, every recall a nearest-neighbor dream.',
  },
  {
    id: 'generative',
    label: 'GENERATIVE AI',
    color: '#f472b6',
    position: [1.2, -1.3, 0.8],
    title: 'LLMs · Diffusion · Multimodal',
    items: ['LLMs', 'Diffusion', 'Multimodal AI'],
    blurb: 'The dreaming engine — noise refined into image, text and sound.',
  },
];

export interface UniverseNode {
  id: string;
  label: string;
  group: string;
  color: string;
  size: number;
  description: string;
  links: string[];
}

export const universeNodes: UniverseNode[] = [
  { id: 'ai', label: 'AI', group: 'Core', color: '#22d3ee', size: 1.5, description: 'The overarching field — systems that perceive, reason and act.', links: ['ml', 'agents', 'robotics'] },
  { id: 'ml', label: 'ML', group: 'Core', color: '#38bdf8', size: 1.2, description: 'Learning from data — patterns distilled into predictive models.', links: ['dl', 'ds'] },
  { id: 'dl', label: 'DEEP LEARNING', group: 'Core', color: '#818cf8', size: 1.15, description: 'Layered representations — hierarchies of features learned end to end.', links: ['genai', 'cv'] },
  { id: 'genai', label: 'GENERATIVE AI', group: 'Generative', color: '#f472b6', size: 1.3, description: 'Models that create — text, image, audio and video from latent space.', links: ['llms', 'nlp'] },
  { id: 'llms', label: 'LLMs', group: 'Generative', color: '#a78bfa', size: 1.25, description: 'Large language models — next-token prediction scaled into reasoning.', links: ['rag', 'agents'] },
  { id: 'nlp', label: 'NLP', group: 'Perception', color: '#67e8f9', size: 1.0, description: 'Understanding and generating human language.', links: ['rag'] },
  { id: 'cv', label: 'COMPUTER VISION', group: 'Perception', color: '#22d3ee', size: 1.0, description: 'Seeing the world — detection, segmentation, tracking.', links: ['robotics'] },
  { id: 'robotics', label: 'ROBOTICS', group: 'Embodied', color: '#34d399', size: 1.05, description: 'Intelligence with a body — sensing, planning, actuating.', links: ['agents'] },
  { id: 'ds', label: 'DATA SCIENCE', group: 'Foundation', color: '#fbbf24', size: 0.95, description: 'The substrate — statistics, pipelines and decisions from data.', links: ['rag'] },
  { id: 'rag', label: 'RAG', group: 'Memory', color: '#34d399', size: 0.95, description: 'Retrieval-augmented generation — grounding LLMs in real knowledge.', links: ['agents'] },
  { id: 'agents', label: 'AI AGENTS', group: 'Systems', color: '#e879f9', size: 1.1, description: 'Autonomous loops — plan, tool-use, observe, act.', links: [] },
];

export interface SkillNode {
  name: string;
  category: string;
  description: string;
  level: 'Foundational' | 'Proficient' | 'Advanced' | 'Exploring';
}

export const skills: SkillNode[] = [
  { name: 'Python', category: 'Language', description: 'Primary build language — APIs, ML, automation.', level: 'Advanced' },
  { name: 'Java', category: 'Language', description: 'OOP foundations, DSA and backend concepts.', level: 'Proficient' },
  { name: 'HTML', category: 'Web', description: 'Semantic, accessible document structure.', level: 'Advanced' },
  { name: 'CSS', category: 'Web', description: 'Modern layouts, animations, design systems.', level: 'Advanced' },
  { name: 'JavaScript', category: 'Web', description: 'Interactive UI, ES2020+, async patterns.', level: 'Advanced' },
  { name: 'React', category: 'Web', description: 'Component architecture, hooks, R3F.', level: 'Proficient' },
  { name: 'SQL', category: 'Data', description: 'Modeling, joins, analytical queries.', level: 'Proficient' },
  { name: 'Machine Learning', category: 'AI', description: 'Classical ML, evaluation, pipelines.', level: 'Proficient' },
  { name: 'Deep Learning', category: 'AI', description: 'Neural nets, PyTorch, training loops.', level: 'Proficient' },
  { name: 'Generative AI', category: 'AI', description: 'LLMs, prompting, RAG, diffusion concepts.', level: 'Proficient' },
  { name: 'Three.js', category: '3D', description: 'Procedural scenes, shaders, WebGL.', level: 'Proficient' },
  { name: 'GitHub', category: 'Tools', description: 'Version control, collaboration, CI basics.', level: 'Proficient' },
  { name: 'Power BI', category: 'Data', description: 'Dashboards, DAX basics, storytelling.', level: 'Proficient' },
  { name: 'Tableau', category: 'Data', description: 'Visual analytics and exploration.', level: 'Foundational' },
];

export const assistantStages = ['UNDERSTANDING', 'KNOWLEDGE', 'REASONING', 'RESPONSE'] as const;

export function demoAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('who') && (q.includes('you') || q.includes('neural'))) {
    return 'I am the NEURAL CORE — a demo interface of NEURALVERSE. I synthesize the portfolio of Muchakarla Hemanth Kumar: an AI/ML-focused developer building intelligent systems and immersive WebGL experiences. No external API is connected; I run on curated local intelligence.';
  }
  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
    return 'Core systems online: Python, Java, JavaScript, React, SQL · Machine Learning, Deep Learning, Generative AI · Three.js / R3F, GitHub · Power BI, Tableau. Specialization: AI/ML pipelines, RAG concepts, and cinematic web experiences.';
  }
  if (q.includes('project') || q.includes('nexus') || q.includes('arduino') || q.includes('drone')) {
    return 'Project archive contains 5 cinematic entries: NEXUSFLOW (premium CRUD platform), AI/ML experiments (models + RAG prototypes), Python systems (APIs + data apps), Arduino Lab (embedded sensing), and Drone/Survey concepts (mapping + vision). Open the PROJECTS scene to traverse them.';
  }
  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('resume')) {
    return 'Uplink available via the CONTACT terminal: hemanthhemanth1834@gmail.com · GitHub: hemanthhemanth1834-bit · LinkedIn: hemanth-kumar-muchakarla. Use VIEW RESUME or CONTACT ME to initiate a handshake.';
  }
  if (q.includes('brain') || q.includes('vision') || q.includes('language') || q.includes('memory')) {
    return 'The AI BRAIN holds five regions: VISION (detection + understanding), LANGUAGE (transformers + LLMs), REASONING (planning + inference), MEMORY (embeddings + RAG), GENERATIVE AI (diffusion + multimodal). Hover to illuminate, click to dive deeper.';
  }
  if (q.includes('future') || q.includes('robot')) {
    return 'Future trajectory: embodied AI, autonomous systems, spatial computing and generative media — converging toward assistants that perceive, remember and create alongside humans.';
  }
  if (q.trim().length < 4) {
    return 'Signal too weak. Ask me about skills, projects, the AI brain, or how to contact Hemanth.';
  }
  return `Query received: "${question.trim().slice(0, 140)}". Demo inference complete — as an AI/ML developer, Hemanth builds intelligent pipelines (ML → embeddings → RAG → agents) and renders them as immersive web experiences. For specifics, ask about SKILLS, PROJECTS, or CONTACT. (Demo mode — connect VITE_AI_PROXY_URL for live inference.)`;
}

export const navLinks = [
  { id: 'core', label: 'CORE', href: '#core' },
  { id: 'universe', label: 'UNIVERSE', href: '#universe' },
  { id: 'ai', label: 'AI', href: '#ask' },
  { id: 'projects', label: 'PROJECTS', href: '#projects' },
  { id: 'skills', label: 'SKILLS', href: '#skills' },
  { id: 'about', label: 'ABOUT', href: '#about' },
  { id: 'contact', label: 'CONTACT', href: '#contact' },
];
