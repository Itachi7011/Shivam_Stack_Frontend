import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

// ─── API endpoint: /api/public/products  (category: template) ──────────────────────────────────
const CODE_TEMPLATES_DATA = [
  {
    id: 't1', name: 'MERN Starter Kit — Production Ready', slug: 'mern-starter-kit',
    price: 399, oldPrice: 599, badge: 'bestseller',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'JWT'],
    description: 'The most complete MERN starter boilerplate. Includes authentication, admin panel skeleton, dark/light mode, Cloudinary image upload, email verification, and Tailwind CSS.',
    stack: ['React 18', 'Node.js', 'MongoDB', 'Redux Toolkit', 'Tailwind'],
    emoji: '🚀', preview: 'https://authnester.netlify.app/',
    features: ['JWT Auth Flow', 'Protected Routes', 'Admin Dashboard', 'Email Templates', 'Upload System'],
    image: null,
  },
  {
    id: 't2', name: 'E-Commerce Full Stack Template', slug: 'ecommerce-template',
    price: 699, oldPrice: 999, badge: 'popular',
    tags: ['MERN', 'Stripe', 'Redux', 'Cloudinary', 'Nodemailer'],
    description: 'Production-ready e-commerce template with product management, cart & wishlist, Stripe checkout, order management, coupon system, and full admin panel.',
    stack: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Cloudinary'],
    emoji: '🛒', preview: 'https://e-commerce-shivam-demo.netlify.app/',
    features: ['Product CRUD', 'Cart & Wishlist', 'Stripe Payments', 'Order Tracking', 'Admin Dashboard', 'Coupon System'],
    image: null,
  },
  {
    id: 't3', name: 'React Admin Dashboard UI Kit', slug: 'admin-dashboard-ui',
    price: 299, oldPrice: 449, badge: 'new',
    tags: ['React', 'Recharts', 'Tailwind', 'TypeScript'],
    description: 'Beautiful admin dashboard with 30+ reusable components, dark/light mode, analytics charts, data tables with sorting/filtering, user management UI, and notification center.',
    stack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    emoji: '📊', preview: null,
    features: ['30+ Components', 'Dark/Light Mode', 'Analytics Charts', 'Data Tables', 'Responsive Design'],
    image: null,
  },
  {
    id: 't4', name: 'AuthNester — Auth System Template', slug: 'authnester-template',
    price: 249, oldPrice: null, badge: 'pro',
    tags: ['Node.js', 'JWT', 'OAuth2', 'MongoDB', 'Nodemailer'],
    description: 'Complete authentication system with register/login/logout, email verification, password reset, Google OAuth2, role-based access control (RBAC), and session management.',
    stack: ['Express.js', 'MongoDB', 'JWT', 'Passport.js', 'Nodemailer'],
    emoji: '🔐', preview: 'https://authnester.netlify.app/',
    features: ['JWT + Refresh Tokens', 'Google OAuth2', 'Email Verification', 'RBAC', 'Rate Limiting'],
    image: null,
  },
  {
    id: 't5', name: 'Job Board / Portal Template', slug: 'job-board-template',
    price: 549, oldPrice: 799, badge: 'popular',
    tags: ['MERN', 'Redux', 'Socket.io', 'Cloudinary', 'Nodemailer'],
    description: 'Full job portal template with company profiles, job listings, applicant tracking, resume upload, email notifications, bookmark jobs, and advanced search/filter.',
    stack: ['React', 'Node.js', 'MongoDB', 'Cloudinary', 'Socket.io'],
    emoji: '💼', preview: 'https://apply-arc-job.netlify.app/',
    features: ['Job CRUD', 'Application Tracking', 'Resume Upload', 'Company Dashboard', 'Advanced Filters'],
    image: null,
  },
  {
    id: 't6', name: 'Real-Time Chat App Template', slug: 'realtime-chat-template',
    price: 349, oldPrice: 499, badge: 'new',
    tags: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'JWT'],
    description: 'Real-time 1:1 and group chat application with read receipts, typing indicators, file sharing, emoji reactions, user presence, and notification system.',
    stack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'JWT'],
    emoji: '💬', preview: null,
    features: ['Real-time Messaging', 'Group Chats', 'File Sharing', 'Read Receipts', 'Typing Indicators'],
    image: null,
  },
  {
    id: 't7', name: 'SaaS Landing Page Template', slug: 'saas-landing-template',
    price: 199, oldPrice: 299, badge: 'new',
    tags: ['React', 'Framer Motion', 'Tailwind', 'EmailJS'],
    description: 'High-conversion SaaS landing page with animated hero, features section, pricing table, testimonials, contact form, and Google Analytics integration.',
    stack: ['React 18', 'Framer Motion', 'Tailwind CSS', 'EmailJS'],
    emoji: '🌐', preview: null,
    features: ['Animated Hero', 'Pricing Section', 'Testimonials', 'Contact Form', 'SEO Ready'],
    image: null,
  },
  {
    id: 't8', name: 'Healthcare / Booking System Template', slug: 'healthcare-template',
    price: 649, oldPrice: 949, badge: 'pro',
    tags: ['MERN', 'Socket.io', 'Stripe', 'Nodemailer', 'Cloudinary'],
    description: 'Healthcare platform with appointment booking, patient records, doctor profiles, prescription management, medical history, video consultation integration, and admin panel.',
    stack: ['MERN Stack', 'Socket.io', 'Stripe', 'Cloudinary'],
    emoji: '🏥', preview: 'https://medi-sphere.netlify.app/',
    features: ['Appointment Booking', 'Patient Records', 'Doctor Dashboard', 'Payment Gateway', 'Video Consult Ready'],
    image: null,
  },
  {
    id: 't9', name: 'InstantHooks — React Hooks Library', slug: 'instant-hooks-template',
    price: 299, oldPrice: 449, badge: 'popular',
    tags: ['React', 'TypeScript', 'Hooks', 'npm'],
    description: '50+ production-ready custom React hooks covering async state, local storage, intersection observer, debounce, fetch, dark mode, geolocation, and 40+ more patterns.',
    stack: ['React 18', 'TypeScript', 'Rollup', 'Vitest'],
    emoji: '🪝', preview: 'https://instant-hooks.netlify.app/',
    features: ['50+ Hooks', 'TypeScript Types', 'Tree Shakeable', 'Full Tests', 'npm Ready'],
    image: null,
  },
  {
    id: 't10', name: 'Finance / Expense Tracker Template', slug: 'finance-tracker-template',
    price: 349, oldPrice: null, badge: 'new',
    tags: ['MERN', 'Chart.js', 'Redux', 'Tailwind'],
    description: 'Personal finance tracker with income/expense tracking, category management, monthly/yearly charts, budget goals, PDF export, and CSV import.',
    stack: ['React', 'Node.js', 'MongoDB', 'Chart.js', 'Redux'],
    emoji: '📊', preview: 'https://finance-folio.netlify.app/',
    features: ['Transaction Tracking', 'Budget Goals', 'Visual Charts', 'PDF Export', 'Category Management'],
    image: null,
  },
  {
    id: 't11', name: 'Blog / CMS Platform Template', slug: 'blog-cms-template',
    price: 399, oldPrice: 549, badge: 'popular',
    tags: ['MERN', 'Rich Text Editor', 'SEO', 'Cloudinary'],
    description: 'Full-featured blog platform with rich text editor, category/tag management, SEO meta management, comment system, author profiles, and RSS feed generation.',
    stack: ['React', 'Node.js', 'MongoDB', 'Quill.js', 'Cloudinary'],
    emoji: '📝', preview: null,
    features: ['Rich Text Editor', 'Category & Tags', 'SEO Meta Fields', 'Comment System', 'Author Dashboard'],
    image: null,
  },
  {
    id: 't12', name: 'PDF Generator / Document Tool', slug: 'pdf-generator-template',
    price: 0, oldPrice: null, badge: 'free',
    tags: ['Node.js', 'Express', 'PDFKit', 'React'],
    description: 'Web-based PDF generator that converts text, HTML, and markdown to styled PDFs with custom headers, footers, page numbers, and downloadable output.',
    stack: ['Node.js', 'Express', 'PDFKit', 'React'],
    emoji: '📄', preview: 'https://text-to-pdf-converting-website.onrender.com/',
    features: ['Text to PDF', 'HTML to PDF', 'Custom Styling', 'Page Numbers', 'Download API'],
    image: null,
  },
];

const TEMPLATE_CATEGORIES = ['All', 'Full Stack', 'Frontend UI', 'Backend API', 'Auth', 'E-Commerce', 'SaaS', 'Free'];

const TESTIMONIALS = [
  { name: 'Arjun Kapoor', role: 'Indie Hacker', text: 'The MERN Starter Kit saved me 3 weeks of setup time. The code structure is so clean, I barely had to change anything.', rating: 5, initials: 'AK' },
  { name: 'Lisa Chen', role: 'Startup CTO', text: 'We used the E-Commerce template as our MVP. Within 2 months of customization, we were live with real customers.', rating: 5, initials: 'LC' },
  { name: 'Rahul Dev', role: 'Freelancer', text: 'The auth template alone pays for itself. I resell MERN projects to clients and this is always my starting point.', rating: 5, initials: 'RD' },
];

export default function CodeTemplates() {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filtered = CODE_TEMPLATES_DATA.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = activeCategory === 'All' ||
      (activeCategory === 'Free' && t.price === 0) ||
      t.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()));
    return matchSearch && matchCat;
  });

  const faqs = [
    { q: 'Can I use these templates for commercial projects?', a: 'Yes. All templates come with a commercial license. You can use them for client projects, SaaS products, or personal projects.' },
    { q: 'Are these templates beginner-friendly?', a: 'Most templates include a detailed README and setup guide. Intermediate knowledge of JavaScript/React is recommended for smooth usage.' },
    { q: 'Do the templates include backend code?', a: 'Full Stack templates include both frontend (React) and backend (Node.js/Express) code with database schemas. Frontend-only templates are clearly labeled.' },
    { q: 'What does a template purchase include?', a: 'Full source code, README setup guide, .env.example file, Postman collection (for API templates), and 30 days of setup support.' },
    { q: 'Can I get a live preview before buying?', a: 'Yes. All templates with live previews have a "Live Preview" button. Others include video walkthroughs in the product page.' },
    { q: 'Can you customize a template to my needs?', a: 'Yes. After purchase, I offer customization at ₹500–1000/hour depending on complexity. Contact me to discuss.' },
  ];

  return (
    <div className={`ss-page-wrapper ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="ss-page-hero">
        <div className="ss-page-hero-grid-bg" />
        <div className="ss-page-hero-content ss-animate-in">
          <div className="ss-page-hero-eyebrow">
            <span className="ss-page-hero-eyebrow-dot" />
            Shivam Stack · Code Templates
          </div>
          <h1 className="ss-page-hero-title">
            Production-Ready<br />
            <span className="ss-page-hero-title-accent">Code Templates</span>
          </h1>
          <p className="ss-page-hero-subtitle">
            Skip the setup. Start with battle-tested MERN stack templates crafted by a senior developer.
            Ship your product in days, not months.
          </p>
          <div className="ss-page-hero-stats">
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">12<span>+</span></div>
              <div className="ss-page-hero-stat-label">Templates</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">800<span>+</span></div>
              <div className="ss-page-hero-stat-label">Downloads</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">50<span>k+</span></div>
              <div className="ss-page-hero-stat-label">Lines of Code</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">100<span>%</span></div>
              <div className="ss-page-hero-stat-label">Production Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner ────────────────────────────────── */}
      <section className="ss-section" style={{ paddingBottom: 0 }}>
        <div className="ss-container">
          <div className="ss-info-banner">
            <span className="ss-info-banner-icon">⚡</span>
            <div className="ss-info-banner-text">
              <strong>All templates include:</strong> Full source code · Setup README · .env config · 30 days support · Commercial license. Prices in INR.
            </div>
          </div>
        </div>
      </section>

      {/* ── Templates Grid ───────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">💻 Templates Library</div>
            <h2 className="ss-section-title">All Code Templates</h2>
            <p className="ss-section-desc">From auth systems to full e-commerce platforms — find the perfect starting point for your next project.</p>
          </div>

          {/* Search */}
          <div className="ss-search-wrap">
            <span className="ss-search-icon">🔍</span>
            <input
              className="ss-search-input"
              placeholder="Search templates by name or tech stack..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="ss-filter-bar">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button key={cat} className={`ss-filter-btn ${activeCategory === cat ? 'ss-filter-active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="ss-template-grid">
            {filtered.map((template, i) => (
              <div className={`ss-template-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`} key={template.id}>
                <div className="ss-template-preview">
                  {template.image
                    ? <img src={template.image} alt={template.name} />
                    : <div className="ss-template-preview-placeholder">{template.emoji}</div>
                  }
                  <div className="ss-template-overlay">
                    {template.preview && (
                      <a href={template.preview} target="_blank" rel="noreferrer" className="ss-btn-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                        🔗 Live Preview
                      </a>
                    )}
                  </div>
                </div>
                <div className="ss-template-body">
                  <div className="ss-template-stack">
                    {template.stack.map(s => <span className="ss-stack-chip" key={s}>{s}</span>)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h3 className="ss-template-title" style={{ margin: 0 }}>{template.name}</h3>
                    <span className={`ss-product-card-badge ss-badge-${template.badge === 'bestseller' ? 'popular' : template.badge}`} style={{ position: 'static', flexShrink: 0 }}>{template.badge}</span>
                  </div>
                  <p className="ss-template-desc">{template.description}</p>
                  {/* Features */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {template.features.map(f => (
                      <span key={f} style={{ fontSize: '0.68rem', color: 'var(--ss-accent-green)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.2rem 0.55rem', borderRadius: 'var(--ss-radius-sm)', fontWeight: 600 }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                  <div className="ss-template-footer">
                    <div className="ss-product-price">
                      {template.price === 0
                        ? <span className="ss-product-price-free">Free</span>
                        : <>
                            <span className="ss-product-price-currency">₹</span>
                            <span className="ss-product-price-amount">{template.price}</span>
                            {template.oldPrice && <span className="ss-product-price-old">₹{template.oldPrice}</span>}
                          </>
                      }
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="ss-btn-ghost" style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}>Details</button>
                      <button className="ss-btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
                        {template.price === 0 ? '⬇ Download' : '🛒 Buy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ss-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
              <p>No templates found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── What Every Template Includes ────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">📦 What's Included</div>
            <h2 className="ss-section-title">Everything You Need to Ship</h2>
            <p className="ss-section-desc">No half-baked code. Every template is production-grade from day one.</p>
          </div>
          <div className="ss-features-grid">
            {[
              { icon: '📁', title: 'Full Source Code', desc: 'Frontend + Backend code organized in a clean folder structure with separation of concerns.' },
              { icon: '📖', title: 'Detailed README', desc: 'Step-by-step setup guide covering installation, environment configuration, and deployment.' },
              { icon: '🔑', title: '.env Configuration', desc: 'Complete .env.example with all required environment variables documented and explained.' },
              { icon: '🧪', title: 'Postman Collection', desc: 'Full Postman collection for all API endpoints with sample request/response data.' },
              { icon: '🔐', title: 'Security Best Practices', desc: 'Input validation, rate limiting, CORS configuration, helmet.js, and XSS protection built-in.' },
              { icon: '📱', title: 'Fully Responsive', desc: 'Mobile-first design that works perfectly on all screen sizes, from 320px to 4K.' },
              { icon: '🌙', title: 'Dark / Light Mode', desc: 'Theme system already implemented with context API and CSS variables.' },
              { icon: '🛠️', title: '30 Days Support', desc: 'Free bug-fix support for 30 days post-purchase via email.' },
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

      {/* ── Code Quality Standards ──────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">✅ Code Quality</div>
            <h2 className="ss-section-title">Built to Industry Standards</h2>
            <p className="ss-section-desc">Every template is reviewed against a 50-point quality checklist before release.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[
              { title: 'Code Structure', checks: ['MVC architecture', 'Separation of concerns', 'DRY principle', 'Clean imports', 'Consistent naming'] },
              { title: 'Performance', checks: ['Code splitting', 'Lazy loading', 'Memoization', 'Optimized re-renders', 'Bundle size awareness'] },
              { title: 'Security', checks: ['JWT implementation', 'Password hashing', 'Input sanitization', 'Rate limiting', 'CORS setup'] },
              { title: 'UI Quality', checks: ['Responsive layout', 'Accessible markup', 'Error states', 'Loading skeletons', 'Empty states'] },
              { title: 'Backend API', checks: ['RESTful design', 'Error middleware', 'Status codes', 'Validation', 'Pagination support'] },
              { title: 'Documentation', checks: ['README guide', 'API endpoints list', 'Schema documentation', 'Env config guide', 'Deployment steps'] },
            ].map((group, i) => (
              <div key={i} style={{ background: 'var(--ss-bg-card)', border: '1px solid var(--ss-border)', borderRadius: 'var(--ss-radius-md)', padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--ss-font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--ss-text-primary)', marginBottom: '1rem' }}>✅ {group.title}</div>
                {group.checks.map(check => (
                  <div key={check} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ss-text-secondary)', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--ss-accent-green)', fontSize: '0.75rem', flexShrink: 0 }}>✓</span>{check}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Testimonials ────────────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">💬 Reviews</div>
            <h2 className="ss-section-title">Developers Love These Templates</h2>
          </div>
          <div className="ss-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className={`ss-testimonial-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`} key={i}>
                <div className="ss-star-rating">{'★'.repeat(t.rating)}</div>
                <div className="ss-testimonial-quote">"</div>
                <p className="ss-testimonial-text">{t.text}</p>
                <div className="ss-testimonial-author">
                  <div className="ss-testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="ss-testimonial-name">{t.name}</div>
                    <div className="ss-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Process ─────────────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">⚙️ Getting Started</div>
            <h2 className="ss-section-title">From Purchase to Production</h2>
            <p className="ss-section-desc">Get your template running in under 30 minutes with this simple process.</p>
          </div>
          <div className="ss-process-steps">
            {[
              { title: 'Choose Your Template', desc: 'Browse by category, search by tech stack, or filter by price. All templates have live previews or video walkthroughs.' },
              { title: 'Purchase & Download', desc: 'Complete secure checkout. You willll receive an instant download link with the full source code ZIP and README.' },
              { title: 'Clone & Configure', desc: 'Clone the repo, run npm install, copy .env.example to .env, fill in your variables, and you are ready.' },
              { title: 'Customize & Brand', desc: 'Swap colors, logos, content, and business logic. The clean architecture makes customization intuitive.' },
              { title: 'Deploy & Go Live', desc: 'Follow the deployment guide to push to Vercel, Netlify, or Render in minutes. Your product is live!' },
            ].map((step, i) => (
              <div className="ss-process-step" key={i}>
                <div className="ss-process-num">{i + 1}</div>
                <div className="ss-process-content">
                  <div className="ss-process-title">{step.title}</div>
                  <div className="ss-process-desc">{step.desc}</div>
                </div>
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
            <h2 className="ss-section-title">Template FAQ</h2>
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
          <div className="ss-section-tag" style={{ marginBottom: '1rem' }}>🚀 Ship Faster</div>
          <h2 className="ss-cta-title">Stop Reinventing the Wheel</h2>
          <p className="ss-cta-desc">
            Every day you spend setting up boilerplate is a day you're not building features that matter.
            Get a production-ready template and start shipping in hours.
          </p>
          <div className="ss-cta-actions">
            <button className="ss-btn-primary">💻 Browse All Templates</button>
            <button className="ss-btn-secondary">🤝 Request Custom Build</button>
          </div>
        </div>
      </section>

    </div>
  );
}