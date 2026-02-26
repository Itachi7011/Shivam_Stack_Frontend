import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

import {
  ArrowRight, ArrowUpRight, Code2, Database, Server, Globe, Zap, Star,
  Users, Briefcase, Award, TrendingUp, CheckCircle, ChevronDown, ChevronRight,
  ChevronLeft, Github, Twitter, Linkedin, Mail, Phone, MapPin, Clock,
  Package, BookOpen, Play, Download, ExternalLink, Shield, Cpu, Layers,
  Monitor, Smartphone, Cloud, GitBranch, Terminal, Box, Palette,
  BarChart2, Lock, RefreshCw, MessageSquare, Heart, Coffee, Send,
  FileCode, Lightbulb, Target, Rocket, Eye, X, Plus, Minus
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────────────

const TECH_STACK = [

  // ================= FRONTEND =================
  { name: 'React', icon: '⚛️', color: '#61DAFB', category: 'Frontend' },
  { name: 'Next.js', icon: '▲', color: '#FFFFFF', category: 'Frontend' },
  { name: 'Redux Toolkit', icon: '🌀', color: '#764ABC', category: 'Frontend' },
  { name: 'React Query', icon: '🔄', color: '#FF4154', category: 'Frontend' },
  { name: 'React Hook Form', icon: '📋', color: '#EC5990', category: 'Frontend' },
  { name: 'Material UI', icon: '🟦', color: '#007FFF', category: 'Frontend' },

  // ================= BACKEND =================
  { name: 'Node.js', icon: '🟢', color: '#68A063', category: 'Backend' },
  { name: 'Express.js', icon: '🚂', color: '#FFFFFF', category: 'Backend' },
  { name: 'JWT', icon: '🔐', color: '#000000', category: 'Backend' },
  { name: 'Bcrypt', icon: '🧂', color: '#333333', category: 'Backend' },
  { name: 'Socket.io', icon: '🔌', color: '#010101', category: 'Backend' },
  { name: 'Passport.js', icon: '🛂', color: '#34E27A', category: 'Backend' },
  { name: 'Zod', icon: '✔️', color: '#3E67B1', category: 'Backend' },
  { name: 'Joi', icon: '📐', color: '#F9DC3E', category: 'Backend' },
  { name: 'Nodemailer', icon: '✉️', color: '#0A66C2', category: 'Backend' },

  // ================= DATABASE =================
  { name: 'MongoDB', icon: '🍃', color: '#47A248', category: 'Database' },
  { name: 'Mongoose', icon: '📀', color: '#880000', category: 'Database' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791', category: 'Database' },
  { name: 'Prisma', icon: '🔷', color: '#2D3748', category: 'Database' },
  { name: 'Supabase', icon: '🟢', color: '#3ECF8E', category: 'Database' },

  // ================= LANGUAGE =================
  { name: 'JavaScript', icon: '🟨', color: '#F7DF1E', category: 'Language' },
  { name: 'TypeScript', icon: '🔷', color: '#3178C6', category: 'Language' },
  { name: 'SQL', icon: '🗄️', color: '#336791', category: 'Language' },
  { name: 'Bash', icon: '💻', color: '#4EAA25', category: 'Language' },

  // ================= CSS =================
  { name: 'CSS3', icon: '🎨', color: '#1572B6', category: 'CSS' },
  { name: 'Sass', icon: '💅', color: '#CC6699', category: 'CSS' },
  { name: 'Tailwind CSS', icon: '💨', color: '#06B6D4', category: 'CSS' },
  { name: 'Styled Components', icon: '💖', color: '#DB7093', category: 'CSS' },
  { name: 'Bootstrap', icon: '🅱️', color: '#7952B3', category: 'CSS' },

  // ================= API =================
  { name: 'REST API', icon: '🌐', color: '#009688', category: 'API' },
  { name: 'GraphQL', icon: '◈', color: '#E535AB', category: 'API' },
  { name: 'Apollo Server', icon: '🚀', color: '#311C87', category: 'API' },
  { name: 'Axios', icon: '📡', color: '#5A29E4', category: 'API' },
  { name: 'Postman', icon: '📮', color: '#FF6C37', category: 'API' },

  // ================= CACHE =================
  { name: 'Redis', icon: '🔴', color: '#DC382D', category: 'Cache' },
  { name: 'Node Cache', icon: '⚡', color: '#444444', category: 'Cache' },
  { name: 'Cloudflare CDN', icon: '☁️', color: '#F38020', category: 'Cache' },

  // ================= DEVOPS =================
  { name: 'Docker', icon: '🐳', color: '#2496ED', category: 'DevOps' },
  { name: 'Git', icon: '🌿', color: '#F05032', category: 'DevOps' },
  { name: 'GitHub Actions', icon: '⚙️', color: '#2088FF', category: 'DevOps' },
  { name: 'Nginx', icon: '🟢', color: '#009639', category: 'DevOps' },
  { name: 'PM2', icon: '♻️', color: '#2B037A', category: 'DevOps' },
  { name: 'Linux', icon: '🐧', color: '#FCC624', category: 'DevOps' },

  // ================= CLOUD =================
  { name: 'AWS', icon: '☁️', color: '#FF9900', category: 'Cloud' },
  { name: 'Vercel', icon: '▲', color: '#000000', category: 'Cloud' },
  { name: 'Render', icon: '🚀', color: '#46E3B7', category: 'Cloud' },
  { name: 'Firebase', icon: '🔥', color: '#FFCA28', category: 'Cloud' },
  { name: 'DigitalOcean', icon: '🌊', color: '#0080FF', category: 'Cloud' },
  { name: 'Railway', icon: '🚂', color: '#0B0D0E', category: 'Cloud' },

  // ================= PAYMENTS =================
  { name: 'Stripe', icon: '💳', color: '#6772E5', category: 'Payments' },
  { name: 'Razorpay', icon: '💠', color: '#0C2451', category: 'Payments' },

  // ================= BUILD =================
  { name: 'Vite', icon: '⚡', color: '#646CFF', category: 'Build' },
  { name: 'Webpack', icon: '📦', color: '#8DD6F9', category: 'Build' },
  { name: 'Babel', icon: '🔶', color: '#F9DC3E', category: 'Build' },
  { name: 'ESLint', icon: '🧹', color: '#4B32C3', category: 'Build' },
  { name: 'Prettier', icon: '✨', color: '#F7B93E', category: 'Build' },
];

const STATS = [
  { value: '120+', label: 'Projects Delivered', icon: <Briefcase size={22} /> },
  { value: '80+', label: 'Happy Clients', icon: <Users size={22} /> },
  { value: '4+', label: 'Years Experience', icon: <Clock size={22} /> },
  { value: '99%', label: 'Client Satisfaction', icon: <Star size={22} /> },
  { value: '15K+', label: 'GitHub Stars', icon: <Github size={22} /> },
  { value: '30+', label: 'Open Source Repos', icon: <GitBranch size={22} /> },
];

const EXPERTISE = [
  {
    icon: <Monitor size={26} />,
    title: 'Frontend Engineering',
    desc: 'Pixel-perfect, blazing fast React applications with seamless UX and state-of-the-art component architecture.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    icon: <Server size={26} />,
    title: 'Backend Architecture',
    desc: 'Scalable RESTful and GraphQL APIs with Node.js — built for performance, security, and long-term maintainability.',
    skills: ['Node.js', 'Express', 'GraphQL', 'REST APIs', 'WebSockets'],
  },
  {
    icon: <Database size={26} />,
    title: 'Database Design',
    desc: 'Optimal schema design, query optimization, and multi-database strategies for both SQL and NoSQL workloads.',
    skills: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma', 'Mongoose'],
  },
  {
    icon: <Cloud size={26} />,
    title: 'Cloud & DevOps',
    desc: 'Containerized deployments, CI/CD pipelines, and cloud-native architectures on AWS, GCP, and Vercel.',
    skills: ['Docker', 'AWS', 'Vercel', 'GitHub Actions', 'Nginx'],
  },
  {
    icon: <Lock size={26} />,
    title: 'Auth & Security',
    desc: 'Enterprise-grade authentication, JWT, OAuth 2.0, role-based access control, and full security audits.',
    skills: ['JWT', 'OAuth 2.0', 'RBAC', 'bcrypt', 'Helmet.js'],
  },
  {
    icon: <Smartphone size={26} />,
    title: 'Responsive Design',
    desc: 'Mobile-first design systems that work flawlessly across every screen, browser, and device type.',
    skills: ['CSS Grid', 'Flexbox', 'SASS', 'Design Systems', 'PWA'],
  },
];

const SERVICES = [
  {
    icon: <Code2 size={28} />,
    title: 'Custom Web Development',
    price: 'From ₹15,000',
    desc: 'Full-stack web applications built from scratch — tailored to your exact business requirements.',
    features: ['Custom UI/UX Design', 'REST/GraphQL API', 'Admin Dashboard', 'SEO Optimized', '1 Month Free Support'],
    badge: 'Most Popular',
  },
  {
    icon: <Zap size={28} />,
    title: 'SaaS Development',
    price: 'From ₹40,000',
    desc: 'End-to-end SaaS product development with subscriptions, billing, analytics, and multi-tenancy.',
    features: ['Multi-tenancy', 'Stripe Billing', 'Analytics Dashboard', 'Email Automation', 'Scalable Architecture'],
    badge: 'Premium',
  },
  {
    icon: <Globe size={28} />,
    title: 'API Development',
    price: 'From ₹8,000',
    desc: 'Robust, documented, and well-tested APIs that power your frontend, mobile app, or third-party integrations.',
    features: ['OpenAPI Docs', 'Rate Limiting', 'Auth Middleware', 'WebSocket Support', 'Postman Collection'],
    badge: null,
  },
  {
    icon: <Palette size={28} />,
    title: 'UI/UX to Code',
    price: 'From ₹6,000',
    desc: 'Convert your Figma or design mockups into pixel-perfect, responsive, production-ready React code.',
    features: ['Pixel Perfect', 'Responsive Design', 'Animations', 'Dark Mode', 'Component Library'],
    badge: null,
  },
  {
    icon: <RefreshCw size={28} />,
    title: 'Code Review & Audit',
    price: 'From ₹4,000',
    desc: 'In-depth review of your codebase for bugs, performance issues, security vulnerabilities, and best practices.',
    features: ['Security Audit', 'Performance Report', 'Refactor Plan', 'Tech Debt Analysis', 'Written Report'],
    badge: null,
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Mentorship & Consulting',
    price: '₹500/hour',
    desc: 'One-on-one guidance for developers — from junior to mid-level — on real-world MERN stack projects.',
    features: ['Weekly Sessions', 'Project Reviews', 'Career Guidance', 'Interview Prep', 'Resource Access'],
    badge: 'New',
  },
];

const INDUSTRIES = [
  { icon: <BarChart2 size={24} />, name: 'FinTech', desc: 'Dashboards, payment systems, analytics platforms' },
  { icon: <Heart size={24} />, name: 'HealthTech', desc: 'Patient portals, booking systems, telemedicine apps' },
  { icon: <BookOpen size={24} />, name: 'EdTech', desc: 'LMS platforms, course marketplaces, quiz systems' },
  { icon: <Package size={24} />, name: 'E-Commerce', desc: 'Product stores, inventory management, checkout flows' },
  { icon: <Briefcase size={24} />, name: 'SaaS Startups', desc: 'MVP to production, billing, user management' },
  { icon: <Globe size={24} />, name: 'Media & Blogs', desc: 'Content platforms, CMS, SEO-optimized sites' },
  { icon: <Target size={24} />, name: 'Marketing', desc: 'Landing pages, lead funnels, campaign dashboards' },
  { icon: <Box size={24} />, name: 'Real Estate', desc: 'Property listings, booking, agent portals' },
];

const CASE_STUDIES = [
  {
    tag: 'SaaS',
    title: 'AuthNest — Login & Auth SaaS Platform',
    desc: 'Built a complete authentication-as-a-service platform with multi-tenant support, OAuth, JWT, and a beautiful admin dashboard. Scaled to 10K+ users in 3 months.',
    stack: ['React', 'Node.js', 'MongoDB', 'Redis', 'AWS'],
    metrics: ['10K+ Users', '99.9% Uptime', '3 Month Build'],
    color: '#6366f1',
  },
  {
    tag: 'E-Commerce',
    title: 'DigitalCart — MERN Stack Store',
    desc: 'Full-featured digital product marketplace with Stripe payments, affiliate system, coupon engine, and real-time analytics. Processed ₹5L+ in first month.',
    stack: ['Next.js', 'Express', 'PostgreSQL', 'Stripe', 'Vercel'],
    metrics: ['₹5L+ Revenue', '2K+ Products', '40% Conversion'],
    color: '#10b981',
  },
  {
    tag: 'EdTech',
    title: 'LearnForge — Course Platform',
    desc: 'Video-based learning platform with progress tracking, certificates, quizzes, and a creator dashboard. 500+ courses published in 6 months.',
    stack: ['React', 'Node.js', 'MongoDB', 'AWS S3', 'Socket.io'],
    metrics: ['500+ Courses', '8K Learners', '4.9★ Rating'],
    color: '#f59e0b',
  },
];

const PRODUCTS = [
  {
    icon: <FileCode size={24} />,
    title: 'MERN Starter Kit',
    type: 'Template',
    price: '₹499',
    originalPrice: '₹999',
    desc: 'Production-ready MERN boilerplate with auth, admin panel, dark mode, and 30+ components.',
    rating: 4.9,
    sales: 320,
  },
  {
    icon: <Shield size={24} />,
    title: 'Auth System Complete',
    type: 'Source Code',
    price: '₹799',
    originalPrice: '₹1499',
    desc: 'Full JWT + OAuth2 authentication system with roles, refresh tokens, and email verification.',
    rating: 4.8,
    sales: 185,
  },
  {
    icon: <BarChart2 size={24} />,
    title: 'Admin Dashboard UI',
    type: 'UI Kit',
    price: '₹599',
    originalPrice: '₹1199',
    desc: '50+ React components for admin dashboards — tables, charts, forms, and more. Dark/light included.',
    rating: 4.9,
    sales: 412,
  },
  {
    icon: <Database size={24} />,
    title: 'MongoDB Schema Pack',
    type: 'Resource',
    price: '₹299',
    originalPrice: '₹599',
    desc: '30+ production-ready MongoDB schemas for e-commerce, SaaS, blogs, and social platforms.',
    rating: 4.7,
    sales: 98,
  },
];

const FREE_RESOURCES = [
  {
    icon: <BookOpen size={24} />,
    title: 'MERN Stack Roadmap 2025',
    type: 'PDF Guide',
    desc: 'Complete step-by-step roadmap to becoming a MERN stack developer in 2025 — from zero to job-ready.',
    downloads: '4.2K',
  },
  {
    icon: <Terminal size={24} />,
    title: 'React Best Practices Cheatsheet',
    type: 'Cheatsheet',
    desc: '50 real-world patterns, hooks, and performance tips used in production React apps.',
    downloads: '6.8K',
  },
  {
    icon: <Cpu size={24} />,
    title: 'Node.js API Starter Template',
    type: 'GitHub Repo',
    desc: 'Fully structured Express API with validation, error handling, logging, and environment configs.',
    downloads: '3.1K',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Discovery Call', desc: 'We start with a 30-min call to understand your goals, requirements, tech stack, and timeline.', icon: <MessageSquare size={22} /> },
  { step: '02', title: 'Scope & Proposal', desc: 'I send a detailed project scope, timeline, and fixed-price proposal within 24 hours.', icon: <FileCode size={22} /> },
  { step: '03', title: 'Design & Architecture', desc: 'UI wireframes, database schema, and technical architecture are planned before a single line of code.', icon: <Layers size={22} /> },
  { step: '04', title: 'Iterative Development', desc: 'Development happens in sprints with regular demos — you see progress every week, not just at the end.', icon: <GitBranch size={22} /> },
  { step: '05', title: 'Testing & QA', desc: 'Thorough testing across devices, browsers, and edge cases. Performance and security audits included.', icon: <Shield size={22} /> },
  { step: '06', title: 'Launch & Support', desc: 'Clean handoff with documentation, deployment, and 30 days of free post-launch support.', icon: <Rocket size={22} /> },
];

const WHY_ME = [
  { icon: <Zap size={22} />, title: 'Fast Delivery', desc: 'Most projects delivered 20% ahead of schedule. Speed without cutting corners.' },
  { icon: <Shield size={22} />, title: 'Clean Code', desc: 'Well-documented, scalable, and maintainable code following industry standards.' },
  { icon: <MessageSquare size={22} />, title: 'Clear Communication', desc: 'Daily updates, transparent timelines, and zero surprises throughout the project.' },
  { icon: <RefreshCw size={22} />, title: 'Unlimited Revisions', desc: 'Your satisfaction matters. Revisions are part of the process, not an extra cost.' },
  { icon: <Lock size={22} />, title: 'Security First', desc: 'Every application is built with security best practices baked in from day one.' },
  { icon: <TrendingUp size={22} />, title: 'Growth Focused', desc: 'I build for scale. Your project is architected to handle 10x growth without rebuilds.' },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'CEO, TechLaunch India',
    avatar: 'AM',
    rating: 5,
    text: 'Shivam delivered our entire SaaS platform in just 6 weeks. The code quality is exceptional — clean, well-documented, and incredibly scalable. Best investment we made.',
    color: '#6366f1',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, LearnSpark EdTech',
    avatar: 'PS',
    rating: 5,
    text: 'Working with Shivam felt like working with a co-founder. He suggested features we hadn\'t thought of, and the final product far exceeded our expectations.',
    color: '#10b981',
  },
  {
    name: 'Rahul Kapoor',
    role: 'CTO, FinFlow Startup',
    avatar: 'RK',
    rating: 5,
    text: 'Our fintech dashboard handles thousands of transactions daily without a hiccup. Shivam\'s backend architecture is rock solid. Highly recommend.',
    color: '#f59e0b',
  },
  {
    name: 'Sneha Joshi',
    role: 'Product Manager, ShopEasy',
    avatar: 'SJ',
    rating: 5,
    text: 'The admin panel Shivam built for us saved our team 10+ hours every week. UI is beautiful, intuitive, and our team adopted it instantly.',
    color: '#ec4899',
  },
];

const OPEN_SOURCE = [
  {
    name: 'mern-auth-kit',
    desc: 'Complete MERN authentication system with JWT, OAuth, refresh tokens, and role-based access control.',
    stars: 2400,
    forks: 380,
    lang: 'JavaScript',
    langColor: '#f7df1e',
  },
  {
    name: 'react-admin-ui',
    desc: 'Premium React admin UI library with 60+ dark/light components for dashboards and data tables.',
    stars: 1800,
    forks: 210,
    lang: 'TypeScript',
    langColor: '#3178c6',
  },
  {
    name: 'express-api-boilerplate',
    desc: 'Production-ready Express.js REST API template with validation, logging, auth, and Docker support.',
    stars: 1200,
    forks: 165,
    lang: 'JavaScript',
    langColor: '#f7df1e',
  },
];

const BLOG_POSTS = [
  {
    tag: 'Tutorial',
    title: 'Building a Secure JWT Authentication System in Node.js (2025)',
    desc: 'A complete guide to implementing access tokens, refresh tokens, and blacklisting with Redis.',
    readTime: '12 min read',
    date: 'Jan 28, 2025',
    color: '#6366f1',
  },
  {
    tag: 'Architecture',
    title: 'How I Structure Large-Scale MERN Applications',
    desc: 'The folder structure, naming conventions, and patterns I use in production MERN projects.',
    readTime: '9 min read',
    date: 'Jan 15, 2025',
    color: '#10b981',
  },
  {
    tag: 'Performance',
    title: 'React Performance Optimization: 10 Techniques That Actually Work',
    desc: 'Real-world techniques to reduce bundle size, eliminate re-renders, and speed up React apps.',
    readTime: '15 min read',
    date: 'Dec 30, 2024',
    color: '#f59e0b',
  },
];

const FAQS = [
  { q: 'What is your typical project timeline?', a: 'Most small projects take 1–2 weeks, medium projects 3–6 weeks, and large SaaS platforms 6–12 weeks. I\'ll give you a precise timeline in the proposal after understanding your requirements.' },
  { q: 'Do you offer fixed-price or hourly billing?', a: 'Both! Fixed-price for well-defined projects (most common), and hourly for ongoing work, consulting, or projects with evolving requirements.' },
  { q: 'Can you work with an existing codebase?', a: 'Absolutely. I regularly take over and improve existing projects. I\'ll do a quick audit first to understand the codebase, then propose a clean improvement plan.' },
  { q: 'What tech stack do you primarily work with?', a: 'My primary stack is MERN (MongoDB, Express, React, Node.js) with TypeScript. I also work with Next.js, PostgreSQL, Redis, Docker, and AWS.' },
  { q: 'Do you provide source code and documentation?', a: 'Yes, always. You get full source code, a structured README, API documentation, and a deployment guide. The project is 100% yours.' },
  { q: 'Do you offer post-launch support?', a: 'Every project includes 30 days of free post-launch support. After that, I offer affordable monthly maintenance retainers.' },
];

const ACHIEVEMENTS = [
  { icon: <Award size={22} />, title: 'Top Rated Freelancer', desc: 'Consistently rated 5★ across platforms' },
  { icon: <TrendingUp size={22} />, title: '₹50L+ Revenue Generated', desc: 'For clients across various industries' },
  { icon: <Coffee size={22} />, title: '3,000+ Hours Coded', desc: 'In the last 12 months alone' },
  { icon: <Lightbulb size={22} />, title: '25+ Talks & Articles', desc: 'On MERN stack and web architecture' },
];

const AVAILABILITY = {
  status: 'available',
  slots: 2,
  nextAvailable: 'Feb 28, 2025',
};

// ─── HOOK: Intersection Observer for scroll animations ─────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
const Homepage = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [techFilter, setTechFilter] = useState('All');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Testimonial auto-rotate
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const techCategories = ['All', ...new Set(TECH_STACK.map((t) => t.category))];
  const filteredTech = techFilter === 'All' ? TECH_STACK : TECH_STACK.filter((t) => t.category === techFilter);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // SweetAlert2 usage (if available)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: "You're In! 🎉",
        text: `${email} has been added to the community list.`,
        confirmButtonColor: '#6366f1',
        background: isDarkMode ? '#0f1320' : '#ffffff',
        color: isDarkMode ? '#e2e8f0' : '#1e1b4b',
      });
    } else {
      alert(`✅ Subscribed! Welcome to the community.`);
    }
    setEmail('');
  };

  const themeClass = isDarkMode ? 'dark' : 'light';

  // Scroll-reveal refs
  const [statsRef, statsVisible] = useScrollReveal(0.1);
  const [expertiseRef, expertiseVisible] = useScrollReveal(0.05);
  const [servicesRef, servicesVisible] = useScrollReveal(0.05);
  const [processRef, processVisible] = useScrollReveal(0.05);
  const [whyRef, whyVisible] = useScrollReveal(0.05);
  const [caseRef, caseVisible] = useScrollReveal(0.05);
  const [blogRef, blogVisible] = useScrollReveal(0.05);

  return (
    <div className={`shivam-stack-homepage-root ${themeClass}`}>



      {/* ── 1. ANNOUNCEMENT BAR ────────────────────────────────────── */}
      <div className="shivam-stack-homepage-announcement-bar">
        <div className="shivam-stack-homepage-announcement-inner">
          <span className="shivam-stack-homepage-announcement-badge">🔥 New</span>
          <span className="shivam-stack-homepage-announcement-text">
            MERN Starter Kit v3.0 is live — Auth, Admin, Dark Mode included.
          </span>
          <Link to="/store" className="shivam-stack-homepage-announcement-link">
            Grab it now <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── 2. HERO SECTION ────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-hero" id="section-about">
        <div className="shivam-stack-homepage-hero-bg">
          <div className="shivam-stack-homepage-hero-grid-overlay" />
          <div className="shivam-stack-homepage-hero-orb shivam-stack-homepage-hero-orb-1" />
          <div className="shivam-stack-homepage-hero-orb shivam-stack-homepage-hero-orb-2" />
          <div className="shivam-stack-homepage-hero-orb shivam-stack-homepage-hero-orb-3" />
        </div>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-hero-content">
            <div className="shivam-stack-homepage-hero-badge">
              <span className="shivam-stack-homepage-hero-badge-dot" />
              <span>Available for Projects</span>
              <span className="shivam-stack-homepage-hero-badge-slots">2 slots open</span>
            </div>
            <h1 className="shivam-stack-homepage-hero-h1">
              I Build <span className="shivam-stack-homepage-hero-gradient-text">Full-Stack</span>
              <br />
              Products That <span className="shivam-stack-homepage-hero-gradient-text">Scale</span>.
            </h1>
            <p className="shivam-stack-homepage-hero-subtitle">
              MERN Stack Developer with 4+ years crafting high-performance web applications, SaaS platforms, and developer tools. From idea to production — fast, clean, and scalable.
            </p>
            <div className="shivam-stack-homepage-hero-tags">
              {['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Next.js'].map((t) => (
                <span key={t} className="shivam-stack-homepage-hero-tag">{t}</span>
              ))}
            </div>
            <div className="shivam-stack-homepage-hero-actions">
              <button className="shivam-stack-homepage-btn-primary shivam-stack-homepage-hero-cta-primary" onClick={() => scrollTo('section-contact')}>
                Start a Project <ArrowRight size={16} />
              </button>
              <button className="shivam-stack-homepage-btn-ghost shivam-stack-homepage-hero-cta-secondary" onClick={() => scrollTo('section-work')}>
                <Play size={15} /> View Work
              </button>
            </div>
            <div className="shivam-stack-homepage-hero-social">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="shivam-stack-homepage-hero-social-link" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="shivam-stack-homepage-hero-social-link" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="shivam-stack-homepage-hero-social-link" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="mailto:shivam@example.com" className="shivam-stack-homepage-hero-social-link" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>
          <div className="shivam-stack-homepage-hero-visual">
            <div className="shivam-stack-homepage-hero-card-3d">
              <div className="shivam-stack-homepage-hero-card-inner">
                <div className="shivam-stack-homepage-hero-profile-ring">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=ShivamDev&backgroundColor=b6e3f4,c0aede&backgroundType=gradientLinear"
                    alt="Shivam"
                    className="shivam-stack-homepage-hero-profile-img"
                  />
                </div>
                <div className="shivam-stack-homepage-hero-card-info">
                  <div className="shivam-stack-homepage-hero-card-name">Shivam</div>
                  <div className="shivam-stack-homepage-hero-card-role">MERN Stack Developer</div>
                  <div className="shivam-stack-homepage-hero-card-location"><MapPin size={12} /> India • Remote Friendly</div>
                </div>
                <div className="shivam-stack-homepage-hero-floating-badges">
                  <div className="shivam-stack-homepage-hero-floating-badge shivam-stack-homepage-hero-fb-1">
                    <CheckCircle size={13} /> <span>120+ Projects</span>
                  </div>
                  <div className="shivam-stack-homepage-hero-floating-badge shivam-stack-homepage-hero-fb-2">
                    <Star size={13} fill="currentColor" /> <span>5.0 Rating</span>
                  </div>
                  <div className="shivam-stack-homepage-hero-floating-badge shivam-stack-homepage-hero-fb-3">
                    <Zap size={13} /> <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="shivam-stack-homepage-hero-scroll-cue" onClick={() => scrollTo('section-stats')} aria-label="Scroll down">
          <ChevronDown size={20} />
        </button>
      </section>

      {/* ── 4. STATS ───────────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-stats-section" id="section-stats" ref={statsRef}>
        <div className="shivam-stack-homepage-container">
          <div className={`shivam-stack-homepage-stats-grid ${statsVisible ? 'shivam-stack-homepage-revealed' : ''}`}>
            {STATS.map((s, i) => (
              <div key={i} className="shivam-stack-homepage-stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="shivam-stack-homepage-stat-icon">{s.icon}</div>
                <div className="shivam-stack-homepage-stat-value">{s.value}</div>
                <div className="shivam-stack-homepage-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. TECH STACK ─────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-tech-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Tech Stack</span>
            <h2 className="shivam-stack-homepage-section-title">Tools I Master Daily</h2>
            <p className="shivam-stack-homepage-section-desc">A curated stack of proven, production-battle-tested technologies.</p>
          </div>
          <div className="shivam-stack-homepage-tech-filters">
            {techCategories.map((cat) => (
              <button
                key={cat}
                className={`shivam-stack-homepage-tech-filter-btn ${techFilter === cat ? 'shivam-stack-homepage-tech-filter-active' : ''}`}
                onClick={() => setTechFilter(cat)}
              >{cat}</button>
            ))}
          </div>
          <div className="shivam-stack-homepage-tech-grid">
            {filteredTech.map((tech, i) => (
              <div key={tech.name} className="shivam-stack-homepage-tech-card" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="shivam-stack-homepage-tech-icon" style={{ '--tech-color': tech.color }}>
                  <span>{tech.icon}</span>
                </div>
                <span className="shivam-stack-homepage-tech-name">{tech.name}</span>
                <span className="shivam-stack-homepage-tech-cat">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. ABOUT ME ────────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-about-section" id="section-about-me">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-about-grid">
            <div className="shivam-stack-homepage-about-left">
              <span className="shivam-stack-homepage-section-label">About Me</span>
              <h2 className="shivam-stack-homepage-section-title shivam-stack-homepage-about-title">
                Hi, I'm Shivam —<br /> A Developer Who Ships.
              </h2>
              <p className="shivam-stack-homepage-about-body">
                I'm a full-stack MERN developer based in India with a deep obsession for clean architecture and user experience. Over the past 4+ years, I've built everything from MVP startups to production SaaS platforms handling thousands of users daily.
              </p>
              <p className="shivam-stack-homepage-about-body">
                I don't just write code — I solve business problems with technology. Every line I write is intentional, scalable, and maintainable. I care deeply about performance, developer experience, and delivering real business value.
              </p>
              <div className="shivam-stack-homepage-about-achievements">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className="shivam-stack-homepage-about-achievement">
                    <div className="shivam-stack-homepage-about-achievement-icon">{a.icon}</div>
                    <div>
                      <div className="shivam-stack-homepage-about-achievement-title">{a.title}</div>
                      <div className="shivam-stack-homepage-about-achievement-desc">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="shivam-stack-homepage-about-actions">
                <a href="/resume.pdf" download className="shivam-stack-homepage-btn-primary">
                  <Download size={15} /> Download Resume
                </a>
                <button className="shivam-stack-homepage-btn-ghost" onClick={() => scrollTo('section-contact')}>
                  Let's Talk <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className="shivam-stack-homepage-about-right">
              <div className="shivam-stack-homepage-about-visual">
                <div className="shivam-stack-homepage-about-img-wrap">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=ShivamPro&backgroundColor=dbeafe&backgroundType=gradientLinear&clothingColor=3c4f5c"
                    alt="Shivam"
                    className="shivam-stack-homepage-about-img"
                  />
                </div>
                <div className="shivam-stack-homepage-about-exp-badge">
                  <div className="shivam-stack-homepage-about-exp-num">4+</div>
                  <div className="shivam-stack-homepage-about-exp-text">Years of<br/>Experience</div>
                </div>
                <div className="shivam-stack-homepage-about-avail-badge">
                  <span className="shivam-stack-homepage-about-avail-dot" />
                  Available Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. EXPERTISE ───────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-expertise-section" ref={expertiseRef}>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Core Skills</span>
            <h2 className="shivam-stack-homepage-section-title">Where I Excel</h2>
            <p className="shivam-stack-homepage-section-desc">Deep expertise across the full stack — from pixel-perfect UIs to battle-tested backend systems.</p>
          </div>
          <div className={`shivam-stack-homepage-expertise-grid ${expertiseVisible ? 'shivam-stack-homepage-revealed' : ''}`}>
            {EXPERTISE.map((exp, i) => (
              <div key={i} className="shivam-stack-homepage-expertise-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="shivam-stack-homepage-expertise-icon">{exp.icon}</div>
                <h3 className="shivam-stack-homepage-expertise-title">{exp.title}</h3>
                <p className="shivam-stack-homepage-expertise-desc">{exp.desc}</p>
                <div className="shivam-stack-homepage-expertise-skills">
                  {exp.skills.map((sk) => (
                    <span key={sk} className="shivam-stack-homepage-expertise-skill-tag">{sk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. SERVICES ────────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-services-section" id="section-services" ref={servicesRef}>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Services</span>
            <h2 className="shivam-stack-homepage-section-title">What I Build For You</h2>
            <p className="shivam-stack-homepage-section-desc">From quick MVPs to full-scale SaaS platforms — clear pricing, real deliverables.</p>
          </div>
          <div className={`shivam-stack-homepage-services-grid ${servicesVisible ? 'shivam-stack-homepage-revealed' : ''}`}>
            {SERVICES.map((svc, i) => (
              <div key={i} className={`shivam-stack-homepage-service-card ${svc.badge === 'Most Popular' ? 'shivam-stack-homepage-service-card-featured' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {svc.badge && <div className={`shivam-stack-homepage-service-badge ${svc.badge === 'Most Popular' ? 'shivam-stack-homepage-service-badge-popular' : svc.badge === 'New' ? 'shivam-stack-homepage-service-badge-new' : 'shivam-stack-homepage-service-badge-premium'}`}>{svc.badge}</div>}
                <div className="shivam-stack-homepage-service-icon">{svc.icon}</div>
                <div className="shivam-stack-homepage-service-price">{svc.price}</div>
                <h3 className="shivam-stack-homepage-service-title">{svc.title}</h3>
                <p className="shivam-stack-homepage-service-desc">{svc.desc}</p>
                <ul className="shivam-stack-homepage-service-features">
                  {svc.features.map((f) => (
                    <li key={f}><CheckCircle size={13} /> <span>{f}</span></li>
                  ))}
                </ul>
                <button className="shivam-stack-homepage-btn-primary shivam-stack-homepage-service-cta" onClick={() => scrollTo('section-contact')}>
                  Get Started <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. INDUSTRIES ─────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-industries-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Industries</span>
            <h2 className="shivam-stack-homepage-section-title">Who I Help</h2>
            <p className="shivam-stack-homepage-section-desc">Diverse domain experience means I understand your business — not just your tech requirements.</p>
          </div>
          <div className="shivam-stack-homepage-industries-grid">
            {INDUSTRIES.map((ind, i) => (
              <div key={i} className="shivam-stack-homepage-industry-card">
                <div className="shivam-stack-homepage-industry-icon">{ind.icon}</div>
                <div className="shivam-stack-homepage-industry-name">{ind.name}</div>
                <div className="shivam-stack-homepage-industry-desc">{ind.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CASE STUDIES ──────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-cases-section" id="section-work" ref={caseRef}>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Case Studies</span>
            <h2 className="shivam-stack-homepage-section-title">Featured Projects</h2>
            <p className="shivam-stack-homepage-section-desc">Real-world solutions that made a real-world difference for my clients.</p>
          </div>
          <div className={`shivam-stack-homepage-cases-grid ${caseVisible ? 'shivam-stack-homepage-revealed' : ''}`}>
            {CASE_STUDIES.map((cs, i) => (
              <div key={i} className="shivam-stack-homepage-case-card" style={{ '--case-color': cs.color, animationDelay: `${i * 0.15}s` }}>
                <div className="shivam-stack-homepage-case-top">
                  <span className="shivam-stack-homepage-case-tag">{cs.tag}</span>
                  <ExternalLink size={16} className="shivam-stack-homepage-case-ext" />
                </div>
                <h3 className="shivam-stack-homepage-case-title">{cs.title}</h3>
                <p className="shivam-stack-homepage-case-desc">{cs.desc}</p>
                <div className="shivam-stack-homepage-case-metrics">
                  {cs.metrics.map((m) => (
                    <span key={m} className="shivam-stack-homepage-case-metric">{m}</span>
                  ))}
                </div>
                <div className="shivam-stack-homepage-case-stack">
                  {cs.stack.map((s) => (
                    <span key={s} className="shivam-stack-homepage-case-tech">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="shivam-stack-homepage-section-cta">
            <Link to="/portfolio" className="shivam-stack-homepage-btn-ghost">
              View All Projects <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 11. PRODUCT STORE ─────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-store-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Digital Store</span>
            <h2 className="shivam-stack-homepage-section-title">Premium Products & Resources</h2>
            <p className="shivam-stack-homepage-section-desc">Production-ready starter kits, UI kits, and source code to accelerate your development.</p>
          </div>
          <div className="shivam-stack-homepage-store-grid">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="shivam-stack-homepage-product-card">
                <div className="shivam-stack-homepage-product-header">
                  <div className="shivam-stack-homepage-product-icon">{p.icon}</div>
                  <span className="shivam-stack-homepage-product-type">{p.type}</span>
                </div>
                <h3 className="shivam-stack-homepage-product-title">{p.title}</h3>
                <p className="shivam-stack-homepage-product-desc">{p.desc}</p>
                <div className="shivam-stack-homepage-product-footer">
                  <div className="shivam-stack-homepage-product-pricing">
                    <span className="shivam-stack-homepage-product-price">{p.price}</span>
                    <span className="shivam-stack-homepage-product-original">{p.originalPrice}</span>
                  </div>
                  <div className="shivam-stack-homepage-product-meta">
                    <span className="shivam-stack-homepage-product-rating"><Star size={11} fill="currentColor" /> {p.rating}</span>
                    <span className="shivam-stack-homepage-product-sales">{p.sales} sold</span>
                  </div>
                </div>
                <Link to="/store" className="shivam-stack-homepage-btn-primary shivam-stack-homepage-product-btn">
                  Buy Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          <div className="shivam-stack-homepage-section-cta">
            <Link to="/store" className="shivam-stack-homepage-btn-ghost">Browse Full Store <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ── 12. FREE RESOURCES ────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-resources-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Free Resources</span>
            <h2 className="shivam-stack-homepage-section-title">Free Stuff for Developers</h2>
            <p className="shivam-stack-homepage-section-desc">High-quality guides, cheatsheets, and templates — completely free. No email required.</p>
          </div>
          <div className="shivam-stack-homepage-resources-grid">
            {FREE_RESOURCES.map((r, i) => (
              <div key={i} className="shivam-stack-homepage-resource-card">
                <div className="shivam-stack-homepage-resource-top">
                  <div className="shivam-stack-homepage-resource-icon">{r.icon}</div>
                  <span className="shivam-stack-homepage-resource-type">{r.type}</span>
                </div>
                <h3 className="shivam-stack-homepage-resource-title">{r.title}</h3>
                <p className="shivam-stack-homepage-resource-desc">{r.desc}</p>
                <div className="shivam-stack-homepage-resource-footer">
                  <span className="shivam-stack-homepage-resource-downloads"><Download size={12} /> {r.downloads} downloads</span>
                  <Link to="/resources" className="shivam-stack-homepage-resource-link">
                    Download Free <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. PROCESS ───────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-process-section" ref={processRef}>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">How It Works</span>
            <h2 className="shivam-stack-homepage-section-title">My Development Process</h2>
            <p className="shivam-stack-homepage-section-desc">A structured approach that delivers results — on time, every time.</p>
          </div>
          <div className={`shivam-stack-homepage-process-steps ${processVisible ? 'shivam-stack-homepage-revealed' : ''}`}>
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="shivam-stack-homepage-process-step" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="shivam-stack-homepage-process-step-num">{step.step}</div>
                {i < PROCESS_STEPS.length - 1 && <div className="shivam-stack-homepage-process-connector" />}
                <div className="shivam-stack-homepage-process-step-icon">{step.icon}</div>
                <h3 className="shivam-stack-homepage-process-step-title">{step.title}</h3>
                <p className="shivam-stack-homepage-process-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. WHY CHOOSE ME ─────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-why-section" ref={whyRef}>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-why-grid">
            <div className="shivam-stack-homepage-why-left">
              <span className="shivam-stack-homepage-section-label">Why Me</span>
              <h2 className="shivam-stack-homepage-section-title shivam-stack-homepage-why-title">Why Clients Choose Me Over Agencies</h2>
              <p className="shivam-stack-homepage-why-desc">
                Agencies charge 3x and put a junior on your project. I'm a senior developer who takes ownership — delivering the same quality at a fraction of the cost, with direct, transparent communication.
              </p>
              <div className="shivam-stack-homepage-why-cta-wrap">
                <button className="shivam-stack-homepage-btn-primary" onClick={() => scrollTo('section-contact')}>
                  Start Working Together <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className={`shivam-stack-homepage-why-right ${whyVisible ? 'shivam-stack-homepage-revealed' : ''}`}>
              {WHY_ME.map((w, i) => (
                <div key={i} className="shivam-stack-homepage-why-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="shivam-stack-homepage-why-icon">{w.icon}</div>
                  <div>
                    <div className="shivam-stack-homepage-why-card-title">{w.title}</div>
                    <div className="shivam-stack-homepage-why-card-desc">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 15. TESTIMONIALS ──────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-testimonials-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Testimonials</span>
            <h2 className="shivam-stack-homepage-section-title">What Clients Say</h2>
            <p className="shivam-stack-homepage-section-desc">Real words from real people who trusted me with their projects.</p>
          </div>
          <div className="shivam-stack-homepage-testimonials-carousel">
            <div className="shivam-stack-homepage-testimonials-track" style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="shivam-stack-homepage-testimonial-card">
                  <div className="shivam-stack-homepage-testimonial-stars">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="shivam-stack-homepage-testimonial-text">"{t.text}"</blockquote>
                  <div className="shivam-stack-homepage-testimonial-author">
                    <div className="shivam-stack-homepage-testimonial-avatar" style={{ background: `${t.color}30`, color: t.color }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="shivam-stack-homepage-testimonial-name">{t.name}</div>
                      <div className="shivam-stack-homepage-testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="shivam-stack-homepage-testimonials-controls">
              <button onClick={() => setTestimonialIdx((i) => Math.max(0, i - 1))} className="shivam-stack-homepage-carousel-btn" disabled={testimonialIdx === 0}>
                <ChevronLeft size={18} />
              </button>
              <div className="shivam-stack-homepage-carousel-dots">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} className={`shivam-stack-homepage-carousel-dot ${i === testimonialIdx ? 'shivam-stack-homepage-carousel-dot-active' : ''}`} onClick={() => setTestimonialIdx(i)} />
                ))}
              </div>
              <button onClick={() => setTestimonialIdx((i) => Math.min(TESTIMONIALS.length - 1, i + 1))} className="shivam-stack-homepage-carousel-btn" disabled={testimonialIdx === TESTIMONIALS.length - 1}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 16. OPEN SOURCE ───────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-opensource-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Open Source</span>
            <h2 className="shivam-stack-homepage-section-title">GitHub Contributions</h2>
            <p className="shivam-stack-homepage-section-desc">I believe in giving back. Here are some of my most-starred open source projects.</p>
          </div>
          <div className="shivam-stack-homepage-opensource-grid">
            {OPEN_SOURCE.map((repo, i) => (
              <div key={i} className="shivam-stack-homepage-repo-card">
                <div className="shivam-stack-homepage-repo-header">
                  <Github size={18} className="shivam-stack-homepage-repo-icon" />
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="shivam-stack-homepage-repo-name">{repo.name}</a>
                  <ExternalLink size={13} className="shivam-stack-homepage-repo-ext" />
                </div>
                <p className="shivam-stack-homepage-repo-desc">{repo.desc}</p>
                <div className="shivam-stack-homepage-repo-footer">
                  <span className="shivam-stack-homepage-repo-lang">
                    <span className="shivam-stack-homepage-repo-lang-dot" style={{ background: repo.langColor }} />
                    {repo.lang}
                  </span>
                  <span className="shivam-stack-homepage-repo-stat"><Star size={12} /> {repo.stars.toLocaleString()}</span>
                  <span className="shivam-stack-homepage-repo-stat"><GitBranch size={12} /> {repo.forks}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="shivam-stack-homepage-section-cta">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="shivam-stack-homepage-btn-ghost">
              <Github size={16} /> View GitHub Profile <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 17. BLOG ──────────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-blog-section" id="section-blog" ref={blogRef}>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">Blog</span>
            <h2 className="shivam-stack-homepage-section-title">Insights & Tutorials</h2>
            <p className="shivam-stack-homepage-section-desc">Deep-dive articles on MERN stack, architecture, and career growth written from real experience.</p>
          </div>
          <div className={`shivam-stack-homepage-blog-grid ${blogVisible ? 'shivam-stack-homepage-revealed' : ''}`}>
            {BLOG_POSTS.map((post, i) => (
              <div key={i} className="shivam-stack-homepage-blog-card" style={{ '--blog-color': post.color, animationDelay: `${i * 0.12}s` }}>
                <div className="shivam-stack-homepage-blog-card-top">
                  <span className="shivam-stack-homepage-blog-tag">{post.tag}</span>
                  <span className="shivam-stack-homepage-blog-date">{post.date}</span>
                </div>
                <h3 className="shivam-stack-homepage-blog-title">{post.title}</h3>
                <p className="shivam-stack-homepage-blog-desc">{post.desc}</p>
                <div className="shivam-stack-homepage-blog-footer">
                  <span className="shivam-stack-homepage-blog-read-time"><Clock size={12} /> {post.readTime}</span>
                  <Link to="/blog" className="shivam-stack-homepage-blog-link">Read More <ArrowRight size={13} /></Link>
                </div>
              </div>
            ))}
          </div>
          <div className="shivam-stack-homepage-section-cta">
            <Link to="/blog" className="shivam-stack-homepage-btn-ghost">View All Posts <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ── AVAILABILITY WIDGET ────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-availability-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-availability-card">
            <div className="shivam-stack-homepage-availability-left">
              <div className="shivam-stack-homepage-availability-status">
                <span className="shivam-stack-homepage-availability-dot" />
                <span>Currently Available for Work</span>
              </div>
              <h3 className="shivam-stack-homepage-availability-title">Only {AVAILABILITY.slots} Client Slots Open This Month</h3>
              <p className="shivam-stack-homepage-availability-desc">I deliberately limit my client load to guarantee full attention to every project. Spots fill fast — don't wait.</p>
            </div>
            <div className="shivam-stack-homepage-availability-right">
              <div className="shivam-stack-homepage-availability-slots">
                <div className="shivam-stack-homepage-availability-slot-bar">
                  <div className="shivam-stack-homepage-availability-slot-fill" style={{ width: `${(AVAILABILITY.slots / 4) * 100}%` }} />
                </div>
                <span>{AVAILABILITY.slots} of 4 slots remaining</span>
              </div>
              <button className="shivam-stack-homepage-btn-primary" onClick={() => scrollTo('section-contact')}>
                Book a Call Now <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 18. FAQ ───────────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-faq-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-section-header">
            <span className="shivam-stack-homepage-section-label">FAQ</span>
            <h2 className="shivam-stack-homepage-section-title">Common Questions</h2>
            <p className="shivam-stack-homepage-section-desc">Everything you want to know before we start working together.</p>
          </div>
          <div className="shivam-stack-homepage-faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`shivam-stack-homepage-faq-item ${openFaq === i ? 'shivam-stack-homepage-faq-open' : ''}`}>
                <button className="shivam-stack-homepage-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="shivam-stack-homepage-faq-chevron">
                    {openFaq === i ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div className="shivam-stack-homepage-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 19. STRONG CTA ────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-cta-section" id="section-contact">
        <div className="shivam-stack-homepage-cta-bg">
          <div className="shivam-stack-homepage-cta-orb-1" />
          <div className="shivam-stack-homepage-cta-orb-2" />
        </div>
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-cta-inner">
            <span className="shivam-stack-homepage-section-label">Let's Build</span>
            <h2 className="shivam-stack-homepage-cta-title">
              Ready to Build Something<br />
              <span className="shivam-stack-homepage-hero-gradient-text">Extraordinary?</span>
            </h2>
            <p className="shivam-stack-homepage-cta-desc">
              Tell me about your project. I'll respond within 24 hours with a tailored plan and honest pricing. No sales pitch, just a real conversation.
            </p>
            <div className="shivam-stack-homepage-cta-buttons">
              <a href="mailto:shivam@example.com" className="shivam-stack-homepage-btn-primary shivam-stack-homepage-cta-primary-btn">
                <Mail size={16} /> Email Me Directly
              </a>
              <a href="https://calendly.com" target="_blank" rel="noreferrer" className="shivam-stack-homepage-btn-secondary">
                <Phone size={16} /> Book a Free Call
              </a>
            </div>
            <div className="shivam-stack-homepage-cta-trust">
              {['Free Consultation', 'Response in 24h', 'No Commitment', 'Fixed Pricing'].map((t) => (
                <span key={t} className="shivam-stack-homepage-cta-trust-item">
                  <CheckCircle size={13} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 20. NEWSLETTER ────────────────────────────────────────── */}
      <section className="shivam-stack-homepage-section shivam-stack-homepage-newsletter-section">
        <div className="shivam-stack-homepage-container">
          <div className="shivam-stack-homepage-newsletter-card">
            <div className="shivam-stack-homepage-newsletter-left">
              <div className="shivam-stack-homepage-newsletter-icon"><Send size={24} /></div>
              <h3 className="shivam-stack-homepage-newsletter-title">Join 3,000+ Developers</h3>
              <p className="shivam-stack-homepage-newsletter-desc">
                Weekly insights on MERN stack, architecture patterns, freelancing tips, and exclusive deals on my products. No spam, ever.
              </p>
              <div className="shivam-stack-homepage-newsletter-benefits">
                {['Weekly tutorials', 'Free resources', 'Exclusive discounts', 'Career tips'].map((b) => (
                  <span key={b}><CheckCircle size={12} /> {b}</span>
                ))}
              </div>
            </div>
            <div className="shivam-stack-homepage-newsletter-right">
              <form className="shivam-stack-homepage-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="shivam-stack-homepage-newsletter-field">
                  <Mail size={15} className="shivam-stack-homepage-newsletter-field-icon" />
                  <input
                    className="shivam-stack-homepage-newsletter-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address"
                  />
                </div>
                <button type="submit" className="shivam-stack-homepage-btn-primary shivam-stack-homepage-newsletter-btn">
                  Subscribe Free <ArrowRight size={15} />
                </button>
                <p className="shivam-stack-homepage-newsletter-privacy">No spam. Unsubscribe anytime.</p>
              </form>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
};

export default Homepage;