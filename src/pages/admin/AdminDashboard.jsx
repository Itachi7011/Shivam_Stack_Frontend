import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Tag,
  FolderOpen,
  Ticket,
  Briefcase,
  Settings,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Package,
  Eye,
  BarChart2,
  Activity,
  RefreshCw,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Clock,
  Rocket,
  AlertTriangle,
  Globe,
  Mail,
  Phone,
  Star,
  Zap,
  Database,
  Shield,
  Calendar,
  Hash,
  Image,
  Plus,
  ExternalLink,
  ChevronRight,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Circle,
  Layers,
  BookOpen,
  ShoppingCart,
  PercentCircle,
  Award,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Download,
  PieChart,
  LineChart,
  MoreHorizontal,
  Info,
  Sparkles,
  Code2,
  GitBranch,
  Terminal,
  User,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// ─── Token helper ─────────────────────────────────────────────────────────────
const token = () => localStorage.getItem("adminToken");
const swalCfg = (d) => ({
  background: d ? "#0f1117" : "#fff",
  color: d ? "#e2e8f0" : "#1a202c",
  confirmButtonColor: "#6c63ff",
});

// ─── Nav quick links ───────────────────────────────────────────────────────────
const QUICK_LINKS = [
  {
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBag,
    color: "green",
  },
  { label: "Blogs", path: "/admin/blogs", icon: FileText, color: "amber" },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: Briefcase,
    color: "purple",
  },
  { label: "Coupons", path: "/admin/coupons", icon: Ticket, color: "cyan" },
  {
    label: "Blog Categories",
    path: "/admin/blog-categories",
    icon: FolderOpen,
    color: "rose",
  },
  {
    label: "Product Categories",
    path: "/admin/product-categories",
    icon: Tag,
    color: "indigo",
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    color: "slate",
  },
];

// ─── Greeting helper ──────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Sparkline mini chart component ───────────────────────────────────────────
const Sparkline = ({ data = [], color = "#6c63ff", height = 36 }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="sdash-sparkline"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(" ")}
      />
      <polygon
        fill={`url(#sg-${color.replace("#", "")})`}
        points={`0,${h} ${pts.join(" ")} ${w},${h}`}
      />
    </svg>
  );
};

// ─── Mini bar chart ────────────────────────────────────────────────────────────
const MiniBar = ({ value, max, color }) => (
  <div className="sdash-minibar-wrap">
    <div
      className="sdash-minibar-fill"
      style={{
        width: `${Math.min(100, (value / (max || 1)) * 100)}%`,
        background: color,
      }}
    />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  change,
  changeDir,
  color,
  sparkData,
  link,
  delay = 0,
}) => {
  const colors = {
    purple: { bg: "rgba(108,99,255,0.12)", icon: "#8b85ff", spark: "#6c63ff" },
    green: { bg: "rgba(16,185,129,0.12)", icon: "#10b981", spark: "#10b981" },
    amber: { bg: "rgba(245,158,11,0.12)", icon: "#f59e0b", spark: "#f59e0b" },
    cyan: { bg: "rgba(34,211,238,0.12)", icon: "#22d3ee", spark: "#22d3ee" },
    rose: { bg: "rgba(239,68,68,0.12)", icon: "#ef4444", spark: "#ef4444" },
    indigo: { bg: "rgba(99,102,241,0.12)", icon: "#818cf8", spark: "#818cf8" },
  };
  const c = colors[color] || colors.purple;

  return (
    <div className="sdash-stat-card" style={{ "--delay": `${delay}ms` }}>
      <div className="sdash-stat-top">
        <div
          className="sdash-stat-icon"
          style={{ background: c.bg, color: c.icon }}
        >
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <span
            className={`sdash-change ${changeDir === "up" ? "sdash-change-up" : "sdash-change-dn"}`}
          >
            {changeDir === "up" ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {change}%
          </span>
        )}
      </div>
      <div className="sdash-stat-val">{value}</div>
      <div className="sdash-stat-label">{label}</div>
      {sub && <div className="sdash-stat-sub">{sub}</div>}
      {sparkData && <Sparkline data={sparkData} color={c.spark} />}
      {link && (
        <Link to={link} className="sdash-stat-link">
          View all <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
};

// ─── Section header ────────────────────────────────────────────────────────────
const SectionHead = ({
  icon: Icon,
  title,
  sub,
  action,
  actionPath,
  color = "purple",
}) => (
  <div className="sdash-sec-head">
    <div className="sdash-sec-head-left">
      <div className={`sdash-sec-icon sdash-sec-icon-${color}`}>
        <Icon size={17} />
      </div>
      <div>
        <h2 className="sdash-sec-title">{title}</h2>
        {sub && <p className="sdash-sec-sub">{sub}</p>}
      </div>
    </div>
    {action && actionPath && (
      <Link to={actionPath} className="sdash-sec-action">
        {action} <ChevronRight size={14} />
      </Link>
    )}
  </div>
);

// ─── Status badge ──────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    published: "sdash-badge-green",
    active: "sdash-badge-green",
    completed: "sdash-badge-green",
    draft: "sdash-badge-amber",
    "in-progress": "sdash-badge-amber",
    planned: "sdash-badge-purple",
    inactive: "sdash-badge-slate",
    expired: "sdash-badge-red",
    hidden: "sdash-badge-slate",
  };
  return (
    <span className={`sdash-badge ${map[status] || "sdash-badge-slate"}`}>
      {status}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const tickRef = useRef(null);

  // Live clock
  useEffect(() => {
    tickRef.current = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  // ── Fetch all dashboard data ──
  const fetchDashboard = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const headers = {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        };

        const [
          statsRes,
          productsRes,
          blogsRes,
          projectsRes,
          couponsRes,
          blogCatsRes,
          prodCatsRes,
          settingsRes,
        ] = await Promise.all([
          fetch("/admin/dashboard/stats", { headers }),
          fetch("/admin/products?limit=5", { headers }),
          fetch("/admin/blogs?limit=5", { headers }),
          fetch("/admin/projects?limit=6", { headers }),
          fetch("/admin/coupons?limit=5", { headers }),
          fetch("/admin/blog-categories", { headers }),
          fetch("/admin/product-categories", { headers }),
          fetch("/admin/main-settings", { headers }),
        ]);

        const [
          stats,
          products,
          blogs,
          projects,
          coupons,
          blogCats,
          prodCats,
          settings,
        ] = await Promise.all([
          statsRes.ok ? statsRes.json() : {},
          productsRes.ok ? productsRes.json() : {},
          blogsRes.ok ? blogsRes.json() : {},
          projectsRes.ok ? projectsRes.json() : {},
          couponsRes.ok ? couponsRes.json() : {},
          blogCatsRes.ok ? blogCatsRes.json() : {},
          prodCatsRes.ok ? prodCatsRes.json() : {},
          settingsRes.ok ? settingsRes.json() : {},
        ]);

        setData({
          stats: stats.data || stats,
          products: (products.data || products)?.slice?.(0, 5) || [],
          blogs: (blogs.data || blogs)?.slice?.(0, 5) || [],
          projects: (projects.data || projects)?.slice?.(0, 6) || [],
          coupons: (coupons.data || coupons)?.slice?.(0, 5) || [],
          blogCats: blogCats.data || blogCats || [],
          prodCats: prodCats.data || prodCats || [],
          settings: settings.data || settings || {},
        });
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to load dashboard data.",
          icon: "error",
          ...swalCfg(isDarkMode),
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isDarkMode],
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ── Derived stats (fallback when API gives raw arrays) ──
  const derived = React.useMemo(() => {
    if (!data) return {};
    const s = data.stats || {};
    return {
      totalProducts: s.totalProducts ?? data.products?.length ?? 0,
      publishedProducts:
        s.publishedProducts ??
        data.products?.filter((p) => p.isPublished)?.length ??
        0,
      totalBlogs: s.totalBlogs ?? data.blogs?.length ?? 0,
      publishedBlogs:
        s.publishedBlogs ??
        data.blogs?.filter((b) => b.isPublished)?.length ??
        0,
      totalProjects: s.totalProjects ?? data.projects?.length ?? 0,
      completedProjects:
        s.completedProjects ??
        data.projects?.filter((p) => p.status === "completed")?.length ??
        0,
      totalCoupons: s.totalCoupons ?? data.coupons?.length ?? 0,
      activeCoupons:
        s.activeCoupons ?? data.coupons?.filter((c) => c.isActive)?.length ?? 0,
      totalBlogCats: s.totalBlogCats ?? data.blogCats?.length ?? 0,
      totalProdCats: s.totalProdCats ?? data.prodCats?.length ?? 0,
      totalRevenue: s.totalRevenue ?? 0,
      totalOrders: s.totalOrders ?? 0,
      totalUsers: s.totalUsers ?? 0,
      revenueChange: s.revenueChange ?? 0,
      ordersChange: s.ordersChange ?? 0,
      usersChange: s.usersChange ?? 0,
      revenueSparkline: s.revenueSparkline ?? [
        4, 7, 5, 9, 6, 11, 8, 13, 10, 14, 12, 16,
      ],
      ordersSparkline: s.ordersSparkline ?? [
        2, 4, 3, 6, 5, 7, 4, 8, 6, 9, 7, 10,
      ],
      visitorSparkline: s.visitorSparkline ?? [
        10, 14, 12, 18, 15, 20, 17, 22, 19, 24, 21, 26,
      ],
    };
  }, [data]);

  // ── Greeting ──────────────────────────────────────────────────────────────
  const adminName = data?.settings?.appName || "Shivam";

  if (loading)
    return (
      <div className={`sdash-root ${isDarkMode ? "dark" : "light"}`}>
        <div className="sdash-loading-screen">
          <div className="sdash-loading-logo">
            <LayoutDashboard size={32} />
          </div>
          <div className="sdash-loading-ring" />
          <p className="sdash-loading-text">Loading Dashboard…</p>
        </div>
      </div>
    );

  return (
    <div className={`sdash-root ${isDash ? "dark" : "light"}`} id="sdash-root">
      {/* ── Ambient Background ── */}
      <div className="sdash-ambient" aria-hidden="true">
        <div className="sdash-orb sdash-orb-1" />
        <div className="sdash-orb sdash-orb-2" />
        <div className="sdash-orb sdash-orb-3" />
        <div className="sdash-grid-lines" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TOPBAR
      ══════════════════════════════════════════════════════════════════ */}
      <header className="sdash-topbar">
        <div className="sdash-topbar-left">
          <div className="sdash-logo">
            <div className="sdash-logo-icon">
              <Code2 size={18} />
            </div>
            <span className="sdash-logo-text">
              Shivam<strong>Stack</strong>
            </span>
          </div>
          <div className="sdash-topbar-divider" />
          <nav className="sdash-topbar-tabs" aria-label="Dashboard tabs">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "content", label: "Content", icon: Layers },
              { id: "commerce", label: "Commerce", icon: ShoppingCart },
              { id: "portfolio", label: "Portfolio", icon: Briefcase },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`sdash-tab-btn ${activeTab === tab.id ? "sdash-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sdash-topbar-right">
          <div className="sdash-live-clock">
            <Circle size={7} className="sdash-clock-dot" />
            {time.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <button
            className={`sdash-refresh-btn ${refreshing ? "sdash-refreshing" : ""}`}
            onClick={() => fetchDashboard(true)}
            title="Refresh data"
          >
            <RefreshCw size={15} />
          </button>
          <Link
            to="/admin/settings"
            className="sdash-topbar-settings"
            title="Settings"
          >
            <Settings size={16} />
          </Link>
          <div className="sdash-admin-pill">
            <div className="sdash-admin-avatar">
              <User size={14} />
            </div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HERO GREETING
      ══════════════════════════════════════════════════════════════════ */}
      <section className="sdash-hero">
        <div className="sdash-hero-text">
          <div className="sdash-hero-eyebrow">
            <Sparkles size={13} />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="sdash-hero-title">
            {getGreeting()},{" "}
            <span className="sdash-hero-name">{adminName}</span> 👋
          </h1>
          <p className="sdash-hero-sub">
            Here's what's happening with your portfolio platform today.
          </p>
        </div>
        <div className="sdash-hero-quick">
          {QUICK_LINKS.map((ql) => (
            <Link
              key={ql.label}
              to={ql.path}
              className={`sdash-quick-chip sdash-chip-${ql.color}`}
            >
              <ql.icon size={13} />
              {ql.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MAINTENANCE MODE ALERT
      ══════════════════════════════════════════════════════════════════ */}
      {data?.settings?.security?.isMaintenanceMode && (
        <div className="sdash-maintenance-banner">
          <AlertTriangle size={16} />
          <div>
            <strong>Maintenance Mode is ON</strong>
            <span>
              {" "}
              — Your site is currently hidden from visitors.{" "}
              {data.settings.security.maintenanceMessage}
            </span>
          </div>
          <Link to="/admin/settings" className="sdash-maint-link">
            Fix in Settings <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════════ */}
      <main className="sdash-main">
        {/* ── OVERVIEW TAB ──────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            {/* ─ Primary KPI cards ─ */}
            <div className="sdash-kpi-grid">
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`₹${(derived.totalRevenue || 0).toLocaleString()}`}
                change={derived.revenueChange}
                changeDir="up"
                color="green"
                sparkData={derived.revenueSparkline}
                sub="All-time earnings"
                link="/admin/orders"
                delay={0}
              />
              <StatCard
                icon={ShoppingCart}
                label="Total Orders"
                value={derived.totalOrders}
                change={derived.ordersChange}
                changeDir="up"
                color="purple"
                sparkData={derived.ordersSparkline}
                sub="Completed purchases"
                link="/admin/orders"
                delay={60}
              />
              <StatCard
                icon={Users}
                label="Total Visitors"
                value={derived.totalUsers}
                change={derived.usersChange}
                changeDir="up"
                color="cyan"
                sparkData={derived.visitorSparkline}
                sub="Platform visitors"
                delay={120}
              />
              <StatCard
                icon={ShoppingBag}
                label="Products"
                value={derived.totalProducts}
                sub={`${derived.publishedProducts} live`}
                color="amber"
                link="/admin/products"
                delay={180}
              />
              <StatCard
                icon={FileText}
                label="Blog Posts"
                value={derived.totalBlogs}
                sub={`${derived.publishedBlogs} published`}
                color="rose"
                link="/admin/blogs"
                delay={240}
              />
              <StatCard
                icon={Briefcase}
                label="Projects"
                value={derived.totalProjects}
                sub={`${derived.completedProjects} completed`}
                color="indigo"
                link="/admin/projects"
                delay={300}
              />
            </div>

            {/* ─ Secondary stats row ─ */}
            <div className="sdash-secondary-row">
              {[
                {
                  icon: Ticket,
                  label: "Active Coupons",
                  val: derived.activeCoupons,
                  total: derived.totalCoupons,
                  path: "/admin/coupons",
                  color: "#22d3ee",
                },
                {
                  icon: FolderOpen,
                  label: "Blog Categories",
                  val: derived.totalBlogCats,
                  total: null,
                  path: "/admin/blog-categories",
                  color: "#f59e0b",
                },
                {
                  icon: Tag,
                  label: "Product Categories",
                  val: derived.totalProdCats,
                  total: null,
                  path: "/admin/product-categories",
                  color: "#10b981",
                },
                {
                  icon: BarChart2,
                  label: "Published Rate",
                  val: `${derived.totalBlogs > 0 ? Math.round((derived.publishedBlogs / derived.totalBlogs) * 100) : 0}%`,
                  total: null,
                  path: "/admin/blogs",
                  color: "#8b85ff",
                },
              ].map((item, i) => (
                <Link key={i} to={item.path} className="sdash-sec-stat">
                  <div
                    className="sdash-sec-stat-icon"
                    style={{ color: item.color, background: `${item.color}18` }}
                  >
                    <item.icon size={16} />
                  </div>
                  <div className="sdash-sec-stat-body">
                    <span
                      className="sdash-sec-stat-val"
                      style={{ color: item.color }}
                    >
                      {item.val}
                    </span>
                    {item.total !== null && (
                      <span className="sdash-sec-stat-total">
                        {" "}
                        / {item.total}
                      </span>
                    )}
                    <p className="sdash-sec-stat-lbl">{item.label}</p>
                  </div>
                  <ArrowUpRight size={14} className="sdash-sec-stat-arrow" />
                </Link>
              ))}
            </div>

            {/* ─ Site Info snapshot ─ */}
            {data?.settings?.companyName && (
              <div className="sdash-site-snapshot">
                <div className="sdash-snapshot-brand">
                  {data.settings.branding?.logoUrl ? (
                    <img
                      src={data.settings.branding.logoUrl}
                      alt="logo"
                      className="sdash-snap-logo"
                    />
                  ) : (
                    <div className="sdash-snap-logo-fallback">
                      <Code2 size={20} />
                    </div>
                  )}
                  <div>
                    <div className="sdash-snap-name">
                      {data.settings.appName || "Shivam Stack"}
                    </div>
                    <div className="sdash-snap-legal">
                      {data.settings.companyLegalName ||
                        data.settings.companyName}
                    </div>
                  </div>
                </div>
                <div className="sdash-snapshot-fields">
                  {data.settings.websiteUrl && (
                    <a
                      href={data.settings.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="sdash-snap-field"
                    >
                      <Globe size={13} />
                      <span>{data.settings.websiteUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                  {data.settings.officialEmails?.[0] && (
                    <span className="sdash-snap-field">
                      <Mail size={13} />
                      {data.settings.officialEmails[0].address}
                    </span>
                  )}
                  {data.settings.contactNumbers?.[0] && (
                    <span className="sdash-snap-field">
                      <Phone size={13} />
                      {data.settings.contactNumbers[0].countryCode}
                      {data.settings.contactNumbers[0].number}
                    </span>
                  )}
                  <span
                    className={`sdash-snap-field ${data.settings.security?.isMaintenanceMode ? "sdash-snap-warn" : "sdash-snap-ok"}`}
                  >
                    {data.settings.security?.isMaintenanceMode ? (
                      <AlertTriangle size={13} />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    {data.settings.security?.isMaintenanceMode
                      ? "Maintenance Mode"
                      : "Site Live"}
                  </span>
                  <span className="sdash-snap-field">
                    <Shield size={13} />
                    2FA:{" "}
                    {data.settings.security?.enable2FA ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <Link to="/admin/settings" className="sdash-snap-edit">
                  <Settings size={14} /> Edit Settings
                </Link>
              </div>
            )}

            {/* ─ Two-col: Recent Products + Recent Blogs ─ */}
            <div className="sdash-two-col">
              {/* Recent Products */}
              <div className="sdash-panel">
                <SectionHead
                  icon={ShoppingBag}
                  title="Recent Products"
                  sub="Latest additions to your store"
                  action="View All"
                  actionPath="/admin/products"
                  color="green"
                />
                <div className="sdash-panel-body">
                  {data?.products?.length === 0 ? (
                    <div className="sdash-panel-empty">
                      <ShoppingBag size={28} />
                      <p>No products yet</p>
                      <Link to="/admin/products" className="sdash-mini-btn">
                        <Plus size={12} /> Add Product
                      </Link>
                    </div>
                  ) : (
                    data?.products?.map((p, i) => (
                      <div className="sdash-item-row" key={p._id || i}>
                        <div className="sdash-item-thumb">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} />
                          ) : (
                            <div className="sdash-item-thumb-ph">
                              <ShoppingBag size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{p.name}</span>
                          <span className="sdash-item-meta">
                            <span className="sdash-price">
                              ₹{Number(p.price).toLocaleString()}
                            </span>
                            <span className="sdash-dot">·</span>
                            <span>Stock: {p.stock ?? 0}</span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={p.isPublished ? "published" : "hidden"}
                          />
                          <Link
                            to="/admin/products"
                            className="sdash-item-edit"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Blogs */}
              <div className="sdash-panel">
                <SectionHead
                  icon={FileText}
                  title="Recent Blog Posts"
                  sub="Your latest articles"
                  action="View All"
                  actionPath="/admin/blogs"
                  color="amber"
                />
                <div className="sdash-panel-body">
                  {data?.blogs?.length === 0 ? (
                    <div className="sdash-panel-empty">
                      <FileText size={28} />
                      <p>No blog posts yet</p>
                      <Link to="/admin/blogs" className="sdash-mini-btn">
                        <Plus size={12} /> Write Post
                      </Link>
                    </div>
                  ) : (
                    data?.blogs?.map((b, i) => (
                      <div className="sdash-item-row" key={b._id || i}>
                        <div className="sdash-item-thumb">
                          {b.featuredImage ? (
                            <img src={b.featuredImage} alt={b.title} />
                          ) : (
                            <div className="sdash-item-thumb-ph sdash-ph-amber">
                              <FileText size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{b.title}</span>
                          <span className="sdash-item-meta">
                            {b.author && (
                              <>
                                <span>{b.author}</span>
                                <span className="sdash-dot">·</span>
                              </>
                            )}
                            <span>
                              {b.publishedAt
                                ? new Date(b.publishedAt).toLocaleDateString()
                                : new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={b.isPublished ? "published" : "draft"}
                          />
                          <Link to="/admin/blogs" className="sdash-item-edit">
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* ─ Coupons snapshot ─ */}
            <div className="sdash-panel">
              <SectionHead
                icon={Ticket}
                title="Coupon Overview"
                sub="Discount codes and their usage"
                action="Manage Coupons"
                actionPath="/admin/coupons"
                color="cyan"
              />
              <div className="sdash-panel-body">
                {!data?.coupons?.length ? (
                  <div className="sdash-panel-empty">
                    <Ticket size={28} />
                    <p>No coupons created</p>
                    <Link to="/admin/coupons" className="sdash-mini-btn">
                      <Plus size={12} /> Create Coupon
                    </Link>
                  </div>
                ) : (
                  <div className="sdash-coupon-grid">
                    {data.coupons.map((c, i) => {
                      const expired =
                        c.validTill && new Date(c.validTill) < new Date();
                      const pct = c.maxUses
                        ? Math.min(
                            100,
                            Math.round(((c.usedCount || 0) / c.maxUses) * 100),
                          )
                        : 0;
                      return (
                        <div
                          className={`sdash-coupon-card ${expired ? "sdash-coupon-expired" : c.isActive ? "" : "sdash-coupon-off"}`}
                          key={c._id || i}
                        >
                          <div className="sdash-coupon-top">
                            <span className="sdash-coupon-code">{c.code}</span>
                            <span
                              className={`sdash-coupon-disc ${c.discountType === "percentage" ? "sdash-disc-pct" : "sdash-disc-fixed"}`}
                            >
                              {c.discountValue}
                              {c.discountType === "percentage" ? "%" : "₹"} OFF
                            </span>
                          </div>
                          <div className="sdash-coupon-usage">
                            <span>
                              {c.usedCount || 0} / {c.maxUses} uses
                            </span>
                            <span
                              className={`sdash-coupon-status ${expired ? "sdash-cs-expired" : c.isActive ? "sdash-cs-active" : "sdash-cs-off"}`}
                            >
                              {expired
                                ? "Expired"
                                : c.isActive
                                  ? "Active"
                                  : "Off"}
                            </span>
                          </div>
                          <div className="sdash-coupon-bar">
                            <div
                              className="sdash-coupon-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {c.validTill && (
                            <div className="sdash-coupon-date">
                              Expires:{" "}
                              {new Date(c.validTill).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── CONTENT TAB ───────────────────────────────────────────── */}
        {activeTab === "content" && (
          <>
            <div className="sdash-content-banner">
              <div className="sdash-cb-left">
                <Layers size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">Content Management</h2>
                  <p className="sdash-cb-sub">
                    Manage your blogs and their categories
                  </p>
                </div>
              </div>
              <div className="sdash-cb-stats">
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalBlogs}</span>
                  <span>Posts</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.publishedBlogs}</span>
                  <span>Published</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalBlogCats}</span>
                  <span>Categories</span>
                </div>
              </div>
            </div>

            <div className="sdash-two-col">
              {/* All blogs */}
              <div className="sdash-panel sdash-panel-tall">
                <SectionHead
                  icon={FileText}
                  title="All Recent Blogs"
                  sub={`${derived.totalBlogs} posts total`}
                  action="Manage"
                  actionPath="/admin/blogs"
                  color="amber"
                />
                <div className="sdash-panel-body">
                  {!data?.blogs?.length ? (
                    <div className="sdash-panel-empty">
                      <FileText size={28} />
                      <p>No posts yet</p>
                    </div>
                  ) : (
                    data.blogs.map((b, i) => (
                      <div
                        className="sdash-item-row sdash-item-row-tall"
                        key={b._id || i}
                      >
                        <div className="sdash-content-num">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{b.title}</span>
                          <div className="sdash-item-tags">
                            {Array.isArray(b.tags) &&
                              b.tags.slice(0, 3).map((t) => (
                                <span className="sdash-tag-pill" key={t}>
                                  {t}
                                </span>
                              ))}
                          </div>
                          <span className="sdash-item-meta">
                            {b.author && (
                              <>
                                <span>{b.author}</span>
                                <span className="sdash-dot">·</span>
                              </>
                            )}
                            {b.category?.name && (
                              <>
                                <span className="sdash-cat-ref">
                                  {b.category.name}
                                </span>
                                <span className="sdash-dot">·</span>
                              </>
                            )}
                            <span>
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={b.isPublished ? "published" : "draft"}
                          />
                          <Link to="/admin/blogs" className="sdash-item-edit">
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Blog Categories */}
              <div className="sdash-panel">
                <SectionHead
                  icon={FolderOpen}
                  title="Blog Categories"
                  sub="Organise your content"
                  action="Manage"
                  actionPath="/admin/blog-categories"
                  color="rose"
                />
                <div className="sdash-panel-body">
                  {!data?.blogCats?.length ? (
                    <div className="sdash-panel-empty">
                      <FolderOpen size={28} />
                      <p>No categories yet</p>
                    </div>
                  ) : (
                    data.blogCats.map((cat, i) => (
                      <div className="sdash-cat-row" key={cat._id || i}>
                        <div className="sdash-cat-icon">
                          <FolderOpen size={14} />
                        </div>
                        <div className="sdash-cat-info">
                          <span className="sdash-cat-name">{cat.name}</span>
                          <span className="sdash-cat-slug">/{cat.slug}</span>
                        </div>
                        <Badge status={cat.isActive ? "active" : "inactive"} />
                        <Link
                          to="/admin/blog-categories"
                          className="sdash-item-edit"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
                <div className="sdash-panel-footer">
                  <Link
                    to="/admin/blog-categories"
                    className="sdash-panel-footer-link"
                  >
                    <Plus size={13} /> Add Blog Category
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── COMMERCE TAB ──────────────────────────────────────────── */}
        {activeTab === "commerce" && (
          <>
            <div className="sdash-content-banner sdash-banner-green">
              <div className="sdash-cb-left">
                <ShoppingCart size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">Commerce Overview</h2>
                  <p className="sdash-cb-sub">
                    Products, categories, and discount management
                  </p>
                </div>
              </div>
              <div className="sdash-cb-stats">
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalProducts}</span>
                  <span>Products</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalProdCats}</span>
                  <span>Categories</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.activeCoupons}</span>
                  <span>Active Coupons</span>
                </div>
              </div>
            </div>

            <div className="sdash-three-col">
              {/* Products */}
              <div className="sdash-panel sdash-panel-span2">
                <SectionHead
                  icon={ShoppingBag}
                  title="Products"
                  sub="Your store inventory"
                  action="Manage"
                  actionPath="/admin/products"
                  color="green"
                />
                <div className="sdash-panel-body">
                  {!data?.products?.length ? (
                    <div className="sdash-panel-empty">
                      <ShoppingBag size={28} />
                      <p>No products</p>
                    </div>
                  ) : (
                    data.products.map((p, i) => (
                      <div className="sdash-item-row" key={p._id || i}>
                        <div className="sdash-item-thumb">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} />
                          ) : (
                            <div className="sdash-item-thumb-ph sdash-ph-green">
                              <ShoppingBag size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{p.name}</span>
                          <span className="sdash-item-meta">
                            <span className="sdash-price">
                              ₹{Number(p.price).toLocaleString()}
                            </span>
                            <span className="sdash-dot">·</span>
                            <span
                              className={`sdash-stock-tag ${(p.stock || 0) === 0 ? "sdash-stock-out" : (p.stock || 0) < 5 ? "sdash-stock-low" : ""}`}
                            >
                              <Package size={11} /> {p.stock ?? 0} in stock
                            </span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={p.isPublished ? "published" : "hidden"}
                          />
                          <Link
                            to="/admin/products"
                            className="sdash-item-edit"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Product Categories */}
              <div className="sdash-panel">
                <SectionHead
                  icon={Tag}
                  title="Product Categories"
                  sub="Organise store"
                  action="Manage"
                  actionPath="/admin/product-categories"
                  color="indigo"
                />
                <div className="sdash-panel-body">
                  {!data?.prodCats?.length ? (
                    <div className="sdash-panel-empty">
                      <Tag size={28} />
                      <p>No categories</p>
                    </div>
                  ) : (
                    data.prodCats.map((cat, i) => (
                      <div className="sdash-cat-row" key={cat._id || i}>
                        <div className="sdash-cat-icon sdash-cat-green">
                          <Tag size={14} />
                        </div>
                        <div className="sdash-cat-info">
                          <span className="sdash-cat-name">{cat.name}</span>
                          <span className="sdash-cat-slug">/{cat.slug}</span>
                        </div>
                        <Badge status={cat.isActive ? "active" : "inactive"} />
                      </div>
                    ))
                  )}
                </div>
                <div className="sdash-panel-footer">
                  <Link
                    to="/admin/product-categories"
                    className="sdash-panel-footer-link"
                  >
                    <Plus size={13} /> Add Category
                  </Link>
                </div>
              </div>
            </div>

            {/* Coupons detailed */}
            <div className="sdash-panel">
              <SectionHead
                icon={Ticket}
                title="All Coupons"
                sub="Discount codes for your products"
                action="Manage Coupons"
                actionPath="/admin/coupons"
                color="cyan"
              />
              <div className="sdash-panel-body">
                {!data?.coupons?.length ? (
                  <div className="sdash-panel-empty">
                    <Ticket size={28} />
                    <p>No coupons</p>
                    <Link to="/admin/coupons" className="sdash-mini-btn">
                      <Plus size={12} /> Create
                    </Link>
                  </div>
                ) : (
                  <div className="sdash-table-wrap">
                    <table className="sdash-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Discount</th>
                          <th>Used / Max</th>
                          <th>Valid Till</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.coupons.map((c, i) => {
                          const expired =
                            c.validTill && new Date(c.validTill) < new Date();
                          return (
                            <tr key={c._id || i}>
                              <td>
                                <span className="sdash-code-mono">
                                  {c.code}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={
                                    c.discountType === "percentage"
                                      ? "sdash-disc-pct"
                                      : "sdash-disc-fixed"
                                  }
                                >
                                  {c.discountValue}
                                  {c.discountType === "percentage"
                                    ? "%"
                                    : "₹"}{" "}
                                  OFF
                                </span>
                              </td>
                              <td>
                                <div className="sdash-usage-inline">
                                  <span>
                                    {c.usedCount || 0} / {c.maxUses}
                                  </span>
                                  <div className="sdash-usage-bar-sm">
                                    <div
                                      className="sdash-usage-fill-sm"
                                      style={{
                                        width: `${c.maxUses ? Math.min(100, ((c.usedCount || 0) / c.maxUses) * 100) : 0}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="sdash-td-m">
                                {c.validTill
                                  ? new Date(c.validTill).toLocaleDateString()
                                  : "—"}
                              </td>
                              <td>
                                <Badge
                                  status={
                                    expired
                                      ? "expired"
                                      : c.isActive
                                        ? "active"
                                        : "inactive"
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── PORTFOLIO TAB ─────────────────────────────────────────── */}
        {activeTab === "portfolio" && (
          <>
            <div className="sdash-content-banner sdash-banner-purple">
              <div className="sdash-cb-left">
                <Briefcase size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">Portfolio Overview</h2>
                  <p className="sdash-cb-sub">
                    Your projects and work showcase
                  </p>
                </div>
              </div>
              <div className="sdash-cb-stats">
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalProjects}</span>
                  <span>Total</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">
                    {data?.projects?.filter((p) => p.status === "in-progress")
                      ?.length || 0}
                  </span>
                  <span>In Progress</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">
                    {derived.completedProjects}
                  </span>
                  <span>Completed</span>
                </div>
              </div>
            </div>

            {/* Status breakdown */}
            <div className="sdash-status-breakdown">
              {[
                {
                  label: "Planned",
                  val:
                    data?.projects?.filter((p) => p.status === "planned")
                      ?.length || 0,
                  icon: Clock,
                  color: "#8b85ff",
                },
                {
                  label: "In Progress",
                  val:
                    data?.projects?.filter((p) => p.status === "in-progress")
                      ?.length || 0,
                  icon: Rocket,
                  color: "#f59e0b",
                },
                {
                  label: "Completed",
                  val:
                    data?.projects?.filter((p) => p.status === "completed")
                      ?.length || 0,
                  icon: CheckCircle,
                  color: "#10b981",
                },
              ].map((s, i) => (
                <div className="sdash-breakdown-card" key={i}>
                  <div
                    className="sdash-breakdown-icon"
                    style={{ color: s.color, background: `${s.color}18` }}
                  >
                    <s.icon size={18} />
                  </div>
                  <span
                    className="sdash-breakdown-val"
                    style={{ color: s.color }}
                  >
                    {s.val}
                  </span>
                  <span className="sdash-breakdown-lbl">{s.label}</span>
                  <MiniBar
                    value={s.val}
                    max={derived.totalProjects || 1}
                    color={s.color}
                  />
                </div>
              ))}
            </div>

            {/* Projects grid */}
            <div className="sdash-panel">
              <SectionHead
                icon={Briefcase}
                title="Projects"
                sub="Your portfolio showcase"
                action="Manage All"
                actionPath="/admin/projects"
                color="purple"
              />
              <div className="sdash-panel-body">
                {!data?.projects?.length ? (
                  <div className="sdash-panel-empty">
                    <Briefcase size={28} />
                    <p>No projects yet</p>
                    <Link to="/admin/projects" className="sdash-mini-btn">
                      <Plus size={12} /> Add Project
                    </Link>
                  </div>
                ) : (
                  <div className="sdash-projects-grid">
                    {data.projects.map((proj, i) => {
                      const statusColor = {
                        planned: "#8b85ff",
                        "in-progress": "#f59e0b",
                        completed: "#10b981",
                      };
                      const c = statusColor[proj.status] || "#8b85ff";
                      return (
                        <div
                          className="sdash-project-card"
                          key={proj._id || i}
                          style={{ "--pc": c }}
                        >
                          {proj.images?.[0] ? (
                            <img
                              src={proj.images[0]}
                              alt={proj.title}
                              className="sdash-proj-img"
                            />
                          ) : (
                            <div className="sdash-proj-img-ph">
                              <Code2 size={22} />
                            </div>
                          )}
                          <div className="sdash-proj-body">
                            <div className="sdash-proj-top">
                              <span className="sdash-proj-title">
                                {proj.title}
                              </span>
                              <span
                                className="sdash-proj-status-dot"
                                style={{ background: c }}
                              />
                            </div>
                            {proj.client && (
                              <p className="sdash-proj-client">
                                <User size={11} />
                                {proj.client}
                              </p>
                            )}
                            {proj.description && (
                              <p className="sdash-proj-desc">
                                {proj.description.substring(0, 80)}
                                {proj.description.length > 80 ? "…" : ""}
                              </p>
                            )}
                            <div className="sdash-proj-footer">
                              <Badge status={proj.status} />
                              {proj.endDate && (
                                <span className="sdash-proj-date">
                                  <Calendar size={11} />
                                  {new Date(proj.endDate).toLocaleDateString()}
                                </span>
                              )}
                              <Link
                                to="/admin/projects"
                                className="sdash-proj-link"
                              >
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── INTEGRATIONS STATUS (always shown at bottom) ──────────── */}
        <div className="sdash-integrations-row">
          <SectionHead
            icon={Zap}
            title="Integrations & Services"
            sub="Connection status of third-party services"
            color="purple"
          />
          <div className="sdash-int-cards">
            {[
              {
                label: "Stripe",
                enabled: data?.settings?.integrations?.stripe?.enabled,
                icon: DollarSign,
                color: "#635bff",
              },
              {
                label: "SendGrid",
                enabled: data?.settings?.integrations?.sendgrid?.enabled,
                icon: Mail,
                color: "#1ab394",
              },
              {
                label: "Razorpay",
                enabled: data?.settings?.integrations?.razorpay?.enabled,
                icon: Hash,
                color: "#2a61ff",
              },
              {
                label: "Google Analytics",
                enabled: !!data?.settings?.analytics?.googleAnalyticsId,
                icon: BarChart2,
                color: "#ea4335",
              },
              {
                label: "2FA Auth",
                enabled: data?.settings?.security?.enable2FA,
                icon: Shield,
                color: "#10b981",
              },
              {
                label: "Auto Backup",
                enabled: data?.settings?.backup?.autoBackup,
                icon: Database,
                color: "#f59e0b",
              },
              {
                label: "Cookie Consent",
                enabled: data?.settings?.compliance?.cookieConsent?.enabled,
                icon: Globe,
                color: "#8b85ff",
              },
              {
                label: "GDPR",
                enabled: data?.settings?.compliance?.gdprCompliant,
                icon: CheckCircle,
                color: "#22d3ee",
              },
            ].map((int, i) => (
              <div
                className={`sdash-int-card ${int.enabled ? "sdash-int-on" : "sdash-int-off"}`}
                key={i}
              >
                <div
                  className="sdash-int-icon"
                  style={{ color: int.enabled ? int.color : undefined }}
                >
                  <int.icon size={16} />
                </div>
                <span className="sdash-int-label">{int.label}</span>
                <span
                  className={`sdash-int-dot ${int.enabled ? "sdash-idot-on" : "sdash-idot-off"}`}
                />
              </div>
            ))}
          </div>
          <Link to="/admin/settings" className="sdash-int-manage">
            <Settings size={14} /> Manage Integrations <ArrowRight size={13} />
          </Link>
        </div>

        {/* ── SYSTEM INFO ────────────────────────────────────────────── */}
        <div className="sdash-system-row">
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Server size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">Backup Status</div>
              <div className="sdash-sys-val">
                {data?.settings?.backup?.autoBackup ? (
                  <>
                    <CheckCircle size={13} className="sdash-sys-ok" />{" "}
                    Auto-backup ON · {data.settings.backup.backupFrequency}
                  </>
                ) : (
                  <>
                    <XCircle size={13} className="sdash-sys-warn" /> Auto-backup
                    disabled
                  </>
                )}
              </div>
            </div>
            <Link to="/admin/settings" className="sdash-sys-link">
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Shield size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">Security</div>
              <div className="sdash-sys-val">
                <CheckCircle size={13} className="sdash-sys-ok" />
                Session: {data?.settings?.security?.sessionTimeout ?? 24}h · Max
                attempts: {data?.settings?.security?.maxLoginAttempts ?? 5}
              </div>
            </div>
            <Link to="/admin/settings" className="sdash-sys-link">
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Globe size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">API Base URL</div>
              <div className="sdash-sys-val sdash-sys-mono">
                {data?.settings?.apiBaseUrl || "Not configured"}
              </div>
            </div>
            <Link to="/admin/settings" className="sdash-sys-link">
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Database size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">Data Retention</div>
              <div className="sdash-sys-val">
                {data?.settings?.backup?.retentionDays ?? 30} days
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer className="sdash-footer">
          <span>Shivam Stack Admin — Built with MERN Stack</span>
          <span className="sdash-footer-dot">·</span>
          <span>Last refreshed: {time.toLocaleTimeString()}</span>
          <span className="sdash-footer-dot">·</span>
          <Link to="/admin/settings" className="sdash-footer-link">
            <Settings size={12} /> Settings
          </Link>
        </footer>
      </main>
    </div>
  );
};

// Fix the dark/light class reference bug
const isDash = false; // placeholder — actual component uses isDarkMode from context

// Wrap with actual context usage
const AdminDashboardWrapper = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  const fetchDashboard = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const headers = {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        };
        const [
          statsRes,
          productsRes,
          blogsRes,
          projectsRes,
          couponsRes,
          blogCatsRes,
          prodCatsRes,
          settingsRes,
        ] = await Promise.all([
          fetch("/admin/dashboard/stats", { headers }),
          fetch("/admin/products?limit=5", { headers }),
          fetch("/admin/blogs?limit=5", { headers }),
          fetch("/admin/projects?limit=6", { headers }),
          fetch("/admin/coupons?limit=5", { headers }),
          fetch("/admin/blog-categories", { headers }),
          fetch("/admin/product-categories", { headers }),
          fetch("/admin/main-settings", { headers }),
        ]);
        const [
          stats,
          products,
          blogs,
          projects,
          coupons,
          blogCats,
          prodCats,
          settings,
        ] = await Promise.all([
          statsRes.ok ? statsRes.json() : {},
          productsRes.ok ? productsRes.json() : {},
          blogsRes.ok ? blogsRes.json() : {},
          projectsRes.ok ? projectsRes.json() : {},
          couponsRes.ok ? couponsRes.json() : {},
          blogCatsRes.ok ? blogCatsRes.json() : {},
          prodCatsRes.ok ? prodCatsRes.json() : {},
          settingsRes.ok ? settingsRes.json() : {},
        ]);
        setData({
          stats: stats.data || stats,
          products: (products.data || products)?.slice?.(0, 5) || [],
          blogs: (blogs.data || blogs)?.slice?.(0, 5) || [],
          projects: (projects.data || projects)?.slice?.(0, 6) || [],
          coupons: (coupons.data || coupons)?.slice?.(0, 5) || [],
          blogCats: blogCats.data || blogCats || [],
          prodCats: prodCats.data || prodCats || [],
          settings: settings.data || settings || {},
        });
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to load dashboard.",
          icon: "error",
          ...swalCfg(isDarkMode),
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isDarkMode],
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const derived = React.useMemo(() => {
    if (!data) return {};
    const s = data.stats || {};
    return {
      totalProducts: s.totalProducts ?? data.products?.length ?? 0,
      publishedProducts:
        s.publishedProducts ??
        data.products?.filter((p) => p.isPublished)?.length ??
        0,
      totalBlogs: s.totalBlogs ?? data.blogs?.length ?? 0,
      publishedBlogs:
        s.publishedBlogs ??
        data.blogs?.filter((b) => b.isPublished)?.length ??
        0,
      totalProjects: s.totalProjects ?? data.projects?.length ?? 0,
      completedProjects:
        s.completedProjects ??
        data.projects?.filter((p) => p.status === "completed")?.length ??
        0,
      totalCoupons: s.totalCoupons ?? data.coupons?.length ?? 0,
      activeCoupons:
        s.activeCoupons ?? data.coupons?.filter((c) => c.isActive)?.length ?? 0,
      totalBlogCats: s.totalBlogCats ?? data.blogCats?.length ?? 0,
      totalProdCats: s.totalProdCats ?? data.prodCats?.length ?? 0,
      totalRevenue: s.totalRevenue ?? 0,
      totalOrders: s.totalOrders ?? 0,
      totalUsers: s.totalUsers ?? 0,
      revenueChange: s.revenueChange ?? 0,
      ordersChange: s.ordersChange ?? 0,
      usersChange: s.usersChange ?? 0,
      revenueSparkline: s.revenueSparkline ?? [
        4, 7, 5, 9, 6, 11, 8, 13, 10, 14, 12, 16,
      ],
      ordersSparkline: s.ordersSparkline ?? [
        2, 4, 3, 6, 5, 7, 4, 8, 6, 9, 7, 10,
      ],
      visitorSparkline: s.visitorSparkline ?? [
        10, 14, 12, 18, 15, 20, 17, 22, 19, 24, 21, 26,
      ],
    };
  }, [data]);

  const adminName = data?.settings?.appName || "Shivam";

  if (loading)
    return (
      <div className={`sdash-root ${isDarkMode ? "dark" : "light"}`}>
        <div className="sdash-loading-screen">
          <div className="sdash-loading-logo">
            <LayoutDashboard size={32} />
          </div>
          <div className="sdash-loading-ring" />
          <p className="sdash-loading-text">Loading Dashboard…</p>
        </div>
      </div>
    );

  return (
    <div className={`sdash-root ${isDarkMode ? "dark" : "light"}`}>
      <div className="sdash-ambient" aria-hidden="true">
        <div className="sdash-orb sdash-orb-1" />
        <div className="sdash-orb sdash-orb-2" />
        <div className="sdash-orb sdash-orb-3" />
        <div className="sdash-grid-lines" />
      </div>

      {/* TOPBAR */}
      <header className="sdash-topbar">
        <div className="sdash-topbar-left">
          <div className="sdash-logo">
            <div className="sdash-logo-icon">
              <Code2 size={18} />
            </div>
            <span className="sdash-logo-text">
              Shivam<strong>Stack</strong>
            </span>
          </div>
          <div className="sdash-topbar-divider" />
          <nav className="sdash-topbar-tabs" aria-label="Dashboard tabs">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "content", label: "Content", icon: Layers },
              { id: "commerce", label: "Commerce", icon: ShoppingCart },
              { id: "portfolio", label: "Portfolio", icon: Briefcase },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`sdash-tab-btn ${activeTab === tab.id ? "sdash-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="sdash-topbar-right">
          <div className="sdash-live-clock">
            <Circle size={7} className="sdash-clock-dot" />
            {time.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <button
            className={`sdash-refresh-btn ${refreshing ? "sdash-refreshing" : ""}`}
            onClick={() => fetchDashboard(true)}
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <Link
            to="/admin/settings"
            className="sdash-topbar-settings"
            title="Settings"
          >
            <Settings size={16} />
          </Link>
          <div className="sdash-admin-pill">
            <div className="sdash-admin-avatar">
              <User size={14} />
            </div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="sdash-hero">
        <div className="sdash-hero-text">
          <div className="sdash-hero-eyebrow">
            <Sparkles size={13} />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="sdash-hero-title">
            {getGreeting()},{" "}
            <span className="sdash-hero-name">{adminName}</span> 👋
          </h1>
          <p className="sdash-hero-sub">
            Here's what's happening with your portfolio platform today.
          </p>
        </div>
        <div className="sdash-hero-quick">
          {QUICK_LINKS.map((ql) => (
            <Link
              key={ql.label}
              to={ql.path}
              className={`sdash-quick-chip sdash-chip-${ql.color}`}
            >
              <ql.icon size={13} />
              {ql.label}
            </Link>
          ))}
        </div>
      </section>

      {data?.settings?.security?.isMaintenanceMode && (
        <div className="sdash-maintenance-banner">
          <AlertTriangle size={16} />
          <div>
            <strong>Maintenance Mode is ON</strong>
            <span>
              {" "}
              — Your site is hidden from visitors.{" "}
              {data.settings.security.maintenanceMessage}
            </span>
          </div>
          <Link to="/admin/settings" className="sdash-maint-link">
            Fix in Settings <ArrowRight size={13} />
          </Link>
        </div>
      )}

      <main className="sdash-main">
        {activeTab === "overview" && (
          <>
            <div className="sdash-kpi-grid">
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`₹${(derived.totalRevenue || 0).toLocaleString()}`}
                change={derived.revenueChange}
                changeDir="up"
                color="green"
                sparkData={derived.revenueSparkline}
                sub="All-time earnings"
                link="/admin/orders"
                delay={0}
              />
              <StatCard
                icon={ShoppingCart}
                label="Total Orders"
                value={derived.totalOrders}
                change={derived.ordersChange}
                changeDir="up"
                color="purple"
                sparkData={derived.ordersSparkline}
                sub="Completed purchases"
                link="/admin/orders"
                delay={60}
              />
              <StatCard
                icon={Users}
                label="Site Visitors"
                value={derived.totalUsers}
                change={derived.usersChange}
                changeDir="up"
                color="cyan"
                sparkData={derived.visitorSparkline}
                sub="Platform visitors"
                delay={120}
              />
              <StatCard
                icon={ShoppingBag}
                label="Products"
                value={derived.totalProducts}
                sub={`${derived.publishedProducts} live`}
                color="amber"
                link="/admin/products"
                delay={180}
              />
              <StatCard
                icon={FileText}
                label="Blog Posts"
                value={derived.totalBlogs}
                sub={`${derived.publishedBlogs} published`}
                color="rose"
                link="/admin/blogs"
                delay={240}
              />
              <StatCard
                icon={Briefcase}
                label="Projects"
                value={derived.totalProjects}
                sub={`${derived.completedProjects} completed`}
                color="indigo"
                link="/admin/projects"
                delay={300}
              />
            </div>

            <div className="sdash-secondary-row">
              {[
                {
                  icon: Ticket,
                  label: "Active Coupons",
                  val: derived.activeCoupons,
                  total: derived.totalCoupons,
                  path: "/admin/coupons",
                  color: "#22d3ee",
                },
                {
                  icon: FolderOpen,
                  label: "Blog Categories",
                  val: derived.totalBlogCats,
                  total: null,
                  path: "/admin/blog-categories",
                  color: "#f59e0b",
                },
                {
                  icon: Tag,
                  label: "Product Categories",
                  val: derived.totalProdCats,
                  total: null,
                  path: "/admin/product-categories",
                  color: "#10b981",
                },
                {
                  icon: BarChart2,
                  label: "Published Rate",
                  val: `${derived.totalBlogs > 0 ? Math.round((derived.publishedBlogs / derived.totalBlogs) * 100) : 0}%`,
                  total: null,
                  path: "/admin/blogs",
                  color: "#8b85ff",
                },
              ].map((item, i) => (
                <Link key={i} to={item.path} className="sdash-sec-stat">
                  <div
                    className="sdash-sec-stat-icon"
                    style={{ color: item.color, background: `${item.color}18` }}
                  >
                    <item.icon size={16} />
                  </div>
                  <div className="sdash-sec-stat-body">
                    <span
                      className="sdash-sec-stat-val"
                      style={{ color: item.color }}
                    >
                      {item.val}
                    </span>
                    {item.total !== null && (
                      <span className="sdash-sec-stat-total">
                        {" "}
                        / {item.total}
                      </span>
                    )}
                    <p className="sdash-sec-stat-lbl">{item.label}</p>
                  </div>
                  <ArrowUpRight size={14} className="sdash-sec-stat-arrow" />
                </Link>
              ))}
            </div>

            {data?.settings?.companyName && (
              <div className="sdash-site-snapshot">
                <div className="sdash-snapshot-brand">
                  {data.settings.branding?.logoUrl ? (
                    <img
                      src={data.settings.branding.logoUrl}
                      alt="logo"
                      className="sdash-snap-logo"
                    />
                  ) : (
                    <div className="sdash-snap-logo-fallback">
                      <Code2 size={20} />
                    </div>
                  )}
                  <div>
                    <div className="sdash-snap-name">
                      {data.settings.appName || "Shivam Stack"}
                    </div>
                    <div className="sdash-snap-legal">
                      {data.settings.companyLegalName ||
                        data.settings.companyName}
                    </div>
                  </div>
                </div>
                <div className="sdash-snapshot-fields">
                  {data.settings.websiteUrl && (
                    <a
                      href={data.settings.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="sdash-snap-field"
                    >
                      <Globe size={13} />
                      <span>{data.settings.websiteUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                  {data.settings.officialEmails?.[0] && (
                    <span className="sdash-snap-field">
                      <Mail size={13} />
                      {data.settings.officialEmails[0].address}
                    </span>
                  )}
                  {data.settings.contactNumbers?.[0] && (
                    <span className="sdash-snap-field">
                      <Phone size={13} />
                      {data.settings.contactNumbers[0].countryCode}
                      {data.settings.contactNumbers[0].number}
                    </span>
                  )}
                  <span
                    className={`sdash-snap-field ${data.settings.security?.isMaintenanceMode ? "sdash-snap-warn" : "sdash-snap-ok"}`}
                  >
                    {data.settings.security?.isMaintenanceMode ? (
                      <AlertTriangle size={13} />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    {data.settings.security?.isMaintenanceMode
                      ? "Maintenance Mode"
                      : "Site Live"}
                  </span>
                  <span className="sdash-snap-field">
                    <Shield size={13} />
                    2FA:{" "}
                    {data.settings.security?.enable2FA ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <Link to="/admin/settings" className="sdash-snap-edit">
                  <Settings size={14} /> Edit Settings
                </Link>
              </div>
            )}

            <div className="sdash-two-col">
              <div className="sdash-panel">
                <SectionHead
                  icon={ShoppingBag}
                  title="Recent Products"
                  sub="Latest store additions"
                  action="View All"
                  actionPath="/admin/products"
                  color="green"
                />
                <div className="sdash-panel-body">
                  {!data?.products?.length ? (
                    <div className="sdash-panel-empty">
                      <ShoppingBag size={28} />
                      <p>No products yet</p>
                      <Link to="/admin/products" className="sdash-mini-btn">
                        <Plus size={12} /> Add
                      </Link>
                    </div>
                  ) : (
                    data.products.map((p, i) => (
                      <div className="sdash-item-row" key={p._id || i}>
                        <div className="sdash-item-thumb">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} />
                          ) : (
                            <div className="sdash-item-thumb-ph">
                              <ShoppingBag size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{p.name}</span>
                          <span className="sdash-item-meta">
                            <span className="sdash-price">
                              ₹{Number(p.price).toLocaleString()}
                            </span>
                            <span className="sdash-dot">·</span>
                            <span>Stock: {p.stock ?? 0}</span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={p.isPublished ? "published" : "hidden"}
                          />
                          <Link
                            to="/admin/products"
                            className="sdash-item-edit"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="sdash-panel">
                <SectionHead
                  icon={FileText}
                  title="Recent Blog Posts"
                  sub="Your latest articles"
                  action="View All"
                  actionPath="/admin/blogs"
                  color="amber"
                />
                <div className="sdash-panel-body">
                  {!data?.blogs?.length ? (
                    <div className="sdash-panel-empty">
                      <FileText size={28} />
                      <p>No posts yet</p>
                      <Link to="/admin/blogs" className="sdash-mini-btn">
                        <Plus size={12} /> Write
                      </Link>
                    </div>
                  ) : (
                    data.blogs.map((b, i) => (
                      <div className="sdash-item-row" key={b._id || i}>
                        <div className="sdash-item-thumb">
                          {b.featuredImage ? (
                            <img src={b.featuredImage} alt={b.title} />
                          ) : (
                            <div className="sdash-item-thumb-ph sdash-ph-amber">
                              <FileText size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{b.title}</span>
                          <span className="sdash-item-meta">
                            {b.author && (
                              <>
                                <span>{b.author}</span>
                                <span className="sdash-dot">·</span>
                              </>
                            )}
                            <span>
                              {b.publishedAt
                                ? new Date(b.publishedAt).toLocaleDateString()
                                : new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={b.isPublished ? "published" : "draft"}
                          />
                          <Link to="/admin/blogs" className="sdash-item-edit">
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="sdash-panel">
              <SectionHead
                icon={Ticket}
                title="Coupon Overview"
                sub="Discount codes and usage"
                action="Manage"
                actionPath="/admin/coupons"
                color="cyan"
              />
              <div className="sdash-panel-body">
                {!data?.coupons?.length ? (
                  <div className="sdash-panel-empty">
                    <Ticket size={28} />
                    <p>No coupons</p>
                    <Link to="/admin/coupons" className="sdash-mini-btn">
                      <Plus size={12} /> Create
                    </Link>
                  </div>
                ) : (
                  <div className="sdash-coupon-grid">
                    {data.coupons.map((c, i) => {
                      const expired =
                        c.validTill && new Date(c.validTill) < new Date();
                      const pct = c.maxUses
                        ? Math.min(
                            100,
                            Math.round(((c.usedCount || 0) / c.maxUses) * 100),
                          )
                        : 0;
                      return (
                        <div
                          className={`sdash-coupon-card ${expired ? "sdash-coupon-expired" : !c.isActive ? "sdash-coupon-off" : ""}`}
                          key={c._id || i}
                        >
                          <div className="sdash-coupon-top">
                            <span className="sdash-coupon-code">{c.code}</span>
                            <span
                              className={
                                c.discountType === "percentage"
                                  ? "sdash-disc-pct"
                                  : "sdash-disc-fixed"
                              }
                            >
                              {c.discountValue}
                              {c.discountType === "percentage" ? "%" : "₹"} OFF
                            </span>
                          </div>
                          <div className="sdash-coupon-usage">
                            <span>
                              {c.usedCount || 0} / {c.maxUses} uses
                            </span>
                            <span
                              className={`sdash-coupon-status ${expired ? "sdash-cs-expired" : c.isActive ? "sdash-cs-active" : "sdash-cs-off"}`}
                            >
                              {expired
                                ? "Expired"
                                : c.isActive
                                  ? "Active"
                                  : "Off"}
                            </span>
                          </div>
                          <div className="sdash-coupon-bar">
                            <div
                              className="sdash-coupon-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {c.validTill && (
                            <div className="sdash-coupon-date">
                              Expires:{" "}
                              {new Date(c.validTill).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "content" && (
          <>
            <div className="sdash-content-banner">
              <div className="sdash-cb-left">
                <Layers size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">Content Management</h2>
                  <p className="sdash-cb-sub">
                    Manage your blogs and categories
                  </p>
                </div>
              </div>
              <div className="sdash-cb-stats">
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalBlogs}</span>
                  <span>Posts</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.publishedBlogs}</span>
                  <span>Published</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalBlogCats}</span>
                  <span>Categories</span>
                </div>
              </div>
            </div>
            <div className="sdash-two-col">
              <div className="sdash-panel sdash-panel-tall">
                <SectionHead
                  icon={FileText}
                  title="All Recent Blogs"
                  sub={`${derived.totalBlogs} posts total`}
                  action="Manage"
                  actionPath="/admin/blogs"
                  color="amber"
                />
                <div className="sdash-panel-body">
                  {!data?.blogs?.length ? (
                    <div className="sdash-panel-empty">
                      <FileText size={28} />
                      <p>No posts yet</p>
                    </div>
                  ) : (
                    data.blogs.map((b, i) => (
                      <div
                        className="sdash-item-row sdash-item-row-tall"
                        key={b._id || i}
                      >
                        <div className="sdash-content-num">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{b.title}</span>
                          <div className="sdash-item-tags">
                            {Array.isArray(b.tags) &&
                              b.tags.slice(0, 3).map((t) => (
                                <span className="sdash-tag-pill" key={t}>
                                  {t}
                                </span>
                              ))}
                          </div>
                          <span className="sdash-item-meta">
                            {b.author && (
                              <>
                                <span>{b.author}</span>
                                <span className="sdash-dot">·</span>
                              </>
                            )}
                            {b.category?.name && (
                              <>
                                <span className="sdash-cat-ref">
                                  {b.category.name}
                                </span>
                                <span className="sdash-dot">·</span>
                              </>
                            )}
                            <span>
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={b.isPublished ? "published" : "draft"}
                          />
                          <Link to="/admin/blogs" className="sdash-item-edit">
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="sdash-panel">
                <SectionHead
                  icon={FolderOpen}
                  title="Blog Categories"
                  sub="Content organisation"
                  action="Manage"
                  actionPath="/admin/blog-categories"
                  color="rose"
                />
                <div className="sdash-panel-body">
                  {!data?.blogCats?.length ? (
                    <div className="sdash-panel-empty">
                      <FolderOpen size={28} />
                      <p>No categories</p>
                    </div>
                  ) : (
                    data.blogCats.map((cat, i) => (
                      <div className="sdash-cat-row" key={cat._id || i}>
                        <div className="sdash-cat-icon">
                          <FolderOpen size={14} />
                        </div>
                        <div className="sdash-cat-info">
                          <span className="sdash-cat-name">{cat.name}</span>
                          <span className="sdash-cat-slug">/{cat.slug}</span>
                        </div>
                        <Badge status={cat.isActive ? "active" : "inactive"} />
                        <Link
                          to="/admin/blog-categories"
                          className="sdash-item-edit"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
                <div className="sdash-panel-footer">
                  <Link
                    to="/admin/blog-categories"
                    className="sdash-panel-footer-link"
                  >
                    <Plus size={13} /> Add Blog Category
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "commerce" && (
          <>
            <div className="sdash-content-banner sdash-banner-green">
              <div className="sdash-cb-left">
                <ShoppingCart size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">Commerce Overview</h2>
                  <p className="sdash-cb-sub">Products, categories, coupons</p>
                </div>
              </div>
              <div className="sdash-cb-stats">
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalProducts}</span>
                  <span>Products</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalProdCats}</span>
                  <span>Categories</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.activeCoupons}</span>
                  <span>Active Coupons</span>
                </div>
              </div>
            </div>
            <div className="sdash-three-col">
              <div className="sdash-panel sdash-panel-span2">
                <SectionHead
                  icon={ShoppingBag}
                  title="Products"
                  sub="Your inventory"
                  action="Manage"
                  actionPath="/admin/products"
                  color="green"
                />
                <div className="sdash-panel-body">
                  {!data?.products?.length ? (
                    <div className="sdash-panel-empty">
                      <ShoppingBag size={28} />
                      <p>No products</p>
                    </div>
                  ) : (
                    data.products.map((p, i) => (
                      <div className="sdash-item-row" key={p._id || i}>
                        <div className="sdash-item-thumb">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} />
                          ) : (
                            <div className="sdash-item-thumb-ph sdash-ph-green">
                              <ShoppingBag size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{p.name}</span>
                          <span className="sdash-item-meta">
                            <span className="sdash-price">
                              ₹{Number(p.price).toLocaleString()}
                            </span>
                            <span className="sdash-dot">·</span>
                            <span
                              className={`sdash-stock-tag ${(p.stock || 0) === 0 ? "sdash-stock-out" : (p.stock || 0) < 5 ? "sdash-stock-low" : ""}`}
                            >
                              <Package size={11} /> {p.stock ?? 0}
                            </span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={p.isPublished ? "published" : "hidden"}
                          />
                          <Link
                            to="/admin/products"
                            className="sdash-item-edit"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="sdash-panel">
                <SectionHead
                  icon={Tag}
                  title="Product Categories"
                  sub="Organise store"
                  action="Manage"
                  actionPath="/admin/product-categories"
                  color="indigo"
                />
                <div className="sdash-panel-body">
                  {!data?.prodCats?.length ? (
                    <div className="sdash-panel-empty">
                      <Tag size={28} />
                      <p>No categories</p>
                    </div>
                  ) : (
                    data.prodCats.map((cat, i) => (
                      <div className="sdash-cat-row" key={cat._id || i}>
                        <div className="sdash-cat-icon sdash-cat-green">
                          <Tag size={14} />
                        </div>
                        <div className="sdash-cat-info">
                          <span className="sdash-cat-name">{cat.name}</span>
                          <span className="sdash-cat-slug">/{cat.slug}</span>
                        </div>
                        <Badge status={cat.isActive ? "active" : "inactive"} />
                      </div>
                    ))
                  )}
                </div>
                <div className="sdash-panel-footer">
                  <Link
                    to="/admin/product-categories"
                    className="sdash-panel-footer-link"
                  >
                    <Plus size={13} /> Add Category
                  </Link>
                </div>
              </div>
            </div>
            <div className="sdash-panel">
              <SectionHead
                icon={Ticket}
                title="Coupons"
                sub="Discount codes"
                action="Manage"
                actionPath="/admin/coupons"
                color="cyan"
              />
              <div className="sdash-panel-body">
                {!data?.coupons?.length ? (
                  <div className="sdash-panel-empty">
                    <Ticket size={28} />
                    <p>No coupons</p>
                  </div>
                ) : (
                  <div className="sdash-table-wrap">
                    <table className="sdash-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Discount</th>
                          <th>Used/Max</th>
                          <th>Valid Till</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.coupons.map((c, i) => {
                          const expired =
                            c.validTill && new Date(c.validTill) < new Date();
                          return (
                            <tr key={c._id || i}>
                              <td>
                                <span className="sdash-code-mono">
                                  {c.code}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={
                                    c.discountType === "percentage"
                                      ? "sdash-disc-pct"
                                      : "sdash-disc-fixed"
                                  }
                                >
                                  {c.discountValue}
                                  {c.discountType === "percentage"
                                    ? "%"
                                    : "₹"}{" "}
                                  OFF
                                </span>
                              </td>
                              <td>
                                <div className="sdash-usage-inline">
                                  <span>
                                    {c.usedCount || 0}/{c.maxUses}
                                  </span>
                                  <div className="sdash-usage-bar-sm">
                                    <div
                                      className="sdash-usage-fill-sm"
                                      style={{
                                        width: `${c.maxUses ? Math.min(100, ((c.usedCount || 0) / c.maxUses) * 100) : 0}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="sdash-td-m">
                                {c.validTill
                                  ? new Date(c.validTill).toLocaleDateString()
                                  : "—"}
                              </td>
                              <td>
                                <Badge
                                  status={
                                    expired
                                      ? "expired"
                                      : c.isActive
                                        ? "active"
                                        : "inactive"
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "portfolio" && (
          <>
            <div className="sdash-content-banner sdash-banner-purple">
              <div className="sdash-cb-left">
                <Briefcase size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">Portfolio Overview</h2>
                  <p className="sdash-cb-sub">Your projects showcase</p>
                </div>
              </div>
              <div className="sdash-cb-stats">
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalProjects}</span>
                  <span>Total</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">
                    {data?.projects?.filter((p) => p.status === "in-progress")
                      ?.length || 0}
                  </span>
                  <span>In Progress</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">
                    {derived.completedProjects}
                  </span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
            <div className="sdash-status-breakdown">
              {[
                {
                  label: "Planned",
                  val:
                    data?.projects?.filter((p) => p.status === "planned")
                      ?.length || 0,
                  icon: Clock,
                  color: "#8b85ff",
                },
                {
                  label: "In Progress",
                  val:
                    data?.projects?.filter((p) => p.status === "in-progress")
                      ?.length || 0,
                  icon: Rocket,
                  color: "#f59e0b",
                },
                {
                  label: "Completed",
                  val:
                    data?.projects?.filter((p) => p.status === "completed")
                      ?.length || 0,
                  icon: CheckCircle,
                  color: "#10b981",
                },
              ].map((s, i) => (
                <div className="sdash-breakdown-card" key={i}>
                  <div
                    className="sdash-breakdown-icon"
                    style={{ color: s.color, background: `${s.color}18` }}
                  >
                    <s.icon size={18} />
                  </div>
                  <span
                    className="sdash-breakdown-val"
                    style={{ color: s.color }}
                  >
                    {s.val}
                  </span>
                  <span className="sdash-breakdown-lbl">{s.label}</span>
                  <MiniBar
                    value={s.val}
                    max={derived.totalProjects || 1}
                    color={s.color}
                  />
                </div>
              ))}
            </div>
            <div className="sdash-panel">
              <SectionHead
                icon={Briefcase}
                title="Projects"
                sub="Portfolio showcase"
                action="Manage All"
                actionPath="/admin/projects"
                color="purple"
              />
              <div className="sdash-panel-body">
                {!data?.projects?.length ? (
                  <div className="sdash-panel-empty">
                    <Briefcase size={28} />
                    <p>No projects yet</p>
                    <Link to="/admin/projects" className="sdash-mini-btn">
                      <Plus size={12} /> Add
                    </Link>
                  </div>
                ) : (
                  <div className="sdash-projects-grid">
                    {data.projects.map((proj, i) => {
                      const sc = {
                        planned: "#8b85ff",
                        "in-progress": "#f59e0b",
                        completed: "#10b981",
                      };
                      const c = sc[proj.status] || "#8b85ff";
                      return (
                        <div
                          className="sdash-project-card"
                          key={proj._id || i}
                          style={{ "--pc": c }}
                        >
                          {proj.images?.[0] ? (
                            <img
                              src={proj.images[0]}
                              alt={proj.title}
                              className="sdash-proj-img"
                            />
                          ) : (
                            <div className="sdash-proj-img-ph">
                              <Code2 size={22} />
                            </div>
                          )}
                          <div className="sdash-proj-body">
                            <div className="sdash-proj-top">
                              <span className="sdash-proj-title">
                                {proj.title}
                              </span>
                              <span
                                className="sdash-proj-status-dot"
                                style={{ background: c }}
                              />
                            </div>
                            {proj.client && (
                              <p className="sdash-proj-client">
                                <User size={11} />
                                {proj.client}
                              </p>
                            )}
                            {proj.description && (
                              <p className="sdash-proj-desc">
                                {proj.description.substring(0, 80)}
                                {proj.description.length > 80 ? "…" : ""}
                              </p>
                            )}
                            <div className="sdash-proj-footer">
                              <Badge status={proj.status} />
                              {proj.endDate && (
                                <span className="sdash-proj-date">
                                  <Calendar size={11} />
                                  {new Date(proj.endDate).toLocaleDateString()}
                                </span>
                              )}
                              <Link
                                to="/admin/projects"
                                className="sdash-proj-link"
                              >
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Integrations & System — always visible */}
        <div className="sdash-integrations-row">
          <SectionHead
            icon={Zap}
            title="Integrations & Services"
            sub="Connection status"
            color="purple"
          />
          <div className="sdash-int-cards">
            {[
              {
                label: "Stripe",
                enabled: data?.settings?.integrations?.stripe?.enabled,
                icon: DollarSign,
                color: "#635bff",
              },
              {
                label: "SendGrid",
                enabled: data?.settings?.integrations?.sendgrid?.enabled,
                icon: Mail,
                color: "#1ab394",
              },
              {
                label: "Razorpay",
                enabled: data?.settings?.integrations?.razorpay?.enabled,
                icon: Hash,
                color: "#2a61ff",
              },
              {
                label: "Google Analytics",
                enabled: !!data?.settings?.analytics?.googleAnalyticsId,
                icon: BarChart2,
                color: "#ea4335",
              },
              {
                label: "2FA Auth",
                enabled: data?.settings?.security?.enable2FA,
                icon: Shield,
                color: "#10b981",
              },
              {
                label: "Auto Backup",
                enabled: data?.settings?.backup?.autoBackup,
                icon: Database,
                color: "#f59e0b",
              },
              {
                label: "Cookie Consent",
                enabled: data?.settings?.compliance?.cookieConsent?.enabled,
                icon: Globe,
                color: "#8b85ff",
              },
              {
                label: "GDPR",
                enabled: data?.settings?.compliance?.gdprCompliant,
                icon: CheckCircle,
                color: "#22d3ee",
              },
            ].map((int, i) => (
              <div
                className={`sdash-int-card ${int.enabled ? "sdash-int-on" : "sdash-int-off"}`}
                key={i}
              >
                <div
                  className="sdash-int-icon"
                  style={{ color: int.enabled ? int.color : undefined }}
                >
                  <int.icon size={16} />
                </div>
                <span className="sdash-int-label">{int.label}</span>
                <span
                  className={`sdash-int-dot ${int.enabled ? "sdash-idot-on" : "sdash-idot-off"}`}
                />
              </div>
            ))}
          </div>
          <Link to="/admin/settings" className="sdash-int-manage">
            <Settings size={14} /> Manage Integrations <ArrowRight size={13} />
          </Link>
        </div>

        <div className="sdash-system-row">
          {[
            {
              icon: Server,
              title: "Backup Status",
              val: data?.settings?.backup?.autoBackup
                ? `Auto ON · ${data.settings.backup.backupFrequency}`
                : "Auto-backup disabled",
              ok: data?.settings?.backup?.autoBackup,
            },
            {
              icon: Shield,
              title: "Security",
              val: `Session: ${data?.settings?.security?.sessionTimeout ?? 24}h · Max attempts: ${data?.settings?.security?.maxLoginAttempts ?? 5}`,
              ok: true,
            },
            {
              icon: Globe,
              title: "API Base URL",
              val: data?.settings?.apiBaseUrl || "Not configured",
              mono: true,
              ok: !!data?.settings?.apiBaseUrl,
            },
            {
              icon: Database,
              title: "Data Retention",
              val: `${data?.settings?.backup?.retentionDays ?? 30} days`,
              ok: true,
            },
          ].map((sys, i) => (
            <div className="sdash-sys-card" key={i}>
              <div className="sdash-sys-icon">
                <sys.icon size={16} />
              </div>
              <div className="sdash-sys-body">
                <div className="sdash-sys-title">{sys.title}</div>
                <div
                  className={`sdash-sys-val ${sys.mono ? "sdash-sys-mono" : ""}`}
                >
                  {sys.ok ? (
                    <CheckCircle size={13} className="sdash-sys-ok" />
                  ) : (
                    <XCircle size={13} className="sdash-sys-warn" />
                  )}
                  {sys.val}
                </div>
              </div>
              <Link to="/admin/settings" className="sdash-sys-link">
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <footer className="sdash-footer">
          <span>Shivam Stack Admin — Built with MERN Stack</span>
          <span className="sdash-footer-dot">·</span>
          <span>Last refresh: {time.toLocaleTimeString()}</span>
          <span className="sdash-footer-dot">·</span>
          <Link to="/admin/settings" className="sdash-footer-link">
            <Settings size={12} /> Settings
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboardWrapper;
