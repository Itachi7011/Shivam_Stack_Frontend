import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const AdminPanelsCMS = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const dashboardFeatures = [
    {
      icon: '📊', title: 'Analytics Dashboard',
      desc: 'Real-time charts, KPI cards, revenue graphs, user growth trends, funnel analysis, and exportable reports. Built with Chart.js and Recharts.',
      bullets: ['Real-time data visualization', 'Custom date range filters', 'CSV/PDF export', 'Drill-down charts', 'Mobile-responsive layouts'],
    },
    {
      icon: '👥', title: 'User Management',
      desc: 'Complete user CRUD, role assignment, permission matrices, account suspension, activity logs, and bulk operations.',
      bullets: ['Role-Based Access Control (RBAC)', 'Permission matrices', 'Bulk user operations', 'Activity audit logs', 'Two-factor auth toggle'],
    },
    {
      icon: '📝', title: 'Content Management',
      desc: 'Rich text editors, media library, content scheduling, SEO meta fields, categories, tags, and multi-language support.',
      bullets: ['Rich text editor (TipTap/Quill)', 'Drag & drop media library', 'Content scheduling', 'SEO meta management', 'Multi-language support'],
    },
    {
      icon: '🛒', title: 'Order & Inventory',
      desc: 'Order processing pipeline, inventory tracking, stock alerts, supplier management, and automated reorder triggers.',
      bullets: ['Order status pipeline', 'Low-stock alerts', 'Supplier management', 'Automated reorders', 'Inventory history logs'],
    },
    {
      icon: '💬', title: 'Support & CRM',
      desc: 'Ticket management, live chat integration, customer notes, follow-up reminders, and customer lifetime value tracking.',
      bullets: ['Support ticket system', 'Customer notes & history', 'Follow-up reminders', 'CLV tracking', 'Email templates'],
    },
    {
      icon: '⚙️', title: 'System Settings',
      desc: 'App-wide configuration, feature flags, email templates, webhook management, API key generation, and maintenance mode.',
      bullets: ['Feature flag system', 'Email template editor', 'Webhook configuration', 'API key management', 'Maintenance mode toggle'],
    },
  ];

  const cmsOptions = [
    {
      name: 'Custom CMS', icon: '🔧', best: 'Complete control',
      desc: 'Built from scratch, tailored 100% to your workflow. No unnecessary features, no bloat. Every field, every workflow designed for your specific needs.',
      pros: ['100% custom fields', 'No bloat', 'Fits your workflow exactly', 'Full source ownership'],
    },
    {
      name: 'Sanity CMS', icon: '📐', best: 'Content-heavy sites',
      desc: 'Headless CMS with a real-time collaborative editor, GROQ queries, and a customizable Studio. Perfect for blogs, news sites, and marketing teams.',
      pros: ['Real-time collaboration', 'GROQ query language', 'Portable text (rich content)', 'CDN-hosted assets'],
    },
    {
      name: 'Strapi CMS', icon: '🚀', best: 'API-first approach',
      desc: 'Self-hosted, open-source headless CMS with auto-generated REST and GraphQL APIs. Great for multi-platform content delivery.',
      pros: ['Auto-generated APIs', 'Self-hosted', 'Plugin ecosystem', 'Multi-database support'],
    },
  ];

  const adminTypes = [
    { icon: '🏪', title: 'E-Commerce Admin', desc: 'Product catalog, order management, customer database, discount codes, shipping rules, and sales analytics.', tags: ['Orders', 'Products', 'Customers', 'Analytics'] },
    { icon: '📰', title: 'Blog / News Portal', desc: 'Article editor, category management, author profiles, comment moderation, SEO dashboard, and traffic analytics.', tags: ['Editor', 'SEO', 'Comments', 'Authors'] },
    { icon: '🏥', title: 'Healthcare Portal', desc: 'Patient records, appointment scheduling, doctor dashboards, prescription management, and HIPAA-compliant audit logs.', tags: ['Records', 'Scheduling', 'HIPAA', 'Reports'] },
    { icon: '🎓', title: 'EdTech Platform', desc: 'Course builder, student progress tracking, quiz management, certificate generation, and instructor dashboards.', tags: ['Courses', 'Progress', 'Quizzes', 'Certs'] },
    { icon: '🏨', title: 'Booking / Hotel', desc: 'Room/resource availability calendar, booking management, pricing rules, guest profiles, and housekeeping task boards.', tags: ['Calendar', 'Bookings', 'Pricing', 'Guests'] },
    { icon: '📦', title: 'SaaS Platform Admin', desc: 'Subscription management, feature flags, usage analytics, billing history, and support ticket routing.', tags: ['Subscriptions', 'Usage', 'Billing', 'Flags'] },
  ];

  const faqs = [
    { q: 'Can I manage this admin panel without any technical knowledge?', a: 'Absolutely. That\'s the point. I build admin panels for non-technical business owners. The UI is intuitive — if you can use Excel or Gmail, you can use the admin panel I build for you.' },
    { q: 'Can multiple admins use it simultaneously?', a: 'Yes. I implement role-based access so you can have Super Admins, Admins, Editors, and Viewers, each with different permissions. Changes are tracked with audit logs showing who did what and when.' },
    { q: 'Is it mobile-friendly?', a: 'Yes. All admin panels are fully responsive. While they\'re optimized for desktop (where most management happens), they work perfectly on tablets and phones too.' },
    { q: 'Can I export data from the admin panel?', a: 'Yes. I build CSV, Excel, and PDF export functionality into data tables by default. You can always download your data.' },
    { q: 'What if I need a new feature added later?', a: 'Admin panels are modular by design. Adding a new section or feature later is straightforward. I document the architecture so any developer can extend it.' },
    { q: 'Can you connect the admin panel to my existing backend?', a: 'Yes. If you have an existing API, I can build the admin panel as a standalone React app that connects to your existing endpoints.' },
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
            <div className="shivam-stack-hero-left">
              <a href="/services" className="shivam-stack-fsd-breadcrumb">← All Services</a>
              <span className="shivam-stack-hero-badge">
                <span className="shivam-stack-hero-badge-dot" />
                Admin Panels & CMS
              </span>
              <h1 className="shivam-stack-hero-title">
                Dashboards That{' '}
                <span className="shivam-stack-hero-title-gradient">Run Your Business</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                Custom-built admin panels and content management systems designed around your workflow. Not generic templates — real tools your team will actually enjoy using.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Build My Dashboard</a>
                <a href="#admin-features" className="shivam-stack-btn shivam-stack-btn--secondary">Explore Features →</a>
              </div>
            </div>

            <div className="shivam-stack-hero-visual">
              <div className="shivam-stack-hero-visual-inner">
                <div className="shivam-stack-admin-feature-visual">
                  <div className="shivam-stack-admin-sidebar-mock">
                    <div className="shivam-stack-admin-sidebar-list">
                      {['Dashboard', 'Users', 'Orders', 'Products', 'Content', 'Analytics', 'Settings'].map((item, i) => (
                        <div key={i} className={`shivam-stack-admin-sidebar-item ${i === 0 ? 'shivam-stack-admin-sidebar-item--active' : ''}`}>{item}</div>
                      ))}
                    </div>
                    <div className="shivam-stack-admin-content-mock">
                      <div className="shivam-stack-admin-mock-header" />
                      <div className="shivam-stack-admin-mock-grid">
                        {[0, 1, 2].map(i => <div key={i} className="shivam-stack-admin-mock-stat" />)}
                      </div>
                      <div className="shivam-stack-admin-mock-table" />
                    </div>
                  </div>
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--2">
                  <span className="shivam-stack-floating-badge-icon">🛡️</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">RBAC Permissions</div>
                    <div className="shivam-stack-floating-badge-sub">Role-based access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD FEATURES INTERACTIVE ── */}
      <section className="shivam-stack-section" id="admin-features">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label"></div>
            <h2 className="shivam-stack-section-title">Every Module You Need</h2>
            <p className="shivam-stack-section-desc">Each module is purpose-built, beautifully designed, and deeply functional.</p>
          </div>

          <div className="shivam-stack-admin-feature-explorer">
            <div className="shivam-stack-admin-feature-nav">
              {dashboardFeatures.map((f, i) => (
                <button key={i} className={`shivam-stack-admin-feature-nav-btn ${activeFeature === i ? 'shivam-stack-admin-feature-nav-btn--active' : ''}`} onClick={() => setActiveFeature(i)}>
                  <span>{f.icon}</span> {f.title}
                </button>
              ))}
            </div>
            <div className="shivam-stack-admin-feature-detail">
              <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--landscape" style={{ marginBottom: '1.5rem' }}>
                <div className="shivam-stack-img-placeholder">
                  <span className="shivam-stack-img-placeholder-icon">{dashboardFeatures[activeFeature].icon}</span>
                  <span className="shivam-stack-img-placeholder-text">{dashboardFeatures[activeFeature].title} Preview</span>
                </div>
              </div>
              <h3 className="shivam-stack-section-title" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', marginBottom: '0.75rem' }}>{dashboardFeatures[activeFeature].title}</h3>
              <p className="shivam-stack-card-text" style={{ marginBottom: '1.25rem' }}>{dashboardFeatures[activeFeature].desc}</p>
              <div className="shivam-stack-tech-grid">
                {dashboardFeatures[activeFeature].bullets.map((b, i) => (
                  <span key={i} className="shivam-stack-tech-badge"><span className="shivam-stack-tech-badge-dot" />{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADMIN TYPES ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label"></div>
            <h2 className="shivam-stack-section-title">Admin Panels for Every Industry</h2>
            <p className="shivam-stack-section-desc">Tailored dashboard solutions for your specific business domain.</p>
          </div>
          <div className="shivam-stack-grid-3">
            {adminTypes.map((t, i) => (
              <div key={i} className="shivam-stack-card">
                <div className="shivam-stack-card-icon">{t.icon}</div>
                <div className="shivam-stack-card-title">{t.title}</div>
                <div className="shivam-stack-card-text" style={{ marginBottom: '1.25rem' }}>{t.desc}</div>
                <div className="shivam-stack-tech-grid" style={{ marginTop: 0 }}>
                  {t.tags.map((tag, j) => <span key={j} className="shivam-stack-tech-badge">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CMS OPTIONS ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label"></div>
            <h2 className="shivam-stack-section-title">Custom CMS vs Headless CMS</h2>
            <p className="shivam-stack-section-desc">I'll help you choose the right approach based on your needs and team's workflow.</p>
          </div>
          <div className="shivam-stack-grid-3">
            {cmsOptions.map((opt, i) => (
              <div key={i} className="shivam-stack-pricing-card">
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{opt.icon}</div>
                <div className="shivam-stack-fsd-tech-name" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', marginBottom: '0.3rem' }}>{opt.name}</div>
                <div className="shivam-stack-tech-badge" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Best for: {opt.best}</div>
                <div className="shivam-stack-pricing-divider" />
                <p className="shivam-stack-card-text" style={{ marginBottom: '1.25rem' }}>{opt.desc}</p>
                <ul className="shivam-stack-pricing-features">
                  {opt.pros.map((p, j) => <li key={j} className="shivam-stack-pricing-feature-item"><span className="shivam-stack-pricing-check">✓</span> {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOT GALLERY ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// visual showcase</div>
            <h2 className="shivam-stack-section-title">Dashboard Screenshots</h2>
            <p className="shivam-stack-section-desc">A glimpse at the quality and detail that goes into every admin panel.</p>
          </div>
          <div className="shivam-stack-portfolio-showcase-grid">
            {[
              { title: 'E-Commerce Dashboard', wide: true },
              { title: 'Analytics Module', wide: false },
              { title: 'User Management', wide: false },
              { title: 'CMS Editor', wide: false },
              { title: 'Reports & Exports', wide: true },
            ].map((p, i) => (
              <div key={i} className={`shivam-stack-portfolio-showcase-card ${p.wide ? 'shivam-stack-portfolio-showcase-grid-item--wide' : ''}`} style={{ minHeight: 220 }}>
                <div className="shivam-stack-img-wrapper" style={{ height: '100%', minHeight: 200 }}>
                  <div className="shivam-stack-img-placeholder">
                    <span className="shivam-stack-img-placeholder-icon">🖼️</span>
                    <span className="shivam-stack-img-placeholder-text">{p.title}</span>
                  </div>
                </div>
                <div className="shivam-stack-portfolio-showcase-overlay">
                  <div className="shivam-stack-portfolio-showcase-info">
                    <div className="shivam-stack-portfolio-showcase-title">{p.title}</div>
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
            <div className="shivam-stack-section-label"></div>
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
          <h2 className="shivam-stack-cta-title">Need a Dashboard That <span className="shivam-stack-hero-title-gradient">Actually Works?</span></h2>
          <p className="shivam-stack-cta-desc">Let's design an admin panel built around how your team actually works — not a template you have to fight with.</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Start the Conversation</a>
            <a href="/services" className="shivam-stack-btn shivam-stack-btn--secondary">← All Services</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminPanelsCMS;