import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const FullStackDevelopment = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('frontend');
  const [openFaq, setOpenFaq] = useState(null);

  const techTabs = {
    frontend: {
      label: 'Frontend',
      items: [
        { icon: '⚛️', name: 'React.js', desc: 'Component-based UI with hooks, context, and modern patterns' },
        { icon: '▲', name: 'Next.js', desc: 'SSR, SSG, ISR — full SEO + performance powerhouse' },
        { icon: '🌀', name: 'Redux Toolkit', desc: 'Predictable state management at scale' },
        { icon: '🎨', name: 'Tailwind CSS', desc: 'Utility-first styling, pixel-perfect in no time' },
        { icon: '📘', name: 'TypeScript', desc: 'Type-safe code that scales without breaking' },
        { icon: '⚡', name: 'Vite', desc: 'Lightning-fast dev server and optimized builds' },
      ],
    },
    backend: {
      label: 'Backend',
      items: [
        { icon: '🟩', name: 'Node.js', desc: 'Non-blocking, event-driven server runtime' },
        { icon: '🚂', name: 'Express.js', desc: 'Minimal, flexible, production-proven framework' },
        { icon: '🔷', name: 'GraphQL', desc: 'Efficient data fetching with precise queries' },
        { icon: '🔌', name: 'Socket.io', desc: 'Real-time bidirectional event-based communication' },
        { icon: '🛂', name: 'Passport.js', desc: 'Flexible authentication middleware' },
        { icon: '✔️', name: 'Zod / Joi', desc: 'Schema validation — bulletproof input handling' },
      ],
    },
    database: {
      label: 'Database',
      items: [
        { icon: '🍃', name: 'MongoDB', desc: 'Flexible document storage for modern apps' },
        { icon: '🐘', name: 'PostgreSQL', desc: 'Rock-solid relational DB for complex data' },
        { icon: '🔥', name: 'Redis', desc: 'In-memory caching and pub/sub messaging' },
        { icon: '📀', name: 'Mongoose', desc: 'Elegant MongoDB object modeling' },
        { icon: '🔷', name: 'Prisma', desc: 'Next-gen ORM with type safety built-in' },
        { icon: '🟢', name: 'Supabase', desc: 'Open-source Firebase alternative with PostgreSQL' },
      ],
    },
  };

  const features = [
    {
      icon: '🏗️',
      title: 'Architecture Design',
      desc: 'Before writing a single line of code, I design your system architecture. Database schemas, API contracts, component hierarchy, state management patterns — everything planned and documented so your team can understand and extend the codebase.',
    },
    {
      icon: '🔐',
      title: 'Auth & Security',
      desc: 'JWT tokens, refresh token rotation, OAuth2 social logins (Google, GitHub, LinkedIn), RBAC permissions, OWASP hardening, helmet.js, rate limiting, CSRF protection, and input sanitization — security is never an afterthought.',
    },
    {
      icon: '📡',
      title: 'Real-Time Features',
      desc: 'Live chat systems, real-time notifications, collaborative editing, live dashboards with Socket.io and WebSockets. Users see changes instantly without refreshing.',
    },
    {
      icon: '📁',
      title: 'File Management',
      desc: 'Image/video/document uploads with Multer, S3/Cloudinary integration, automatic image compression and format conversion (WebP), CDN delivery, and secure presigned URL access.',
    },
    {
      icon: '✉️',
      title: 'Email & Notifications',
      desc: 'Transactional emails with Nodemailer/SendGrid — welcome emails, password resets, order confirmations. Push notifications and in-app notification systems.',
    },
    {
      icon: '📊',
      title: 'Analytics & Monitoring',
      desc: 'Google Analytics, custom event tracking, error monitoring with Sentry, performance monitoring, and business dashboards that surface real insights from your data.',
    },
  ];

  const deliverables = [
    'Complete source code with full Git history',
    'Database schema documentation with ER diagrams',
    'Swagger / OpenAPI documentation for all endpoints',
    'README with setup, deployment, and architecture notes',
    'Environment variable documentation (.env.example)',
    'Unit & integration tests with coverage reports',
    'CI/CD pipeline configuration (GitHub Actions)',
    'Docker setup for consistent dev and production environments',
    'Performance audit report (Lighthouse)',
    '30 days of post-launch bug-fix support',
  ];

  const projects = [
    { title: 'SaaS Dashboard Platform', stack: 'React + Node + MongoDB + Redis', duration: '8 weeks', type: 'SaaS' },
    { title: 'E-Learning Platform', stack: 'Next.js + Express + PostgreSQL', duration: '10 weeks', type: 'EdTech' },
    { title: 'Real-Time Chat App', stack: 'React + Node + Socket.io + MongoDB', duration: '4 weeks', type: 'Comm' },
    { title: 'Multi-Vendor Marketplace', stack: 'MERN + Stripe + Cloudinary', duration: '12 weeks', type: 'E-com' },
    { title: 'Healthcare Portal', stack: 'React + Node + PostgreSQL + JWT', duration: '9 weeks', type: 'Health' },
    { title: 'Social Media Platform', stack: 'MERN + Socket.io + S3', duration: '14 weeks', type: 'Social' },
  ];

  const faqs = [
    { q: 'What does "full stack" mean for my project?', a: 'It means I handle everything — frontend UI, backend API, database, authentication, file storage, email services, and deployment. You get a single developer accountable for the entire product, with no gaps between teams.' },
    { q: 'Can you work with my existing tech stack?', a: 'Yes. If you already have a React frontend or a Node backend, I can work with it. I\'ll audit the existing code, document the architecture, and build new features that fit naturally.' },
    { q: 'How do you handle database migrations?', a: 'For MongoDB I use migration scripts tracked in Git. For PostgreSQL/relational databases I use Prisma Migrate or Flyway with versioned migration files. All migrations are tested in staging before production.' },
    { q: 'Do you write tests?', a: 'Yes — unit tests with Jest, integration tests for APIs with Supertest, and end-to-end tests with Playwright for critical user flows. Coverage reports are included in every delivery.' },
    { q: 'What happens if something breaks after launch?', a: 'All projects include 30 days of free bug-fix support after launch. For ongoing needs, I offer monthly maintenance retainers. I also monitor error logs and will proactively alert you to issues.' },
    { q: 'Can you build a mobile app too?', a: 'I specialize in web applications (React, Next.js, PWAs). For native mobile, I can build React Native apps that share code with the web frontend, giving you iOS + Android + Web from one codebase.' },
  ];

  const processSteps = [
    { num: '01', icon: '🗺️', title: 'Requirements Analysis', desc: 'Deep dive into your business goals, user flows, and technical requirements. I create detailed wireframes and a feature specification document.' },
    { num: '02', icon: '🏗️', title: 'System Architecture', desc: 'Database schema design, API contract definition, component architecture, state management strategy, and infrastructure planning.' },
    { num: '03', icon: '🎨', title: 'UI/UX Design', desc: 'High-fidelity designs in Figma. Every screen, every interaction, every edge case — designed before a single line of code.' },
    { num: '04', icon: '⚙️', title: 'Parallel Development', desc: 'Frontend and backend developed simultaneously in weekly sprints. You get working demos every Friday.' },
    { num: '05', icon: '🧪', title: 'Testing & QA', desc: 'Unit tests, integration tests, E2E tests, performance audits, security scans, and cross-browser/device testing.' },
    { num: '06', icon: '🚀', title: 'Deployment & Launch', desc: 'Production deployment with CI/CD, monitoring setup, SSL configuration, domain pointing, and final handoff with full documentation.' },
  ];

  const codeSnippet = [
    { type: 'comment', text: '// Full Stack Project Structure — Shivam Stack' },
    { type: 'keyword', text: 'const', extra: ' project = {' },
    { type: 'property', text: '  frontend:', extra: ' {' },
    { type: 'string', text: '    framework: "React + Vite + TypeScript",' },
    { type: 'string', text: '    state: "Redux Toolkit + React Query",' },
    { type: 'string', text: '    styling: "Tailwind CSS + Framer Motion",' },
    { type: 'property', text: '  },' },
    { type: 'property', text: '  backend:', extra: ' {' },
    { type: 'string', text: '    runtime: "Node.js + Express.js",' },
    { type: 'string', text: '    auth: "JWT + Passport OAuth2",' },
    { type: 'string', text: '    realtime: "Socket.io",' },
    { type: 'property', text: '  },' },
    { type: 'property', text: '  database:', extra: ' {' },
    { type: 'string', text: '    primary: "MongoDB + Mongoose",' },
    { type: 'string', text: '    cache: "Redis",' },
    { type: 'string', text: '    files: "AWS S3 + Cloudinary",' },
    { type: 'property', text: '  },' },
    { type: 'function', text: '  quality: 95', extra: '+ Lighthouse ✓' },
    { type: 'keyword', text: '};' },
  ];

  return (
    <div className={`shivam-stack-page ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ── HERO ── */}
      <section className="shivam-stack-hero-wrapper">
        <div className="shivam-stack-hero-bg-orb shivam-stack-hero-bg-orb--1" />
        <div className="shivam-stack-hero-bg-orb shivam-stack-hero-bg-orb--2" />
        <div className="shivam-stack-hero-bg-orb shivam-stack-hero-bg-orb--3" />
        <div className="shivam-stack-hero-grid-lines" />

        <div className="shivam-stack-container">
          <div className="shivam-stack-hero-content">
            {/* Left */}
            <div className="shivam-stack-hero-left">
              <a href="/services" className="shivam-stack-fsd-breadcrumb">← All Services</a>
              <span className="shivam-stack-hero-badge">
                <span className="shivam-stack-hero-badge-dot" />
                Full Stack Development
              </span>
              <h1 className="shivam-stack-hero-title">
                Complete Web Apps{' '}
                <span className="shivam-stack-hero-title-gradient">Built End-to-End</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                From database architecture to pixel-perfect UI — I build complete, production-ready MERN stack applications that scale. One developer. Zero gaps. Full accountability.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Start Your Project</a>
                <a href="#fsd-process" className="shivam-stack-btn shivam-stack-btn--secondary">See My Process →</a>
              </div>
              <div className="shivam-stack-fsd-hero-stats">
                {[
                  { num: '50+', label: 'Apps Delivered' },
                  { num: '4+', label: 'Years MERN' },
                  { num: '95+', label: 'Lighthouse Score' },
                ].map((s, i) => (
                  <div key={i} className="shivam-stack-fsd-hero-stat">
                    <div className="shivam-stack-fsd-hero-stat-num">{s.num}</div>
                    <div className="shivam-stack-fsd-hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Code Window */}
            <div className="shivam-stack-hero-visual">
              <div className="shivam-stack-hero-visual-inner">
                <div className="shivam-stack-code-window">
                  <div className="shivam-stack-code-window-header">
                    <div className="shivam-stack-code-dot shivam-stack-code-dot--red" />
                    <div className="shivam-stack-code-dot shivam-stack-code-dot--yellow" />
                    <div className="shivam-stack-code-dot shivam-stack-code-dot--green" />
                    <span style={{ marginLeft: '0.75rem', fontFamily: 'var(--ss-font-mono)', fontSize: '0.72rem', color: '#8b949e' }}>project.config.js</span>
                  </div>
                  <div className="shivam-stack-code-body">
                    {codeSnippet.map((line, i) => (
                      <div key={i}>
                        {line.type === 'comment' && <span className="shivam-stack-code-comment">{line.text}</span>}
                        {line.type === 'keyword' && <span><span className="shivam-stack-code-keyword">{line.text}</span><span style={{ color: '#e6edf3' }}>{line.extra}</span></span>}
                        {line.type === 'property' && <span style={{ color: '#7dd3fc' }}>{line.text}{line.extra || ''}</span>}
                        {line.type === 'string' && <span className="shivam-stack-code-string">{line.text}</span>}
                        {line.type === 'function' && <span><span className="shivam-stack-code-function">{line.text}</span><span style={{ color: '#10b981' }}> {line.extra}</span></span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--2">
                  <span className="shivam-stack-floating-badge-icon">⚡</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">Delivered in Sprints</div>
                    <div className="shivam-stack-floating-badge-sub">Weekly demos</div>
                  </div>
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--1">
                  <span className="shivam-stack-floating-badge-icon">🔒</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">OWASP Secured</div>
                    <div className="shivam-stack-floating-badge-sub">Security first</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT I BUILD ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// what i build</div>
            <h2 className="shivam-stack-section-title">The Full Picture</h2>
            <p className="shivam-stack-section-desc">Full stack doesn't mean frontend + backend bolted together. It means a cohesive system where every layer is designed to work in harmony.</p>
          </div>

          <div className="shivam-stack-fsd-layers">
            {[
              { layer: 'UI Layer', icon: '🎨', color: 'var(--ss-accent-primary)', items: ['React Components', 'State Management', 'Routing', 'Animations', 'Responsive Design'] },
              { layer: 'API Layer', icon: '🔌', color: 'var(--ss-accent-secondary)', items: ['REST / GraphQL', 'Authentication', 'Validation', 'Rate Limiting', 'Error Handling'] },
              { layer: 'Business Logic', icon: '⚙️', color: 'var(--ss-accent-tertiary)', items: ['Services', 'Middleware', 'Caching', 'Queue Jobs', 'Webhooks'] },
              { layer: 'Data Layer', icon: '🗄️', color: 'var(--ss-accent-green)', items: ['MongoDB', 'PostgreSQL', 'Redis Cache', 'File Storage', 'Backups'] },
            ].map((l, i) => (
              <div key={i} className="shivam-stack-fsd-layer-card" style={{ '--layer-color': l.color }}>
                <div className="shivam-stack-fsd-layer-header">
                  <span className="shivam-stack-fsd-layer-icon">{l.icon}</span>
                  <span className="shivam-stack-fsd-layer-name">{l.layer}</span>
                </div>
                <div className="shivam-stack-fsd-layer-items">
                  {l.items.map((item, j) => (
                    <span key={j} className="shivam-stack-fsd-layer-item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK TABS ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// my arsenal</div>
            <h2 className="shivam-stack-section-title">Battle-Tested Tech Stack</h2>
            <p className="shivam-stack-section-desc">Every tool chosen for a reason — performance, developer experience, and long-term maintainability.</p>
          </div>

          <div className="shivam-stack-tabs-nav">
            {Object.entries(techTabs).map(([key, tab]) => (
              <button key={key} className={`shivam-stack-tab-btn ${activeTab === key ? 'shivam-stack-tab-btn--active' : ''}`} onClick={() => setActiveTab(key)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="shivam-stack-fsd-tech-grid">
            {techTabs[activeTab].items.map((item, i) => (
              <div key={i} className="shivam-stack-fsd-tech-card">
                <span className="shivam-stack-fsd-tech-icon">{item.icon}</span>
                <div className="shivam-stack-fsd-tech-name">{item.name}</div>
                <div className="shivam-stack-fsd-tech-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// included in every project</div>
            <h2 className="shivam-stack-section-title">What You Always Get</h2>
            <p className="shivam-stack-section-desc">These aren't add-ons. They're built into every full stack project I deliver.</p>
          </div>

          <div className="shivam-stack-grid-3">
            {features.map((f, i) => (
              <div key={i} className="shivam-stack-highlight-box">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <div className="shivam-stack-card-title">{f.title}</div>
                <div className="shivam-stack-card-text">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT SHOWCASE ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// proof of work</div>
            <h2 className="shivam-stack-section-title">Projects I've Shipped</h2>
            <p className="shivam-stack-section-desc">Real apps for real clients. Each one battle-tested in production.</p>
          </div>

          <div className="shivam-stack-fsd-projects-grid">
            {projects.map((p, i) => (
              <div key={i} className="shivam-stack-fsd-project-card">
                <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--landscape">
                  <div className="shivam-stack-img-placeholder">
                    <span className="shivam-stack-img-placeholder-icon">🖼️</span>
                    <span className="shivam-stack-img-placeholder-text">{p.title}</span>
                  </div>
                </div>
                <div className="shivam-stack-fsd-project-info">
                  <div className="shivam-stack-fsd-project-type">{p.type}</div>
                  <div className="shivam-stack-fsd-project-title">{p.title}</div>
                  <div className="shivam-stack-fsd-project-stack">{p.stack}</div>
                  <div className="shivam-stack-fsd-project-duration">⏱ {p.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }} id="fsd-process">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// how it works</div>
            <h2 className="shivam-stack-section-title">From Idea to Launch</h2>
            <p className="shivam-stack-section-desc">My structured 6-step process ensures nothing falls through the cracks.</p>
          </div>

          <div className="shivam-stack-grid-2" style={{ gap: 'clamp(2rem, 4vw, 4rem)' }}>
            <div className="shivam-stack-process-list">
              {processSteps.slice(0, 3).map((step, i) => (
                <div key={i} className="shivam-stack-process-item">
                  <div className="shivam-stack-process-number">{step.num}</div>
                  <div className="shivam-stack-process-content">
                    <div className="shivam-stack-process-title">{step.icon} {step.title}</div>
                    <div className="shivam-stack-process-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="shivam-stack-process-list">
              {processSteps.slice(3).map((step, i) => (
                <div key={i} className="shivam-stack-process-item">
                  <div className="shivam-stack-process-number">{step.num}</div>
                  <div className="shivam-stack-process-content">
                    <div className="shivam-stack-process-title">{step.icon} {step.title}</div>
                    <div className="shivam-stack-process-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DELIVERABLES ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-fsd-deliverables-wrap">
            <div>
              <div className="shivam-stack-section-label">// what you receive</div>
              <h2 className="shivam-stack-section-title">Every Deliverable, Documented</h2>
              <p className="shivam-stack-section-desc" style={{ marginBottom: '2rem' }}>When the project ships, you get more than just code. You get everything you need to maintain, scale, and hand off to any developer.</p>
              <div className="shivam-stack-fsd-deliverables-list">
                {deliverables.map((item, i) => (
                  <div key={i} className="shivam-stack-fsd-deliverable-item">
                    <span className="shivam-stack-fsd-deliverable-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--auto" style={{ minHeight: 400 }}>
              <div className="shivam-stack-img-placeholder">
                <span className="shivam-stack-img-placeholder-icon">📦</span>
                <span className="shivam-stack-img-placeholder-text">Project Deliverables Overview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// investment</div>
            <h2 className="shivam-stack-section-title">Transparent Pricing</h2>
            <p className="shivam-stack-section-desc">No hidden charges. No surprises. Scope agreed upfront, price fixed.</p>
          </div>

          <div className="shivam-stack-grid-3">
            {[
              {
                plan: 'Starter', price: '₹25,000', note: 'Fixed price', featured: false,
                features: ['Up to 5 pages / screens', 'React + Node + MongoDB', 'JWT Authentication', 'REST API (10 endpoints)', 'Basic admin panel', 'Mobile responsive', '2 weeks delivery', '15 days support'],
              },
              {
                plan: 'Professional', price: '₹65,000', note: 'Fixed price', featured: true,
                features: ['Up to 15 pages / screens', 'Full MERN + TypeScript', 'OAuth + RBAC Auth', 'REST + GraphQL API', 'Advanced admin dashboard', 'Real-time features', 'File upload (S3)', 'Email integration', '5 weeks delivery', '30 days support'],
              },
              {
                plan: 'Enterprise', price: 'Custom', note: 'Per project scope', featured: false,
                features: ['Unlimited scope', 'Microservices architecture', 'Multi-tenant support', 'Advanced security audit', 'Load testing & optimization', 'CI/CD + Docker + AWS', 'SLA guarantee', 'Dedicated support'],
              },
            ].map((tier, i) => (
              <div key={i} className={`shivam-stack-pricing-card ${tier.featured ? 'shivam-stack-pricing-card--featured' : ''}`}>
                {tier.featured && <div className="shivam-stack-pricing-badge">Most Popular</div>}
                <div className="shivam-stack-pricing-plan">{tier.plan}</div>
                <div className="shivam-stack-pricing-price">{tier.price}</div>
                <div className="shivam-stack-pricing-price-note">{tier.note}</div>
                <div className="shivam-stack-pricing-divider" />
                <ul className="shivam-stack-pricing-features">
                  {tier.features.map((f, j) => (
                    <li key={j} className="shivam-stack-pricing-feature-item">
                      <span className="shivam-stack-pricing-check">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="/contact" className={`shivam-stack-btn ${tier.featured ? 'shivam-stack-btn--primary' : 'shivam-stack-btn--secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  Get Started →
                </a>
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
            <h2 className="shivam-stack-section-title">Frequently Asked</h2>
          </div>
          <div className="shivam-stack-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="shivam-stack-faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="shivam-stack-faq-question">
                  <span>{faq.q}</span>
                  <span className="shivam-stack-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && <div className="shivam-stack-faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="shivam-stack-container">
        <div className="shivam-stack-cta-section">
          <h2 className="shivam-stack-cta-title">Ready to Build Your <span className="shivam-stack-hero-title-gradient">Full Stack App?</span></h2>
          <p className="shivam-stack-cta-desc">Book a free 30-minute discovery call. We'll discuss your requirements and I'll give you a detailed proposal within 24 hours.</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Book Free Call</a>
            <a href="/portfolio" className="shivam-stack-btn shivam-stack-btn--secondary">View My Work →</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FullStackDevelopment;