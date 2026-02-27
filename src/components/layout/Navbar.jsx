import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Code2, ShoppingCart, LayoutDashboard, Zap, Wrench,
  FolderOpen, Star, BookOpen, Package, FileText, Database,
  Layers, User, LogIn, UserPlus, LogOut, Settings,
  ShieldCheck, DownloadCloud, ClipboardList, ChevronDown,
  Sun, Moon, Menu, X, Briefcase, Sparkles, ArrowRight,
  Globe, BarChart3, Terminal, Rocket, MessageSquare,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

/* ─────────────────────────────────────────────────────────────────────────────
   NAV CONFIG — all links & dropdowns in one place
───────────────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "home", label: "Home", to: "/" },

  {
    id: "services",
    label: "Services",
    dropdown: "wide",
    items: [
      {
        to:    "/services/full-stack",
        icon:  Layers,
        color: "#6366f1",
        bg:    "rgba(99,102,241,0.1)",
        title: "Full Stack Development",
        desc:  "MERN apps, SaaS, dashboards",
      },
      {
        to:    "/services/ecommerce",
        icon:  ShoppingCart,
        color: "#f59e0b",
        bg:    "rgba(245,158,11,0.1)",
        title: "E-Commerce Solutions",
        desc:  "Stores, payments, digital downloads",
      },
      {
        to:    "/services/admin-panel",
        icon:  LayoutDashboard,
        color: "#10b981",
        bg:    "rgba(16,185,129,0.1)",
        title: "Admin Panel & CMS",
        desc:  "Custom panels, roles, analytics",
      },
      {
        to:    "/services/api-development",
        icon:  Zap,
        color: "#06b6d4",
        bg:    "rgba(6,182,212,0.1)",
        title: "API Development",
        desc:  "REST APIs, integrations, JWT",
      },
      {
        to:    "/services/performance",
        icon:  BarChart3,
        color: "#f43f5e",
        bg:    "rgba(244,63,94,0.1)",
        title: "Performance Optimization",
        desc:  "Speed, Core Web Vitals, scaling",
      },
      {
        to:    "/services/portfolio",
        icon:  Briefcase,
        color: "#8b5cf6",
        bg:    "rgba(139,92,246,0.1)",
        title: "Portfolio Websites",
        desc:  "Personal brand, SEO-optimized",
      },
      {
        to:    "/services/devops",
        icon:  Terminal,
        color: "#ec4899",
        bg:    "rgba(236,72,153,0.1)",
        title: "DevOps & Deployment",
        desc:  "VPS, Nginx, CI/CD, SSL setup",
      },
      {
        to:    "/services/maintenance",
        icon:  Wrench,
        color: "#14b8a6",
        bg:    "rgba(20,184,166,0.1)",
        title: "Maintenance & Support",
        desc:  "Retainers, updates, monitoring",
      },
    ],
    footer: { label: "View all services →", to: "/services" },
  },

  {
    id: "work",
    label: "Work",
    dropdown: "wide",
    items: [
      {
        to:    "/work",
        icon:  FolderOpen,
        color: "#8b5cf6",
        bg:    "rgba(139,92,246,0.1)",
        title: "All Projects",
        desc:  "Browse the full portfolio",
      },
      {
        to:    "/work/featured",
        icon:  Star,
        color: "#f59e0b",
        bg:    "rgba(245,158,11,0.1)",
        title: "Featured Projects",
        desc:  "Handpicked best work",
      },
      {
        to:    "/work/case-studies",
        icon:  BookOpen,
        color: "#06b6d4",
        bg:    "rgba(6,182,212,0.1)",
        title: "Case Studies",
        desc:  "Deep dives & problem-solving",
      },
      {
        to:    "/work/open-source",
        icon:  Globe,
        color: "#10b981",
        bg:    "rgba(16,185,129,0.1)",
        title: "Open Source",
        desc:  "GitHub projects & contributions",
      },
    ],
    footer: { label: "See all work →", to: "/work" },
  },

  {
    id: "products",
    label: "Products",
    dropdown: "wide",
    items: [
      {
        to:    "/products",
        icon:  Package,
        color: "#6366f1",
        bg:    "rgba(99,102,241,0.1)",
        title: "All Products",
        desc:  "Browse the full store",
      },
      {
        to:    "/products/ebooks",
        icon:  FileText,
        color: "#f43f5e",
        bg:    "rgba(244,63,94,0.1)",
        title: "E-Books & Guides",
        desc:  "PDFs, deep-dive references",
      },
      {
        to:    "/products/templates",
        icon:  LayoutDashboard,
        color: "#f59e0b",
        bg:    "rgba(245,158,11,0.1)",
        title: "Code Templates",
        desc:  "Ready-to-use starters",
      },
      {
        to:    "/products/resources",
        icon:  Database,
        color: "#10b981",
        bg:    "rgba(16,185,129,0.1)",
        title: "Resources",
        desc:  "Cheatsheets, roadmaps, tools",
      },
    ],
    footer: { label: "Shop all products →", to: "/products" },
  },

  { id: "blog",    label: "Blog",    to: "/blog" },
  { id: "about",   label: "About",   to: "/about" },
  { id: "contact", label: "Contact", to: "/contact" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const Navbar = ({ user = null }) => {
  /*
   * `user` prop shape (when logged in):
   *   { name: "Shivam Kumar", email: "shivam@...", initials: "SK", role: "admin" | "user", avatar: null | url }
   * Pass null when logged out.
   */
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const location   = useLocation();
  const navigate   = useNavigate();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobile,   setOpenMobile]   = useState({});
  const [showBanner,   setShowBanner]   = useState(true);

  const navRef    = useRef(null);
  const closeTimer = useRef(null);

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  /* close on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleMouseEnter = (id) => {
    clearTimeout(closeTimer.current);
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 180);
  };

  const toggleMobileSection = (id) => {
    setOpenMobile((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const handleLogout = async () => {
    // Wire up your own logout logic here
    // e.g. dispatch(logoutAction()) or call API
    setOpenDropdown(null);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <>
      <header
        ref={navRef}
        className={`shivam-stack-navbar-root ${isDarkMode ? "dark" : "light"} ${
          scrolled ? "shivam-stack-navbar-scrolled" : ""
        }`}
      >
        {/* ── Announcement Banner ── */}
        {/* {showBanner && (
          <div className="shivam-stack-navbar-announcement" role="banner">
            <Sparkles size={13} />
            <span>
              <strong>Available for new projects</strong> — Full-stack MERN development from Delhi, India.{" "}
              <Link to="/contact" style={{ color: "var(--ssn-text-accent)", textDecoration: "underline" }}>
                Let's talk
              </Link>
            </span>
            <button
              className="shivam-stack-navbar-announcement-close"
              onClick={() => setShowBanner(false)}
              aria-label="Dismiss announcement"
            >
              <X size={14} />
            </button>
          </div>
        )} */}

        {/* ── Main Nav Bar ── */}
        <div className="shivam-stack-navbar-inner">
          <div className="shivam-stack-navbar-container">

            {/* Logo */}
            <Link to="/" className="shivam-stack-navbar-logo" aria-label="ShivamStack home">
              <div className="shivam-stack-navbar-logo-icon" aria-hidden="true">SS</div>
              <div>
                <span className="shivam-stack-navbar-logo-text">
                  Shivam<span className="shivam-stack-navbar-logo-text-accent">Stack</span>
                </span>
                <span className="shivam-stack-navbar-logo-badge">MERN Dev</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="shivam-stack-navbar-nav" aria-label="Primary navigation">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className={`shivam-stack-navbar-navitem ${
                    openDropdown === item.id ? "shivam-stack-navbar-navitem--open" : ""
                  }`}
                  onMouseEnter={() => item.dropdown ? handleMouseEnter(item.id) : undefined}
                  onMouseLeave={() => item.dropdown ? handleMouseLeave() : undefined}
                >
                  {item.to ? (
                    <Link
                      to={item.to}
                      className={`shivam-stack-navbar-navlink ${
                        isActive(item.to) ? "shivam-stack-navbar-navlink--active" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={`shivam-stack-navbar-navlink ${
                        isActive("/" + item.id) ? "shivam-stack-navbar-navlink--active" : ""
                      }`}
                      aria-expanded={openDropdown === item.id}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown size={13} className="shivam-stack-navbar-navlink-chevron" />
                    </button>
                  )}

                  {/* Dropdown */}
                  {item.dropdown && (
                    <div
                      className={`shivam-stack-navbar-dropdown ${
                        item.dropdown === "wide" ? "shivam-stack-navbar-dropdown--wide" : ""
                      }`}
                      role="menu"
                    >
                      {item.items.map((di, idx) => (
                        <Link
                          key={idx}
                          to={di.to}
                          className="shivam-stack-navbar-dropdown-item"
                          role="menuitem"
                        >
                          <div
                            className="shivam-stack-navbar-dropdown-item-icon"
                            style={{ background: di.bg }}
                          >
                            <di.icon size={16} color={di.color} />
                          </div>
                          <div className="shivam-stack-navbar-dropdown-item-text">
                            <span className="shivam-stack-navbar-dropdown-item-title">{di.title}</span>
                            <span className="shivam-stack-navbar-dropdown-item-desc">{di.desc}</span>
                          </div>
                        </Link>
                      ))}
                      {item.footer && (
                        <div className="shivam-stack-navbar-dropdown-footer">
                          <Link to={item.footer.to} className="shivam-stack-navbar-dropdown-cta">
                            {item.footer.label} <ArrowRight size={13} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="shivam-stack-navbar-actions">
              {/* Theme toggle */}
              <button
                className="shivam-stack-navbar-theme-btn"
                onClick={toggleTheme}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {user ? (
                /* ── Logged-in user menu ── */
                <div
                  className={`shivam-stack-navbar-navitem ${
                    openDropdown === "__user" ? "shivam-stack-navbar-navitem--open" : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter("__user")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="shivam-stack-navbar-user-trigger"
                    aria-expanded={openDropdown === "__user"}
                    aria-haspopup="true"
                    aria-label="Account menu"
                  >
                    <div className="shivam-stack-navbar-user-avatar">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.name} />
                        : user.initials || user.name?.[0] || "U"
                      }
                    </div>
                    <span className="shivam-stack-navbar-user-name">{user.name?.split(" ")[0]}</span>
                    <ChevronDown size={12} className="shivam-stack-navbar-navlink-chevron" />
                  </button>

                  <div className="shivam-stack-navbar-dropdown shivam-stack-navbar-user-dropdown" role="menu">
                    <div className="shivam-stack-navbar-user-dropdown-header">
                      <div className="shivam-stack-navbar-user-dropdown-name">{user.name}</div>
                      <div className="shivam-stack-navbar-user-dropdown-email">{user.email}</div>
                      <span className={`shivam-stack-navbar-user-dropdown-role shivam-stack-navbar-user-dropdown-role--${user.role}`}>
                        {user.role === "admin" ? <ShieldCheck size={9} /> : <User size={9} />}
                        {user.role}
                      </span>
                    </div>

                    {[
                      { to: "/dashboard",       icon: BarChart3,     label: "Dashboard" },
                      { to: "/orders",          icon: ClipboardList, label: "My Orders" },
                      { to: "/downloads",       icon: DownloadCloud, label: "Downloads" },
                      { to: "/profile",         icon: Settings,      label: "Profile Settings" },
                    ].map((ai, idx) => (
                      <Link key={idx} to={ai.to} className="shivam-stack-navbar-dropdown-simple" role="menuitem">
                        <ai.icon size={14} /> {ai.label}
                      </Link>
                    ))}

                    {user.role === "admin" && (
                      <>
                        <div className="shivam-stack-navbar-dropdown-divider" />
                        <Link to="/admin" className="shivam-stack-navbar-dropdown-simple" role="menuitem">
                          <ShieldCheck size={14} color="#f59e0b" /> Admin Panel
                        </Link>
                      </>
                    )}

                    <div className="shivam-stack-navbar-dropdown-divider" />
                    <button className="shivam-stack-navbar-logout-btn" onClick={handleLogout} role="menuitem">
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Logged-out auth buttons ── */
                <>
                  <Link to="/login" className="shivam-stack-navbar-auth-login">
                    <LogIn size={14} /> Log In
                  </Link>
                  <Link to="/register" className="shivam-stack-navbar-auth-register">
                    <UserPlus size={14} /> Register
                  </Link>
                  <Link to="/contact" className="shivam-stack-navbar-hire-btn">
                    <span className="shivam-stack-navbar-hire-dot" aria-hidden="true" />
                    Hire Me
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}

              {/* Hamburger */}
              <button
                className={`shivam-stack-navbar-hamburger ${
                  mobileOpen ? "shivam-stack-navbar-ham-open" : ""
                }`}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <span className="shivam-stack-navbar-ham-line" />
                <span className="shivam-stack-navbar-ham-line" />
                <span className="shivam-stack-navbar-ham-line" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <div
        className={`shivam-stack-navbar-overlay ${
          mobileOpen ? "shivam-stack-navbar-overlay--visible" : ""
        } ${isDarkMode ? "dark" : "light"}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <nav
        className={`shivam-stack-navbar-mobile-drawer ${isDarkMode ? "dark" : "light"} ${
          mobileOpen ? "shivam-stack-navbar-mobile-drawer--open" : ""
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        {/* Drawer header */}
        <div className="shivam-stack-navbar-mobile-header">
          <Link to="/" className="shivam-stack-navbar-logo" onClick={() => setMobileOpen(false)}>
            <div className="shivam-stack-navbar-logo-icon" aria-hidden="true">SS</div>
            <span className="shivam-stack-navbar-logo-text">
              Shivam<span className="shivam-stack-navbar-logo-text-accent">Stack</span>
            </span>
          </Link>
          <button
            className="shivam-stack-navbar-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="shivam-stack-navbar-mobile-body">
          <Link to="/" className={`shivam-stack-navbar-mobile-link ${isActive("/") ? "shivam-stack-navbar-mobile-link--active" : ""}`}>
            <Sparkles size={16} /> Home
          </Link>

          {/* Services expandable */}
          <button
            className={`shivam-stack-navbar-mobile-expand ${
              openMobile.services ? "shivam-stack-navbar-mobile-expand--open" : ""
            }`}
            onClick={() => toggleMobileSection("services")}
          >
            <span className="shivam-stack-navbar-mobile-expand-left">
              <Layers size={16} /> Services
            </span>
            <ChevronDown size={15} className="shivam-stack-navbar-mobile-expand-icon" />
          </button>
          <div className={`shivam-stack-navbar-mobile-submenu ${openMobile.services ? "shivam-stack-navbar-mobile-submenu--open" : ""}`}>
            {NAV_ITEMS.find((i) => i.id === "services").items.map((di, idx) => (
              <Link key={idx} to={di.to} className="shivam-stack-navbar-mobile-sublink">
                <di.icon size={13} color={di.color} /> {di.title}
              </Link>
            ))}
            <Link to="/services" className="shivam-stack-navbar-mobile-sublink" style={{ color: "var(--ssn-text-accent)" }}>
              <ArrowRight size={13} /> All Services
            </Link>
          </div>

          {/* Work expandable */}
          <button
            className={`shivam-stack-navbar-mobile-expand ${
              openMobile.work ? "shivam-stack-navbar-mobile-expand--open" : ""
            }`}
            onClick={() => toggleMobileSection("work")}
          >
            <span className="shivam-stack-navbar-mobile-expand-left">
              <FolderOpen size={16} /> Work
            </span>
            <ChevronDown size={15} className="shivam-stack-navbar-mobile-expand-icon" />
          </button>
          <div className={`shivam-stack-navbar-mobile-submenu ${openMobile.work ? "shivam-stack-navbar-mobile-submenu--open" : ""}`}>
            {NAV_ITEMS.find((i) => i.id === "work").items.map((di, idx) => (
              <Link key={idx} to={di.to} className="shivam-stack-navbar-mobile-sublink">
                <di.icon size={13} color={di.color} /> {di.title}
              </Link>
            ))}
          </div>

          {/* Products expandable */}
          <button
            className={`shivam-stack-navbar-mobile-expand ${
              openMobile.products ? "shivam-stack-navbar-mobile-expand--open" : ""
            }`}
            onClick={() => toggleMobileSection("products")}
          >
            <span className="shivam-stack-navbar-mobile-expand-left">
              <Package size={16} /> Products
            </span>
            <ChevronDown size={15} className="shivam-stack-navbar-mobile-expand-icon" />
          </button>
          <div className={`shivam-stack-navbar-mobile-submenu ${openMobile.products ? "shivam-stack-navbar-mobile-submenu--open" : ""}`}>
            {NAV_ITEMS.find((i) => i.id === "products").items.map((di, idx) => (
              <Link key={idx} to={di.to} className="shivam-stack-navbar-mobile-sublink">
                <di.icon size={13} color={di.color} /> {di.title}
              </Link>
            ))}
          </div>

          <div className="shivam-stack-navbar-mobile-divider" />

          <Link to="/blog"    className={`shivam-stack-navbar-mobile-link ${isActive("/blog")    ? "shivam-stack-navbar-mobile-link--active" : ""}`}><BookOpen size={16} /> Blog</Link>
          <Link to="/about"   className={`shivam-stack-navbar-mobile-link ${isActive("/about")   ? "shivam-stack-navbar-mobile-link--active" : ""}`}><User size={16} /> About</Link>
          <Link to="/contact" className={`shivam-stack-navbar-mobile-link ${isActive("/contact") ? "shivam-stack-navbar-mobile-link--active" : ""}`}><MessageSquare size={16} /> Contact</Link>

          {/* Theme toggle in drawer */}
          <div className="shivam-stack-navbar-mobile-divider" />
          <button
            className="shivam-stack-navbar-mobile-link"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logged-in user section */}
          {user && (
            <>
              <div className="shivam-stack-navbar-mobile-divider" />
              <div style={{ padding: "10px 14px 6px" }}>
                <div className="shivam-stack-navbar-user-dropdown-name">{user.name}</div>
                <div className="shivam-stack-navbar-user-dropdown-email">{user.email}</div>
              </div>
              <Link to="/dashboard"  className="shivam-stack-navbar-mobile-link"><BarChart3 size={16} /> Dashboard</Link>
              <Link to="/orders"     className="shivam-stack-navbar-mobile-link"><ClipboardList size={16} /> My Orders</Link>
              <Link to="/downloads"  className="shivam-stack-navbar-mobile-link"><DownloadCloud size={16} /> Downloads</Link>
              <Link to="/profile"    className="shivam-stack-navbar-mobile-link"><Settings size={16} /> Profile Settings</Link>
              {user.role === "admin" && (
                <Link to="/admin"    className="shivam-stack-navbar-mobile-link"><ShieldCheck size={16} color="#f59e0b" /> Admin Panel</Link>
              )}
            </>
          )}
        </div>

        {/* Drawer auth footer */}
        <div className="shivam-stack-navbar-mobile-auth">
          {user ? (
            <button
              className="shivam-stack-navbar-mobile-auth-btn shivam-stack-navbar-mobile-auth-btn--outline"
              onClick={handleLogout}
              style={{ color: "#f43f5e", borderColor: "rgba(244,63,94,0.3)" }}
            >
              <LogOut size={16} /> Log Out
            </button>
          ) : (
            <>
              <Link to="/login"    className="shivam-stack-navbar-mobile-auth-btn shivam-stack-navbar-mobile-auth-btn--outline">
                <LogIn size={16} /> Log In
              </Link>
              <Link to="/register" className="shivam-stack-navbar-mobile-auth-btn shivam-stack-navbar-mobile-auth-btn--outline">
                <UserPlus size={16} /> Create Account
              </Link>
              <Link to="/contact"  className="shivam-stack-navbar-mobile-auth-btn shivam-stack-navbar-mobile-auth-btn--primary">
                <Rocket size={16} /> Hire Me
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;