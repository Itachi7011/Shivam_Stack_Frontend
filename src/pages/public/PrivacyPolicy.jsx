import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Shield, Eye, Lock, Database, Cookie, Globe, Mail,
  ChevronRight, ArrowUp, FileText, UserCheck, AlertTriangle,
  RefreshCw, Server, Link2, Clock, CheckCircle, XCircle,
  Info, BookOpen, Sparkles, ExternalLink,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

/* ── SEO Meta ─────────────────────────────────────────────────────────────── */
const META = {
  title:       "Privacy Policy — ShivamStack",
  description: "ShivamStack privacy policy. Learn how we collect, use, protect, and manage your personal data. Your privacy is our priority.",
  updated:     "February 1, 2025",
  effective:   "February 1, 2025",
};

const SECTIONS = [
  { id: "pp-overview",   icon: BookOpen,    title: "Overview & Introduction" },
  { id: "pp-collect",    icon: Database,    title: "Information We Collect" },
  { id: "pp-usage",      icon: Eye,         title: "How We Use Your Data" },
  { id: "pp-sharing",    icon: Link2,       title: "Sharing & Disclosure" },
  { id: "pp-cookies",    icon: Cookie,      title: "Cookies & Tracking" },
  { id: "pp-security",   icon: Server,      title: "Storage & Security" },
  { id: "pp-rights",     icon: UserCheck,   title: "Your Rights & Choices" },
  { id: "pp-thirdparty", icon: Globe,       title: "Third-Party Services" },
  { id: "pp-purchases",  icon: Lock,        title: "Digital Products" },
  { id: "pp-children",   icon: Shield,      title: "Children's Privacy" },
  { id: "pp-changes",    icon: RefreshCw,   title: "Policy Changes" },
  { id: "pp-contact",    icon: Mail,        title: "Contact & Grievances" },
];

/* ── Hook: observe which section is in view ───────────────────────────────── */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []); // eslint-disable-line
  return [active];
}

const PrivacyPolicy = () => {
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
      itemType="https://schema.org/WebPage"
    >
      <meta itemProp="name" content={META.title} />
      <meta itemProp="description" content={META.description} />

      {/* Ambient background */}
      <div className="sspg-ambient" aria-hidden="true">
        <div className="sspg-orb sspg-orb-1" />
        <div className="sspg-orb sspg-orb-2" />
        <div className="sspg-orb sspg-orb-3" />
        <div className="sspg-grid" />
        <div className="sspg-noise" />
      </div>

      {/* ══════════ HERO ══════════ */}
      <header className="sspg-hero sspg-hero--privacy">
        <div className="sspg-hero-eyebrow">
          <Shield size={13} />
          <span>Legal · Privacy Policy</span>
        </div>
        <h1 className="sspg-hero-title" itemProp="headline">
          Privacy <span className="sspg-gradient-text">Policy</span>
        </h1>
        <p className="sspg-hero-sub">
          Your privacy is foundational to everything we build at ShivamStack.
          This document explains exactly what data we collect, why we collect it,
          how we protect it, and the rights you have over your information.
        </p>
        <div className="sspg-hero-chips">
          <span className="sspg-chip"><Clock size={11} /> Updated: {META.updated}</span>
          <span className="sspg-chip"><CheckCircle size={11} /> Effective: {META.effective}</span>
          <span className="sspg-chip"><Globe size={11} /> Applies globally</span>
        </div>
        {/* Decorative floating shield */}
        <div className="sspg-hero-deco sspg-deco-privacy" aria-hidden="true">
          <Shield size={120} />
        </div>
      </header>

      {/* ══════════ BODY LAYOUT ══════════ */}
      <div className="sspg-layout">

        {/* Sticky Table of Contents */}
        <aside className="sspg-sidebar">
          <p className="sspg-sidebar-label">On this page</p>
          <nav aria-label="Privacy policy sections">
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
            <Link to="/terms" className="sspg-sidebar-link"><FileText size={12} />Terms of Service</Link>
            <Link to="/contact" className="sspg-sidebar-link"><Mail size={12} />Contact Us</Link>
          </div>
        </aside>

        {/* ══════════ CONTENT ══════════ */}
        <article className="sspg-content" itemProp="mainContentOfPage">

          {/* ── 01 Overview ── */}
          <section id="pp-overview" className="sspg-section sspg-reveal" aria-labelledby="pp-overview-h">
            <span className="sspg-section-num" aria-hidden="true">01</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-indigo"><BookOpen size={18} /></div>
              <h2 id="pp-overview-h" className="sspg-section-title">Overview &amp; Introduction</h2>
            </header>

            <div className="sspg-prose">
              <p>Welcome to <strong>ShivamStack</strong> ("we," "us," "our") — a personal portfolio and digital products platform operated by Shivam Kumar, an independent developer and content creator based in India. This Privacy Policy governs the collection, processing, and protection of personal data when you access or use <strong>shivamstack.com</strong> and all associated subdomains, pages, APIs, and services (collectively, the "Platform").</p>
              <p>By accessing or using our Platform in any way, you acknowledge that you have read, understood, and agree to the practices described in this Privacy Policy. If you do not agree, your sole remedy is to discontinue use of the Platform. <strong>Continued use of the Platform after any revisions constitutes acceptance of those changes.</strong></p>
              <p>ShivamStack is a multi-purpose creative platform where Shivam Kumar shares programming tutorials, technical articles, open-source projects, portfolio work, and sells digital products including PDFs, e-books, templates, and educational guides. This policy applies equally to visitors, registered users, customers, and any other individuals who interact with the Platform.</p>

              <div className="sspg-callout sspg-callout--info">
                <Info size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Plain-English Summary</strong>
                  <p>We collect only what we genuinely need. We never sell your data. You retain full control and can request deletion at any time. This policy is written clearly so you actually understand it — not to obscure anything.</p>
                </div>
              </div>

              <h3 className="sspg-h3">Our Guiding Principles</h3>
              <p>These four principles shape every data decision we make:</p>
              <div className="sspg-principle-grid">
                {[
                  { icon: CheckCircle, c: "green",  t: "Minimal Collection",  d: "We only collect data that has a clear, documented, legitimate purpose. If we don't need it, we don't collect it." },
                  { icon: Lock,        c: "indigo", t: "Purpose Limitation",   d: "Data collected for one specific purpose is never repurposed for something unrelated without fresh consent." },
                  { icon: Eye,         c: "amber",  t: "Full Transparency",    d: "We document every category of data we collect, why we collect it, who sees it, and how long we keep it." },
                  { icon: UserCheck,   c: "cyan",   t: "User Control",         d: "You can access, correct, export, or delete your data at any time. We respond to all requests within 30 days." },
                ].map((p, i) => (
                  <div className="sspg-principle-card" key={i}>
                    <div className={`sspg-principle-icon sspg-color-${p.c}`}><p.icon size={18} /></div>
                    <strong>{p.t}</strong>
                    <p>{p.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 02 What We Collect ── */}
          <section id="pp-collect" className="sspg-section sspg-reveal" aria-labelledby="pp-collect-h">
            <span className="sspg-section-num" aria-hidden="true">02</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-purple"><Database size={18} /></div>
              <h2 id="pp-collect-h" className="sspg-section-title">Information We Collect</h2>
            </header>
            <div className="sspg-prose">
              <p>We collect information through several channels, each with a specific and justified purpose. The following is a comprehensive and transparent breakdown of every category of personal data ShivamStack may hold about you.</p>

              <h3 className="sspg-h3">A. Information You Provide Directly</h3>
              <p>You actively provide this data when you create an account, make a purchase, fill out a form, or contact us:</p>
              <div className="sspg-table-wrap">
                <table className="sspg-table">
                  <thead>
                    <tr><th>Data Type</th><th>When Collected</th><th>Purpose</th></tr>
                  </thead>
                  <tbody>
                    {[
                      ["Full name",          "Registration / checkout",          "Account identification and order addressing"],
                      ["Email address",       "Registration / newsletter / forms","Account access, communication, receipts"],
                      ["Password (bcrypt hashed)", "Registration only",          "Authentication — never stored in plain text"],
                      ["Phone number",        "Optional profile setting",         "Optional communication preference"],
                      ["Billing address",     "Digital purchases",                "Invoice generation and tax compliance"],
                      ["Profile photo / avatar", "Optional upload",              "Profile personalisation"],
                      ["Contact messages",    "Contact form",                     "Responding to your enquiry or support request"],
                    ].map(([type, when, purpose], i) => (
                      <tr key={i}>
                        <td><strong>{type}</strong></td>
                        <td>{when}</td>
                        <td>{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="sspg-h3">B. Information Collected Automatically</h3>
              <p>When you visit ShivamStack, our servers and analytics tools automatically log certain technical information to help us maintain and improve the Platform:</p>
              <ul className="sspg-ul">
                <li><strong>IP address</strong> — used for security, fraud prevention, and geographic analytics at country/region level only. Never used for personal identification.</li>
                <li><strong>Browser type and version</strong> — used to ensure visual compatibility and debug rendering issues across devices.</li>
                <li><strong>Device and operating system</strong> — used for responsive design decisions and compatibility reporting.</li>
                <li><strong>Referring URL</strong> — the page, search engine, or social platform that directed you here.</li>
                <li><strong>Pages visited and time spent</strong> — used in aggregate to understand which content is most valuable to our audience.</li>
                <li><strong>Scroll depth and click patterns</strong> — aggregated, anonymised metrics used to improve content layout and user experience.</li>
                <li><strong>Download events</strong> — logged for digital product licence enforcement and fraud prevention.</li>
              </ul>

              <h3 className="sspg-h3">C. Data from Third-Party Integrations</h3>
              <p>If you choose to sign in using Google or GitHub OAuth (optional), we receive a limited profile from those providers as per your permission grant. Typically this includes your name, email address, and profile photo. <strong>We never receive your passwords, payment methods, private repositories, or any data beyond what you explicitly authorise.</strong></p>

              <div className="sspg-callout sspg-callout--warning">
                <AlertTriangle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>What We Never Collect</strong>
                  <p>Sensitive data categories including racial or ethnic origin, political opinions, religious beliefs, health or medical information, biometric data, genetic data, or financial account credentials. We do not use facial recognition, identity verification, or any form of surveillance technology.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 03 How We Use ── */}
          <section id="pp-usage" className="sspg-section sspg-reveal" aria-labelledby="pp-usage-h">
            <span className="sspg-section-num" aria-hidden="true">03</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><Eye size={18} /></div>
              <h2 id="pp-usage-h" className="sspg-section-title">How We Use Your Information</h2>
            </header>
            <div className="sspg-prose">
              <p>Every use of your data has a clearly defined, proportionate, and legitimate purpose. We operate under the principle of <strong>data minimisation</strong> — processing only what is strictly necessary for each stated purpose.</p>

              <div className="sspg-usage-grid">
                {[
                  { icon: UserCheck, c: "green",  t: "Account Management",          d: "Creating and maintaining your user profile, authenticating your identity on each session, managing JWT tokens, enabling password resets via secure cryptographic tokens, and providing account recovery options." },
                  { icon: FileText,  c: "indigo",  t: "Order & Delivery Fulfilment",  d: "Processing payments via our payment partners, delivering purchased digital products to your registered email, generating and sending order receipts and VAT-compliant invoices, and managing refund or dispute requests in accordance with our Terms of Service." },
                  { icon: Mail,      c: "amber",   t: "Transactional Communications", d: "Sending necessary emails including purchase confirmations, order receipts, password reset links, email verification links, and security alerts. These are mandatory operational emails and cannot be opted out of while you hold an account." },
                  { icon: Globe,     c: "cyan",    t: "Platform Analytics",           d: "Analysing aggregated, anonymised usage metrics to understand popular content, identify broken pages, improve loading performance, and guide decisions about future features and content direction. No individual is ever identified in our analytics." },
                  { icon: Shield,    c: "rose",    t: "Security & Fraud Prevention",  d: "Detecting and preventing unauthorised access, account takeovers, fraudulent purchases, credential stuffing attacks, bot activity, and other malicious use. Security logs may be retained for up to 12 months for incident investigation." },
                  { icon: Lock,      c: "purple",  t: "Legal & Contractual Compliance","d": "Complying with applicable Indian and international laws and regulations, responding to valid legal orders from courts or authorities, enforcing our Terms of Service, and resolving disputes. We may be legally obligated to retain certain data regardless of deletion requests." },
                ].map((u, i) => (
                  <div className="sspg-usage-card" key={i}>
                    <div className={`sspg-usage-icon sspg-color-${u.c}`}><u.icon size={16} /></div>
                    <strong>{u.t}</strong>
                    <p>{u.d}</p>
                  </div>
                ))}
              </div>

              <div className="sspg-callout sspg-callout--success">
                <CheckCircle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Absolute Prohibition</strong>
                  <p>ShivamStack will never sell, rent, trade, or lease your personal data to third parties for their own marketing or commercial purposes. We do not build or sell advertising profiles. Your data is not a revenue source for this platform.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 04 Sharing ── */}
          <section id="pp-sharing" className="sspg-section sspg-reveal" aria-labelledby="pp-sharing-h">
            <span className="sspg-section-num" aria-hidden="true">04</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-amber"><Link2 size={18} /></div>
              <h2 id="pp-sharing-h" className="sspg-section-title">Data Sharing &amp; Disclosure</h2>
            </header>
            <div className="sspg-prose">
              <p>We share your information only in the limited, specific circumstances described below. In all cases, we share only the minimum data necessary for the particular purpose, and only with parties bound by appropriate confidentiality obligations.</p>

              <h3 className="sspg-h3">Permitted Disclosure Circumstances</h3>
              <ul className="sspg-ul">
                <li><strong>Service providers acting as data processors on our behalf:</strong> We engage carefully selected third-party companies to perform specific technical functions (payment processing, email delivery, analytics, cloud infrastructure). These providers are contractually required to use your data solely for the service they provide to us and may not use it for their own purposes.</li>
                <li><strong>Legal obligations and government requests:</strong> We may disclose your data if required by applicable law, court order, or valid governmental request from a competent authority. We will notify you of such disclosure where we are legally permitted to do so.</li>
                <li><strong>Protection of rights, safety, and property:</strong> We may share limited data to protect the rights, property, or safety of ShivamStack, our users, or the general public — including to prevent, investigate, or take legal action regarding fraud, security breaches, or illegal activity.</li>
                <li><strong>Business transfers with prior notice:</strong> In the event of a merger, acquisition, or sale of substantially all assets, user data may be part of the transferred assets. We will notify registered users at least 30 days in advance and provide the option to request deletion before the transfer occurs.</li>
                <li><strong>With your separate, explicit consent:</strong> Any sharing not described above will not occur without your prior, specific, informed, and freely given consent.</li>
              </ul>

              <h3 className="sspg-h3">Owner's Liability Limitation for Third-Party Actions</h3>
              <p>ShivamStack integrates with independent third-party services in its operational capacity. Once data is transmitted to these services as part of their contracted role (e.g., payment processing), ShivamStack has no ongoing control over, and <strong>expressly disclaims all responsibility and liability for</strong>, how those independent parties subsequently handle, store, or process data under their own separate privacy policies and terms. Users are strongly encouraged to review the privacy policies of all relevant third-party services before using the Platform.</p>

              <div className="sspg-callout sspg-callout--danger">
                <XCircle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>We Strictly Never Share With:</strong>
                  <p>Data brokers, marketing agencies, advertising networks, political organisations, employers, insurers, or any party for their independent commercial, marketing, or profiling purposes. Period.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 05 Cookies ── */}
          <section id="pp-cookies" className="sspg-section sspg-reveal" aria-labelledby="pp-cookies-h">
            <span className="sspg-section-num" aria-hidden="true">05</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-cyan"><Cookie size={18} /></div>
              <h2 id="pp-cookies-h" className="sspg-section-title">Cookies &amp; Tracking Technologies</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack uses cookies and similar technologies to make the Platform work, remember your preferences, and understand how it is used. A <strong>cookie</strong> is a small text file placed in your browser by a website. We also use localStorage for client-side preference storage (e.g., theme settings).</p>

              <div className="sspg-cookie-cards">
                {[
                  { t: "Essential Cookies",    req: true,  c: "indigo", d: "Strictly necessary for the Platform to function. Includes session authentication tokens (JWT), CSRF protection tokens, and security identifiers. Blocking these prevents access to authenticated features. These cannot be disabled without losing account access." },
                  { t: "Functional Cookies",   req: false, c: "green",  d: "Remember your stated preferences such as dark/light theme mode, language settings, and notification opt-outs. Disabling these means preferences reset every visit. No personal data is transmitted to external parties." },
                  { t: "Analytics Cookies",    req: false, c: "amber",  d: "Collect anonymised, aggregated data about navigation patterns, page performance, and referral sources. Powered by Google Analytics 4 or equivalent. Individual users are never identified. You may opt out via your browser's cookie controls or Google's Analytics Opt-out browser add-on." },
                  { t: "Performance Cookies",  req: false, c: "purple", d: "Measure page load times, Core Web Vitals scores, rendering errors, and API response times. Used solely to improve the technical performance of the Platform for all users." },
                ].map((c, i) => (
                  <div className="sspg-cookie-card" key={i}>
                    <div className="sspg-cookie-head">
                      <span className={`sspg-cookie-label sspg-color-${c.c}`}>{c.t}</span>
                      <span className={`sspg-badge ${c.req ? "sspg-badge-required" : "sspg-badge-optional"}`}>
                        {c.req ? "Required" : "Optional"}
                      </span>
                    </div>
                    <p>{c.d}</p>
                  </div>
                ))}
              </div>

              <p>You may manage or block cookies through your browser settings. Note that disabling essential cookies will prevent account login and checkout functionality. We do not use cookies for advertising targeting, behavioural profiling, or cross-site tracking.</p>
            </div>
          </section>

          {/* ── 06 Security ── */}
          <section id="pp-security" className="sspg-section sspg-reveal" aria-labelledby="pp-security-h">
            <span className="sspg-section-num" aria-hidden="true">06</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-purple"><Server size={18} /></div>
              <h2 id="pp-security-h" className="sspg-section-title">Data Storage, Retention &amp; Security</h2>
            </header>
            <div className="sspg-prose">
              <p>We implement multiple layers of technical, organisational, and procedural security measures to protect your personal information from unauthorised access, accidental loss, disclosure, or destruction.</p>

              <h3 className="sspg-h3">Technical Security Measures</h3>
              <ul className="sspg-ul">
                <li><strong>TLS 1.3 encryption in transit:</strong> All data exchanged between your browser and our servers is encrypted. The Platform enforces HTTPS exclusively and rejects unencrypted connections.</li>
                <li><strong>bcrypt password hashing:</strong> Passwords are hashed with bcrypt using a work factor of 12 salt rounds. Plain-text passwords are never stored, logged, or transmitted.</li>
                <li><strong>JWT session management:</strong> Sessions use cryptographically signed, short-lived JSON Web Tokens. Tokens are invalidated upon logout, password change, or detection of suspicious activity.</li>
                <li><strong>Account lockout policy:</strong> After 5 consecutive failed login attempts, accounts are automatically locked for 2 hours to prevent brute-force attacks.</li>
                <li><strong>Principle of least privilege:</strong> Internal access to production data is restricted strictly to necessary systems and personnel, with MFA required for all administrative access.</li>
                <li><strong>Dependency monitoring:</strong> We monitor npm packages for known vulnerabilities and apply security patches promptly.</li>
              </ul>

              <h3 className="sspg-h3">Data Retention Schedule</h3>
              <div className="sspg-table-wrap">
                <table className="sspg-table">
                  <thead>
                    <tr><th>Data Category</th><th>Retention Period</th><th>Legal Basis</th></tr>
                  </thead>
                  <tbody>
                    {[
                      ["Account profile data",  "Until account deletion + 30-day grace period",  "Contractual necessity"],
                      ["Purchase & order records", "7 years from transaction date",              "Legal / tax obligation (GST Act)"],
                      ["Security & access logs", "12 months",                                    "Legitimate interest (fraud prevention)"],
                      ["Analytics data",         "26 months (fully anonymised)",                 "Legitimate interest (platform improvement)"],
                      ["Contact form messages",  "2 years from last interaction",                "Legitimate interest (dispute resolution)"],
                      ["Deleted account data",   "Purged within 30 days of confirmed deletion",  "User request / GDPR Art. 17"],
                    ].map(([cat, ret, basis], i) => (
                      <tr key={i}><td><strong>{cat}</strong></td><td>{ret}</td><td>{basis}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sspg-callout sspg-callout--warning">
                <AlertTriangle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Important Security Disclaimer</strong>
                  <p>Despite our best efforts and industry-standard security practices, no method of data transmission over the internet or electronic storage system is completely secure or error-free. <strong>ShivamStack cannot guarantee absolute security and, to the maximum extent permitted by applicable law, shall not be held liable for unauthorised access, breaches, or data loss that occur despite reasonable security measures.</strong> In the event of a breach affecting your rights and freedoms, we will notify affected users within 72 hours of becoming aware, as required by applicable regulations.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 07 Your Rights ── */}
          <section id="pp-rights" className="sspg-section sspg-reveal" aria-labelledby="pp-rights-h">
            <span className="sspg-section-num" aria-hidden="true">07</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><UserCheck size={18} /></div>
              <h2 id="pp-rights-h" className="sspg-section-title">Your Rights &amp; Choices</h2>
            </header>
            <div className="sspg-prose">
              <p>Regardless of your geographic location, you have meaningful and enforceable rights over your personal data held by ShivamStack. We take these rights seriously and will respond to all valid requests within <strong>30 calendar days</strong>.</p>

              <div className="sspg-rights-list">
                {[
                  { right: "Right to Access",       desc: "Request a complete copy of all personal data we hold about you, including the specific categories, sources, processing purposes, and retention periods." },
                  { right: "Right to Rectification", desc: "Request correction of any inaccurate or incomplete personal data. Most profile data can be corrected directly in your account settings without contacting us." },
                  { right: "Right to Erasure",       desc: "Request permanent deletion of your personal data ('right to be forgotten'). We will honour this request except where retention is legally required (e.g., financial records for 7 years)." },
                  { right: "Right to Data Portability","desc": "Receive your personal data in a structured, commonly used, machine-readable format (JSON or CSV) suitable for transfer to another service." },
                  { right: "Right to Restriction",   desc: "Request that we pause or limit processing of your data while a correction request or objection is being resolved." },
                  { right: "Right to Object",        desc: "Object to processing based on legitimate interests. We will cease unless we can demonstrate compelling overriding legitimate grounds." },
                  { right: "Right to Opt-Out",       desc: "Unsubscribe from marketing and newsletter emails at any time via the unsubscribe link in every email, or from your account preferences panel." },
                ].map((r, i) => (
                  <div className="sspg-right-row" key={i}>
                    <div className="sspg-right-title">{r.right}</div>
                    <div className="sspg-right-desc">{r.desc}</div>
                  </div>
                ))}
              </div>

              <p>To exercise any of the above rights, please email <a href="mailto:privacy@shivamstack.com" className="sspg-inline-link">privacy@shivamstack.com</a> with sufficient detail to identify your request. We may need to verify your identity to protect against unauthorised requests. Verification typically involves confirming the email address associated with your account.</p>
            </div>
          </section>

          {/* ── 08 Third Party ── */}
          <section id="pp-thirdparty" className="sspg-section sspg-reveal" aria-labelledby="pp-thirdparty-h">
            <span className="sspg-section-num" aria-hidden="true">08</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-cyan"><Globe size={18} /></div>
              <h2 id="pp-thirdparty-h" className="sspg-section-title">Third-Party Services</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack integrates the following third-party services to operate the Platform. Each service is independent, operates under its own privacy policy, and is solely responsible for its own data practices. <strong>ShivamStack expressly disclaims all liability for how these independent services collect, process, or use data once it leaves our Platform.</strong> Users should review each provider's privacy policy before use.</p>

              <div className="sspg-tp-grid">
                {[
                  { name: "Stripe / Razorpay",      role: "Payment processing",           url: "stripe.com/privacy" },
                  { name: "Google Analytics 4",     role: "Website analytics (anonymised)", url: "policies.google.com/privacy" },
                  { name: "SendGrid",               role: "Transactional email delivery",   url: "sendgrid.com/policies/privacy" },
                  { name: "Google OAuth 2.0",       role: "Optional social sign-in",        url: "policies.google.com/privacy" },
                  { name: "GitHub OAuth",           role: "Optional social sign-in",        url: "docs.github.com/site-policy/privacy-policies" },
                  { name: "Cloudinary / AWS S3",    role: "Media and file storage",         url: "cloudinary.com/privacy" },
                  { name: "MongoDB Atlas",          role: "Primary database hosting",       url: "mongodb.com/legal/privacy-policy" },
                  { name: "Vercel / Railway",       role: "Application hosting & CDN",      url: "vercel.com/legal/privacy-policy" },
                ].map((t, i) => (
                  <div className="sspg-tp-card" key={i}>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                    <a href={`https://${t.url}`} target="_blank" rel="noopener noreferrer" className="sspg-tp-link">
                      <ExternalLink size={11} />{t.url}
                    </a>
                  </div>
                ))}
              </div>

              <p>The Platform may contain hyperlinks to external websites not operated by ShivamStack. These links do not constitute endorsement. ShivamStack has no control over, accepts no responsibility for, and expressly disclaims all liability regarding the content, privacy practices, or data handling of any external sites.</p>
            </div>
          </section>

          {/* ── 09 Purchases ── */}
          <section id="pp-purchases" className="sspg-section sspg-reveal" aria-labelledby="pp-purchases-h">
            <span className="sspg-section-num" aria-hidden="true">09</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-amber"><Lock size={18} /></div>
              <h2 id="pp-purchases-h" className="sspg-section-title">Digital Products &amp; Purchases</h2>
            </header>
            <div className="sspg-prose">
              <p>When you purchase digital products from ShivamStack (PDFs, e-books, templates, course materials, guides), we collect the minimum information necessary to complete, deliver, and document your transaction.</p>
              <ul className="sspg-ul">
                <li><strong>Payment information</strong> is processed entirely by our third-party payment providers (Stripe or Razorpay). ShivamStack never directly receives, stores, processes, or has access to your card numbers, bank account details, UPI credentials, or other payment instruments. We receive only a transaction confirmation reference and masked payment metadata.</li>
                <li><strong>Purchase and billing records</strong> (product name, amount, date, masked payment reference, buyer name and email) are retained for 7 years from the transaction date to satisfy legal, tax, and accounting obligations under applicable Indian and international law.</li>
                <li><strong>Download access events</strong> are logged with timestamps, IP addresses, and device identifiers for licence enforcement, fraud prevention, and abuse detection.</li>
                <li><strong>Licence terms:</strong> Each digital product purchase grants a personal, non-transferable, non-sublicensable licence for individual use as described in the product listing and our Terms of Service. Unauthorised distribution, resale, or commercial reproduction of purchased digital products is prohibited.</li>
              </ul>

              <div className="sspg-callout sspg-callout--info">
                <Info size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Liability Limitation for Digital Purchases</strong>
                  <p>All digital product sales are final unless our refund policy explicitly states otherwise for a specific product. By purchasing, you confirm you have reviewed the product description. <strong>ShivamStack's maximum aggregate liability for any single purchase is strictly limited to the amount actually paid for that specific product.</strong> We are not liable for indirect, consequential, or incidental losses resulting from the use or inability to use any digital product.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 10 Children ── */}
          <section id="pp-children" className="sspg-section sspg-reveal" aria-labelledby="pp-children-h">
            <span className="sspg-section-num" aria-hidden="true">10</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-rose"><Shield size={18} /></div>
              <h2 id="pp-children-h" className="sspg-section-title">Children's Privacy</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack is intended exclusively for users who are <strong>16 years of age or older</strong>. We do not knowingly solicit, collect, or process personal information from individuals under 16. If you are below the applicable age of digital consent in your jurisdiction, you are not permitted to create an account, make purchases, or otherwise use the Platform.</p>
              <p>If you are a parent or guardian and you believe your child has provided personal information to ShivamStack without your consent, please contact us immediately at <a href="mailto:privacy@shivamstack.com" className="sspg-inline-link">privacy@shivamstack.com</a>. Upon verification of your identity and the situation, we will promptly investigate and delete any data collected from the minor.</p>
              <p>We recommend that parents and guardians maintain active supervision of their children's online activity and discuss safe internet practices, including the importance of not sharing personal information on websites without parental permission.</p>
            </div>
          </section>

          {/* ── 11 Changes ── */}
          <section id="pp-changes" className="sspg-section sspg-reveal" aria-labelledby="pp-changes-h">
            <span className="sspg-section-num" aria-hidden="true">11</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-indigo"><RefreshCw size={18} /></div>
              <h2 id="pp-changes-h" className="sspg-section-title">Changes to This Policy</h2>
            </header>
            <div className="sspg-prose">
              <p>We may update this Privacy Policy periodically to reflect changes in our data practices, applicable laws, technology, or business operations. We are committed to notifying you of material changes in advance:</p>
              <ul className="sspg-ul">
                <li>The "Last Updated" date at the top of this page will be revised to reflect the date of the most recent changes.</li>
                <li>A prominent notice will be displayed on the Platform for at least 30 days following any material change.</li>
                <li>Registered users will receive an email notification when changes materially affect their privacy rights or how their data is processed.</li>
              </ul>
              <p><strong>Your continued use of the Platform following the notice period constitutes your acceptance of the revised Privacy Policy.</strong> If you disagree with any revised terms, you may request account deletion before the effective date of the changes, and we will honour that request.</p>
              <p>Minor updates that do not change the substance of your rights (such as clarifications, corrections of typographical errors, or improved readability) may be made without prior notice, though the "Last Updated" date will always reflect them.</p>
            </div>
          </section>

          {/* ── 12 Contact ── */}
          <section id="pp-contact" className="sspg-section sspg-reveal" aria-labelledby="pp-contact-h">
            <span className="sspg-section-num" aria-hidden="true">12</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><Mail size={18} /></div>
              <h2 id="pp-contact-h" className="sspg-section-title">Contact &amp; Grievances</h2>
            </header>
            <div className="sspg-prose">
              <p>For any privacy-related questions, data access requests, concerns, or complaints, please contact the data controller directly. All communications are handled personally by Shivam Kumar.</p>
              <div className="sspg-contact-block">
                <div className="sspg-contact-row"><Mail size={15} /><a href="mailto:privacy@shivamstack.com" className="sspg-inline-link">privacy@shivamstack.com</a></div>
                <div className="sspg-contact-row"><Globe size={15} /><a href="https://shivamstack.com" className="sspg-inline-link">shivamstack.com</a></div>
                <div className="sspg-contact-row"><Clock size={15} /><span>Data requests responded to within 30 calendar days · General enquiries within 5 business days</span></div>
              </div>
              <p>We take all privacy grievances seriously. You also have the right to lodge a complaint with your relevant data protection supervisory authority if you believe your rights have been violated and we have not adequately addressed your concern.</p>
            </div>
          </section>

          {/* Related pages */}
          <div className="sspg-related">
            <Link to="/terms" className="sspg-related-card">
              <FileText size={22} />
              <div><strong>Terms of Service</strong><span>Read our full terms &amp; conditions</span></div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/contact" className="sspg-related-card">
              <Mail size={22} />
              <div><strong>Contact Us</strong><span>Get in touch directly</span></div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/about" className="sspg-related-card">
              <Sparkles size={22} />
              <div><strong>About ShivamStack</strong><span>Learn about the platform</span></div>
              <ChevronRight size={16} />
            </Link>
          </div>

        </article>
      </div>

      {/* Scroll to top */}
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

export default PrivacyPolicy;