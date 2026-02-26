import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, User, Code2, BookOpen, Layers, Globe, Mail,
  ChevronRight, ArrowUp, Shield, FileText, Zap, Target,
  Award, Heart, Coffee, Star, Image, Briefcase, GraduationCap,
  Terminal, Package, CheckCircle, Rocket, Github, Twitter, Linkedin,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const META = {
  title:       "About ShivamStack — Shivam Kumar",
  description: "Learn about ShivamStack and its creator Shivam Kumar — a full-stack developer and content creator from India who builds open-source projects, educational tutorials, and premium digital resources.",
};

const SECTIONS = [
  { id: "ab-story",    icon: BookOpen,    title: "The Story" },
  { id: "ab-creator",  icon: User,        title: "About the Creator" },
  { id: "ab-mission",  icon: Target,      title: "Mission & Values" },
  { id: "ab-what",     icon: Layers,      title: "What We Build" },
  { id: "ab-skills",   icon: Code2,       title: "Skills & Tech Stack" },
  { id: "ab-journey",  icon: GraduationCap, title: "Journey & Timeline" },
  { id: "ab-products", icon: Package,     title: "Digital Products" },
  { id: "ab-connect",  icon: Globe,       title: "Let's Connect" },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []); // eslint-disable-line
  return [active];
}

const AboutUs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [active]       = useActiveSection(SECTIONS.map((s) => s.id));
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.title = META.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", META.description);
  }, []);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo  = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main
      className={`sspg-root ${isDarkMode ? "dark" : "light"}`}
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      <meta itemProp="name" content={META.title} />
      <meta itemProp="description" content={META.description} />

      {/* Ambient */}
      <div className="sspg-ambient" aria-hidden="true">
        <div className="sspg-orb sspg-orb-1" />
        <div className="sspg-orb sspg-orb-2" />
        <div className="sspg-orb sspg-orb-3" />
        <div className="sspg-grid" />
        <div className="sspg-noise" />
      </div>

      {/* HERO */}
      <header className="sspg-hero sspg-hero--about">
        <div className="sspg-hero-eyebrow">
          <Sparkles size={13} />
          <span>The Platform · About ShivamStack</span>
        </div>
        <h1 className="sspg-hero-title" itemProp="headline">
          About <span className="sspg-gradient-text">ShivamStack</span>
        </h1>
        <p className="sspg-hero-sub">
          A creative hub built by a full-stack developer and educator from India — where real-world
          engineering meets beautiful, accessible learning for developers at every stage.
        </p>
        <div className="sspg-hero-chips">
          <span className="sspg-chip"><Globe size={11} /> Based in India</span>
          <span className="sspg-chip"><Code2 size={11} /> Full-Stack Developer</span>
          <span className="sspg-chip"><BookOpen size={11} /> Educator & Creator</span>
        </div>
        <div className="sspg-hero-deco" aria-hidden="true">
          <Sparkles size={120} />
        </div>
      </header>

      <div className="sspg-layout">

        {/* Sidebar */}
        <aside className="sspg-sidebar">
          <p className="sspg-sidebar-label">On this page</p>
          <nav aria-label="About page sections">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`sspg-toc-btn ${active === s.id ? "sspg-toc-active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                <s.icon size={12} />
                <span>{s.title}</span>
              </button>
            ))}
          </nav>
          <div className="sspg-sidebar-footer">
            <Link to="/contact" className="sspg-sidebar-link"><Mail size={12} />Contact Us</Link>
            <Link to="/privacy" className="sspg-sidebar-link"><Shield size={12} />Privacy Policy</Link>
          </div>
        </aside>

        {/* Content */}
        <article className="sspg-content" itemProp="mainContentOfPage">

          {/* ── 01 Story ── */}
          <section id="ab-story" className="sspg-section sspg-reveal" aria-labelledby="ab-story-h">
            <span className="sspg-section-num" aria-hidden="true">01</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-indigo"><BookOpen size={18} /></div>
              <h2 id="ab-story-h" className="sspg-section-title">The Story Behind ShivamStack</h2>
            </header>
            <div className="sspg-prose">
              <p><strong>ShivamStack</strong> started from a simple frustration: the best programming tutorials and resources online were either locked behind expensive paywalls, scattered across dozens of platforms, or written in a way that made things more confusing than clarifying. The question was simple — could one developer build a single, well-designed home for genuinely useful technical content?</p>

              <p>What began as a personal blog to document development learnings and project experiments evolved into a full-fledged creative platform. Today, ShivamStack serves as a portfolio, educational hub, and digital product store — all built, designed, and maintained by a single developer who cares deeply about quality over quantity.</p>

              <p>Every article is written from real experience. Every digital product is created to solve a problem the creator personally encountered. Every design decision is made with the reader's clarity and ease of use as the top priority. ShivamStack is not venture-funded, not run by a team of fifty, and not optimised for search engine click-bait. It's a craftsman's project — built with care, maintained with discipline, and growing one genuine piece of content at a time.</p>

              {/* Image placeholder — replace src when ready */}
              <div className="sspg-img-box" style={{ marginTop: 24 }}>
                <div className="sspg-img-placeholder">
                  <Image size={32} />
                  <span>ShivamStack workspace / banner image</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>Recommended: 1200×400px, any format</span>
                </div>
              </div>

              <div className="sspg-stats-row">
                {[
                  { value: "50+",    label: "Articles Published" },
                  { value: "10+",    label: "Open Source Projects" },
                  { value: "1K+",    label: "Community Members" },
                  { value: "15+",    label: "Digital Products" },
                ].map((st, i) => (
                  <div className="sspg-stat-card" key={i}>
                    <span className="sspg-stat-value">{st.value}</span>
                    <span className="sspg-stat-label">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 02 Creator ── */}
          <section id="ab-creator" className="sspg-section sspg-reveal" aria-labelledby="ab-creator-h">
            <span className="sspg-section-num" aria-hidden="true">02</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-purple"><User size={18} /></div>
              <h2 id="ab-creator-h" className="sspg-section-title">About the Creator</h2>
            </header>
            <div className="sspg-prose">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 32,
                  alignItems: 'start',
                  flexWrap: 'wrap',
                }}
              >
                {/* Profile Card */}
                <div className="sspg-profile-card" style={{ minWidth: 200, maxWidth: 240 }} itemScope itemType="https://schema.org/Person">
                  {/* Replace with <img src="/images/avatar.jpg" alt="Shivam Kumar" className="sspg-profile-avatar" /> once you have the image */}
                  <div className="sspg-profile-avatar-placeholder">SK</div>
                  <p className="sspg-profile-name" itemProp="name">Shivam Kumar</p>
                  <p className="sspg-profile-role" itemProp="jobTitle">Full-Stack Developer & Creator</p>
                  <p className="sspg-profile-bio">Building things on the internet, sharing what I learn, and creating digital resources for developers who want to grow faster.</p>
                  <div className="sspg-profile-socials">
                    <a href="https://github.com/shivamstack" target="_blank" rel="noopener noreferrer" className="sspg-social-btn">
                      <Github size={13} /> GitHub
                    </a>
                    <a href="https://twitter.com/shivamstack" target="_blank" rel="noopener noreferrer" className="sspg-social-btn">
                      <Twitter size={13} /> Twitter
                    </a>
                    <a href="https://linkedin.com/in/shivamstack" target="_blank" rel="noopener noreferrer" className="sspg-social-btn">
                      <Linkedin size={13} /> LinkedIn
                    </a>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p>Hi — I'm <strong>Shivam Kumar</strong>, a self-driven full-stack developer and content creator based in India. I've spent years working with modern web technologies, building projects ranging from simple personal tools to full-stack SaaS applications and REST APIs serving thousands of requests.</p>
                  <p>My engineering philosophy is grounded in the belief that <strong>simplicity, clarity, and correctness</strong> are more valuable than clever complexity. I write code that other developers can read, maintain, and build upon — and I try to write content the same way.</p>
                  <p>Beyond pure development, I care deeply about <strong>developer education</strong>. Too many talented developers get stuck not because they lack ability, but because finding genuinely good, practical resources is hard. ShivamStack is my attempt to contribute something meaningful to that problem.</p>
                  <p>When I'm not coding or writing, I'm usually experimenting with new frameworks, contributing to open-source communities, or drinking far too much coffee while debugging something that turns out to be a typo.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 03 Mission ── */}
          <section id="ab-mission" className="sspg-section sspg-reveal" aria-labelledby="ab-mission-h">
            <span className="sspg-section-num" aria-hidden="true">03</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><Target size={18} /></div>
              <h2 id="ab-mission-h" className="sspg-section-title">Mission &amp; Core Values</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack has a focused, unwavering mission: <strong>to create high-quality, practical developer content and tools that genuinely help people build better software and advance their careers.</strong> Everything published on the Platform is evaluated against this mission before it goes live.</p>

              <div className="sspg-values-grid">
                {[
                  { icon: CheckCircle, c: "#10b981", bg: "rgba(16,185,129,0.1)", t: "Quality Over Quantity",  d: "One well-crafted article beats ten mediocre posts. Every piece of content is researched, tested, and written to add real value." },
                  { icon: Globe,       c: "#06b6d4", bg: "rgba(6,182,212,0.1)",  t: "Accessibility First",   d: "Developer education shouldn't be locked away or unnecessarily expensive. Foundational content is free and always will be." },
                  { icon: Code2,       c: "#8b5cf6", bg: "rgba(139,92,246,0.1)", t: "Practical Over Abstract", d: "Everything taught here is something I've actually built and used. No copy-paste tutorials — real patterns from real projects." },
                  { icon: Heart,       c: "#f43f5e", bg: "rgba(244,63,94,0.1)",  t: "Respect for the Reader", d: "Your time is valuable. Content is written to be dense with insight, free of filler, and structured for how developers actually read." },
                  { icon: Shield,      c: "#f59e0b", bg: "rgba(245,158,11,0.1)", t: "Honest & Transparent",   d: "No sponsored recommendations disguised as genuine advice. No affiliate links that haven't been personally vetted. No hidden agendas." },
                  { icon: Zap,         c: "#6366f1", bg: "rgba(99,102,241,0.1)", t: "Always Improving",       d: "Old articles are updated when technology changes. Products are improved based on customer feedback. The Platform gets better over time." },
                ].map((v, i) => (
                  <div className="sspg-value-card" key={i}>
                    <div className="sspg-value-icon" style={{ background: v.bg }}>
                      <v.icon size={22} color={v.c} />
                    </div>
                    <div className="sspg-value-title">{v.t}</div>
                    <div className="sspg-value-desc">{v.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 04 What We Build ── */}
          <section id="ab-what" className="sspg-section sspg-reveal" aria-labelledby="ab-what-h">
            <span className="sspg-section-num" aria-hidden="true">04</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-cyan"><Layers size={18} /></div>
              <h2 id="ab-what-h" className="sspg-section-title">What ShivamStack Builds &amp; Publishes</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack is a multi-format creative platform covering several distinct categories of output. Each type of content or product is created to serve a specific need in the developer community.</p>

              <div className="sspg-services-grid">
                {[
                  { icon: Terminal,   c: "#8b5cf6", title: "Technical Tutorials",       desc: "Deep-dive, practical tutorials covering full-stack development — from React component architecture to Node.js API design, database optimisation, Docker, and CI/CD pipelines." },
                  { icon: Code2,      c: "#6366f1", title: "Open-Source Projects",      desc: "Real-world open-source applications and libraries published on GitHub. Designed to be readable, well-documented, and genuinely useful as reference implementations." },
                  { icon: Package,    c: "#10b981", title: "Digital Products",          desc: "Carefully crafted PDF guides, e-books, code templates, and reference sheets designed to compress hours of research into focused, actionable documents." },
                  { icon: BookOpen,   c: "#f59e0b", title: "Articles & Deep Dives",     desc: "Long-form technical articles that go beyond surface-level introductions — exploring the 'why' behind architectural decisions and engineering trade-offs." },
                  { icon: Briefcase,  c: "#06b6d4", title: "Portfolio Projects",        desc: "Showcased portfolio projects demonstrating applied full-stack development, design systems, and software architecture across diverse domains." },
                  { icon: Award,      c: "#f43f5e", title: "Community Resources",       desc: "Curated developer resources, reading lists, tool comparisons, and productivity guides shared freely to help the broader developer community." },
                ].map((s, i) => (
                  <div className="sspg-service-card" key={i}>
                    <div className="sspg-service-icon" style={{ background: `${s.c}18` }}>
                      <s.icon size={22} color={s.c} />
                    </div>
                    <div className="sspg-service-title">{s.title}</div>
                    <div className="sspg-service-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 05 Skills ── */}
          <section id="ab-skills" className="sspg-section sspg-reveal" aria-labelledby="ab-skills-h">
            <span className="sspg-section-num" aria-hidden="true">05</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-amber"><Code2 size={18} /></div>
              <h2 id="ab-skills-h" className="sspg-section-title">Skills &amp; Technology Stack</h2>
            </header>
            <div className="sspg-prose">
              <p>The ShivamStack platform and its associated projects are built using modern, production-grade tools and technologies. The following reflects the primary stack in active use:</p>

              <h3 className="sspg-h3">Frontend</h3>
              <div className="sspg-skills-grid">
                {["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Redux", "React Query"].map((s, i) => (
                  <div className="sspg-skill-chip" key={i}>
                    <div className="sspg-skill-chip-icon"><Code2 size={14} /></div>
                    <div className="sspg-skill-chip-name">{s}</div>
                  </div>
                ))}
              </div>

              <h3 className="sspg-h3">Backend</h3>
              <div className="sspg-skills-grid">
                {["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Redis", "REST APIs", "JWT Auth", "Mongoose"].map((s, i) => (
                  <div className="sspg-skill-chip" key={i}>
                    <div className="sspg-skill-chip-icon"><Terminal size={14} /></div>
                    <div className="sspg-skill-chip-name">{s}</div>
                  </div>
                ))}
              </div>

              <h3 className="sspg-h3">DevOps & Tools</h3>
              <div className="sspg-skills-grid">
                {["Git", "GitHub Actions", "Docker", "Vercel", "Railway", "AWS S3", "Cloudinary", "Linux"].map((s, i) => (
                  <div className="sspg-skill-chip" key={i}>
                    <div className="sspg-skill-chip-icon"><Zap size={14} /></div>
                    <div className="sspg-skill-chip-name">{s}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24 }}>
                <p>This stack is not fixed — it evolves based on project requirements and what genuinely solves problems most effectively. The priority is always <strong>choosing the right tool for the job</strong>, not chasing every new framework trend.</p>
              </div>
            </div>
          </section>

          {/* ── 06 Journey ── */}
          <section id="ab-journey" className="sspg-section sspg-reveal" aria-labelledby="ab-journey-h">
            <span className="sspg-section-num" aria-hidden="true">06</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-rose"><GraduationCap size={18} /></div>
              <h2 id="ab-journey-h" className="sspg-section-title">The Journey &amp; Milestones</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack didn't appear overnight. It's the result of years of learning, building, failing, rebuilding, and refusing to stop. Here's a high-level timeline of how we got here:</p>

              <div className="sspg-timeline">
                {[
                  { year: "2019", title: "First Line of Code",          desc: "Started learning web development out of pure curiosity — HTML, CSS, and the basics of JavaScript. Built first static websites and portfolio pages." },
                  { year: "2020", title: "Going Full-Stack",             desc: "Dived deep into Node.js, Express, and MongoDB. Built first full-stack CRUD applications. Became obsessed with how the internet actually works." },
                  { year: "2021", title: "React & Modern Frontend",      desc: "Adopted React as the primary frontend framework. Built increasingly complex single-page applications. Started documenting learnings in a personal blog." },
                  { year: "2022", title: "ShivamStack Founded",          desc: "Launched shivamstack.com as a dedicated platform. Published the first batch of technical articles. Released the first open-source project to GitHub." },
                  { year: "2023", title: "Digital Products Launched",    desc: "Created and launched the first premium digital product — a comprehensive PDF guide on full-stack project architecture. Received overwhelmingly positive feedback." },
                  { year: "2024", title: "Platform Expansion",           desc: "Rebuilt the platform from scratch with a modern tech stack. Expanded content library. Grew the developer community. Launched new product categories." },
                  { year: "2025", title: "Continued Growth",             desc: "Focus on quality, community, and creating content and products that make a genuine difference for developers at every experience level." },
                ].map((t, i) => (
                  <div className="sspg-timeline-item" key={i}>
                    <div className="sspg-timeline-year">{t.year}</div>
                    <div className="sspg-timeline-title">{t.title}</div>
                    <div className="sspg-timeline-desc">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 07 Products ── */}
          <section id="ab-products" className="sspg-section sspg-reveal" aria-labelledby="ab-products-h">
            <span className="sspg-section-num" aria-hidden="true">07</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-indigo"><Package size={18} /></div>
              <h2 id="ab-products-h" className="sspg-section-title">Digital Products</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack's digital product range is designed to accelerate developer learning and productivity. Each product is created by a practicing developer — not a content mill — and reflects real-world patterns and hard-won knowledge.</p>

              <div className="sspg-usage-grid">
                {[
                  { icon: BookOpen, c: "indigo", t: "Developer Guides & E-Books",    d: "Comprehensive PDF guides covering everything from beginner full-stack concepts to advanced architecture patterns, API design, and system design fundamentals." },
                  { icon: Code2,    c: "purple",  t: "Code Templates & Starters",     d: "Production-ready code templates for common project types — REST APIs, React apps, authentication systems, and more. Skip the boilerplate, start building." },
                  { icon: Star,     c: "amber",   t: "Reference Sheets & Cheatsheets",d: "Dense, beautifully formatted quick-reference materials for frameworks, languages, and developer tools. Designed for active use at your desk, not passive reading." },
                  { icon: Rocket,   c: "green",   t: "Roadmaps & Career Resources",   d: "Structured learning roadmaps and career development guides for self-taught developers navigating the path from beginner to professional." },
                ].map((p, i) => (
                  <div className="sspg-usage-card" key={i}>
                    <div className={`sspg-usage-icon sspg-color-${p.c}`}><p.icon size={16} /></div>
                    <strong>{p.t}</strong>
                    <p>{p.d}</p>
                  </div>
                ))}
              </div>

              <p>All digital products come with a <strong>personal, non-commercial use licence</strong> and are delivered instantly to your account and registered email. Questions about a product before purchasing? Email <a href="mailto:support@shivamstack.com" className="sspg-inline-link">support@shivamstack.com</a>.</p>
            </div>
          </section>

          {/* ── 08 Connect ── */}
          <section id="ab-connect" className="sspg-section sspg-reveal" aria-labelledby="ab-connect-h">
            <span className="sspg-section-num" aria-hidden="true">08</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><Globe size={18} /></div>
              <h2 id="ab-connect-h" className="sspg-section-title">Let's Connect</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack is built for developers, by a developer. If you have feedback, ideas for content, questions about a product, or just want to say hello — the creator reads every message personally.</p>

              <div className="sspg-contact-info-cards">
                <a href="mailto:hello@shivamstack.com" className="sspg-contact-info-card">
                  <div className="sspg-contact-info-icon sspg-color-indigo"><Mail size={18} /></div>
                  <div>
                    <strong>Email</strong>
                    <span style={{ display: 'block', color: 'var(--sspg-text-accent)', fontSize: 13, margin: '2px 0' }}>hello@shivamstack.com</span>
                    <span>For general questions, collaborations, and feedback</span>
                  </div>
                </a>
                <a href="https://github.com/shivamstack" target="_blank" rel="noopener noreferrer" className="sspg-contact-info-card">
                  <div className="sspg-contact-info-icon sspg-color-purple"><Github size={18} /></div>
                  <div>
                    <strong>GitHub</strong>
                    <span style={{ display: 'block', color: 'var(--sspg-text-accent)', fontSize: 13, margin: '2px 0' }}>github.com/shivamstack</span>
                    <span>Open-source projects, contributions, and code</span>
                  </div>
                </a>
                <a href="https://twitter.com/shivamstack" target="_blank" rel="noopener noreferrer" className="sspg-contact-info-card">
                  <div className="sspg-contact-info-icon sspg-color-cyan"><Twitter size={18} /></div>
                  <div>
                    <strong>Twitter / X</strong>
                    <span style={{ display: 'block', color: 'var(--sspg-text-accent)', fontSize: 13, margin: '2px 0' }}>@shivamstack</span>
                    <span>Quick updates, dev commentary, and community conversations</span>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="sspg-cta-section sspg-reveal">
            <div className="sspg-cta-title">Ready to start learning?</div>
            <div className="sspg-cta-sub">Explore tutorials, open-source projects, and premium resources crafted for developers who want to grow faster and build better.</div>
            <div className="sspg-cta-btns">
              <Link to="/blog" className="sspg-cta-btn-primary">
                <BookOpen size={16} />
                Browse Articles
              </Link>
              <Link to="/contact" className="sspg-cta-btn-secondary">
                <Mail size={16} />
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Related */}
          <div className="sspg-related">
            <Link to="/contact" className="sspg-related-card">
              <Mail size={22} />
              <div><strong>Contact Us</strong><span>Send a message</span></div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/privacy" className="sspg-related-card">
              <Shield size={22} />
              <div><strong>Privacy Policy</strong><span>How we protect your data</span></div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/terms" className="sspg-related-card">
              <FileText size={22} />
              <div><strong>Terms of Service</strong><span>Rules and guidelines</span></div>
              <ChevronRight size={16} />
            </Link>
          </div>

        </article>
      </div>

      <button
        className={`sspg-scroll-top ${showTop ? "sspg-scroll-top--visible" : ""}`}
        onClick={scrollTop}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </main>
  );
};

export default AboutUs;