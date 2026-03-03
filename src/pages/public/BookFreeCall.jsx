import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import {
  Phone, Mail, Calendar, Clock, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, Globe, MessageSquare, Zap, Star,
  Users, Shield, Layers, Code2, LayoutDashboard, ShoppingBag,
  Brain, Lock, Palette, Server, Rocket, Target, ArrowRight,
  MapPin, Linkedin, Github, Send, Check, X, Coffee, Sparkles,
  FileText, HeartPulse, Scale, Gamepad2, BarChart3, User,
  Building2, AlertCircle, ExternalLink, Smartphone, Monitor
} from 'lucide-react';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const SERVICES_OPTIONS = [
  { id: 'fullstack',  icon: Layers,         bg: 'ss-bc-bg-1', name: 'Full Stack App',      desc: 'MERN end-to-end' },
  { id: 'ecommerce',  icon: ShoppingBag,    bg: 'ss-bc-bg-6', name: 'E-Commerce Store',    desc: 'Cart, checkout, admin' },
  { id: 'dashboard',  icon: LayoutDashboard,bg: 'ss-bc-bg-3', name: 'Dashboard / Analytics',desc: 'Charts & KPIs' },
  { id: 'auth',       icon: Lock,           bg: 'ss-bc-bg-5', name: 'Auth System',          desc: 'JWT, MFA, RBAC' },
  { id: 'ai',         icon: Brain,          bg: 'ss-bc-bg-2', name: 'AI Integration',       desc: 'OpenAI, Gemini' },
  { id: 'business',   icon: Building2,      bg: 'ss-bc-bg-4', name: 'Business Website',     desc: 'Corporate & landing' },
  { id: 'api',        icon: Server,         bg: 'ss-bc-bg-1', name: 'API Development',      desc: 'REST, Node, Express' },
  { id: 'design',     icon: Palette,        bg: 'ss-bc-bg-2', name: 'UI/UX Design',         desc: 'Figma to code' },
  { id: 'other',      icon: MessageSquare,  bg: 'ss-bc-bg-3', name: 'Other / Not Sure',     desc: "Let's figure it out" },
];

const BUDGETS = [
  'Under ₹15,000', '₹15,000 – ₹40,000', '₹40,000 – ₹1,00,000', '₹1,00,000+', "Let's discuss"
];

const TIME_SLOTS = [
  { label: '10:00 AM', avail: true },
  { label: '11:00 AM', avail: true },
  { label: '12:00 PM', avail: false },
  { label: '1:00 PM',  avail: true },
  { label: '2:00 PM',  avail: true },
  { label: '3:00 PM',  avail: false },
  { label: '4:00 PM',  avail: true },
  { label: '5:00 PM',  avail: true },
  { label: '6:00 PM',  avail: true },
  { label: '7:00 PM',  avail: false },
  { label: '7:30 PM',  avail: true },
];

const WHY_CARDS = [
  { icon: Zap,          bg: 'ss-bc-bg-1', title: 'Zero Commitment',       desc: 'This call is completely free with no obligation to hire. Come with questions, leave with clarity.' },
  { icon: Clock,        bg: 'ss-bc-bg-2', title: '30-Min Deep Dive',      desc: 'A focused, structured 30-minute session — no fluff. We cover your goals, stack, and next steps.' },
  { icon: Shield,       bg: 'ss-bc-bg-3', title: 'Expert Guidance',       desc: 'Talk directly to the developer, not a salesperson. Get honest technical advice tailored to your project.' },
  { icon: FileText,     bg: 'ss-bc-bg-4', title: 'Free Written Estimate', desc: 'After the call you receive a written scope estimate and timeline within 24 hours.' },
  { icon: Globe,        bg: 'ss-bc-bg-5', title: 'Available Worldwide',   desc: 'Based in India (IST), I regularly work with clients across US, UK, EU, and the Middle East.' },
  { icon: Coffee,       bg: 'ss-bc-bg-6', title: 'Relaxed & Friendly',    desc: 'No pressure, no jargon. Just a genuine conversation about your vision and how I can help.' },
];

const TOPICS = [
  { icon: Code2,          bg: 'ss-bc-bg-1', name: 'Project Scoping',          sub: 'Requirements & architecture' },
  { icon: BarChart3,      bg: 'ss-bc-bg-3', name: 'Tech Stack Advice',         sub: 'Best tools for your use case' },
  { icon: Layers,         bg: 'ss-bc-bg-2', name: 'MERN Development',          sub: 'Full-stack planning' },
  { icon: Brain,          bg: 'ss-bc-bg-6', name: 'AI Feature Integration',    sub: 'OpenAI, Gemini, vector DBs' },
  { icon: ShoppingBag,    bg: 'ss-bc-bg-4', name: 'E-Commerce Setup',          sub: 'Cart, payments, catalog' },
  { icon: Lock,           bg: 'ss-bc-bg-5', name: 'Auth & Security',           sub: 'JWT, OAuth2, MFA' },
  { icon: LayoutDashboard,bg: 'ss-bc-bg-3', name: 'Dashboard / Analytics',     sub: 'Charts, KPIs, real-time data' },
  { icon: Rocket,         bg: 'ss-bc-bg-1', name: 'Deployment & DevOps',       sub: 'CI/CD, Netlify, Render' },
  { icon: Palette,        bg: 'ss-bc-bg-2', name: 'UI/UX Design',              sub: 'Figma prototypes to code' },
  { icon: Server,         bg: 'ss-bc-bg-6', name: 'API Architecture',          sub: 'REST design & documentation' },
  { icon: Monitor,        bg: 'ss-bc-bg-4', name: 'Performance & SEO',         sub: 'Core Web Vitals, Lighthouse' },
  { icon: Target,         bg: 'ss-bc-bg-5', name: 'MVP Strategy',              sub: 'Fastest path to launch' },
];

const TESTIMONIALS_MINI = [
  { name: 'Ananya S.', role: 'Startup Founder', stars: 5, text: 'The discovery call alone gave me a full roadmap. Shivam is incredibly thorough and honest about timelines — exactly what I needed.' },
  { name: 'Rahul V.',  role: 'FinTech PM',       stars: 5, text: 'I had 3 calls with different freelancers. Shivam was the only one who understood the full technical scope immediately. Hired him on the spot.' },
  { name: 'Priya P.',  role: 'Clinic Admin',     stars: 5, text: 'Booked a free call just to ask a few questions and ended up with a complete project plan. No selling, just pure expertise.' },
  { name: 'Vikram S.', role: 'Legal Partner',    stars: 5, text: 'Very professional and structured. The call summary email he sent afterwards was detailed and helped us align our team internally.' },
  { name: 'Sneha G.',  role: 'E-Commerce Owner', stars: 5, text: 'I was nervous about the budget conversation but Shivam was totally upfront and suggested a phased approach that worked perfectly for us.' },
  { name: 'Arjun N.',  role: 'Tech Blogger',     stars: 5, text: 'Even though we didn\'t end up working together due to budget, Shivam sent me resources and references for free. Incredible attitude.' },
];

const FAQS = [
  { q: 'Is the discovery call really free?',           a: 'Yes — 100% free, no credit card, no obligation. The call is purely to understand your project and see if we are a good fit. You get value regardless of whether you hire me.' },
  { q: 'How long is the call?',                         a: 'The standard call is 30 minutes. If your project is complex and requires deeper discussion, we can extend it or schedule a follow-up session at no charge.' },
  { q: 'What happens after the call?',                  a: 'Within 24 hours you receive a written project summary, estimated timeline, and a rough budget range based on your requirements. This is yours to keep — no strings attached.' },
  { q: 'Do I need to prepare anything?',                a: 'No formal preparation needed. Just have a rough idea of what you want to build and your goals. If you have references, mockups, or a brief, bring those — but they are not required.' },
  { q: 'What timezone are you available in?',           a: 'I am based in India (IST, UTC+5:30) and take calls Monday to Saturday, 10 AM to 8 PM IST. For international clients I can accommodate early mornings and late evenings.' },
  { q: 'Can I reschedule or cancel?',                   a: 'Absolutely. Just send me an email at least 2 hours before the scheduled call and we will find a new slot that works for both of us — no questions asked.' },
  { q: 'Do you take on international clients?',         a: 'Yes! I regularly work with clients in the US, UK, UAE, and across Europe. Communication is in English via Google Meet or Zoom, and payments are supported internationally.' },
  { q: 'What if I only have a rough idea?',             a: 'That is perfectly fine — actually ideal! Many of my best projects started as just a rough concept. Part of the call is helping you refine the idea into a buildable plan.' },
];

/* Generate next 14 days for calendar */
function generateDays() {
  const days = [];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      isSunday: d.getDay() === 0,
      dateObj: d,
    });
  }
  return days;
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ss-bookcall-faq-item ${open ? 'ss-bookcall-faq-open' : ''}`}>
      <button className="ss-bookcall-faq-q" onClick={() => setOpen(o => !o)}>
        {q} <ChevronDown size={17} className="ss-bookcall-faq-chevron" />
      </button>
      <div className="ss-bookcall-faq-a">{a}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
const BookCall = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [step, setStep] = useState(1);           // 1–4
  const TOTAL_STEPS = 4;

  /* Form state */
  const [selectedService, setSelectedService] = useState('');
  const [selectedDay, setSelectedDay]         = useState(null);
  const [selectedSlot, setSelectedSlot]       = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    budget: '', message: '', hearAbout: '',
  });

  const days = generateDays();

  /* Intersection observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('ss-bookcall-visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.ss-bookcall-fade-in').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [step]);

  const handleFormChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validateStep = async () => {
    const { default: Swal } = await import('sweetalert2');
    const swalBase = { background: isDarkMode ? '#131127' : '#fff', color: isDarkMode ? '#f0eeff' : '#0d0b1f', confirmButtonColor: '#6d63ff' };
    if (step === 1 && !selectedService) {
      Swal.fire({ icon: 'warning', title: 'Select a Service', text: 'Please choose the type of project you need help with.', ...swalBase });
      return false;
    }
    if (step === 2 && (!selectedDay || !selectedSlot)) {
      Swal.fire({ icon: 'warning', title: 'Pick Date & Time', text: 'Please select a preferred date and time slot.', ...swalBase });
      return false;
    }
    if (step === 3) {
      if (!form.name.trim() || !form.email.trim()) {
        Swal.fire({ icon: 'warning', title: 'Fill in Details', text: 'Name and email are required to confirm your booking.', ...swalBase });
        return false;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      if (!emailOk) {
        Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.', ...swalBase });
        return false;
      }
    }
    return true;
  };

  const nextStep = async () => {
    if (await validateStep()) setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    const { default: Swal } = await import('sweetalert2');
    const svc = SERVICES_OPTIONS.find(s => s.id === selectedService);
    Swal.fire({
      icon: 'success',
      title: '🎉 Call Booked!',
      html: `
        <p style="color:${isDarkMode ? '#b8b2e0' : '#3d3a5c'};line-height:1.7;font-size:15px;">
          <strong style="color:${isDarkMode ? '#f0eeff' : '#0d0b1f'}">
            ${selectedDay?.dayName}, ${selectedDay?.month} ${selectedDay?.dayNum} at ${selectedSlot}
          </strong><br/>
          You'll receive a confirmation email at <strong>${form.email}</strong> within a few minutes.<br/><br/>
          Looking forward to speaking with you! 🚀
        </p>
      `,
      confirmButtonText: 'Awesome!',
      background: isDarkMode ? '#131127' : '#fff',
      color: isDarkMode ? '#f0eeff' : '#0d0b1f',
      confirmButtonColor: '#6d63ff',
    });
    // Reset
    setStep(1); setSelectedService(''); setSelectedDay(null);
    setSelectedSlot(''); setForm({ name:'',email:'',phone:'',company:'',budget:'',message:'',hearAbout:'' });
  };

  const stepMeta = [
    { num: '01', label: 'Service',     sublabel: 'What do you need?' },
    { num: '02', label: 'Date & Time', sublabel: 'Pick a slot' },
    { num: '03', label: 'Your Details',sublabel: 'Tell me about you' },
    { num: '04', label: 'Confirm',     sublabel: 'Review & book' },
  ];

  const svcObj = SERVICES_OPTIONS.find(s => s.id === selectedService);

  return (
    <div className={`ss-bookcall-root ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ══════════ HERO ══════════ */}
      <section className="ss-bookcall-hero">
        <div className="ss-bookcall-hero-mesh" />
        <div className="ss-bookcall-hero-grid" />
        <div className="ss-bookcall-hero-orb ss-bookcall-hero-orb-1" />
        <div className="ss-bookcall-hero-orb ss-bookcall-hero-orb-2" />
        <div className="ss-bookcall-hero-orb ss-bookcall-hero-orb-3" />

        <div className="ss-bookcall-hero-inner">
          <div className="ss-bookcall-hero-badge">
            <span className="ss-bookcall-hero-badge-pulse" />
            Free · No Commitment · 30 Minutes
          </div>
          <h1 className="ss-bookcall-hero-title">
            Book a <span className="ss-bookcall-hero-title-grad">Free Call</span>
          </h1>
          <p className="ss-bookcall-hero-desc">
            Got a project idea? Let's talk. In 30 minutes I'll help you define your scope, choose the right tech stack, and give you a realistic timeline and budget estimate — completely free.
          </p>
          <div className="ss-bookcall-hero-pills">
            {['30-Min Session', 'Zero Commitment', 'Written Estimate After', 'Available Worldwide', 'Direct with Dev', 'Instant Confirmation'].map(p => (
              <span key={p} className="ss-bookcall-hero-pill">
                <Check size={12} /> {p}
              </span>
            ))}
          </div>
        </div>
        <div className="ss-bookcall-hero-scroll">
          <div className="ss-bookcall-hero-scroll-line" />
          scroll
        </div>
      </section>

      {/* ══════════ MAIN BOOKING ══════════ */}
      <section className="ss-bookcall-section">
        <div className="ss-bookcall-container">
          <div className="ss-bookcall-main-layout">

            {/* ── LEFT INFO COLUMN ── */}
            <div className="ss-bookcall-info-col ss-bookcall-fade-in">
              <div className="ss-bookcall-avail-pill">
                <span className="ss-bookcall-avail-dot" />
                Open for bookings — March 2026
              </div>

              <div className="ss-bookcall-info-card">
                <h2 className="ss-bookcall-info-card-title">What Happens on the Call?</h2>
                <p className="ss-bookcall-info-card-desc">
                  A focused, agenda-driven 30-minute video call (Google Meet or Zoom) with me — the developer who will actually build your project.
                </p>
                <ul className="ss-bookcall-expect-list">
                  {[
                    { icon: Target,       bg: 'ss-bc-bg-1', title: 'Understand Your Vision',   desc: 'We map out your goals, audience, and what success looks like for your project.' },
                    { icon: Layers,       bg: 'ss-bc-bg-2', title: 'Define the Scope',          desc: 'We break down features into must-haves and nice-to-haves to build a clear specification.' },
                    { icon: Code2,        bg: 'ss-bc-bg-3', title: 'Tech Stack Recommendation', desc: 'I suggest the best technologies and architecture based on your use case and scale.' },
                    { icon: FileText,     bg: 'ss-bc-bg-4', title: 'Timeline & Budget Outline', desc: 'You leave with a realistic delivery timeline and ballpark budget range.' },
                    { icon: CheckCircle2, bg: 'ss-bc-bg-5', title: 'Written Follow-Up',         desc: 'A summary email with the call notes and a formal proposal arrives within 24 hours.' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="ss-bookcall-expect-item">
                        <div className={`ss-bookcall-expect-icon ${item.bg}`}><Icon size={17} /></div>
                        <div>
                          <div className="ss-bookcall-expect-text-title">{item.title}</div>
                          <div className="ss-bookcall-expect-text-desc">{item.desc}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Timezone */}
              <div className="ss-bookcall-tz-card">
                <div className="ss-bookcall-tz-icon"><Globe size={18} /></div>
                <div>
                  <div className="ss-bookcall-tz-title">🕐 Timezone: IST (UTC+5:30)</div>
                  <div className="ss-bookcall-tz-desc">
                    Mon–Sat · 10:00 AM – 8:00 PM IST.<br />
                    International clients: early morning or late evening slots available on request.
                  </div>
                </div>
              </div>

              {/* Quick contact */}
              <div className="ss-bookcall-contact-quick">
                {[
                  { icon: Mail,    bg: 'ss-bc-bg-1', label: 'Prefer Email?',   value: 'shivam@shivamstack.dev',    href: 'mailto:shivam@shivamstack.dev' },
                  { icon: Linkedin,bg: 'ss-bc-bg-5', label: 'Connect',         value: 'linkedin.com/in/shivamstack', href: 'https://linkedin.com' },
                  { icon: Github,  bg: null,         label: 'See the Code',    value: 'github.com/shivamstack',     href: 'https://github.com' },
                  { icon: MapPin,  bg: 'ss-bc-bg-3', label: 'Based In',        value: 'India · Available Worldwide', href: null },
                ].map((c, i) => {
                  const Icon = c.icon;
                  const Tag = c.href ? 'a' : 'div';
                  return (
                    <Tag key={i} className="ss-bookcall-contact-quick-item" href={c.href || undefined} target={c.href ? '_blank' : undefined} rel="noopener noreferrer">
                      <div className={`ss-bookcall-contact-quick-icon ${c.bg || ''}`} style={!c.bg ? { background: 'var(--ss-bc-border)', color: 'var(--ss-bc-text-primary)' } : {}}>
                        <Icon size={17} color={c.bg ? '#fff' : undefined} />
                      </div>
                      <div>
                        <div className="ss-bookcall-contact-quick-label">{c.label}</div>
                        <div className="ss-bookcall-contact-quick-value">{c.value}</div>
                      </div>
                      {c.href && <ArrowRight size={15} className="ss-bookcall-contact-quick-arrow" />}
                    </Tag>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT FORM PANEL ── */}
            <div className="ss-bookcall-form-panel ss-bookcall-fade-in ss-bookcall-fade-delay-2">

              {/* Steps bar */}
              <div className="ss-bookcall-steps-bar">
                {stepMeta.map((s, i) => (
                  <>
                    <div key={s.num} className={`ss-bookcall-step-item ${step === i+1 ? 'ss-bookcall-step-active' : ''} ${step > i+1 ? 'ss-bookcall-step-done' : ''}`}>
                      <div className="ss-bookcall-step-num">
                        {step > i+1 ? <Check size={14} /> : s.num}
                      </div>
                      <div className="ss-bookcall-step-info">
                        <div className="ss-bookcall-step-label">{s.label}</div>
                        <div className="ss-bookcall-step-sublabel">{s.sublabel}</div>
                      </div>
                    </div>
                    {i < stepMeta.length - 1 && (
                      <div key={`conn-${i}`} className={`ss-bookcall-step-connector ${step > i+1 ? 'ss-bookcall-step-done' : ''}`} />
                    )}
                  </>
                ))}
              </div>

              {/* Form body */}
              <div className="ss-bookcall-form-body">

                {/* ── STEP 1: Service ── */}
                {step === 1 && (
                  <>
                    <h2 className="ss-bookcall-form-step-title">What do you need help with?</h2>
                    <p className="ss-bookcall-form-step-desc">
                      Select the type of project or service you'd like to discuss. This helps me prepare the right questions and suggestions before the call.
                    </p>
                    <div className="ss-bookcall-service-grid">
                      {SERVICES_OPTIONS.map(svc => {
                        const Icon = svc.icon;
                        const isSelected = selectedService === svc.id;
                        return (
                          <div key={svc.id} className={`ss-bookcall-service-option ${isSelected ? 'ss-bookcall-service-selected' : ''}`} onClick={() => setSelectedService(svc.id)}>
                            <div style={{ display: 'flex', width: '100%', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                              <div className={`ss-bookcall-service-opt-icon ${svc.bg}`}><Icon size={18} /></div>
                              <div className="ss-bookcall-service-selected-check"><CheckCircle2 size={16} /></div>
                            </div>
                            <div className="ss-bookcall-service-opt-name">{svc.name}</div>
                            <div className="ss-bookcall-service-opt-desc">{svc.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="ss-bookcall-form-group" style={{ marginTop: '20px' }}>
                      <label className="ss-bookcall-form-label">Briefly describe your project <span style={{ color: 'var(--ss-bc-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                      <textarea name="message" value={form.message} onChange={handleFormChange} className="ss-bookcall-form-textarea" placeholder="e.g. I need a job board platform with employer/candidate login, job posting, and application tracking..." />
                    </div>
                    <div className="ss-bookcall-form-nav">
                      <div className="ss-bookcall-form-nav-left">
                        <span style={{ fontSize: '13px', color: 'var(--ss-bc-text-muted)', fontFamily: 'var(--ss-bc-font-mono)' }}>Step 1 of {TOTAL_STEPS}</span>
                      </div>
                      <button className="ss-bookcall-btn-primary" onClick={nextStep}>
                        Next: Pick a Date <ChevronRight size={16} />
                      </button>
                    </div>
                  </>
                )}

                {/* ── STEP 2: Date & Time ── */}
                {step === 2 && (
                  <>
                    <h2 className="ss-bookcall-form-step-title">Pick a date & time</h2>
                    <p className="ss-bookcall-form-step-desc">
                      All times shown in IST (India Standard Time, UTC+5:30). Slots marked as unavailable are already booked.
                    </p>

                    {/* Day picker */}
                    <div className="ss-bookcall-form-group">
                      <label className="ss-bookcall-form-label"><Calendar size={13} /> Choose a Day <span className="ss-bookcall-form-label-required">*</span></label>
                      <div className="ss-bookcall-day-grid">
                        {days.map((d, i) => (
                          <button
                            key={i}
                            className={`ss-bookcall-day-btn ${d.isSunday ? 'ss-bookcall-day-past' : ''} ${selectedDay?.dayNum === d.dayNum && selectedDay?.month === d.month ? 'ss-bookcall-day-selected' : ''}`}
                            onClick={() => !d.isSunday && setSelectedDay(d)}
                            title={d.isSunday ? 'Closed on Sundays' : ''}
                          >
                            <span className="ss-bookcall-day-name">{d.dayName}</span>
                            <span className="ss-bookcall-day-num">{d.dayNum}</span>
                          </button>
                        ))}
                      </div>
                      {selectedDay && <p style={{ fontSize: '12px', color: 'var(--ss-bc-accent-3)', marginTop: '8px', fontFamily: 'var(--ss-bc-font-mono)' }}>✓ Selected: {selectedDay.dayName}, {selectedDay.month} {selectedDay.dayNum}</p>}
                    </div>

                    {/* Time slots */}
                    <div className="ss-bookcall-form-group">
                      <label className="ss-bookcall-form-label"><Clock size={13} /> Choose a Time <span className="ss-bookcall-form-label-required">*</span></label>
                      <div className="ss-bookcall-timeslot-grid">
                        {TIME_SLOTS.map(slot => (
                          <button
                            key={slot.label}
                            className={`ss-bookcall-timeslot-btn ${!slot.avail ? 'ss-bookcall-timeslot-disabled' : ''} ${selectedSlot === slot.label ? 'ss-bookcall-timeslot-selected' : ''}`}
                            onClick={() => slot.avail && setSelectedSlot(slot.label)}
                          >
                            {slot.label}
                            {!slot.avail && <><br /><span style={{ fontSize: '10px', opacity: 0.7 }}>Booked</span></>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Call platform */}
                    <div className="ss-bookcall-form-group">
                      <label className="ss-bookcall-form-label"><Monitor size={13} /> Preferred Platform</label>
                      <select name="platform" className="ss-bookcall-form-select" defaultValue="">
                        <option value="" disabled>Select platform...</option>
                        <option>Google Meet</option>
                        <option>Zoom</option>
                        <option>Microsoft Teams</option>
                        <option>WhatsApp Video</option>
                        <option>No preference</option>
                      </select>
                    </div>

                    <div className="ss-bookcall-form-nav">
                      <button className="ss-bookcall-btn-ghost" onClick={prevStep}><ChevronLeft size={15} /> Back</button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--ss-bc-text-muted)', fontFamily: 'var(--ss-bc-font-mono)' }}>Step 2 of {TOTAL_STEPS}</span>
                        <button className="ss-bookcall-btn-primary" onClick={nextStep}>
                          Next: Your Details <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── STEP 3: Contact Details ── */}
                {step === 3 && (
                  <>
                    <h2 className="ss-bookcall-form-step-title">Tell me about you</h2>
                    <p className="ss-bookcall-form-step-desc">
                      Just a few details so I can prepare for our call and send you a confirmation email.
                    </p>

                    <div className="ss-bookcall-form-row">
                      <div className="ss-bookcall-form-group">
                        <label className="ss-bookcall-form-label"><User size={12} /> Your Name <span className="ss-bookcall-form-label-required">*</span></label>
                        <div className="ss-bookcall-input-wrap">
                          <User size={14} className="ss-bookcall-input-icon" />
                          <input name="name" value={form.name} onChange={handleFormChange} className="ss-bookcall-form-input ss-bookcall-input-has-icon" placeholder="Rahul Sharma" />
                        </div>
                      </div>
                      <div className="ss-bookcall-form-group">
                        <label className="ss-bookcall-form-label"><Mail size={12} /> Email Address <span className="ss-bookcall-form-label-required">*</span></label>
                        <div className="ss-bookcall-input-wrap">
                          <Mail size={14} className="ss-bookcall-input-icon" />
                          <input name="email" type="email" value={form.email} onChange={handleFormChange} className="ss-bookcall-form-input ss-bookcall-input-has-icon" placeholder="rahul@company.com" />
                        </div>
                      </div>
                    </div>

                    <div className="ss-bookcall-form-row">
                      <div className="ss-bookcall-form-group">
                        <label className="ss-bookcall-form-label"><Phone size={12} /> Phone / WhatsApp <span style={{ color: 'var(--ss-bc-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                        <div className="ss-bookcall-input-wrap">
                          <Phone size={14} className="ss-bookcall-input-icon" />
                          <input name="phone" value={form.phone} onChange={handleFormChange} className="ss-bookcall-form-input ss-bookcall-input-has-icon" placeholder="+91 98765 43210" />
                        </div>
                      </div>
                      <div className="ss-bookcall-form-group">
                        <label className="ss-bookcall-form-label"><Building2 size={12} /> Company / Project Name <span style={{ color: 'var(--ss-bc-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                        <div className="ss-bookcall-input-wrap">
                          <Building2 size={14} className="ss-bookcall-input-icon" />
                          <input name="company" value={form.company} onChange={handleFormChange} className="ss-bookcall-form-input ss-bookcall-input-has-icon" placeholder="Acme Startup" />
                        </div>
                      </div>
                    </div>

                    <div className="ss-bookcall-form-group">
                      <label className="ss-bookcall-form-label">Estimated Budget</label>
                      <select name="budget" value={form.budget} onChange={handleFormChange} className="ss-bookcall-form-select">
                        <option value="">Select a range...</option>
                        {BUDGETS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>

                    <div className="ss-bookcall-form-group">
                      <label className="ss-bookcall-form-label">How did you hear about me?</label>
                      <select name="hearAbout" value={form.hearAbout} onChange={handleFormChange} className="ss-bookcall-form-select">
                        <option value="">Select one...</option>
                        <option>Google Search</option>
                        <option>LinkedIn</option>
                        <option>GitHub</option>
                        <option>Word of Mouth / Referral</option>
                        <option>Social Media</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="ss-bookcall-form-group">
                      <label className="ss-bookcall-form-label">Anything else you'd like me to know? <span style={{ color: 'var(--ss-bc-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                      <textarea name="message" value={form.message} onChange={handleFormChange} className="ss-bookcall-form-textarea" placeholder="Share any extra context, references, links, or specific questions you want answered on the call..." />
                    </div>

                    <div className="ss-bookcall-form-nav">
                      <button className="ss-bookcall-btn-ghost" onClick={prevStep}><ChevronLeft size={15} /> Back</button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--ss-bc-text-muted)', fontFamily: 'var(--ss-bc-font-mono)' }}>Step 3 of {TOTAL_STEPS}</span>
                        <button className="ss-bookcall-btn-primary" onClick={nextStep}>
                          Review Booking <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── STEP 4: Confirm ── */}
                {step === 4 && (
                  <>
                    <h2 className="ss-bookcall-form-step-title">Review & Confirm</h2>
                    <p className="ss-bookcall-form-step-desc">
                      Double-check your booking details. Everything look good? Hit Confirm and I'll send a calendar invite to your email.
                    </p>

                    <div className="ss-bookcall-summary-grid">
                      {[
                        { label: 'Service Needed',   value: svcObj?.name || '—' },
                        { label: 'Selected Date',     value: selectedDay ? `${selectedDay.dayName}, ${selectedDay.month} ${selectedDay.dayNum}` : '—' },
                        { label: 'Time Slot',         value: selectedSlot || '—' },
                        { label: 'Timezone',          value: 'IST (UTC+5:30)' },
                        { label: 'Your Name',         value: form.name || '—' },
                        { label: 'Email',             value: form.email || '—' },
                        { label: 'Phone',             value: form.phone || 'Not provided' },
                        { label: 'Budget Range',      value: form.budget || 'Not specified' },
                      ].map(item => (
                        <div key={item.label} className="ss-bookcall-summary-item">
                          <div className="ss-bookcall-summary-label">{item.label}</div>
                          <div className="ss-bookcall-summary-value">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {form.message && (
                      <div className="ss-bookcall-summary-item" style={{ marginBottom: '14px' }}>
                        <div className="ss-bookcall-summary-label">Notes for the call</div>
                        <div className="ss-bookcall-summary-value" style={{ fontWeight: 400, fontSize: '14px', lineHeight: 1.65 }}>{form.message}</div>
                      </div>
                    )}

                    <div className="ss-bookcall-summary-note">
                      <Sparkles size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--ss-bc-accent)' }} />
                      <strong>What happens next:</strong> After confirming, you'll receive a <strong>calendar invite</strong> and <strong>Google Meet link</strong> at {form.email || 'your email'} within 15 minutes. I'll also send a brief pre-call questionnaire to make the most of our 30 minutes together.
                    </div>

                    <div className="ss-bookcall-form-nav">
                      <button className="ss-bookcall-btn-ghost" onClick={prevStep}><ChevronLeft size={15} /> Edit Details</button>
                      <button className="ss-bookcall-btn-primary" onClick={handleConfirm} style={{ padding: '14px 36px' }}>
                        <Calendar size={16} /> Confirm Booking
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ WHY BOOK ══════════ */}
      <section className="ss-bookcall-section ss-bookcall-section-alt">
        <div className="ss-bookcall-container">
          <div className="ss-bookcall-section-header">
            <div className="ss-bookcall-section-label"><div className="ss-bookcall-section-label-line" />Why Book a Call</div>
            <h2 className="ss-bookcall-section-heading">6 Reasons to <span className="ss-bookcall-section-heading-grad">Talk First</span></h2>
            <p className="ss-bookcall-section-sub">Most projects fail because of miscommunication at the start. This call fixes that — before a single line of code is written.</p>
          </div>
          <div className="ss-bookcall-why-grid ss-bookcall-fade-in">
            {WHY_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="ss-bookcall-why-card">
                  <div className={`ss-bookcall-why-icon ${card.bg}`}><Icon size={24} /></div>
                  <h3 className="ss-bookcall-why-title">{card.title}</h3>
                  <p className="ss-bookcall-why-desc">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ TOPICS ══════════ */}
      <section className="ss-bookcall-section">
        <div className="ss-bookcall-container">
          <div className="ss-bookcall-section-header">
            <div className="ss-bookcall-section-label"><div className="ss-bookcall-section-label-line" />Call Agenda</div>
            <h2 className="ss-bookcall-section-heading">What We Can <span className="ss-bookcall-section-heading-grad">Discuss</span></h2>
            <p className="ss-bookcall-section-sub">From greenfield apps to existing codebases, and from MVP strategies to complex integrations — bring any topic to the table.</p>
          </div>
          <div className="ss-bookcall-topics-grid ss-bookcall-fade-in">
            {TOPICS.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="ss-bookcall-topic-card">
                  <div className={`ss-bookcall-topic-icon ${t.bg}`}><Icon size={18} /></div>
                  <div>
                    <div className="ss-bookcall-topic-name">{t.name}</div>
                    <div className="ss-bookcall-topic-sub">{t.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="ss-bookcall-section ss-bookcall-section-alt">
        <div className="ss-bookcall-container">
          <div className="ss-bookcall-section-header">
            <div className="ss-bookcall-section-label"><div className="ss-bookcall-section-label-line" />Client Feedback</div>
            <h2 className="ss-bookcall-section-heading">What Clients Say <span className="ss-bookcall-section-heading-grad">About the Call</span></h2>
            <p className="ss-bookcall-section-sub">Real words from real clients — many of whom started with just a free call and left with a full project plan.</p>
          </div>
          <div className="ss-bookcall-mini-testimonials ss-bookcall-fade-in">
            {TESTIMONIALS_MINI.map((t, i) => (
              <div key={i} className="ss-bookcall-mini-testi-card">
                <div className="ss-bookcall-mini-testi-stars">
                  {Array(t.stars).fill(0).map((_, j) => <Star key={j} size={13} fill="currentColor" />)}
                </div>
                <p className="ss-bookcall-mini-testi-text">"{t.text}"</p>
                <div className="ss-bookcall-mini-testi-author">
                  <div className="ss-bookcall-mini-testi-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="ss-bookcall-mini-testi-name">{t.name}</div>
                    <div className="ss-bookcall-mini-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="ss-bookcall-section">
        <div className="ss-bookcall-container">
          <div className="ss-bookcall-section-header" style={{ textAlign: 'center' }}>
            <div className="ss-bookcall-section-label" style={{ justifyContent: 'center' }}>
              <div className="ss-bookcall-section-label-line" />FAQs<div className="ss-bookcall-section-label-line" />
            </div>
            <h2 className="ss-bookcall-section-heading">Questions About <span className="ss-bookcall-section-heading-grad">the Call</span></h2>
            <p className="ss-bookcall-section-sub" style={{ margin: '0 auto' }}>Everything you need to know before booking your free session.</p>
          </div>
          <div className="ss-bookcall-faq-list ss-bookcall-fade-in">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section className="ss-bookcall-section ss-bookcall-section-alt">
        <div className="ss-bookcall-cta-banner">
          <div className="ss-bookcall-cta-mesh" />
          <div className="ss-bookcall-cta-grid" />
          <div className="ss-bookcall-cta-inner">
            <div className="ss-bookcall-avail-pill" style={{ margin: '0 auto 22px' }}>
              <span className="ss-bookcall-avail-dot" />
              Slots available this week
            </div>
            <h2 className="ss-bookcall-cta-title">Still Thinking?<br />Your Idea Won't Build Itself.</h2>
            <p className="ss-bookcall-cta-sub">
              30 minutes. Zero cost. Full clarity. Book now and walk away with a concrete plan for your project — whether you hire me or not.
            </p>
            <div className="ss-bookcall-cta-row">
              <button className="ss-bookcall-btn-primary" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(1); }}>
                <Calendar size={16} /> Book Your Free Call
              </button>
              <a href="mailto:shivam@shivamstack.dev" className="ss-bookcall-btn-outline-hero">
                <Mail size={16} /> Email Instead
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BookCall;