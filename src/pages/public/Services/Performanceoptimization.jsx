import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const PerformanceOptimization = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);

  const metrics = [
    { label: 'Performance', before: 42, after: 97, color: 'var(--ss-gradient-green)' },
    { label: 'Accessibility', before: 68, after: 98, color: 'var(--ss-gradient-primary)' },
    { label: 'Best Practices', before: 75, after: 100, color: 'var(--ss-gradient-secondary)' },
    { label: 'SEO', before: 60, after: 99, color: 'var(--ss-gradient-gold)' },
  ];

  const optimizations = [
    {
      icon: '📦', title: 'Bundle Optimization',
      desc: 'Code splitting with dynamic imports, tree shaking dead code, bundle analysis with Webpack Bundle Analyzer, and eliminating unused dependencies. Average bundle size reduction: 60–70%.',
      tags: ['Code Splitting', 'Tree Shaking', 'Bundle Analysis', 'Lazy Loading'],
    },
    {
      icon: '🖼️', title: 'Image Optimization',
      desc: 'Converting images to WebP/AVIF format, implementing responsive srcset attributes, lazy loading below-the-fold images, using BlurHash placeholders, and serving via CDN.',
      tags: ['WebP/AVIF', 'Lazy Loading', 'srcset', 'CDN Delivery'],
    },
    {
      icon: '🔥', title: 'Redis Caching',
      desc: 'API response caching, session storage, frequently-queried data memoization, and cache invalidation strategies. Reduce DB load by 80% on read-heavy endpoints.',
      tags: ['Redis', 'Cache Invalidation', 'Memoization', 'TTL Strategy'],
    },
    {
      icon: '🗄️', title: 'Database Optimization',
      desc: 'Index analysis and creation, query optimization, N+1 query elimination, connection pooling, read replicas for heavy traffic, and slow query monitoring.',
      tags: ['Indexes', 'Query Plans', 'Connection Pools', 'Read Replicas'],
    },
    {
      icon: '☁️', title: 'CDN & Edge',
      desc: 'Cloudflare CDN configuration, edge caching rules, geographic routing, HTTP/2 and HTTP/3 push, and static asset optimization with far-future cache headers.',
      tags: ['Cloudflare', 'Edge Cache', 'HTTP/3', 'Cache Headers'],
    },
    {
      icon: '⚛️', title: 'React Optimization',
      desc: 'Component memoization with React.memo and useMemo, virtualized lists for large datasets, eliminating unnecessary re-renders, and Suspense boundaries for lazy loading.',
      tags: ['React.memo', 'useMemo', 'Virtual Lists', 'Suspense'],
    },
    {
      icon: '📡', title: 'Network Optimization',
      desc: 'Prefetching critical resources, preconnecting to external origins, deferring non-critical scripts, eliminating render-blocking resources, and optimizing the critical rendering path.',
      tags: ['Prefetch', 'Preconnect', 'Defer/Async', 'Critical Path'],
    },
    {
      icon: '📐', title: 'Core Web Vitals',
      desc: 'LCP (Largest Contentful Paint) optimization, CLS (Cumulative Layout Shift) elimination, FID/INP (Interaction to Next Paint) improvements, and TTFB reduction.',
      tags: ['LCP', 'CLS', 'INP', 'TTFB'],
    },
  ];

  const auditProcess = [
    { num: '01', icon: '🔍', title: 'Audit & Baseline', desc: 'Run Lighthouse, WebPageTest, and GTmetrix audits. Profile your app with Chrome DevTools. Identify the biggest wins.' },
    { num: '02', icon: '📋', title: 'Prioritization Report', desc: 'Receive a detailed report ranking all issues by impact and effort. We agree on what to tackle first.' },
    { num: '03', icon: '⚙️', title: 'Implementation', desc: 'Sprint-based fixes — bundle optimization, caching, image compression, database indexes, CDN setup.' },
    { num: '04', icon: '📊', title: 'Measurement', desc: 'Re-audit after each sprint. Track Core Web Vitals improvement. Compare real user metrics (RUM) before and after.' },
    { num: '05', icon: '🔒', title: 'Regression Prevention', desc: 'Set up Lighthouse CI in your pipeline to catch performance regressions before they reach production.' },
    { num: '06', icon: '📈', title: 'Monitoring Setup', desc: 'Configure ongoing monitoring with alerts when performance degrades. Monthly performance health reports.' },
  ];

  const beforeAfter = [
    { metric: 'Page Load Time', before: '8.2s', after: '1.1s', improvement: '87% faster' },
    { metric: 'Bundle Size', before: '3.2MB', after: '890KB', improvement: '72% smaller' },
    { metric: 'Lighthouse Score', before: '42', after: '97', improvement: '+55 points' },
    { metric: 'API Response (cached)', before: '450ms', after: '12ms', improvement: '97% faster' },
    { metric: 'Time to First Byte', before: '1.8s', after: '180ms', improvement: '90% faster' },
    { metric: 'DB Query Time', before: '320ms', after: '28ms', improvement: '91% faster' },
  ];

  const faqs = [
    { q: 'How much of an improvement can I expect?', a: 'Results vary by starting point, but typical outcomes include 60–90% reduction in load time, 50–70% smaller bundle sizes, and Lighthouse scores jumping from 40–60 range to 90–100. I\'ll give you realistic projections after the initial audit.' },
    { q: 'Will optimization break my existing features?', a: 'No. All optimizations are implemented with backward compatibility. I use feature flags for risky changes and test thoroughly in staging before production. The functionality stays identical — it just gets faster.' },
    { q: 'My site is already "fast enough" — why bother?', a: 'Every 100ms improvement in load time correlates to a 1% increase in conversions (Amazon, Google studies). Faster sites rank higher in Google. And users on slow mobile networks and developing markets need performant apps to use your product at all.' },
    { q: 'Do you optimize backend APIs too?', a: 'Yes. API performance is often the biggest bottleneck. I profile endpoints, add Redis caching, optimize database queries, implement pagination where missing, and reduce unnecessary computation.' },
    { q: 'Can you set up ongoing monitoring?', a: 'Absolutely. I configure Lighthouse CI in your GitHub Actions pipeline, set up real user monitoring (RUM), and configure alerts when performance degrades. You\'ll know before your users do.' },
    { q: 'How long does a performance audit take?', a: 'Initial audit takes 1–2 days. Implementation time depends on complexity — usually 1–4 weeks for meaningful improvements. Quick wins (image optimization, adding Redis cache) can be done in days.' },
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
                Performance Optimization
              </span>
              <h1 className="shivam-stack-hero-title">
                From Slow to{' '}
                <span className="shivam-stack-hero-title-gradient">Blazing Fast</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                Is your app sluggish? I transform slow web applications into speed machines. Lighthouse 95+ scores. Sub-second load times. Real user impact.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Get Free Audit</a>
                <a href="#perf-results" className="shivam-stack-btn shivam-stack-btn--secondary">See Results →</a>
              </div>
            </div>

            <div className="shivam-stack-hero-visual">
              <div className="shivam-stack-hero-visual-inner">
                <div className="shivam-stack-perf-meter">
                  <div style={{ fontFamily: 'var(--ss-font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ss-text-muted)', marginBottom: '1.5rem' }}>Lighthouse Scores — After Optimization</div>
                  {metrics.map((m, i) => (
                    <div key={i} className="shivam-stack-perf-meter-row">
                      <div className="shivam-stack-perf-meter-label">{m.label}</div>
                      <div className="shivam-stack-perf-meter-bar-bg">
                        <div className="shivam-stack-perf-meter-bar-fill" style={{ width: `${m.after}%`, background: m.color }} />
                      </div>
                      <div className="shivam-stack-perf-meter-value">{m.after}</div>
                    </div>
                  ))}
                </div>
                <div className="shivam-stack-hero-floating-badge shivam-stack-hero-floating-badge--2">
                  <span className="shivam-stack-floating-badge-icon">🚀</span>
                  <div>
                    <div className="shivam-stack-floating-badge-text">87% Faster</div>
                    <div className="shivam-stack-floating-badge-sub">Avg load improvement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="shivam-stack-section" id="perf-results" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// the proof</div>
            <h2 className="shivam-stack-section-title">Real Results, Real Numbers</h2>
            <p className="shivam-stack-section-desc">These are typical results from projects I've optimized. Not cherry-picked — this is what focused performance work achieves.</p>
          </div>

          <div className="shivam-stack-perf-ba-grid">
            {beforeAfter.map((item, i) => (
              <div key={i} className="shivam-stack-perf-ba-card">
                <div className="shivam-stack-perf-ba-metric">{item.metric}</div>
                <div className="shivam-stack-perf-ba-row">
                  <div className="shivam-stack-perf-ba-before">
                    <div className="shivam-stack-perf-ba-label">Before</div>
                    <div className="shivam-stack-perf-ba-value shivam-stack-perf-ba-value--bad">{item.before}</div>
                  </div>
                  <div className="shivam-stack-perf-ba-arrow">→</div>
                  <div className="shivam-stack-perf-ba-after">
                    <div className="shivam-stack-perf-ba-label">After</div>
                    <div className="shivam-stack-perf-ba-value shivam-stack-perf-ba-value--good">{item.after}</div>
                  </div>
                </div>
                <div className="shivam-stack-perf-ba-improvement">{item.improvement}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPTIMIZATIONS ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// how i do it</div>
            <h2 className="shivam-stack-section-title">8 Layers of Optimization</h2>
            <p className="shivam-stack-section-desc">Performance is not a single fix — it's a stack of improvements working together.</p>
          </div>
          <div className="shivam-stack-grid-3">
            {optimizations.map((opt, i) => (
              <div key={i} className="shivam-stack-card">
                <div className="shivam-stack-card-icon">{opt.icon}</div>
                <div className="shivam-stack-card-title">{opt.title}</div>
                <div className="shivam-stack-card-text" style={{ marginBottom: '1.25rem' }}>{opt.desc}</div>
                <div className="shivam-stack-tech-grid" style={{ marginTop: 0 }}>
                  {opt.tags.map((tag, j) => <span key={j} className="shivam-stack-tech-badge">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOT COMPARISON ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// visual proof</div>
            <h2 className="shivam-stack-section-title">Lighthouse Reports</h2>
            <p className="shivam-stack-section-desc">Screenshots from actual optimization projects.</p>
          </div>
          <div className="shivam-stack-grid-2">
            {[{ title: 'Before Optimization — Lighthouse Report', desc: 'Initial audit showing performance bottlenecks' },
              { title: 'After Optimization — Lighthouse Report', desc: 'Post-optimization showing 95+ scores across all metrics' }].map((item, i) => (
              <div key={i}>
                <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--landscape">
                  <div className="shivam-stack-img-placeholder">
                    <span className="shivam-stack-img-placeholder-icon">{i === 0 ? '📉' : '📈'}</span>
                    <span className="shivam-stack-img-placeholder-text">{item.title}</span>
                  </div>
                </div>
                <p className="shivam-stack-card-text" style={{ marginTop: '0.75rem', textAlign: 'center' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// my process</div>
            <h2 className="shivam-stack-section-title">How I Optimize Your App</h2>
          </div>
          <div className="shivam-stack-grid-2" style={{ gap: 'clamp(2rem, 4vw, 4rem)' }}>
            <div className="shivam-stack-process-list">
              {auditProcess.slice(0, 3).map((step, i) => (
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
              {auditProcess.slice(3).map((step, i) => (
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
          <h2 className="shivam-stack-cta-title">Is Your App <span className="shivam-stack-hero-title-gradient">Slow?</span> Let's Fix That.</h2>
          <p className="shivam-stack-cta-desc">Get a free performance audit. I'll identify your biggest bottlenecks and show you exactly what's possible.</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Get Free Audit</a>
            <a href="/services" className="shivam-stack-btn shivam-stack-btn--secondary">← All Services</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PerformanceOptimization;