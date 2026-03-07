import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
 
import { 
  Search, Plus, Bell, Sun, Moon, ChevronDown, ChevronRight,
  Package, PenTool, Briefcase, Ticket, User, Settings,
  Activity, RefreshCw, LogOut, ShoppingCart, Mail,
  Users, AlertTriangle, X, ExternalLink, Zap, UserCog,
  LayoutDashboard
} from 'lucide-react';

// Remove static adminPhoto - we'll use avatar from admin data or generate

const pageTitles = {
  '/admin/dashboard': { title: 'Dashboard', crumbs: ['Admin', 'Dashboard'] },
  '/admin/users': { title: 'User Management', crumbs: ['Admin', 'Users'] },
  '/admin/products': { title: 'Products', crumbs: ['Admin', 'Products'] },
  '/admin/orders': { title: 'Orders', crumbs: ['Admin', 'Orders'] },
  '/admin/blog': { title: 'Blog Management', crumbs: ['Admin', 'Blog'] },
  '/admin/portfolio': { title: 'Portfolio', crumbs: ['Admin', 'Portfolio'] },
  '/admin/analytics/revenue': { title: 'Revenue Analytics', crumbs: ['Admin', 'Analytics', 'Revenue'] },
  '/admin/settings/general': { title: 'Platform Settings', crumbs: ['Admin', 'Settings'] },
  '/admin/main-settings': { title: 'Main Settings', crumbs: ['Admin', 'Settings'] },
  '/admin/manage-blog': { title: 'Manage Blog', crumbs: ['Admin', 'Blog', 'Manage'] },
  '/admin/manage-coupons': { title: 'Manage Coupons', crumbs: ['Admin', 'Coupons', 'Manage'] },
  '/admin/manage-products': { title: 'Manage Products', crumbs: ['Admin', 'Products', 'Manage'] },
  '/admin/manage-product-categories': { title: 'Product Categories', crumbs: ['Admin', 'Products', 'Categories'] },
  '/admin/manage-projects': { title: 'Manage Projects', crumbs: ['Admin', 'Projects', 'Manage'] },
};

const quickCreateItems = [
  { id: 'qc-product', label: 'Add Product', icon: <Package size={14} />, link: '/admin/manage-products/add', permission: 'manage_products' },
  { id: 'qc-blog', label: 'Add Blog Post', icon: <PenTool size={14} />, link: '/admin/manage-blog/add', permission: 'manage_blog' },
  { id: 'qc-project', label: 'Add Project', icon: <Briefcase size={14} />, link: '/admin/manage-projects/add', permission: 'manage_projects' },
  { id: 'qc-coupon', label: 'Create Coupon', icon: <Ticket size={14} />, link: '/admin/manage-coupons/create', permission: 'manage_coupons' },
];

const profileMenuItems = [
  { id: 'pm-profile', label: 'My Profile', icon: <User size={14} />, link: '/admin/profile' },
  { id: 'pm-settings', label: 'Account Settings', icon: <Settings size={14} />, link: '/admin/settings/general' },
  { id: 'pm-logs', label: 'Activity Logs', icon: <Activity size={14} />, link: '/admin/activities' },
];

// Only show for superadmin
const superAdminItems = [
  { id: 'pm-admins', label: 'Manage Admins', icon: <Users size={14} />, link: '/admin/admins' },
  { id: 'pm-roles', label: 'Switch Role', icon: <RefreshCw size={14} />, link: '/admin/admins/roles' },
];

const searchCategories = ['Users', 'Orders', 'Products', 'Blog Posts'];

// Generate avatar from admin data
const getAdminAvatar = (admin) => {
  if (admin?.avatar?.url) return admin.avatar.url;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.name || 'Admin'}&backgroundColor=b6e3f4`;
};

const AdminNavbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { admin, adminLogout, isSuperAdmin, hasPermission } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSearchCat, setActiveSearchCat] = useState('Users');
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const quickCreateRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const pageInfo = pageTitles[location.pathname] || { title: 'Admin Panel', crumbs: ['Admin'] };

  // Filter quick create items based on permissions
  const filteredQuickCreate = quickCreateItems.filter(item => 
    isSuperAdmin || hasPermission(item.permission)
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (quickCreateRef.current && !quickCreateRef.current.contains(e.target)) setQuickCreateOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch notifications
  useEffect(() => {
    // You can implement notification fetching here
    // For now, using mock data
    setNotifications([
      { id: 1, type: 'order', icon: <ShoppingCart size={14} />, title: 'New Order #1042', desc: 'React Mastery Course purchased', time: '2m ago', unread: true },
      { id: 2, type: 'message', icon: <Mail size={14} />, title: 'New Contact Message', desc: 'From: rahul@example.com', time: '15m ago', unread: true },
      { id: 3, type: 'user', icon: <Users size={14} />, title: '3 New Users Joined', desc: 'Today\'s registrations', time: '1h ago', unread: true },
    ]);
    setUnreadCount(3);
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  // If not authenticated, don't render (though this should be handled by RequireAdmin)
  if (!admin) return null;

  return (
    <header className={`shivam-stack-admin-navbar-root ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Left Section */}
      <div className="shivam-stack-admin-navbar-left">
        <div className="shivam-stack-admin-navbar-page-info">
          <h1 className="shivam-stack-admin-navbar-page-title">{pageInfo.title}</h1>
          <nav className="shivam-stack-admin-navbar-breadcrumb" aria-label="Breadcrumb">
            {pageInfo.crumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={11} className="shivam-stack-admin-navbar-breadcrumb-sep" />}
                <span className={`shivam-stack-admin-navbar-breadcrumb-item ${i === pageInfo.crumbs.length - 1 ? 'shivam-stack-admin-navbar-breadcrumb-active' : ''}`}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Center Section — Search */}
      <div className={`shivam-stack-admin-navbar-center ${searchFocused ? 'shivam-stack-admin-navbar-center-focused' : ''}`} ref={searchRef}>
        <div className="shivam-stack-admin-navbar-search-wrap">
          <Search size={14} className="shivam-stack-admin-navbar-search-icon" />
          <input
            className="shivam-stack-admin-navbar-search-input"
            type="text"
            placeholder={`Search ${activeSearchCat}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            aria-label="Global search"
          />
          {searchQuery && (
            <button
              className="shivam-stack-admin-navbar-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
        {searchFocused && (
          <div className="shivam-stack-admin-navbar-search-dropdown">
            <div className="shivam-stack-admin-navbar-search-cats">
              {searchCategories.map((cat) => (
                <button
                  key={cat}
                  className={`shivam-stack-admin-navbar-search-cat-btn ${activeSearchCat === cat ? 'shivam-stack-admin-navbar-search-cat-active' : ''}`}
                  onMouseDown={() => setActiveSearchCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            {searchQuery ? (
              <div className="shivam-stack-admin-navbar-search-result-hint">
                <Search size={13} />
                <span>Search for "<strong>{searchQuery}</strong>" in {activeSearchCat}</span>
              </div>
            ) : (
              <div className="shivam-stack-admin-navbar-search-empty">
                <span>Start typing to search {activeSearchCat.toLowerCase()}…</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="shivam-stack-admin-navbar-right">

        {/* Quick Create - Only show if admin has any create permissions */}
        {filteredQuickCreate.length > 0 && (
          <div className="shivam-stack-admin-navbar-dropdown-wrap" ref={quickCreateRef}>
            <button
              className={`shivam-stack-admin-navbar-icon-btn shivam-stack-admin-navbar-quick-create-btn ${quickCreateOpen ? 'shivam-stack-admin-navbar-icon-btn-active' : ''}`}
              onClick={() => { setQuickCreateOpen((p) => !p); setNotifOpen(false); setProfileOpen(false); }}
              aria-label="Quick create"
              title="Quick Create"
            >
              <Plus size={17} />
            </button>
            {quickCreateOpen && (
              <div className="shivam-stack-admin-navbar-dropdown shivam-stack-admin-navbar-qc-dropdown">
                <div className="shivam-stack-admin-navbar-dropdown-header">
                  <Zap size={13} />
                  <span>Quick Create</span>
                </div>
                {filteredQuickCreate.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="shivam-stack-admin-navbar-dropdown-item"
                    onClick={() => setQuickCreateOpen(false)}
                  >
                    <span className="shivam-stack-admin-navbar-dropdown-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    <ExternalLink size={11} className="shivam-stack-admin-navbar-dropdown-item-arrow" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <div className="shivam-stack-admin-navbar-dropdown-wrap" ref={notifRef}>
          <button
            className={`shivam-stack-admin-navbar-icon-btn shivam-stack-admin-navbar-notif-btn ${notifOpen ? 'shivam-stack-admin-navbar-icon-btn-active' : ''}`}
            onClick={() => { setNotifOpen((p) => !p); setQuickCreateOpen(false); setProfileOpen(false); }}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="shivam-stack-admin-navbar-notif-badge">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div className="shivam-stack-admin-navbar-dropdown shivam-stack-admin-navbar-notif-dropdown">
              <div className="shivam-stack-admin-navbar-dropdown-header">
                <Bell size={13} />
                <span>Notifications</span>
                {unreadCount > 0 && <span className="shivam-stack-admin-navbar-notif-count">{unreadCount} new</span>}
              </div>
              <div className="shivam-stack-admin-navbar-notif-list">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`shivam-stack-admin-navbar-notif-item ${notif.unread ? 'shivam-stack-admin-navbar-notif-item-unread' : ''}`}
                  >
                    <span className={`shivam-stack-admin-navbar-notif-item-icon shivam-stack-admin-navbar-notif-icon-${notif.type}`}>
                      {notif.icon}
                    </span>
                    <div className="shivam-stack-admin-navbar-notif-item-body">
                      <span className="shivam-stack-admin-navbar-notif-item-title">{notif.title}</span>
                      <span className="shivam-stack-admin-navbar-notif-item-desc">{notif.desc}</span>
                    </div>
                    <span className="shivam-stack-admin-navbar-notif-item-time">{notif.time}</span>
                  </div>
                ))}
              </div>
              <Link to="/admin/notifications" className="shivam-stack-admin-navbar-notif-view-all" onClick={() => setNotifOpen(false)}>
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          className="shivam-stack-admin-navbar-icon-btn shivam-stack-admin-navbar-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className={`shivam-stack-admin-navbar-theme-icon-wrap ${isDarkMode ? 'shivam-stack-admin-navbar-theme-dark' : 'shivam-stack-admin-navbar-theme-light'}`}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </div>
        </button>

        {/* Admin Profile */}
        <div className="shivam-stack-admin-navbar-dropdown-wrap" ref={profileRef}>
          <button
            className={`shivam-stack-admin-navbar-profile-trigger ${profileOpen ? 'shivam-stack-admin-navbar-profile-trigger-open' : ''}`}
            onClick={() => { setProfileOpen((p) => !p); setQuickCreateOpen(false); setNotifOpen(false); }}
            aria-label="Admin profile menu"
          >
            <div className="shivam-stack-admin-navbar-profile-avatar-wrap">
              <img src={getAdminAvatar(admin)} alt={admin.name} className="shivam-stack-admin-navbar-profile-avatar" />
              <span className="shivam-stack-admin-navbar-profile-online" />
            </div>
            <div className="shivam-stack-admin-navbar-profile-text">
              <span className="shivam-stack-admin-navbar-profile-name">{admin.name?.split(' ')[0] || 'Admin'}</span>
              <span className="shivam-stack-admin-navbar-profile-role">
                {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <ChevronDown size={13} className={`shivam-stack-admin-navbar-profile-chevron ${profileOpen ? 'shivam-stack-admin-navbar-profile-chevron-open' : ''}`} />
          </button>
          {profileOpen && (
            <div className="shivam-stack-admin-navbar-dropdown shivam-stack-admin-navbar-profile-dropdown">
              <div className="shivam-stack-admin-navbar-dropdown-header">
                <UserCog size={13} />
                <span>My Account</span>
              </div>
              
              {/* Profile menu items */}
              {profileMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="shivam-stack-admin-navbar-dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <span className="shivam-stack-admin-navbar-dropdown-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <ExternalLink size={11} className="shivam-stack-admin-navbar-dropdown-item-arrow" />
                </Link>
              ))}

              {/* Superadmin only items */}
              {isSuperAdmin && superAdminItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="shivam-stack-admin-navbar-dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <span className="shivam-stack-admin-navbar-dropdown-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <ExternalLink size={11} className="shivam-stack-admin-navbar-dropdown-item-arrow" />
                </Link>
              ))}

              <div className="shivam-stack-admin-navbar-dropdown-divider" />
              
              {/* Logout button */}
              <button
                onClick={() => {
                  setProfileOpen(false);
                  handleLogout();
                }}
                className="shivam-stack-admin-navbar-dropdown-item shivam-stack-admin-navbar-logout-item"
              >
                <span className="shivam-stack-admin-navbar-dropdown-item-icon"><LogOut size={14} /></span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;