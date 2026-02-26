import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mail, MessageSquare, Clock, Globe, Shield, FileText,
  ChevronRight, ArrowUp, Send, User, AtSign, HelpCircle,
  CheckCircle, AlertTriangle, Info, Sparkles, Zap, Phone,
  Github, Twitter, Linkedin, Youtube, Plus,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const META = {
  title:       "Contact Us — ShivamStack",
  description: "Get in touch with ShivamStack. Send us a message for support, collaborations, business inquiries, or general questions. We respond within 2 business days.",
};

const SECTIONS = [
  { id: "ct-form",     icon: MessageSquare, title: "Send a Message" },
  { id: "ct-channels", icon: AtSign,        title: "Other Channels" },
  { id: "ct-response", icon: Clock,         title: "Response Times" },
  { id: "ct-faq",      icon: HelpCircle,    title: "FAQ" },
  { id: "ct-social",   icon: Globe,         title: "Follow & Connect" },
];

const FAQS = [
  {
    q: "How long does it take to receive a reply?",
    a: "General enquiries are replied to within 2 business days. Technical support and purchase issues are prioritised and typically resolved within 1 business day. Legal and privacy requests are handled within 30 calendar days as required by applicable regulations.",
  },
  {
    q: "I haven't received my purchased digital product. What should I do?",
    a: "First, check your spam/junk email folder — automated delivery emails sometimes land there. If you still can't find it after 24 hours, email support@shivamstack.com with your order ID (found in your account dashboard) and we'll resend the download link promptly.",
  },
  {
    q: "Can I request a refund for a digital product?",
    a: "Due to the non-returnable nature of digital goods, all sales are final by default. Refunds are considered only if the file is fundamentally corrupted or the product is substantially different from its description. Please contact support within 7 days of purchase with your order details. Full refund policy is outlined in our Terms of Service.",
  },
  {
    q: "I found a bug or broken feature on the platform. How do I report it?",
    a: "Please email tech@shivamstack.com with a description of the issue, the browser and device you're using, and steps to reproduce the problem. Screenshots or screen recordings are extremely helpful. We take all bug reports seriously and aim to investigate within 48 hours.",
  },
  {
    q: "Can I use ShivamStack articles or code samples in my own project?",
    a: "Free content (articles, tutorials, code samples) may be used for personal, non-commercial educational purposes with attribution. Commercial use, republishing, or inclusion in paid products requires prior written consent. Contact legal@shivamstack.com for licensing enquiries.",
  },
  {
    q: "I want to collaborate or write a guest post. How do I propose it?",
    a: "We occasionally collaborate on high-quality technical content. Send a brief proposal to hello@shivamstack.com including your topic idea, your background, and writing samples or portfolio links. We review all submissions but cannot guarantee responses to speculative proposals.",
  },
  {
    q: "How do I request deletion of my personal data?",
    a: "Email privacy@shivamstack.com from your registered account email requesting full account and data deletion. We will process your request within 30 calendar days and confirm when deletion is complete, subject to mandatory legal retention requirements for financial records.",
  },
  {
    q: "Is there a phone number or live chat support?",
    a: "ShivamStack is operated by an individual developer and currently offers email-based support only. This allows us to provide thoughtful, well-researched responses rather than rushed real-time replies. All enquiries receive personal attention from Shivam Kumar.",
  },
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

const ContactUs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [active]       = useActiveSection(SECTIONS.map((s) => s.id));
  const [showTop, setShowTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const MAX_CHARS = 2000;

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

  const handleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const handleMessageChange = (e) => setCharCount(e.target.value.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission — replace with real API call
    await new Promise((r) => setTimeout(r, 1600));
    setIsSubmitting(false);
    setSubmitted(true);
    formRef.current?.reset();
    setCharCount(0);
  };

  return (
    <main
      className={`sspg-root ${isDarkMode ? "dark" : "light"}`}
      itemScope
      itemType="https://schema.org/ContactPage"
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
      <header className="sspg-hero sspg-hero--contact">
        <div className="sspg-hero-eyebrow">
          <MessageSquare size={13} />
          <span>Get In Touch</span>
        </div>
        <h1 className="sspg-hero-title" itemProp="headline">
          Contact <span className="sspg-gradient-text">Us</span>
        </h1>
        <p className="sspg-hero-sub">
          Have a question, spotted a bug, or want to collaborate? We'd love to hear from you.
          Every message is read personally — we don't use bots or auto-close tickets.
        </p>
        <div className="sspg-hero-chips">
          <span className="sspg-chip"><Clock size={11} /> Replies within 2 business days</span>
          <span className="sspg-chip"><CheckCircle size={11} /> Personal responses</span>
          <span className="sspg-chip"><Mail size={11} /> Email support</span>
        </div>
        <div className="sspg-hero-deco" aria-hidden="true">
          <Mail size={120} />
        </div>
      </header>

      <div className="sspg-layout">

        {/* Sidebar */}
        <aside className="sspg-sidebar">
          <p className="sspg-sidebar-label">On this page</p>
          <nav aria-label="Contact page sections">
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
            <Link to="/privacy" className="sspg-sidebar-link"><Shield size={12} />Privacy Policy</Link>
            <Link to="/terms" className="sspg-sidebar-link"><FileText size={12} />Terms of Service</Link>
          </div>
        </aside>

        {/* Content */}
        <article className="sspg-content" itemProp="mainContentOfPage">

          {/* ── Contact Form ── */}
          <section id="ct-form" className="sspg-section sspg-reveal" aria-labelledby="ct-form-h">
            <span className="sspg-section-num" aria-hidden="true">01</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-indigo"><MessageSquare size={18} /></div>
              <h2 id="ct-form-h" className="sspg-section-title">Send a Message</h2>
            </header>
            <div className="sspg-prose">
              <p>Use the form below to send a direct message. All fields marked are required. Your message goes straight to Shivam Kumar — not a ticketing system, not an outsourced support team.</p>

              {submitted ? (
                <div className="sspg-callout sspg-callout--success" style={{ marginTop: 24 }}>
                  <CheckCircle size={20} className="sspg-callout-icon" />
                  <div>
                    <strong>Message Sent Successfully!</strong>
                    <p>Thank you for reaching out. Your message has been received and you'll hear back within 2 business days. Please check your inbox and spam folder for our reply.</p>
                  </div>
                </div>
              ) : (
                <form
                  ref={formRef}
                  className="sspg-contact-form-wrap"
                  onSubmit={handleSubmit}
                  style={{ marginTop: 24 }}
                  itemScope
                  itemType="https://schema.org/ContactPoint"
                  noValidate
                >
                  <div className="sspg-form-title">Drop Us a Line</div>
                  <div className="sspg-form-subtitle">Fields marked with * are required. We'll never share your information.</div>

                  <div className="sspg-form-grid">
                    {/* Name */}
                    <div className="sspg-form-group">
                      <label className="sspg-form-label" htmlFor="ct-name">Full Name *</label>
                      <input
                        id="ct-name"
                        type="text"
                        className="sspg-form-input"
                        placeholder="Your full name"
                        required
                        autoComplete="name"
                        maxLength={100}
                      />
                    </div>

                    {/* Email */}
                    <div className="sspg-form-group">
                      <label className="sspg-form-label" htmlFor="ct-email">Email Address *</label>
                      <input
                        id="ct-email"
                        type="email"
                        className="sspg-form-input"
                        placeholder="your@email.com"
                        required
                        autoComplete="email"
                        maxLength={200}
                      />
                    </div>

                    {/* Subject */}
                    <div className="sspg-form-group sspg-form-group--full">
                      <label className="sspg-form-label" htmlFor="ct-subject">Subject *</label>
                      <input
                        id="ct-subject"
                        type="text"
                        className="sspg-form-input"
                        placeholder="Brief subject of your message"
                        required
                        maxLength={200}
                      />
                    </div>

                    {/* Category */}
                    <div className="sspg-form-group sspg-form-group--full">
                      <label className="sspg-form-label" htmlFor="ct-category">Category *</label>
                      <select id="ct-category" className="sspg-form-select" required defaultValue="">
                        <option value="" disabled>Select a category…</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="purchase">Purchase / Order Issue</option>
                        <option value="refund">Refund Request</option>
                        <option value="collab">Collaboration / Partnership</option>
                        <option value="bug">Bug Report</option>
                        <option value="privacy">Privacy / Data Request</option>
                        <option value="legal">Legal / Copyright</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="sspg-form-group sspg-form-group--full">
                      <label className="sspg-form-label" htmlFor="ct-message">Message * <span style={{ color: 'var(--sspg-text-muted)', textTransform: 'none', fontSize: 11 }}>(Be as detailed as possible)</span></label>
                      <textarea
                        id="ct-message"
                        className="sspg-form-textarea"
                        placeholder="Describe your question or issue in detail. For support requests, include your order ID, browser, and device if relevant…"
                        required
                        maxLength={MAX_CHARS}
                        onChange={handleMessageChange}
                        style={{ minHeight: 160 }}
                      />
                      <div className="sspg-form-char-count">
                        {charCount} / {MAX_CHARS}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="sspg-form-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="sspg-spinner" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="sspg-form-note">
                    By submitting this form you agree to our <Link to="/privacy" style={{ color: 'var(--sspg-text-accent)' }}>Privacy Policy</Link>.
                    Your data will only be used to respond to your enquiry.
                  </p>
                </form>
              )}
            </div>
          </section>

          {/* ── Other Channels ── */}
          <section id="ct-channels" className="sspg-section sspg-reveal" aria-labelledby="ct-channels-h">
            <span className="sspg-section-num" aria-hidden="true">02</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-cyan"><AtSign size={18} /></div>
              <h2 id="ct-channels-h" className="sspg-section-title">Direct Email Channels</h2>
            </header>
            <div className="sspg-prose">
              <p>For specific types of enquiries, you can reach us directly by email. Using the correct channel ensures your message is routed to the right context and handled appropriately.</p>

              <div className="sspg-contact-info-cards">
                {[
                  { icon: Mail,          c: "indigo", label: "General / Hello",      addr: "hello@shivamstack.com",   note: "General questions, feedback, and friendly messages. Replies within 2 business days." },
                  { icon: HelpCircle,    c: "green",  label: "Technical Support",    addr: "support@shivamstack.com", note: "Purchase issues, product access, order problems, and technical bugs. Priority queue." },
                  { icon: Shield,        c: "amber",  label: "Privacy & Data",       addr: "privacy@shivamstack.com", note: "Data access, correction, deletion requests, and all DPDP Act or GDPR-related enquiries." },
                  { icon: FileText,      c: "cyan",   label: "Legal & Licensing",    addr: "legal@shivamstack.com",   note: "Copyright notices, licensing inquiries, DMCA requests, and legal correspondence." },
                  { icon: Zap,           c: "purple", label: "Collaborations",       addr: "collab@shivamstack.com",  note: "Partnership proposals, sponsored content inquiries, and joint project opportunities." },
                  { icon: AlertTriangle, c: "rose",   label: "Security Reports",     addr: "security@shivamstack.com",note: "Responsible vulnerability disclosure. We take security reports very seriously." },
                ].map((ch, i) => (
                  <a
                    key={i}
                    href={`mailto:${ch.addr}`}
                    className="sspg-contact-info-card"
                    aria-label={`Email ${ch.label}`}
                  >
                    <div className={`sspg-contact-info-icon sspg-color-${ch.c}`}>
                      <ch.icon size={18} />
                    </div>
                    <div>
                      <strong>{ch.label}</strong>
                      <span style={{ display: 'block', color: 'var(--sspg-text-accent)', fontSize: 13, margin: '2px 0' }}>{ch.addr}</span>
                      <span>{ch.note}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="sspg-callout sspg-callout--info">
                <Info size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Email Tips for Faster Resolution</strong>
                  <p>Include your registered account email, order ID (for purchase issues), browser/device details (for bugs), and as much specific context as possible. Vague messages like "it's not working" require back-and-forth that delays resolution.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Response Times ── */}
          <section id="ct-response" className="sspg-section sspg-reveal" aria-labelledby="ct-response-h">
            <span className="sspg-section-num" aria-hidden="true">03</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><Clock size={18} /></div>
              <h2 id="ct-response-h" className="sspg-section-title">Response Times &amp; SLAs</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack is operated by Shivam Kumar as an independent developer and creator. All messages are read and responded to personally — there are no automated responses or AI-generated replies. The following response times are our standard commitments:</p>

              <div className="sspg-response-times">
                {[
                  { value: "2 days",    label: "General Enquiries" },
                  { value: "1 day",     label: "Purchase Support" },
                  { value: "48 hrs",    label: "Bug Reports" },
                  { value: "30 days",   label: "Privacy Requests" },
                  { value: "5 days",    label: "Legal Correspondence" },
                  { value: "72 hrs",    label: "Security Reports" },
                ].map((rt, i) => (
                  <div className="sspg-response-time-card" key={i}>
                    <span className="sspg-response-time-value">{rt.value}</span>
                    <span className="sspg-response-time-label">{rt.label}</span>
                  </div>
                ))}
              </div>

              <p>Response times are measured in business days (Monday–Saturday, Indian Standard Time), excluding public holidays. During periods of high volume, response times may extend slightly but we always aim to respond within the stated windows. <strong>If you haven't received a response within the expected timeframe, please check your spam folder first, then follow up.</strong></p>

              <div className="sspg-callout sspg-callout--warning">
                <AlertTriangle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>No Phone or Live Chat Support</strong>
                  <p>ShivamStack currently does not offer phone, WhatsApp, or live chat support. Email is our sole official support channel. This allows every enquiry to receive careful, well-considered attention rather than rushed real-time responses.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="ct-faq" className="sspg-section sspg-reveal" aria-labelledby="ct-faq-h">
            <span className="sspg-section-num" aria-hidden="true">04</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-amber"><HelpCircle size={18} /></div>
              <h2 id="ct-faq-h" className="sspg-section-title">Frequently Asked Questions</h2>
            </header>
            <div className="sspg-prose">
              <p>Before reaching out, please check if your question is answered below. These are the questions we receive most often, answered in full detail.</p>

              <div className="sspg-faq-list" itemScope itemType="https://schema.org/FAQPage">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className={`sspg-faq-item ${openFaq === i ? "sspg-faq-item--open" : ""}`}
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <button
                      className="sspg-faq-question"
                      onClick={() => handleFaq(i)}
                      aria-expanded={openFaq === i}
                    >
                      <span itemProp="name">{faq.q}</span>
                      <Plus size={16} className="sspg-faq-icon" />
                    </button>
                    <div className="sspg-faq-answer" itemScope itemType="https://schema.org/Answer">
                      <div className="sspg-faq-answer-inner" itemProp="text">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p>Didn't find what you were looking for? Use the contact form above or email <a href="mailto:hello@shivamstack.com" className="sspg-inline-link">hello@shivamstack.com</a> with your specific question.</p>
            </div>
          </section>

          {/* ── Social ── */}
          <section id="ct-social" className="sspg-section sspg-reveal" aria-labelledby="ct-social-h">
            <span className="sspg-section-num" aria-hidden="true">05</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-purple"><Globe size={18} /></div>
              <h2 id="ct-social-h" className="sspg-section-title">Follow &amp; Connect</h2>
            </header>
            <div className="sspg-prose">
              <p>Stay updated with ShivamStack's latest projects, tutorials, and digital products by following on social media. <strong>Please note that social media platforms are not monitored for support requests</strong> — use the contact form or email channels above for any issues requiring a response.</p>

              <div className="sspg-tp-grid" style={{ marginTop: 24 }}>
                {[
                  { icon: Github,   c: "indigo", name: "GitHub",   url: "https://github.com/shivamstack",   note: "Open-source projects, code, and contributions." },
                  { icon: Twitter,  c: "cyan",   name: "Twitter / X", url: "https://twitter.com/shivamstack", note: "Quick updates, threads, and dev commentary." },
                  { icon: Linkedin, c: "indigo", name: "LinkedIn",  url: "https://linkedin.com/in/shivamstack", note: "Professional updates and career content." },
                  { icon: Youtube,  c: "rose",   name: "YouTube",   url: "https://youtube.com/@shivamstack", note: "Video tutorials and project walkthroughs." },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sspg-tp-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <s.icon size={16} className={`sspg-color-${s.c}`} />
                      <strong>{s.name}</strong>
                    </div>
                    <span>{s.note}</span>
                  </a>
                ))}
              </div>

              <div className="sspg-callout sspg-callout--info">
                <Info size={16} className="sspg-callout-icon" />
                <div>
                  <strong>For Support, Always Use Email</strong>
                  <p>DMs on Twitter/GitHub or comments on YouTube are not monitored for support. They may be missed or delayed by weeks. Email is the only guaranteed way to reach us.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Related */}
          <div className="sspg-related">
            <Link to="/about" className="sspg-related-card">
              <Sparkles size={22} />
              <div><strong>About ShivamStack</strong><span>Learn about the creator</span></div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/privacy" className="sspg-related-card">
              <Shield size={22} />
              <div><strong>Privacy Policy</strong><span>How we handle your data</span></div>
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

export default ContactUs;