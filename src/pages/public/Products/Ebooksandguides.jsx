import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

// ─── API endpoint: /api/public/products  (category: ebook / guide) ────────────────────────────
// Dummy data simulating Product schema response
const EBOOKS_DUMMY = [
  {
    id: 'eb1',
    name: 'The Complete MERN Stack Handbook',
    slug: 'complete-mern-handbook',
    description: 'From zero to full-stack — this 280-page guide walks you through MongoDB, Express, React, and Node.js with real-world project examples, best practices, and deployment strategies used by senior developers.',
    price: 349,
    category: 'Full Stack',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'bestseller',
    pages: 280,
    format: 'PDF + EPUB',
    level: 'Beginner → Advanced',
    emoji: '📗',
    chapters: 18,
    updated: 'Jan 2025',
    includes: ['Source Code', 'Cheat Sheets', 'Quiz Questions', 'Discord Access'],
  },
  {
    id: 'eb2',
    name: 'MongoDB Mastery: Schema Design & Aggregation',
    slug: 'mongodb-mastery',
    description: 'Deep-dive into MongoDB like a pro. Covers schema design patterns, indexing strategies, aggregation pipelines, transactions, Atlas setup, and performance optimization for production databases.',
    price: 249,
    category: 'Database',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'new',
    pages: 160,
    format: 'PDF',
    level: 'Intermediate → Advanced',
    emoji: '🍃',
    chapters: 12,
    updated: 'Feb 2025',
    includes: ['50+ Query Examples', 'Schema Templates', 'Index Cheat Sheet'],
  },
  {
    id: 'eb3',
    name: 'React 18 Patterns & Performance',
    slug: 'react-18-patterns',
    description: 'Master advanced React 18 patterns — concurrent rendering, Suspense, Server Components, useTransition, custom hooks architecture, performance profiling, and real-world optimization case studies.',
    price: 299,
    category: 'Frontend',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'popular',
    pages: 210,
    format: 'PDF + EPUB',
    level: 'Intermediate',
    emoji: '⚛️',
    chapters: 15,
    updated: 'Mar 2025',
    includes: ['Code Sandbox Links', 'Performance Checklist', 'Component Templates'],
  },
  {
    id: 'eb4',
    name: 'Node.js API Design: REST & Beyond',
    slug: 'nodejs-api-design',
    description: 'Build robust, secure, and scalable Node.js APIs from scratch. Covers REST best practices, error handling, rate limiting, JWT auth, caching with Redis, and GraphQL introduction.',
    price: 279,
    category: 'Backend',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'pro',
    pages: 195,
    format: 'PDF',
    level: 'Intermediate → Advanced',
    emoji: '🟢',
    chapters: 14,
    updated: 'Jan 2025',
    includes: ['Postman Collections', 'Middleware Templates', 'Security Checklist'],
  },
  {
    id: 'eb5',
    name: 'Freelance Developer Blueprint',
    slug: 'freelance-dev-blueprint',
    description: 'The complete guide to starting and scaling a freelance web development career. Covers finding clients, pricing, proposals, contracts, managing projects, and building passive income through digital products.',
    price: 199,
    category: 'Career & Business',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'bestseller',
    pages: 145,
    format: 'PDF + EPUB',
    level: 'All Levels',
    emoji: '💰',
    chapters: 11,
    updated: 'Feb 2025',
    includes: ['Contract Templates', 'Proposal Templates', 'Pricing Calculator Sheet'],
  },
  {
    id: 'eb6',
    name: 'JavaScript: The Deep End',
    slug: 'javascript-deep-end',
    description: 'Go beyond the basics — closures, prototypes, event loop, async/await internals, WeakMap, Proxy, generators, module bundlers, and V8 engine optimization secrets.',
    price: 229,
    category: 'JavaScript',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'new',
    pages: 175,
    format: 'PDF',
    level: 'Intermediate → Advanced',
    emoji: '🟡',
    chapters: 13,
    updated: 'Mar 2025',
    includes: ['Exercise Challenges', 'Interview Q&A Sheet', 'Browser DevTools Guide'],
  },
  {
    id: 'eb7',
    name: 'Deploy Like a Pro: Cloud & DevOps for MERN',
    slug: 'deploy-like-pro',
    description: 'A practical guide to deploying MERN apps to production. Covers Vercel, Netlify, Render, Railway, AWS EC2, Docker, CI/CD pipelines, environment management, and SSL certificates.',
    price: 249,
    category: 'DevOps',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'popular',
    pages: 155,
    format: 'PDF',
    level: 'Beginner → Intermediate',
    emoji: '🚀',
    chapters: 10,
    updated: 'Jan 2025',
    includes: ['CI/CD YAML Templates', 'Docker Compose Files', 'Checklist PDFs'],
  },
  {
    id: 'eb8',
    name: 'CSS Craftsman: Advanced Layouts & Animations',
    slug: 'css-craftsman',
    description: 'Master CSS Grid, Flexbox, custom properties, keyframe animations, scroll-driven animations, container queries, @layer, and the art of creating smooth, accessible UIs.',
    price: 179,
    category: 'Frontend',
    images: [],
    stock: 999,
    isPublished: true,
    badge: 'new',
    pages: 140,
    format: 'PDF + EPUB',
    level: 'Beginner → Intermediate',
    emoji: '🎨',
    chapters: 10,
    updated: 'Feb 2025',
    includes: ['100+ Code Snippets', 'Animation Cheat Sheet', 'Design Tokens Template'],
  },
];

const GUIDE_CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend', 'Database', 'JavaScript', 'DevOps', 'Career & Business'];

const BUNDLE_DEALS = [
  { name: 'MERN Starter Bundle', books: ['The Complete MERN Stack Handbook', 'MongoDB Mastery', 'Node.js API Design'], originalPrice: 877, bundlePrice: 549, emoji: '📦', savings: '37%' },
  { name: 'Frontend Mastery Bundle', books: ['React 18 Patterns & Performance', 'CSS Craftsman', 'JavaScript: The Deep End'], originalPrice: 707, bundlePrice: 449, emoji: '⚡', savings: '36%' },
  { name: 'Full Developer Bundle', books: ['All 8 E-Books Included'], originalPrice: 2029, bundlePrice: 999, emoji: '💎', savings: '51%' },
];

export default function EBooksAndGuides() {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filtered = EBOOKS_DUMMY.filter(e => {
    const matchCat = activeCategory === 'All' || e.category === activeCategory;
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const faqs = [
    { q: 'What format are the e-books in?', a: 'All e-books are available as high-quality PDF files. Selected titles also include EPUB format for reading on e-readers and mobile devices.' },
    { q: 'Will the e-books be updated as technologies evolve?', a: 'Yes! Purchased e-books receive lifetime free updates. You will be notified by email when a new edition is released.' },
    { q: 'Are these beginner-friendly or for experienced developers?', a: 'Each e-book clearly lists its level (Beginner / Intermediate / Advanced). Many start from basics and progress to advanced topics within the same book.' },
    { q: 'Can I get a preview before buying?', a: 'Yes. Each e-book has a free preview of the first chapter. Click "Preview" on any book to read the sample.' },
    { q: 'Is the content practical or purely theoretical?', a: 'Everything is practical-first. Every concept is taught through real code examples, actual project scenarios, and exercises.' },
    { q: 'Do the bundles include source code?', a: 'Yes. All bundles include the full source code repositories linked in each book, along with setup guides and cheat sheets.' },
  ];

  return (
    <div className={`ss-page-wrapper ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="ss-page-hero">
        <div className="ss-page-hero-grid-bg" />
        <div className="ss-page-hero-content ss-animate-in">
          <div className="ss-page-hero-eyebrow">
            <span className="ss-page-hero-eyebrow-dot" />
            Shivam Stack · Knowledge Library
          </div>
          <h1 className="ss-page-hero-title">
            E-Books &<br />
            <span className="ss-page-hero-title-accent">Developer Guides</span>
          </h1>
          <p className="ss-page-hero-subtitle">
            Practical, no-fluff technical guides written by a working MERN developer for developers
            who learn by doing. Real code, real projects, real results.
          </p>
          <div className="ss-page-hero-stats">
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">8<span>+</span></div>
              <div className="ss-page-hero-stat-label">E-Books</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">1,500<span>+</span></div>
              <div className="ss-page-hero-stat-label">Pages of Content</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">1,200<span>+</span></div>
              <div className="ss-page-hero-stat-label">Readers</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">4.9<span>★</span></div>
              <div className="ss-page-hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Info Banner ──────────────────────────────── */}
      <section className="ss-section" style={{ paddingBottom: 0 }}>
        <div className="ss-container">
          <div className="ss-info-banner">
            <span className="ss-info-banner-icon">📖</span>
            <div className="ss-info-banner-text">
              <strong>Lifetime Updates Included.</strong> Every e-book purchase includes free updates for life.
              No subscriptions, no recurring fees. Buy once, learn forever. Prices in INR.
            </div>
          </div>
        </div>
      </section>

      {/* ── E-Books Grid ─────────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">📚 E-Books Library</div>
            <h2 className="ss-section-title">All E-Books & Guides</h2>
            <p className="ss-section-desc">Handcrafted guides from real-world MERN development experience. No padding, no theory dumps.</p>
          </div>

          {/* Search */}
          <div className="ss-search-wrap">
            <span className="ss-search-icon">🔍</span>
            <input
              className="ss-search-input"
              placeholder="Search by topic, technology..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="ss-filter-bar">
            {GUIDE_CATEGORIES.map(cat => (
              <button key={cat} className={`ss-filter-btn ${activeCategory === cat ? 'ss-filter-active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* E-Books Grid */}
          <div className="ss-ebook-grid">
            {filtered.map((book, i) => (
              <div className={`ss-ebook-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`} key={book.id}>
                <div className="ss-ebook-cover">
                  {book.images && book.images.length > 0
                    ? <img src={book.images[0]} alt={book.name} />
                    : (
                      <div className="ss-ebook-cover-placeholder">
                        <div className="ss-ebook-cover-icon">{book.emoji}</div>
                        <div className="ss-ebook-cover-title">{book.name}</div>
                        <div className="ss-ebook-cover-author">by Shivam Stack</div>
                      </div>
                    )
                  }
                  <span className={`ss-product-card-badge ss-badge-${book.badge === 'bestseller' ? 'popular' : book.badge}`} style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    {book.badge}
                  </span>
                </div>
                <div className="ss-ebook-body">
                  <div className="ss-product-card-category">{book.category}</div>
                  <h3 className="ss-ebook-title">{book.name}</h3>
                  <p className="ss-ebook-desc">{book.description}</p>
                  <div className="ss-ebook-meta">
                    <span className="ss-ebook-meta-item">📄 {book.pages} pages</span>
                    <span className="ss-ebook-meta-item">📑 {book.chapters} chapters</span>
                    <span className="ss-ebook-meta-item">📊 {book.level}</span>
                    <span className="ss-ebook-meta-item">🗓 {book.updated}</span>
                    <span className="ss-ebook-meta-item">📁 {book.format}</span>
                  </div>
                  {/* Includes */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ss-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Includes</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {book.includes.map(inc => (
                        <span key={inc} className="ss-product-tag" style={{ fontSize: '0.68rem' }}>✓ {inc}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ss-ebook-footer">
                    <div className="ss-product-price">
                      <span className="ss-product-price-currency">₹</span>
                      <span className="ss-product-price-amount">{book.price}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="ss-btn-ghost" style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}>Preview</button>
                      <button className="ss-btn-primary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>Buy Now →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ss-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <p>No e-books found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Bundle Deals ─────────────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🎁 Bundle Deals</div>
            <h2 className="ss-section-title">Save More, Learn More</h2>
            <p className="ss-section-desc">Bundle multiple e-books together for massive savings. Best value for serious learners.</p>
          </div>
          <div className="ss-pricing-grid">
            {BUNDLE_DEALS.map((bundle, i) => (
              <div className={`ss-pricing-card ${i === 2 ? 'ss-pricing-card-featured' : ''}`} key={bundle.name}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{bundle.emoji}</div>
                <div className="ss-pricing-plan-name">{bundle.name}</div>
                <div className="ss-pricing-amount"><span>₹</span>{bundle.bundlePrice}</div>
                <div className="ss-pricing-period">
                  <span style={{ textDecoration: 'line-through', marginRight: '0.5rem', color: 'var(--ss-text-muted)' }}>₹{bundle.originalPrice}</span>
                  <span style={{ color: 'var(--ss-accent-green)', fontWeight: 700 }}>Save {bundle.savings}</span>
                </div>
                <div className="ss-pricing-divider" />
                <ul className="ss-pricing-features">
                  {bundle.books.map(b => (
                    <li key={b}><span className="ss-pricing-check">✓</span> {b}</li>
                  ))}
                  <li><span className="ss-pricing-check">✓</span> Lifetime Updates</li>
                  <li><span className="ss-pricing-check">✓</span> Source Code Repos</li>
                  <li><span className="ss-pricing-check">✓</span> Cheat Sheets</li>
                  {i === 2 && <li><span className="ss-pricing-check">✓</span> Discord Community Access</li>}
                  {i === 2 && <li><span className="ss-pricing-check">✓</span> Priority Email Support</li>}
                </ul>
                <button className="ss-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
                  {i === 2 ? '💎 Get Full Bundle' : '🛒 Buy Bundle'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── What's Inside ────────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">✨ What You Get</div>
            <h2 className="ss-section-title">Every E-Book Includes</h2>
            <p className="ss-section-desc">Not just theory — everything is backed by real-world project experience.</p>
          </div>
          <div className="ss-features-grid">
            {[
              { icon: '💻', title: 'Full Source Code', desc: 'Every code example from the book is available in a linked GitHub repo, organized by chapter for easy reference.' },
              { icon: '🗂️', title: 'Cheat Sheets', desc: 'Quick-reference cheat sheets in PDF format covering syntax, commands, patterns, and best practices for each topic.' },
              { icon: '🧠', title: 'Exercises & Projects', desc: 'Each chapter ends with exercises and mini-projects to reinforce concepts with hands-on practice.' },
              { icon: '🔄', title: 'Lifetime Free Updates', desc: 'Technology evolves — your e-book does too. Get updated editions at no extra cost, forever.' },
              { icon: '📱', title: 'Multi-Format', desc: 'PDF works on any device. Selected titles also include EPUB for Kindle, Apple Books, and e-readers.' },
              { icon: '🌐', title: 'Community Discord', desc: 'Premium bundles include access to the Shivam Stack Discord server to ask questions and share progress.' },
              { icon: '🎯', title: 'Interview Prep', desc: 'Every guide includes a bonus section with common interview questions, answers, and real-world scenario problems.' },
              { icon: '📊', title: 'Visual Diagrams', desc: 'Complex concepts explained with clear, hand-crafted diagrams, architecture charts, and flowcharts.' },
            ].map((f, i) => (
              <div className={`ss-feature-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`} key={i}>
                <div className="ss-feature-icon">{f.icon}</div>
                <div className="ss-feature-title">{f.title}</div>
                <div className="ss-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Sample Topics ────────────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">📋 Topic Coverage</div>
            <h2 className="ss-section-title">What You'll Actually Learn</h2>
            <p className="ss-section-desc">Across all guides, here's the extensive curriculum of concepts covered.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { topic: 'MERN Architecture', subs: ['Project Structure', 'MVC Pattern', 'Env Config', 'Monorepo Setup'] },
              { topic: 'MongoDB', subs: ['Schema Design', 'Aggregations', 'Indexes', 'Transactions', 'Atlas Cloud'] },
              { topic: 'Express.js', subs: ['Middleware', 'Error Handling', 'File Uploads', 'Rate Limiting'] },
              { topic: 'React 18', subs: ['Concurrent Mode', 'Suspense', 'Server Components', 'Custom Hooks'] },
              { topic: 'Authentication', subs: ['JWT Tokens', 'OAuth2', 'Refresh Tokens', 'Role Guards'] },
              { topic: 'Deployment', subs: ['Vercel', 'Netlify', 'Render', 'Docker', 'CI/CD'] },
              { topic: 'Performance', subs: ['Code Splitting', 'Lazy Loading', 'Caching', 'Query Optimization'] },
              { topic: 'Security', subs: ['CORS', 'Helmet.js', 'Input Validation', 'SQL Injection', 'XSS'] },
            ].map((group, i) => (
              <div key={i} style={{ background: 'var(--ss-bg-card)', border: '1px solid var(--ss-border)', borderRadius: 'var(--ss-radius-md)', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--ss-font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ss-text-primary)', marginBottom: '0.75rem' }}>{group.topic}</div>
                {group.subs.map(sub => (
                  <div key={sub} style={{ fontSize: '0.82rem', color: 'var(--ss-text-secondary)', padding: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--ss-accent-primary)', fontSize: '0.7rem' }}>→</span> {sub}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── FAQ ────────────────────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">❓ FAQ</div>
            <h2 className="ss-section-title">E-Book Questions Answered</h2>
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

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="ss-cta-section">
        <div className="ss-cta-inner">
          <div className="ss-section-tag" style={{ marginBottom: '1rem' }}>🎓 Start Learning Today</div>
          <h2 className="ss-cta-title">Stop Watching Tutorials.<br />Start Building Real Things.</h2>
          <p className="ss-cta-desc">
            These e-books are written by a working developer who has shipped 14+ real products.
            Every page is actionable. Every example is real. Get the full bundle for less than a month of Netflix.
          </p>
          <div className="ss-cta-actions">
            <button className="ss-btn-primary">💎 Get Full Bundle — ₹999</button>
            <button className="ss-btn-secondary">📖 Browse Individual Books</button>
          </div>
        </div>
      </section>

    </div>
  );
}