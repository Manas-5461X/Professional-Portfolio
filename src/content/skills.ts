export type SkillMaturity = 'applied' | 'exploring';

export interface SkillItem {
  name: string;
  maturity: SkillMaturity;
  evidence: string;
  projectSlug?: string;
}

export interface SkillCategory {
  id: string;
  index: string;
  title: string;
  summary: string;
  items: SkillItem[];
}

export interface ExploringTopic {
  topic: string;
  why: string;
  evidence: string;
  repoUrl?: string;
  keyStudyQuestions?: string[];
  relatedTechnologies?: string[];
}


export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    index: '01',
    title: 'Frontend Development',
    summary:
      'Building responsive interfaces, reusable components, and interactive web experiences using modern frontend technologies.',
    items: [
      {
        name: 'HTML',
        maturity: 'applied',
        evidence: 'Semantic markup, accessible forms, and structured web interfaces.',
      },
      {
        name: 'CSS',
        maturity: 'applied',
        evidence: 'Responsive layouts, custom styling, animations, and theme systems.',
      },
      {
        name: 'JavaScript',
        maturity: 'applied',
        evidence: 'Application logic, interactive interfaces, API integration, and client-side functionality.',
      },
      {
        name: 'React',
        maturity: 'applied',
        evidence: 'Component-based applications and interactive developer tools.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'TypeScript',
        maturity: 'applied',
        evidence: 'Typed application architecture and frontend/backend development.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'Vite',
        maturity: 'applied',
        evidence: 'Frontend development, build tooling, and HMR workflows.',
        projectSlug: 'secscan-io',
      },
      {
        name: 'Tailwind CSS',
        maturity: 'applied',
        evidence: 'Responsive interfaces and reusable styling systems.',
        projectSlug: 'devguard-pro',
      },
    ],
  },

  {
    id: 'backend',
    index: '02',
    title: 'Backend Development & APIs',
    summary:
      'Developing server-side applications, integrating external services, and working with databases and authentication systems.',
    items: [
      {
        name: 'Node.js',
        maturity: 'applied',
        evidence: 'JavaScript runtime for backend services and application development.',
        projectSlug: 'secscan-io',
      },
      {
        name: 'Express.js',
        maturity: 'applied',
        evidence: 'Backend API development and middleware-based request handling.',
        projectSlug: 'secscan-io',
      },
      {
        name: 'Fastify',
        maturity: 'applied',
        evidence: 'REST API architecture and backend services.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'REST APIs',
        maturity: 'applied',
        evidence: 'Building API endpoints and integrating external services.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'Firebase',
        maturity: 'applied',
        evidence: 'Firebase Authentication and Firestore integration.',
        projectSlug: 'devguard-pro',
      },
      {
        name: 'PostgreSQL',
        maturity: 'applied',
        evidence: 'Relational database design, queries, and application integration.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'Prisma ORM',
        maturity: 'applied',
        evidence: 'Database models, migrations, and relational data access.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'API Integration',
        maturity: 'applied',
        evidence: 'Working with GitHub REST APIs, OSV.dev, and AI service integrations.',
        projectSlug: 'secscan-io',
      },
      {
        name: 'Authentication',
        maturity: 'applied',
        evidence: 'Authentication workflows, token verification, and user-scoped access.',
        projectSlug: 'codeforensics',
      },
    ],
  },

  {
    id: 'languages',
    index: '03',
    title: 'Programming Languages',
    summary:
      'Working across scripting, application development, and systems-oriented programming.',
    items: [
      {
        name: 'Python',
        maturity: 'applied',
        evidence: 'Packet parsing, network analysis, scripting, and machine learning practice.',
        projectSlug: 'dpi-engine',
      },
      {
        name: 'JavaScript',
        maturity: 'applied',
        evidence: 'Frontend and backend application development.',
      },
      {
        name: 'TypeScript',
        maturity: 'applied',
        evidence: 'Type-safe application development and structured codebases.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'Java',
        maturity: 'applied',
        evidence: 'Object-oriented programming, data structures, and algorithmic problem solving.',
      },
      {
        name: 'C++',
        maturity: 'applied',
        evidence: 'Programming fundamentals, data structures, and systems concepts.',
      },
    ],
  },

  {
    id: 'ai-ml',
    index: '04',
    title: 'AI & Machine Learning',
    summary:
      'Exploring machine learning model development while building practical applications powered by modern AI systems.',
    items: [
      {
        name: 'Machine Learning',
        maturity: 'exploring',
        evidence: 'Learning model development, training, evaluation, and core ML algorithms.',
      },
      {
        name: 'AI Model Development',
        maturity: 'exploring',
        evidence: 'Experimenting with building, training, and evaluating machine learning models.',
      },
      {
        name: 'AI Application Development',
        maturity: 'applied',
        evidence: 'Integrating AI capabilities and model responses into developer-focused applications.',
        projectSlug: 'devguard-pro',
      },
      {
        name: 'Large Language Models',
        maturity: 'exploring',
        evidence: 'Exploring LLM capabilities, model integrations, and AI-powered workflows.',
      },
      {
        name: 'Retrieval-Augmented Generation',
        maturity: 'exploring',
        evidence: 'Learning how retrieval pipelines connect external knowledge with language models.',
      },
      {
        name: 'AI Engineering',
        maturity: 'exploring',
        evidence: 'Experimenting with model integrations, prompting, structured outputs, and AI application architecture.',
      },
    ],
  },

  {
    id: 'cybersecurity',
    index: '05',
    title: 'Cybersecurity & Networking',
    summary:
      'Exploring application security, repository analysis, network protocols, and security-focused software engineering.',
    items: [
      {
        name: 'Cybersecurity Fundamentals',
        maturity: 'applied',
        evidence: 'Security rules covering injection, XSS, exposed secrets, and unsafe code patterns.',
        projectSlug: 'devguard-pro',
      },
      {
        name: 'Static Code Analysis',
        maturity: 'applied',
        evidence: 'Analyzing source code and identifying potentially unsafe patterns.',
        projectSlug: 'secscan-io',
      },
      {
        name: 'OSINT',
        maturity: 'exploring',
        evidence: 'Exploring public-source intelligence, repository investigation, and digital footprint discovery.',
      },
      {
        name: 'Computer Networks',
        maturity: 'applied',
        evidence: 'Working with Ethernet, IPv4, TCP, UDP, and network protocol fundamentals.',
        projectSlug: 'dpi-engine',
      },
      {
        name: 'Network Analysis',
        maturity: 'applied',
        evidence: 'PCAP parsing, packet inspection, flow analysis, and TLS SNI extraction.',
        projectSlug: 'dpi-engine',
      },
      {
        name: 'Application Security',
        maturity: 'applied',
        evidence: 'Input validation, security middleware, authentication, and access-control considerations.',
        projectSlug: 'codeforensics',
      },
    ],
  },

  {
    id: 'cs-core',
    index: '06',
    title: 'Computer Science Fundamentals',
    summary:
      'Building strong foundations in algorithms, databases, object-oriented design, and problem solving.',
    items: [
      {
        name: 'Data Structures & Algorithms',
        maturity: 'applied',
        evidence: 'Algorithmic problem solving, graph traversal, trees, and complexity analysis.',
      },
      {
        name: 'Database Management Systems',
        maturity: 'applied',
        evidence: 'Relational database concepts, schema design, indexing, and constraints.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'SQL',
        maturity: 'applied',
        evidence: 'Relational queries, PostgreSQL, and database operations.',
        projectSlug: 'codeforensics',
      },
      {
        name: 'Object-Oriented Programming',
        maturity: 'applied',
        evidence: 'Object-oriented design and modular application architecture.',
      },
      {
        name: 'Operating Systems',
        maturity: 'exploring',
        evidence: 'Learning processes, memory management, concurrency, and operating system fundamentals.',
      },
      {
        name: 'Computer Networks',
        maturity: 'applied',
        evidence: 'Understanding network layers, protocols, packet structures, and communication.',
        projectSlug: 'dpi-engine',
      },
      {
        name: 'Problem Solving',
        maturity: 'applied',
        evidence: 'Practicing algorithmic challenges and debugging programming problems.',
      },
    ],
  },

  {
    id: 'systems',
    index: '07',
    title: 'Systems Programming',
    summary:
      'Understanding low-level software concepts through networking tools, command-line applications, and systems experimentation.',
    items: [
      {
        name: 'Linux',
        maturity: 'applied',
        evidence: 'Working with Linux environments, command-line tools, and shell workflows.',
      },
      {
        name: 'Shell Programming',
        maturity: 'applied',
        evidence: 'Exploring shell implementation and command execution fundamentals.',
      },
      {
        name: 'Packet Parsing',
        maturity: 'applied',
        evidence: 'Implementing binary packet parsing and protocol decoding.',
        projectSlug: 'dpi-engine',
      },
      {
        name: 'Concurrency',
        maturity: 'exploring',
        evidence: 'Learning concurrent execution and multiprocessing concepts.',
      },
      {
        name: 'Memory & Processes',
        maturity: 'exploring',
        evidence: 'Studying process execution, memory handling, and low-level computing concepts.',
      },
    ],
  },

  {
    id: 'devtools',
    index: '08',
    title: 'Developer Tools & Platforms',
    summary:
      'Using modern development tools, version control, and deployment workflows to build and maintain software.',
    items: [
      {
        name: 'Git',
        maturity: 'applied',
        evidence: 'Version control, branching, commits, and repository management.',
      },
      {
        name: 'GitHub',
        maturity: 'applied',
        evidence: 'Maintaining public repositories and collaborating through GitHub workflows.',
      },
      {
        name: 'VS Code',
        maturity: 'applied',
        evidence: 'Primary development environment and code editing workflows.',
      },
      {
        name: 'Postman',
        maturity: 'applied',
        evidence: 'Testing and inspecting backend API endpoints.',
      },
      {
        name: 'Docker',
        maturity: 'exploring',
        evidence: 'Learning containerization, Dockerfiles, and multi-service development environments.',
        projectSlug: 'secscan-io',
      },
      {
        name: 'Cloud Deployment',
        maturity: 'applied',
        evidence: 'Deploying frontend and backend applications using modern hosting platforms.',
      },
    ],
  },

  {
    id: 'opensource',
    index: '09',
    title: 'Open Source & Engineering',
    summary:
      'Learning from public codebases, building in public, and improving software through practical engineering.',
    items: [
      {
        name: 'Open-Source Development',
        maturity: 'applied',
        evidence: 'Building and maintaining publicly available software projects.',
      },
      {
        name: 'Codebase Exploration',
        maturity: 'applied',
        evidence: 'Understanding existing project structures, dependencies, and implementation choices.',
      },
      {
        name: 'Technical Documentation',
        maturity: 'applied',
        evidence: 'Documenting project architecture, setup instructions, and technical decisions.',
      },
    ],
  },
];




export const CURRENTLY_EXPLORING: ExploringTopic[] = [
  {
    topic: 'AI Model Development & Machine Learning',

    why:
      'Exploring how machine learning models are built, trained, evaluated and improved, while developing a deeper understanding of the mathematics and algorithms behind intelligent systems.',

    evidence:
      'Working through ML algorithms, model implementations, experimentation and AI engineering concepts.',

    keyStudyQuestions: [
      'How do machine learning algorithms learn patterns from data?',
      'How do different models handle training, evaluation and generalization?',
      'What happens mathematically during gradient descent and optimization?',
      'How can models be improved through feature engineering and hyperparameter tuning?'
    ],

    relatedTechnologies: [
      'Python',
      'NumPy',
      'Pandas',
      'Scikit-learn',
      'PyTorch',
      'Jupyter'
    ]
  },

  {
    topic: 'Building a Security-Focused SaaS Platform',

    why:
      'Designing a developer-focused security platform that brings code analysis, vulnerability detection, AI-assisted security insights and developer workflows into one product.',

    evidence:
      'Exploring SaaS architecture, security scanning engines, repository analysis, AI integrations and product infrastructure.',

    keyStudyQuestions: [
      'How can repository security scanning work efficiently at scale?',
      'How should static analysis and vulnerability detection engines be designed?',
      'How can authentication, API security and user isolation be handled?',
      'How can AI assist developers without compromising security or reliability?'
    ],

    relatedTechnologies: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'GitHub API',
      'Docker'
    ]
  },

  {
    topic: 'Open-Source Development & Collaboration',

    why:
      'Learning from real-world codebases, exploring how established projects are engineered, identifying security issues and contributing meaningful improvements to the developer ecosystem.',

    evidence:
      'Reviewing open-source repositories, understanding implementation choices, exploring project architecture and building publicly available software.',

    keyStudyQuestions: [
      'How are large open-source projects structured and maintained?',
      'How do developers identify, reproduce and fix issues in unfamiliar codebases?',
      'What makes a contribution useful, maintainable and production-ready?',
      'How do testing, documentation and code reviews improve software quality?'
    ],

    relatedTechnologies: [
      'Git',
      'GitHub',
      'TypeScript',
      'JavaScript',
      'Python',
      'GitHub Actions'
    ]
  }
];



