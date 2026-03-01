import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const MaintenanceSupport = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);

  const plans = [
    {
      name: 'Basic', price: '₹8,000', period: '/month', featured: false,
      desc: 'Essential maintenance for small projects.',
      features: [
        'Up to 5 bug fixes/month',
        'Monthly dependency updates',
        'Weekly uptime monitoring',
        'Basic security patches',
        '48-hour response time',
        'Monthly report',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Professional', price: '₹18,000', period: '/month', featured: true,
      desc: 'Comprehensive support for production apps.',
      features: [
        'Unlimited bug fixes',
        'Weekly dependency updates',
        '24/7 uptime monitoring',
        'Full security audit (quarterly)',
        'Up to 5hrs feature additions',
        '24-hour response time',
        'Database backup verification',
        'Performance monitoring',
        'Bi-weekly reports',
      ],
      cta: 'Most Popular',
    },
    {
      name: 'Enterprise', price: 'Custom', period: 'retainer', featured: false,
      desc: 'Dedicated support for critical applications.',
      features: [
        'Dedicated Slack channel',
        'Priority 4-hour response',
        '24/7 on-call availability',
        'Full security compliance',
        'Unlimited feature additions',
        'Load testing & scaling',
        'SLA with penalties',
        'Monthly architecture review',
      ],
      cta: 'Contact Me',
    },
  ];

  const services = [
    { icon: '🐛', title: 'Bug Fixing', desc: 'Rapid identification and resolution of bugs in production. Root cause analysis to prevent recurrence. Hotfix deployments with rollback capability.' },
    { icon: '🔒', title: 'Security Patches', desc: 'OWASP vulnerability scanning, npm audit fixes, CVE monitoring, and prompt patching of critical security issues before they can be exploited.' },
    { icon: '📦', title: 'Dependency Updates', desc: 'Safe, tested upgrades of npm packages. Breaking change analysis. Migration support. Keeping your app on supported, secure versions.' },
    { icon: '🚀', title: 'Feature Additions', desc: 'Small-to-medium feature development as part of your retainer. Scoped, tested, and deployed following your release schedule.' },
    { icon: '📊', title: 'Performance Monitoring', desc: 'Ongoing Lighthouse audits, real user monitoring, API response time tracking, and proactive optimization before performance degrades.' },
    { icon: '💾', title: 'Backup Monitoring', desc: 'Daily backup verification, monthly restore tests, S3 retention management, and disaster recovery drills to ensure your data is always recoverable.' },
    { icon: '📈', title: 'Analytics & Reporting', desc: 'Monthly health reports covering uptime, error rates, performance trends, security events, and recommendations for the next month.' },
    { icon: '🔄', title: 'Code Refactoring', desc: 'Gradual technical debt reduction — improving code quality, removing dead code, improving test coverage, and simplifying complex logic.' },
    { icon: '☁️', title: 'Server Management', desc: 'Cloud resource monitoring, auto-scaling configuration, cost optimization, server patching, and infrastructure health checks.' },
  ];

  const responseMatrix = [
    { severity: 'Critical', desc: 'App down / payments failing', response: '< 2 hours', plans: ['Professional', 'Enterprise'] },
    { severity: 'High', desc: 'Major feature broken', response: '< 8 hours', plans: ['Professional', 'Enterprise'] },
    { severity: 'Medium', desc: 'Minor bug affecting UX', response: '< 24 hours', plans: ['Basic', 'Professional', 'Enterprise'] },
    { severity: 'Low', desc: 'Cosmetic issues, typos', response: '< 48 hours', plans: ['Basic', 'Professional', 'Enterprise'] },
    { severity: 'Feature Request', desc: 'New functionality', response: 'Next sprint', plans: ['Professional', 'Enterprise'] },
  ];

  const whatToExpect = [
    { icon: '📋', title: 'Monthly Kickoff', desc: 'Review the previous month\'s issues, upcoming updates, and any planned work. Align on priorities.' },
    { icon: '🔍', title: 'Ongoing Monitoring', desc: 'Continuous uptime, error rate, and performance monitoring with automated alerts for anomalies.' },
    { icon: '⚡', title: 'Fast Response', desc: 'Defined SLAs for different issue severities. You\'ll always know when to expect a resolution.' },
    { icon: '📊', title: 'Monthly Report', desc: 'Detailed report covering uptime, issues resolved, updates applied, and performance trends.' },
  ];

  const faqs = [
    { q: 'What exactly counts as a "bug fix"?', a: 'A bug fix is any unexpected behavior in your existing application that deviates from the original specification. New feature requests or design changes are handled separately as scope additions.' },
    { q: 'Can I pause my maintenance plan?', a: 'Yes. Plans can be paused with 2 weeks notice. Billing stops during the pause, and you can resume anytime. I recommend not pausing for more than 3 months as apps can fall significantly behind on security updates.' },
    { q: 'What happens if I need more than the plan allows?', a: 'Additional work beyond your plan\'s limits is billed at a discounted hourly rate for retainer clients. You\'ll always be notified before any extra billing occurs.' },
    { q: 'Do you maintain apps you didn\'t build?', a: 'Yes, but I first need to do a code audit (usually 4–8 hours, billed once) to understand the codebase. This ensures I can maintain it safely and effectively.' },
    { q: 'What if my app needs urgent help outside business hours?', a: 'Professional plan includes emergency response within 8 hours any day. Enterprise plan includes 24/7 on-call availability. Basic plan covers business hours only.' },
    { q: 'Is there a minimum contract period?', a: 'Minimum 3 months for Basic, 1 month for Professional. Enterprise contracts are negotiated individually. Long-term commitments (6–12 months) receive a 10–15% discount.' },
  ];

  const severityColors = {
    Critical: 'rgba(239,68,68,0.15)',
    High: 'rgba(245,158,11,0.15)',
    Medium: 'rgba(0,212,255,0.15)',
    Low: 'rgba(16,185,129,0.15)',
    'Feature Request': 'rgba(124,58,237,0.15)',
  };

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
              <a href="/services" className="shivam-stack-fsd-breadcrumb">← All Services</a>
              <span className="shivam-stack-hero-badge">
                <span className="shivam-stack-hero-badge-dot" />
                Maintenance & Support
              </span>
              <h1 className="shivam-stack-hero-title">
                Keep Your App{' '}
                <span className="shivam-stack-hero-title-gradient">Healthy & Secure</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                I don't disappear after launch. Monthly maintenance retainers that keep your app secure, fast, and bug-free — so you can focus on growing your business.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Get a Retainer</a>
                <a href="#maint-plans" className="shivam-stack-btn shivam-stack-btn--secondary">See Plans →</a>
              </div>
              <div className="shivam-stack-fsd-hero-stats">
                {[
                  { num: '99.9%', label: 'Avg Uptime' },
                  { num: '< 2hr', label: 'Critical Response' },
                  { num: '30+', label: 'Apps Maintained' },
                ].map((s, i) => (
                  <div key={i} className="shivam-stack-fsd-hero-stat">
                    <div className="shivam-stack-fsd-hero-stat-num">{s.num}</div>
                    <div className="shivam-stack-fsd-hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT TO EXPECT ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// how it works</div>
            <h2 className="shivam-stack-section-title">What Ongoing Support Looks Like</h2>
            <p className="shivam-stack-section-desc">A predictable, structured maintenance relationship — not reactive firefighting.</p>
          </div>
          <div className="shivam-stack-grid-4">
            {whatToExpect.map((w, i) => (
              <div key={i} className="shivam-stack-highlight-box" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{w.icon}</div>
                <div className="shivam-stack-card-title">{w.title}</div>
                <div className="shivam-stack-card-text">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// what's covered</div>
            <h2 className="shivam-stack-section-title">Everything Keeping Your App Alive</h2>
            <p className="shivam-stack-section-desc">Comprehensive coverage across security, performance, reliability, and feature development.</p>
          </div>
          <div className="shivam-stack-grid-3">
            {services.map((svc, i) => (
              <div key={i} className="shivam-stack-card">
                <div className="shivam-stack-card-icon">{svc.icon}</div>
                <div className="shivam-stack-card-title">{svc.title}</div>
                <div className="shivam-stack-card-text">{svc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESPONSE MATRIX ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// response times</div>
            <h2 className="shivam-stack-section-title">You'll Always Know When to Expect Help</h2>
            <p className="shivam-stack-section-desc">Clear SLAs — no ambiguity about when issues will be addressed.</p>
          </div>
          <div className="shivam-stack-maint-response-table">
            <div className="shivam-stack-maint-response-header">
              <div>Severity</div>
              <div>Description</div>
              <div>Response Time</div>
              <div>Available On</div>
            </div>
            {responseMatrix.map((row, i) => (
              <div key={i} className="shivam-stack-maint-response-row" style={{ background: severityColors[row.severity] }}>
                <div className="shivam-stack-maint-response-severity">{row.severity}</div>
                <div className="shivam-stack-maint-response-desc">{row.desc}</div>
                <div className="shivam-stack-maint-response-time">{row.response}</div>
                <div className="shivam-stack-maint-response-plans">
                  {row.plans.map((p, j) => <span key={j} className="shivam-stack-tech-badge" style={{ padding: '0.2rem 0.6rem' }}>{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="shivam-stack-section" id="maint-plans">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// pricing plans</div>
            <h2 className="shivam-stack-section-title">Monthly Maintenance Plans</h2>
            <p className="shivam-stack-section-desc">Predictable monthly costs. Cancel anytime with 2 weeks notice.</p>
          </div>
          <div className="shivam-stack-maint-plan-selector">
            {plans.map((plan, i) => (
              <div key={i} className={`shivam-stack-pricing-card ${plan.featured ? 'shivam-stack-pricing-card--featured' : ''}`}>
                {plan.featured && <div className="shivam-stack-pricing-badge">Most Popular</div>}
                <div className="shivam-stack-pricing-plan">{plan.name}</div>
                <div className="shivam-stack-pricing-price">{plan.price}</div>
                <div className="shivam-stack-pricing-price-note">{plan.period}</div>
                <p className="shivam-stack-card-text" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>{plan.desc}</p>
                <div className="shivam-stack-pricing-divider" />
                <ul className="shivam-stack-pricing-features">
                  {plan.features.map((f, j) => (
                    <li key={j} className="shivam-stack-pricing-feature-item">
                      <span className="shivam-stack-pricing-check">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="/contact" className={`shivam-stack-btn ${plan.featured ? 'shivam-stack-btn--primary' : 'shivam-stack-btn--secondary'}`} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MONTHLY REPORT PREVIEW ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-fsd-deliverables-wrap">
            <div>
              <div className="shivam-stack-section-label">// transparency</div>
              <h2 className="shivam-stack-section-title">Monthly Health Reports</h2>
              <p className="shivam-stack-section-desc" style={{ marginBottom: '1.5rem' }}>
                Every month you receive a detailed report showing exactly what happened to your application — no black box maintenance.
              </p>
              <div className="shivam-stack-fsd-deliverables-list">
                {[
                  'Uptime statistics (target: 99.9%)',
                  'Number and type of bugs resolved',
                  'Packages updated with changelog links',
                  'Security vulnerabilities patched',
                  'Performance metrics trend (Lighthouse)',
                  'Database backup status verification',
                  'API error rate and response times',
                  'Recommendations for next month',
                ].map((item, i) => (
                  <div key={i} className="shivam-stack-fsd-deliverable-item">
                    <span className="shivam-stack-fsd-deliverable-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--auto" style={{ minHeight: 400 }}>
              <div className="shivam-stack-img-placeholder">
                <span className="shivam-stack-img-placeholder-icon">📊</span>
                <span className="shivam-stack-img-placeholder-text">Monthly Health Report Preview</span>
              </div>
            </div>
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
          <h2 className="shivam-stack-cta-title">Your App Deserves <span className="shivam-stack-hero-title-gradient">Long-Term Care</span></h2>
          <p className="shivam-stack-cta-desc">Don't wait for something to break. Get proactive maintenance that keeps your app running smoothly, month after month.</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Get a Retainer</a>
            <a href="/services" className="shivam-stack-btn shivam-stack-btn--secondary">← All Services</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MaintenanceSupport;