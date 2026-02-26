import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

import {
  Rocket, MessageCircle, CalendarDays, Package, Share2,
  User, ShieldCheck, Sun, Moon, ArrowUp,
  FilePlus, Tag, LayoutList, Bot, ChevronRight,
  ChevronDown, MessageSquare, Send, PhoneCall, Phone,
  ShoppingBag, Star, FileCode, Gift, Link2,
  Linkedin, Twitter, Mail, ExternalLink,
  LayoutDashboard, PlusSquare, PenTool, ShoppingCart,
  RotateCcw, CheckCheck, X, Zap
} from 'lucide-react';

// ── Whatsapp / Telegram icons (simple SVG inline) ─────────
const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.525 5.847L0 24l6.335-1.502A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-5.032-1.384l-.36-.215-3.762.892.948-3.658-.236-.374A9.787 9.787 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 1 0 0 12a12 12 0 0 0 11.944-12zm3.2 6.58l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.94z"/>
  </svg>
);

// ── Menu structure ─────────────────────────────────────────
const buildMenu = (isAdmin, isDarkMode, toggleTheme, navigate) => [
  {
    id: 'start-project',
    label: 'Start a Project',
    icon: <Rocket size={16} />,
    color: '#6366f1',
    children: [
      { id: 'new-inquiry', label: 'New Project Inquiry', icon: <FilePlus size={14} />, to: '/contact?type=project' },
      { id: 'custom-quote', label: 'Get Custom Quote', icon: <Tag size={14} />, to: '/contact?type=quote' },
      { id: 'service-packages', label: 'View Service Packages', icon: <LayoutList size={14} />, to: '/services' },
    ],
  },
  {
    id: 'quick-chat',
    label: 'Quick Chat',
    icon: <MessageCircle size={16} />,
    color: '#10b981',
    children: [
      { id: 'whatsapp', label: 'WhatsApp Chat', icon: <WhatsAppIcon />, href: 'https://wa.me/91XXXXXXXXXX', external: true },
      { id: 'telegram', label: 'Telegram Chat', icon: <TelegramIcon />, href: 'https://t.me/shivamstack', external: true },
      { id: 'live-chat', label: 'Live Chat (Website)', icon: <Bot size={14} />, action: () => alert('Live chat coming soon!') },
    ],
  },
  {
    id: 'schedule-call',
    label: 'Schedule a Call',
    icon: <CalendarDays size={16} />,
    color: '#f59e0b',
    children: [
      { id: 'discovery-call', label: 'Book Discovery Call', icon: <PhoneCall size={14} />, href: 'https://calendly.com/shivamstack/discovery', external: true },
      { id: 'tech-consult', label: 'Technical Consultation', icon: <Phone size={14} />, href: 'https://calendly.com/shivamstack/tech', external: true },
      { id: 'reschedule', label: 'Reschedule Meeting', icon: <RotateCcw size={14} />, href: 'https://calendly.com/shivamstack', external: true },
    ],
  },
  {
    id: 'view-products',
    label: 'View Products',
    icon: <Package size={16} />,
    color: '#8b5cf6',
    children: [
      { id: 'all-products', label: 'All Digital Products', icon: <ShoppingBag size={14} />, to: '/store' },
      { id: 'best-sellers', label: 'Best Sellers', icon: <Star size={14} />, to: '/store?filter=bestseller' },
      { id: 'templates', label: 'Templates', icon: <FileCode size={14} />, to: '/store?filter=templates' },
      { id: 'free-resources', label: 'Free Resources', icon: <Gift size={14} />, to: '/resources' },
    ],
  },
  {
    id: 'share-website',
    label: 'Share Website',
    icon: <Share2 size={16} />,
    color: '#ec4899',
    children: [
      {
        id: 'copy-link', label: 'Copy Website Link', icon: <Link2 size={14} />,
        action: () => {
          navigator.clipboard.writeText(window.location.origin).then(() => {
            if (window.Swal) {
              window.Swal.fire({ icon: 'success', title: 'Copied!', text: 'Website link copied to clipboard.', timer: 1500, showConfirmButton: false });
            } else { alert('Link copied!'); }
          });
        },
      },
      {
        id: 'share-linkedin', label: 'Share on LinkedIn', icon: <Linkedin size={14} />,
        href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.origin)}&title=Shivam+Stack`,
        external: true,
      },
      {
        id: 'share-twitter', label: 'Share on X (Twitter)', icon: <Twitter size={14} />,
        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin)}&text=Check+out+Shivam+Stack+%F0%9F%9A%80`,
        external: true,
      },
      {
        id: 'share-whatsapp', label: 'Share on WhatsApp', icon: <WhatsAppIcon />,
        href: `https://wa.me/?text=Check+out+Shivam+Stack+${encodeURIComponent(window.location.origin)}`,
        external: true,
      },
      {
        id: 'share-email', label: 'Share via Email', icon: <Mail size={14} />,
        href: `mailto:?subject=Check out Shivam Stack&body=I found this amazing MERN developer portfolio: ${window.location.origin}`,
      },
    ],
  },
  {
    id: 'my-account',
    label: 'My Account',
    icon: <User size={16} />,
    color: '#06b6d4',
    children: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} />, to: '/dashboard' },
      { id: 'my-orders', label: 'My Orders', icon: <ShoppingCart size={14} />, to: '/dashboard/orders' },
      { id: 'downloads', label: 'Downloads', icon: <CheckCheck size={14} />, to: '/dashboard/downloads' },
      { id: 'profile-settings', label: 'Profile Settings', icon: <User size={14} />, to: '/dashboard/settings' },
    ],
  },
  ...(isAdmin ? [{
    id: 'quick-admin',
    label: 'Quick Admin',
    icon: <ShieldCheck size={16} />,
    color: '#ef4444',
    adminOnly: true,
    children: [
      { id: 'admin-dash', label: 'Admin Dashboard', icon: <LayoutDashboard size={14} />, to: '/admin/dashboard' },
      { id: 'add-product-admin', label: 'Add Product', icon: <PlusSquare size={14} />, to: '/admin/products/add' },
      { id: 'add-blog-admin', label: 'Add Blog Post', icon: <PenTool size={14} />, to: '/admin/blog/add' },
      { id: 'view-orders-admin', label: 'View Orders', icon: <ShoppingCart size={14} />, to: '/admin/orders' },
    ],
  }] : []),
  {
    id: 'toggle-theme',
    label: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    icon: isDarkMode ? <Sun size={16} /> : <Moon size={16} />,
    color: isDarkMode ? '#f59e0b' : '#6366f1',
    action: toggleTheme,
    noChildren: true,
  },
  {
    id: 'scroll-top',
    label: 'Scroll to Top',
    icon: <ArrowUp size={16} />,
    color: '#94a3b8',
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    noChildren: true,
  },
];

// ─── Component ────────────────────────────────────────────
const FloatingActionButton = ({ isAdmin = false }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const rootRef = useRef(null);

  const menuItems = buildMenu(isAdmin, isDarkMode, toggleTheme, navigate);

  // Show scroll-to-top hint after scrolling
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveGroup(null);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setIsOpen(false); setActiveGroup(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleToggle = () => {
    setIsOpen(p => !p);
    if (isOpen) setActiveGroup(null);
  };

  const handleItemClick = (item) => {
    if (item.noChildren) {
      item.action?.();
      setIsOpen(false);
      setActiveGroup(null);
      return;
    }
    if (item.children) {
      setActiveGroup(prev => prev === item.id ? null : item.id);
    }
  };

  const handleChildClick = (child) => {
    if (child.action) {
      child.action();
      setIsOpen(false);
      setActiveGroup(null);
      return;
    }
    if (child.href) {
      window.open(child.href, child.external ? '_blank' : '_self', 'noopener,noreferrer');
      setIsOpen(false);
      setActiveGroup(null);
      return;
    }
    if (child.to) {
      navigate(child.to);
      setIsOpen(false);
      setActiveGroup(null);
    }
  };

  const themeClass = isDarkMode ? 'dark' : 'light';

  return (
    <div
      ref={rootRef}
      className={`shivam-stack-fab-root ${themeClass} ${isOpen ? 'shivam-stack-fab-open' : ''}`}
      aria-label="Floating action menu"
    >
      {/* ── Main Menu Panel ─────────────────────────── */}
      {isOpen && (
        <div className="shivam-stack-fab-panel">
          {/* Panel header */}
          <div className="shivam-stack-fab-panel-header">
            <div className="shivam-stack-fab-panel-brand">
              <span className="shivam-stack-fab-panel-brand-icon"><Zap size={13} /></span>
              <span>Quick Actions</span>
            </div>
            <button
              className="shivam-stack-fab-panel-close"
              onClick={() => { setIsOpen(false); setActiveGroup(null); }}
              aria-label="Close menu"
            >
              <X size={14} />
            </button>
          </div>

          {/* Menu list */}
          <div className="shivam-stack-fab-menu-list">
            {menuItems.map((item, idx) => {
              const isActive = activeGroup === item.id;
              return (
                <div key={item.id} className="shivam-stack-fab-menu-group">
                  {/* Group button */}
                  <button
                    className={`shivam-stack-fab-menu-item ${isActive ? 'shivam-stack-fab-menu-item-active' : ''} ${item.adminOnly ? 'shivam-stack-fab-menu-item-admin' : ''}`}
                    onClick={() => handleItemClick(item)}
                    style={{
                      '--fab-item-color': item.color,
                      animationDelay: `${idx * 0.04}s`
                    }}
                    aria-expanded={item.children ? isActive : undefined}
                  >
                    <span
                      className="shivam-stack-fab-menu-item-icon"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      {item.icon}
                    </span>
                    <span className="shivam-stack-fab-menu-item-label">{item.label}</span>
                    {item.adminOnly && (
                      <span className="shivam-stack-fab-admin-badge">Admin</span>
                    )}
                    {item.children && (
                      <span className={`shivam-stack-fab-menu-item-chevron ${isActive ? 'shivam-stack-fab-chevron-open' : ''}`}>
                        <ChevronRight size={13} />
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  {item.children && (
                    <div
                      className={`shivam-stack-fab-submenu ${isActive ? 'shivam-stack-fab-submenu-open' : ''}`}
                      aria-hidden={!isActive}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          className="shivam-stack-fab-submenu-item"
                          onClick={() => handleChildClick(child)}
                          style={{ '--fab-item-color': item.color }}
                        >
                          <span
                            className="shivam-stack-fab-submenu-item-icon"
                            style={{ color: item.color }}
                          >
                            {child.icon}
                          </span>
                          <span className="shivam-stack-fab-submenu-item-label">{child.label}</span>
                          {child.external && (
                            <ExternalLink size={11} className="shivam-stack-fab-submenu-external" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Trigger Button ──────────────────────────── */}
      <button
        className={`shivam-stack-fab-trigger ${isOpen ? 'shivam-stack-fab-trigger-open' : ''} ${showScrollTop && !isOpen ? 'shivam-stack-fab-trigger-pulse' : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
      >
        <span className={`shivam-stack-fab-trigger-icon ${isOpen ? 'shivam-stack-fab-trigger-icon-open' : ''}`}>
          {isOpen ? <X size={22} /> : <Zap size={22} />}
        </span>
        <span className="shivam-stack-fab-trigger-ring shivam-stack-fab-trigger-ring-1" />
        <span className="shivam-stack-fab-trigger-ring shivam-stack-fab-trigger-ring-2" />
        {!isOpen && (
          <span className="shivam-stack-fab-trigger-label">Quick</span>
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;