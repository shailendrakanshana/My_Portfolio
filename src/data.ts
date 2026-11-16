// Single source of truth. The page UI and the "tool console" both read from here —
// one data layer, two interfaces (the same idea as Auramiq's service layer).
// Everything below comes from Shailendra's résumé. Edit here, not in components.

export const profile = {
  name: 'Shailendra Kanshana',
  first: 'Shailendra',
  last: 'Kanshana',
  role: 'AI Engineer & Systems Builder',
  roles: ['AI Engineer', 'Founding Engineer', 'Full-Stack Developer', 'Indie Hacker'],
  statement: 'I build intelligent systems, engineer scalable products, and turn ambitious ideas into reality.',
  intro:
    'Three-plus years shipping production backends and AI features. I lead backend engineering at Enrichly HR, a US-based company, and I’m building Auramiq, an AI research and B2B prospecting platform that AI agents can call directly over MCP.',
  location: 'India',
  relocation: 'Open to relocation',
  timezone: 'Asia/Kolkata',
  email: 'skanshana.coder@gmail.com',
  github: 'https://github.com/shailendrakanshana',
  githubHandle: 'shailendrakanshana',
  linkedin: 'https://www.linkedin.com/in/shailendra-kanshana/',
  linkedinHandle: 'in/shailendra-kanshana',
  auramiq: 'https://auramiq.com',
  resume: `${import.meta.env.BASE_URL}Shailendra_Kanshana_Resume.pdf`,
  now: [
    { label: 'Lead Engineer', at: 'Enrichly HR' },
    { label: 'Founder', at: 'Auramiq' },
  ],
};

export const stats = [
  { value: '3+', unit: 'years', label: 'shipping production systems' },
  { value: '50%', unit: 'less', label: 'support-team workload after the GPT-3 assistant at Able' },
  { value: '20%', unit: 'fewer', label: 'reschedules from a self-booking tool on the Google Meet API' },
  { value: '2', unit: 'interfaces', label: 'one Auramiq core — served over REST and to AI agents over MCP' },
];

export type Capability = {
  id: string;
  title: string;
  short: string;
  body: string;
  proof: string;
  tags: string[];
};

export const capabilities: Capability[] = [
  {
    id: 'agents',
    title: 'AI agents & agentic systems',
    short: 'Tools agents can actually use.',
    body:
      'I design services so an agent can call them as tools — clear inputs, verifiable outputs, no browser in the loop. Auramiq exposes its research and prospecting capabilities through an MCP server, so an AI agent can run the same operations a human does from the dashboard.',
    proof: 'Auramiq MCP server',
    tags: ['MCP', 'tool design', 'agent tooling'],
  },
  {
    id: 'llm',
    title: 'LLM applications & orchestration',
    short: 'Models wired into real workflows.',
    body:
      'Retrieval, prompting and the plumbing around them. Auramiq’s research engine pulls results from several search engines, verifies them, and has an LLM write answers that cite their sources. Back in 2023 at Able, I put a GPT-3 assistant inside a live support desk to draft replies for agents.',
    proof: 'Auramiq research engine · Able support desk',
    tags: ['RAG with citations', 'OpenAI API', 'prompt engineering'],
  },
  {
    id: 'research',
    title: 'AI research & automation',
    short: 'Pipelines that do the legwork.',
    body:
      'Scout is a Python lead-discovery pipeline: it sources businesses from Google Maps, verifies contact emails and runs SMTP outreach, with Celery doing the background work and a Next.js dashboard on top. I like automations that are boring to operate and easy to trust.',
    proof: 'Scout, inside Auramiq',
    tags: ['Celery', 'data pipelines', 'workflow automation'],
  },
  {
    id: 'product',
    title: 'Full-stack product engineering',
    short: 'From the schema to the screen.',
    body:
      'I’ve shipped microservices in Django, .NET Core and Next.js, real-time WebSocket chat, scheduling tools and analytics dashboards. At Enrichly HR I work directly with enterprise stakeholders to decide what gets built, then build it.',
    proof: 'Enrichly HR · WhatBytes · Able',
    tags: ['React', 'Next.js', 'TypeScript', 'WebSockets'],
  },
  {
    id: 'backend',
    title: 'Backend systems & scalable architecture',
    short: 'The parts nobody sees until they break.',
    body:
      'At Enrichly HR I own the backend architecture: I moved business logic that was scattered across the frontend into structured REST APIs, redesigned Azure SQL schemas, added validation at every layer, and fixed the recurring incidents behind production 500s. At WhatBytes I added Elasticsearch to high-volume search and cut query latency significantly.',
    proof: 'Enrichly HR · WhatBytes',
    tags: ['Django / DRF', 'Node.js', '.NET Core', 'Elasticsearch'],
  },
  {
    id: 'infra',
    title: 'Developer tools & infrastructure',
    short: 'Pipelines, auth, deploys.',
    body:
      'CI/CD into Azure App Services and AWS Elastic Beanstalk, services containerized with Docker and Kubernetes, Azure AD B2C sign-in (OAuth2, JWT) across a microservice fleet. I build AI-assisted, too — Claude Code is part of my daily workflow.',
    proof: 'WhatBytes · Enrichly HR',
    tags: ['GitHub Actions', 'Docker', 'Kubernetes', 'Azure AD B2C'],
  },
];

export type Project = {
  id: string;
  index: string;
  name: string;
  kicker: string;
  role: string;
  period: string;
  summary: string;
  problem: string;
  built: string[];
  interesting: string;
  stack: string[];
  link?: { label: string; href: string };
  visual: 'auramiq' | 'scout' | 'enrichly' | 'able' | 'whatbytes';
};

export const projects: Project[] = [
  {
    id: 'auramiq',
    index: '01',
    name: 'Auramiq',
    kicker: 'AI research & B2B prospecting',
    role: 'Founder',
    period: 'Jun 2026 — now',
    summary:
      'A platform that finds live leads, verifies decision-maker contacts and surfaces real-time buying signals — usable by people from a dashboard, and by AI agents over MCP.',
    problem:
      'Prospecting research is slow, scattered across tools, and hard to trust. Most “AI research” answers can’t show where a claim came from.',
    built: [
      'A research engine that queries multiple search engines, verifies the results, and has an LLM write citation-backed answers (RAG).',
      'A core service layer with no dependency on any web framework — the same code serves a REST API and an MCP server that AI agents call directly.',
      'Scout, the lead-discovery pipeline underneath (see 02).',
    ],
    interesting:
      'The business logic doesn’t know who is calling it. A browser, a script and an agent all hit the same functions — which makes agent support a thin adapter instead of a second product.',
    stack: ['Python', 'Django REST Framework', 'Celery', 'MCP', 'LLM / RAG', 'Next.js'],
    link: { label: 'auramiq.com', href: 'https://auramiq.com' },
    visual: 'auramiq',
  },
  {
    id: 'scout',
    index: '02',
    name: 'Scout',
    kicker: 'Lead-discovery pipeline · part of Auramiq',
    role: 'Founder / sole engineer',
    period: '2026',
    summary: 'A Python pipeline that sources businesses, verifies who to contact, and handles outreach.',
    problem: 'Finding real, reachable leads usually means a spreadsheet, three tools and a lot of bounced email.',
    built: [
      'Google Maps sourcing for business discovery.',
      'Email verification before anything is sent.',
      'SMTP outreach, with long-running work on Celery workers behind Django REST Framework.',
      'A Next.js dashboard to run and watch it.',
    ],
    interesting: 'Each stage is a separate, retryable step, so a slow source or a failed verification doesn’t sink the whole run.',
    stack: ['Python', 'Django REST Framework', 'Celery', 'Next.js', 'SMTP'],
    visual: 'scout',
  },
  {
    id: 'enrichly',
    index: '03',
    name: 'Enrichly HR backend',
    kicker: 'Re-architecture under a live product',
    role: 'Lead Engineer',
    period: 'May 2025 — now',
    summary: 'Owning the backend of a US-based HR product and making it something the team can rely on.',
    problem:
      'Business logic lived in the frontend. Clients made duplicate calls, data integrity depended on the UI behaving, and production threw recurring 500s.',
    built: [
      'Moved scattered frontend logic into structured REST APIs — removing duplicate client-side calls and reducing production 500 errors.',
      'Redesigned Azure SQL schemas and added validation at each application layer.',
      'Fixed recurring incidents: 500s, null-reference crashes, cloud misconfigurations.',
      'Node.js services behind the product’s analytics dashboard.',
    ],
    interesting: 'Most of the job is deciding with enterprise stakeholders what to build — then making sure it can’t silently corrupt data.',
    stack: ['Node.js', 'Azure SQL', 'REST API design', 'Schema design', 'Data validation'],
    visual: 'enrichly',
  },
  {
    id: 'able',
    index: '04',
    name: 'AI support desk',
    kicker: 'GPT-3 in production, 2023',
    role: 'Software Development Engineer · Able',
    period: 'Jun 2023 — May 2024',
    summary: 'A support ticketing portal with real-time chat and a GPT-3 assistant that drafts replies for agents.',
    problem: 'A support team buried in repetitive tickets, answering each one from scratch.',
    built: [
      'Ticketing portal with real-time user–agent chat over WebSockets.',
      'GPT-3 assisted replies inside the agent’s workflow — cutting support-team workload by 50%.',
      'A self-booking tool on the Google Meet API with automated scheduling and notifications — 20% fewer reschedules.',
    ],
    interesting: 'This was LLMs in production before ChatGPT made it normal: the model suggested, a human decided.',
    stack: ['WebSockets', 'OpenAI GPT-3', 'Google Meet API', 'Kotlin (Android)'],
    visual: 'able',
  },
  {
    id: 'whatbytes',
    index: '05',
    name: 'WhatBytes core platform',
    kicker: 'Founding-engineer groundwork',
    role: 'Founding Engineer',
    period: 'May 2024 — May 2025',
    summary: 'The core backend, identity, search and delivery pipeline of an early-stage company.',
    problem: 'Day one: no backend, no auth, no deploy story — and a product that needed all three.',
    built: [
      'Built the core backend and helped set the early technical direction.',
      'Azure AD B2C sign-in (OAuth2, JWT) across backend services.',
      'Elasticsearch for high-volume search, significantly reducing query latency.',
      'Microservices in Django, .NET Core and Next.js; CI/CD to Azure App Services and AWS Elastic Beanstalk; Docker and Kubernetes.',
    ],
    interesting: 'Three frameworks, two clouds, one identity layer — chosen per service rather than per fashion.',
    stack: ['Django', '.NET Core', 'Next.js', 'Elasticsearch', 'Azure AD B2C', 'Docker', 'Kubernetes', 'AWS EB'],
    visual: 'whatbytes',
  },
];

export const archive = [
  { year: 'B.Tech', name: 'Social Distancing Detection', kind: 'Machine learning' },
  { year: 'B.Tech', name: 'Laptop Price Predictor', kind: 'Machine learning' },
  { year: 'B.Tech', name: 'Founders Image Classification', kind: 'Machine learning' },
  { year: 'B.Tech', name: 'ComiChat', kind: 'Android · Kotlin' },
  { year: 'B.Tech', name: 'Medical Store Management System', kind: 'Java' },
  { year: 'B.Tech', name: 'Tweet React / Atlas', kind: 'React' },
];

export type Role = {
  id: string;
  title: string;
  org: string;
  where: string;
  start: number; // fractional year
  end: number | null; // null = present
  approx?: boolean;
  kind: 'work' | 'founder' | 'early' | 'edu';
  label: string;
  points: string[];
};

// y + (month-1)/12
const m = (y: number, mo: number) => y + (mo - 1) / 12;

export const roles: Role[] = [
  {
    id: 'auramiq', title: 'Founder', org: 'Auramiq', where: 'auramiq.com', start: m(2026, 6), end: null, kind: 'founder',
    label: 'Jun 2026 — now',
    points: [
      'Building an AI research and B2B prospecting platform end to end.',
      'Citation-backed multi-engine research (RAG); framework-free core served over REST and MCP.',
      'Scout lead-discovery pipeline on Django REST Framework + Celery with a Next.js dashboard.',
    ],
  },
  {
    id: 'enrichly', title: 'Lead Engineer', org: 'Enrichly HR', where: 'Remote · US-based company', start: m(2025, 5), end: null, kind: 'work',
    label: 'May 2025 — now',
    points: [
      'Own the backend architecture; consolidated frontend business logic into structured REST APIs, reducing production 500s.',
      'Redesigned Azure SQL schemas and added validation at each layer for integrity and query performance.',
      'Fixed recurring production incidents — 500s, null-reference crashes, cloud misconfigurations.',
      'Build the Node.js services behind the analytics dashboard.',
      'Scope requirements with enterprise stakeholders and turn them into features the team can ship.',
    ],
  },
  {
    id: 'whatbytes', title: 'Founding Engineer', org: 'WhatBytes', where: 'Bengaluru', start: m(2024, 5), end: m(2025, 5), kind: 'work',
    label: 'May 2024 — May 2025',
    points: [
      'Built the core backend and helped set the early technical direction.',
      'Added Elasticsearch to high-volume search, significantly reducing query latency.',
      'Integrated Azure AD B2C sign-in (OAuth2, JWT) across backend services.',
      'Shipped microservices in Django, .NET Core and Next.js.',
      'CI/CD to Azure App Services and AWS Elastic Beanstalk; containerized with Docker and Kubernetes.',
    ],
  },
  {
    id: 'able', title: 'Software Development Engineer', org: 'Able', where: 'Bengaluru', start: m(2023, 6), end: m(2024, 5), kind: 'work',
    label: 'Jun 2023 — May 2024',
    points: [
      'Support ticketing portal with real-time WebSocket chat and a GPT-3 assistant — support workload down 50%.',
      'Self-booking tool on the Google Meet API with automated scheduling and notifications — reschedules down 20%.',
      'Shipped 20+ Android app improvements and updates in Kotlin.',
    ],
  },
  {
    id: 'ineuron', title: 'ML Intern', org: 'iNeuron.ai', where: 'Remote', start: m(2023, 1), end: m(2023, 3), kind: 'early',
    label: 'Jan — Feb 2023',
    points: ['Machine-learning internship: models, data preprocessing and evaluation.'],
  },
  {
    id: 'mentor', title: 'DSA Mentor', org: 'GLA University', where: 'Mathura', start: m(2023, 1), end: m(2023, 6), approx: true, kind: 'early',
    label: '2023',
    points: ['Mentored fellow students in data structures and algorithms.'],
  },
  {
    id: 'smartbridge', title: 'Android Developer Intern', org: 'TheSmartBridge × Google Developers', where: 'Remote', start: m(2022, 8), end: m(2022, 11), kind: 'early',
    label: 'Aug — Oct 2022',
    points: ['Android development internship run with Google Developers — Kotlin and modern Android.'],
  },
  {
    id: 'gla', title: 'B.Tech, Computer Science', org: 'GLA University', where: 'Mathura · GPA 8.51/10', start: 2020.5, end: 2024.5, kind: 'edu',
    label: '2020 — 2024',
    points: ['Computer science with a data-analytics focus. GPA 8.51 / 10.'],
  },
];

export const certifications = [
  { name: 'Azure AI Fundamentals', by: 'Microsoft', year: '2022' },
  { name: 'Azure Data Fundamentals', by: 'Microsoft', year: '2022' },
  { name: 'Data Engineering, Big Data & ML on GCP', by: 'Google Cloud', year: '2022' },
  { name: 'Machine Learning to Deep Learning', by: 'ISRO & IIRS', year: '2022' },
];

// Contexts used by the arsenal to trace where a tool actually shipped.
export const contexts = [
  { id: 'auramiq', label: 'Auramiq' },
  { id: 'enrichly', label: 'Enrichly HR' },
  { id: 'whatbytes', label: 'WhatBytes' },
  { id: 'able', label: 'Able' },
  { id: 'early', label: 'Internships & university' },
  { id: 'toolkit', label: 'General toolkit' },
] as const;
export type ContextId = (typeof contexts)[number]['id'];

export type Tool = { name: string; ctx: ContextId[]; core?: boolean };
export type Layer = { id: string; code: string; title: string; tools: Tool[] };

export const arsenal: Layer[] = [
  {
    id: 'ai', code: 'L0', title: 'AI & ML',
    tools: [
      { name: 'MCP servers', ctx: ['auramiq'], core: true },
      { name: 'RAG with citations', ctx: ['auramiq'], core: true },
      { name: 'OpenAI API', ctx: ['auramiq', 'able'], core: true },
      { name: 'Prompt engineering', ctx: ['auramiq', 'able'] },
      { name: 'Agent tooling', ctx: ['auramiq'] },
      { name: 'Workflow automation', ctx: ['auramiq'] },
      { name: 'ML fundamentals', ctx: ['early'] },
    ],
  },
  {
    id: 'lang', code: 'L1', title: 'Languages',
    tools: [
      { name: 'Python', ctx: ['auramiq', 'whatbytes', 'early'], core: true },
      { name: 'TypeScript', ctx: ['toolkit'], core: true },
      { name: 'JavaScript', ctx: ['toolkit', 'early'] },
      { name: 'C#', ctx: ['whatbytes'] },
      { name: 'SQL', ctx: ['enrichly', 'early'] },
      { name: 'Kotlin', ctx: ['able', 'early'] },
      { name: 'Java', ctx: ['early'] },
    ],
  },
  {
    id: 'fe', code: 'L2', title: 'Frontend',
    tools: [
      { name: 'Next.js', ctx: ['auramiq', 'whatbytes'], core: true },
      { name: 'React', ctx: ['auramiq', 'whatbytes', 'early'], core: true },
      { name: 'Android', ctx: ['able', 'early'] },
    ],
  },
  {
    id: 'be', code: 'L3', title: 'Backend',
    tools: [
      { name: 'Django / DRF', ctx: ['auramiq', 'whatbytes'], core: true },
      { name: 'Node.js', ctx: ['enrichly'], core: true },
      { name: 'Celery', ctx: ['auramiq'] },
      { name: '.NET Core', ctx: ['whatbytes'] },
      { name: 'REST API design', ctx: ['enrichly', 'whatbytes', 'auramiq'] },
      { name: 'Microservices', ctx: ['whatbytes'] },
      { name: 'WebSockets', ctx: ['able'] },
      { name: 'OAuth2 / JWT', ctx: ['whatbytes'] },
    ],
  },
  {
    id: 'data', code: 'L4', title: 'Data',
    tools: [
      { name: 'PostgreSQL', ctx: ['toolkit'], core: true },
      { name: 'Azure SQL', ctx: ['enrichly'], core: true },
      { name: 'Elasticsearch', ctx: ['whatbytes'] },
      { name: 'Redis', ctx: ['toolkit'] },
      { name: 'MySQL', ctx: ['early'] },
      { name: 'MongoDB', ctx: ['toolkit'] },
      { name: 'Schema design', ctx: ['enrichly'] },
    ],
  },
  {
    id: 'cloud', code: 'L5', title: 'Cloud & infrastructure',
    tools: [
      { name: 'Azure App Services', ctx: ['whatbytes', 'toolkit'], core: true },
      { name: 'Azure AD B2C', ctx: ['whatbytes'] },
      { name: 'Microsoft Graph API', ctx: ['toolkit'] },
      { name: 'AWS EC2 / Elastic Beanstalk', ctx: ['whatbytes'] },
      { name: 'Docker', ctx: ['whatbytes'], core: true },
      { name: 'Kubernetes', ctx: ['whatbytes'] },
    ],
  },
  {
    id: 'tools', code: 'L6', title: 'Developer tooling',
    tools: [
      { name: 'GitHub Actions', ctx: ['toolkit'] },
      { name: 'CI/CD', ctx: ['whatbytes'] },
      { name: 'Claude Code', ctx: ['toolkit'], core: true },
      { name: 'Git', ctx: ['toolkit'] },
    ],
  },
];

export const beyond = [
  {
    k: 'Teaching',
    title: 'DSA mentor',
    body: 'In 2023 I mentored other students at GLA University in data structures and algorithms. Explaining a solution is the fastest way to find out whether you really understand it.',
  },
  {
    k: 'Roots',
    title: 'Competitive programming',
    body: 'I came up through algorithm problems and Android apps. That habit — reduce the problem, then make it fast — still shows up in how I design systems.',
  },
  {
    k: 'Learning',
    title: 'Always enrolled in something',
    body: 'Azure AI and Data Fundamentals, Google Cloud’s data engineering & ML specialization, and ISRO & IIRS’s machine learning to deep learning course — all during university.',
  },
  {
    k: 'Building',
    title: 'Indie hacker',
    body: 'Auramiq started as a side project and became the thing I think about most. I like owning a product all the way: the idea, the code, the deploy, the first user.',
  },
];

export const sections = [
  { id: 'top', label: 'Index' },
  { id: 'about', label: 'About' },
  { id: 'build', label: 'What I build' },
  { id: 'work', label: 'Selected work' },
  { id: 'experience', label: 'Experience' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'console', label: 'Console' },
  { id: 'beyond', label: 'Beyond' },
  { id: 'contact', label: 'Contact' },
];
