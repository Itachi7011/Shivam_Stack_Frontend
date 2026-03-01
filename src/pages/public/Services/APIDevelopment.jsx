import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const APIDevelopment = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeApiType, setActiveApiType] = useState('rest');

  const apiTypes = {
    rest: {
      label: 'REST API',
      icon: '🔌',
      desc: 'RESTful APIs using Express.js with proper HTTP verbs, status codes, resource-based routing, and JSON responses. The gold standard for web APIs.',
      endpoints: [
        { method: 'GET', path: '/api/users', desc: 'List all users with pagination' },
        { method: 'POST', path: '/api/users', desc: 'Create a new user' },
        { method: 'GET', path: '/api/users/:id', desc: 'Get user by ID' },
        { method: 'PUT', path: '/api/users/:id', desc: 'Update user data' },
        { method: 'DELETE', path: '/api/users/:id', desc: 'Delete a user' },
        { method: 'POST', path: '/api/auth/login', desc: 'Authenticate and get JWT token' },
        { method: 'POST', path: '/api/auth/refresh', desc: 'Refresh JWT access token' },
        { method: 'GET', path: '/api/health', desc: 'Health check endpoint' },
      ],
    },
    graphql: {
      label: 'GraphQL',
      icon: '🔷',
      desc: 'GraphQL APIs with Apollo Server — schema-first design, resolvers, subscriptions for real-time data, and DataLoader for N+1 query prevention.',
      endpoints: [
        { method: 'QRY', path: 'query { users { id name email } }', desc: 'Fetch users with selected fields' },
        { method: 'QRY', path: 'query { user(id: "123") { ... } }', desc: 'Fetch single user by ID' },
        { method: 'MUT', path: 'mutation { createUser(input: {...}) }', desc: 'Create user mutation' },
        { method: 'MUT', path: 'mutation { updateUser(id: "123") }', desc: 'Update user mutation' },
        { method: 'SUB', path: 'subscription { messageAdded }', desc: 'Real-time message subscription' },
        { method: 'QRY', path: 'query { orders(status: PENDING) }', desc: 'Filtered orders query' },
      ],
    },
    webhook: {
      label: 'Webhooks',
      icon: '🪝',
      desc: 'Webhook endpoints for receiving events from Stripe, GitHub, Slack, and any third-party service. With signature verification and retry handling.',
      endpoints: [
        { method: 'POST', path: '/webhooks/stripe', desc: 'Handle Stripe payment events' },
        { method: 'POST', path: '/webhooks/github', desc: 'GitHub push/PR events' },
        { method: 'POST', path: '/webhooks/razorpay', desc: 'Razorpay payment status' },
        { method: 'POST', path: '/webhooks/sendgrid', desc: 'Email delivery events' },
        { method: 'POST', path: '/webhooks/custom/:token', desc: 'Custom webhook with token auth' },
      ],
    },
  };

  const features = [
    { icon: '🔐', title: 'JWT Authentication', desc: 'Access tokens (15min expiry) + refresh tokens (7 days), token rotation, blacklist for revoked tokens, and middleware for protected routes.' },
    { icon: '👮', title: 'Authorization & RBAC', desc: 'Role-based access control middleware. Define permissions at the route level. Support for resource-level ownership checks.' },
    { icon: '✅', title: 'Request Validation', desc: 'Schema validation with Zod or Joi on every incoming request. Descriptive error messages. Type-safe request/response shapes.' },
    { icon: '⏱️', title: 'Rate Limiting', desc: 'Per-user and per-IP rate limits using Redis. Configurable windows and limits per endpoint. Graceful 429 responses with retry-after headers.' },
    { icon: '📖', title: 'Swagger Docs', desc: 'Auto-generated OpenAPI 3.0 documentation with try-it-out UI. Every endpoint documented with request/response schemas and auth requirements.' },
    { icon: '🚨', title: 'Error Handling', desc: 'Centralized error handler. Consistent error shape across all endpoints. Environment-aware stack traces. Custom error classes for domain errors.' },
    { icon: '🔄', title: 'Versioning', desc: 'API versioning via URL path (/api/v1/, /api/v2/) or headers. Backward compatibility maintained. Deprecation headers for old endpoints.' },
    { icon: '📊', title: 'Logging & Tracing', desc: 'Request/response logging with Morgan and Winston. Correlation IDs for request tracing. Audit logs for sensitive operations.' },
  ];

  const integrations = [
    { icon: '💳', name: 'Stripe', type: 'Payments', desc: 'Charges, subscriptions, webhooks, refunds' },
    { icon: '💠', name: 'Razorpay', type: 'Payments', desc: 'Indian payments, UPI, webhooks' },
    { icon: '✉️', name: 'SendGrid', type: 'Email', desc: 'Transactional emails with templates' },
    { icon: '📱', name: 'Twilio', type: 'SMS/OTP', desc: 'SMS OTP, WhatsApp notifications' },
    { icon: '☁️', name: 'AWS S3', type: 'Storage', desc: 'File uploads, presigned URLs' },
    { icon: '🖼️', name: 'Cloudinary', type: 'Media', desc: 'Image optimization and CDN' },
    { icon: '🗺️', name: 'Google Maps', type: 'Location', desc: 'Geocoding, distance matrix, places' },
    { icon: '🔐', name: 'Firebase Auth', type: 'Auth', desc: 'Social login, phone auth' },
  ];

  const faqs = [
    { q: 'REST vs GraphQL — which should I choose?', a: 'REST is simpler, more widely understood, and excellent for most use cases. GraphQL shines when you have complex data relationships and multiple client types (mobile, web) with different data needs. I\'ll help you choose based on your specific project.' },
    { q: 'How do you handle API security?', a: 'Every API includes: JWT authentication, CORS configuration, rate limiting, input validation, helmet.js security headers, SQL/NoSQL injection prevention, and OWASP-compliant practices. Security is built in from day one.' },
    { q: 'Can you build an API for my mobile app?', a: 'Yes. APIs I build are platform-agnostic. Whether your client is React, React Native, Flutter, iOS, or Android — the API works for all of them. I also include CORS configuration for web clients.' },
    { q: 'Do you write tests for APIs?', a: 'Yes. Every API includes unit tests for business logic and integration tests for endpoints using Supertest. Coverage reports are included. I also provide Postman collections for manual testing.' },
    { q: 'What format does the API documentation come in?', a: 'Swagger/OpenAPI 3.0 format, accessible via a hosted /api-docs URL. The interactive UI lets your frontend team try every endpoint directly in the browser. I also provide a Postman collection.' },
    { q: 'Can you add an API to my existing application?', a: 'Yes. I regularly retrofit APIs onto existing monolithic applications. The process involves auditing the existing codebase, defining the API contract, implementing incrementally, and adding the auth layer.' },
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
                API Development
              </span>
              <h1 className="shivam-stack-hero-title">
                APIs That Power{' '}
                <span className="shivam-stack-hero-title-gradient">Any Platform</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                Production-ready REST and GraphQL APIs built with Node.js and Express. JWT auth, rate limiting, Swagger docs, and third-party integrations — engineered for reliability and speed.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Build My API</a>
                <a href="#api-explorer" className="shivam-stack-btn shivam-stack-btn--secondary">Explore Endpoints →</a>
              </div>
            </div>

            <div className="shivam-stack-hero-visual">
              <div className="shivam-stack-hero-visual-inner">
                <div className="shivam-stack-api-endpoint-list">
                  {[
                    { method: 'GET', path: '/api/v1/products', desc: '200 OK • 12ms' },
                    { method: 'POST', path: '/api/v1/orders', desc: '201 Created • 45ms' },
                    { method: 'GET', path: '/api/v1/users/me', desc: '200 OK • 8ms' },
                    { method: 'PUT', path: '/api/v1/cart/:id', desc: '200 OK • 18ms' },
                    { method: 'DELETE', path: '/api/v1/items/:id', desc: '204 No Content' },
                  ].map((ep, i) => (
                    <div key={i} className="shivam-stack-api-endpoint-item">
                      <span className={`shivam-stack-api-method shivam-stack-api-method--${ep.method.toLowerCase()}`}>{ep.method}</span>
                      <span className="shivam-stack-api-path">{ep.path}</span>
                      <span className="shivam-stack-api-desc" style={{ color: 'var(--ss-accent-green)', fontSize: '0.72rem' }}>{ep.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--2">
                  <span className="shivam-stack-floating-badge-icon">📖</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">Swagger Docs</div>
                    <div className="shivam-stack-floating-badge-sub">Every endpoint</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── API EXPLORER ── */}
      <section className="shivam-stack-section" id="api-explorer" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// api types</div>
            <h2 className="shivam-stack-section-title">REST, GraphQL & Webhooks</h2>
            <p className="shivam-stack-section-desc">I build all three types of APIs, choosing the right approach for your specific use case.</p>
          </div>
          <div className="shivam-stack-tabs-nav">
            {Object.entries(apiTypes).map(([key, tab]) => (
              <button key={key} className={`shivam-stack-tab-btn ${activeApiType === key ? 'shivam-stack-tab-btn--active' : ''}`} onClick={() => setActiveApiType(key)}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div className="shivam-stack-api-explorer-content">
            <div className="shivam-stack-api-explorer-desc">
              <p className="shivam-stack-card-text" style={{ marginBottom: '1.5rem' }}>{apiTypes[activeApiType].desc}</p>
            </div>
            <div className="shivam-stack-api-endpoint-list">
              {apiTypes[activeApiType].endpoints.map((ep, i) => (
                <div key={i} className="shivam-stack-api-endpoint-item">
                  <span className={`shivam-stack-api-method shivam-stack-api-method--${ep.method.toLowerCase() === 'qry' ? 'get' : ep.method.toLowerCase() === 'mut' ? 'post' : ep.method.toLowerCase() === 'sub' ? 'put' : ep.method.toLowerCase()}`}>{ep.method}</span>
                  <span className="shivam-stack-api-path">{ep.path}</span>
                  <span className="shivam-stack-api-desc">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// built into every api</div>
            <h2 className="shivam-stack-section-title">Production-Ready by Default</h2>
            <p className="shivam-stack-section-desc">These aren't optional add-ons. Every API I build comes with these features as standard.</p>
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

      {/* ── THIRD PARTY INTEGRATIONS ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// third-party integrations</div>
            <h2 className="shivam-stack-section-title">Connect to Any Service</h2>
            <p className="shivam-stack-section-desc">I integrate your API with the services your business depends on.</p>
          </div>
          <div className="shivam-stack-grid-4">
            {integrations.map((int, i) => (
              <div key={i} className="shivam-stack-all-services-stack-item">
                <span className="shivam-stack-all-services-stack-icon">{int.icon}</span>
                <div className="shivam-stack-all-services-stack-name">{int.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--ss-accent-primary)', fontFamily: 'var(--ss-font-mono)', marginTop: '0.25rem' }}>{int.type}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ss-text-muted)', marginTop: '0.3rem' }}>{int.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SWAGGER PREVIEW ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-fsd-deliverables-wrap">
            <div>
              <div className="shivam-stack-section-label">// documentation</div>
              <h2 className="shivam-stack-section-title">Swagger Docs Included</h2>
              <p className="shivam-stack-section-desc" style={{ marginBottom: '1.5rem' }}>
                Every API ships with interactive Swagger/OpenAPI 3.0 documentation. Your frontend developers can explore and test every endpoint directly in the browser — no Postman needed.
              </p>
              <div className="shivam-stack-fsd-deliverables-list">
                {[
                  'OpenAPI 3.0 specification file',
                  'Interactive /api-docs UI (Swagger UI)',
                  'Request/response schema examples',
                  'Auth flow documentation',
                  'Error response documentation',
                  'Postman collection export',
                ].map((item, i) => (
                  <div key={i} className="shivam-stack-fsd-deliverable-item">
                    <span className="shivam-stack-fsd-deliverable-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--auto" style={{ minHeight: 380 }}>
              <div className="shivam-stack-img-placeholder">
                <span className="shivam-stack-img-placeholder-icon">📖</span>
                <span className="shivam-stack-img-placeholder-text">Swagger UI Screenshot</span>
              </div>
            </div>
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
          <h2 className="shivam-stack-cta-title">Need a <span className="shivam-stack-hero-title-gradient">Rock-Solid API?</span></h2>
          <p className="shivam-stack-cta-desc">Let's define your API contract together. I'll build it with full documentation, auth, and tests included.</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Start Building</a>
            <a href="/services" className="shivam-stack-btn shivam-stack-btn--secondary">← All Services</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default APIDevelopment;