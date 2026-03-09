import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext'; 
import { useSidebar } from '../../context/SidebarContext'; 

// Icons (keep all your existing imports)
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

// Remove static adminPhoto - we'll get from admin data
// const adminPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shivam&backgroundColor=b6e3f4';

// Generate avatar from admin data
const getAdminAvatar = (admin) => {
  if (admin?.avatar?.url) return admin.avatar.url;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.name || 'Admin'}&backgroundColor=b6e3f4`;
};

// Menu items with permission requirements
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    link: '/admin/dashboard',
    permission: null // Everyone can see dashboard
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: <Users size={18} />,
    permission: 'manage_users',
    children: [
      { id: 'all-users', label: 'All Users', icon: <Users size={15} />, link: '/admin/users', permission: 'manage_users' },
      { id: 'active-users', label: 'Active Users', icon: <UserCheck size={15} />, link: '/admin/users/active', permission: 'manage_users' },
      { id: 'blocked-users', label: 'Blocked Users', icon: <UserX size={15} />, link: '/admin/users/blocked', permission: 'manage_users' },
      { id: 'user-logs', label: 'Activity Logs', icon: <Activity size={15} />, link: '/admin/users/logs', permission: 'view_analytics' },
    ],
  },
  {
    id: 'admin-management',
    label: 'Admin Management',
    icon: <ShieldCheck size={18} />,
    permission: 'manage_settings', // Only superadmin or admins with manage_settings
    children: [
      { id: 'all-admins', label: 'All Admins', icon: <Shield size={15} />, link: '/admin/admins', permission: 'manage_settings' },
      { id: 'roles', label: 'Roles & Permissions', icon: <Key size={15} />, link: '/admin/admins/roles', permission: 'manage_settings' },
      { id: 'admin-activity', label: 'Admin Activity', icon: <ClipboardList size={15} />, link: '/admin/admins/activity', permission: 'view_analytics' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: <Package size={18} />,
    permission: 'manage_products',
    children: [
      { id: 'all-products', label: 'All Products', icon: <Package size={15} />, link: '/admin/products', permission: 'manage_products' },
      { id: 'add-product', label: 'Add Product', icon: <PlusSquare size={15} />, link: '/admin/products/add', permission: 'manage_products' },
      { id: 'categories', label: 'Categories', icon: <Tag size={15} />, link: '/admin/products/categories', permission: 'manage_products' },
      { id: 'reviews', label: 'Reviews', icon: <Star size={15} />, link: '/admin/products/reviews', permission: 'manage_products' },
      { id: 'inventory', label: 'Inventory', icon: <Warehouse size={15} />, link: '/admin/products/inventory', permission: 'manage_products' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <ShoppingCart size={18} />,
    permission: 'manage_orders',
    children: [
      { id: 'all-orders', label: 'All Orders', icon: <ShoppingCart size={15} />, link: '/admin/orders', permission: 'manage_orders' },
      { id: 'pending-orders', label: 'Pending', icon: <Clock size={15} />, link: '/admin/orders/pending', permission: 'manage_orders' },
      { id: 'completed-orders', label: 'Completed', icon: <CheckCircle size={15} />, link: '/admin/orders/completed', permission: 'manage_orders' },
      { id: 'refunded-orders', label: 'Refunded', icon: <RefreshCw size={15} />, link: '/admin/orders/refunded', permission: 'manage_orders' },
      { id: 'invoices', label: 'Invoices', icon: <FileText size={15} />, link: '/admin/orders/invoices', permission: 'manage_orders' },
    ],
  },
  {
    id: 'coupons',
    label: 'Coupons & Discounts',
    icon: <Ticket size={18} />,
    permission: 'manage_coupons',
    children: [
      { id: 'all-coupons', label: 'All Coupons', icon: <Ticket size={15} />, link: '/admin/coupons', permission: 'manage_coupons' },
      { id: 'create-coupon', label: 'Create Coupon', icon: <PlusSquare size={15} />, link: '/admin/coupons/create', permission: 'manage_coupons' },
    ],
  },
  {
    id: 'blog',
    label: 'Blog Management',
    icon: <BookOpen size={18} />,
    permission: 'manage_blog',
    children: [
      { id: 'all-posts', label: 'All Posts', icon: <AlignLeft size={15} />, link: '/admin/blog', permission: 'manage_blog' },
      { id: 'add-post', label: 'Add New Post', icon: <PenTool size={15} />, link: '/admin/blog/add', permission: 'manage_blog' },
      { id: 'blog-categories', label: 'Categories', icon: <Tag size={15} />, link: '/admin/blog/categories', permission: 'manage_blog' },
      { id: 'drafts', label: 'Drafts', icon: <Folder size={15} />, link: '/admin/blog/drafts', permission: 'manage_blog' },
    ],
  },
  {
    id: 'portfolio',
    label: 'Portfolio / Projects',
    icon: <Briefcase size={18} />,
    permission: 'manage_projects',
    children: [
      { id: 'all-projects', label: 'All Projects', icon: <FolderOpen size={15} />, link: '/admin/portfolio', permission: 'manage_projects' },
      { id: 'add-project', label: 'Add Project', icon: <FolderPlus size={15} />, link: '/admin/portfolio/add', permission: 'manage_projects' },
      { id: 'featured-projects', label: 'Featured', icon: <Bookmark size={15} />, link: '/admin/portfolio/featured', permission: 'manage_projects' },
    ],
  },
  {
    id: 'leads',
    label: 'Leads & Communication',
    icon: <Mail size={18} />,
    permission: null, // Anyone can view communications
    children: [
      { id: 'contact-messages', label: 'Contact Messages', icon: <Mail size={15} />, link: '/admin/leads/messages', permission: null },
      { id: 'newsletter', label: 'Newsletter Subs', icon: <Bell size={15} />, link: '/admin/leads/newsletter', permission: null },
      { id: 'support', label: 'Support Requests', icon: <HeadphonesIcon size={15} />, link: '/admin/leads/support', permission: null },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart2 size={18} />,
    permission: 'view_analytics',
    children: [
      { id: 'revenue', label: 'Revenue Analytics', icon: <DollarSign size={15} />, link: '/admin/analytics/revenue', permission: 'view_analytics' },
      { id: 'user-growth', label: 'User Growth', icon: <TrendingUp size={15} />, link: '/admin/analytics/growth', permission: 'view_analytics' },
      { id: 'sales-reports', label: 'Sales Reports', icon: <PieChart size={15} />, link: '/admin/analytics/sales', permission: 'view_analytics' },
      { id: 'traffic', label: 'Traffic Overview', icon: <Globe size={15} />, link: '/admin/analytics/traffic', permission: 'view_analytics' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit & Logs',
    icon: <ClipboardList size={18} />,
    permission: 'view_analytics',
    children: [
      { id: 'audit-logs', label: 'Audit Logs', icon: <FileBarChart size={15} />, link: '/admin/logs/audit', permission: 'view_analytics' },
      { id: 'admin-logs', label: 'Admin Logs', icon: <Shield size={15} />, link: '/admin/logs/admin', permission: 'view_analytics' },
      { id: 'system-logs', label: 'System Logs', icon: <AlertTriangle size={15} />, link: '/admin/logs/system', permission: 'view_analytics' },
    ],
  },
  {
    id: 'settings',
    label: 'Platform Settings',
    icon: <Settings size={18} />,
    permission: 'manage_settings',
    children: [
      { id: 'general-settings', label: 'General Settings', icon: <Settings size={15} />, link: '/admin/settings/general', permission: 'manage_settings' },
      { id: 'branding', label: 'Branding', icon: <Palette size={15} />, link: '/admin/settings/branding', permission: 'manage_settings' },
      { id: 'emails', label: 'Emails & Contact', icon: <AtSign size={15} />, link: '/admin/settings/emails', permission: 'manage_settings' },
      { id: 'feature-flags', label: 'Feature Flags', icon: <ToggleLeft size={15} />, link: '/admin/settings/features', permission: 'manage_settings' },
      { id: 'security', label: 'Security Settings', icon: <Lock size={15} />, link: '/admin/settings/security', permission: 'manage_settings' },
      { id: 'integrations', label: 'Integrations', icon: <Plug size={15} />, link: '/admin/settings/integrations', permission: 'manage_settings' },
      { id: 'backup', label: 'Backup Settings', icon: <Database size={15} />, link: '/admin/settings/backup', permission: 'manage_settings' },
    ],
  },
];

// Filter menu items based on permissions
const filterMenuItems = (items, admin, isSuperAdmin, hasPermission) => {
  return items.filter(item => {
    // Superadmin sees everything
    if (isSuperAdmin) return true;
    
    // Check if user has permission for this menu item
    if (item.permission && !hasPermission(item.permission)) return false;
    
    // Filter children if they exist
    if (item.children) {
      item.children = item.children.filter(child => {
        if (isSuperAdmin) return true;
        if (child.permission && !hasPermission(child.permission)) return false;
        return true;
      });
      // Only show parent if it has visible children or itself is accessible
      return item.children.length > 0 || !item.permission;
    }
    
    return true;
  });
};

const AdminSidebar = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { admin, isSuperAdmin, hasPermission, adminLogout } = useAdmin();
    const { isExpanded, toggleSidebar } = useSidebar(); // Use context instead of local state
  const location = useLocation();
  const navigate = useNavigate();
  // const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // If no admin, don't render sidebar
  if (!admin) {
    return null;
  }

  // Filter menu items based on permissions
  const filteredMenuItems = filterMenuItems(menuItems, admin, isSuperAdmin, hasPermission);

  const toggleDropdown = (id) => {
    if (!isExpanded) {
      toggleSidebar(); // Use context toggle     
       setOpenDropdowns({ [id]: true });
      return;
    }
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };



  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
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

      {/* Admin Profile - Now with real admin data */}
      <div className="shivam-stack-admin-sidebar-profile">
        <div className="shivam-stack-admin-sidebar-avatar-ring">
          <img
            src={getAdminAvatar(admin)}
            alt={admin.name}
            className="shivam-stack-admin-sidebar-avatar-img"
          />
          <span className="shivam-stack-admin-sidebar-avatar-status" />
        </div>
        {isExpanded && (
          <div className="shivam-stack-admin-sidebar-profile-info">
            <span className="shivam-stack-admin-sidebar-profile-name">
              {admin.name?.split(' ')[0] || 'Admin'}
            </span>
            <span className="shivam-stack-admin-sidebar-profile-badge">
              <UserCog size={10} /> {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="shivam-stack-admin-sidebar-divider" />

      {/* Navigation - Only shows filtered items */}
      <nav className="shivam-stack-admin-sidebar-nav">
        <ul className="shivam-stack-admin-sidebar-nav-list">
          {filteredMenuItems.map((item) => {
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
        <button
          onClick={handleLogout}
          className="shivam-stack-admin-sidebar-logout-btn"
          title={!isExpanded ? 'Logout' : undefined}
        >
          <span className="shivam-stack-admin-sidebar-nav-icon"><LogOut size={18} /></span>
          {isExpanded && <span className="shivam-stack-admin-sidebar-nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;