import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers, ShoppingCart, LayoutDashboard, Zap, Gauge, Briefcase,
  Server, Wrench, ArrowRight, ChevronRight, ArrowUp, Mail,
  Code2, Shield, Globe, Target, Star, Clock, CheckCircle,
  XCircle, Rocket, Users, MessageSquare, Package, Plus,
  Terminal, Lock, BarChart3, GitBranch, RefreshCw, Sparkles,
  HeartHandshake, Building2, GraduationCap, Smartphone, BookOpen,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

/* ── Meta ─────────────────────────────────────────────────────────────────── */
const META = {
  title:       "Services — ShivamStack | Full Stack Web Development",
  description: "Professional MERN stack development services: web apps, e-commerce, admin panels, APIs, performance optimisation, portfolios, DevOps, and ongoing support. Based in Delhi, India.",
};

/* ── Services Data ────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id:      "full-stack",
    num:     "01",
    icon:    Layers,
    color:   "#6366f1",
    colorBg: "rgba(99,102,241,0.1)",
    glow:    "rgba(99,102,241,0.12)",
    ctaBg:   "rgba(99,102,241,0.07)",
    ctaBorder:"rgba(99,102,241,0.35)",
    ctaText: "#6366f1",
    grad:    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    title:   "Full Stack Web Development",
    short:   "End-to-end custom web applications built on the battle-tested MERN stack — from a clean UI to a secure, scalable backend.",
    desc:    "Whether you need a SaaS platform, an internal tool, or a consumer-facing app, I design and build the full application layer: database, API, business logic, and responsive frontend. Everything is written with production-readiness in mind from day one.",
    features: [
      "Custom dashboards & admin panels",
      "SaaS platforms with subscription flows",
      "Role-based authentication systems",
      "Secure REST API development",
      "Scalable backend architecture",
      "Performance-optimised React frontend",
      "Responsive across all devices & browsers",
    ],
    bestFor: "Startups, founders, and growing businesses building their first or next product.",
  },
  {
    id:      "ecommerce",
    num:     "02",
    icon:    ShoppingCart,
    color:   "#f59e0b",
    colorBg: "rgba(245,158,11,0.1)",
    glow:    "rgba(245,158,11,0.12)",
    ctaBg:   "rgba(245,158,11,0.07)",
    ctaBorder:"rgba(245,158,11,0.35)",
    ctaText: "#d97706",
    grad:    "linear-gradient(135deg, #f59e0b, #f97316)",
    title:   "E-Commerce & Digital Product Systems",
    short:   "Modern commerce platforms and digital product selling systems built to convert visitors into paying customers.",
    desc:    "I build complete selling systems — not just a storefront but a full operational platform: payment gateway, order management, customer accounts, invoicing, and a revenue dashboard so you can track everything. Built for creators, educators, and online sellers who want professional infrastructure without monthly SaaS fees.",
    features: [
      "Digital downloads: PDFs, assets, templates",
      "Payment gateway integration (Razorpay / Stripe)",
      "Coupon & discount code systems",
      "Order management & fulfilment dashboard",
      "Automated invoice & receipt generation",
      "Admin revenue tracking dashboard",
      "Customer purchase history & re-download access",
    ],
    bestFor: "Creators, educators, coaches, and online sellers launching or scaling digital products.",
  },
  {
    id:      "admin-cms",
    num:     "03",
    icon:    LayoutDashboard,
    color:   "#10b981",
    colorBg: "rgba(16,185,129,0.1)",
    glow:    "rgba(16,185,129,0.12)",
    ctaBg:   "rgba(16,185,129,0.07)",
    ctaBorder:"rgba(16,185,129,0.35)",
    ctaText: "#059669",
    grad:    "linear-gradient(135deg, #10b981, #059669)",
    title:   "Admin Panel & CMS Development",
    short:   "Fully custom admin panels and content management systems — no WordPress, no page builders, no compromises.",
    desc:    "Generic CMS platforms are built for everyone, which means they're optimised for no one. I build admin panels and content systems that are designed specifically for your business: your content types, your workflow, your team permissions. Clean, fast, and owned entirely by you.",
    features: [
      "Secure admin authentication & session management",
      "Role & permission management system",
      "Content management: Blog, Products, Projects",
      "Analytics & reporting dashboards",
      "Audit logs & team activity tracking",
      "Media management & file uploads",
      "Fully custom — zero third-party CMS dependency",
    ],
    bestFor: "Businesses needing tailored internal tools that off-the-shelf CMS platforms simply can't provide.",
  },
  {
    id:      "api-dev",
    num:     "04",
    icon:    Zap,
    color:   "#06b6d4",
    colorBg: "rgba(6,182,212,0.1)",
    glow:    "rgba(6,182,212,0.12)",
    ctaBg:   "rgba(6,182,212,0.07)",
    ctaBorder:"rgba(6,182,212,0.35)",
    ctaText: "#0891b2",
    grad:    "linear-gradient(135deg, #06b6d4, #3b82f6)",
    title:   "API Development & Integration",
    short:   "Robust, well-structured backend APIs designed for performance, security, and long-term maintainability.",
    desc:    "APIs are the backbone of modern software. I build REST APIs that are clean, properly versioned, documented, and secured — and integrate third-party services so your app can talk to the outside world reliably. Whether you need a greenfield API or integrations into an existing system, I deliver something your team can build on confidently.",
    features: [
      "RESTful API design with proper structure",
      "Third-party API integration & webhooks",
      "Payment systems (Stripe, Razorpay)",
      "Transactional email services (SendGrid, Nodemailer)",
      "Cloud storage integration (AWS S3, Cloudinary)",
      "JWT authentication & refresh token flows",
      "Rate limiting, input validation & error handling",
    ],
    bestFor: "Teams that need a reliable API layer for their web app, mobile app, or internal tooling.",
  },
  {
    id:      "performance",
    num:     "05",
    icon:    Gauge,
    color:   "#f43f5e",
    colorBg: "rgba(244,63,94,0.1)",
    glow:    "rgba(244,63,94,0.12)",
    ctaBg:   "rgba(244,63,94,0.07)",
    ctaBorder:"rgba(244,63,94,0.35)",
    ctaText: "#e11d48",
    grad:    "linear-gradient(135deg, #f43f5e, #ec4899)",
    title:   "Website Performance Optimisation",
    short:   "Turn a slow, frustrating web experience into a fast, smooth one — measurably improving load times, conversion rates, and server costs.",
    desc:    "Every 100ms of latency costs you users and revenue. I audit and optimise existing applications across every layer: frontend bundle sizes, rendering strategy, API response times, database query efficiency, and server configuration. You'll see real, measurable numbers improve — not just feel-good tweaks.",
    features: [
      "React bundle & rendering optimisation",
      "API response time & payload reduction",
      "Database query analysis & indexing",
      "Lazy loading, code splitting & caching",
      "Core Web Vitals improvement (LCP, CLS, FID)",
      "Security hardening & vulnerability patching",
      "Lighthouse audit & ongoing benchmarking",
    ],
    bestFor: "Businesses with an existing application that feels slow, expensive to run, or is losing users at key conversion points.",
  },
  {
    id:      "portfolio",
    num:     "06",
    icon:    Briefcase,
    color:   "#8b5cf6",
    colorBg: "rgba(139,92,246,0.1)",
    glow:    "rgba(139,92,246,0.12)",
    ctaBg:   "rgba(139,92,246,0.07)",
    ctaBorder:"rgba(139,92,246,0.35)",
    ctaText: "#7c3aed",
    grad:    "linear-gradient(135deg, #8b5cf6, #a855f7)",
    title:   "Portfolio & Personal Brand Websites",
    short:   "A premium, custom-designed portfolio that makes the right first impression and converts visitors into clients or opportunities.",
    desc:    "Your online presence is your most important business asset. I build fast, beautifully designed, SEO-optimised portfolio sites for developers, designers, and creators who want to stand out in a crowded market. No templates, no generic layouts — a digital home that reflects your brand, your work, and your personality.",
    features: [
      "Custom, fully responsive UI — pixel-perfect on all screens",
      "SEO-optimised with structured data & meta tags",
      "Blog / writing section integration",
      "Project showcase system with filtering",
      "Custom branding, typography & colour system",
      "Contact forms with email integration",
      "Dark & light mode, accessibility compliance",
    ],
    bestFor: "Developers, designers, freelancers, and creators who want a strong, professional online presence.",
  },
  {
    id:      "devops",
    num:     "07",
    icon:    Server,
    color:   "#ec4899",
    colorBg: "rgba(236,72,153,0.1)",
    glow:    "rgba(236,72,153,0.12)",
    ctaBg:   "rgba(236,72,153,0.07)",
    ctaBorder:"rgba(236,72,153,0.35)",
    ctaText: "#db2777",
    grad:    "linear-gradient(135deg, #ec4899, #f97316)",
    title:   "Deployment & DevOps Setup",
    short:   "From development to a live, production-ready deployment — configured correctly, secured, and ready to scale.",
    desc:    "Getting an application from your local machine to production without headaches requires proper server configuration, reverse proxies, SSL, process management, and a solid CI/CD pipeline. I handle the full deployment setup so you can ship confidently and sleep soundly.",
    features: [
      "VPS deployment & Linux server configuration",
      "Nginx reverse proxy & load balancing setup",
      "PM2 process management & auto-restart",
      "Domain configuration & SSL/HTTPS (Let's Encrypt)",
      "GitHub Actions CI/CD pipeline setup",
      "Environment variable management & secrets",
      "Monitoring, logging & uptime alerting",
    ],
    bestFor: "Developers and founders who need their application live, fast, and configured correctly the first time.",
  },
  {
    id:      "maintenance",
    num:     "08",
    icon:    Wrench,
    color:   "#14b8a6",
    colorBg: "rgba(20,184,166,0.1)",
    glow:    "rgba(20,184,166,0.12)",
    ctaBg:   "rgba(20,184,166,0.07)",
    ctaBorder:"rgba(20,184,166,0.35)",
    ctaText: "#0d9488",
    grad:    "linear-gradient(135deg, #14b8a6, #06b6d4)",
    title:   "Maintenance & Long-Term Support",
    short:   "An ongoing technical partnership — so your application keeps running, improving, and adapting as your business grows.",
    desc:    "Software is never truly finished. Dependencies get outdated, bugs surface, business requirements evolve, and new features need to be added. I offer maintenance retainers and long-term support partnerships for applications I've built or existing codebases that need a reliable technical owner.",
    features: [
      "Bug fixing & issue investigation",
      "Feature additions & iterative improvements",
      "Security patches & dependency updates",
      "Performance monitoring & alerting",
      "Database maintenance & backups",
      "Code reviews & technical consultation",
      "Long-term retainer partnership available",
    ],
    bestFor: "Businesses that want a dedicated, reliable developer on call — not a one-time job shop.",
  },
];

/* ── Process Steps ─────────────────────────────────────────────────────────── */
const PROCESS = [
  { n: "01", title: "Discovery Call",        desc: "We discuss your project goals, scope, timeline, and budget in a free 30-minute call." },
  { n: "02", title: "Proposal & Scope",      desc: "I provide a detailed written proposal with timeline, deliverables, and fixed pricing." },
  { n: "03", title: "Design & Development",  desc: "Active development with regular updates, demos, and feedback checkpoints throughout." },
  { n: "04", title: "Review & Refinement",   desc: "We go through a structured review period to ensure everything meets your expectations." },
  { n: "05", title: "Launch & Handoff",      desc: "Deployment, documentation, and a handover session so you're fully in control." },
];

/* ── Why Work With Me ──────────────────────────────────────────────────────── */
const WHY = [
  { icon: Code2,         color: "#6366f1", bg: "rgba(99,102,241,0.1)",  glow: "rgba(99,102,241,0.25)",  title: "Clean Architecture",       desc: "Code that's readable, maintainable, and built to grow with your business — not a quick hack that will haunt you in 6 months." },
  { icon: Shield,        color: "#10b981", bg: "rgba(16,185,129,0.1)",  glow: "rgba(16,185,129,0.25)",  title: "Security-First Mindset",    desc: "Authentication, input validation, CORS, rate limiting, and safe dependency management built in from the start — not bolted on later." },
  { icon: Rocket,        color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  glow: "rgba(245,158,11,0.25)",  title: "Scalable by Design",        desc: "Systems designed to handle 10x traffic growth without fundamental rewrites. Performance and scalability are considered from day one." },
  { icon: MessageSquare, color: "#06b6d4", bg: "rgba(6,182,212,0.1)",   glow: "rgba(6,182,212,0.25)",   title: "Transparent Communication", desc: "You'll never be left wondering about project status. Regular updates, honest timelines, and a direct line to the developer — no middlemen." },
  { icon: HeartHandshake,color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  glow: "rgba(139,92,246,0.25)",  title: "Long-Term Partnership",     desc: "I don't disappear after launch. I'm invested in the ongoing success of what we build together and available for support, updates, and growth." },
  { icon: Target,        color: "#f43f5e", bg: "rgba(244,63,94,0.1)",   glow: "rgba(244,63,94,0.25)",   title: "Business-Outcome Focused",  desc: "I think about your users and business goals, not just technical elegance. Delivery timelines, user experience, and ROI are always in the picture." },
];

/* ── FAQs ──────────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Do you work with clients outside India?", a: "Yes — I work with clients globally. Communication is handled via email, Notion, and video calls. Time zone overlap can typically be managed to ensure smooth collaboration regardless of location." },
  { q: "How do you price your services?", a: "Pricing depends on project scope, complexity, and timeline. I provide fixed-price proposals after an initial discovery call so there are no billing surprises. Retainer pricing is available for ongoing maintenance partnerships." },
  { q: "How long does a typical project take?", a: "A simple portfolio or landing page: 1–2 weeks. A full MERN application: 4–10 weeks depending on scope. Complex SaaS platforms or e-commerce systems: 8–16 weeks. Timelines are defined precisely in the proposal before work begins." },
  { q: "Do you take on projects for early-stage startups or MVPs?", a: "Yes — MVPs are a particular strength. I focus on building the core functionality that proves your concept without over-engineering, which keeps costs reasonable and timelines short. We can expand from a solid MVP foundation." },
  { q: "Will I own the code and all project assets after delivery?", a: "Absolutely. Upon final payment, all code, assets, credentials, and project files are fully transferred to you. You own everything — there are no licensing fees or ongoing dependency on me (unless you choose a maintenance partnership)." },
  { q: "Do you provide source code and documentation?", a: "Yes. Full source code is delivered via a private GitHub repository, and every project includes a handoff document covering the architecture, environment setup, deployment process, and instructions for common maintenance tasks." },
  { q: "What if I need changes after the project is launched?", a: "Post-launch changes are handled in two ways: small fixes within a defined scope are covered by the post-launch support period included in every project. Larger additions or ongoing work can be structured as a maintenance retainer or new project scope." },
  { q: "How do I get started?", a: "The simplest way is to send a message through the contact form on this site or email hello@shivamstack.com with a brief description of your project. We'll schedule a free 30-minute discovery call to discuss your needs and determine if we're a good fit." },
];

/* ── Hook ─────────────────────────────────────────────────────────────────── */
function useScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return show;
}

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
const ServicesPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const showTop = useScrollTop();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = META.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", META.description);
  }, []);

  const scrollTo  = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main
      className={`sssp-root ${isDarkMode ? "dark" : "light"}`}
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <meta itemProp="name" content={META.title} />
      <meta itemProp="description" content={META.description} />

      {/* ── Ambient ── */}
      <div className="sssp-ambient" aria-hidden="true">
        <div className="sssp-orb sssp-orb-1" />
        <div className="sssp-orb sssp-orb-2" />
        <div className="sssp-orb sssp-orb-3" />
        <div className="sssp-grid" />
        <div className="sssp-noise" />
      </div>

      {/* ══════════ HERO ══════════ */}
      <header className="sssp-hero">
        <div className="sssp-hero-eyebrow">
          <Code2 size={13} />
          <span>MERN Stack Developer · Delhi, India</span>
        </div>
        <h1 className="sssp-hero-title" itemProp="headline">
          Let's Build Something<br />
          <span className="sssp-gradient-text">That Actually Works</span>
        </h1>
        <p className="sssp-hero-sub">
          I'm a full-stack MERN developer offering professional development services for
          startups, founders, creators, and businesses. From idea to deployed product —
          with clean code, real security, and support that doesn't vanish after launch.
        </p>
        <div className="sssp-hero-chips">
          <span className="sssp-chip"><CheckCircle size={11} style={{ color: '#10b981' }} /> MERN Stack Specialist</span>
          <span className="sssp-chip"><Globe size={11} style={{ color: '#6366f1' }} /> Remote — Worldwide</span>
          <span className="sssp-chip"><Clock size={11} style={{ color: '#f59e0b' }} /> Fast Turnaround</span>
          <span className="sssp-chip"><Shield size={11} style={{ color: '#06b6d4' }} /> Security-First</span>
        </div>
        <div className="sssp-hero-cta-row">
          <Link to="/contact" className="sssp-btn-primary">
            <MessageSquare size={16} />
            Discuss Your Project
            <ArrowRight size={15} />
          </Link>
          <a href="#services" className="sssp-btn-secondary" onClick={(e) => { e.preventDefault(); scrollTo("services"); }}>
            <Sparkles size={15} />
            View All Services
          </a>
        </div>
        <div className="sssp-hero-deco" aria-hidden="true">
          <Code2 size={200} />
        </div>
      </header>

      {/* ── Quick Nav Strip ── */}
      <nav className="sssp-service-nav-strip" aria-label="Quick jump to services">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            className="sssp-service-nav-btn"
            onClick={() => scrollTo(s.id)}
          >
            <span className="sssp-service-nav-dot" style={{ background: s.color }} />
            {s.title.split("&")[0].trim()}
          </button>
        ))}
      </nav>

      {/* ══════════ PAGE BODY ══════════ */}
      <div className="sssp-page-body" id="services">

        {/* ── Stats ── */}
        <div className="sssp-trust-section">
          <div className="sssp-stats-showcase">
            {[
              { value: "50+",   label: "Projects Delivered" },
              { value: "100%",  label: "Client Ownership of Code" },
              { value: "3–16w", label: "Typical Project Timeline" },
              { value: "24h",   label: "Support Response Time" },
            ].map((st, i) => (
              <div className="sssp-stat-block" key={i}>
                <span className="sssp-stat-value">{st.value}</span>
                <span className="sssp-stat-label">{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ SERVICE CARDS ══════════ */}
        <div className="sssp-section-label">
          <p className="sssp-section-label-eyebrow">What I Offer</p>
          <h2 className="sssp-section-label-title">8 Core Service Areas</h2>
        </div>

        <div className="sssp-services-grid" itemScope itemType="https://schema.org/ItemList">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className="sssp-service-card"
              style={{
                "--sssp-card-accent": s.grad,
                "--sssp-card-glow":   s.glow,
                "--sssp-card-cta-bg": s.ctaBg,
                "--sssp-card-cta-border": s.ctaBorder,
                "--sssp-card-cta-text": s.ctaText,
              }}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/Service"
            >
              <meta itemProp="position" content={i + 1} />

              {/* Header */}
              <div className="sssp-card-header">
                <div
                  className="sssp-card-icon-wrap"
                  style={{ background: s.colorBg, borderColor: `${s.color}22` }}
                >
                  <s.icon size={22} color={s.color} />
                </div>
                <div className="sssp-card-meta">
                  <div className="sssp-card-number">Service {s.num}</div>
                  <h3 className="sssp-card-title" itemProp="name">{s.title}</h3>
                </div>
              </div>

              {/* Short desc */}
              <p className="sssp-card-desc" itemProp="description">{s.short}</p>

              {/* Long desc */}
              <p style={{ fontSize: 13, color: 'var(--sssp-text-muted)', lineHeight: 1.68, marginBottom: 20 }}>
                {s.desc}
              </p>

              {/* Feature list */}
              <ul className="sssp-feature-list" aria-label={`Features of ${s.title}`}>
                {s.features.map((f, j) => (
                  <li className="sssp-feature-item" key={j}>
                    <span
                      className="sssp-feature-dot"
                      style={{ background: s.colorBg, borderColor: `${s.color}30` }}
                    >
                      <CheckCircle size={11} color={s.color} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Best For */}
              <div className="sssp-best-for">
                <span className="sssp-best-for-label">Best for</span>
                <span>{s.bestFor}</span>
              </div>

              {/* CTA */}
              <Link to="/contact" className="sssp-card-cta">
                <MessageSquare size={14} />
                Discuss Your Project
                <ArrowRight size={14} className="sssp-card-cta-arrow" />
              </Link>
            </article>
          ))}
        </div>

        {/* ══════════ PROCESS ══════════ */}
        <div className="sssp-process-section">
          <div className="sssp-section-label">
            <p className="sssp-section-label-eyebrow">How It Works</p>
            <h2 className="sssp-section-label-title">A Simple, Clear Process</h2>
          </div>

          <div className="sssp-process-track">
            {PROCESS.map((p, i) => (
              <div className="sssp-process-step" key={i}>
                <div className="sssp-process-node">{p.n}</div>
                <div className="sssp-process-title">{p.title}</div>
                <div className="sssp-process-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ WHY WORK WITH ME ══════════ */}
        <div className="sssp-why-section" id="why">
          <div className="sssp-section-label">
            <p className="sssp-section-label-eyebrow">The Difference</p>
            <h2 className="sssp-section-label-title">Why Work With Me?</h2>
          </div>

          <div className="sssp-why-grid">
            {WHY.map((w, i) => (
              <div className="sssp-why-card" key={i}>
                <div
                  className="sssp-why-card-glow"
                  style={{ background: w.glow }}
                />
                <div className="sssp-why-icon" style={{ background: w.bg, borderColor: `${w.color}22` }}>
                  <w.icon size={20} color={w.color} />
                </div>
                <div className="sssp-why-title">{w.title}</div>
                <div className="sssp-why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ TECH STACK ══════════ */}
        <div className="sssp-stack-section">
          <div className="sssp-section-label">
            <p className="sssp-section-label-eyebrow">Under the Hood</p>
            <h2 className="sssp-section-label-title">Technology Stack</h2>
          </div>

          <div className="sssp-stack-wrap">
            {[
              {
                cat: "Frontend",
                color: "#6366f1",
                items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Redux Toolkit", "React Query"],
              },
              {
                cat: "Backend",
                color: "#10b981",
                items: ["Node.js", "Express.js", "MongoDB", "Mongoose", "PostgreSQL", "Redis", "REST API", "JWT Auth"],
              },
              {
                cat: "Payments & Services",
                color: "#f59e0b",
                items: ["Razorpay", "Stripe", "SendGrid", "Cloudinary", "AWS S3", "Firebase Auth", "Google OAuth", "Nodemailer"],
              },
              {
                cat: "DevOps & Deployment",
                color: "#ec4899",
                items: ["Linux / Ubuntu", "Nginx", "PM2", "Docker", "GitHub Actions", "Vercel", "Railway", "Let's Encrypt SSL"],
              },
            ].map((cat, ci) => (
              <div key={ci}>
                <div className="sssp-stack-category-title">{cat.cat}</div>
                <div className="sssp-stack-badges">
                  {cat.items.map((item, ii) => (
                    <span className="sssp-stack-badge" key={ii}>
                      <span className="sssp-stack-badge-dot" style={{ background: cat.color }} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ WHO I WORK WITH ══════════ */}
        <div className="sssp-audience-section" id="who">
          <div className="sssp-section-label">
            <p className="sssp-section-label-eyebrow">Fit</p>
            <h2 className="sssp-section-label-title">Who I Work Best With</h2>
          </div>

          <div className="sssp-audience-layout">
            {/* Ideal clients */}
            <div className="sssp-audience-block sssp-audience-block--ideal">
              <div className="sssp-audience-block-title">
                <CheckCircle size={20} color="#10b981" />
                Great Fit
              </div>
              <div className="sssp-audience-block-sub">
                These are the types of projects and clients where I deliver the most value.
              </div>
              <ul className="sssp-audience-list">
                {[
                  { icon: Rocket,          label: "Early-stage startups building their MVP" },
                  { icon: Users,           label: "Small business owners going digital" },
                  { icon: BookOpen,        label: "Coaches & educators selling PDFs or courses" },
                  { icon: GraduationCap,   label: "Educators building learning platforms" },
                  { icon: Sparkles,        label: "Digital creators building a product business" },
                  { icon: Building2,       label: "Founders building their first SaaS" },
                  { icon: Briefcase,       label: "Developers wanting a strong portfolio site" },
                  { icon: ShoppingCart,    label: "Sellers launching a digital product store" },
                ].map((a, i) => (
                  <li className="sssp-audience-item" key={i}>
                    <span
                      className="sssp-audience-item-icon"
                      style={{ background: "rgba(16,185,129,0.1)" }}
                    >
                      <a.icon size={12} color="#10b981" />
                    </span>
                    {a.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* What I'm not */}
            <div className="sssp-audience-block sssp-audience-block--avoid">
              <div className="sssp-audience-block-title">
                <XCircle size={20} color="#f43f5e" />
                Not My Focus
              </div>
              <div className="sssp-audience-block-sub">
                I'm clear about this so we don't waste each other's time.
              </div>
              <ul className="sssp-audience-list">
                {[
                  { label: "Clients seeking the absolute cheapest price on the market" },
                  { label: "Projects requiring only frontend / WordPress templates" },
                  { label: "\"I need everything\" scope-less briefs with no defined goal" },
                  { label: "Projects expecting senior agency output at intern rates" },
                  { label: "Work where I'd be one of many vendor-swapped contractors" },
                  { label: "Clients who aren't open to architectural or technical input" },
                ].map((a, i) => (
                  <li className="sssp-audience-item" key={i}>
                    <span
                      className="sssp-audience-item-icon"
                      style={{ background: "rgba(244,63,94,0.08)" }}
                    >
                      <XCircle size={11} color="#f43f5e" />
                    </span>
                    {a.label}
                  </li>
                ))}
              </ul>

              <div style={{
                marginTop: 20,
                padding: '14px 16px',
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 12,
                fontSize: 13,
                lineHeight: 1.65,
                color: 'var(--sssp-text-muted)',
              }}>
                <strong style={{ color: 'var(--sssp-text-body)' }}>Honest positioning:</strong> I'm a MERN specialist, not a generalist agency. I do fewer projects, with higher care and standards, for clients who value quality and a real working relationship.
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ FAQ ══════════ */}
        <div className="sssp-faq-section" id="faq" itemScope itemType="https://schema.org/FAQPage">
          <div className="sssp-section-label">
            <p className="sssp-section-label-eyebrow">Common Questions</p>
            <h2 className="sssp-section-label-title">Frequently Asked</h2>
          </div>

          <div className="sssp-faq-grid">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`sssp-faq-card ${openFaq === i ? "sssp-faq-card--open" : ""}`}
                itemScope
                itemType="https://schema.org/Question"
                style={{ animationDelay: `${0.04 + i * 0.06}s` }}
              >
                <button
                  className="sssp-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span itemProp="name">{faq.q}</span>
                  <Plus size={16} className="sssp-faq-q-icon" />
                </button>
                <div className="sssp-faq-a" itemScope itemType="https://schema.org/Answer">
                  <div className="sssp-faq-a-inner" itemProp="text">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ FINAL CTA ══════════ */}
        <div className="sssp-final-cta">
          <div className="sssp-final-cta-noise" aria-hidden="true" />
          <div className="sssp-final-cta-mesh" aria-hidden="true" />
          <div className="sssp-final-cta-eyebrow">
            <Rocket size={12} />
            Ready When You Are
          </div>
          <h2 className="sssp-final-cta-title">
            Have a project in mind?<br />
            Let's make it real.
          </h2>
          <p className="sssp-final-cta-sub">
            A free 30-minute discovery call is the best way to start. No hard sell,
            no obligation — just a real conversation about what you're building and whether I'm the right fit.
          </p>
          <div className="sssp-final-cta-btns">
            <Link to="/contact" className="sssp-cta-btn-white">
              <MessageSquare size={16} />
              Discuss Your Project
            </Link>
            <a href="mailto:hello@shivamstack.com" className="sssp-cta-btn-ghost">
              <Mail size={16} />
              hello@shivamstack.com
            </a>
          </div>
          <div className="sssp-guarantee-strip">
            {[
              { icon: CheckCircle, text: "Free discovery call" },
              { icon: CheckCircle, text: "Fixed-price proposals" },
              { icon: CheckCircle, text: "Full code ownership" },
              { icon: CheckCircle, text: "No surprise charges" },
            ].map((g, i) => (
              <div className="sssp-guarantee-item" key={i}>
                <g.icon size={14} color="rgba(255,255,255,0.65)" />
                {g.text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Related Pages ── */}
        <div className="sssp-related-row">
          <Link to="/about" className="sssp-related-link">
            <Sparkles size={22} style={{ color: 'var(--sssp-text-accent)', flexShrink: 0 }} />
            <div>
              <strong>About ShivamStack</strong>
              <span>The story, skills, and values</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--sssp-text-muted)', flexShrink: 0 }} />
          </Link>
          <Link to="/contact" className="sssp-related-link">
            <Mail size={22} style={{ color: 'var(--sssp-text-accent)', flexShrink: 0 }} />
            <div>
              <strong>Contact & Enquiries</strong>
              <span>Start a conversation</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--sssp-text-muted)', flexShrink: 0 }} />
          </Link>
          <Link to="/privacy" className="sssp-related-link">
            <Shield size={22} style={{ color: 'var(--sssp-text-accent)', flexShrink: 0 }} />
            <div>
              <strong>Privacy Policy</strong>
              <span>How we handle your data</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--sssp-text-muted)', flexShrink: 0 }} />
          </Link>
          <Link to="/terms" className="sssp-related-link">
            <BookOpen size={22} style={{ color: 'var(--sssp-text-accent)', flexShrink: 0 }} />
            <div>
              <strong>Terms of Service</strong>
              <span>Rules and guidelines</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--sssp-text-muted)', flexShrink: 0 }} />
          </Link>
        </div>

      </div>{/* end sssp-page-body */}

      {/* Scroll to top */}
      <button
        className={`sssp-scroll-top ${showTop ? "sssp-scroll-top--visible" : ""}`}
        onClick={scrollTop}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </main>
  );
};

export default ServicesPage;