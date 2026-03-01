import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const PortfolioWebsites = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeStyle, setActiveStyle] = useState(0);

  const portfolioStyles = [
    {
      name: 'Developer Portfolio',
      icon: '💻',
      audience: 'Software engineers, developers',
      desc: 'Code-focused portfolios with syntax highlighting, GitHub stats, tech stack showcases, project case studies, and a blog for technical writing.',
      features: ['GitHub Integration', 'Live Project Links', 'Tech Stack Section', 'Blog with MDX', 'Dark/Light Toggle'],
      preview: '💻',
    },
    {
      name: 'Designer Portfolio',
      icon: '🎨',
      audience: 'UI/UX designers, creatives',
      desc: 'Visual-first portfolios with full-screen case studies, smooth scrolling transitions, custom cursor, and a curated gallery layout that lets the work speak.',
      features: ['Full-Screen Gallery', 'Case Study Pages', 'Custom Cursor', 'Smooth Transitions', 'Figma Embeds'],
      preview: '🎨',
    },
    {
      name: 'Business Portfolio',
      icon: '💼',
      audience: 'Agencies, consultants, freelancers',
      desc: 'Professional business sites with service pages, client testimonials, case studies, pricing, contact forms, and lead capture designed to convert visitors to clients.',
      features: ['Service Pages', 'Client Testimonials', 'Pricing Section', 'Lead Capture', 'WhatsApp Integration'],
      preview: '💼',
    },
    {
      name: 'Photography Portfolio',
      icon: '📷',
      audience: 'Photographers, videographers',
      desc: 'Image-heavy portfolios with optimized galleries, lightbox viewers, category filtering, lazy loading, and enquiry forms — looking stunning on every screen.',
      features: ['Masonry Gallery', 'Lightbox Viewer', 'Category Filter', 'Lazy Loading', 'Enquiry Forms'],
      preview: '📷',
    },
  ];

  const features = [
    { icon: '🎭', title: '3D & Motion Design', desc: 'Three.js, GSAP, and Framer Motion for scroll-triggered animations, 3D elements, particle effects, and micro-interactions that make visitors stop and explore.' },
    { icon: '🌗', title: 'Dark / Light Mode', desc: 'Smooth theme switching with CSS custom properties. Respects system preference on first visit. User preference saved to localStorage.' },
    { icon: '⚡', title: 'Blazing Performance', desc: 'Static site generation with Next.js, image optimization, font subsetting, and Lighthouse 95+ scores. Loads in under 1 second on 4G.' },
    { icon: '🔍', title: 'Full SEO Setup', desc: 'Meta tags, Open Graph for social sharing, JSON-LD structured data, XML sitemap, robots.txt, and canonical URLs — discoverable from day one.' },
    { icon: '📝', title: 'Blog Integration', desc: 'Markdown/MDX blog with syntax highlighting for code, tag filtering, reading time, estimated read counts, and RSS feed generation.' },
    { icon: '📬', title: 'Contact Forms', desc: 'Working contact forms with Nodemailer/EmailJS, spam protection via hCaptcha/reCAPTCHA, and email notifications delivered directly to your inbox.' },
    { icon: '📊', title: 'Analytics', desc: 'Google Analytics 4 or Plausible (privacy-first) integration. Track page views, bounce rates, which projects get the most clicks, and visitor countries.' },
    { icon: '📱', title: 'PWA Ready', desc: 'Installable as a Progressive Web App. Works offline with service workers. Full-screen mode on mobile for an app-like experience.' },
  ];

  const technologies = [
    { icon: '⚛️', name: 'React.js', purpose: 'UI Framework' },
    { icon: '▲', name: 'Next.js', purpose: 'SSG/SSR' },
    { icon: '🎨', name: 'Tailwind CSS', purpose: 'Styling' },
    { icon: '🎭', name: 'Framer Motion', purpose: 'Animations' },
    { icon: '🌐', name: 'Three.js', purpose: '3D Graphics' },
    { icon: '✨', name: 'GSAP', purpose: 'Advanced Anim.' },
    { icon: '📝', name: 'MDX', purpose: 'Blog Content' },
    { icon: '🚀', name: 'Vercel', purpose: 'Hosting' },
  ];

  const showcaseItems = [
    { title: 'Full-Page Portfolio — Hero Section', wide: true },
    { title: 'Projects Gallery', wide: false },
    { title: 'About & Skills', wide: false },
    { title: 'Blog Section', wide: false },
    { title: 'Contact Section — Mobile View', wide: true },
  ];

  const faqs = [
    { q: 'Can I update my portfolio content myself?', a: 'Yes. I build portfolios with a headless CMS (Sanity or Contentful) or markdown files so you can add projects, blog posts, and update content without touching code. For simpler sites, I document exactly which files to edit.' },
    { q: 'Do you use templates?', a: 'Never. Every portfolio is designed and built from scratch, tailored to your personality, industry, and the kind of work you want to attract. You\'ll have a completely unique website.' },
    { q: 'Can I use a custom domain?', a: 'Yes. Domain purchase, DNS configuration, SSL certificate, and Vercel/Netlify deployment are all included. You\'ll have your portfolio live at yourdomain.com.' },
    { q: 'How long does a portfolio website take?', a: 'Simple portfolios take 1–2 weeks. Feature-rich portfolios with 3D elements, blog, and CMS take 3–4 weeks. Timeline depends on how quickly you provide content and feedback.' },
    { q: 'Can you add animation effects?', a: 'Absolutely — that\'s one of my specialties. Scroll-triggered animations with GSAP, page transitions with Framer Motion, 3D hero sections with Three.js. Tell me the vibe you want and I\'ll bring it to life.' },
    { q: 'Will my portfolio be fast enough to not hurt my rankings?', a: 'Yes. All portfolios target Lighthouse scores of 95+ for Performance, 100 for SEO, 95+ for Accessibility. Core Web Vitals are optimized from the start — not an afterthought.' },
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
                Portfolio Websites
              </span>
              <h1 className="shivam-stack-hero-title">
                Your Work Deserves a{' '}
                <span className="shivam-stack-hero-title-gradient">Stunning Stage</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                Custom portfolio websites with 3D animations, smooth transitions, dark mode, and blazing performance. Not templates — unique digital identities built specifically for you.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Build My Portfolio</a>
                <a href="#portfolio-showcase" className="shivam-stack-btn shivam-stack-btn--secondary">See Examples →</a>
              </div>
            </div>

            <div className="shivam-stack-hero-visual">
              <div className="shivam-stack-hero-visual-inner">
                <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--hero">
                  <div className="shivam-stack-img-placeholder">
                    <span className="shivam-stack-img-placeholder-icon">💼</span>
                    <span className="shivam-stack-img-placeholder-text">Portfolio Website Preview</span>
                  </div>
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--2">
                  <span className="shivam-stack-floating-badge-icon">⚡</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">100 Lighthouse</div>
                    <div className="shivam-stack-floating-badge-sub">Performance score</div>
                  </div>
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--1">
                  <span className="shivam-stack-floating-badge-icon">🎭</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">3D Animations</div>
                    <div className="shivam-stack-floating-badge-sub">GSAP + Three.js</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO STYLES ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// portfolio types</div>
            <h2 className="shivam-stack-section-title">Built for Your Profession</h2>
            <p className="shivam-stack-section-desc">Different professions need different portfolio approaches. I tailor every website to your specific audience and goals.</p>
          </div>

          <div className="shivam-stack-portfolio-style-selector">
            {portfolioStyles.map((style, i) => (
              <button key={i} className={`shivam-stack-portfolio-style-btn ${activeStyle === i ? 'shivam-stack-portfolio-style-btn--active' : ''}`} onClick={() => setActiveStyle(i)}>
                <span>{style.icon}</span> {style.name}
              </button>
            ))}
          </div>

          <div className="shivam-stack-portfolio-style-detail">
            <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--landscape">
              <div className="shivam-stack-img-placeholder">
                <span className="shivam-stack-img-placeholder-icon" style={{ fontSize: '4rem' }}>{portfolioStyles[activeStyle].preview}</span>
                <span className="shivam-stack-img-placeholder-text">{portfolioStyles[activeStyle].name} Preview</span>
              </div>
            </div>
            <div className="shivam-stack-portfolio-style-info">
              <div className="shivam-stack-section-label">For: {portfolioStyles[activeStyle].audience}</div>
              <h3 className="shivam-stack-section-title" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', margin: '0.5rem 0 1rem' }}>{portfolioStyles[activeStyle].name}</h3>
              <p className="shivam-stack-card-text" style={{ marginBottom: '1.5rem' }}>{portfolioStyles[activeStyle].desc}</p>
              <div className="shivam-stack-tech-grid" style={{ marginTop: 0 }}>
                {portfolioStyles[activeStyle].features.map((f, j) => (
                  <span key={j} className="shivam-stack-tech-badge"><span className="shivam-stack-tech-badge-dot" />{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// what's included</div>
            <h2 className="shivam-stack-section-title">Built to Impress, Built to Last</h2>
            <p className="shivam-stack-section-desc">Every portfolio I build includes these features as standard — no upsells, no extras.</p>
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

      {/* ── SHOWCASE ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }} id="portfolio-showcase">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// portfolio screenshots</div>
            <h2 className="shivam-stack-section-title">Examples from My Work</h2>
            <p className="shivam-stack-section-desc">A glimpse at portfolio websites I've crafted for developers, designers, and businesses.</p>
          </div>
          <div className="shivam-stack-portfolio-showcase-grid">
            {showcaseItems.map((item, i) => (
              <div key={i} className={`shivam-stack-portfolio-showcase-card ${item.wide ? 'shivam-stack-portfolio-showcase-grid-item--wide' : ''}`} style={{ minHeight: 240 }}>
                <div className="shivam-stack-img-wrapper" style={{ height: '100%', minHeight: 220 }}>
                  <div className="shivam-stack-img-placeholder">
                    <span className="shivam-stack-img-placeholder-icon">🖼️</span>
                    <span className="shivam-stack-img-placeholder-text">{item.title}</span>
                  </div>
                </div>
                <div className="shivam-stack-portfolio-showcase-overlay">
                  <div className="shivam-stack-portfolio-showcase-info">
                    <div className="shivam-stack-portfolio-showcase-title">{item.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH USED ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// built with</div>
            <h2 className="shivam-stack-section-title">The Tech Behind the Magic</h2>
          </div>
          <div className="shivam-stack-all-services-stack-row">
            {technologies.map((t, i) => (
              <div key={i} className="shivam-stack-all-services-stack-item">
                <span className="shivam-stack-all-services-stack-icon">{t.icon}</span>
                <div className="shivam-stack-all-services-stack-name">{t.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--ss-accent-primary)', fontFamily: 'var(--ss-font-mono)', marginTop: '0.25rem' }}>{t.purpose}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
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
          <h2 className="shivam-stack-cta-title">Ready for a Portfolio That <span className="shivam-stack-hero-title-gradient">Wins Work?</span></h2>
          <p className="shivam-stack-cta-desc">Your portfolio is your most powerful marketing tool. Let's build one that makes clients say "I need to hire this person."</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Build My Portfolio</a>
            <a href="/services" className="shivam-stack-btn shivam-stack-btn--secondary">← All Services</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PortfolioWebsites;