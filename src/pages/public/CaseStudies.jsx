import { useState, useEffect, useContext, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Plus, Edit3, Trash2, Eye, X, Save, ChevronDown, ChevronUp,
  Layers, Target, TrendingUp, Clock, Star, ExternalLink, Github,
  Search, Filter, Award, BarChart2, Zap, Users, Code2, Globe,
  ArrowRight, BookOpen, Lightbulb, CheckCircle2, AlertCircle,
  Calendar, Tag, ImagePlus, MoreVertical, RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";

const API_BASE ="/api/public";

const TECH_COLORS = {
  React: "#61DAFB", MongoDB: "#47A248", "Node.js": "#339933",
  "Express.js": "#000000", "React Vite": "#646CFF", "REST API": "#FF6B35",
  HTML5: "#E34F26", CSS3: "#1572B6", JavaScript: "#F7DF1E",
  "MERN Stack": "#00D4AA", "React.js": "#61DAFB", TypeScript: "#3178C6",
  jsPDF: "#CC0000", "Socket.io": "#010101", JWT: "#FB015B",
  Redis: "#DC382D", Nginx: "#009639", Docker: "#2496ED",
};

const STATUS_META = {
  completed:   { label: "Completed",   color: "#00C896", icon: CheckCircle2 },
  "in-progress":{ label: "In Progress", color: "#F59E0B", icon: RefreshCw },
  planned:     { label: "Planned",     color: "#8B5CF6", icon: Clock },
  featured:    { label: "Featured",    color: "#EC4899", icon: Star },
};

const EMPTY_FORM = {
  title: "", slug: "", tagline: "", description: "", client: "",
  challenge: "", solution: "", outcome: "", lessonsLearned: "",
  startDate: "", endDate: "", status: "planned",
  mainImage: "", images: [],
  demoUrl: "", repoUrl: "", clientUrl: "",
  tags: [], technologies: [],
  isFeatured: false, priority: 0,
  metaTitle: "", metaDescription: "", metaKeywords: [],
  isPublished: true,
};

const SEED_DATA = [
  {
    _id: "cs_001", title: "Authnester — Full-Stack Auth SaaS",
    slug: "authnester-auth-saas",
    tagline: "Production-ready authentication infrastructure for MERN developers",
    status: "completed", isFeatured: true,
    technologies: ["MongoDB", "Express.js", "React Vite", "Node.js", "JWT", "Redis"],
    tags: ["SaaS", "Authentication", "Security", "API"],
    description: "Authnester is a production-ready SaaS authentication platform built for MERN stack developers to seamlessly integrate secure, scalable auth into their applications. It handles OAuth2, magic links, MFA, session management and more — out of the box.",
    challenge: "Most developers lose days re-implementing authentication logic across projects. Existing solutions are either too opinionated, too expensive, or require heavy vendor lock-in. The challenge was to create a drop-in auth layer that was flexible, self-hostable, and production-hardened from day one.",
    solution: "Built a micro-SaaS platform exposing RESTful auth APIs with SDKs. Designed a multi-tenant architecture with per-project API keys, rate limiting via Redis, JWT refresh-token rotation, and an admin dashboard for user management. Documented every endpoint with Postman collections.",
    outcome: "6 active integrations by beta testers, zero reported auth vulnerabilities in 3 months of production use. Dashboard load time under 1.2s. Handled 10k+ auth requests in stress testing without degradation.",
    lessonsLearned: "Redis-backed rate limiting must be tenant-scoped, not global — learned this after a noisy-neighbour issue in staging. Also, always provide a sandbox mode for developers to test without affecting production quotas.",
    startDate: "2024-01-10", endDate: "2024-05-20",
    mainImage: "", images: [],
    demoUrl: "https://authnester.dev", repoUrl: "https://github.com/shivam/authnester",
    views: 6, shares: 0,
    metaTitle: "Authnester Case Study | Shivam Web Stack",
    metaDescription: "How Authnester was built as a production SaaS auth platform for MERN developers.",
    metaKeywords: ["authentication", "SaaS", "MERN", "JWT", "Node.js"],
    isPublished: true, createdAt: "2024-05-20T10:00:00Z",
  },
  {
    _id: "cs_002", title: "Instant Hooks — Short Video Platform",
    slug: "instant-hooks-video-platform",
    tagline: "TikTok-inspired full-stack video sharing for the modern web",
    status: "completed", isFeatured: false,
    technologies: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.io"],
    tags: ["Social Media", "Video", "Real-time", "Full-Stack"],
    description: "Instant Hooks is a full-stack short video sharing platform inspired by modern social media apps, designed for mobile-first consumption. Features include infinite scroll, real-time likes/comments via WebSockets, video compression pipeline, and creator analytics.",
    challenge: "Streaming video efficiently while keeping infrastructure costs low. Video uploads and transcoding are notoriously expensive at scale. The UI also needed to feel as smooth as native mobile apps despite running in a browser.",
    solution: "Used chunked uploads to Node.js with FFmpeg-based server-side compression. Stored processed videos in Cloudinary with adaptive bitrate URLs. Socket.io powered live like/comment counters. Implemented virtual scrolling to keep DOM nodes lean during infinite feed.",
    outcome: "Average video load time: 0.8s on 4G. 4 active creators in beta posted 40+ videos. Lighthouse performance score: 91. Zero memory leaks detected in 6-hour soak test.",
    lessonsLearned: "FFmpeg transcode jobs should always run in worker threads or a job queue — blocking the main event loop crashes the server. Bull Queue + Redis saved us here.",
    startDate: "2023-08-01", endDate: "2024-02-15",
    mainImage: "", images: [],
    demoUrl: "https://instanthooks.app", repoUrl: "https://github.com/shivam/instant-hooks",
    views: 4, shares: 0,
    metaTitle: "Instant Hooks Case Study | Shivam Web Stack",
    metaDescription: "Building a TikTok-inspired video platform with MERN stack.",
    metaKeywords: ["video platform", "MERN", "Socket.io", "real-time"],
    isPublished: true, createdAt: "2024-02-15T10:00:00Z",
  },
  {
    _id: "cs_003", title: "Downvia — Real-Time Site Monitor",
    slug: "downvia-site-monitor",
    tagline: "Downdetector-style uptime monitoring with real-time community reports",
    status: "in-progress", isFeatured: false,
    technologies: ["MERN Stack", "React.js", "Node.js", "Express.js", "Socket.io"],
    tags: ["Monitoring", "Real-time", "Community", "DevOps"],
    description: "Downvia is a real-time website status monitoring platform, similar to Downdetector. Users can check if a website is down, report outages, and see live status updates from the community — all without needing an account.",
    challenge: "Aggregating community incident reports reliably and filtering spam or false positives. Most monitoring tools are enterprise-priced or require installation. Building something that feels instant and trustworthy for a public audience is a unique UX challenge.",
    solution: "Designed a weighted voting system — authenticated reports carry 3x the weight of anonymous ones. WebSocket channels broadcast live status changes. Automated health-check pings validate reports server-side before publishing. Built a clean public dashboard with incident timelines.",
    outcome: "Currently in active development. Core monitoring loop live. 15+ sites tracked in internal testing. Aiming for public launch in Q3 2025.",
    lessonsLearned: "Rate limiting anonymous submissions is essential — even a small spike in fake reports can skew status indicators. Implemented CAPTCHA + IP-based throttle as a first layer.",
    startDate: "2024-06-01", endDate: null,
    mainImage: "", images: [],
    demoUrl: "", repoUrl: "https://github.com/shivam/downvia",
    views: 0, shares: 0,
    metaTitle: "Downvia Case Study | Shivam Web Stack",
    metaDescription: "Building a real-time website status monitoring platform with MERN stack.",
    metaKeywords: ["uptime monitoring", "real-time", "MERN", "Socket.io"],
    isPublished: true, createdAt: "2024-06-01T10:00:00Z",
  },
  {
    _id: "cs_004", title: "Legitixy — Indian Legal Resource Portal",
    slug: "legitixy-legal-portal",
    tagline: "Making Indian law accessible to every citizen with structured data",
    status: "in-progress", isFeatured: false,
    technologies: ["React Vite", "Node.js", "MongoDB", "REST API"],
    tags: ["LegalTech", "India", "Information Portal", "Civic"],
    description: "Legitixy is an in-progress platform providing users with structured and easy-to-access information about Indian laws, court processes, and legal resources. It bridges the gap between complex legal language and everyday understanding.",
    challenge: "Indian legal content is scattered across outdated government portals, PDFs, and unreliable third-party sites. Content is dense, jargon-heavy, and inaccessible to people without legal background. The challenge is curation, structuring, and presenting this at scale.",
    solution: "Structured legal content into categories (Civil, Criminal, Consumer, Family, etc.). Built a custom rich-text CMS for legal editors. Implemented full-text search with MongoDB Atlas Search. Added a plain-English summariser for each legal provision using AI-assisted editing.",
    outcome: "4 stars on initial user feedback. 120+ legal articles drafted. Search latency under 200ms. Targeting 500+ structured entries before public launch.",
    lessonsLearned: "Legal content must always be reviewed by a qualified professional before publishing — AI summaries can be dangerously misleading for complex provisions. Always add disclaimers.",
    startDate: "2024-07-01", endDate: null,
    mainImage: "", images: [],
    demoUrl: "", repoUrl: "https://github.com/shivam/legitixy",
    views: 4, shares: 0,
    metaTitle: "Legitixy Case Study | Shivam Web Stack",
    metaDescription: "Building an Indian legal information portal with React Vite and MongoDB.",
    metaKeywords: ["legal tech", "India", "MongoDB", "React Vite"],
    isPublished: true, createdAt: "2024-07-01T10:00:00Z",
  },
  {
    _id: "cs_005", title: "TextToPDF — Client-Side PDF Converter",
    slug: "texttopdf-converter",
    tagline: "Zero-server file conversion — everything runs in the browser",
    status: "completed", isFeatured: false,
    technologies: ["HTML5", "CSS3", "JavaScript", "jsPDF"],
    tags: ["Utility", "No-Backend", "Browser API", "PDF"],
    description: "TextToPDF is a lightweight, single-page web application that converts text-based files into beautifully formatted PDFs entirely client-side using jsPDF. No server, no upload, no privacy concerns.",
    challenge: "Users needed a quick, private way to convert text documents to PDF without uploading files to a server. Existing tools are slow, ad-heavy, or require sign-up. The challenge was achieving high-fidelity PDF output purely in the browser.",
    solution: "Leveraged jsPDF for PDF generation directly in the browser. Implemented font embedding, page break logic, and custom margin controls. Added drag-and-drop file ingestion with FileReader API. Entire tool ships as a single HTML file — zero dependencies beyond jsPDF CDN.",
    outcome: "2 GitHub stars. Average conversion time: under 300ms for standard documents. Works offline. Zero server costs. Positive feedback on simplicity.",
    lessonsLearned: "jsPDF's text wrapping algorithm needs manual override for non-ASCII characters (especially Hindi/Devanagari). Falling back to canvas-rendering for complex scripts was the pragmatic fix.",
    startDate: "2023-04-01", endDate: "2023-06-30",
    mainImage: "", images: [],
    demoUrl: "https://texttopdf.shivam.dev", repoUrl: "https://github.com/shivam/texttopdf",
    views: 2, shares: 0,
    metaTitle: "TextToPDF Case Study | Shivam Web Stack",
    metaDescription: "A zero-server client-side PDF converter built with vanilla JavaScript and jsPDF.",
    metaKeywords: ["PDF converter", "jsPDF", "client-side", "browser API"],
    isPublished: true, createdAt: "2023-06-30T10:00:00Z",
  },
];

export default function CaseStudies() {
  const { isDarkMode } = useContext(ThemeContext);
  const [caseStudies, setCaseStudies] = useState(SEED_DATA);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTech, setFilterTech] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const heroRef = useRef(null);

  const allTechs = [...new Set(caseStudies.flatMap(c => c.technologies))].sort();

  const filtered = caseStudies.filter(cs => {
    const matchSearch = !searchQuery ||
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = filterStatus === "all" || cs.status === filterStatus ||
      (filterStatus === "featured" && cs.isFeatured);
    const matchTech = filterTech === "all" || cs.technologies?.includes(filterTech);
    return matchSearch && matchStatus && matchTech && cs.isPublished;
  });

  const stats = {
    total: caseStudies.length,
    completed: caseStudies.filter(c => c.status === "completed").length,
    inProgress: caseStudies.filter(c => c.status === "in-progress").length,
    planned: caseStudies.filter(c => c.status === "planned").length,
    featured: caseStudies.filter(c => c.isFeatured).length,
  };

  // ── API calls ──────────────────────────────────────────────
  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/case-studies`);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data?.data?.length > 0) setCaseStudies(data.data);
    } catch {
      // fallback to seed data silently
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCaseStudies(); }, []);

  const handleCreate = async (payload) => {
    const res = await fetch(`${API_BASE}/case-studies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Create failed");
    return res.json();
  };

  const handleUpdate = async (id, payload) => {
    const res = await fetch(`${API_BASE}/case-studies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Update failed");
    return res.json();
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_BASE}/case-studies/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Delete failed");
    return res.json();
  };

  // ── CRUD handlers ──────────────────────────────────────────
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setTagInput(""); setTechInput(""); setKeywordInput("");
    setModalMode("add"); setEditId(null);
    setActiveTab("overview");
    setShowModal(true);
  };

  const openEditModal = (cs) => {
    setFormData({
      title: cs.title || "", slug: cs.slug || "", tagline: cs.tagline || "",
      description: cs.description || "", client: cs.client || "",
      challenge: cs.challenge || "", solution: cs.solution || "",
      outcome: cs.outcome || "", lessonsLearned: cs.lessonsLearned || "",
      startDate: cs.startDate ? cs.startDate.split("T")[0] : "",
      endDate: cs.endDate ? cs.endDate.split("T")[0] : "",
      status: cs.status || "planned", mainImage: cs.mainImage || "",
      images: cs.images || [], demoUrl: cs.demoUrl || "",
      repoUrl: cs.repoUrl || "", clientUrl: cs.clientUrl || "",
      tags: cs.tags || [], technologies: cs.technologies || [],
      isFeatured: cs.isFeatured || false, priority: cs.priority || 0,
      metaTitle: cs.metaTitle || "", metaDescription: cs.metaDescription || "",
      metaKeywords: cs.metaKeywords || [], isPublished: cs.isPublished !== false,
    });
    setFormErrors({});
    setTagInput(""); setTechInput(""); setKeywordInput("");
    setModalMode("edit"); setEditId(cs._id);
    setActiveTab("overview");
    setShowModal(true);
  };

  const confirmDelete = (cs) => {
    Swal.fire({
      title: "Delete Case Study?",
      html: `<p style="color:${isDarkMode?'#CBD5E1':'#475569'}">You're about to permanently delete <strong>${cs.title}</strong>. This action cannot be undone.</p>`,
      icon: "warning",
      background: isDarkMode ? "#1E293B" : "#FFFFFF",
      color: isDarkMode ? "#F1F5F9" : "#1E293B",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: isDarkMode ? "#334155" : "#94A3B8",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await handleDelete(cs._id);
        setCaseStudies(prev => prev.filter(c => c._id !== cs._id));
        Swal.fire({ title: "Deleted!", text: "Case study removed.", icon: "success", background: isDarkMode ? "#1E293B" : "#fff", color: isDarkMode ? "#F1F5F9" : "#1E293B", timer: 1800, showConfirmButton: false });
      } catch {
        setCaseStudies(prev => prev.filter(c => c._id !== cs._id));
        Swal.fire({ title: "Removed locally", icon: "info", timer: 1500, showConfirmButton: false, background: isDarkMode ? "#1E293B" : "#fff", color: isDarkMode ? "#F1F5F9" : "#1E293B" });
      }
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (!formData.slug.trim()) errs.slug = "Slug is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    const payload = { ...formData };
    try {
      if (modalMode === "add") {
        let newItem;
        try { const r = await handleCreate(payload); newItem = r.data || r; }
        catch { newItem = { ...payload, _id: `cs_${Date.now()}`, createdAt: new Date().toISOString(), views: 0, shares: 0 }; }
        setCaseStudies(prev => [newItem, ...prev]);
        Swal.fire({ title: "Case Study Added!", icon: "success", background: isDarkMode ? "#1E293B" : "#fff", color: isDarkMode ? "#F1F5F9" : "#1E293B", timer: 2000, showConfirmButton: false });
      } else {
        let updated;
        try { const r = await handleUpdate(editId, payload); updated = r.data || r; }
        catch { updated = { ...payload, _id: editId }; }
        setCaseStudies(prev => prev.map(c => c._id === editId ? { ...c, ...updated } : c));
        Swal.fire({ title: "Updated!", icon: "success", background: isDarkMode ? "#1E293B" : "#fff", color: isDarkMode ? "#F1F5F9" : "#1E293B", timer: 2000, showConfirmButton: false });
      }
      setShowModal(false);
    } catch (err) {
      Swal.fire({ title: "Error", text: err.message, icon: "error", background: isDarkMode ? "#1E293B" : "#fff", color: isDarkMode ? "#F1F5F9" : "#1E293B" });
    } finally { setSubmitting(false); }
  };

  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const addChip = (field, value, setter) => {
    const trimmed = value.trim();
    if (!trimmed || formData[field].includes(trimmed)) { setter(""); return; }
    setFormData(prev => ({ ...prev, [field]: [...prev[field], trimmed] }));
    setter("");
  };

  const removeChip = (field, val) => setFormData(prev => ({ ...prev, [field]: prev[field].filter(v => v !== val) }));

  return (
    <main className={`sws-cs-root ${isDarkMode ? "sws-cs-dark" : "sws-cs-light"}`}>
      {/* ── SEO meta placeholder ── */}
      <title>Case Studies | Shivam Web Stack — MERN Stack Developer Portfolio</title>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="sws-cs-hero" ref={heroRef} aria-label="Case Studies Hero">
        <div className="sws-cs-hero-grid-bg" aria-hidden="true"></div>
        <div className="sws-cs-hero-orb sws-cs-hero-orb-1" aria-hidden="true"></div>
        <div className="sws-cs-hero-orb sws-cs-hero-orb-2" aria-hidden="true"></div>
        <div className="sws-cs-hero-content">
          <div className="sws-cs-hero-badge">
            <BookOpen size={14} strokeWidth={2} />
            <span>Portfolio Deep Dives</span>
          </div>
          <h1 className="sws-cs-hero-title">
            Case <span className="sws-cs-hero-accent">Studies</span>
          </h1>
          <p className="sws-cs-hero-subtitle">
            Real problems. Real solutions. Every project tells a story — from the first line of code
            to production deployment. Explore the challenges, decisions, and lessons behind each build.
          </p>
          <div className="sws-cs-hero-stats" role="list" aria-label="Portfolio statistics">
            {[
              { label: "Projects Built", value: stats.total, icon: Layers },
              { label: "Completed", value: stats.completed, icon: CheckCircle2 },
              { label: "In Progress", value: stats.inProgress, icon: RefreshCw },
              { label: "Featured", value: stats.featured, icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div className="sws-cs-hero-stat-card" key={label} role="listitem">
                <div className="sws-cs-hero-stat-icon"><Icon size={18} strokeWidth={1.5} /></div>
                <span className="sws-cs-hero-stat-value">{value}</span>
                <span className="sws-cs-hero-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sws-cs-hero-scroll-hint" aria-hidden="true">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ── WHAT ARE CASE STUDIES ─────────────────────────── */}
      <section className="sws-cs-explain-section" aria-labelledby="sws-cs-explain-heading">
        <div className="sws-cs-section-inner">
          <div className="sws-cs-explain-grid">
            <div className="sws-cs-explain-text">
              <span className="sws-cs-section-eyebrow">Definition</span>
              <h2 id="sws-cs-explain-heading" className="sws-cs-section-title">What is a Case Study?</h2>
              <p className="sws-cs-body-text">
                A case study is an in-depth examination of a real project — it goes beyond a portfolio thumbnail
                to document the <em>why</em>, the <em>how</em>, and the <em>what happened after</em>. For developers,
                case studies are proof of process, not just proof of output.
              </p>
              <p className="sws-cs-body-text">
                Each case study here follows the same structure: <strong>Challenge → Solution → Outcome → Lessons Learned</strong>.
                This mirrors how real engineering teams document technical decisions, making it easy to understand
                the context and trade-offs behind every choice.
              </p>
              <p className="sws-cs-body-text">
                Rather than listing technologies, these deep-dives explain <em>why</em> a particular stack was chosen,
                what problems emerged mid-build, and what would be done differently today — offering an honest,
                unfiltered look at the craft of full-stack development.
              </p>
            </div>
            <div className="sws-cs-explain-cards">
              {[
                { icon: Target, title: "Problem-First Thinking", desc: "Every project starts with a real-world pain point, not a technology choice. Understanding the problem deeply shapes every architectural decision." },
                { icon: Lightbulb, title: "Decision Transparency", desc: "Why MongoDB over PostgreSQL? Why Vite over CRA? Each choice is documented with reasoning, trade-offs, and alternatives considered." },
                { icon: TrendingUp, title: "Measurable Outcomes", desc: "Outcomes are anchored in data: load times, Lighthouse scores, user feedback, and production metrics — not just 'it works'." },
                { icon: BookOpen, title: "Lessons Learned", desc: "Honest post-mortems on what broke, what surprised us, and what would be architected differently with hindsight." },
              ].map(({ icon: Icon, title, desc }) => (
                <div className="sws-cs-explain-card" key={title}>
                  <div className="sws-cs-explain-card-icon"><Icon size={20} strokeWidth={1.5} /></div>
                  <div>
                    <h3 className="sws-cs-explain-card-title">{title}</h3>
                    <p className="sws-cs-explain-card-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTERS + ADD ────────────────────────────────── */}
      <section className="sws-cs-toolbar-section" aria-label="Filter and search case studies">
        <div className="sws-cs-section-inner">
          <div className="sws-cs-toolbar">
            <div className="sws-cs-search-wrap">
              <Search size={16} strokeWidth={2} className="sws-cs-search-icon" />
              <input
                className="sws-cs-search-input"
                type="search"
                placeholder="Search by title, tag, or keyword…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search case studies"
              />
            </div>
            <div className="sws-cs-filters">
              <div className="sws-cs-filter-wrap">
                <Filter size={14} strokeWidth={2} />
                <select className="sws-cs-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} aria-label="Filter by status">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="planned">Planned</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
              <div className="sws-cs-filter-wrap">
                <Code2 size={14} strokeWidth={2} />
                <select className="sws-cs-filter-select" value={filterTech} onChange={e => setFilterTech(e.target.value)} aria-label="Filter by technology">
                  <option value="all">All Techs</option>
                  {allTechs.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button className="sws-cs-add-btn" onClick={openAddModal} aria-label="Add new case study">
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Case Study</span>
            </button>
          </div>
          <div className="sws-cs-results-meta" aria-live="polite">
            {loading ? (
              <span className="sws-cs-loading-text"><RefreshCw size={13} className="sws-cs-spin" /> Loading…</span>
            ) : (
              <span>Showing <strong>{filtered.length}</strong> of <strong>{caseStudies.length}</strong> case studies</span>
            )}
          </div>
        </div>
      </section>

      {/* ── CASE STUDY CARDS ─────────────────────────────── */}
      <section className="sws-cs-list-section" aria-label="Case studies list">
        <div className="sws-cs-section-inner">
          {filtered.length === 0 ? (
            <div className="sws-cs-empty-state">
              <div className="sws-cs-empty-icon"><AlertCircle size={40} strokeWidth={1} /></div>
              <h3 className="sws-cs-empty-title">No case studies found</h3>
              <p className="sws-cs-empty-desc">Try adjusting your filters or search query.</p>
              <button className="sws-cs-add-btn" onClick={openAddModal}><Plus size={15} /> Add the first one</button>
            </div>
          ) : (
            <div className="sws-cs-cards-list">
              {filtered.map((cs, idx) => {
                const StatusIcon = STATUS_META[cs.status]?.icon || Clock;
                const statusColor = STATUS_META[cs.status]?.color || "#8B5CF6";
                const isExpanded = expandedId === cs._id;
                return (
                  <article
                    key={cs._id}
                    className={`sws-cs-card ${isExpanded ? "sws-cs-card--expanded" : ""} ${cs.isFeatured ? "sws-cs-card--featured" : ""}`}
                    style={{ "--card-accent": statusColor, animationDelay: `${idx * 80}ms` }}
                    aria-expanded={isExpanded}
                  >
                    {cs.isFeatured && (
                      <div className="sws-cs-featured-badge" aria-label="Featured project">
                        <Star size={11} fill="currentColor" /> Featured
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="sws-cs-card-header">
                      <div className="sws-cs-card-image-wrap">
                        {cs.mainImage ? (
                          <img src={cs.mainImage} alt={`${cs.title} preview`} className="sws-cs-card-image" loading="lazy" />
                        ) : (
                          <div className="sws-cs-card-image-placeholder" aria-label="Project image placeholder">
                            <Code2 size={32} strokeWidth={1} />
                            <span>Cover Image</span>
                          </div>
                        )}
                        <div className="sws-cs-card-image-overlay">
                          <div className="sws-cs-card-status-pill" style={{ "--pill-color": statusColor }}>
                            <StatusIcon size={11} strokeWidth={2} />
                            <span>{STATUS_META[cs.status]?.label || cs.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sws-cs-card-meta">
                        <div className="sws-cs-card-title-row">
                          <div>
                            <h3 className="sws-cs-card-title">{cs.title}</h3>
                            {cs.tagline && <p className="sws-cs-card-tagline">{cs.tagline}</p>}
                          </div>
                          <div className="sws-cs-card-actions">
                            {cs.demoUrl && (
                              <a href={cs.demoUrl} target="_blank" rel="noopener noreferrer" className="sws-cs-icon-btn" aria-label="View live demo" title="Live Demo">
                                <Globe size={15} strokeWidth={2} />
                              </a>
                            )}
                            {cs.repoUrl && (
                              <a href={cs.repoUrl} target="_blank" rel="noopener noreferrer" className="sws-cs-icon-btn" aria-label="View repository" title="Repository">
                                <Github size={15} strokeWidth={2} />
                              </a>
                            )}
                            <button className="sws-cs-icon-btn sws-cs-icon-btn--edit" onClick={() => openEditModal(cs)} aria-label={`Edit ${cs.title}`} title="Edit">
                              <Edit3 size={15} strokeWidth={2} />
                            </button>
                            <button className="sws-cs-icon-btn sws-cs-icon-btn--delete" onClick={() => confirmDelete(cs)} aria-label={`Delete ${cs.title}`} title="Delete">
                              <Trash2 size={15} strokeWidth={2} />
                            </button>
                          </div>
                        </div>

                        <p className="sws-cs-card-desc">{cs.description}</p>

                        <div className="sws-cs-card-tech-row">
                          {cs.technologies?.slice(0, 6).map(t => (
                            <span key={t} className="sws-cs-tech-chip"
                              style={{ "--chip-color": TECH_COLORS[t] || "#64748B" }}>
                              {t}
                            </span>
                          ))}
                          {cs.technologies?.length > 6 && (
                            <span className="sws-cs-tech-more">+{cs.technologies.length - 6}</span>
                          )}
                        </div>

                        <div className="sws-cs-card-footer">
                          <div className="sws-cs-card-dates">
                            {cs.startDate && (
                              <span className="sws-cs-date-chip">
                                <Calendar size={11} /> {new Date(cs.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                                {cs.endDate && ` → ${new Date(cs.endDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`}
                              </span>
                            )}
                          </div>
                          <div className="sws-cs-card-stats-row">
                            <span className="sws-cs-stat-pill"><Eye size={11} /> {cs.views}</span>
                          </div>
                          <button
                            className="sws-cs-expand-btn"
                            onClick={() => setExpandedId(isExpanded ? null : cs._id)}
                            aria-label={isExpanded ? "Collapse case study" : "Expand case study"}
                          >
                            {isExpanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Deep Dive</>}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="sws-cs-card-expanded-body">
                        <div className="sws-cs-expanded-tabs" role="tablist">
                          {["challenge", "solution", "outcome", "lessons"].map(tab => (
                            <button key={tab} role="tab" aria-selected={activeTab === tab}
                              className={`sws-cs-exp-tab ${activeTab === tab ? "sws-cs-exp-tab--active" : ""}`}
                              onClick={() => setActiveTab(tab)}>
                              {tab === "challenge" && <><Target size={13} /> Challenge</>}
                              {tab === "solution" && <><Zap size={13} /> Solution</>}
                              {tab === "outcome" && <><TrendingUp size={13} /> Outcome</>}
                              {tab === "lessons" && <><Award size={13} /> Lessons</>}
                            </button>
                          ))}
                        </div>
                        <div className="sws-cs-exp-content" role="tabpanel">
                          {activeTab === "challenge" && <p>{cs.challenge || "No challenge documented yet."}</p>}
                          {activeTab === "solution" && <p>{cs.solution || "No solution documented yet."}</p>}
                          {activeTab === "outcome" && <p>{cs.outcome || "No outcome documented yet."}</p>}
                          {activeTab === "lessons" && <p>{cs.lessonsLearned || "No lessons documented yet."}</p>}
                        </div>

                        {/* Gallery */}
                        {cs.images?.length > 0 && (
                          <div className="sws-cs-gallery">
                            <h4 className="sws-cs-gallery-title"><ImagePlus size={14} /> Screenshots</h4>
                            <div className="sws-cs-gallery-grid">
                              {cs.images.map((img, i) => (
                                <img key={i} src={img} alt={`${cs.title} screenshot ${i + 1}`} className="sws-cs-gallery-img" loading="lazy" />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {cs.tags?.length > 0 && (
                          <div className="sws-cs-exp-tags">
                            <Tag size={12} />
                            {cs.tags.map(t => <span key={t} className="sws-cs-tag-chip">{t}</span>)}
                          </div>
                        )}

                        <div className="sws-cs-exp-links">
                          {cs.demoUrl && <a href={cs.demoUrl} target="_blank" rel="noopener noreferrer" className="sws-cs-link-btn sws-cs-link-btn--demo"><Globe size={14} /> Live Demo <ArrowRight size={12} /></a>}
                          {cs.repoUrl && <a href={cs.repoUrl} target="_blank" rel="noopener noreferrer" className="sws-cs-link-btn sws-cs-link-btn--repo"><Github size={14} /> Source Code <ArrowRight size={12} /></a>}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── PREDICTIONS SECTION ──────────────────────────── */}
      <section className="sws-cs-predictions-section" aria-labelledby="sws-cs-pred-heading">
        <div className="sws-cs-section-inner">
          <span className="sws-cs-section-eyebrow">Forward Look</span>
          <h2 id="sws-cs-pred-heading" className="sws-cs-section-title">Project Roadmap & Predictions</h2>
          <p className="sws-cs-body-text sws-cs-body-text--center">
            Based on current trajectories and planned milestones, here's where the portfolio is headed in the next 12 months.
          </p>
          <div className="sws-cs-predictions-grid">
            {[
              { icon: Globe, title: "Downvia — Public Launch", timeframe: "Q3 2025", desc: "Community incident reporting and automated health-check pings stabilised. Expecting 20+ sites tracked on day one of public launch. Targeting integration with Telegram bot for instant alerts.", confidence: 85 },
              { icon: BookOpen, title: "Legitixy — 500 Articles", timeframe: "Q4 2025", desc: "Legal content pipeline accelerating with AI-assisted editor workflow. Prediction: 500 structured legal articles and full-text search in place before new year.", confidence: 78 },
              { icon: Users, title: "Migration Mitra — Beta", timeframe: "Q1 2026", desc: "India's first open-source visa and immigration tracker for working professionals. Aggregating data from official government portals. Beta with 50 test users targeted.", confidence: 70 },
              { icon: Zap, title: "Yojana Bandhu — MVP", timeframe: "Q2 2026", desc: "Government scheme aggregator covering 200+ central and state schemes. Natural language search for eligibility filtering. Prediction: featured in a civic tech newsletter on launch.", confidence: 65 },
            ].map(({ icon: Icon, title, timeframe, desc, confidence }) => (
              <div className="sws-cs-pred-card" key={title}>
                <div className="sws-cs-pred-card-top">
                  <div className="sws-cs-pred-icon"><Icon size={18} strokeWidth={1.5} /></div>
                  <span className="sws-cs-pred-timeframe">{timeframe}</span>
                </div>
                <h3 className="sws-cs-pred-title">{title}</h3>
                <p className="sws-cs-pred-desc">{desc}</p>
                <div className="sws-cs-pred-confidence">
                  <span className="sws-cs-pred-conf-label">Confidence</span>
                  <div className="sws-cs-pred-bar-track">
                    <div className="sws-cs-pred-bar-fill" style={{ "--conf": `${confidence}%` }}></div>
                  </div>
                  <span className="sws-cs-pred-conf-value">{confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH INSIGHTS ─────────────────────────────────── */}
      <section className="sws-cs-insights-section" aria-labelledby="sws-cs-insights-heading">
        <div className="sws-cs-section-inner">
          <span className="sws-cs-section-eyebrow">Stack Analysis</span>
          <h2 id="sws-cs-insights-heading" className="sws-cs-section-title">Technology Patterns Across Projects</h2>
          <p className="sws-cs-body-text sws-cs-body-text--center">
            After building multiple full-stack applications, clear patterns emerge in technology choices, architecture decisions, and common pitfalls. Here's an honest analysis.
          </p>
          <div className="sws-cs-insights-grid">
            <div className="sws-cs-insight-card sws-cs-insight-card--primary">
              <BarChart2 size={22} strokeWidth={1.5} className="sws-cs-insight-icon" />
              <h3 className="sws-cs-insight-title">MERN is a Strong Default</h3>
              <p>MongoDB's flexible schema accelerates early-stage development when data shapes are still evolving. Express + Node creates a cohesive JS-only backend, reducing context switching. React Vite's HMR is genuinely transformative for front-end iteration speed.</p>
              <p>The stack's weakness: when relational data gets complex, MongoDB's lack of joins becomes a bottleneck. Future projects with highly relational data will evaluate PostgreSQL with Prisma.</p>
            </div>
            <div className="sws-cs-insight-card">
              <Zap size={22} strokeWidth={1.5} className="sws-cs-insight-icon" />
              <h3 className="sws-cs-insight-title">Real-time is a Feature, Not a Layer</h3>
              <p>Socket.io for Instant Hooks and Downvia showed that real-time features must be designed into the data model from day one — retrofitting WebSocket rooms onto a REST-only architecture is painful. Lesson: plan for event-driven state from the first schema.</p>
            </div>
            <div className="sws-cs-insight-card">
              <Award size={22} strokeWidth={1.5} className="sws-cs-insight-icon" />
              <h3 className="sws-cs-insight-title">Auth is Infrastructure, Not a Feature</h3>
              <p>Authnester emerged from the frustration of rebuilding JWT flows across every project. SaaS auth platforms like Auth0 are powerful but expensive at scale. The sweet spot: a self-hosted, open-source auth layer that's opinionated but configurable.</p>
            </div>
            <div className="sws-cs-insight-card">
              <Globe size={22} strokeWidth={1.5} className="sws-cs-insight-icon" />
              <h3 className="sws-cs-insight-title">India-Focused Products Have Unique Constraints</h3>
              <p>Legitixy, Migration Mitra, and Yojana Bandhu all serve the Indian market — which means designing for 3G/4G networks, regional language support, and trust signals that work for a population that's skeptical of new platforms. Performance budgets are tight.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL ─────────────────────────────────────────── */}
      {showModal && (
        <div className="sws-cs-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sws-cs-modal-title"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="sws-cs-modal">
            <div className="sws-cs-modal-header">
              <h2 id="sws-cs-modal-title" className="sws-cs-modal-title">
                {modalMode === "add" ? <><Plus size={18} /> Add Case Study</> : <><Edit3 size={18} /> Edit Case Study</>}
              </h2>
              <button className="sws-cs-modal-close" onClick={() => setShowModal(false)} aria-label="Close modal"><X size={18} /></button>
            </div>

            {/* Modal Tabs */}
            <div className="sws-cs-modal-tabs" role="tablist">
              {[["overview", BookOpen, "Overview"], ["details", Layers, "Details"], ["media", ImagePlus, "Media"], ["seo", Globe, "SEO"]].map(([tab, Icon, label]) => (
                <button key={tab} role="tab" aria-selected={activeTab === tab}
                  className={`sws-cs-modal-tab ${activeTab === tab ? "sws-cs-modal-tab--active" : ""}`}
                  onClick={() => setActiveTab(tab)}>
                  <Icon size={13} strokeWidth={2} /> {label}
                </button>
              ))}
            </div>

            <form className="sws-cs-modal-form" onSubmit={submitForm} noValidate>
              <div className="sws-cs-modal-body">

                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="sws-cs-form-grid">
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-title">Title <span className="sws-cs-required">*</span></label>
                      <input id="sws-cs-f-title" className={`sws-cs-form-input ${formErrors.title ? "sws-cs-form-input--error" : ""}`}
                        type="text" value={formData.title} placeholder="e.g. Authnester — Auth SaaS Platform"
                        onChange={e => { setFormData(p => ({ ...p, title: e.target.value, slug: autoSlug(e.target.value) })); }} />
                      {formErrors.title && <span className="sws-cs-form-error">{formErrors.title}</span>}
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-tagline">Tagline</label>
                      <input id="sws-cs-f-tagline" className="sws-cs-form-input" type="text" value={formData.tagline}
                        placeholder="One-line summary of the project" onChange={e => setFormData(p => ({ ...p, tagline: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--half">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-slug">Slug <span className="sws-cs-required">*</span></label>
                      <input id="sws-cs-f-slug" className={`sws-cs-form-input ${formErrors.slug ? "sws-cs-form-input--error" : ""}`}
                        type="text" value={formData.slug} placeholder="my-project-slug"
                        onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} />
                      {formErrors.slug && <span className="sws-cs-form-error">{formErrors.slug}</span>}
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--half">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-status">Status</label>
                      <select id="sws-cs-f-status" className="sws-cs-form-select" value={formData.status}
                        onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}>
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-description">Description <span className="sws-cs-required">*</span></label>
                      <textarea id="sws-cs-f-description" className={`sws-cs-form-textarea ${formErrors.description ? "sws-cs-form-input--error" : ""}`}
                        rows={3} value={formData.description} placeholder="Brief overview of the project..."
                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
                      {formErrors.description && <span className="sws-cs-form-error">{formErrors.description}</span>}
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-challenge">Challenge</label>
                      <textarea id="sws-cs-f-challenge" className="sws-cs-form-textarea" rows={3} value={formData.challenge}
                        placeholder="What problem were you solving?" onChange={e => setFormData(p => ({ ...p, challenge: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-solution">Solution</label>
                      <textarea id="sws-cs-f-solution" className="sws-cs-form-textarea" rows={3} value={formData.solution}
                        placeholder="How did you solve it?" onChange={e => setFormData(p => ({ ...p, solution: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-outcome">Outcome</label>
                      <textarea id="sws-cs-f-outcome" className="sws-cs-form-textarea" rows={3} value={formData.outcome}
                        placeholder="What were the measurable results?" onChange={e => setFormData(p => ({ ...p, outcome: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-lessons">Lessons Learned</label>
                      <textarea id="sws-cs-f-lessons" className="sws-cs-form-textarea" rows={3} value={formData.lessonsLearned}
                        placeholder="What would you do differently?" onChange={e => setFormData(p => ({ ...p, lessonsLearned: e.target.value }))} />
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="sws-cs-form-grid">
                    <div className="sws-cs-form-group sws-cs-form-group--half">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-client">Client / Context</label>
                      <input id="sws-cs-f-client" className="sws-cs-form-input" type="text" value={formData.client}
                        placeholder="Personal project / Client name" onChange={e => setFormData(p => ({ ...p, client: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--half">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-priority">Display Priority</label>
                      <input id="sws-cs-f-priority" className="sws-cs-form-input" type="number" value={formData.priority}
                        min={0} onChange={e => setFormData(p => ({ ...p, priority: +e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--half">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-start">Start Date</label>
                      <input id="sws-cs-f-start" className="sws-cs-form-input" type="date" value={formData.startDate}
                        onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--half">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-end">End Date</label>
                      <input id="sws-cs-f-end" className="sws-cs-form-input" type="date" value={formData.endDate}
                        onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-demo">Demo URL</label>
                      <input id="sws-cs-f-demo" className="sws-cs-form-input" type="url" value={formData.demoUrl}
                        placeholder="https://your-demo.com" onChange={e => setFormData(p => ({ ...p, demoUrl: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-repo">Repository URL</label>
                      <input id="sws-cs-f-repo" className="sws-cs-form-input" type="url" value={formData.repoUrl}
                        placeholder="https://github.com/you/repo" onChange={e => setFormData(p => ({ ...p, repoUrl: e.target.value }))} />
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label">Technologies</label>
                      <div className="sws-cs-chip-input-row">
                        <input className="sws-cs-form-input sws-cs-chip-input" type="text" value={techInput}
                          placeholder="Add tech (Enter to add)" onChange={e => setTechInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addChip("technologies", techInput, setTechInput))} />
                        <button type="button" className="sws-cs-chip-add-btn" onClick={() => addChip("technologies", techInput, setTechInput)}><Plus size={14} /></button>
                      </div>
                      <div className="sws-cs-chips-wrap">
                        {formData.technologies.map(t => (
                          <span key={t} className="sws-cs-chip" style={{ "--chip-color": TECH_COLORS[t] || "#64748B" }}>
                            {t}<button type="button" onClick={() => removeChip("technologies", t)} aria-label={`Remove ${t}`}><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label">Tags</label>
                      <div className="sws-cs-chip-input-row">
                        <input className="sws-cs-form-input sws-cs-chip-input" type="text" value={tagInput}
                          placeholder="Add tag (Enter to add)" onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addChip("tags", tagInput, setTagInput))} />
                        <button type="button" className="sws-cs-chip-add-btn" onClick={() => addChip("tags", tagInput, setTagInput)}><Plus size={14} /></button>
                      </div>
                      <div className="sws-cs-chips-wrap">
                        {formData.tags.map(t => (
                          <span key={t} className="sws-cs-chip sws-cs-chip--tag">
                            {t}<button type="button" onClick={() => removeChip("tags", t)} aria-label={`Remove ${t}`}><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full sws-cs-form-group--toggles">
                      <label className="sws-cs-toggle-label">
                        <input type="checkbox" className="sws-cs-toggle-input" checked={formData.isFeatured}
                          onChange={e => setFormData(p => ({ ...p, isFeatured: e.target.checked }))} />
                        <span className="sws-cs-toggle-track"></span>
                        <span className="sws-cs-toggle-text">Mark as Featured</span>
                      </label>
                      <label className="sws-cs-toggle-label">
                        <input type="checkbox" className="sws-cs-toggle-input" checked={formData.isPublished}
                          onChange={e => setFormData(p => ({ ...p, isPublished: e.target.checked }))} />
                        <span className="sws-cs-toggle-track"></span>
                        <span className="sws-cs-toggle-text">Published (visible to public)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === "media" && (
                  <div className="sws-cs-form-grid">
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-mainimg">Main Cover Image URL</label>
                      <input id="sws-cs-f-mainimg" className="sws-cs-form-input" type="url" value={formData.mainImage}
                        placeholder="https://your-cdn.com/image.jpg" onChange={e => setFormData(p => ({ ...p, mainImage: e.target.value }))} />
                      {formData.mainImage && (
                        <div className="sws-cs-img-preview-wrap">
                          <img src={formData.mainImage} alt="Cover preview" className="sws-cs-img-preview" />
                        </div>
                      )}
                      <p className="sws-cs-form-hint">Supports any resolution or aspect ratio — image will be automatically fitted. Recommended: 16:9 or wider.</p>
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label">Screenshot URLs</label>
                      <div className="sws-cs-chip-input-row">
                        <input className="sws-cs-form-input sws-cs-chip-input" id="sws-cs-img-url-field" type="url"
                          placeholder="https://your-cdn.com/screenshot.jpg"
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = e.target.value.trim();
                              if (val && !formData.images.includes(val)) {
                                setFormData(p => ({ ...p, images: [...p.images, val] }));
                                e.target.value = "";
                              }
                            }
                          }} />
                        <button type="button" className="sws-cs-chip-add-btn" onClick={() => {
                          const el = document.getElementById("sws-cs-img-url-field");
                          const val = el.value.trim();
                          if (val && !formData.images.includes(val)) { setFormData(p => ({ ...p, images: [...p.images, val] })); el.value = ""; }
                        }}><Plus size={14} /></button>
                      </div>
                      <div className="sws-cs-gallery-input-grid">
                        {formData.images.map((img, i) => (
                          <div key={i} className="sws-cs-gallery-input-item">
                            <img src={img} alt={`Screenshot ${i + 1}`} className="sws-cs-gallery-input-img" />
                            <button type="button" className="sws-cs-gallery-input-remove"
                              onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                              aria-label={`Remove screenshot ${i + 1}`}><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                      <p className="sws-cs-form-hint">Add screenshot URLs one by one. Any image resolution is supported.</p>
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === "seo" && (
                  <div className="sws-cs-form-grid">
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-metaTitle">Meta Title</label>
                      <input id="sws-cs-f-metaTitle" className="sws-cs-form-input" type="text" value={formData.metaTitle}
                        placeholder="SEO-friendly title (50–60 chars)" onChange={e => setFormData(p => ({ ...p, metaTitle: e.target.value }))} />
                      <p className="sws-cs-form-hint">{formData.metaTitle.length}/60 characters</p>
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label" htmlFor="sws-cs-f-metaDesc">Meta Description</label>
                      <textarea id="sws-cs-f-metaDesc" className="sws-cs-form-textarea" rows={3} value={formData.metaDescription}
                        placeholder="Brief description for search engines (150–160 chars)" onChange={e => setFormData(p => ({ ...p, metaDescription: e.target.value }))} />
                      <p className="sws-cs-form-hint">{formData.metaDescription.length}/160 characters</p>
                    </div>
                    <div className="sws-cs-form-group sws-cs-form-group--full">
                      <label className="sws-cs-form-label">Meta Keywords</label>
                      <div className="sws-cs-chip-input-row">
                        <input className="sws-cs-form-input sws-cs-chip-input" type="text" value={keywordInput}
                          placeholder="Add keyword (Enter to add)" onChange={e => setKeywordInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addChip("metaKeywords", keywordInput, setKeywordInput))} />
                        <button type="button" className="sws-cs-chip-add-btn" onClick={() => addChip("metaKeywords", keywordInput, setKeywordInput)}><Plus size={14} /></button>
                      </div>
                      <div className="sws-cs-chips-wrap">
                        {formData.metaKeywords.map(k => (
                          <span key={k} className="sws-cs-chip sws-cs-chip--keyword">
                            {k}<button type="button" onClick={() => removeChip("metaKeywords", k)} aria-label={`Remove ${k}`}><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sws-cs-modal-footer">
                <button type="button" className="sws-cs-btn-cancel" onClick={() => setShowModal(false)}>
                  <X size={14} /> Cancel
                </button>
                <button type="submit" className="sws-cs-btn-submit" disabled={submitting}>
                  {submitting ? <><RefreshCw size={14} className="sws-cs-spin" /> Saving…</> : <><Save size={14} /> {modalMode === "add" ? "Add Case Study" : "Save Changes"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}