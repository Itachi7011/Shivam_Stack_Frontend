import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import {
  Shield, Smile, Briefcase, Tv2, BarChart3, Brain, FileText,
  Code2, Building2, HeartPulse, Scale, ShoppingCart, Globe,
  Gamepad2, ExternalLink, Star, CheckCircle2, ChevronDown,
  Zap, Layers, Rocket, Phone, Mail, MessageSquare, Calendar,
  Users, Award, Clock, TrendingUp, Database, Server, Cpu,
  Palette, Lock, ShoppingBag, LayoutDashboard, Search, ArrowRight,
  Sparkles, Target, GitBranch, Monitor, Smartphone, Terminal,
  Package, Activity, Wrench, PenTool, Send, MapPin, Linkedin,
  Github, Twitter, Coffee, BookOpen, ChevronRight, X, Check
} from 'lucide-react';

import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    num: '01',
    title: 'AuthNester',
    subtitle: 'Enterprise Authentication SaaS Platform',
    url: 'https://authnester.netlify.app/',
    type: 'SaaS',
    category: 'auth',
    featured: true,
    icon: Shield,
    iconBg: 'ss-portfolio-bg-accent-1',
    image: '/images/projects/authnester.png', // ← replace with your screenshot
    description:
      'AuthNester is a production-grade authentication and identity-management SaaS platform built to handle the full auth lifecycle for modern web applications. It provides secure, token-based user signup and login flows with multi-factor authentication, session hardening, and cloud-ready infrastructure.',
    highlights: [
      'Full signup/login lifecycle with email verification and password reset flows',
      'JWT & refresh-token architecture with sliding session windows',
      'Multi-factor authentication (TOTP/OTP) for enhanced account security',
      'Role-based access control (RBAC) ready infrastructure',
      'MongoDB Atlas user storage with encrypted credentials (bcrypt)',
      'RESTful Express.js API with rate-limiting and CORS protection',
      'React dashboard UI for auth management and user monitoring',
      'Netlify + serverless-friendly deployment pipeline',
    ],
    notableFeature: 'Advanced MFA workflows and secure session token rotation — plug-and-play auth for any MERN app.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Netlify', 'bcrypt', 'TOTP'],
  },
  {
    id: 2,
    num: '02',
    title: 'Tukka Time',
    subtitle: 'Desi Fortune Cookie & Prediction App',
    url: 'https://tukka-time.netlify.app/',
    type: 'Fun / Interactive',
    category: 'fun',
    featured: false,
    icon: Smile,
    iconBg: 'ss-portfolio-bg-accent-2',
    image: '/images/projects/tukka-time.png',
    description:
      'Tukka Time is a delightful, culturally spiced fortune-cookie web experience that generates randomized Desi-flavored predictions, funny suggestions, and witty quotes on every tap. Built as a lightweight SPA with a hyper-shareable social mechanic.',
    highlights: [
      'Randomized fortune/prediction engine with 500+ unique Desi quotes',
      'Animated card-flip reveal for each fortune',
      'Cultural humor categories — Bollywood, cricket, family, career, love',
      'Share-to-WhatsApp / social share integration',
      'Mobile-first design with PWA-ready structure',
      'Colorful, vibrant UI with smooth micro-animations',
    ],
    notableFeature: 'Randomised multi-category Desi fortune engine — endlessly replayable with cultural humour hooks.',
    tech: ['React', 'CSS Animations', 'Netlify', 'PWA'],
  },
  {
    id: 3,
    num: '03',
    title: 'Apply ARC Job',
    subtitle: 'Full-Stack Job Application Portal',
    url: 'https://apply-arc-job.netlify.app/',
    type: 'Full Stack',
    category: 'fullstack',
    featured: false,
    icon: Briefcase,
    iconBg: 'ss-portfolio-bg-accent-3',
    image: '/images/projects/apply-arc-job.png',
    description:
      'Apply ARC Job is a comprehensive job board and application management platform that simulates a real-world employment portal. Employers can post, edit, and manage job listings while candidates can browse, filter, and submit applications — all in a clean, professional UI.',
    highlights: [
      'Full CRUD job listing management (Create, Read, Update, Delete)',
      'Candidate application form with resume-style submission',
      'Job search with keyword, location, and type filters',
      'Admin panel for managing posted listings and applications',
      'RESTful Node.js/Express backend with MongoDB persistence',
      'Pagination, sorting, and status tracking for applications',
      'Responsive card-based listing UI with category badges',
      'Email notification-ready architecture',
    ],
    notableFeature: 'End-to-end job lifecycle management — from posting to application tracking in a single platform.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'REST API', 'Netlify'],
  },
  {
    id: 4,
    num: '04',
    title: 'Otaku Wave',
    subtitle: 'Anime Culture Fan Portal',
    url: 'https://otaku-wave.netlify.app/',
    type: 'UI / Design',
    category: 'design',
    featured: false,
    icon: Tv2,
    iconBg: 'ss-portfolio-bg-accent-4',
    image: '/images/projects/otaku-wave.png',
    description:
      'Otaku Wave is a visually immersive anime-themed content platform celebrating otaku culture. The platform showcases anime characters, series info, curated imagery, and fan-focused sections with an animated, dynamic UI that brings the anime aesthetic to the web.',
    highlights: [
      'Animated page transitions and parallax scroll effects',
      'Character showcase cards with hover-reveal bio sections',
      'Genre-based anime series catalog with rich media',
      'Custom SVG illustrations and anime-style UI components',
      'Dark neon aesthetic with gradient overlays and glow effects',
      'Fully responsive — optimised for mobile manga-readers',
      'Smooth entrance animations using CSS keyframes',
    ],
    notableFeature: 'Deeply thematic anime aesthetic with multi-layered animations that feel truly immersive.',
    tech: ['React', 'CSS Animations', 'Framer Motion', 'Netlify'],
  },
  {
    id: 5,
    num: '05',
    title: 'Finance Folio',
    subtitle: 'Portfolio & Finance Analytics Dashboard',
    url: 'https://finance-folio.netlify.app/',
    type: 'Dashboard',
    category: 'dashboard',
    featured: false,
    icon: BarChart3,
    iconBg: 'ss-portfolio-bg-accent-5',
    image: '/images/projects/finance-folio.png',
    description:
      'Finance Folio is an interactive financial dashboard for tracking investment portfolios and visualising performance metrics. It combines real-time data charts, balance summaries, and transaction histories into a clean, professional analytics interface.',
    highlights: [
      'Portfolio performance charts (line, bar, pie) via Chart.js / Recharts',
      'Balance overview with P&L, ROI, and trend indicators',
      'Transaction history table with date, amount, and category filters',
      'Asset allocation donut chart with percentage breakdowns',
      'Watchlist module with price delta and sparklines',
      'Dark-mode-first UI optimised for extended financial analysis',
      'REST API integration for live or mock data feeds',
    ],
    notableFeature: 'Rich interactive chart suite — portfolio growth, asset allocation, and transaction analytics in one dashboard.',
    tech: ['React', 'Recharts', 'Node.js', 'REST API', 'MongoDB', 'Netlify'],
  },
  {
    id: 6,
    num: '06',
    title: 'Market AI Pro',
    subtitle: 'AI-Driven Market Insight & Prediction Engine',
    url: 'https://market-ai-pro.netlify.app/',
    type: 'AI / ML',
    category: 'ai',
    featured: false,
    icon: Brain,
    iconBg: 'ss-portfolio-bg-accent-6',
    image: '/images/projects/market-ai-pro.png',
    description:
      'Market AI Pro is an AI-powered market intelligence platform that leverages machine-learning logic and data APIs to surface trend predictions, market signals, and actionable insights. It transforms raw market data into clear visual analytics with AI-generated summaries.',
    highlights: [
      'AI inference engine for trend prediction and signal detection',
      'Market sentiment analysis with confidence score visualisation',
      'Time-series charts with AI-annotated support/resistance levels',
      'Natural-language market summaries generated via AI API integration',
      'Sector performance heatmaps and comparative analytics',
      'Watchlist with AI-generated buy/hold/sell signals',
      'Real-time data ingestion pipeline with Node.js backend',
      'News aggregation with AI relevance scoring',
    ],
    notableFeature: 'AI-annotated price charts with natural-language market summaries — data science meets trading UX.',
    tech: ['React', 'Node.js', 'AI/ML API', 'Chart.js', 'Python', 'Netlify'],
  },
  {
    id: 7,
    num: '07',
    title: 'Text-to-PDF Converter',
    subtitle: 'Instant Text → PDF Generation Utility',
    url: 'https://text-to-pdf-converting-website.onrender.com/',
    type: 'Utility',
    category: 'utility',
    featured: false,
    icon: FileText,
    iconBg: 'ss-portfolio-bg-accent-1',
    image: '/images/projects/text-to-pdf.png',
    description:
      'A lightning-fast server-side PDF generation utility that converts formatted text input into professionally styled, downloadable PDF documents. Built with an Express backend and PDF-lib / Puppeteer pipeline for high-fidelity output.',
    highlights: [
      'Rich text editor UI with font, size, and style controls',
      'Server-side PDF generation via Puppeteer / PDFKit pipeline',
      'Instant download trigger — no account required',
      'Custom page size, margin, and header/footer options',
      'Supports lists, headings, bold/italic formatting',
      'Preview pane before download for accuracy',
      'Express REST endpoint for programmatic API access',
    ],
    notableFeature: 'Server-rendered PDF with full typography control — useful for invoices, reports, and documents.',
    tech: ['React', 'Express', 'Node.js', 'PDFKit', 'Puppeteer', 'Render'],
  },
  {
    id: 8,
    num: '08',
    title: 'Instant Hooks',
    subtitle: 'Interactive React Hooks Reference Library',
    url: 'https://instant-hooks.netlify.app/',
    type: 'Dev Tool',
    category: 'devtool',
    featured: false,
    icon: Code2,
    iconBg: 'ss-portfolio-bg-accent-2',
    image: '/images/projects/instant-hooks.png',
    description:
      'Instant Hooks is a developer-facing React Hooks playground and reference library. It provides live, interactive demos of common React hooks with annotated source code, parameter explanations, and copy-ready snippets — like an MDN for custom React development.',
    highlights: [
      'Live sandbox for useState, useEffect, useReducer, useRef, useMemo, and more',
      'Custom hook collection — useDebounce, useLocalStorage, useFetch, useToggle',
      'Syntax-highlighted code viewer with one-click copy',
      'Interactive parameter controls to see hook behavior change in real time',
      'Categorised navigation (State, Side Effects, Performance, DOM)',
      'Search by hook name or use-case description',
      'Mobile-responsive two-pane layout (code + preview)',
    ],
    notableFeature: 'Live interactive demos for every hook — see the code AND the result side-by-side instantly.',
    tech: ['React', 'Custom Hooks', 'Prism.js', 'Netlify'],
  },
  {
    id: 9,
    num: '09',
    title: 'Online Banking Clone',
    subtitle: 'Realistic Banking Dashboard UI',
    url: 'https://onlinebankingclone.netlify.app/',
    type: 'UI Clone',
    category: 'dashboard',
    featured: false,
    icon: Building2,
    iconBg: 'ss-portfolio-bg-accent-3',
    image: '/images/projects/online-banking.png',
    description:
      'A pixel-perfect reimagination of a modern online banking dashboard. This project replicates the real-world workflows and UX patterns of leading digital banks — account overview, transactions, fund transfers, and card management — with a fully responsive, professional interface.',
    highlights: [
      'Multi-account dashboard with balance summary cards',
      'Transaction history with category icons and date filtering',
      'Simulated fund-transfer form with validation and confirmation modal',
      'Debit/credit card management UI with freeze and limit controls',
      'Spending breakdown analytics with category pie chart',
      'Notification centre with transaction alerts',
      'Fully responsive — desktop, tablet, and mobile optimised',
      'Accessible form design with ARIA labels',
    ],
    notableFeature: 'Bank-grade UI fidelity — every workflow mirrors the UX of a real fintech product.',
    tech: ['React', 'CSS Grid', 'REST API', 'Netlify'],
  },
  {
    id: 10,
    num: '10',
    title: 'Medi-Sphere',
    subtitle: 'Healthcare & Medical Services Platform',
    url: 'https://medi-sphere.netlify.app/',
    type: 'Healthcare',
    category: 'business',
    featured: false,
    icon: HeartPulse,
    iconBg: 'ss-portfolio-bg-accent-4',
    image: '/images/projects/medi-sphere.png',
    description:
      'Medi-Sphere is a polished, full-featured medical services website for a modern healthcare provider. It covers all the informational, appointment-booking, and trust-building needs of a professional clinic or hospital — designed to convert visitors into patients.',
    highlights: [
      'Service pages for specialties: cardiology, orthopaedics, neurology, paediatrics, etc.',
      'Doctor profiles with photo, credentials, and specialisation',
      'Appointment booking form with date picker and department selector',
      'Emergency contact section with prominent CTAs',
      'Health blog section with categorised articles',
      'Patient testimonials and trust-building social proof',
      'Sticky navigation with responsive hamburger menu',
      'WCAG-accessible colour contrast and structure',
    ],
    notableFeature: 'Full appointment-booking UX with doctor profile cards and specialty-based navigation.',
    tech: ['React', 'Next.js', 'CSS Modules', 'Netlify'],
  },
  {
    id: 11,
    num: '11',
    title: 'Jagdamba Law Firm',
    subtitle: 'Professional Corporate Law Firm Website',
    url: 'https://jagdamba-lawfirm.netlify.app/',
    type: 'Business Site',
    category: 'business',
    featured: false,
    icon: Scale,
    iconBg: 'ss-portfolio-bg-accent-5',
    image: '/images/projects/jagdamba-law.png',
    description:
      'Jagdamba Law Firm is a professional, trust-first business website for a legal practice. Designed to communicate authority and approachability, the site covers practice areas, attorney profiles, client testimonials, and a seamless contact experience for legal enquiries.',
    highlights: [
      'Practice area cards: corporate law, family law, criminal defence, real estate',
      'Attorney bios with photo, bar registration, and areas of expertise',
      'Client testimonials with 5-star review layout',
      'Case consultation contact form with matter-type selector',
      'FAQs section for common legal questions',
      'Firm history and achievement timeline',
      'Mobile-first responsive layout with clean corporate typography',
      'CTA for free initial consultation prominently placed',
    ],
    notableFeature: 'Authority-first design with consultation CTA — built to win client trust from the first scroll.',
    tech: ['React', 'CSS', 'Netlify'],
  },
  {
    id: 12,
    num: '12',
    title: 'E-Commerce Shivam Demo',
    subtitle: 'Modern E-Commerce Store with Cart & Checkout',
    url: 'https://e-commerce-shivam-demo.netlify.app/',
    type: 'E-Commerce',
    category: 'fullstack',
    featured: false,
    icon: ShoppingCart,
    iconBg: 'ss-portfolio-bg-accent-6',
    image: '/images/projects/ecommerce-shivam.png',
    description:
      'A feature-rich e-commerce demo application with a complete shopping workflow — product catalog browsing, cart management, and a multi-step checkout flow. Designed to demonstrate real-world e-commerce patterns with a clean, conversion-optimised UI.',
    highlights: [
      'Product catalog with category filters, search, and sort options',
      'Product detail pages with image gallery, specs, and reviews',
      'Persistent cart with quantity controls and item removal',
      'Coupon/discount code input with validation',
      'Multi-step checkout: cart → shipping → payment → confirmation',
      'Order summary sidebar with price breakdown and tax calculation',
      'Wishlist / save-for-later functionality',
      'Responsive grid layout optimised for mobile shopping',
    ],
    notableFeature: 'Full shopping funnel from browse to checkout — with cart persistence and coupon logic.',
    tech: ['React', 'Context API', 'CSS Grid', 'Netlify'],
  },
  {
    id: 13,
    num: '13',
    title: 'TickleBox',
    subtitle: 'Interactive Games & Quiz Platform',
    url: 'https://ticklebox.netlify.app/games/quiz.html',
    type: 'Games / Fun',
    category: 'fun',
    featured: false,
    icon: Gamepad2,
    iconBg: 'ss-portfolio-bg-accent-1',
    image: '/images/projects/ticklebox.png',
    description:
      'TickleBox is a multi-game interactive platform packed with quizzes, puzzles, and brain-teasers. It features multiple game modes with score tracking, timers, leaderboards, and category-based question banks — a fun, addictive experience for all ages.',
    highlights: [
      'Multiple quiz categories: General Knowledge, Science, Bollywood, Sports, Tech',
      'Timed quiz mode with countdown and progressive scoring',
      'Leaderboard with high-score tracking',
      'Multiple difficulty levels — Easy, Medium, Hard',
      'Interactive puzzle and word-game modules',
      'Confetti animations and fun sound FX for correct answers',
      'Progress tracker per category with completion badges',
      'Mobile-friendly layout for on-the-go gaming',
    ],
    notableFeature: 'Multi-category timed quiz engine with live score tracking and animated reward feedback.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage', 'Netlify'],
  },
  {
    id: 14,
    num: '14',
    title: 'Legitixy',
    subtitle: 'India Legal Information & Rules Reference Portal',
    url: 'https://legitixy.netlify.app/',
    type: 'Legal / Info',
    category: 'business',
    featured: false,
    icon: Scale,
    iconBg: 'ss-portfolio-bg-accent-2',
    image: '/images/projects/legitixy.png',
    description:
      'Legitixy is a comprehensive Indian legal information portal that demystifies laws, rules, and regulations for everyday citizens. It covers acts, rights, legal procedures, and real-world examples across all major legal domains — making law accessible and understandable for everyone.',
    highlights: [
      'Searchable database of Indian laws, acts, and amendments',
      'Category navigation: Labour Law, Consumer Rights, Cyber Law, Property, Family',
      'Plain-English explanations of complex legal statutes',
      'Real-world scenario examples for each legal provision',
      'State-specific legal variations and jurisdiction notes',
      'Legal glossary with term definitions',
      'FAQ sections for the most common legal queries in India',
      'Clean, readable typography designed for long-form legal content',
    ],
    notableFeature: 'Plain-language Indian law database with real-world examples — making legal knowledge accessible to all.',
    tech: ['React', 'Search Index', 'CSS', 'Netlify'],
  },
];

const SERVICES = [
  {
    icon: Monitor,
    bg: 'ss-portfolio-bg-accent-1',
    title: 'Custom Web Applications',
    desc: 'End-to-end MERN stack web applications — from architecture design to deployment. Scalable, secure, and performant.',
    items: ['React SPA / Multi-page apps', 'RESTful API development', 'Database design & optimisation', 'Cloud deployment & CI/CD'],
  },
  {
    icon: ShoppingBag,
    bg: 'ss-portfolio-bg-accent-6',
    title: 'E-Commerce Solutions',
    desc: 'Full-featured online stores with product management, cart, checkout, payment integration, and order management.',
    items: ['Product catalog & cart logic', 'Payment gateway integration', 'Admin dashboard', 'Inventory management'],
  },
  {
    icon: LayoutDashboard,
    bg: 'ss-portfolio-bg-accent-3',
    title: 'Dashboard & Analytics',
    desc: 'Data-rich admin panels and analytics dashboards with real-time charts, KPI cards, and drill-down reports.',
    items: ['Interactive data charts', 'Real-time data feeds', 'KPI & metrics UI', 'Export to PDF / CSV'],
  },
  {
    icon: Lock,
    bg: 'ss-portfolio-bg-accent-5',
    title: 'Auth & Security Systems',
    desc: 'Robust authentication infrastructure with JWT, OAuth2, MFA, RBAC, and secure session management.',
    items: ['JWT / OAuth2 / MFA', 'Role-based access control', 'Secure API design', 'OWASP best practices'],
  },
  {
    icon: Brain,
    bg: 'ss-portfolio-bg-accent-2',
    title: 'AI-Integrated Applications',
    desc: 'Web applications powered by AI APIs — chatbots, recommendation engines, content generators, and insight tools.',
    items: ['OpenAI / Gemini API', 'Chatbot interfaces', 'AI-powered search', 'Smart recommendations'],
  },
  {
    icon: Palette,
    bg: 'ss-portfolio-bg-accent-4',
    title: 'UI/UX Design & Frontend',
    desc: 'Pixel-perfect, animated, and fully responsive interfaces. From landing pages to complex multi-step forms.',
    items: ['Figma-to-code', 'Animations & micro-interactions', 'Dark/light mode', 'Mobile-first responsive'],
  },
  {
    icon: Server,
    bg: 'ss-portfolio-bg-accent-1',
    title: 'Backend API Development',
    desc: 'Scalable, documented REST APIs with Node.js/Express, MongoDB, authentication, and third-party integrations.',
    items: ['REST API architecture', 'MongoDB / Mongoose', 'Middleware & error handling', 'API documentation'],
  },
  {
    icon: Globe,
    bg: 'ss-portfolio-bg-accent-3',
    title: 'Business & Corporate Sites',
    desc: 'Professional websites for law firms, clinics, agencies, and startups — built for trust, conversion, and SEO.',
    items: ['Lead generation CTAs', 'SEO-friendly markup', 'Contact & booking forms', 'Fast load performance'],
  },
];

const SKILLS = [
  { name: 'React.js', level: 96, cat: 'Frontend', emoji: '⚛️', bg: '#61dafb22' },
  { name: 'Node.js', level: 92, cat: 'Backend', emoji: '🟩', bg: '#68a06322' },
  { name: 'Express.js', level: 90, cat: 'Backend', emoji: '⚡', bg: '#ffffff15' },
  { name: 'MongoDB', level: 88, cat: 'Database', emoji: '🍃', bg: '#4db33d22' },
  { name: 'JavaScript', level: 95, cat: 'Language', emoji: '🟨', bg: '#f7df1e22' },
  { name: 'TypeScript', level: 78, cat: 'Language', emoji: '🔷', bg: '#3178c622' },
  { name: 'CSS / Tailwind', level: 94, cat: 'Styling', emoji: '🎨', bg: '#38bdf822' },
  { name: 'REST APIs', level: 93, cat: 'Backend', emoji: '🔗', bg: '#6d63ff22' },
  { name: 'JWT / Auth', level: 89, cat: 'Security', emoji: '🔐', bg: '#ff6b9d22' },
  { name: 'Git / GitHub', level: 91, cat: 'DevOps', emoji: '🐙', bg: '#ffffff15' },
  { name: 'Netlify / Render', level: 87, cat: 'Deploy', emoji: '☁️', bg: '#00d4aa22' },
  { name: 'Next.js', level: 75, cat: 'Frontend', emoji: '▲', bg: '#ffffff15' },

  // ✅ Newly Added Skills

  { name: 'Docker', level: 72, cat: 'DevOps', emoji: '🐳', bg: '#0db7ed22' },
  { name: 'AWS', level: 70, cat: 'Cloud', emoji: '☁️', bg: '#ff990022' },
  { name: 'Redis', level: 76, cat: 'Database', emoji: '🔥', bg: '#dc382d22' },
  { name: 'Vite', level: 85, cat: 'Build Tool', emoji: '⚡', bg: '#646cff22' },

  // Frontend Ecosystem
  { name: 'Redux Toolkit', level: 88, cat: 'Frontend', emoji: '🌀', bg: '#764abc22' },
  { name: 'React Query', level: 84, cat: 'Frontend', emoji: '🔄', bg: '#ff415422' },
  { name: 'React Hook Form', level: 86, cat: 'Frontend', emoji: '📋', bg: '#ec599022' },
  { name: 'Material UI', level: 83, cat: 'Styling', emoji: '🟦', bg: '#007fff22' },
  { name: 'Styled Components', level: 80, cat: 'Styling', emoji: '💖', bg: '#db709322' },
  { name: 'Bootstrap', level: 85, cat: 'Styling', emoji: '🅱️', bg: '#7952b322' },
  { name: 'Sass', level: 82, cat: 'Styling', emoji: '💅', bg: '#cc669922' },

  // Backend Advanced
  { name: 'Bcrypt', level: 87, cat: 'Security', emoji: '🧂', bg: '#aaaaaa22' },
  { name: 'Socket.io', level: 83, cat: 'Backend', emoji: '🔌', bg: '#01010122' },
  { name: 'Passport.js', level: 78, cat: 'Security', emoji: '🛂', bg: '#34e27a22' },
  { name: 'Zod', level: 80, cat: 'Backend', emoji: '✔️', bg: '#3e67b122' },
  { name: 'Joi', level: 79, cat: 'Backend', emoji: '📐', bg: '#00aaff22' },
  { name: 'Nodemailer', level: 85, cat: 'Backend', emoji: '✉️', bg: '#0099ff22' },

  // ORM / DB Tools
  { name: 'Mongoose', level: 90, cat: 'Database', emoji: '📀', bg: '#88000022' },

  // API / Tools
  { name: 'Apollo Server', level: 80, cat: 'Backend', emoji: '🚀', bg: '#311c8722' },
  { name: 'Axios', level: 92, cat: 'Frontend', emoji: '📡', bg: '#5a29e422' },
  { name: 'Postman', level: 90, cat: 'Tooling', emoji: '📮', bg: '#ff6c3722' },

  // DevOps Advanced
  { name: 'GitHub Actions', level: 75, cat: 'DevOps', emoji: '⚙️', bg: '#2088ff22' },
  { name: 'Nginx', level: 73, cat: 'DevOps', emoji: '🟢', bg: '#00963922' },
  { name: 'PM2', level: 81, cat: 'DevOps', emoji: '♻️', bg: '#2b037a22' },
  { name: 'Linux', level: 84, cat: 'DevOps', emoji: '🐧', bg: '#fcc62422' },

  // Cloud Platforms
  { name: 'Firebase', level: 85, cat: 'Cloud', emoji: '🔥', bg: '#ffca2822' },
  { name: 'DigitalOcean', level: 72, cat: 'Cloud', emoji: '🌊', bg: '#0080ff22' },
  { name: 'Railway', level: 74, cat: 'Cloud', emoji: '🚂', bg: '#00000022' },

  // Payments
  { name: 'Stripe', level: 88, cat: 'Payments', emoji: '💳', bg: '#635bff22' },
  { name: 'Razorpay', level: 85, cat: 'Payments', emoji: '💠', bg: '#0c245122' },


];

const PROCESS = [
  { icon: MessageSquare, num: '01', title: 'Discovery Call', desc: 'We discuss your project goals, requirements, timeline, and budget in a free 30-minute consultation.' },
  { icon: PenTool, num: '02', title: 'Planning & Design', desc: 'I create a detailed project plan, wireframes, and UI mockups for your approval before a single line of code is written.' },
  { icon: Code2, num: '03', title: 'Development', desc: 'Agile sprints with regular demo updates. You see progress weekly and can provide feedback throughout.' },
  { icon: CheckCircle2, num: '04', title: 'Testing & QA', desc: 'Thorough cross-browser, cross-device testing. Performance audits, security checks, and bug-free delivery.' },
  { icon: Rocket, num: '05', title: 'Launch & Deploy', desc: 'Production deployment with CI/CD pipeline, domain setup, SSL, and monitoring configuration.' },
  { icon: Wrench, num: '06', title: 'Support & Growth', desc: 'Post-launch support, feature additions, and performance optimisations — I stay your tech partner long-term.' },
];

const TESTIMONIALS = [
  { name: 'Ananya Sharma', role: 'Startup Founder', stars: 5, text: 'Shivam delivered our entire MERN stack platform in 3 weeks, including a custom auth system and admin dashboard. The code quality was exceptional — clean, documented, and scalable. Highly recommend!' },
  { name: 'Rahul Verma', role: 'Product Manager, FinTech', stars: 5, text: 'The Finance Folio dashboard Shivam built for us exceeded expectations. The chart visualisations are beautiful and the real-time data pipeline works flawlessly. A true full-stack expert.' },
  { name: 'Priya Patel', role: 'Healthcare Administrator', stars: 5, text: 'Our Medi-Sphere website has dramatically improved patient inquiries. The booking form is intuitive and the professional design instills trust. Shivam understood our requirements perfectly.' },
  { name: 'Vikram Singh', role: 'Legal Partner', stars: 5, text: 'The Jagdamba Law Firm site is exactly what we needed — authoritative, professional, and easy to navigate. We\'ve received multiple client inquiries through the contact form since launch.' },
  { name: 'Sneha Gupta', role: 'E-Commerce Entrepreneur', stars: 5, text: 'Shivam built our complete online store with cart, checkout, and admin panel in record time. The mobile experience is seamless and we saw conversions from day one.' },
  { name: 'Arjun Nair', role: 'Tech Blogger', stars: 5, text: 'Instant Hooks is one of the most useful React learning resources I\'ve found. Every hook is explained with a live, interactive demo. This is developer tooling done right.' },
];

const FAQS = [
  { q: 'What is your typical project timeline?', a: 'Timeline depends on project scope. A landing page or simple SPA typically takes 5–10 days. A full-stack application with auth, dashboard, and API usually takes 3–6 weeks. I always provide a detailed timeline estimate after the discovery call.' },
  { q: 'Do you work with international clients?', a: 'Absolutely! I work with clients globally. Communication is primarily via Zoom/Google Meet and email. I\'m comfortable adapting to different time zones for regular check-ins.' },
  { q: 'What technologies do you specialise in?', a: 'My core stack is MERN (MongoDB, Express.js, React, Node.js). I also work with Next.js, TypeScript, Tailwind CSS, REST APIs, JWT authentication, and various AI APIs including OpenAI and Gemini.' },
  { q: 'Do you provide post-launch support?', a: 'Yes! All projects include 30 days of free post-launch bug support. Extended maintenance plans are available for ongoing support, feature additions, and performance monitoring.' },
  { q: 'Can I see more of your work or request a portfolio review?', a: 'Of course! Book a free call and I\'ll walk you through all projects in detail, share code samples, and discuss how I can apply similar solutions to your requirements.' },
  { q: 'Do you handle deployment and hosting setup?', a: 'Yes — full deployment is included in every project. This covers Netlify/Vercel for frontend, Render/Railway for backend, MongoDB Atlas for database, domain configuration, and SSL setup.' },
  { q: 'What is your payment structure?', a: '50% upfront and 50% on delivery for most projects. Milestone-based payments for larger engagements. I accept bank transfer, UPI, and international payment methods.' },
  { q: 'Can you work on my existing codebase?', a: 'Definitely! I regularly take on legacy codebases for refactoring, feature additions, bug fixes, and performance improvements. A code review session is the first step.' },
];

const METRICS = [
  { icon: Package, num: '14+', label: 'Live Projects' },
  { icon: Users, num: '30+', label: 'Happy Clients' },
  { icon: Code2, num: '50K+', label: 'Lines of Code' },
  { icon: Award, num: '2+', label: 'Years Experience' },
  { icon: Clock, num: '100%', label: 'On-Time Delivery' },
  { icon: Star, num: '5.0', label: 'Average Rating' },
];

const MARQUEE_ITEMS = [
  { icon: '⚛️', label: 'React.js' }, { icon: '🟩', label: 'Node.js' },
  { icon: '⚡', label: 'Express' }, { icon: '🍃', label: 'MongoDB' },
  { icon: '🔷', label: 'TypeScript' }, { icon: '▲', label: 'Next.js' },
  { icon: '🎨', label: 'Tailwind' }, { icon: '🔐', label: 'JWT Auth' },
  { icon: '🐙', label: 'GitHub' }, { icon: '☁️', label: 'Netlify' },
  { icon: '🤖', label: 'OpenAI API' }, { icon: '📦', label: 'REST APIs' },
  { icon: '🗄️', label: 'PostgreSQL' }, { icon: '🚀', label: 'Render' },
  { icon: '🔗', label: 'GraphQL' }, { icon: '🧪', label: 'Jest' },
];

const CATEGORIES = [
  { key: 'all', label: 'All Projects', count: PROJECTS.length },
  { key: 'fullstack', label: 'Full Stack', count: PROJECTS.filter(p => p.category === 'fullstack').length },
  { key: 'dashboard', label: 'Dashboard', count: PROJECTS.filter(p => p.category === 'dashboard').length },
  { key: 'ai', label: 'AI / ML', count: PROJECTS.filter(p => p.category === 'ai').length },
  { key: 'business', label: 'Business', count: PROJECTS.filter(p => p.category === 'business').length },
  { key: 'fun', label: 'Fun / Interactive', count: PROJECTS.filter(p => p.category === 'fun').length },
  { key: 'design', label: 'UI / Design', count: PROJECTS.filter(p => p.category === 'design').length },
  { key: 'auth', label: 'Auth / SaaS', count: PROJECTS.filter(p => p.category === 'auth').length },
  { key: 'utility', label: 'Utility', count: PROJECTS.filter(p => p.category === 'utility').length },
  { key: 'devtool', label: 'Dev Tool', count: PROJECTS.filter(p => p.category === 'devtool').length },
];

/* ─────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const Icon = project.icon;
  return (
    <div className={`ss-portfolio-card ss-portfolio-fade-in ${project.featured ? 'ss-portfolio-card-featured' : ''}`}
      style={{ transitionDelay: `${(index % 6) * 0.08}s` }}>
      {/* Image */}
      <div className="ss-portfolio-card-img-wrap">
        <img
          src={project.image}
          alt={project.title}
          className="ss-portfolio-card-img"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <div className="ss-portfolio-card-img-placeholder" style={{ display: 'none' }}>
          <Icon size={56} strokeWidth={1.2} />
        </div>
        <div className="ss-portfolio-card-img-overlay" />
        <div className="ss-portfolio-card-img-tags">
          {project.featured && <span className="ss-portfolio-card-badge ss-portfolio-card-badge-featured">⭐ Featured</span>}
          <span className="ss-portfolio-card-badge ss-portfolio-card-badge-type">{project.type}</span>
        </div>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="ss-portfolio-card-live-btn">
          <span className="ss-portfolio-card-live-dot" />
          View Live <ExternalLink size={12} />
        </a>
      </div>
      {/* Body */}
      <div className="ss-portfolio-card-body">
        <div className="ss-portfolio-card-num">{project.num}</div>
        <h3 className="ss-portfolio-card-title">{project.title}</h3>
        <p className="ss-portfolio-card-desc">{project.description}</p>

        {/* Notable Feature */}
        <div className="ss-portfolio-card-feature-box">
          <Sparkles size={15} className="ss-portfolio-card-feature-icon" />
          <p className="ss-portfolio-card-feature-text">
            <strong>Notable: </strong>{project.notableFeature}
          </p>
        </div>

        {/* Highlights */}
        <ul className="ss-portfolio-card-highlights">
          {project.highlights.slice(0, 5).map((h, i) => (
            <li key={i} className="ss-portfolio-card-highlight-item">
              <span className="ss-portfolio-card-highlight-dot" />
              {h}
            </li>
          ))}
        </ul>

        {/* Tech Stack */}
        <div className="ss-portfolio-card-tech-stack">
          {project.tech.map(t => (
            <span key={t} className="ss-portfolio-card-tech-pill">{t}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="ss-portfolio-card-footer">
          <span className="ss-portfolio-card-footer-label">#{project.category}</span>
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="ss-portfolio-btn-accent">
            Live Demo <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ss-portfolio-faq-item ${open ? 'ss-portfolio-faq-open' : ''}`}>
      <button className="ss-portfolio-faq-question" onClick={() => setOpen(o => !o)}>
        {q}
        <ChevronDown size={18} className="ss-portfolio-faq-chevron" />
      </button>
      <div className="ss-portfolio-faq-answer">{a}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const Portfolio = () => {

    const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({ name: '', email: '', service: '', budget: '', message: '' });
  const sectionRefs = useRef([]);

  const filtered = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  // Intersection observer for fade-in
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('ss-portfolio-visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.ss-portfolio-fade-in').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filtered]);

  const handleFormChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFormSubmit = async () => {
    const { default: Swal } = await import('sweetalert2');
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({ icon: 'warning', title: 'Oops!', text: 'Please fill in your name, email, and message.', background: isDarkMode ? '#131127' : '#fff', color: isDarkMode ? '#f0eeff' : '#0d0b1f', confirmButtonColor: '#6d63ff' });
      return;
    }
    Swal.fire({ icon: 'success', title: '🚀 Message Sent!', text: 'Thanks for reaching out! I\'ll get back to you within 24 hours.', background: isDarkMode ? '#131127' : '#fff', color: isDarkMode ? '#f0eeff' : '#0d0b1f', confirmButtonColor: '#6d63ff' });
    setFormData({ name: '', email: '', service: '', budget: '', message: '' });
  };

const handleBookCall = async () => {
        navigate("/book-free-call");

};

  const marqueeDuplicated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className={`ss-portfolio-root ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="ss-portfolio-hero">
        <div className="ss-portfolio-hero-mesh" />
        <div className="ss-portfolio-hero-grid" />
        <div className="ss-portfolio-orb ss-portfolio-orb-1" />
        <div className="ss-portfolio-orb ss-portfolio-orb-2" />
        <div className="ss-portfolio-orb ss-portfolio-orb-3" />

        <div className="ss-portfolio-hero-inner">
          <div className="ss-portfolio-hero-badge">
            <span className="ss-portfolio-hero-badge-dot" />
            Available for new projects
          </div>

          <h1 className="ss-portfolio-hero-title">
            My <span className="ss-portfolio-hero-title-grad">Portfolio</span>
          </h1>
          <p className="ss-portfolio-hero-sub">14+ Live Projects. Real Code. Real Impact.</p>
          <p className="ss-portfolio-hero-desc">
            A showcase of full-stack MERN applications, AI-powered tools, e-commerce platforms, dashboards, and more — each built from scratch with clean architecture and modern UI.
          </p>

          <div className="ss-portfolio-hero-cta-row">
            <button className="ss-portfolio-btn-primary" onClick={handleBookCall}>
              <Calendar size={16} /> Book Free Call
            </button>
            <a href="#ss-portfolio-projects" className="ss-portfolio-btn-outline">
              <Layers size={16} /> View Projects
            </a>
          </div>

          <div className="ss-portfolio-hero-stats">
            {METRICS.slice(0, 4).map(m => (
              <div key={m.label} className="ss-portfolio-hero-stat">
                <span className="ss-portfolio-hero-stat-num">{m.num}</span>
                <span className="ss-portfolio-hero-stat-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ss-portfolio-hero-scroll">
          <div className="ss-portfolio-hero-scroll-line" />
          scroll
        </div>
      </section>

      {/* ══════════════════════════════════
          TECH MARQUEE
      ══════════════════════════════════ */}
      <div style={{ background: 'var(--ss-bg-secondary)', padding: '28px 0', borderTop: '1px solid var(--ss-border)', borderBottom: '1px solid var(--ss-border)' }}>
        <div className="ss-portfolio-marquee-wrap">
          <div className="ss-portfolio-marquee-track">
            {marqueeDuplicated.map((item, i) => (
              <div key={i} className="ss-portfolio-marquee-item">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          METRICS
      ══════════════════════════════════ */}
      <section className="ss-portfolio-section ss-portfolio-section-alt">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header">
            <div className="ss-portfolio-section-label">
              <div className="ss-portfolio-section-label-line" />
              By the Numbers
            </div>
            <h2 className="ss-portfolio-section-heading">
              Work That <span className="ss-portfolio-section-heading-grad">Speaks</span>
            </h2>
            <p className="ss-portfolio-section-sub">
              Every number here represents real delivered projects, real clients, and real results — not estimates.
            </p>
          </div>
          <div className="ss-portfolio-metrics-row ss-portfolio-fade-in">
            {METRICS.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="ss-portfolio-metric-card">
                  <div className="ss-portfolio-metric-icon"><Icon size={20} /></div>
                  <div className="ss-portfolio-metric-num">{m.num}</div>
                  <div className="ss-portfolio-metric-label">{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PROJECTS
      ══════════════════════════════════ */}
      <section id="ss-portfolio-projects" className="ss-portfolio-section">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header">
            <div className="ss-portfolio-section-label">
              <div className="ss-portfolio-section-label-line" />
              Live Projects
            </div>
            <h2 className="ss-portfolio-section-heading">
              Things I've <span className="ss-portfolio-section-heading-grad">Built</span>
            </h2>
            <p className="ss-portfolio-section-sub">
              14 live, deployed applications spanning SaaS platforms, e-commerce, AI tools, dashboards, and more. Every project is production-ready and publicly accessible.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="ss-portfolio-filter-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`ss-portfolio-filter-btn ${activeFilter === cat.key ? 'ss-portfolio-filter-active' : ''}`}
                onClick={() => setActiveFilter(cat.key)}
              >
                {cat.label}
                <span className="ss-portfolio-filter-count">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="ss-portfolio-projects-grid">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ss-text-muted)' }}>
              <Globe size={48} strokeWidth={1} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }} />
              <p>No projects in this category yet — check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════
          SKILLS
      ══════════════════════════════════ */}
      <section className="ss-portfolio-section ss-portfolio-section-alt">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header">
            <div className="ss-portfolio-section-label">
              <div className="ss-portfolio-section-label-line" />
              Technical Skills
            </div>
            <h2 className="ss-portfolio-section-heading">
              My <span className="ss-portfolio-section-heading-grad">Tech Stack</span>
            </h2>
            <p className="ss-portfolio-section-sub">
              The tools and technologies I use to build fast, scalable, and beautiful web applications from frontend to backend.
            </p>
          </div>
          <div className="ss-portfolio-skills-grid ss-portfolio-fade-in">
            {SKILLS.map(skill => (
              <div key={skill.name} className="ss-portfolio-skill-card">
                <div className="ss-portfolio-skill-icon-wrap" style={{ background: skill.bg }}>
                  <span style={{ fontSize: '22px' }}>{skill.emoji}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ss-portfolio-skill-name">{skill.name}</div>
                  <div className="ss-portfolio-skill-level">{skill.cat} · {skill.level}%</div>
                  <div className="ss-portfolio-skill-bar-wrap">
                    <div className="ss-portfolio-skill-bar-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SERVICES
      ══════════════════════════════════ */}
      <section className="ss-portfolio-section">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header">
            <div className="ss-portfolio-section-label">
              <div className="ss-portfolio-section-label-line" />
              What I Offer
            </div>
            <h2 className="ss-portfolio-section-heading">
              Services I <span className="ss-portfolio-section-heading-grad">Provide</span>
            </h2>
            <p className="ss-portfolio-section-sub">
              From idea to deployment — I handle the full spectrum of MERN stack development, UI/UX design, and AI-powered web solutions.
            </p>
          </div>
          <div className="ss-portfolio-services-row ss-portfolio-fade-in">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i} className="ss-portfolio-service-card">
                  <div className={`ss-portfolio-service-icon ${svc.bg}`}><Icon size={24} /></div>
                  <h3 className="ss-portfolio-service-title">{svc.title}</h3>
                  <p className="ss-portfolio-service-desc">{svc.desc}</p>
                  <ul className="ss-portfolio-service-list">
                    {svc.items.map(item => (
                      <li key={item} className="ss-portfolio-service-list-item">
                        <Check size={13} className="ss-portfolio-service-list-check" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PROCESS
      ══════════════════════════════════ */}
      <section className="ss-portfolio-section ss-portfolio-section-alt">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header">
            <div className="ss-portfolio-section-label">
              <div className="ss-portfolio-section-label-line" />
              How I Work
            </div>
            <h2 className="ss-portfolio-section-heading">
              My <span className="ss-portfolio-section-heading-grad">Process</span>
            </h2>
            <p className="ss-portfolio-section-sub">
              A structured, transparent 6-step process that ensures every project is delivered on time, on budget, and beyond expectations.
            </p>
          </div>
          <div className="ss-portfolio-process-steps ss-portfolio-fade-in">
            {PROCESS.map(step => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="ss-portfolio-process-step">
                  <div className="ss-portfolio-process-num">{step.num}</div>
                  <div className="ss-portfolio-process-icon"><Icon size={24} /></div>
                  <h3 className="ss-portfolio-process-title">{step.title}</h3>
                  <p className="ss-portfolio-process-desc">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section className="ss-portfolio-section">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header">
            <div className="ss-portfolio-section-label">
              <div className="ss-portfolio-section-label-line" />
              Client Reviews
            </div>
            <h2 className="ss-portfolio-section-heading">
              What Clients <span className="ss-portfolio-section-heading-grad">Say</span>
            </h2>
            <p className="ss-portfolio-section-sub">
              Real feedback from real clients. Building trust through quality work is my highest priority.
            </p>
          </div>
          <div className="ss-portfolio-testimonials-grid ss-portfolio-fade-in">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="ss-portfolio-testimonial-card">
                <div className="ss-portfolio-testimonial-stars">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="ss-portfolio-star-filled" fill="currentColor" />
                  ))}
                </div>
                <div className="ss-portfolio-testimonial-quote">"</div>
                <p className="ss-portfolio-testimonial-text">{t.text}</p>
                <div className="ss-portfolio-testimonial-author">
                  <div className="ss-portfolio-testimonial-avatar-placeholder">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="ss-portfolio-testimonial-name">{t.name}</div>
                    <div className="ss-portfolio-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <section className="ss-portfolio-section ss-portfolio-section-alt">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header" style={{ textAlign: 'center' }}>
            <div className="ss-portfolio-section-label" style={{ justifyContent: 'center' }}>
              <div className="ss-portfolio-section-label-line" />
              FAQs
              <div className="ss-portfolio-section-label-line" />
            </div>
            <h2 className="ss-portfolio-section-heading">
              Frequently Asked <span className="ss-portfolio-section-heading-grad">Questions</span>
            </h2>
            <p className="ss-portfolio-section-sub" style={{ margin: '0 auto' }}>
              Everything you need to know before working together. Don't see your question? Just ask.
            </p>
          </div>
          <div className="ss-portfolio-faq-list ss-portfolio-fade-in">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
      ══════════════════════════════════ */}
      <section className="ss-portfolio-section">
        <div className="ss-portfolio-cta-banner">
          <div className="ss-portfolio-cta-banner-mesh" />
          <div className="ss-portfolio-cta-banner-grid" />
          <div className="ss-portfolio-cta-banner-inner">
            <div className="ss-portfolio-availability" style={{ margin: '0 auto 24px' }}>
              <span className="ss-portfolio-availability-dot" />
              Open to new projects — March 2026
            </div>
            <h2 className="ss-portfolio-cta-title">
              Ready to Build<br />Something Amazing?
            </h2>
            <p className="ss-portfolio-cta-sub">
              Let's turn your idea into a production-ready web application. Book a free 30-minute discovery call today — no commitment required.
            </p>
            <div className="ss-portfolio-cta-row">
              <button className="ss-portfolio-btn-primary" onClick={handleBookCall}>
                <Phone size={16} /> Book Free Call
              </button>
              <a href="mailto:shivam@shivamstack.dev" className="ss-portfolio-btn-outline">
                <Mail size={16} /> Send Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CONTACT FORM
      ══════════════════════════════════ */}
      <section id="ss-portfolio-contact" className="ss-portfolio-section ss-portfolio-section-alt">
        <div className="ss-portfolio-container">
          <div className="ss-portfolio-section-header">
            <div className="ss-portfolio-section-label">
              <div className="ss-portfolio-section-label-line" />
              Get In Touch
            </div>
            <h2 className="ss-portfolio-section-heading">
              Let's <span className="ss-portfolio-section-heading-grad">Connect</span>
            </h2>
            <p className="ss-portfolio-section-sub">
              Have a project in mind? Fill out the form and I'll respond within 24 hours with a detailed plan and estimate.
            </p>
          </div>

          <div className="ss-portfolio-contact-row ss-portfolio-fade-in">
            {/* Info */}
            <div className="ss-portfolio-contact-info-card">
              <div className="ss-portfolio-availability">
                <span className="ss-portfolio-availability-dot" />
                Currently available for projects
              </div>
              <h3 className="ss-portfolio-contact-info-title">Let's Work Together</h3>
              <p className="ss-portfolio-contact-info-desc">
                Whether you have a detailed brief or just a rough idea, I'm happy to chat. I offer a free 30-minute discovery call to understand your project before any commitment. Based in India — available globally.
              </p>
              <div className="ss-portfolio-contact-links">
                <a href="mailto:shivam@shivamstack.dev" className="ss-portfolio-contact-link">
                  <div className="ss-portfolio-contact-link-icon ss-portfolio-bg-accent-1">
                    <Mail size={18} color="#fff" />
                  </div>
                  <div>
                    <div className="ss-portfolio-contact-link-label">Email</div>
                    <div className="ss-portfolio-contact-link-value">shivam@shivamstack.dev</div>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--ss-accent)' }} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="ss-portfolio-contact-link">
                  <div className="ss-portfolio-contact-link-icon ss-portfolio-bg-accent-5">
                    <Linkedin size={18} color="#fff" />
                  </div>
                  <div>
                    <div className="ss-portfolio-contact-link-label">LinkedIn</div>
                    <div className="ss-portfolio-contact-link-value">linkedin.com/in/shivamstack</div>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--ss-accent)' }} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ss-portfolio-contact-link">
                  <div className="ss-portfolio-contact-link-icon" style={{ background: '#ffffff15', border: '1px solid var(--ss-border)' }}>
                    <Github size={18} color="var(--ss-text-primary)" />
                  </div>
                  <div>
                    <div className="ss-portfolio-contact-link-label">GitHub</div>
                    <div className="ss-portfolio-contact-link-value">github.com/shivamstack</div>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--ss-accent)' }} />
                </a>
                <div className="ss-portfolio-contact-link" style={{ cursor: 'default' }}>
                  <div className="ss-portfolio-contact-link-icon ss-portfolio-bg-accent-3">
                    <MapPin size={18} color="#fff" />
                  </div>
                  <div>
                    <div className="ss-portfolio-contact-link-label">Location</div>
                    <div className="ss-portfolio-contact-link-value">India · Available Worldwide</div>
                  </div>
                </div>
                <div className="ss-portfolio-contact-link" style={{ cursor: 'default' }}>
                  <div className="ss-portfolio-contact-link-icon ss-portfolio-bg-accent-4">
                    <Clock size={18} color="#fff" />
                  </div>
                  <div>
                    <div className="ss-portfolio-contact-link-label">Response Time</div>
                    <div className="ss-portfolio-contact-link-value">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="ss-portfolio-contact-form-card">
              <h3 className="ss-portfolio-form-title">📬 Send a Message</h3>
              <div className="ss-portfolio-form-row">
                <div className="ss-portfolio-form-group">
                  <label className="ss-portfolio-form-label">Your Name *</label>
                  <input name="name" value={formData.name} onChange={handleFormChange} className="ss-portfolio-form-input" placeholder="Rahul Sharma" />
                </div>
                <div className="ss-portfolio-form-group">
                  <label className="ss-portfolio-form-label">Email Address *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleFormChange} className="ss-portfolio-form-input" placeholder="rahul@email.com" />
                </div>
              </div>
              <div className="ss-portfolio-form-row">
                <div className="ss-portfolio-form-group">
                  <label className="ss-portfolio-form-label">Service Needed</label>
                  <select name="service" value={formData.service} onChange={handleFormChange} className="ss-portfolio-form-select">
                    <option value="">Select a service...</option>
                    <option>Full Stack Web App</option>
                    <option>E-Commerce Store</option>
                    <option>Dashboard / Analytics</option>
                    <option>Auth System</option>
                    <option>AI Integration</option>
                    <option>Business Website</option>
                    <option>API Development</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="ss-portfolio-form-group">
                  <label className="ss-portfolio-form-label">Budget Range</label>
                  <select name="budget" value={formData.budget} onChange={handleFormChange} className="ss-portfolio-form-select">
                    <option value="">Select budget...</option>
                    <option>Under ₹15,000</option>
                    <option>₹15,000 – ₹40,000</option>
                    <option>₹40,000 – ₹1,00,000</option>
                    <option>₹1,00,000+</option>
                    <option>Let's discuss</option>
                  </select>
                </div>
              </div>
              <div className="ss-portfolio-form-group">
                <label className="ss-portfolio-form-label">Your Message *</label>
                <textarea name="message" value={formData.message} onChange={handleFormChange} className="ss-portfolio-form-textarea" placeholder="Tell me about your project — what you need, your timeline, and any specific requirements..." />
              </div>
              <button className="ss-portfolio-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleFormSubmit}>
                <Send size={16} /> Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Portfolio;