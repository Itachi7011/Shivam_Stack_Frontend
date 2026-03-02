import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

// ─── API endpoint: /api/public/products (category: resource) ──────────────────────────────────
const RESOURCES_DATA = [
  // Cheat Sheets
  { id: 'r1', type: 'cheatsheet', emoji: '📋', title: 'MongoDB Aggregation Cheat Sheet', desc: 'All major aggregation pipeline stages, operators, and expressions with quick examples. $match, $group, $lookup, $project, $unwind — all in one page.', tags: ['MongoDB', 'Aggregation', 'PDF'], price: 0, downloads: '2.4k', pages: 4, updated: 'Feb 2025' },
  { id: 'r2', type: 'cheatsheet', emoji: '📋', title: 'React Hooks Reference Card', desc: 'useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, and all custom hooks with syntax and gotchas.', tags: ['React', 'Hooks', 'PDF'], price: 0, downloads: '3.1k', pages: 3, updated: 'Jan 2025' },
  { id: 'r3', type: 'cheatsheet', emoji: '📋', title: 'Express.js Middleware Cheat Sheet', desc: 'Built-in middleware, popular packages, error handling patterns, routing patterns, and request/response object reference.', tags: ['Express.js', 'Node.js', 'PDF'], price: 0, downloads: '1.8k', pages: 3, updated: 'Mar 2025' },
  { id: 'r4', type: 'cheatsheet', emoji: '📋', title: 'Git Commands Quick Reference', desc: 'All essential Git commands for branching, merging, rebasing, stashing, cherry-picking, and advanced operations — perfect to keep on your desk.', tags: ['Git', 'DevOps', 'PDF'], price: 0, downloads: '4.2k', pages: 2, updated: 'Jan 2025' },
  { id: 'r5', type: 'cheatsheet', emoji: '📋', title: 'Tailwind CSS Utility Classes Card', desc: 'Most-used Tailwind CSS classes organized by category: spacing, typography, colors, flexbox, grid, borders, shadows, and animations.', tags: ['Tailwind CSS', 'CSS', 'PDF'], price: 0, downloads: '5.1k', pages: 4, updated: 'Feb 2025' },
  { id: 'r6', type: 'cheatsheet', emoji: '📋', title: 'JWT Authentication Flow Diagram', desc: 'Visual diagram of complete JWT auth flow — registration, login, access token, refresh token, protected routes, and token expiry handling.', tags: ['JWT', 'Auth', 'Diagram'], price: 0, downloads: '2.9k', pages: 2, updated: 'Jan 2025' },
  // Roadmaps
  { id: 'r7', type: 'roadmap', emoji: '🗺️', title: 'MERN Stack Developer Roadmap 2025', desc: 'Complete learning roadmap with curated resources — from HTML/CSS basics through MongoDB, Express, React, and Node.js to deployment and job-readiness.', tags: ['MERN', 'Roadmap', 'PDF'], price: 0, downloads: '6.8k', pages: 6, updated: 'Jan 2025' },
  { id: 'r8', type: 'roadmap', emoji: '🗺️', title: 'Frontend Developer Roadmap 2025', desc: 'Comprehensive frontend learning path covering HTML, CSS, JavaScript, React, TypeScript, Next.js, performance, accessibility, and deployment.', tags: ['Frontend', 'React', 'Roadmap'], price: 0, downloads: '5.3k', pages: 5, updated: 'Feb 2025' },
  { id: 'r9', type: 'roadmap', emoji: '🗺️', title: 'Backend Developer (Node.js) Roadmap', desc: 'Full backend development roadmap: JavaScript fundamentals, Node.js, Express, databases, REST/GraphQL APIs, auth, caching, DevOps, and deployment.', tags: ['Node.js', 'Backend', 'Roadmap'], price: 0, downloads: '4.1k', pages: 5, updated: 'Mar 2025' },
  { id: 'r10', type: 'roadmap', emoji: '🗺️', title: 'Freelance Developer Career Roadmap', desc: 'Step-by-step path from building your portfolio to landing your first freelance client, pricing work, and scaling to ₹1L+/month income.', tags: ['Freelance', 'Career', 'PDF'], price: 0, downloads: '3.7k', pages: 4, updated: 'Feb 2025' },
  // Tools
  { id: 'r11', type: 'tool', emoji: '🔧', title: 'Project Price Calculator', desc: 'Spreadsheet-based calculator to estimate project costs — input hours, complexity, tech stack, revisions, and get a detailed quote breakdown.', tags: ['Excel', 'Freelance', 'Tool'], price: 0, downloads: '1.9k', pages: null, updated: 'Jan 2025' },
  { id: 'r12', type: 'tool', emoji: '🔧', title: 'API Documentation Template', desc: 'Notion/Markdown template for documenting REST APIs — endpoint structure, auth section, request/response examples, error codes, and changelog.', tags: ['Notion', 'Documentation', 'Markdown'], price: 0, downloads: '2.2k', pages: null, updated: 'Feb 2025' },
  { id: 'r13', type: 'tool', emoji: '🔧', title: 'Client Onboarding Checklist', desc: 'Complete freelance client onboarding checklist — project brief, scope confirmation, payment terms, milestone planning, and communication setup.', tags: ['Freelance', 'Notion', 'Template'], price: 0, downloads: '1.5k', pages: null, updated: 'Jan 2025' },
  { id: 'r14', type: 'tool', emoji: '🔧', title: 'MERN Project Starter Script', desc: 'Bash/NPM script that sets up a complete MERN project structure with folder scaffolding, package.json, .env.example, and .gitignore in one command.', tags: ['Node.js', 'Script', 'CLI'], price: 0, downloads: '3.4k', pages: null, updated: 'Mar 2025' },
  // Paid Resources
  { id: 'r15', type: 'premium', emoji: '💎', title: 'Freelance Proposal & Contract Pack', desc: 'Professional proposal template, service agreement contract, NDA template, and invoice template used in real client projects. Legally reviewed.', tags: ['Freelance', 'Legal', 'Pack'], price: 149, downloads: '820', pages: null, updated: 'Jan 2025' },
  { id: 'r16', type: 'premium', emoji: '💎', title: 'Complete Interview Prep Kit', desc: '200+ MERN stack interview questions with detailed answers, system design patterns, coding challenges, and salary negotiation guide.', tags: ['Interview', 'MERN', 'Career'], price: 199, downloads: '1.1k', pages: 60, updated: 'Mar 2025' },
];

const RESOURCE_TYPES = ['All', 'Cheat Sheets', 'Roadmaps', 'Tools & Scripts', 'Premium'];

const typeMap = {
  'cheatsheet': 'Cheat Sheets',
  'roadmap': 'Roadmaps',
  'tool': 'Tools & Scripts',
  'premium': 'Premium',
};

const USEFUL_LINKS = [
  { category: 'Documentation', links: [
    { name: 'React Docs (Beta)', url: 'https://react.dev', desc: 'The new official React documentation.' },
    { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs', desc: 'Official Node.js documentation.' },
    { name: 'MongoDB Manual', url: 'https://www.mongodb.com/docs/manual', desc: 'Complete MongoDB reference.' },
    { name: 'Express.js Guide', url: 'https://expressjs.com/en/guide', desc: 'Express routing, middleware, and API reference.' },
  ]},
  { category: 'Design Resources', links: [
    { name: 'Tailwind UI', url: 'https://tailwindui.com', desc: 'Premium UI components by the Tailwind CSS team.' },
    { name: 'Heroicons', url: 'https://heroicons.com', desc: 'Beautiful SVG icons by the Tailwind team.' },
    { name: 'Lucide Icons', url: 'https://lucide.dev', desc: 'Open-source icon library with 1000+ icons.' },
    { name: 'Google Fonts', url: 'https://fonts.google.com', desc: 'Free, open-source fonts.' },
  ]},
  { category: 'Tools', links: [
    { name: 'Postman', url: 'https://www.postman.com', desc: 'API testing and documentation tool.' },
    { name: 'MongoDB Atlas', url: 'https://www.mongodb.com/cloud/atlas', desc: 'Free cloud MongoDB hosting.' },
    { name: 'Cloudinary', url: 'https://cloudinary.com', desc: 'Free image/video CDN and transformation.' },
    { name: 'Vercel', url: 'https://vercel.com', desc: 'Best platform for deploying React apps.' },
  ]},
  { category: 'Learning', links: [
    { name: 'JavaScript.info', url: 'https://javascript.info', desc: 'The most comprehensive JS tutorial online.' },
    { name: 'The Odin Project', url: 'https://www.theodinproject.com', desc: 'Free full-stack curriculum.' },
    { name: 'CS50 (Harvard)', url: 'https://cs50.harvard.edu', desc: 'Free computer science foundations course.' },
    { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org', desc: 'Free coding bootcamp with certifications.' },
  ]},
];

const MY_PROJECTS_SHOWCASE = [
  { name: 'AuthNester', desc: 'Full auth system', url: 'https://authnester.netlify.app/', emoji: '🔐', category: 'Template' },
  { name: 'Tukka Time', desc: 'Food delivery app', url: 'https://tukka-time.netlify.app/', emoji: '🍜', category: 'Project' },
  { name: 'ApplyArc', desc: 'Job portal', url: 'https://apply-arc-job.netlify.app/', emoji: '💼', category: 'Project' },
  { name: 'OtakuWave', desc: 'Anime platform', url: 'https://otaku-wave.netlify.app/', emoji: '⛩️', category: 'Project' },
  { name: 'FinanceFolio', desc: 'Finance tracker', url: 'https://finance-folio.netlify.app/', emoji: '📊', category: 'Project' },
  { name: 'MarketAI Pro', desc: 'AI marketing tool', url: 'https://market-ai-pro.netlify.app/', emoji: '🤖', category: 'Project' },
  { name: 'Text to PDF', desc: 'PDF converter', url: 'https://text-to-pdf-converting-website.onrender.com/', emoji: '📄', category: 'Tool' },
  { name: 'InstantHooks', desc: 'React hooks library', url: 'https://instant-hooks.netlify.app/', emoji: '🪝', category: 'Library' },
  { name: 'Banking Clone', desc: 'Online banking UI', url: 'https://onlinebankingclone.netlify.app/', emoji: '🏦', category: 'Project' },
  { name: 'MediSphere', desc: 'Healthcare portal', url: 'https://medi-sphere.netlify.app/', emoji: '🏥', category: 'Project' },
  { name: 'Law Firm Site', desc: 'Professional firm website', url: 'https://jagdamba-lawfirm.netlify.app/', emoji: '⚖️', category: 'Project' },
  { name: 'E-Commerce Demo', desc: 'Full store', url: 'https://e-commerce-shivam-demo.netlify.app/', emoji: '🛒', category: 'Project' },
  { name: 'TickleBox', desc: 'Games & quizzes', url: 'https://ticklebox.netlify.app/games/quiz.html', emoji: '🎮', category: 'Tool' },
  { name: 'Legitixy', desc: 'India legal hub', url: 'https://legitixy.netlify.app', emoji: '📜', category: 'Project' },
];

export default function Resources() {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filtered = RESOURCES_DATA.filter(r => {
    const matchType = activeType === 'All' || typeMap[r.type] === activeType;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  const faqs = [
    { q: 'Are all the free resources actually free?', a: 'Yes! All resources marked as free are completely free to download — no email signup required for most. A few resources require a free account for tracking updates.' },
    { q: 'Can I share these resources with my team or community?', a: 'Free resources can be shared freely. Paid resources are licensed per-person. Please do not redistribute paid resources — it hurts independent creators.' },
    { q: 'How often are resources updated?', a: 'Resources are updated when significant changes occur in the related technology. You can see the "Updated" date on each resource card.' },
    { q: 'Can I request a specific cheat sheet or resource?', a: 'Absolutely! Email me or use the contact form to request a specific resource. Popular requests get prioritized.' },
    { q: 'Are the roadmaps PDF or interactive?', a: 'Roadmaps are available as high-resolution PDF files that you can print, annotate, or keep on your desktop. Some will be interactive web versions soon.' },
  ];

  return (
    <div className={`ss-page-wrapper ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="ss-page-hero">
        <div className="ss-page-hero-grid-bg" />
        <div className="ss-page-hero-content ss-animate-in">
          <div className="ss-page-hero-eyebrow">
            <span className="ss-page-hero-eyebrow-dot" />
            Shivam Stack · Free Resources
          </div>
          <h1 className="ss-page-hero-title">
            Developer<br />
            <span className="ss-page-hero-title-accent">Resources Hub</span>
          </h1>
          <p className="ss-page-hero-subtitle">
            Free cheat sheets, roadmaps, tools, scripts, and curated links — everything a MERN developer
            needs to learn faster, build smarter, and ship better.
          </p>
          <div className="ss-page-hero-stats">
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">16<span>+</span></div>
              <div className="ss-page-hero-stat-label">Free Resources</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">50k<span>+</span></div>
              <div className="ss-page-hero-stat-label">Downloads</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">14<span>+</span></div>
              <div className="ss-page-hero-stat-label">Live Projects</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">100<span>%</span></div>
              <div className="ss-page-hero-stat-label">Free Downloads</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner ────────────────────────────────── */}
      <section className="ss-section" style={{ paddingBottom: 0 }}>
        <div className="ss-container">
          <div className="ss-info-banner">
            <span className="ss-info-banner-icon">🆓</span>
            <div className="ss-info-banner-text">
              <strong>All cheat sheets, roadmaps, and scripts are 100% free.</strong> No login required. Click download and you're done. Premium resources are clearly marked.
            </div>
          </div>
        </div>
      </section>

      {/* ── Resources Grid ─────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">📦 Free Downloads</div>
            <h2 className="ss-section-title">All Resources</h2>
            <p className="ss-section-desc">Cheat sheets, roadmaps, scripts, and tools — download and use freely in your projects.</p>
          </div>

          {/* Search */}
          <div className="ss-search-wrap">
            <span className="ss-search-icon">🔍</span>
            <input
              className="ss-search-input"
              placeholder="Search resources by topic or tech..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="ss-filter-bar">
            {RESOURCE_TYPES.map(type => (
              <button key={type} className={`ss-filter-btn ${activeType === type ? 'ss-filter-active' : ''}`} onClick={() => setActiveType(type)}>
                {type}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="ss-resource-grid">
            {filtered.map((resource, i) => (
              <div className={`ss-resource-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`} key={resource.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="ss-resource-type-icon">{resource.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div className="ss-resource-card-title">{resource.title}</div>
                      {resource.price === 0
                        ? <span className="ss-product-card-badge ss-badge-free" style={{ position: 'static' }}>Free</span>
                        : <span className="ss-product-card-badge ss-badge-pro" style={{ position: 'static' }}>₹{resource.price}</span>
                      }
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      {resource.tags.map(tag => <span className="ss-product-tag" key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </div>
                <p className="ss-resource-card-desc">{resource.desc}</p>
                <div className="ss-resource-card-meta">
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>⬇ {resource.downloads} downloads</span>
                    {resource.pages && <span>📄 {resource.pages} pages</span>}
                    <span>🗓 {resource.updated}</span>
                  </div>
                  <button className="ss-btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}>
                    {resource.price === 0 ? '⬇ Download' : '🛒 Buy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ss-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p>No resources found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Project Showcase (Live Links) ───────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🌐 Live Projects</div>
            <h2 className="ss-section-title">Browse All Live Projects</h2>
            <p className="ss-section-desc">Every project is live, functional, and open for exploration. See the work in action.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {MY_PROJECTS_SHOWCASE.map((project, i) => (
              <a
                key={i}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="ss-resource-card ss-animate-in"
                style={{ textDecoration: 'none', gap: '0.6rem', padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{project.emoji}</div>
                  <div>
                    <div className="ss-resource-card-title" style={{ fontSize: '0.92rem' }}>{project.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ss-text-muted)' }}>{project.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid var(--ss-border)' }}>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--ss-font-mono)', fontWeight: 700, color: 'var(--ss-accent-primary)', background: 'rgba(0,212,255,0.08)', padding: '0.15rem 0.5rem', borderRadius: 'var(--ss-radius-full)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    {project.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ss-accent-primary)' }}>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Curated Links ─────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🔗 Curated Links</div>
            <h2 className="ss-section-title">Developer Bookmarks</h2>
            <p className="ss-section-desc">My personal list of the best tools, documentation, and learning resources — tested and used daily.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {USEFUL_LINKS.map((group, gi) => (
              <div key={gi} style={{ background: 'var(--ss-bg-card)', border: '1px solid var(--ss-border)', borderRadius: 'var(--ss-radius-lg)', padding: '1.75rem' }}>
                <div style={{ fontFamily: 'var(--ss-font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--ss-text-primary)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--ss-border)' }}>
                  {group.category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {group.links.map((link, li) => (
                    <a key={li} href={link.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ss-accent-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {link.name} <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>↗</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ss-text-muted)' }}>{link.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Skills & Expertise ──────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🧠 Skills Map</div>
            <h2 className="ss-section-title">Shivam's Expertise Breakdown</h2>
            <p className="ss-section-desc">A transparent overview of skills, proficiency levels, and years of experience.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {[
              { skill: 'React.js + Next.js', level: 95, years: '3 years', category: 'Frontend' },
              { skill: 'Node.js + Express.js', level: 92, years: '3 years', category: 'Backend' },
              { skill: 'MongoDB + Mongoose', level: 90, years: '3 years', category: 'Database' },
              { skill: 'Redux + Context API', level: 88, years: '2.5 years', category: 'State Mgmt' },
              { skill: 'TypeScript', level: 80, years: '2 years', category: 'Language' },
              { skill: 'Tailwind CSS', level: 94, years: '2.5 years', category: 'Styling' },
              { skill: 'Socket.io', level: 82, years: '2 years', category: 'Real-time' },
              { skill: 'REST API Design', level: 93, years: '3 years', category: 'API' },
              { skill: 'JWT + OAuth2', level: 88, years: '2.5 years', category: 'Auth' },
              { skill: 'Docker + CI/CD', level: 72, years: '1.5 years', category: 'DevOps' },
              { skill: 'AWS S3 + Cloudinary', level: 84, years: '2 years', category: 'Cloud' },
              { skill: 'Stripe / Payment APIs', level: 86, years: '2 years', category: 'Payments' },
            ].map((skill, i) => (
              <div key={i} style={{ background: 'var(--ss-bg-card)', border: '1px solid var(--ss-border)', borderRadius: 'var(--ss-radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ss-text-primary)' }}>{skill.skill}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ss-text-muted)', fontFamily: 'var(--ss-font-mono)', marginTop: '0.1rem' }}>{skill.category} · {skill.years}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--ss-font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--ss-accent-primary)' }}>{skill.level}%</div>
                </div>
                <div style={{ height: '6px', background: 'var(--ss-bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${skill.level}%`,
                    background: `linear-gradient(90deg, var(--ss-accent-primary), var(--ss-accent-secondary))`,
                    borderRadius: '999px',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Services Offered ────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🛠️ Services</div>
            <h2 className="ss-section-title">What I Can Build For You</h2>
            <p className="ss-section-desc">Custom MERN development services tailored to your product needs and business goals.</p>
          </div>
          <div className="ss-features-grid">
            {[
              { icon: '🏗️', title: 'Custom MERN App', desc: 'End-to-end MERN web application development — from database design to React UI to Node.js API to deployment.' },
              { icon: '🎨', title: 'Frontend (React/Next.js)', desc: 'Pixel-perfect, responsive React or Next.js applications with excellent UX, performance, and accessibility.' },
              { icon: '⚙️', title: 'REST API Development', desc: 'Robust and scalable RESTful APIs with Express.js, proper error handling, validation, and API documentation.' },
              { icon: '🛒', title: 'E-Commerce Solutions', desc: 'Full e-commerce platforms with product management, payments, cart, order management, and admin dashboard.' },
              { icon: '🤖', title: 'AI-Integrated Apps', desc: 'MERN applications with OpenAI/Gemini API integration for AI-powered features, chatbots, or content generation.' },
              { icon: '🔌', title: 'API Integrations', desc: 'Third-party API integrations — Stripe, Twilio, Cloudinary, SendGrid, Google APIs, Razorpay, and more.' },
              { icon: '🔄', title: 'Code Review & Refactor', desc: 'Professional code review, architecture audit, and codebase refactoring for existing MERN projects.' },
              { icon: '📱', title: 'Responsive UI Conversion', desc: 'Convert existing web apps to fully mobile-responsive with modern design, dark mode, and smooth animations.' },
            ].map((service, i) => (
              <div className={`ss-feature-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`} key={i}>
                <div className="ss-feature-icon">{service.icon}</div>
                <div className="ss-feature-title">{service.title}</div>
                <div className="ss-feature-desc">{service.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── FAQ ─────────────────────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">❓ FAQ</div>
            <h2 className="ss-section-title">Resources FAQ</h2>
          </div>
          <div className="ss-faq-list">
            {faqs.map((faq, i) => (
              <div className={`ss-faq-item ${openFaq === i ? 'ss-faq-open' : ''}`} key={i}>
                <button className="ss-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}<span className="ss-faq-icon">+</span>
                </button>
                <div className="ss-faq-answer">
                  <div className="ss-faq-answer-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="ss-cta-section">
        <div className="ss-cta-inner">
          <div className="ss-section-tag" style={{ marginBottom: '1rem' }}>📬 Stay Connected</div>
          <h2 className="ss-cta-title">Get New Resources<br />Before Anyone Else</h2>
          <p className="ss-cta-desc">
            Subscribe to Shivam Stack's newsletter for early access to new cheat sheets, roadmaps, free tools,
            and discount codes on premium products. No spam, ever.
          </p>
          <div className="ss-cta-actions">
            <button className="ss-btn-primary">📧 Subscribe — It's Free</button>
            <button className="ss-btn-secondary">💬 Hire Shivam</button>
          </div>
        </div>
      </section>

    </div>
  );
}