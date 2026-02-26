import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

// Icons
import {
  LayoutDashboard, Users, UserCheck, UserX, Activity,
  ShieldCheck, Key, ClipboardList, Package, PlusSquare,
  Tag, Star, Warehouse, ShoppingCart, Clock, CheckCircle,
  RefreshCw, FileText, Ticket, AlignLeft, PenTool, Folder,
  FolderOpen, BookOpen, BarChart2, TrendingUp, DollarSign,
  Globe, Briefcase, FolderPlus, Bookmark, Mail, Bell,
  HeadphonesIcon, PieChart, LineChart, FileBarChart,
  AlertTriangle, Settings, Palette, AtSign, ToggleLeft,
  Lock, Plug, Database, LogOut, ChevronDown, ChevronRight,
  Menu, X, Shield, Zap, UserCog
} from 'lucide-react';

const adminPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shivam&backgroundColor=b6e3f4';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    link: '/admin/dashboard',
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: <Users size={18} />,
    children: [
      { id: 'all-users', label: 'All Users', icon: <Users size={15} />, link: '/admin/users' },
      { id: 'active-users', label: 'Active Users', icon: <UserCheck size={15} />, link: '/admin/users/active' },
      { id: 'blocked-users', label: 'Blocked Users', icon: <UserX size={15} />, link: '/admin/users/blocked' },
      { id: 'user-logs', label: 'Activity Logs', icon: <Activity size={15} />, link: '/admin/users/logs' },
    ],
  },
  {
    id: 'admin-management',
    label: 'Admin Management',
    icon: <ShieldCheck size={18} />,
    children: [
      { id: 'all-admins', label: 'All Admins', icon: <Shield size={15} />, link: '/admin/admins' },
      { id: 'roles', label: 'Roles & Permissions', icon: <Key size={15} />, link: '/admin/admins/roles' },
      { id: 'admin-activity', label: 'Admin Activity', icon: <ClipboardList size={15} />, link: '/admin/admins/activity' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: <Package size={18} />,
    children: [
      { id: 'all-products', label: 'All Products', icon: <Package size={15} />, link: '/admin/products' },
      { id: 'add-product', label: 'Add Product', icon: <PlusSquare size={15} />, link: '/admin/products/add' },
      { id: 'categories', label: 'Categories', icon: <Tag size={15} />, link: '/admin/products/categories' },
      { id: 'reviews', label: 'Reviews', icon: <Star size={15} />, link: '/admin/products/reviews' },
      { id: 'inventory', label: 'Inventory', icon: <Warehouse size={15} />, link: '/admin/products/inventory' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <ShoppingCart size={18} />,
    children: [
      { id: 'all-orders', label: 'All Orders', icon: <ShoppingCart size={15} />, link: '/admin/orders' },
      { id: 'pending-orders', label: 'Pending', icon: <Clock size={15} />, link: '/admin/orders/pending' },
      { id: 'completed-orders', label: 'Completed', icon: <CheckCircle size={15} />, link: '/admin/orders/completed' },
      { id: 'refunded-orders', label: 'Refunded', icon: <RefreshCw size={15} />, link: '/admin/orders/refunded' },
      { id: 'invoices', label: 'Invoices', icon: <FileText size={15} />, link: '/admin/orders/invoices' },
    ],
  },
  {
    id: 'coupons',
    label: 'Coupons & Discounts',
    icon: <Ticket size={18} />,
    children: [
      { id: 'all-coupons', label: 'All Coupons', icon: <Ticket size={15} />, link: '/admin/coupons' },
      { id: 'create-coupon', label: 'Create Coupon', icon: <PlusSquare size={15} />, link: '/admin/coupons/create' },
    ],
  },
  {
    id: 'blog',
    label: 'Blog Management',
    icon: <BookOpen size={18} />,
    children: [
      { id: 'all-posts', label: 'All Posts', icon: <AlignLeft size={15} />, link: '/admin/blog' },
      { id: 'add-post', label: 'Add New Post', icon: <PenTool size={15} />, link: '/admin/blog/add' },
      { id: 'blog-categories', label: 'Categories', icon: <Tag size={15} />, link: '/admin/blog/categories' },
      { id: 'drafts', label: 'Drafts', icon: <Folder size={15} />, link: '/admin/blog/drafts' },
    ],
  },
  {
    id: 'portfolio',
    label: 'Portfolio / Projects',
    icon: <Briefcase size={18} />,
    children: [
      { id: 'all-projects', label: 'All Projects', icon: <FolderOpen size={15} />, link: '/admin/portfolio' },
      { id: 'add-project', label: 'Add Project', icon: <FolderPlus size={15} />, link: '/admin/portfolio/add' },
      { id: 'featured-projects', label: 'Featured', icon: <Bookmark size={15} />, link: '/admin/portfolio/featured' },
    ],
  },
  {
    id: 'leads',
    label: 'Leads & Communication',
    icon: <Mail size={18} />,
    children: [
      { id: 'contact-messages', label: 'Contact Messages', icon: <Mail size={15} />, link: '/admin/leads/messages' },
      { id: 'newsletter', label: 'Newsletter Subs', icon: <Bell size={15} />, link: '/admin/leads/newsletter' },
      { id: 'support', label: 'Support Requests', icon: <HeadphonesIcon size={15} />, link: '/admin/leads/support' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart2 size={18} />,
    children: [
      { id: 'revenue', label: 'Revenue Analytics', icon: <DollarSign size={15} />, link: '/admin/analytics/revenue' },
      { id: 'user-growth', label: 'User Growth', icon: <TrendingUp size={15} />, link: '/admin/analytics/growth' },
      { id: 'sales-reports', label: 'Sales Reports', icon: <PieChart size={15} />, link: '/admin/analytics/sales' },
      { id: 'traffic', label: 'Traffic Overview', icon: <Globe size={15} />, link: '/admin/analytics/traffic' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit & Logs',
    icon: <ClipboardList size={18} />,
    children: [
      { id: 'audit-logs', label: 'Audit Logs', icon: <FileBarChart size={15} />, link: '/admin/logs/audit' },
      { id: 'admin-logs', label: 'Admin Logs', icon: <Shield size={15} />, link: '/admin/logs/admin' },
      { id: 'system-logs', label: 'System Logs', icon: <AlertTriangle size={15} />, link: '/admin/logs/system' },
    ],
  },
  {
    id: 'settings',
    label: 'Platform Settings',
    icon: <Settings size={18} />,
    children: [
      { id: 'general-settings', label: 'General Settings', icon: <Settings size={15} />, link: '/admin/settings/general' },
      { id: 'branding', label: 'Branding', icon: <Palette size={15} />, link: '/admin/settings/branding' },
      { id: 'emails', label: 'Emails & Contact', icon: <AtSign size={15} />, link: '/admin/settings/emails' },
      { id: 'feature-flags', label: 'Feature Flags', icon: <ToggleLeft size={15} />, link: '/admin/settings/features' },
      { id: 'security', label: 'Security Settings', icon: <Lock size={15} />, link: '/admin/settings/security' },
      { id: 'integrations', label: 'Integrations', icon: <Plug size={15} />, link: '/admin/settings/integrations' },
      { id: 'backup', label: 'Backup Settings', icon: <Database size={15} />, link: '/admin/settings/backup' },
    ],
  },
];

const AdminSidebar = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (id) => {
    if (!isExpanded) {
      setIsExpanded(true);
      setOpenDropdowns({ [id]: true });
      return;
    }
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      if (prev) setOpenDropdowns({});
      return !prev;
    });
  };

  const isActive = (link) => location.pathname === link;
  const isParentActive = (item) =>
    item.children?.some((child) => location.pathname === child.link);

  return (
    <aside
      className={`shivam-stack-admin-sidebar-root ${isExpanded ? 'shivam-stack-admin-sidebar-expanded' : 'shivam-stack-admin-sidebar-collapsed'} ${isDarkMode ? 'dark' : 'light'}`}
    >
      {/* Animated background orbs */}
      <div className="shivam-stack-admin-sidebar-bg-orb shivam-stack-admin-sidebar-bg-orb-1" />
      <div className="shivam-stack-admin-sidebar-bg-orb shivam-stack-admin-sidebar-bg-orb-2" />

      {/* Header */}
      <div className="shivam-stack-admin-sidebar-header">
        <div className="shivam-stack-admin-sidebar-brand">
          <div className="shivam-stack-admin-sidebar-logo-wrap">
            <Zap size={16} className="shivam-stack-admin-sidebar-logo-icon" />
          </div>
          {isExpanded && (
            <div className="shivam-stack-admin-sidebar-brand-text">
              <span className="shivam-stack-admin-sidebar-brand-name">Shivam Stack</span>
              <span className="shivam-stack-admin-sidebar-brand-role">Admin Panel</span>
            </div>
          )}
        </div>
        <button
          className="shivam-stack-admin-sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isExpanded ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Admin Profile */}
      <div className="shivam-stack-admin-sidebar-profile">
        <div className="shivam-stack-admin-sidebar-avatar-ring">
          <img
            src={adminPhoto}
            alt="Admin"
            className="shivam-stack-admin-sidebar-avatar-img"
          />
          <span className="shivam-stack-admin-sidebar-avatar-status" />
        </div>
        {isExpanded && (
          <div className="shivam-stack-admin-sidebar-profile-info">
            <span className="shivam-stack-admin-sidebar-profile-name">Shivam</span>
            <span className="shivam-stack-admin-sidebar-profile-badge">
              <UserCog size={10} /> Super Admin
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="shivam-stack-admin-sidebar-divider" />

      {/* Navigation */}
      <nav className="shivam-stack-admin-sidebar-nav">
        <ul className="shivam-stack-admin-sidebar-nav-list">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdowns[item.id];
            const parentActive = isParentActive(item);

            return (
              <li key={item.id} className="shivam-stack-admin-sidebar-nav-item">
                {hasChildren ? (
                  <>
                    <button
                      className={`shivam-stack-admin-sidebar-nav-btn ${parentActive ? 'shivam-stack-admin-sidebar-nav-btn-active' : ''}`}
                      onClick={() => toggleDropdown(item.id)}
                      title={!isExpanded ? item.label : undefined}
                    >
                      <span className="shivam-stack-admin-sidebar-nav-icon">{item.icon}</span>
                      {isExpanded && (
                        <>
                          <span className="shivam-stack-admin-sidebar-nav-label">{item.label}</span>
                          <span className={`shivam-stack-admin-sidebar-nav-chevron ${isOpen ? 'shivam-stack-admin-sidebar-nav-chevron-open' : ''}`}>
                            <ChevronDown size={13} />
                          </span>
                        </>
                      )}
                    </button>
                    {isExpanded && (
                      <ul className={`shivam-stack-admin-sidebar-dropdown ${isOpen ? 'shivam-stack-admin-sidebar-dropdown-open' : ''}`}>
                        {item.children.map((child) => (
                          <li key={child.id} className="shivam-stack-admin-sidebar-dropdown-item">
                            <Link
                              to={child.link}
                              className={`shivam-stack-admin-sidebar-dropdown-link ${isActive(child.link) ? 'shivam-stack-admin-sidebar-dropdown-link-active' : ''}`}
                            >
                              <span className="shivam-stack-admin-sidebar-dropdown-icon">{child.icon}</span>
                              <span className="shivam-stack-admin-sidebar-dropdown-label">{child.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.link}
                    className={`shivam-stack-admin-sidebar-nav-link ${isActive(item.link) ? 'shivam-stack-admin-sidebar-nav-link-active' : ''}`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <span className="shivam-stack-admin-sidebar-nav-icon">{item.icon}</span>
                    {isExpanded && <span className="shivam-stack-admin-sidebar-nav-label">{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Logout */}
      <div className="shivam-stack-admin-sidebar-footer">
        <div className="shivam-stack-admin-sidebar-divider" />
        <Link
          to="/admin/logout"
          className="shivam-stack-admin-sidebar-logout-btn"
          title={!isExpanded ? 'Logout' : undefined}
        >
          <span className="shivam-stack-admin-sidebar-nav-icon"><LogOut size={18} /></span>
          {isExpanded && <span className="shivam-stack-admin-sidebar-nav-label">Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;