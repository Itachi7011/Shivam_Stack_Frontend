import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const ECommerceSolutions = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq, ] = useState(null);
  const [activeTab, setActiveTab] = useState('features');

  const tabContent = {
    features: [
      { icon: '🛍️', title: 'Product Catalog', desc: 'Products with variants (size, color), multiple images, rich descriptions, tags, categories, and SEO meta fields. Supports digital and physical products.' },
      { icon: '🛒', title: 'Smart Cart', desc: 'Persistent cart (works after page refresh and login), cart summary, quantity controls, remove items, and saved-for-later wishlist.' },
      { icon: '💳', title: 'Payment Gateway', desc: 'Stripe and Razorpay integration with 3D Secure support, saved cards, UPI, net banking, wallets, and refund processing.' },
      { icon: '📦', title: 'Order Management', desc: 'Full order lifecycle — pending, confirmed, processing, shipped, delivered, returned. Email notifications at every stage.' },
      { icon: '🏷️', title: 'Coupon & Discounts', desc: 'Percentage and fixed-amount coupons, minimum order amounts, single-use codes, bulk code generation, and expiry dates.' },
      { icon: '⭐', title: 'Reviews & Ratings', desc: 'Verified purchase reviews, star ratings, photo reviews, admin moderation, and average rating aggregation.' },
    ],
    admin: [
      { icon: '📊', title: 'Sales Analytics', desc: 'Revenue charts, top products, order trends, conversion funnels, customer acquisition, and exportable reports.' },
      { icon: '📦', title: 'Inventory Control', desc: 'Stock tracking per variant, low-stock alerts, bulk import/export via CSV, reorder triggers, and supplier management.' },
      { icon: '👥', title: 'Customer Database', desc: 'Full customer profiles, purchase history, lifetime value, address book, and segmentation for targeted marketing.' },
      { icon: '🚚', title: 'Shipping Management', desc: 'Multiple shipping zones, flat-rate and weight-based rules, shiprocket/Delhivery integration, and tracking updates.' },
      { icon: '💬', title: 'Support Tools', desc: 'Order-based support tickets, customer chat history, return/refund processing, and dispute management.' },
      { icon: '📧', title: 'Email Automation', desc: 'Abandoned cart recovery, order confirmations, shipping updates, review requests, and promotional campaigns.' },
    ],
    technical: [
      { icon: '⚡', title: 'Performance', desc: 'Redis caching for catalog, image optimization with Cloudinary, lazy loading, infinite scroll, and sub-second page loads.' },
      { icon: '🔍', title: 'Search & Filter', desc: 'Full-text product search, multi-faceted filters (price, brand, size, rating), sort options, and paginated results.' },
      { icon: '🔒', title: 'Security', desc: 'PCI DSS compliance via Stripe, XSS/CSRF protection, input validation, rate limiting on checkout, and fraud detection hooks.' },
      { icon: '📱', title: 'Mobile-First', desc: 'Touch-optimized product carousels, native-feel mobile cart, Apple Pay / Google Pay via Stripe, and PWA support.' },
      { icon: '🌍', title: 'Multi-Currency', desc: 'Currency detection by geo, real-time exchange rates, price display in local currency, and multi-currency checkout.' },
      { icon: '🔗', title: 'Integrations', desc: 'Google Analytics 4 with e-commerce events, Facebook Pixel, Google Shopping feed, and WhatsApp order notifications.' },
    ],
  };

  const platforms = [
    {
      icon: '🏗️', name: 'Custom MERN Store',
      tagline: 'Built exactly for your business',
      desc: 'No compromise. No plugin dependencies. A full-featured e-commerce store built specifically for your product catalog, business rules, and workflow.',
      pros: ['100% custom features', 'No per-transaction fees (beyond gateway)', 'Full source ownership', 'Can scale infinitely', 'Your design, your branding'],
    },
    {
      icon: '🛍️', name: 'Shopify Frontend',
      tagline: 'Headless Shopify',
      desc: 'Custom React storefront powered by Shopify\'s backend. You get the power of Shopify\'s checkout and inventory with a completely custom frontend.',
      pros: ['Shopify checkout reliability', 'Custom UI & UX', 'Shopify app ecosystem', 'Fast time to market', 'Easy product management'],
    },
  ];

  const screenshots = [
    { title: 'Homepage — Hero & Featured Products', wide: true },
    { title: 'Product Detail Page', wide: false },
    { title: 'Cart & Checkout', wide: false },
    { title: 'Admin — Orders Dashboard', wide: false },
    { title: 'Mobile — Product Catalog', wide: true },
  ];

  const faqs = [
    { q: 'How long does a full e-commerce store take?', a: 'A standard store (product catalog, cart, checkout, payment, admin) takes 6–8 weeks. More complex stores with custom features, multi-vendor support, or integrations can take 10–14 weeks.' },
    { q: 'Which payment gateway do you recommend — Stripe or Razorpay?', a: 'Razorpay for India-focused stores (UPI, net banking, Indian cards). Stripe for international/global stores. I can integrate both if you need to serve both markets.' },
    { q: 'Can I add products myself after launch?', a: 'Yes. The admin panel is built for non-technical use. Adding products, setting prices, managing inventory, and processing orders is designed to be as easy as filling a form.' },
    { q: 'Do you handle payment gateway setup?', a: 'Yes. I handle the complete Stripe/Razorpay account integration — API keys, webhook configuration, refund handling, and test mode verification.' },
    { q: 'Can you build a multi-vendor marketplace?', a: 'Yes. Multi-vendor stores are more complex (vendor dashboards, commission splits, separate payouts) and take 10–14 weeks, but I\'ve built them before.' },
    { q: 'What about abandoned cart recovery?', a: 'Included by default. Customers who add items to cart but don\'t checkout receive automated email reminders (1 hour, 24 hours, 3 days) with their cart pre-filled.' },
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
                E-Commerce Solutions
              </span>
              <h1 className="shivam-stack-hero-title">
                Your Online Store,{' '}
                <span className="shivam-stack-hero-title-gradient">Built to Convert</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                Full-featured e-commerce platforms with beautiful storefronts, seamless checkout, Stripe/Razorpay payments, and powerful admin dashboards. Every feature your business needs to sell online.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Build My Store</a>
                <a href="#ecom-features" className="shivam-stack-btn shivam-stack-btn--secondary">See All Features →</a>
              </div>
              <div className="shivam-stack-fsd-hero-stats">
                {[
                  { num: '15+', label: 'Stores Built' },
                  { num: '2', label: 'Payment Gateways' },
                  { num: '6-8wk', label: 'Delivery Time' },
                ].map((s, i) => (
                  <div key={i} className="shivam-stack-fsd-hero-stat">
                    <div className="shivam-stack-fsd-hero-stat-num">{s.num}</div>
                    <div className="shivam-stack-fsd-hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shivam-stack-hero-visual">
              <div className="shivam-stack-hero-visual-inner">
                <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--hero">
                  <div className="shivam-stack-img-placeholder">
                    <span className="shivam-stack-img-placeholder-icon">🛒</span>
                    <span className="shivam-stack-img-placeholder-text">E-Commerce Store Preview</span>
                  </div>
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--2">
                  <span className="shivam-stack-floating-badge-icon">💳</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">Stripe + Razorpay</div>
                    <div className="shivam-stack-floating-badge-sub">Secure payments</div>
                  </div>
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--1">
                  <span className="shivam-stack-floating-badge-icon">📦</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">Full Order Flow</div>
                    <div className="shivam-stack-floating-badge-sub">Cart to delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE TABS ── */}
      <section className="shivam-stack-section" id="ecom-features" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// complete feature set</div>
            <h2 className="shivam-stack-section-title">Everything a Store Needs</h2>
            <p className="shivam-stack-section-desc">Not a template. Not Shopify with plugins. A custom-built store with every feature designed for your specific business.</p>
          </div>
          <div className="shivam-stack-tabs-nav">
            {[['features', 'Storefront Features'], ['admin', 'Admin Tools'], ['technical', 'Technical Specs']].map(([key, label]) => (
              <button key={key} className={`shivam-stack-tab-btn ${activeTab === key ? 'shivam-stack-tab-btn--active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
            ))}
          </div>
          <div className="shivam-stack-grid-3">
            {tabContent[activeTab].map((item, i) => (
              <div key={i} className="shivam-stack-highlight-box">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div className="shivam-stack-card-title">{item.title}</div>
                <div className="shivam-stack-card-text">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORE SCREENSHOTS ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// visual showcase</div>
            <h2 className="shivam-stack-section-title">Store Screenshots</h2>
            <p className="shivam-stack-section-desc">What a complete, polished e-commerce experience looks like.</p>
          </div>
          <div className="shivam-stack-portfolio-showcase-grid">
            {screenshots.map((p, i) => (
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

      {/* ── PLATFORMS ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// approach options</div>
            <h2 className="shivam-stack-section-title">Custom Build vs Headless Shopify</h2>
            <p className="shivam-stack-section-desc">Both approaches produce exceptional stores. The right choice depends on your timeline, budget, and long-term needs.</p>
          </div>
          <div className="shivam-stack-grid-2" style={{ gap: '2rem' }}>
            {platforms.map((p, i) => (
              <div key={i} className="shivam-stack-pricing-card">
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                <div className="shivam-stack-pricing-plan">{p.tagline}</div>
                <div className="shivam-stack-fsd-tech-name" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', marginBottom: '0.75rem' }}>{p.name}</div>
                <div className="shivam-stack-pricing-divider" />
                <p className="shivam-stack-card-text" style={{ marginBottom: '1.25rem' }}>{p.desc}</p>
                <ul className="shivam-stack-pricing-features">
                  {p.pros.map((pro, j) => <li key={j} className="shivam-stack-pricing-feature-item"><span className="shivam-stack-pricing-check">✓</span> {pro}</li>)}
                </ul>
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
          <h2 className="shivam-stack-cta-title">Ready to Start <span className="shivam-stack-hero-title-gradient">Selling Online?</span></h2>
          <p className="shivam-stack-cta-desc">Let's build your store. Book a free discovery call and I'll walk you through exactly what your e-commerce platform will include.</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Build My Store</a>
            <a href="/portfolio" className="shivam-stack-btn shivam-stack-btn--secondary">See Live Examples →</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ECommerceSolutions;