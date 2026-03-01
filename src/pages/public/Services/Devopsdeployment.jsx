import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const DevOpsDeployment = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    {
      icon: '🐳', title: 'Docker Containerization',
      desc: 'Multi-stage Dockerfiles for optimized images, docker-compose for local development, container orchestration, and environment parity between dev/staging/prod.',
      tags: ['Docker', 'Docker Compose', 'Multi-stage Builds', 'Container Registry'],
    },
    {
      icon: '⚙️', title: 'CI/CD Pipelines',
      desc: 'GitHub Actions workflows for automated testing, building, and deployment. Every push to main triggers lint checks, unit tests, build verification, and deployment.',
      tags: ['GitHub Actions', 'Automated Tests', 'Build Verification', 'Auto Deploy'],
    },
    {
      icon: '☁️', title: 'Cloud Hosting',
      desc: 'AWS EC2/ECS, DigitalOcean Droplets, Railway, Render — I set up the right cloud infrastructure for your project\'s needs and budget.',
      tags: ['AWS EC2', 'DigitalOcean', 'Railway', 'Render'],
    },
    {
      icon: '🟢', title: 'Nginx & Reverse Proxy',
      desc: 'Nginx configuration for reverse proxying, load balancing, gzip compression, HTTP/2, rate limiting, and serving static files with optimal cache headers.',
      tags: ['Nginx', 'Load Balancing', 'gzip', 'HTTP/2'],
    },
    {
      icon: '🔒', title: 'SSL & Domain Setup',
      desc: 'Let\'s Encrypt SSL certificates with auto-renewal, custom domain configuration, DNS setup, HTTPS redirect, and HSTS headers for maximum security.',
      tags: ['Let\'s Encrypt', 'SSL/TLS', 'DNS Config', 'HSTS'],
    },
    {
      icon: '📊', title: 'Monitoring & Alerts',
      desc: 'Uptime monitoring with Uptime Kuma, error tracking with Sentry, server metrics with Grafana/Prometheus, and Slack/email alerts for critical issues.',
      tags: ['Uptime Kuma', 'Sentry', 'Grafana', 'Prometheus'],
    },
    {
      icon: '💾', title: 'Backup Strategies',
      desc: 'Automated database backups to S3, retention policies, backup verification, point-in-time recovery testing, and disaster recovery planning.',
      tags: ['S3 Backups', 'Retention Policy', 'PITR', 'DR Planning'],
    },
    {
      icon: '🔄', title: 'Zero-Downtime Deploys',
      desc: 'Blue-green deployments, rolling updates, PM2 cluster mode, graceful shutdowns, and health check endpoints to ensure zero downtime during updates.',
      tags: ['Blue-Green', 'Rolling Updates', 'PM2', 'Health Checks'],
    },
  ];

  const pipelineSteps = [
    { icon: '📝', label: 'Code Push' },
    { icon: '🧹', label: 'Lint' },
    { icon: '🧪', label: 'Tests' },
    { icon: '🏗️', label: 'Build' },
    { icon: '🐳', label: 'Docker' },
    { icon: '🚀', label: 'Deploy' },
    { icon: '✅', label: 'Health Check' },
  ];

  const cloudOptions = [
    { name: 'AWS EC2/ECS', icon: '☁️', best: 'Enterprise', desc: 'Full control, auto-scaling, VPC networking, IAM roles. Best for high-traffic production apps.' },
    { name: 'DigitalOcean', icon: '🌊', best: 'Mid-scale', desc: 'Simple, cost-effective VPS hosting with Managed Databases and App Platform options.' },
    { name: 'Railway / Render', icon: '🚂', best: 'Startups', desc: 'Deploy from GitHub in minutes. Automatic scaling. Zero server management. Great for MVPs.' },
    { name: 'Vercel / Netlify', icon: '▲', best: 'Frontend', desc: 'Edge-deployed Next.js and static sites with global CDN, preview deployments, and instant rollbacks.' },
  ];

  const faqs = [
    { q: 'What\'s the difference between CI and CD?', a: 'CI (Continuous Integration) automatically builds and tests your code on every push. CD (Continuous Deployment) automatically deploys to production when tests pass. Together they mean every commit that passes tests goes live automatically — safely.' },
    { q: 'Do I need Docker?', a: 'For most production projects, yes. Docker ensures your app runs identically in development, staging, and production. It eliminates "works on my machine" issues and makes deployment predictable.' },
    { q: 'Can you migrate my existing app to a better hosting setup?', a: 'Absolutely. Migration is one of the most common requests. I\'ll audit your current setup, plan the migration with zero downtime, and execute it during off-peak hours. Your users won\'t notice.' },
    { q: 'How do you handle database backups?', a: 'Automated daily backups to S3 with 30-day retention. Backups are verified weekly by doing a test restore. I also set up point-in-time recovery for critical databases.' },
    { q: 'What does zero-downtime deployment mean?', a: 'When I deploy a new version of your app, traffic switches to the new version only after health checks pass. If the new version fails, it automatically rolls back. Your users never see downtime or errors during deployment.' },
    { q: 'How much does cloud hosting cost monthly?', a: 'Depends on your traffic and needs. A typical startup setup (1 Node.js server + MongoDB + Redis + Nginx) on DigitalOcean costs $25–$50/month. AWS can be more expensive but more scalable. I\'ll help you choose the right tier.' },
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
          <div className="shivam-stack-hero-content shivam-stack-hero-content--centered">
            <div className="shivam-stack-hero-left">
              <a href="/services" className="shivam-stack-fsd-breadcrumb">← All Services</a>
              <span className="shivam-stack-hero-badge">
                <span className="shivam-stack-hero-badge-dot" />
                DevOps & Deployment
              </span>
              <h1 className="shivam-stack-hero-title">
                Ship Faster,{' '}
                <span className="shivam-stack-hero-title-gradient">Deploy Confidently</span>
              </h1>
              <p className="shivam-stack-hero-subtitle">
                From Docker containers to CI/CD pipelines to cloud infrastructure — I set up everything your app needs to deploy reliably, scale gracefully, and never go down.
              </p>
              <div className="shivam-stack-hero-cta-group">
                <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Set Up My Pipeline</a>
                <a href="#devops-pipeline" className="shivam-stack-btn shivam-stack-btn--secondary">See CI/CD Pipeline →</a>
              </div>
              <div className="shivam-stack-fsd-hero-stats">
                {[
                  { num: '99.9%', label: 'Uptime Target' },
                  { num: '0s', label: 'Downtime Deploys' },
                  { num: '< 5min', label: 'Deploy Time' },
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

      {/* ── CI/CD PIPELINE VISUAL ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }} id="devops-pipeline">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// how deployment works</div>
            <h2 className="shivam-stack-section-title">Your Automated CI/CD Pipeline</h2>
            <p className="shivam-stack-section-desc">Every code push flows through this automated pipeline. Tests pass → Docker image built → Deployed to production. No manual steps.</p>
          </div>
          <div className="shivam-stack-devops-pipeline">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="shivam-stack-devops-pipeline-step">
                <div className="shivam-stack-devops-pipeline-node">
                  <span className="shivam-stack-devops-pipeline-node-icon">{step.icon}</span>
                  <div className="shivam-stack-devops-pipeline-node-label">{step.label}</div>
                </div>
                {i < pipelineSteps.length - 1 && <div className="shivam-stack-devops-pipeline-arrow" />}
              </div>
            ))}
          </div>
          <div className="shivam-stack-img-wrapper shivam-stack-img-wrapper--landscape" style={{ marginTop: '2.5rem' }}>
            <div className="shivam-stack-img-placeholder">
              <span className="shivam-stack-img-placeholder-icon">⚙️</span>
              <span className="shivam-stack-img-placeholder-text">GitHub Actions CI/CD Workflow Screenshot</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// what i set up</div>
            <h2 className="shivam-stack-section-title">Complete DevOps Coverage</h2>
            <p className="shivam-stack-section-desc">Everything from containerization to monitoring — I handle the full infrastructure stack.</p>
          </div>
          <div className="shivam-stack-grid-3">
            {services.map((svc, i) => (
              <div key={i} className="shivam-stack-card">
                <div className="shivam-stack-card-icon">{svc.icon}</div>
                <div className="shivam-stack-card-title">{svc.title}</div>
                <div className="shivam-stack-card-text" style={{ marginBottom: '1.25rem' }}>{svc.desc}</div>
                <div className="shivam-stack-tech-grid" style={{ marginTop: 0 }}>
                  {svc.tags.map((tag, j) => <span key={j} className="shivam-stack-tech-badge">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOUD OPTIONS ── */}
      <section className="shivam-stack-section" style={{ background: 'var(--ss-bg-secondary)' }}>
        <div className="shivam-stack-container">
          <div className="shivam-stack-section-header">
            <div className="shivam-stack-section-label">// cloud platforms</div>
            <h2 className="shivam-stack-section-title">Choosing the Right Cloud</h2>
            <p className="shivam-stack-section-desc">I'll recommend the right platform for your traffic, budget, and team's technical level.</p>
          </div>
          <div className="shivam-stack-grid-4">
            {cloudOptions.map((opt, i) => (
              <div key={i} className="shivam-stack-highlight-box">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{opt.icon}</div>
                <div className="shivam-stack-card-title">{opt.name}</div>
                <div className="shivam-stack-tech-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>Best for {opt.best}</div>
                <div className="shivam-stack-card-text">{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCKER SHOWCASE ── */}
      <section className="shivam-stack-section">
        <div className="shivam-stack-container">
          <div className="shivam-stack-fsd-deliverables-wrap">
            <div>
              <div className="shivam-stack-section-label">// docker & containers</div>
              <h2 className="shivam-stack-section-title">Container-First Approach</h2>
              <p className="shivam-stack-section-desc" style={{ marginBottom: '1.5rem' }}>
                Every app I deploy is containerized. Your local environment matches production exactly. No more "it works on my machine" problems.
              </p>
              <div className="shivam-stack-fsd-deliverables-list">
                {[
                  'Multi-stage Dockerfile for optimized image sizes',
                  'docker-compose.yml for local development',
                  'Separate containers: app, database, Redis, Nginx',
                  'Environment-specific configurations',
                  'Container health checks and restart policies',
                  'Volume mounts for data persistence',
                  'Docker Hub / ECR image registry setup',
                  'Kubernetes-ready for scaling needs',
                ].map((item, i) => (
                  <div key={i} className="shivam-stack-fsd-deliverable-item">
                    <span className="shivam-stack-fsd-deliverable-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shivam-stack-code-window">
              <div className="shivam-stack-code-window-header">
                <div className="shivam-stack-code-dot shivam-stack-code-dot--red" />
                <div className="shivam-stack-code-dot shivam-stack-code-dot--yellow" />
                <div className="shivam-stack-code-dot shivam-stack-code-dot--green" />
                <span style={{ marginLeft: '0.75rem', fontFamily: 'var(--ss-font-mono)', fontSize: '0.72rem', color: '#8b949e' }}>docker-compose.yml</span>
              </div>
              <div className="shivam-stack-code-body">
                <div><span className="shivam-stack-code-keyword">version:</span> <span className="shivam-stack-code-string">'3.8'</span></div>
                <div><span className="shivam-stack-code-keyword">services:</span></div>
                <div><span className="shivam-stack-code-variable">  app:</span></div>
                <div><span className="shivam-stack-code-comment">    # React + Node.js App</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    build: </span><span className="shivam-stack-code-string">.</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    ports: </span><span className="shivam-stack-code-string">["3000:3000"]</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    depends_on: </span><span className="shivam-stack-code-string">[mongo, redis]</span></div>
                <div><span className="shivam-stack-code-variable">  mongo:</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    image: </span><span className="shivam-stack-code-string">mongo:7</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    volumes: </span><span className="shivam-stack-code-string">mongo_data:/data/db</span></div>
                <div><span className="shivam-stack-code-variable">  redis:</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    image: </span><span className="shivam-stack-code-string">redis:alpine</span></div>
                <div><span className="shivam-stack-code-variable">  nginx:</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    image: </span><span className="shivam-stack-code-string">nginx:alpine</span></div>
                <div><span style={{ color: '#7dd3fc' }}>    ports: </span><span className="shivam-stack-code-string">["80:80", "443:443"]</span></div>
                <div style={{ marginTop: '0.5rem' }}><span className="shivam-stack-code-function">  # ✓ All services healthy</span></div>
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
          <h2 className="shivam-stack-cta-title">Ready for <span className="shivam-stack-hero-title-gradient">Production-Grade</span> Infrastructure?</h2>
          <p className="shivam-stack-cta-desc">Let me set up your CI/CD pipeline, Docker containers, and cloud hosting — so you can focus on building features, not fighting servers.</p>
          <div className="shivam-stack-cta-buttons">
            <a href="/contact" className="shivam-stack-btn shivam-stack-btn--primary">✦ Start the Conversation</a>
            <a href="/services" className="shivam-stack-btn shivam-stack-btn--secondary">← All Services</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DevOpsDeployment;