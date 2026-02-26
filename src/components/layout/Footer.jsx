import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2, Layers, ShoppingCart, LayoutDashboard, Zap, Wrench,
  Mail, MapPin, Phone, Github, Twitter, Linkedin, Youtube,
  Instagram, ExternalLink, ArrowRight, ArrowUp, Shield,
  FileText, RefreshCw, Cookie, AlertCircle, CheckCircle,
  BookOpen, Package, FolderOpen, Star, Database, Terminal,
  Server, Briefcase, BarChart3, Heart, Cpu, Globe, Sparkles,
  MessageSquare, Rocket, Users, Coffee, Send, Lock,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const QUICK_LINKS = [
  { to: "/",        label: "Home" },
  { to: "/services",label: "Services" },
  { to: "/work",    label: "Work & Portfolio" },
  { to: "/products",label: "Digital Products",   badge: "hot" },
  { to: "/blog",    label: "Blog & Articles",     badge: "new" },
  { to: "/about",   label: "About Shivam" },
  { to: "/contact", label: "Contact & Hire" },
];

const SERVICE_LINKS = [
  { to: "/services/full-stack",  label: "Full Stack Development", icon: Layers },
  { to: "/services/ecommerce",   label: "E-Commerce Solutions",   icon: ShoppingCart },
  { to: "/services/admin-panel", label: "Admin Panel & CMS",      icon: LayoutDashboard },
  { to: "/services/api-development", label: "API Development",    icon: Zap },
  { to: "/services/performance", label: "Performance Optimization",icon: BarChart3 },
  { to: "/services/portfolio",   label: "Portfolio Websites",     icon: Briefcase },
  { to: "/services/devops",      label: "DevOps & Deployment",    icon: Server },
  { to: "/services/maintenance", label: "Maintenance & Support",  icon: Wrench },
];

const LEGAL_LINKS = [
  { to: "/privacy",   label: "Privacy Policy",    icon: Shield },
  { to: "/terms-of-service",     label: "Terms & Conditions", icon: FileText },
  { to: "/refund",    label: "Refund Policy",      icon: RefreshCw },
  { to: "/cookies",   label: "Cookie Policy",      icon: Cookie },
  { to: "/disclaimer",label: "Disclaimer",         icon: AlertCircle },
  { to: "/sitemap",   label: "Sitemap",            icon: Globe },
];

const NEWSLETTER_PERKS = [
  "New articles & tutorials every week",
  "Early access to digital products",
  "Project showcases & case studies",
  "Free developer resources & tools",
  "No spam — unsubscribe any time",
];

const TECH_STACK = [
  { label: "MongoDB",     color: "#10b981" },
  { label: "Express.js",  color: "#9ca3af" },
  { label: "React",       color: "#06b6d4" },
  { label: "Node.js",     color: "#6fd63b" },
  { label: "TypeScript",  color: "#3b82f6" },
  { label: "Next.js",     color: "#e2e8f0" },
  { label: "Tailwind",    color: "#38bdf8" },
  { label: "PostgreSQL",  color: "#5b9bd5" },
  { label: "Redis",       color: "#f43f5e" },
  { label: "Docker",      color: "#06b6d4" },
  { label: "GitHub Actions", color: "#9ca3af" },
  { label: "Nginx",       color: "#10b981" },
  { label: "Razorpay",    color: "#3b82f6" },
  { label: "Stripe",      color: "#8b5cf6" },
  { label: "Cloudinary",  color: "#3b5ce6" },
  { label: "AWS S3",      color: "#f59e0b" },
];

const FOOTER_STATS = [
  { value: "50+",   label: "Projects Delivered" },
  { value: "8",     label: "Service Areas" },
  { value: "100%",  label: "Code Ownership" },
  { value: "3+ yrs",label: "MERN Experience" },
  { value: "15+",   label: "Digital Products" },
  { value: "24h",   label: "Support Response" },
];

const SOCIALS = [
  { icon: Github,    href: "https://github.com/shivamstack",     label: "GitHub",    cls: "github" },
  { icon: Twitter,   href: "https://twitter.com/shivamstack",    label: "Twitter",   cls: "twitter" },
  { icon: Linkedin,  href: "https://linkedin.com/in/shivamstack",label: "LinkedIn",  cls: "linkedin" },
  { icon: Youtube,   href: "https://youtube.com/@shivamstack",   label: "YouTube",   cls: "youtube" },
  { icon: Instagram, href: "https://instagram.com/shivamstack",  label: "Instagram", cls: "instagram" },
];

const YEAR = new Date().getFullYear();

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [firstName,     setFirstName]     = useState("");
  const [email,         setEmail]         = useState("");
  const [subState,      setSubState]      = useState("idle"); // idle | loading | success | error

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubState("loading");
    // Replace with your real newsletter API call
    await new Promise((r) => setTimeout(r, 1400));
    setSubState("success");
    setEmail("");
    setFirstName("");
  };

  return (
    <footer className={`shivam-stackxy-footer-root ${isDarkMode ? "dark" : "light"}`}>

      {/* ── Ambient ── */}
      <div className="shivam-stackxy-footer-ambient" aria-hidden="true">
        <div className="shivam-stackxy-footer-orb shivam-stackxy-footer-orb-1" />
        <div className="shivam-stackxy-footer-orb shivam-stackxy-footer-orb-2" />
        <div className="shivam-stackxy-footer-grid" />
        <div className="shivam-stackxy-footer-noise" />
      </div>

      {/* ══════════ CTA BAND ══════════ */}
      <div className="shivam-stackxy-footer-cta-band">
        <div className="shivam-stackxy-footer-cta-band-noise" aria-hidden="true" />
        <div className="shivam-stackxy-footer-cta-eyebrow">
          <Sparkles size={11} /> Available for new projects — Delhi, India
        </div>
        <h2 className="shivam-stackxy-footer-cta-title">
          Ready to build something<br />you're proud of?
        </h2>
        <p className="shivam-stackxy-footer-cta-sub">
          From MVP to full SaaS platform — I partner with founders, creators, and businesses
          who want clean code, real security, and a developer who actually gives a damn.
        </p>
        <div className="shivam-stackxy-footer-cta-btns">
          <Link to="/contact" className="shivam-stackxy-footer-cta-btn-primary">
            <MessageSquare size={16} /> Discuss Your Project
          </Link>
          <a href="mailto:hello@shivamstack.com" className="shivam-stackxy-footer-cta-btn-ghost">
            <Mail size={16} /> hello@shivamstack.com
          </a>
        </div>
        <div className="shivam-stackxy-footer-cta-trust">
          {[
            { icon: CheckCircle, text: "Free discovery call" },
            { icon: CheckCircle, text: "Fixed-price proposals" },
            { icon: CheckCircle, text: "You own all the code" },
            { icon: CheckCircle, text: "No surprise charges" },
          ].map((t, i) => (
            <div key={i} className="shivam-stackxy-footer-cta-trust-item">
              <t.icon size={13} color="rgba(255,255,255,0.6)" /> {t.text}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ STATS STRIP ══════════ */}
      <div className="shivam-stackxy-footer-stats-strip">
        <div className="shivam-stackxy-footer-stats-inner">
          {FOOTER_STATS.map((st, i) => (
            <div className="shivam-stackxy-footer-stat-item" key={i}>
              <span className="shivam-stackxy-footer-stat-value">{st.value}</span>
              <span className="shivam-stackxy-footer-stat-label">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MAIN COLUMNS ══════════ */}
      <div className="shivam-stackxy-footer-body">
        <div className="shivam-stackxy-footer-columns">

          {/* ─── COL 1: BRAND ─── */}
          <div>
            <Link to="/" className="shivam-stackxy-footer-brand-logo" aria-label="ShivamStack home">
              <div className="shivam-stackxy-footer-brand-logo-icon" aria-hidden="true">SS</div>
              <span className="shivam-stackxy-footer-brand-logo-text">
                Shivam<span className="shivam-stackxy-footer-brand-logo-text-accent">Stack</span>
              </span>
            </Link>

            <p className="shivam-stackxy-footer-brand-tagline">
              Full-stack MERN developer and educator from Delhi, India. I build fast, secure,
              scalable web applications and create educational resources that help developers grow.
              Every project is built with care, clean code, and a long-term mindset.
            </p>

            <div className="shivam-stackxy-footer-brand-status">
              <span className="shivam-stackxy-footer-brand-status-dot" />
              Available for new projects
            </div>

            <div className="shivam-stackxy-footer-brand-meta">
              <div className="shivam-stackxy-footer-brand-meta-item">
                <span className="shivam-stackxy-footer-brand-meta-icon"><MapPin size={14} /></span>
                New Delhi, India (Remote Worldwide)
              </div>
              <a href="mailto:hello@shivamstack.com" className="shivam-stackxy-footer-brand-meta-item">
                <span className="shivam-stackxy-footer-brand-meta-icon"><Mail size={14} /></span>
                hello@shivamstack.com
              </a>
              <a href="mailto:support@shivamstack.com" className="shivam-stackxy-footer-brand-meta-item">
                <span className="shivam-stackxy-footer-brand-meta-icon"><MessageSquare size={14} /></span>
                support@shivamstack.com
              </a>
              <a href="https://shivamstack.com" className="shivam-stackxy-footer-brand-meta-item" target="_blank" rel="noopener noreferrer">
                <span className="shivam-stackxy-footer-brand-meta-icon"><Globe size={14} /></span>
                shivamstack.com
              </a>
            </div>

            <div className="shivam-stackxy-footer-socials">
              {SOCIALS.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`shivam-stackxy-footer-social-btn shivam-stackxy-footer-social-btn--${s.cls}`}
                  aria-label={`Follow on ${s.label}`}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ─── COL 2: QUICK LINKS ─── */}
          <div>
            <div className="shivam-stackxy-footer-col-title">
              <span className="shivam-stackxy-footer-col-title-dot" />
              Quick Links
            </div>
            <ul className="shivam-stackxy-footer-link-list">
              {QUICK_LINKS.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="shivam-stackxy-footer-link">
                    <ArrowRight size={11} style={{ flexShrink: 0, opacity: 0.5 }} />
                    {l.label}
                    {l.badge && (
                      <span className={`shivam-stackxy-footer-link-badge shivam-stackxy-footer-link-badge--${l.badge}`}>
                        {l.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/hire" className="shivam-stackxy-footer-link" style={{ color: '#818cf8', fontWeight: 600 }}>
                  <Rocket size={11} style={{ flexShrink: 0 }} />
                  Hire Me ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* ─── COL 3: SERVICES ─── */}
          <div>
            <div className="shivam-stackxy-footer-col-title">
              <span className="shivam-stackxy-footer-col-title-dot" />
              Services
            </div>
            <ul className="shivam-stackxy-footer-link-list">
              {SERVICE_LINKS.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="shivam-stackxy-footer-link">
                    <l.icon size={11} style={{ flexShrink: 0, opacity: 0.6 }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── COL 4: LEGAL ─── */}
          <div>
            <div className="shivam-stackxy-footer-col-title">
              <span className="shivam-stackxy-footer-col-title-dot" />
              Legal & Policies
            </div>
            <ul className="shivam-stackxy-footer-link-list">
              {LEGAL_LINKS.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="shivam-stackxy-footer-link">
                    <l.icon size={11} style={{ flexShrink: 0, opacity: 0.6 }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 28 }}>
              <div className="shivam-stackxy-footer-col-title">
                <span className="shivam-stackxy-footer-col-title-dot" />
                Resources
              </div>
              <ul className="shivam-stackxy-footer-link-list">
                {[
                  { to: "/blog",         label: "Dev Blog",            icon: BookOpen },
                  { to: "/work",         label: "Portfolio",           icon: FolderOpen },
                  { to: "/work/open-source", label: "Open Source",     icon: Github },
                  { to: "/products/resources", label: "Free Resources",icon: Database },
                  { to: "/sitemap.xml",  label: "XML Sitemap",         icon: Globe },
                ].map((l, i) => (
                  <li key={i}>
                    <Link to={l.to} className="shivam-stackxy-footer-link">
                      <l.icon size={11} style={{ flexShrink: 0, opacity: 0.6 }} />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── COL 5: NEWSLETTER ─── */}
          <div>
            <div className="shivam-stackxy-footer-col-title">
              <span className="shivam-stackxy-footer-col-title-dot" />
              Newsletter
            </div>
            <p className="shivam-stackxy-footer-newsletter-desc">
              Join developers and creators who get weekly insights on full-stack development,
              project showcases, and early access to new digital products — straight to your inbox.
              No spam, ever.
            </p>

            {subState === "success" ? (
              <div className="shivam-stackxy-footer-newsletter-success" role="alert">
                <CheckCircle size={20} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <strong>You're in!</strong><br />
                  Check your inbox to confirm your subscription. Welcome to the community!
                </div>
              </div>
            ) : (
              <form
                className="shivam-stackxy-footer-newsletter-form"
                onSubmit={handleSubscribe}
                noValidate
              >
                <input
                  type="text"
                  className="shivam-stackxy-footer-newsletter-name-input"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                <input
                  type="email"
                  className="shivam-stackxy-footer-newsletter-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="shivam-stackxy-footer-newsletter-btn"
                  disabled={subState === "loading"}
                >
                  {subState === "loading" ? (
                    <>
                      <span className="shivam-stackxy-footer-spinner" />
                      Subscribing…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Subscribe for Free
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="shivam-stackxy-footer-newsletter-note">
              <Lock size={11} style={{ flexShrink: 0, marginTop: 1, color: '#5e5b8a' }} />
              Your email is safe. Read our{" "}
              <Link to="/privacy" style={{ color: 'var(--ssf-text-accent)', marginLeft: 3 }}>
                Privacy Policy
              </Link>
              .
            </div>

            <ul className="shivam-stackxy-footer-newsletter-perks">
              {NEWSLETTER_PERKS.map((p, i) => (
                <li key={i} className="shivam-stackxy-footer-newsletter-perk">
                  <span className="shivam-stackxy-footer-newsletter-perk-check">
                    <CheckCircle size={10} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ══════════ TECH STRIP ══════════ */}
      <div className="shivam-stackxy-footer-tech-strip">
        <div className="shivam-stackxy-footer-tech-label">Technologies I Work With</div>
        <div className="shivam-stackxy-footer-tech-badges">
          {TECH_STACK.map((t, i) => (
            <span className="shivam-stackxy-footer-tech-badge" key={i}>
              <span className="shivam-stackxy-footer-tech-badge-dot" style={{ background: t.color }} />
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ BOTTOM BAR ══════════ */}
      <div className="shivam-stackxy-footer-bottom">
        <div className="shivam-stackxy-footer-bottom-inner">
          <div className="shivam-stackxy-footer-bottom-left">
            <div className="shivam-stackxy-footer-copyright">
              © {YEAR} <strong>ShivamStack</strong>. All rights reserved.
              Operated by Shivam Kumar, New Delhi, India.
            </div>
            <div className="shivam-stackxy-footer-built-with">
              Built with{" "}
              <Heart size={12} className="shivam-stackxy-footer-built-heart" />
              {" "}using{" "}
              <Cpu size={11} style={{ opacity: 0.6 }} />{" "}
              MERN Stack · Deployed on Vercel + Railway
            </div>
          </div>

          <div className="shivam-stackxy-footer-bottom-links">
            <Link to="/privacy"   className="shivam-stackxy-footer-bottom-link">Privacy</Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/terms"     className="shivam-stackxy-footer-bottom-link">Terms</Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/cookies"   className="shivam-stackxy-footer-bottom-link">Cookies</Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/refund"    className="shivam-stackxy-footer-bottom-link">Refunds</Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/sitemap"   className="shivam-stackxy-footer-bottom-link">Sitemap</Link>
          </div>

          <div className="shivam-stackxy-footer-bottom-right">
            <button
              className="shivam-stackxy-footer-back-top"
              onClick={scrollTop}
              aria-label="Back to top"
            >
              <ArrowUp size={13} />
              Back to top
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;