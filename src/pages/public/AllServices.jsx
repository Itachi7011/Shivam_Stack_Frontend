import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const AllServices = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  const services = [
    {
      emoji: '⚡',
      title: 'Full Stack Development',
      desc: 'End-to-end MERN stack web applications — from database architecture to pixel-perfect frontends. React, Node.js, MongoDB, Express.',
      tags: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: '/services/full-stack',
      iconClass: '',
    },
    {
      emoji: '🛡️',
      title: 'Admin Panels & CMS',
      desc: 'Custom dashboards, content management systems, role-based access control, analytics, and real-time data tables.',
      tags: ['Dashboard', 'RBAC', 'Analytics', 'CMS'],
      link: '/services/admin-panels',
      iconClass: 'shivam-stack-card-icon--purple',
    },
    {
      emoji: '🚀',
      title: 'Performance Optimization',
      desc: 'Lighthouse 95+ scores, lazy loading, code splitting, Redis caching, CDN setup, and Core Web Vitals mastery.',
      tags: ['Lighthouse', 'Redis', 'CDN', 'Web Vitals'],
      link: '/services/performance',
      iconClass: 'shivam-stack-card-icon--gold',
    },
    {
      emoji: '☁️',
      title: 'DevOps & Deployment',
      desc: 'CI/CD pipelines, Docker containers, AWS/GCP hosting, Nginx config, SSL, and zero-downtime deployments.',
      tags: ['Docker', 'AWS', 'CI/CD', 'Nginx'],
      link: '/services/devops',
      iconClass: 'shivam-stack-card-icon--green',
    },
    {
      emoji: '🛒',
      title: 'E-Commerce Solutions',
      desc: 'Full-featured online stores with payment gateways, inventory, cart, wishlist, coupons, and Stripe/Razorpay integration.',
      tags: ['Stripe', 'Cart', 'Razorpay', 'Inventory'],
      link: '/services/ecommerce',
      iconClass: '',
    },
    {
      emoji: '🔌',
      title: 'API Development',
      desc: 'RESTful and GraphQL APIs, JWT auth, rate limiting, Swagger docs, webhook integrations, and third-party API connections.',
      tags: ['REST', 'GraphQL', 'JWT', 'Swagger'],
      link: '/services/api',
      iconClass: 'shivam-stack-card-icon--purple',
    },
    {
      emoji: '💼',
      title: 'Portfolio Websites',
      desc: 'Stunning developer and business portfolios with 3D animations, custom domains, dark mode, and blog integration.',
      tags: ['3D Design', 'Animations', 'Blog', 'Dark Mode'],
      link: '/services/portfolio',
      iconClass: 'shivam-stack-card-icon--gold',
    },
    {
      emoji: '🔧',
      title: 'Maintenance & Support',
      desc: 'Ongoing bug fixes, security patches, dependency updates, feature additions, and 24/7 monitoring for live projects.',
      tags: ['Bug Fixes', 'Security', 'Updates', 'Monitoring'],
      link: '/services/maintenance',
      iconClass: 'shivam-stack-card-icon--green',
    },

  ];

const techStack = [
  // Core
  { icon: '⚛️', name: 'React.js' },
  { icon: '🟩', name: 'Node.js' },
  { icon: '🍃', name: 'MongoDB' },
  { icon: '🚂', name: 'Express.js' },
  { icon: '📘', name: 'TypeScript' },
  { icon: '🐳', name: 'Docker' },
  { icon: '☁️', name: 'AWS' },
  { icon: '🔥', name: 'Redis' },
  { icon: '🔷', name: 'GraphQL' },
  { icon: '🐙', name: 'GitHub' },
  { icon: '▲', name: 'Vercel' },
  { icon: '🐘', name: 'PostgreSQL' },
  { icon: '🎨', name: 'Tailwind CSS' },
  { icon: '⚡', name: 'Vite' },
  { icon: '🔒', name: 'JWT/OAuth' },

  // Frontend
  { icon: '▲', name: 'Next.js' },
  { icon: '🌀', name: 'Redux Toolkit' },
  { icon: '🔄', name: 'React Query' },
  { icon: '📋', name: 'React Hook Form' },
  { icon: '🟦', name: 'Material UI' },
  { icon: '💖', name: 'Styled Components' },
  { icon: '🅱️', name: 'Bootstrap' },
  { icon: '💅', name: 'Sass' },

  // Backend
  { icon: '🔐', name: 'JWT' },
  { icon: '🧂', name: 'Bcrypt' },
  { icon: '🔌', name: 'Socket.io' },
  { icon: '🛂', name: 'Passport.js' },
  { icon: '✔️', name: 'Zod' },
  { icon: '📐', name: 'Joi' },
  { icon: '✉️', name: 'Nodemailer' },

  // Database / ORM
  { icon: '📀', name: 'Mongoose' },
  { icon: '🔷', name: 'Prisma' },
  { icon: '🟢', name: 'Supabase' },

  // Languages
  { icon: '🟨', name: 'JavaScript' },
  { icon: '🗄️', name: 'SQL' },
  { icon: '💻', name: 'Bash' },

  // API / Tools
  { icon: '🚀', name: 'Apollo Server' },
  { icon: '📡', name: 'Axios' },
  { icon: '📮', name: 'Postman' },

  // DevOps
  { icon: '🌿', name: 'Git' },
  { icon: '⚙️', name: 'GitHub Actions' },
  { icon: '🟢', name: 'Nginx' },
  { icon: '♻️', name: 'PM2' },
  { icon: '🐧', name: 'Linux' },

  // Cloud
  { icon: '🚀', name: 'Render' },
  { icon: '🔥', name: 'Firebase' },
  { icon: '🌊', name: 'DigitalOcean' },
  { icon: '🚂', name: 'Railway' },

  // Payments
  { icon: '💳', name: 'Stripe' },
  { icon: '💠', name: 'Razorpay' },

  // Build Tools
  { icon: '📦', name: 'Webpack' },
  { icon: '🔶', name: 'Babel' },
  { icon: '🧹', name: 'ESLint' },
  { icon: '✨', name: 'Prettier' },
];

  const whyPoints = [
    { icon: '🎯', title: 'Pixel-Perfect Quality', desc: 'Every UI element is crafted with meticulous attention to detail — spacing, typography, animation timing.' },
    { icon: '⚡', title: 'Blazing Fast Delivery', desc: 'I follow Agile sprints. You get working deliverables every week, not at the end of the project.' },
    { icon: '🔒', title: 'Security First', desc: 'OWASP top 10 hardening, helmet.js, rate limiting, input validation, and JWT best practices built-in.' },
    { icon: '📱', title: 'Mobile-First Always', desc: 'All apps are fully responsive. Tested on 15+ screen sizes from 320px to 4K monitors.' },
    { icon: '📖', title: 'Clean, Documented Code', desc: 'JSDoc comments, README files, inline documentation, and Swagger API docs for every project.' },
    { icon: '🤝', title: 'Long-term Partnership', desc: 'I do not disappear after launch. Ongoing support, updates, and feature additions whenever you need.' },
  ];

  const processSteps = [
    { num: '01', title: 'Discovery & Scoping', desc: 'We discuss your requirements, timeline, and tech stack. I create a detailed scope document.' },
    { num: '02', title: 'Architecture & Planning', desc: 'Database schema, system design diagrams, component hierarchy, and API structure finalized.' },
    { num: '03', title: 'Development Sprints', desc: 'Weekly sprints with demos. Frontend, backend, and database developed in parallel where possible.' },
    { num: '04', title: 'Testing & QA', desc: 'Unit tests, integration tests, E2E tests with Playwright, performance audits, and security scans.' },
    { num: '05', title: 'Deployment & Go-Live', desc: 'Configured CI/CD, Docker deployment, domain setup, SSL, and monitored launch.' },
    { num: '06', title: 'Maintenance & Growth', desc: 'Post-launch support, feature additions, performance monitoring, and analytics setup.' },
  ];

  const faqs = [
    { q: 'How long does a full-stack project typically take?', a: 'It depends on complexity. A simple MERN app takes 2–4 weeks. A full e-commerce platform with admin panel can take 6–12 weeks. I will give you an accurate timeline after our discovery call.' },
    { q: 'Do you work on existing codebases or only new projects?', a: 'Both! I regularly take on legacy code refactoring, bug fixing, performance optimization of existing projects, and adding new features to live applications.' },
    { q: 'What payment methods do you accept?', a: 'UPI, bank transfer, PayPal, and Razorpay. I usually work on 50% upfront and 50% on completion, with milestones for larger projects.' },
    { q: 'Can you sign an NDA for my project?', a: 'Absolutely. I sign NDAs before any sensitive discussion. Your business idea, source code, and data remain fully confidential.' },
    { q: 'Do you provide post-launch support?', a: 'Yes. All projects include 30 days of free bug-fix support. I also offer monthly maintenance retainers at flexible rates.' },
    { q: 'What if I need changes mid-project?', a: 'Minor scope adjustments are handled gracefully. For larger changes, we revise the scope document and timeline together — no hidden charges.' },
  ];

  const detailedServices = [
    {
      icon: '⚡',
      title: 'Full Stack Development',
      detail: 'I build complete web applications from scratch using the MERN stack. This includes database modeling in MongoDB, building RESTful/GraphQL APIs in Node.js/Express, and creating interactive UIs in React with state management (Redux Toolkit / Zustand). I handle authentication (JWT, OAuth, sessions), file uploads (S3/Cloudinary), email services (Nodemailer/SendGrid), and real-time features with Socket.io.',
    },
    {
      icon: '🛡️',
      title: 'Admin Panels & CMS',
      detail: 'Custom-built admin dashboards tailored to your business. Not just generic templates — actual panels with role-based access, dynamic data tables with sorting/filtering/export, real-time charts (Chart.js/Recharts), user management, content moderation, inventory management, and order tracking. I can also integrate headless CMS like Sanity or Strapi.',
    },
    {
      icon: '🚀',
      title: 'Performance Optimization',
      detail: 'Is your site slow? I can help. Services include code splitting with dynamic imports, image optimization with WebP/AVIF, tree shaking, bundle analysis, lazy loading routes and components, Redis caching for API responses, database query optimization with indexes, CDN configuration (Cloudflare), and achieving Lighthouse scores above 95 for Performance, SEO, Accessibility, and Best Practices.',
    },
    {
      icon: '☁️',
      title: 'DevOps & Deployment',
      detail: 'I set up complete deployment infrastructure: Docker containers with multi-stage builds, GitHub Actions CI/CD pipelines, AWS EC2/ECS or Railway/Render hosting, Nginx reverse proxy configuration, SSL certificates with Let\'s Encrypt, environment variable management, database backups to S3, and monitoring with Uptime Kuma or similar tools.',
    },
    {
      icon: '🛒',
      title: 'E-Commerce Solutions',
      detail: 'Full e-commerce platforms with product catalog, variants, inventory tracking, shopping cart with local/session persistence, wishlist, order management, coupon and discount system, Stripe and Razorpay payment integration, order email notifications, admin dashboard with sales analytics, customer management, and shipping status updates.',
    },
    {
      icon: '🔌',
      title: 'API Development',
      detail: 'I build production-ready APIs with Express.js or Fastify — complete with JWT authentication, role-based authorization middleware, request validation (Joi/Zod), rate limiting, CORS configuration, error handling middleware, Swagger/OpenAPI documentation, webhook support, and third-party API integrations (Stripe, SendGrid, Twilio, etc.).',
    },
    {
      icon: '💼',
      title: 'Portfolio Websites',
      detail: 'I create stunning portfolio websites for developers, designers, and businesses. Features include 3D animations with Three.js/GSAP, custom cursor, smooth page transitions, dark/light mode, blog section with markdown, SEO optimization, custom domain with SSL, contact form with email delivery, and Google Analytics integration.',
    },
    {
      icon: '🔧',
      title: 'Maintenance & Support',
      detail: 'Keep your app healthy and up-to-date. Services include regular dependency updates (npm audit fix), security patch applications, database backup monitoring, uptime monitoring, performance regression checks, bug fixes, minor feature additions, code refactoring, and detailed monthly reports on your application\'s health.',
    },
  ];

  const marqueeItems = ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript', 'Docker', 'AWS', 'Redis', 'GraphQL', 'Tailwind CSS', 'Socket.io', 'JWT', 'Stripe', 'Razorpay', 'Next.js', 'PostgreSQL'];

  return (
    <div className={`shivam-stack-page ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ── HERO ── */}
      <section className="shivam-stack-hero-wrapper">
        <div className="shivam-stack-hero-bg-orb shivam-stack-hero-bg-orb--1" />
        <div className="shivam-stack-hero-bg-orb shivam-stack-hero-bg-orb--2" />
        <div className="shivam-stack-hero-bg-orb shivam-stack-hero-bg-orb--3" />
        <div className="shivam-stack-hero-grid-lines" />

        <div className="shivam-stack-container">
          <div className="shivam-stack-hero-content shivam-stack-hero-content--centered">
            <div className="shivam-stack-hero-left">
              <span className="shivam-stack-hero-badge">
                <span className="shivam-stack-hero-badge-dot" />
                Available for Projects
              </span>
              <h1 className="shivam-stack-hero-title">
                Everything You Need{' '}
                <span className="shivam-stack-hero-title-gradient">Built & Deployed</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                I'm Shivam — a MERN stack developer offering end-to-end web development services. From ideation to deployment, I build fast, scalable, and beautiful digital products.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="#all-services-list" className="shivam-stack-btn shivam-stack-btn--primary">
                  ✦ Explore All Services
                </a>
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--secondary">
                  Book a Free Call →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="shivam-stack-marquee-wrapper">
        <div className="shivam-stack-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="shivam-stack-marquee-item">
              <span className="shivam-stack-marquee-sep">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-stats-row">
            {[
              { num: '50+', label: 'Projects Delivered' },
              { num: '30+', label: 'Happy Clients' },
              { num: '3+', label: 'Years Experience' },
              { num: '95+', label: 'Lighthouse Score' },
              { num: '99%', label: 'Uptime Guaranteed' },
              { num: '24h', label: 'Avg Response Time' },
            ].map((s, i) => (
              <div key={i} className="shivam-stack-stat-item">
                <div className="shivam-stack-stat-number">{s.num}</div>
                <div className="shivam-stack-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES GRID ── */}
      <section className="shivam-stack-section" id="all-services-list">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// what i offer</div>
            <h2 className="shivam-stack-section-title">All Services, One Developer</h2>
            <p className="shivam-stack-section-desc">
              No agency overhead. No miscommunication. One skilled full-stack developer who understands your vision and executes it with precision.
            </p>
          </div>

          <div className="shivam-stack-all-services-mega-grid">
            {services.map((svc, i) => (
              <a
                key={i}
                href={svc.link}
                className="shivam-stack-service-link-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="shivam-stack-service-link-card-top">
                  <div className={`shivam-stack-card-icon ${svc.iconClass}`}>
                    {svc.emoji}
                  </div>
                  <div>
                    <div className="shivam-stack-card-title" style={{ marginBottom: '0.25rem' }}>
                      {svc.title}
                    </div>
                    <div className="shivam-stack-tech-grid" style={{ marginTop: 0 }}>
                      {svc.tags.map((tag, j) => (
                        <span key={j} className="shivam-stack-tech-badge">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="shivam-stack-service-link-card-body">{svc.desc}</div>
                <div className="shivam-stack-service-link-card-footer">View Details →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── DETAILED ACCORDION ── */}
      <section className="shivam-stack-section" style={{ paddingTop: 0 }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// deep dive</div>
            <h2 className="shivam-stack-section-title">What's Included in Each Service</h2>
            <p className="shivam-stack-section-desc">
              Click any service to see the full breakdown of what you get.
            </p>
          </div>

          <div>
            {detailedServices.map((svc, i) => (
              <div
                key={i}
                className="shivam-stack-accordion-item"
                onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
              >
                <div className="shivam-stack-accordion-header">
                  <div className="shivam-stack-accordion-title">
                    <span>{svc.icon}</span>
                    {svc.title}
                  </div>
                  <span style={{ color: 'var(--ss-accent-primary)', fontSize: '1.25rem', flexShrink: 0 }}>
                    {openAccordion === i ? '−' : '+'}
                  </span>
                </div>
                {openAccordion === i && (
                  <div className="shivam-stack-accordion-body">
                    {svc.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// my arsenal</div>
            <h2 className="shivam-stack-section-title">Tech Stack I Work With</h2>
            <p className="shivam-stack-section-desc">
              Battle-tested tools and frameworks I use daily to build production-grade applications.
            </p>
          </div>

          <div className="shivam-stack-all-services-stack-row">
            {techStack.map((t, i) => (
              <div key={i} className="shivam-stack-all-services-stack-item">
                <span className="shivam-stack-all-services-stack-icon">{t.icon}</span>
                <div className="shivam-stack-all-services-stack-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ME ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-all-services-why-grid">
            {/* Left: Image */}
            <div className="shivam-stack-hero-visual-inner">
              <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--hero">
                <div className="shivam-stack-img-placeholder">
                  <span className="shivam-stack-img-placeholder-icon">🧑‍💻</span>
                  <span className="shivam-stack-img-placeholder-text">Your Image Here</span>
                </div>
              </div>
              <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--2">
                <span className="shivam-stack-floating-badge-icon">⭐</span>
                <div>
                  <div className="shivam-stack-floating-badge-text">5.0 Rating</div>
                  <div className="shivam-stack-floating-badge-sub">30+ Reviews</div>
                </div>
              </div>
            </div>

            {/* Right: Points */}
            <div>
              <div className="shivam-stack-section-label">// why me</div>
              <h2 className="shivam-stack-section-title">Why Choose Shivam Stack?</h2>
              <p className="shivam-stack-section-desc" style={{ marginBottom: '2rem' }}>
                I've worked with startups, agencies, and solo founders. Here's what sets me apart from the rest.
              </p>
              <div className="shivam-stack-grid-2" style={{ gap: '1.25rem' }}>
                {whyPoints.map((w, i) => (
                  <div key={i} className="shivam-stack-highlight-box">
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{w.icon}</div>
                    <div className="shivam-stack-card-title">{w.title}</div>
                    <div className="shivam-stack-card-text">{w.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// how it works</div>
            <h2 className="shivam-stack-section-title">My 6-Step Process</h2>
            <p className="shivam-stack-section-desc">
              Structured, transparent, and collaborative. You'll always know what's happening and what's next.
            </p>
          </div>

          <div className="shivam-stack-grid-2" style={{ gap: 'clamp(2rem, 4vw, 4rem)' }}>
            <div className="shivam-stack-process-list">
              {processSteps.slice(0, 3).map((step, i) => (
                <div key={i} className="shivam-stack-process-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="shivam-stack-process-number">{step.num}</div>
                  <div className="shivam-stack-process-content">
                    <div className="shivam-stack-process-title">{step.title}</div>
                    <div className="shivam-stack-process-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="shivam-stack-process-list">
              {processSteps.slice(3).map((step, i) => (
                <div key={i} className="shivam-stack-process-item" style={{ animationDelay: `${(i + 3) * 0.1}s` }}>
                  <div className="shivam-stack-process-number">{step.num}</div>
                  <div className="shivam-stack-process-content">
                    <div className="shivam-stack-process-title">{step.title}</div>
                    <div className="shivam-stack-process-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO IMAGE SHOWCASE ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// proof of work</div>
            <h2 className="shivam-stack-section-title">Projects I've Built</h2>
            <p className="shivam-stack-section-desc">
              A glimpse into some of the applications I've shipped for real clients.
            </p>
          </div>

          <div className="shivam-stack-portfolio-showcase-grid">
            {[
              { title: 'E-Commerce Platform', type: 'Full Stack', wide: true },
              { title: 'Admin Dashboard', type: 'React + Node', wide: false },
              { title: 'Portfolio Website', type: 'React + GSAP', wide: false },
              { title: 'REST API Suite', type: 'Node.js + MongoDB', wide: false },
              { title: 'SaaS Dashboard', type: 'MERN Stack', wide: true },
            ].map((p, i) => (
              <div
                key={i}
                className={`shivam-stack-portfolio-showcase-card ${p.wide ? 'shivam-stack-portfolio-showcase-grid-item--wide' : ''}`}
                style={{ minHeight: 240 }}
              >
                <div className="shivam-stack-img-wrapper" style={{ height: '100%', minHeight: 220 }}>
                  <div className="shivam-stack-img-placeholder">
                    <span className="shivam-stack-img-placeholder-icon">🖼️</span>
                    <span className="shivam-stack-img-placeholder-text">{p.title}</span>
                  </div>
                </div>
                <div className="shivam-stack-portfolio-showcase-overlay">
                  <div className="shivam-stack-portfolio-showcase-info">
                    <div className="shivam-stack-portfolio-showcase-title">{p.title}</div>
                    <div className="shivam-stack-portfolio-showcase-type">{p.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// client love</div>
            <h2 className="shivam-stack-section-title">What Clients Say</h2>
          </div>

          <div className="shivam-stack-grid-3">
            {[
              { text: 'Shivam delivered a complete e-commerce platform in 6 weeks. The code quality is exceptional and everything works flawlessly. Will hire again without a doubt.', name: 'Rajesh Kumar', role: 'Startup Founder' },
              { text: 'Best freelance MERN developer I\'ve worked with. He\'s proactive, communicates clearly, and his code is clean enough that my team can maintain it easily.', name: 'Sarah Mitchell', role: 'Product Manager' },
              { text: 'The admin dashboard Shivam built transformed how we manage our business. Real-time data, beautiful design, and extremely fast performance.', name: 'Amit Sharma', role: 'E-commerce Owner' },
            ].map((t, i) => (
              <div key={i} className="shivam-stack-testimonial-card">
                <div className="shivam-stack-stars">{'★★★★★'}</div>
                <div className="shivam-stack-testimonial-quote">"</div>
                <div className="shivam-stack-testimonial-text">{t.text}</div>
                <div className="shivam-stack-testimonial-author">
                  <div className="shivam-stack-testimonial-avatar">
                    <div className="shivam-stack-img-placeholder" style={{ position: 'static', width: 46, height: 46, fontSize: '1.5rem' }}>👤</div>
                  </div>
                  <div>
                    <div className="shivam-stack-testimonial-name">{t.name}</div>
                    <div className="shivam-stack-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// got questions</div>
            <h2 className="shivam-stack-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="shivam-stack-faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="shivam-stack-faq-item"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="shivam-stack-faq-question">
                  <span>{faq.q}</span>
                  <span className="shivam-stack-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <div className="shivam-stack-faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="shivam-stack-container">
        <div className="shivam-stack-cta-section">
          <h2 className="shivam-stack-cta-title">
            Ready to Build Something{' '}
            <span className="shivam-stack-hero-title-gradient">Extraordinary?</span>
          </h2>
          <p className="shivam-stack-cta-desc">
            Let's turn your idea into a fully functional, beautifully designed web application. Book a free 30-minute discovery call today.
          </p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Start a Project</a>
            <a href="/portfolio" className="shivam-stack-btn shivam-stack-btn--secondary">View My Work →</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AllServices;