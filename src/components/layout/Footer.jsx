import React, { useContext, useState ,useEffect} from "react";
import { Link, useLocation  } from "react-router-dom";
import {
  Code2,
  Layers,
  ShoppingCart,
  LayoutDashboard,
  Zap,
  Wrench,
  Mail,
  MapPin,
  Phone,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  ExternalLink,
  ArrowRight,
  ArrowUp,
  Shield,
  FileText,
  RefreshCw,
  Cookie,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Package,
  FolderOpen,
  Star,
  Database,
  Terminal,
  Server,
  Briefcase,
  BarChart3,
  Heart,
  Cpu,
  Globe,
  Sparkles,
  MessageSquare,
  Rocket,
  Users,
  Coffee,
  Send,
  Lock,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

const SOCIAL_LINKS = {
  github: import.meta.env.VITE_Github || "https://github.com/shivamstack",
  twitter: import.meta.env.VITE_Twitter || "https://twitter.com/shivamstack",
  linkedin:
    import.meta.env.VITE_LinkedIn || "https://linkedin.com/in/shivamstack",
  youtube: import.meta.env.VITE_Youtube || "https://youtube.com/@shivamstack",
  instagram: import.meta.env.VITE_Insta || "https://instagram.com/shivamstack",
};

const CONTACT_EMAIL = import.meta.env.VITE_Email || "hello@shivamstack.com";
const SUPPORT_EMAIL = import.meta.env.VITE_Email || "support@shivamstack.com";

const API_URL = "/api/public";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work & Portfolio" },
  { to: "/products", label: "Digital Products", badge: "hot" },
  { to: "/blogs", label: "Blog & Articles", badge: "new" },
  { to: "/about", label: "About Shivam" },
  { to: "/contact", label: "Contact & Hire" },
];

const SERVICE_LINKS = [
  { to: "/services/full-stack-development", label: "Full Stack Development", icon: Layers },
  {
    to: "/services/ecommerce-solutions",
    label: "E-Commerce Solutions",
    icon: ShoppingCart,
  },
  {
    to: "/services/admin-panel-cms-development",
    label: "Admin Panel & CMS",
    icon: LayoutDashboard,
  },
  { to: "/services/api-development", label: "API Development", icon: Zap },
  {
    to: "/services/performance-optimization",
    label: "Performance Optimization",
    icon: BarChart3,
  },
  { to: "/services/portfolio-website-development", label: "Portfolio Websites", icon: Briefcase },
  { to: "/services/devops-deployment", label: "DevOps & Deployment", icon: Server },
  { to: "/services/maintenance-support", label: "Maintenance & Support", icon: Wrench },
];

const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy", icon: Shield },
  { to: "/terms-of-service", label: "Terms & Conditions", icon: FileText },
  { to: "/refund", label: "Refund Policy", icon: RefreshCw },
  { to: "/cookies", label: "Cookie Policy", icon: Cookie },
  { to: "/disclaimer", label: "Disclaimer", icon: AlertCircle },
  { to: "/sitemap", label: "Sitemap", icon: Globe },
];

const NEWSLETTER_PERKS = [
  "New articles & tutorials every week",
  "Early access to digital products",
  "Project showcases & case studies",
  "Free developer resources & tools",
  "No spam — unsubscribe any time",
];

const TECH_STACK = [
  { label: "MongoDB", color: "#10b981" },
  { label: "Express.js", color: "#9ca3af" },
  { label: "React", color: "#06b6d4" },
  { label: "Node.js", color: "#6fd63b" },
  { label: "TypeScript", color: "#3b82f6" },
  { label: "Next.js", color: "#e2e8f0" },
  { label: "Tailwind", color: "#38bdf8" },
  { label: "PostgreSQL", color: "#5b9bd5" },
  { label: "Redis", color: "#f43f5e" },
  { label: "Docker", color: "#06b6d4" },
  { label: "GitHub Actions", color: "#9ca3af" },
  { label: "Nginx", color: "#10b981" },
  { label: "Razorpay", color: "#3b82f6" },
  { label: "Stripe", color: "#8b5cf6" },
  { label: "Cloudinary", color: "#3b5ce6" },
  { label: "AWS S3", color: "#f59e0b" },
];

const FOOTER_STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "8", label: "Service Areas" },
  { value: "100%", label: "Code Ownership" },
  { value: "3+ yrs", label: "MERN Experience" },
  { value: "15+", label: "Digital Products" },
  { value: "24h", label: "Support Response" },
];

const SOCIALS = [
  { icon: Github, href: SOCIAL_LINKS.github, label: "GitHub", cls: "github" },
  {
    icon: Twitter,
    href: SOCIAL_LINKS.twitter,
    label: "Twitter",
    cls: "twitter",
  },
  {
    icon: Linkedin,
    href: SOCIAL_LINKS.linkedin,
    label: "LinkedIn",
    cls: "linkedin",
  },
  {
    icon: Youtube,
    href: SOCIAL_LINKS.youtube,
    label: "YouTube",
    cls: "youtube",
  },
  {
    icon: Instagram,
    href: SOCIAL_LINKS.instagram,
    label: "Instagram",
    cls: "instagram",
  },
].filter((social) => social.href); // Only show if URL exists

const YEAR = new Date().getFullYear();

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);
    const location = useLocation();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState("idle"); // idle | loading | success | error

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Scroll to top on route change
useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth' // Smooth scrolling for better UX
  });
}, [location.pathname]); // Trigger whenever the pathname changes

const handleSubscribe = async (e) => {
  e.preventDefault();
  
  if (!email || !email.includes("@")) {
    if (window.Swal) {
      window.Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#6366f1",
      });
    }
    return;
  }

  setSubState("loading");

  try {

    console.log("Sending subscription request to:", `${API_URL}/newsletter/subscribe`);
console.log("Data:", { email, name: firstName });
    const response = await axios.post(`${API_URL}/newsletter/subscribe`, {
      email: email,
      name: firstName,
    });

    if (response.data.success) {
      setSubState("success");
      setEmail("");
      setFirstName("");

      if (window.Swal) {
        window.Swal.fire({
          icon: "success",
          title: "Subscribed! 🎉",
          text: response.data.message,
          confirmButtonColor: "#6366f1",
          background: isDarkMode ? "#0f1320" : "#ffffff",
          color: isDarkMode ? "#e2e8f0" : "#1e1b4b",
        });
      }
      
      // Reset to idle after 5 seconds to allow new subscription
      setTimeout(() => {
        setSubState("idle");
      }, 5000);
    }
  } catch (error) {
    console.error("Subscription error:", error);
    const errorMsg = error.response?.data?.message || "Failed to subscribe. Please try again.";
    
    if (window.Swal) {
      window.Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: errorMsg,
        confirmButtonColor: "#6366f1",
        background: isDarkMode ? "#0f1320" : "#ffffff",
        color: isDarkMode ? "#e2e8f0" : "#1e1b4b",
      });
    }
    
    // Reset to idle immediately on error
    setSubState("idle");
  }
};

  return (
    <footer
      className={`shivam-stackxy-footer-root ${isDarkMode ? "dark" : "light"}`}
    >
      {/* ── Ambient ── */}
      <div className="shivam-stackxy-footer-ambient" aria-hidden="true">
        <div className="shivam-stackxy-footer-orb shivam-stackxy-footer-orb-1" />
        <div className="shivam-stackxy-footer-orb shivam-stackxy-footer-orb-2" />
        <div className="shivam-stackxy-footer-grid" />
        <div className="shivam-stackxy-footer-noise" />
      </div>

      {/* ══════════ CTA BAND ══════════ */}
      <div className="shivam-stackxy-footer-cta-band">
        <div
          className="shivam-stackxy-footer-cta-band-noise"
          aria-hidden="true"
        />
        <div className="shivam-stackxy-footer-cta-eyebrow">
          <Sparkles size={11} /> Available for new projects — Delhi, India
        </div>
        <h2 className="shivam-stackxy-footer-cta-title">
          Ready to build something
          <br />
          you're proud of?
        </h2>
        <p className="shivam-stackxy-footer-cta-sub">
          From MVP to full SaaS platform — I partner with founders, creators,
          and businesses who want clean code, real security, and a developer who
          actually gives a damn.
        </p>
        <div className="shivam-stackxy-footer-cta-btns">
          <Link to="/contact" className="shivam-stackxy-footer-cta-btn-primary">
            <MessageSquare size={16} /> Discuss Your Project
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="shivam-stackxy-footer-cta-btn-ghost"
          >
            <Mail size={16} /> {CONTACT_EMAIL}
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
              <span className="shivam-stackxy-footer-stat-value">
                {st.value}
              </span>
              <span className="shivam-stackxy-footer-stat-label">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MAIN COLUMNS ══════════ */}
      <div className="shivam-stackxy-footer-body">
        <div className="shivam-stackxy-footer-columns">
          {/* ─── COL 1: BRAND ─── */}
          <div>
            <Link
              to="/"
              className="shivam-stackxy-footer-brand-logo"
              aria-label="ShivamStack home"
            >
              <div
                className="shivam-stackxy-footer-brand-logo-icon"
                aria-hidden="true"
              >
                SS
              </div>
              <span className="shivam-stackxy-footer-brand-logo-text">
                Shivam
                <span className="shivam-stackxy-footer-brand-logo-text-accent">
                  Stack
                </span>
              </span>
            </Link>

            <p className="shivam-stackxy-footer-brand-tagline">
              Full-stack MERN developer and educator from Delhi, India. I build
              fast, secure, scalable web applications and create educational
              resources that help developers grow. Every project is built with
              care, clean code, and a long-term mindset.
            </p>

            <div className="shivam-stackxy-footer-brand-status">
              <span className="shivam-stackxy-footer-brand-status-dot" />
              Available for new projects
            </div>

            <div className="shivam-stackxy-footer-brand-meta">
              <div className="shivam-stackxy-footer-brand-meta-item">
                <span className="shivam-stackxy-footer-brand-meta-icon">
                  <MapPin size={14} />
                </span>
                New Delhi, India (Remote Worldwide)
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="shivam-stackxy-footer-brand-meta-item"
              >
                <span className="shivam-stackxy-footer-brand-meta-icon">
                  <Mail size={14} />
                </span>
                {CONTACT_EMAIL}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="shivam-stackxy-footer-brand-meta-item"
              >
                <span className="shivam-stackxy-footer-brand-meta-icon">
                  <MessageSquare size={14} />
                </span>
                support@shivamstack.com
              </a>
              <a
                href="https://shivamstack.com"
                className="shivam-stackxy-footer-brand-meta-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="shivam-stackxy-footer-brand-meta-icon">
                  <Globe size={14} />
                </span>
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
                    <ArrowRight
                      size={11}
                      style={{ flexShrink: 0, opacity: 0.5 }}
                    />
                    {l.label}
                    {l.badge && (
                      <span
                        className={`shivam-stackxy-footer-link-badge shivam-stackxy-footer-link-badge--${l.badge}`}
                      >
                        {l.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  className="shivam-stackxy-footer-link"
                  style={{ color: "#818cf8", fontWeight: 600 }}
                >
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
                  { to: "/blogs", label: "Dev Blog", icon: BookOpen },
                  { to: "/portfolio", label: "Portfolio", icon: FolderOpen },
                  // {
                  //   to: "/work/open-source",
                  //   label: "Open Source",
                  //   icon: Github,
                  // },
                  {
                    to: "/products/resources",
                    label: "Free Resources",
                    icon: Database,
                  },
                  { to: "/sitemap.xml", label: "XML Sitemap", icon: Globe },
                ].map((l, i) => (
                  <li key={i}>
                    <Link to={l.to} className="shivam-stackxy-footer-link">
                      <l.icon
                        size={11}
                        style={{ flexShrink: 0, opacity: 0.6 }}
                      />
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
              Join developers and creators who get weekly insights on full-stack
              development, project showcases, and early access to new digital
              products — straight to your inbox. No spam, ever.
            </p>

            {subState === "success" ? (
              <div
                className="shivam-stackxy-footer-newsletter-success"
                role="alert"
              >
                <CheckCircle
                  size={20}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <div>
                  <strong>You're in!</strong>
                  <br />
                  Check your inbox to confirm your subscription. Welcome to the
                  community!
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
              <Lock
                size={11}
                style={{ flexShrink: 0, marginTop: 1, color: "#5e5b8a" }}
              />
              Your email is safe. Read our{" "}
              <Link
                to="/privacy-policy"
                style={{ color: "var(--ssf-text-accent)", marginLeft: 3 }}
              >
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
        <div className="shivam-stackxy-footer-tech-label">
          Technologies I Work With
        </div>
        <div className="shivam-stackxy-footer-tech-badges">
          {TECH_STACK.map((t, i) => (
            <span className="shivam-stackxy-footer-tech-badge" key={i}>
              <span
                className="shivam-stackxy-footer-tech-badge-dot"
                style={{ background: t.color }}
              />
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
              <Heart size={12} className="shivam-stackxy-footer-built-heart" />{" "}
              using <Cpu size={11} style={{ opacity: 0.6 }} /> MERN Stack ·
              Deployed on Vercel + Railway
            </div>
          </div>

          <div className="shivam-stackxy-footer-bottom-links">
            <Link to="/privacy-policy" className="shivam-stackxy-footer-bottom-link">
              Privacy
            </Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/terms" className="shivam-stackxy-footer-bottom-link">
              Terms
            </Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/cookies" className="shivam-stackxy-footer-bottom-link">
              Cookies
            </Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/refund" className="shivam-stackxy-footer-bottom-link">
              Refunds
            </Link>
            <span className="shivam-stackxy-footer-bottom-sep">·</span>
            <Link to="/sitemap" className="shivam-stackxy-footer-bottom-link">
              Sitemap
            </Link>
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
