import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

// ─── Dummy Data (replace with API: /api/public/products & /api/public/projects) ─────────────────
const ALL_PRODUCTS_DATA = {
  products: [
    { id: 1, name: 'AuthNester – Full Auth Boilerplate', slug: 'authnester', category: 'Code Templates', price: 499, oldPrice: 799, badge: 'popular', tags: ['Node.js', 'JWT', 'Express', 'MongoDB'], description: 'Production-ready authentication system with JWT, OAuth2, email verification, password reset, and role-based access control. Plug & play into any MERN project.', image: null, emoji: '🔐', link: 'https://authnester.netlify.app/', stock: 50 },
    { id: 2, name: 'Tukka Time – Food Delivery App', slug: 'tukka-time', category: 'Projects', price: 999, oldPrice: 1499, badge: 'new', tags: ['React', 'Node.js', 'MongoDB', 'Stripe'], description: 'A complete food delivery web application with real-time order tracking, cart, Stripe payment gateway, vendor dashboard, and admin panel.', image: null, emoji: '🍜', link: 'https://tukka-time.netlify.app/', stock: 20 },
    { id: 3, name: 'ApplyArc – Job Portal System', slug: 'apply-arc', category: 'Projects', price: 1199, oldPrice: 1799, badge: 'pro', tags: ['MERN', 'Redux', 'Cloudinary', 'Nodemailer'], description: 'End-to-end job portal with candidate profiles, company listings, application tracking, email notifications, and resume uploads.', image: null, emoji: '💼', link: 'https://apply-arc-job.netlify.app/', stock: 15 },
    { id: 4, name: 'OtakuWave – Anime Platform UI', slug: 'otaku-wave', category: 'Code Templates', price: 299, oldPrice: null, badge: 'free', tags: ['React', 'CSS', 'API', 'Tailwind'], description: 'Anime browsing and watchlist platform with beautiful card layouts, anime search, dark/light mode, and smooth animations.', image: null, emoji: '⛩️', link: 'https://otaku-wave.netlify.app/', stock: 999 },
    { id: 5, name: 'FinanceFolio – Finance Dashboard', slug: 'finance-folio', category: 'Projects', price: 799, oldPrice: 1099, badge: 'popular', tags: ['React', 'Chart.js', 'Node.js', 'MongoDB'], description: 'Personal finance tracker with income/expense charts, budget planning, savings goals, and detailed transaction history reports.', image: null, emoji: '📊', link: 'https://finance-folio.netlify.app/', stock: 30 },
    { id: 6, name: 'MarketAI Pro – AI Marketing Tool', slug: 'market-ai-pro', category: 'Projects', price: 1499, oldPrice: 2499, badge: 'pro', tags: ['React', 'OpenAI', 'Node.js', 'MongoDB'], description: 'AI-powered marketing copy generator with social media posts, ad scripts, blog outlines, email campaigns, and SEO meta generation.', image: null, emoji: '🤖', link: 'https://market-ai-pro.netlify.app/', stock: 10 },
    { id: 7, name: 'Text to PDF Converter', slug: 'text-to-pdf', category: 'Tools', price: 0, oldPrice: null, badge: 'free', tags: ['Node.js', 'Express', 'PDFKit', 'React'], description: 'Convert any text, markdown, or HTML content to beautiful PDFs with custom fonts, headers, page numbers, and watermarks.', image: null, emoji: '📄', link: 'https://text-to-pdf-converting-website.onrender.com/', stock: 999 },
    { id: 8, name: 'InstantHooks – React Hooks Library', slug: 'instant-hooks', category: 'Code Templates', price: 399, oldPrice: 599, badge: 'new', tags: ['React', 'TypeScript', 'Hooks', 'npm'], description: '50+ production-ready custom React hooks for common patterns: useDebounce, useLocalStorage, useIntersection, useAsync, useDarkMode, and many more.', image: null, emoji: '🪝', link: 'https://instant-hooks.netlify.app/', stock: 999 },
    { id: 9, name: 'Online Banking Clone', slug: 'online-banking', category: 'Projects', price: 899, oldPrice: 1299, badge: 'pro', tags: ['MERN', 'JWT', 'Bcrypt', 'Tailwind'], description: 'Full banking web application UI with account management, fund transfers, transaction history, statements, and admin panel.', image: null, emoji: '🏦', link: 'https://onlinebankingclone.netlify.app/', stock: 20 },
    { id: 10, name: 'MediSphere – Healthcare Portal', slug: 'medi-sphere', category: 'Projects', price: 1299, oldPrice: 1999, badge: 'popular', tags: ['MERN', 'Socket.io', 'Cloudinary', 'Nodemailer'], description: 'Healthcare management platform with patient records, appointment booking, doctor profiles, medical history, and prescription tracking.', image: null, emoji: '🏥', link: 'https://medi-sphere.netlify.app/', stock: 12 },
    { id: 11, name: 'Jagdamba Law Firm Website', slug: 'jagdamba-lawfirm', category: 'Projects', price: 599, oldPrice: null, badge: 'new', tags: ['React', 'EmailJS', 'Framer Motion', 'SEO'], description: 'Professional law firm website with practice areas, attorney profiles, case enquiry form, blog, and Google Maps integration.', image: null, emoji: '⚖️', link: 'https://jagdamba-lawfirm.netlify.app/', stock: 999 },
    { id: 12, name: 'E-Commerce Demo Store', slug: 'e-commerce-demo', category: 'Projects', price: 999, oldPrice: 1499, badge: 'popular', tags: ['MERN', 'Redux', 'Stripe', 'Cloudinary'], description: 'Full-featured e-commerce store with product catalog, cart, wishlist, Stripe payments, admin CRUD, order management, and coupon system.', image: null, emoji: '🛒', link: 'https://e-commerce-shivam-demo.netlify.app/', stock: 25 },
    { id: 13, name: 'TickleBox – Games & Quizzes', slug: 'ticklebox', category: 'Tools', price: 0, oldPrice: null, badge: 'free', tags: ['HTML', 'CSS', 'JavaScript', 'Canvas'], description: '20+ interactive mini-games and quizzes built with pure JavaScript – trivia, memory match, word puzzles, reaction games, and more.', image: null, emoji: '🎮', link: 'https://ticklebox.netlify.app/games/quiz.html', stock: 999 },
    { id: 14, name: 'Legitixy – India Legal Hub', slug: 'legitixy', category: 'Projects', price: 499, oldPrice: 799, badge: 'new', tags: ['React', 'Node.js', 'MongoDB', 'SEO'], description: 'Comprehensive legal information platform covering IPC, CrPC, property laws, consumer rights, RTI, and court procedures for all of India.', image: null, emoji: '📜', link: 'https://legitixy.netlify.app', stock: 50 },
  ]
};

const CATEGORIES = ['All', 'Projects', 'Code Templates', 'Tools', 'E-Books', 'Resources'];

const TESTIMONIALS = [
  { name: 'Rohit Sharma', role: 'Startup Founder', text: 'Shivam delivered the entire MERN stack backend in 3 days, clean code with proper documentation. Absolutely top-notch.', rating: 5, initials: 'RS' },
  { name: 'Priya Mehta', role: 'Frontend Developer', text: 'The React hooks library saved me weeks of work. The code quality and documentation are exceptional.', rating: 5, initials: 'PM' },
  { name: 'Alex Turner', role: 'Tech Lead', text: 'Best developer I havve hired on the platform. The codebase he delivered was production-ready from day one.', rating: 5, initials: 'AT' },
  { name: 'Sneha Gupta', role: 'UI/UX Designer', text: 'Shivam translated my designs into pixel-perfect React components with perfect responsiveness. Will hire again!', rating: 5, initials: 'SG' },
  { name: 'Vikram Nair', role: 'Product Manager', text: 'Delivered the healthcare portal on time with every feature we asked for. Excellent communication throughout.', rating: 5, initials: 'VN' },
  { name: 'Meera Patel', role: 'E-Commerce Owner', text: 'The online store he built handles 500+ daily orders. Performance, SEO, and UX are all top class.', rating: 5, initials: 'MP' },
];

const WHY_ME_FEATURES = [
  { icon: '⚡', title: 'Lightning Fast Delivery', desc: 'Most projects delivered within 3–7 business days. I respect deadlines and communicate progress daily.' },
  { icon: '🧹', title: 'Clean, Scalable Code', desc: 'Production-ready, well-commented, and documented code that your team can extend without headaches.' },
  { icon: '🔒', title: 'Security First', desc: 'Every project includes JWT auth, input sanitization, rate limiting, and CORS configuration as standard.' },
  { icon: '📱', title: 'Fully Responsive', desc: 'All UIs are pixel-perfect on mobile, tablet, and desktop with dark/light mode support built-in.' },
  { icon: '♻️', title: 'Free Revisions', desc: 'I offer free revisions post-delivery to ensure you are 100% satisfied with the final product.' },
  { icon: '🤝', title: 'Long-Term Support', desc: '30 days of free bug fixes post-delivery. I am also available for retainer-based ongoing support.' },
  { icon: '🌐', title: 'Full-Stack Expertise', desc: 'From MongoDB schema design to React UI to Node.js APIs to deployment on Render, Vercel, or Netlify.' },
  { icon: '💡', title: 'Creative Problem Solver', desc: 'I do not just code what you ask — I proactively suggest better architecture, UX patterns, and performance improvements.' },
];

const TECH_STACK_ITEMS = ['MongoDB','Express.js','React.js','Node.js','Redux','TypeScript','Next.js','Tailwind CSS','Socket.io','JWT','Cloudinary','Stripe','Nodemailer','AWS S3','Docker','Git','REST API','GraphQL','Redis','PostgreSQL'];

export default function AllProducts() {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filtered = ALL_PRODUCTS_DATA.products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const faqs = [
    { q: 'Can I request custom features in any of your projects?', a: 'Absolutely. Every product can be customized to fit your needs. Contact me via email or the hire form and we will discuss scope, timeline, and pricing.' },
    { q: 'Do I get the full source code?', a: 'Yes. All purchases include 100% full source code, project setup instructions, a README, and .env configuration guidance.' },
    { q: 'Which tech stack do you primarily work with?', a: 'I specialize in the MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript, Tailwind CSS, Redux, Socket.io, and integrations with Stripe, Cloudinary, and more.' },
    { q: 'Do you offer refunds?', a: 'Due to the digital nature of code products, refunds are not available. However, I offer free revisions until you are satisfied. Please review previews carefully before purchasing.' },
    { q: 'Can you deploy the project for me?', a: 'Yes, deployment assistance is available as an add-on. I can deploy to Vercel, Netlify, Render, Railway, or AWS depending on your stack.' },
    { q: 'How do I get support after purchase?', a: 'All purchases include 30 days of free bug-fix support via email. Extended support plans are available for monthly retainers.' },
  ];

  return (
    <div className={`ss-page-wrapper ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="ss-page-hero">
        <div className="ss-page-hero-grid-bg" />
        <div className="ss-page-hero-content ss-animate-in">
          <div className="ss-page-hero-eyebrow">
            <span className="ss-page-hero-eyebrow-dot" />
            Shivam Stack · MERN Developer
          </div>
          <h1 className="ss-page-hero-title">
            All Products &<br />
            <span className="ss-page-hero-title-accent">Digital Assets</span>
          </h1>
          <p className="ss-page-hero-subtitle">
            Browse all of Shivam's handcrafted MERN stack projects, code templates, hooks libraries,
            e-books, and tools — built for developers who ship fast and build smart.
          </p>
          <div className="ss-page-hero-stats">
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">14<span>+</span></div>
              <div className="ss-page-hero-stat-label">Live Products</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">500<span>+</span></div>
              <div className="ss-page-hero-stat-label">Happy Clients</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">3<span>yrs</span></div>
              <div className="ss-page-hero-stat-label">Experience</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">5<span>★</span></div>
              <div className="ss-page-hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ─────────────────────────────────── */}
      <div className="ss-marquee-wrap">
        <div className="ss-marquee-track">
          {[...TECH_STACK_ITEMS, ...TECH_STACK_ITEMS].map((item, i) => (
            <div className="ss-marquee-item" key={i}>
              <span className="ss-marquee-dot" />{item}
            </div>
          ))}
        </div>
      </div>

      {/* ── Info Banner ──────────────────────────────── */}
      <section className="ss-section" style={{ paddingBottom: 0 }}>
        <div className="ss-container">
          <div className="ss-info-banner ss-animate-in">
            <span className="ss-info-banner-icon">🎁</span>
            <div className="ss-info-banner-text">
              <strong>Limited Time:</strong> Get 30% off on any 2+ product bundle. Use code <strong>STACK30</strong> at checkout. All prices in INR.
            </div>
          </div>
        </div>
      </section>

      {/* ── All Products ─────────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">📦 All Products</div>
            <h2 className="ss-section-title">Everything You Need to Build Faster</h2>
            <p className="ss-section-desc">Complete MERN projects, hooks, templates, and tools — all production-ready.</p>
          </div>

          {/* Search */}
          <div className="ss-search-wrap">
            <span className="ss-search-icon">🔍</span>
            <input
              className="ss-search-input"
              placeholder="Search products by name or tech..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="ss-filter-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`ss-filter-btn ${activeCategory === cat ? 'ss-filter-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="ss-product-grid">
            {filtered.map((product, i) => (
              <div className={`ss-product-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`} key={product.id}>
                <div className="ss-product-card-image-wrap">
                  {product.image
                    ? <img src={product.image} alt={product.name} />
                    : <div className="ss-product-card-image-placeholder">{product.emoji}</div>
                  }
                  <span className={`ss-product-card-badge ss-badge-${product.badge}`}>{product.badge}</span>
                </div>
                <div className="ss-product-card-body">
                  <div className="ss-product-card-category">{product.category}</div>
                  <h3 className="ss-product-card-title">{product.name}</h3>
                  <p className="ss-product-card-desc">{product.description}</p>
                  <div className="ss-product-card-tags">
                    {product.tags.map(t => <span className="ss-product-tag" key={t}>{t}</span>)}
                  </div>
                  <div className="ss-product-card-footer">
                    <div className="ss-product-price">
                      {product.price === 0
                        ? <span className="ss-product-price-free">Free</span>
                        : <>
                            <span className="ss-product-price-currency">₹</span>
                            <span className="ss-product-price-amount">{product.price}</span>
                            {product.oldPrice && <span className="ss-product-price-old">₹{product.oldPrice}</span>}
                          </>
                      }
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={product.link} target="_blank" rel="noreferrer" className="ss-btn-ghost">Preview</a>
                      <button className="ss-btn-primary">
                        {product.price === 0 ? 'Download' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ss-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p>No products found matching your search.</p>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="ss-pagination">
            <button className="ss-page-btn ss-page-btn-active">1</button>
            <button className="ss-page-btn">2</button>
            <button className="ss-page-btn">3</button>
            <button className="ss-page-btn">›</button>
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Why Choose Me ─────────────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🌟 Why Shivam Stack</div>
            <h2 className="ss-section-title">Developer You Can Trust</h2>
            <p className="ss-section-desc">More than just code — I deliver reliable, scalable, and beautiful digital products every single time.</p>
          </div>
          <div className="ss-features-grid">
            {WHY_ME_FEATURES.map((f, i) => (
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

      {/* ── Tech Stack ─────────────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🛠️ Tech Arsenal</div>
            <h2 className="ss-section-title">My Full-Stack Toolkit</h2>
            <p className="ss-section-desc">Every technology I use is battle-tested in real production applications.</p>
          </div>
          <div className="ss-tech-stack">
            {TECH_STACK_ITEMS.map((tech, i) => (
              <span className="ss-tech-badge" key={i}>● {tech}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">💬 Testimonials</div>
            <h2 className="ss-section-title">What Clients Say</h2>
            <p className="ss-section-desc">Real words from real clients who shipped real products with me.</p>
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

      {/* ── How It Works ────────────────────────────────── */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🚀 Process</div>
            <h2 className="ss-section-title">How to Get Started</h2>
            <p className="ss-section-desc">From browsing to launching your product, the process is seamless and fast.</p>
          </div>
          <div className="ss-process-steps">
            {[
              { title: 'Browse & Choose', desc: 'Explore the full catalog of projects, templates, and tools. Filter by category or search by tech stack to find exactly what you need.' },
              { title: 'Purchase or Hire', desc: 'Buy a ready-made product directly or hire Shivam for a custom build. Secure checkout with instant delivery for digital products.' },
              { title: 'Download & Setup', desc: 'Get the full source code, setup instructions, and .env configuration. Up and running in under 30 minutes with the detailed README.' },
              { title: 'Customize & Ship', desc: 'Modify the code to fit your brand and business logic. Deploy to your preferred platform — Vercel, Netlify, or Render — and go live!' },
              { title: 'Support & Scale', desc: 'Get 30 days of free bug-fix support. Need more features? Reach out for an upgrade quote or monthly retainer support.' },
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

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">❓ FAQ</div>
            <h2 className="ss-section-title">Frequently Asked Questions</h2>
            <p className="ss-section-desc">Everything you need to know before making a purchase.</p>
          </div>
          <div className="ss-faq-list">
            {faqs.map((faq, i) => (
              <div className={`ss-faq-item ${openFaq === i ? 'ss-faq-open' : ''}`} key={i}>
                <button className="ss-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="ss-faq-icon">+</span>
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
          <div className="ss-section-tag" style={{ marginBottom: '1rem' }}>🤝 Let's Work Together</div>
          <h2 className="ss-cta-title">Ready to Build Something Amazing?</h2>
          <p className="ss-cta-desc">
            Whether you need a custom MERN application, a quick template, or ongoing development support —
            I'm here to turn your ideas into production-ready digital products.
          </p>
          <div className="ss-cta-actions">
            <button className="ss-btn-primary">💬 Hire Me Now</button>
            <button className="ss-btn-secondary">📂 View Projects</button>
          </div>
        </div>
      </section>

    </div>
  );
}