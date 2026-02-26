import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText, Scale, ShieldAlert, Package, CreditCard, Ban,
  ChevronRight, ArrowUp, Mail, Shield, Globe, RefreshCw,
  AlertTriangle, CheckCircle, XCircle, Info, BookOpen,
  Sparkles, Clock, Lock, Gavel, UserX, Layers,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const META = {
  title:       "Terms of Service — ShivamStack",
  description: "ShivamStack terms of service. Understand the rules, rights, and obligations governing your use of our platform and digital products.",
  updated:     "February 1, 2025",
  effective:   "February 1, 2025",
};

const SECTIONS = [
  { id: "tos-overview",    icon: BookOpen,    title: "Overview & Acceptance" },
  { id: "tos-eligibility", icon: UserX,       title: "Eligibility & Account" },
  { id: "tos-conduct",     icon: ShieldAlert, title: "Acceptable Use" },
  { id: "tos-ip",          icon: Layers,      title: "Intellectual Property" },
  { id: "tos-products",    icon: Package,     title: "Digital Products" },
  { id: "tos-payments",    icon: CreditCard,  title: "Payments & Refunds" },
  { id: "tos-disclaimer",  icon: Scale,       title: "Disclaimers" },
  { id: "tos-liability",   icon: Gavel,       title: "Liability Limitation" },
  { id: "tos-termination", icon: Ban,         title: "Termination" },
  { id: "tos-governing",   icon: Globe,       title: "Governing Law" },
  { id: "tos-changes",     icon: RefreshCw,   title: "Changes to Terms" },
  { id: "tos-contact",     icon: Mail,        title: "Contact" },
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

const TermsOfService = () => {
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

      {/* Ambient */}
      <div className="sspg-ambient" aria-hidden="true">
        <div className="sspg-orb sspg-orb-1" />
        <div className="sspg-orb sspg-orb-2" />
        <div className="sspg-orb sspg-orb-3" />
        <div className="sspg-grid" />
        <div className="sspg-noise" />
      </div>

      {/* HERO */}
      <header className="sspg-hero sspg-hero--terms">
        <div className="sspg-hero-eyebrow">
          <Scale size={13} />
          <span>Legal · Terms of Service</span>
        </div>
        <h1 className="sspg-hero-title" itemProp="headline">
          Terms of <span className="sspg-gradient-text">Service</span>
        </h1>
        <p className="sspg-hero-sub">
          These terms govern your access to and use of ShivamStack. Please read them
          carefully — by using this platform you agree to be legally bound by them.
        </p>
        <div className="sspg-hero-chips">
          <span className="sspg-chip"><Clock size={11} /> Updated: {META.updated}</span>
          <span className="sspg-chip"><CheckCircle size={11} /> Effective: {META.effective}</span>
          <span className="sspg-chip"><Globe size={11} /> Indian & International Law</span>
        </div>
        <div className="sspg-hero-deco" aria-hidden="true">
          <Scale size={120} />
        </div>
      </header>

      <div className="sspg-layout">

        {/* Sidebar */}
        <aside className="sspg-sidebar">
          <p className="sspg-sidebar-label">On this page</p>
          <nav aria-label="Terms sections">
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
            <Link to="/contact" className="sspg-sidebar-link"><Mail size={12} />Contact Us</Link>
          </div>
        </aside>

        {/* Content */}
        <article className="sspg-content" itemProp="mainContentOfPage">

          {/* ── 01 Overview ── */}
          <section id="tos-overview" className="sspg-section sspg-reveal" aria-labelledby="tos-overview-h">
            <span className="sspg-section-num" aria-hidden="true">01</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-indigo"><BookOpen size={18} /></div>
              <h2 id="tos-overview-h" className="sspg-section-title">Overview &amp; Acceptance of Terms</h2>
            </header>
            <div className="sspg-prose">
              <p>Welcome to <strong>ShivamStack</strong> ("the Platform"), a personal portfolio and digital products platform operated by <strong>Shivam Kumar</strong>, an independent developer and content creator based in India ("we," "us," "our"). These Terms of Service ("Terms," "Agreement") constitute a legally binding contract between you ("you," "user," "visitor," "customer") and Shivam Kumar governing your access to and use of <strong>shivamstack.com</strong>, including all subdomains, APIs, content, digital products, services, and features thereof (collectively, "the Platform").</p>

              <p>By accessing, browsing, registering on, or making a purchase through the Platform in any manner, you acknowledge that you have read, fully understood, and unconditionally agreed to be bound by these Terms, our Privacy Policy, and any additional guidelines, policies, or rules applicable to specific features of the Platform. These Terms form a legally enforceable agreement. <strong>If you do not agree to any part of these Terms, you must immediately discontinue all use of the Platform.</strong></p>

              <p>These Terms are drafted to protect both you and ShivamStack. Our goal is to create a transparent, fair, and legally sound foundation for every interaction on this Platform. If you have questions about any provision, please contact us before proceeding.</p>

              <div className="sspg-callout sspg-callout--info">
                <Info size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Plain-English Summary</strong>
                  <p>These terms establish the rules for using ShivamStack. They protect your rights as a user and define our responsibilities and limitations as an operator. Reading them helps you understand exactly what you're agreeing to — nothing is hidden.</p>
                </div>
              </div>

              <h3 className="sspg-h3">Definitions</h3>
              <ul className="sspg-ul">
                <li><strong>"Platform"</strong> refers to shivamstack.com and all associated services, APIs, content, and digital products.</li>
                <li><strong>"User"</strong> means any individual or entity who accesses the Platform in any capacity.</li>
                <li><strong>"Digital Products"</strong> refers to PDFs, e-books, templates, guides, code files, and other downloadable materials sold on the Platform.</li>
                <li><strong>"Content"</strong> means all articles, tutorials, code samples, videos, images, project descriptions, and other materials published on the Platform.</li>
                <li><strong>"Account"</strong> means a registered user profile on the Platform.</li>
                <li><strong>"Operator"</strong> means Shivam Kumar, the individual who owns and operates the Platform.</li>
              </ul>

              <div className="sspg-terms-highlight">
                <p>These Terms were last revised on <strong>{META.updated}</strong> and take effect from <strong>{META.effective}</strong>. Your continued use after any revision constitutes acceptance of the updated Terms. Material changes will be communicated with advance notice as described in Section 11.</p>
              </div>
            </div>
          </section>

          {/* ── 02 Eligibility ── */}
          <section id="tos-eligibility" className="sspg-section sspg-reveal" aria-labelledby="tos-eligibility-h">
            <span className="sspg-section-num" aria-hidden="true">02</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-purple"><UserX size={18} /></div>
              <h2 id="tos-eligibility-h" className="sspg-section-title">Eligibility &amp; Account Registration</h2>
            </header>
            <div className="sspg-prose">
              <h3 className="sspg-h3">Age Requirements</h3>
              <p>The Platform is intended exclusively for individuals who are <strong>16 years of age or older</strong>. By using the Platform, you represent and warrant that you meet this minimum age requirement. If you are under 16, you may not register, create an account, make purchases, or otherwise use the Platform. Parents or guardians who discover a minor has used the Platform should contact us immediately at privacy@shivamstack.com.</p>

              <h3 className="sspg-h3">Account Registration</h3>
              <p>To access certain features of the Platform — including purchasing digital products, saving bookmarks, and managing order history — you must create an account. When registering, you agree to:</p>
              <ol className="sspg-numbered-list">
                <li>Provide accurate, complete, and current information including your real name and a valid email address.</li>
                <li>Maintain and promptly update your account information to keep it accurate.</li>
                <li>Create a strong, unique password and keep it strictly confidential at all times.</li>
                <li>Immediately notify us of any suspected or actual unauthorised access to your account.</li>
                <li>Accept full responsibility for all activities that occur under your account, regardless of whether you authorised them.</li>
                <li>Not share your account credentials with any other person or allow others to access your account.</li>
                <li>Not create more than one account per person without explicit written permission.</li>
              </ol>

              <h3 className="sspg-h3">Account Security</h3>
              <p>You are solely responsible for maintaining the confidentiality of your login credentials. ShivamStack implements industry-standard security measures including bcrypt password hashing, JWT session management, and brute-force lockout protection. However, <strong>ShivamStack is not liable for any loss or damage arising from your failure to secure your account credentials, sharing your password, or your inability to maintain the security of your own devices.</strong></p>

              <h3 className="sspg-h3">Accurate Registration Information</h3>
              <p>Providing false, misleading, or impersonatory registration information is strictly prohibited and constitutes immediate grounds for account termination. ShivamStack reserves the right to verify account information and may require supporting documentation at its sole discretion.</p>

              <div className="sspg-callout sspg-callout--warning">
                <AlertTriangle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Important</strong>
                  <p>ShivamStack will never ask for your password via email, chat, or any other communication channel. If you receive such a request, it is fraudulent. Please report it to security@shivamstack.com immediately.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 03 Conduct ── */}
          <section id="tos-conduct" className="sspg-section sspg-reveal" aria-labelledby="tos-conduct-h">
            <span className="sspg-section-num" aria-hidden="true">03</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-amber"><ShieldAlert size={18} /></div>
              <h2 id="tos-conduct-h" className="sspg-section-title">Acceptable Use Policy</h2>
            </header>
            <div className="sspg-prose">
              <p>Your use of the Platform must comply with all applicable laws and regulations, and must respect the rights and interests of other users, third parties, and ShivamStack itself. The following comprehensive rules govern your conduct on the Platform.</p>

              <h3 className="sspg-h3">Permitted Use</h3>
              <div className="sspg-allowed-grid">
                {[
                  { t: "Browse & Learn", d: "Reading articles, tutorials, and project showcases for personal education and reference." },
                  { t: "Purchase Products", d: "Acquiring digital products for personal, non-commercial use as described in product listings." },
                  { t: "Share Content", d: "Sharing links to articles on social media, with appropriate attribution." },
                  { t: "Contact & Engage", d: "Submitting feedback, questions, or support requests through official channels." },
                  { t: "Personal Projects", d: "Using code examples and tutorials to build your own personal or educational projects." },
                  { t: "Save & Reference", d: "Bookmarking content and referring to it for your own learning purposes." },
                ].map((a, i) => (
                  <div className="sspg-allowed-card" key={i}>
                    <strong>{a.t}</strong>
                    <p>{a.d}</p>
                  </div>
                ))}
              </div>

              <h3 className="sspg-h3">Prohibited Activities</h3>
              <p>The following activities are strictly prohibited and may result in immediate account termination, civil liability, or criminal referral:</p>
              <div className="sspg-penalty-grid">
                {[
                  { t: "Intellectual Property Theft",    d: "Reproducing, distributing, or selling ShivamStack content or digital products without authorisation." },
                  { t: "Circumventing Access Controls",  d: "Attempting to bypass authentication, paywalls, rate limits, or any security mechanism." },
                  { t: "Automated Scraping",             d: "Using bots, crawlers, or scripts to systematically download, harvest, or mirror Platform content." },
                  { t: "Credential Fraud",               d: "Creating fake accounts, impersonating others, or using false identity information." },
                  { t: "Malicious Code",                 d: "Uploading or transmitting viruses, malware, ransomware, or any harmful software." },
                  { t: "Platform Disruption",            d: "Attempting DDoS attacks, SQL injection, XSS attacks, or any form of Platform interference." },
                  { t: "Content Misrepresentation",      d: "Presenting ShivamStack content as your own without attribution." },
                  { t: "Fraudulent Transactions",        d: "Using stolen payment methods or engaging in any fraudulent commercial activity." },
                ].map((p, i) => (
                  <div className="sspg-penalty-card" key={i}>
                    <strong>{p.t}</strong>
                    <p>{p.d}</p>
                  </div>
                ))}
              </div>

              <div className="sspg-callout sspg-callout--danger">
                <XCircle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Enforcement</strong>
                  <p>Violations of this Acceptable Use Policy may result in immediate account suspension or termination, legal action, reporting to law enforcement, and/or claims for damages. ShivamStack reserves all available legal remedies.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 04 IP ── */}
          <section id="tos-ip" className="sspg-section sspg-reveal" aria-labelledby="tos-ip-h">
            <span className="sspg-section-num" aria-hidden="true">04</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-cyan"><Layers size={18} /></div>
              <h2 id="tos-ip-h" className="sspg-section-title">Intellectual Property Rights</h2>
            </header>
            <div className="sspg-prose">
              <p>All content, materials, code, designs, logos, branding, graphics, text, data, digital products, and other assets on or made available through the Platform are the exclusive intellectual property of Shivam Kumar or are used under valid licence. These works are protected by applicable Indian and international copyright, trademark, design right, and other intellectual property laws.</p>

              <h3 className="sspg-h3">Ownership</h3>
              <p>The following elements are the sole and exclusive property of Shivam Kumar and are fully protected under applicable law:</p>
              <ul className="sspg-ul">
                <li>All written articles, tutorials, guides, course materials, and blog posts authored by Shivam Kumar, in whole or in part.</li>
                <li>All original source code, code samples, project architectures, and technical implementations created by Shivam Kumar.</li>
                <li>All digital products including PDFs, e-books, templates, worksheets, and downloadable files sold or distributed through the Platform.</li>
                <li>The "ShivamStack" brand name, logo, taglines, colour schemes, and all associated branding and visual identity materials.</li>
                <li>The design, layout, user interface, navigation structure, and overall aesthetic of the Platform.</li>
                <li>All photographs, illustrations, custom icons, and graphic assets created by or exclusively commissioned for Shivam Kumar.</li>
              </ul>

              <h3 className="sspg-h3">Limited Personal Licence for Free Content</h3>
              <p>Subject to your compliance with these Terms, ShivamStack grants you a limited, revocable, non-exclusive, non-sublicensable, non-transferable personal licence to access and use freely published Platform content (articles, tutorials, code samples) solely for your own non-commercial educational purposes. This licence does not grant any right to:</p>
              <ul className="sspg-ul">
                <li>Reproduce, republish, redistribute, resell, or commercially exploit any Platform content.</li>
                <li>Create derivative works based on Platform content without prior written consent.</li>
                <li>Remove or alter any copyright notices, attribution credits, or proprietary markings.</li>
                <li>Sublicense, transfer, or assign any rights to third parties.</li>
              </ul>

              <h3 className="sspg-h3">Reporting Infringement</h3>
              <p>ShivamStack takes intellectual property rights seriously, both our own and those of others. If you believe any content on the Platform infringes upon your intellectual property rights, please contact us at legal@shivamstack.com with full details. Similarly, if you discover ShivamStack content being infringed upon externally, we would appreciate being informed.</p>

              <div className="sspg-terms-highlight">
                <p><strong>Attribution Notice:</strong> All original content on this Platform is © {new Date().getFullYear()} Shivam Kumar / ShivamStack. All rights reserved. Unauthorised reproduction or distribution is a violation of copyright law and these Terms.</p>
              </div>
            </div>
          </section>

          {/* ── 05 Digital Products ── */}
          <section id="tos-products" className="sspg-section sspg-reveal" aria-labelledby="tos-products-h">
            <span className="sspg-section-num" aria-hidden="true">05</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><Package size={18} /></div>
              <h2 id="tos-products-h" className="sspg-section-title">Digital Products &amp; Licences</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack sells digital products including but not limited to: PDF guides, e-books, code templates, design assets, educational worksheets, and programming reference materials. The following terms govern all digital product purchases and usage.</p>

              <h3 className="sspg-h3">Licence Grant</h3>
              <p>Upon successful payment and order confirmation, ShivamStack grants you a <strong>personal, non-exclusive, non-transferable, non-sublicensable, single-user licence</strong> to download and use the purchased digital product solely for your own personal, non-commercial purposes, subject to the following restrictions:</p>
              <ul className="sspg-ul">
                <li>The licence is valid for one named individual only — sharing, gifting, or transferring access to any other person is prohibited.</li>
                <li>You may not reproduce, resell, redistribute, rent, lend, or otherwise commercially exploit the digital product.</li>
                <li>You may not share download links, credentials, or file copies with any third party.</li>
                <li>You may not modify, adapt, translate, decompile, or create derivative works from any digital product without prior written consent.</li>
                <li>Team or organisational use requires a separate commercial licence — contact us for pricing.</li>
              </ul>

              <h3 className="sspg-h3">Product Descriptions & Accuracy</h3>
              <p>ShivamStack makes all reasonable efforts to provide accurate, up-to-date descriptions of digital products. However, all product information is provided in good faith and <strong>"as is."</strong> Minor inaccuracies in product descriptions, features, or technical specifications do not constitute grounds for a refund unless the core material of the product is fundamentally different from what was described. You are encouraged to review the full product description and any available previews before purchasing.</p>

              <h3 className="sspg-h3">Delivery & Access</h3>
              <p>Digital products are delivered electronically to your registered email address and made available in your account dashboard immediately or within 24 hours of successful payment confirmation. If you do not receive your product within 24 hours, please check your spam folder and then contact support@shivamstack.com. ShivamStack is not responsible for delivery failures caused by incorrect email addresses provided at registration.</p>

              <div className="sspg-callout sspg-callout--warning">
                <AlertTriangle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Piracy & Unauthorised Distribution</strong>
                  <p>Sharing, reselling, or uploading purchased digital products to file-sharing platforms, torrent sites, or any other distribution channel is a serious violation of copyright law and these Terms. ShivamStack actively monitors for infringement and will pursue all available legal remedies, including civil claims for damages and criminal referrals where applicable.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 06 Payments ── */}
          <section id="tos-payments" className="sspg-section sspg-reveal" aria-labelledby="tos-payments-h">
            <span className="sspg-section-num" aria-hidden="true">06</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-amber"><CreditCard size={18} /></div>
              <h2 id="tos-payments-h" className="sspg-section-title">Payments, Pricing &amp; Refunds</h2>
            </header>
            <div className="sspg-prose">
              <h3 className="sspg-h3">Payment Processing</h3>
              <p>All payments on ShivamStack are processed by independent, PCI-DSS compliant third-party payment providers (currently Stripe and/or Razorpay). <strong>ShivamStack does not directly receive, process, store, or have access to your payment card numbers, UPI credentials, net banking details, or any other financial account information.</strong> All payment data is handled exclusively by the payment provider under their own security standards and privacy policies. By making a purchase, you also agree to the applicable payment provider's terms of service.</p>

              <h3 className="sspg-h3">Pricing & Taxes</h3>
              <ul className="sspg-ul">
                <li>All prices are displayed in Indian Rupees (INR) or United States Dollars (USD) as applicable and are inclusive of any applicable taxes unless otherwise stated.</li>
                <li>Prices are subject to change at any time without prior notice. Changes do not affect purchases already confirmed.</li>
                <li>Applicable taxes including GST may be added at checkout depending on your jurisdiction.</li>
                <li>Currency conversion for international payments is handled by the payment provider; exchange rate fluctuations are your responsibility.</li>
              </ul>

              <h3 className="sspg-h3">Refund Policy</h3>
              <p>Due to the nature of digital products (which are delivered electronically and cannot be "returned"), all sales are <strong>final by default</strong>. Refunds may be considered on a case-by-case basis only under the following limited circumstances:</p>
              <ul className="sspg-ul">
                <li>The product file is fundamentally corrupted, unreadable, or has zero usable content — and ShivamStack is unable to provide a working replacement within 72 hours.</li>
                <li>The delivered product is substantially and materially different from the product description in a way that defeats the core purpose of the purchase.</li>
                <li>A verified duplicate charge occurred due to a technical error on the Platform (not user error).</li>
              </ul>
              <p>To request a refund under the above circumstances, contact support@shivamstack.com within <strong>7 days of purchase</strong> with your order ID and a detailed description of the issue. Refund decisions are made at ShivamStack's sole discretion. <strong>Change of mind, purchasing the wrong product, or partial use of a product do not constitute valid refund grounds.</strong></p>

              <div className="sspg-callout sspg-callout--info">
                <Info size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Payment Disputes</strong>
                  <p>If you believe an erroneous charge has occurred, please contact us before initiating a chargeback through your bank or card issuer. Unwarranted chargebacks may result in permanent account suspension and recovery of costs incurred.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 07 Disclaimers ── */}
          <section id="tos-disclaimer" className="sspg-section sspg-reveal" aria-labelledby="tos-disclaimer-h">
            <span className="sspg-section-num" aria-hidden="true">07</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-rose"><Scale size={18} /></div>
              <h2 id="tos-disclaimer-h" className="sspg-section-title">Disclaimers &amp; Warranties</h2>
            </header>
            <div className="sspg-prose">
              <p>To the fullest extent permitted by applicable law, ShivamStack and the Platform are provided strictly on an <strong>"as is" and "as available"</strong> basis. No representations, warranties, or conditions of any kind are made, whether express, implied, statutory, or otherwise.</p>

              <h3 className="sspg-h3">Specific Disclaimers</h3>
              <ul className="sspg-ul">
                <li><strong>No Warranty of Accuracy:</strong> While we make reasonable efforts to ensure content accuracy, ShivamStack does not warrant that articles, tutorials, code samples, or other educational content are error-free, complete, current, or fit for any particular purpose. Technology evolves rapidly — content may become outdated. Always verify critical technical information independently.</li>
                <li><strong>No Warranty of Availability:</strong> We do not guarantee uninterrupted, continuous, error-free availability of the Platform. Downtime, maintenance, technical failures, or events beyond our control may interrupt access. No liability is assumed for unavailability.</li>
                <li><strong>No Professional Advice:</strong> Content on the Platform constitutes general educational and informational material only. Nothing constitutes professional legal, financial, medical, security, tax, or business advice. You should consult qualified professionals before making significant decisions based on Platform content.</li>
                <li><strong>No Guarantee of Results:</strong> Educational content and tutorials are designed to teach concepts and skills. ShivamStack does not guarantee that following any tutorial, guide, or advice will produce specific outcomes, career results, project success, or any particular benefit.</li>
                <li><strong>Third-Party Content:</strong> Any third-party tools, services, frameworks, or technologies referenced on the Platform are provided for informational purposes only. ShivamStack neither endorses nor assumes responsibility for their accuracy, availability, security, or fitness for purpose.</li>
              </ul>

              <div className="sspg-terms-highlight">
                <p>To the maximum extent permitted by applicable law, all implied warranties — including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement — are expressly disclaimed and excluded.</p>
              </div>
            </div>
          </section>

          {/* ── 08 Liability ── */}
          <section id="tos-liability" className="sspg-section sspg-reveal" aria-labelledby="tos-liability-h">
            <span className="sspg-section-num" aria-hidden="true">08</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-indigo"><Gavel size={18} /></div>
              <h2 id="tos-liability-h" className="sspg-section-title">Limitation of Liability</h2>
            </header>
            <div className="sspg-prose">
              <p>To the maximum extent permitted by applicable law, ShivamStack, its operator (Shivam Kumar), affiliates, successors, employees, agents, and service providers shall not be liable for any damages arising from your use of, or inability to use, the Platform or its content.</p>

              <h3 className="sspg-h3">Excluded Categories of Damages</h3>
              <p>ShivamStack expressly excludes all liability for the following categories of loss or damage, regardless of the legal theory of claim (contract, tort, negligence, or otherwise) and even if advised of the possibility:</p>
              <ul className="sspg-ul">
                <li><strong>Indirect or consequential damages:</strong> Including loss of profits, business opportunities, revenue, data, goodwill, or anticipated savings.</li>
                <li><strong>Incidental damages:</strong> Including costs incurred as a collateral result of the primary issue.</li>
                <li><strong>Special or punitive damages:</strong> Including exemplary or punitive damages in any jurisdiction.</li>
                <li><strong>Data loss:</strong> Loss, corruption, or unauthorised access to your data stored on or transmitted through the Platform.</li>
                <li><strong>Third-party conduct:</strong> Any harm resulting from acts or omissions of third-party service providers, payment processors, hosting providers, or other external parties.</li>
                <li><strong>Technical failures:</strong> Errors, bugs, crashes, performance issues, or any malfunction of Platform software or infrastructure.</li>
              </ul>

              <h3 className="sspg-h3">Maximum Aggregate Liability Cap</h3>
              <p>In all cases, ShivamStack's maximum aggregate liability to you for any and all claims arising from or related to your use of the Platform shall be strictly limited to the <strong>total amount you actually paid to ShivamStack in the twelve (12) months immediately preceding the incident giving rise to the claim</strong>, or INR 500, whichever is greater. If you have made no payments to ShivamStack, our maximum liability is INR 0.</p>

              <div className="sspg-callout sspg-callout--warning">
                <AlertTriangle size={16} className="sspg-callout-icon" />
                <div>
                  <strong>Jurisdictional Note</strong>
                  <p>Some jurisdictions do not allow the exclusion or limitation of certain warranties or damages. In such jurisdictions, our liability is limited to the minimum extent permitted by applicable law. These limitations do not affect any statutory consumer rights that cannot legally be waived.</p>
                </div>
              </div>

              <h3 className="sspg-h3">Indemnification</h3>
              <p>You agree to defend, indemnify, and hold harmless ShivamStack, its operator, agents, and service providers from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising from: (a) your violation of these Terms; (b) your misuse of the Platform; (c) your infringement of any third-party right; or (d) any content you submit to the Platform.</p>
            </div>
          </section>

          {/* ── 09 Termination ── */}
          <section id="tos-termination" className="sspg-section sspg-reveal" aria-labelledby="tos-termination-h">
            <span className="sspg-section-num" aria-hidden="true">09</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-rose"><Ban size={18} /></div>
              <h2 id="tos-termination-h" className="sspg-section-title">Termination &amp; Suspension</h2>
            </header>
            <div className="sspg-prose">
              <h3 className="sspg-h3">Termination by ShivamStack</h3>
              <p>ShivamStack reserves the right, at its sole discretion, to suspend, restrict, or permanently terminate your account and access to the Platform at any time and without prior notice if:</p>
              <ul className="sspg-ul">
                <li>You violate any provision of these Terms or our Privacy Policy.</li>
                <li>You engage in fraudulent, abusive, harassing, or illegal behaviour on or in connection with the Platform.</li>
                <li>Your account appears to be involved in unauthorised access attempts, security breaches, or automated abuse.</li>
                <li>You initiate frivolous or fraudulent chargebacks or payment disputes.</li>
                <li>Continued operation of your account poses a risk to the Platform, other users, or third parties.</li>
                <li>We are required to do so by applicable law, court order, or governmental directive.</li>
              </ul>

              <h3 className="sspg-h3">Termination by User</h3>
              <p>You may request deletion of your account at any time by emailing privacy@shivamstack.com or through the account settings panel. Account deletion is permanent and irreversible. Following deletion, your personal profile data will be purged within 30 days, subject to legal retention obligations as described in our Privacy Policy. Purchased digital products licences are terminated upon account deletion, and previously downloaded files may continue to be used only in accordance with the licence terms at time of purchase.</p>

              <h3 className="sspg-h3">Effect of Termination</h3>
              <p>Upon termination for any reason: your licence to use the Platform and any digital products immediately terminates; you must cease all use of ShivamStack content, brand assets, and materials; and all outstanding obligations between the parties shall survive termination, including payment obligations, intellectual property protections, indemnification, and limitation of liability provisions.</p>

              <div className="sspg-callout sspg-callout--info">
                <Info size={16} className="sspg-callout-icon" />
                <div>
                  <strong>No Refund on Termination for Breach</strong>
                  <p>If your account is terminated due to a breach of these Terms, no refunds will be issued for unused portions of any purchases. Termination for cause does not create any financial obligation on the part of ShivamStack.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 10 Governing Law ── */}
          <section id="tos-governing" className="sspg-section sspg-reveal" aria-labelledby="tos-governing-h">
            <span className="sspg-section-num" aria-hidden="true">10</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-cyan"><Globe size={18} /></div>
              <h2 id="tos-governing-h" className="sspg-section-title">Governing Law &amp; Dispute Resolution</h2>
            </header>
            <div className="sspg-prose">
              <h3 className="sspg-h3">Governing Law</h3>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, specifically including the Information Technology Act 2000, the Information Technology (Amendment) Act 2008, the Digital Personal Data Protection Act 2023, the Consumer Protection Act 2019, the Copyright Act 1957, and any other applicable Indian federal or state legislation. Any dispute arising from these Terms will be interpreted and resolved under Indian law, without regard to conflict-of-law principles.</p>

              <h3 className="sspg-h3">Jurisdiction</h3>
              <p>You agree that any legal action, claim, or dispute arising out of or in connection with these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts located in India. By using the Platform, you irrevocably consent to the personal jurisdiction of Indian courts and waive any objection to venue or inconvenient forum.</p>

              <h3 className="sspg-h3">Dispute Resolution Process</h3>
              <ol className="sspg-numbered-list">
                <li><strong>Informal Resolution:</strong> Before initiating any formal legal proceeding, you agree to first contact ShivamStack in writing at legal@shivamstack.com describing the dispute in detail and the resolution sought. We will make a good-faith effort to resolve the matter informally within 30 days.</li>
                <li><strong>Mediation:</strong> If informal resolution fails, both parties agree to attempt mediation through a mutually agreed mediator before proceeding to litigation.</li>
                <li><strong>Litigation:</strong> If mediation is unsuccessful, either party may pursue available legal remedies through the competent courts of India.</li>
              </ol>

              <h3 className="sspg-h3">International Users</h3>
              <p>If you access the Platform from outside India, you do so voluntarily and are solely responsible for compliance with applicable local laws. ShivamStack makes no representation that the Platform or its content is appropriate or available for use in all locations. Access from jurisdictions where such use would be illegal is prohibited.</p>
            </div>
          </section>

          {/* ── 11 Changes ── */}
          <section id="tos-changes" className="sspg-section sspg-reveal" aria-labelledby="tos-changes-h">
            <span className="sspg-section-num" aria-hidden="true">11</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-purple"><RefreshCw size={18} /></div>
              <h2 id="tos-changes-h" className="sspg-section-title">Changes to These Terms</h2>
            </header>
            <div className="sspg-prose">
              <p>ShivamStack reserves the right to modify these Terms at any time to reflect changes in our business, legal requirements, or Platform features. We are committed to transparency about material changes:</p>
              <ul className="sspg-ul">
                <li>The "Last Updated" date at the top of this document will always reflect the most recent revision date.</li>
                <li>For material changes that affect your rights or obligations, registered users will receive email notification at least <strong>30 days before the changes take effect</strong>.</li>
                <li>A prominent notice will be displayed on the Platform for at least 30 days following any material revision.</li>
                <li>For minor, non-substantive updates (typographical corrections, clarifications), the revised Terms become effective immediately upon posting.</li>
              </ul>
              <p><strong>Your continued use of the Platform following the notice period constitutes your acceptance of the revised Terms.</strong> If you object to any revised terms, your exclusive remedy is to stop using the Platform and request account deletion before the effective date. We will honour such requests promptly.</p>

              <div className="sspg-terms-highlight">
                <p>We recommend reviewing these Terms periodically. Archived versions of previous Terms are available on request by emailing legal@shivamstack.com.</p>
              </div>
            </div>
          </section>

          {/* ── 12 Contact ── */}
          <section id="tos-contact" className="sspg-section sspg-reveal" aria-labelledby="tos-contact-h">
            <span className="sspg-section-num" aria-hidden="true">12</span>
            <header className="sspg-section-head">
              <div className="sspg-section-icon sspg-color-green"><Mail size={18} /></div>
              <h2 id="tos-contact-h" className="sspg-section-title">Contact Information</h2>
            </header>
            <div className="sspg-prose">
              <p>For questions, clarifications, legal notices, or any concerns regarding these Terms of Service, please contact us through the following channels. All formal legal communications must be submitted in writing.</p>
              <div className="sspg-contact-block">
                <div className="sspg-contact-row"><Mail size={15} /><a href="mailto:legal@shivamstack.com" className="sspg-inline-link">legal@shivamstack.com</a><span style={{marginLeft:8, fontSize:12, color: 'var(--sspg-text-muted)'}}>— Legal & Terms enquiries</span></div>
                <div className="sspg-contact-row"><Mail size={15} /><a href="mailto:support@shivamstack.com" className="sspg-inline-link">support@shivamstack.com</a><span style={{marginLeft:8, fontSize:12, color: 'var(--sspg-text-muted)'}}>— Purchase & product support</span></div>
                <div className="sspg-contact-row"><Globe size={15} /><a href="https://shivamstack.com" className="sspg-inline-link">shivamstack.com</a></div>
                <div className="sspg-contact-row"><Clock size={15} /><span>Legal notices responded to within 5 business days · Support within 2 business days</span></div>
              </div>
              <p>These Terms were last updated on <strong>{META.updated}</strong> and are effective from <strong>{META.effective}</strong>. They supersede all prior versions and agreements relating to the subject matter herein.</p>
            </div>
          </section>

          {/* Related */}
          <div className="sspg-related">
            <Link to="/privacy" className="sspg-related-card">
              <Shield size={22} />
              <div><strong>Privacy Policy</strong><span>How we protect your data</span></div>
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

export default TermsOfService;