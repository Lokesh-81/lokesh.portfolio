export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  whatIWorkedOn: string[];
  technologies: string[];
  status: 'Live' | 'In Development';
  liveUrl: string;
  year: string;
  accentColor: string;
  gradient: string;
  translations?: Record<
    string,
    {
      name?: string;
      tagline?: string;
      description?: string;
      whatIWorkedOn?: string[];
    }
  >;
}

export const projects: Project[] = [
  {
    id: 'lumora-ai',
    number: '01',
    name: 'Lumora AI',
    category: 'AI & FinTech Platform',
    tagline: 'AI-driven financial intelligence & investment research engine',
    description:
      'An intelligent investment research platform leveraging modern LLMs to extract insights from financial reports, synthesize market trends, and deliver actionable executive summaries.',
    whatIWorkedOn: [
      'Integrated Gemini AI API for contextual financial document synthesis',
      'Built resilient caching and fast retrieval workflows using MongoDB and Redis',
      'Designed clean financial charts and high-density analytical dashboards',
      'Implemented streaming AI response components with Markdown and citation support',
    ],
    technologies: ['Next.js', 'TypeScript', 'Gemini AI API', 'MongoDB', 'Redis', 'Tailwind CSS'],
    status: 'Live',
    liveUrl: 'https://www.lumoraai.in/',
    year: '2026',
    accentColor: '#ec4899',
    gradient: 'from-pink-900/40 via-rose-950/20 to-black/60',
    translations: {
      fr: {
        name: 'Lumora AI',
        tagline: "Moteur d'intelligence financière et de recherche d'investissement alimenté par l'IA",
        description:
          "Une plateforme intelligente de recherche d'investissement utilisant des modèles LLM de pointe pour analyser les rapports financiers, synthétiser les tendances de marché et générer des résumés stratégiques actionnables.",
        whatIWorkedOn: [
          'Intégration de l’API Gemini AI pour la synthèse contextuelle de documents financiers',
          'Mise en place d’un cache résilient et de flux d’extraction ultra-rapides avec MongoDB et Redis',
          'Conception de graphiques financiers élégants et de tableaux de bord analytiques haute densité',
          'Développement de composants de réponse IA en streaming avec support Markdown et citations',
        ],
      },
    },
  },
  {
    id: 'belvo',
    number: '02',
    name: 'Belvo',
    category: 'Business & Startup Platform',
    tagline: 'Modern business operations & digital client onboarding platform',
    description:
      'A high-performance business and startup platform designed to streamline client interaction, present service solutions, and provide a polished digital touchpoint for modern enterprise needs.',
    whatIWorkedOn: [
      'Engineered responsive full-stack frontend architecture using React, Vite, and Tailwind CSS',
      'Designed and implemented modular, reusable UI components for seamless service presentation',
      'Integrated secure client communication channels and structured API request handling',
      'Optimized production build performance, reducing initial load latency',
    ],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'REST APIs'],
    status: 'Live',
    liveUrl: 'https://www.belvo.buzz/',
    year: '2026',
    accentColor: '#a78bfa',
    gradient: 'from-purple-900/40 via-violet-950/20 to-black/60',
    translations: {
      fr: {
        name: 'Belvo',
        tagline: "Plateforme moderne d'opérations d'entreprise et d'intégration client digitale",
        description:
          "Plateforme haute performance conçue pour simplifier les interactions clients, valoriser les offres de services et offrir un point de contact numérique soigné adapté aux entreprises contemporaines.",
        whatIWorkedOn: [
          'Architecture frontend réactive et modulaire construite avec React, Vite et Tailwind CSS',
          'Conception et développement de composants UI réutilisables pour une présentation fluide des offres',
          'Intégration de canaux de communication sécurisés et de gestion structurée des requêtes API',
          'Optimisation rigoureuse des performances de build et réduction de la latence au chargement',
        ],
      },
    },
  },
  {
    id: 'indira-thakur-photography',
    number: '03',
    name: 'Indira Thakur Photography',
    category: 'Photography & Creative Showcase',
    tagline: 'Editorial photography showcase & artistic client gallery',
    description:
      'A visual-first creative portfolio engineered for high-resolution visual storytelling, featuring fluid masonry layouts, editorial lightbox experiences, and client booking inquiry flows.',
    whatIWorkedOn: [
      'Engineered fluid masonry image galleries with adaptive layout recalculations',
      'Implemented responsive image optimization and lazy-loading for heavy media assets',
      'Designed seamless full-screen photo inspection and modal transitions',
      'Integrated direct photoshoot booking and consultation inquiry forms',
    ],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Cloudinary CDN'],
    status: 'Live',
    liveUrl: 'https://www.indirathakur.com/',
    year: '2025',
    accentColor: '#c084fc',
    gradient: 'from-fuchsia-900/40 via-purple-950/20 to-black/60',
    translations: {
      fr: {
        name: 'Indira Thakur Photography',
        tagline: 'Vitrine de photographie éditoriale et galerie artistique pour clients',
        description:
          'Un portfolio créatif visuel conçu pour la narration photographique haute résolution, offrant des galeries en maçonnerie fluide, des visionneuses éditoriales et un parcours de réservation intuitif.',
        whatIWorkedOn: [
          'Création de galeries photos fluides en maçonnerie avec recalcul dynamique de la disposition',
          'Optimisation responsive des images et chargement différé (lazy-loading) des médias haute définition',
          'Conception d’un mode d’inspection plein écran sans couture avec transitions animées',
          'Intégration d’un formulaire complet de prise de rendez-vous et de demande de consultation',
        ],
      },
    },
  },
  {
    id: 'jv-ed-tech',
    number: '04',
    name: 'JV EdTech',
    category: 'Education & EdTech Portal',
    tagline: 'Interactive digital learning portal & student course manager',
    description:
      'An educational platform built to facilitate structured digital courses, interactive student learning modules, progress tracking, and assessment evaluation.',
    whatIWorkedOn: [
      'Developed structured course exploration and modular lesson player interfaces',
      'Implemented client-side progress tracking and module completion persistence',
      'Engineered interactive assessment quizzes with instant scoring and feedback',
      'Structured scalable PostgreSQL / Supabase schemas for course materials and users',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase / PostgreSQL'],
    status: 'Live',
    liveUrl: 'https://jv-ed-tech.vercel.app/',
    year: '2025',
    accentColor: '#60a5fa',
    gradient: 'from-blue-900/40 via-indigo-950/20 to-black/60',
    translations: {
      fr: {
        name: 'JV EdTech',
        tagline: 'Portail d’apprentissage numérique interactif et gestionnaire de cours pour étudiants',
        description:
          'Une plateforme éducative complète pour dispenser des cours numériques structurés, des modules interactifs, un suivi en temps réel des acquis et des évaluations formatives.',
        whatIWorkedOn: [
          'Développement de modules de cours interactifs et d’un lecteur de leçons ergonomique',
          'Implémentation du suivi de progression et de la persistance des modules complétés',
          'Conception de quiz d’évaluation interactifs avec notation instantanée et feedback ciblé',
          'Structuration de schémas de données évolutifs PostgreSQL / Supabase pour le contenu et les profils',
        ],
      },
    },
  },
  {
    id: 'naivaidya',
    number: '05',
    name: 'Naivaidya',
    category: 'Healthcare & Technology',
    tagline: 'Healthcare portal & patient management workflow engine',
    description:
      'A comprehensive digital healthcare management platform facilitating patient coordination, appointment authentication, and administrative hospital workflows with high reliability.',
    whatIWorkedOn: [
      'Served as Frontend Developer and Team Lead, directing UI architecture and sprint deliverables',
      'Implemented secure OTP-based authentication and user verification flows',
      'Engineered comprehensive administrative dashboards for patient records and scheduling',
      'Integrated Supabase backend services for real-time data persistence and query optimization',
    ],
    technologies: ['React', 'Supabase', 'Tailwind CSS', 'OTP Auth', 'REST APIs'],
    status: 'Live',
    liveUrl: 'https://naivaidya-naivaidya.vercel.app/',
    year: '2025 - 2026',
    accentColor: '#38bdf8',
    gradient: 'from-sky-900/40 via-blue-950/20 to-black/60',
    translations: {
      fr: {
        name: 'Naivaidya',
        tagline: 'Portail de santé & moteur de gestion des flux patients',
        description:
          'Une plateforme de santé numérique facilitant la coordination des soins, l’authentification sécurisée des rendez-vous et la gestion administrative hospitalière.',
        whatIWorkedOn: [
          'Développeur Frontend et Responsable d’équipe : direction de l’architecture UI et des livrables',
          'Implémentation de flux d’authentification sécurisée par OTP et validation des identités',
          'Conception de tableaux de bord administratifs complets pour les dossiers patients et plannings',
          'Intégration de Supabase pour la persistance temps réel et l’optimisation des requêtes',
        ],
      },
    },
  },
  {
    id: 'antara-global',
    number: '06',
    name: 'Antara Global',
    category: 'Corporate & Global Commerce',
    tagline: 'Enterprise international business & corporate trade portal',
    description:
      'An enterprise-scale corporate platform designed for global commerce and international trade representation, delivering high-trust corporate storytelling and global inquiry workflows.',
    whatIWorkedOn: [
      'Built modern editorial pages with Next.js App Router and server-rendered optimizations',
      'Crafted smooth scroll-driven micro-interactions and transitions with Framer Motion',
      'Constructed multi-locale corporate inquiry forms and structured lead routing',
      'Executed comprehensive Core Web Vitals optimizations and semantic SEO metadata',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    status: 'Live',
    liveUrl: 'https://anatara-global.vercel.app/',
    year: '2025',
    accentColor: '#f59e0b',
    gradient: 'from-amber-900/40 via-orange-950/20 to-black/60',
    translations: {
      fr: {
        name: 'Antara Global',
        tagline: 'Portail d’entreprise pour le commerce international & transactions mondiales',
        description:
          'Une plateforme d’envergure internationale conçue pour représenter les échanges commerciaux mondiaux, valoriser l’image de marque et gérer les demandes d’affaires.',
        whatIWorkedOn: [
          'Création de pages éditoriales modernes avec Next.js App Router et rendu optimisé côté serveur',
          'Conception de micro-interactions et transitions fluides animées par Framer Motion',
          'Développement de formulaires de contact multilingues avec routage structuré des opportunités',
          'Optimisations approfondies des Core Web Vitals et balisage sémantique pour le référencement',
        ],
      },
    },
  },
  {
    id: 'foundarly',
    number: '07',
    name: 'Foundarly Business World',
    category: 'Startup & Venture Builder',
    tagline: 'Collaborative founder ecosystem & venture builder workspace',
    description:
      'A centralized digital platform built to empower startup founders and early-stage innovators with venture tracking, resource discovery, and collaborative tooling.',
    whatIWorkedOn: [
      'Developed interactive founder workspace dashboards using React and TypeScript',
      'Constructed RESTful backend endpoints utilizing Node.js, Express, and MongoDB',
      'Enforced strict TypeScript typing across shared client-server data models',
      'Crafted responsive data visualizations and venture milestone trackers',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'Tailwind CSS', 'MongoDB'],
    status: 'Live',
    liveUrl: 'https://www.foundarlybusinessworld.in/',
    year: '2025',
    accentColor: '#34d399',
    gradient: 'from-emerald-900/40 via-teal-950/20 to-black/60',
    translations: {
      fr: {
        name: 'Foundarly Business World',
        tagline: 'Écosystème collaboratif de fondateurs & espace de création de startups',
        description:
          'Une plateforme numérique centralisée pour accompagner les fondateurs et créateurs de startups avec des outils de suivi de projets, de partage de ressources et de collaboration.',
        whatIWorkedOn: [
          'Développement de tableaux de bord interactifs pour fondateurs avec React et TypeScript',
          'Conception d’API RESTful fiables basées sur Node.js, Express et MongoDB',
          'Typage strict de bout en bout garantissant l’intégrité des modèles de données',
          'Visualisations de données réactives et indicateurs d’avancement des étapes clés de création',
        ],
      },
    },
  },
];

