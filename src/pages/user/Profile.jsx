// pages/user/MyProfile.jsx
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

/* ── Mock User Data ───────────────────────────────────────── */
const MOCK_USER = {
  name:          'Shivam Kumar',
  email:         'shivam@shivamstack.dev',
  phone:         '+91 98765 43210',
  role:          'user',
  emailVerified: true,
  isActive:      true,
  avatar:        null,
  preferences:   { theme: 'dark', newsletter: true },
  createdAt:     '2024-01-15T08:00:00Z',
  lastLogin:     '2025-04-12T10:22:00Z',
  socialLogins:  { google: { id: 'g12345' }, github: null },
};

const MOCK_ACTIVITY = [
  { action: 'purchase',       resourceType: 'product', createdAt: '2025-04-10T09:05:00Z', metadata: { productName: 'MERN Masterclass PDF' } },
  { action: 'download_file',  resourceType: 'file',    createdAt: '2025-04-10T09:06:00Z', metadata: { fileName: 'MERN-Masterclass.pdf' } },
  { action: 'update_profile', resourceType: null,      createdAt: '2025-04-08T14:30:00Z', metadata: {} },
  { action: 'login',          resourceType: null,      createdAt: '2025-04-12T10:22:00Z', metadata: { ip: '103.x.x.x' } },
  { action: 'view_product',   resourceType: 'product', createdAt: '2025-04-11T16:45:00Z', metadata: { productName: 'React Design Kit' } },
  { action: 'add_to_cart',    resourceType: 'product', createdAt: '2025-04-11T16:46:00Z', metadata: { productName: 'React Design Kit' } },
];

const ACTIVITY_ICONS = {
  login:           '🔐',
  logout:          '🚪',
  view_product:    '👀',
  add_to_cart:     '🛒',
  purchase:        '💳',
  download_file:   '⬇️',
  update_profile:  '✏️',
  change_password: '🔑',
};

const STAT_ITEMS = [
  { label: 'Orders',     value: 5   },
  { label: 'Downloads',  value: 8   },
  { label: 'Wishlist',   value: 12  },
  { label: 'Reviews',    value: 3   },
];

function formatDate(iso, full = false) {
  if (!iso) return '—';
  const opts = full
    ? { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(iso).toLocaleDateString('en-IN', opts);
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ── Component ────────────────────────────────────────────── */
export default function MyProfile() {
  const { isDarkMode } = useContext(ThemeContext);
  const u = MOCK_USER;

  return (
    <div className={`shivam-stack-user-profile-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="shivam-stack-user-profile-layout">

        {/* ── Sidebar ── */}
        <aside className="shivam-stack-user-profile-sidebar">

          {/* Avatar Card */}
          <div className="shivam-stack-user-profile-avatar-card">
            <div className="shivam-stack-user-profile-avatar-ring">
              {u.avatar?.url ? (
                <img
                  src={u.avatar.url}
                  alt={u.name}
                  className="shivam-stack-user-profile-avatar-img"
                />
              ) : (
                <div className="shivam-stack-user-profile-avatar-initials">
                  {getInitials(u.name)}
                </div>
              )}
            </div>
            <div className="shivam-stack-user-profile-avatar-name">{u.name}</div>
            <div className="shivam-stack-user-profile-avatar-email">{u.email}</div>
            <div className="shivam-stack-user-profile-role-badge">
              ✦ {u.role}
            </div>
            {u.emailVerified && (
              <div className="shivam-stack-user-profile-verified-chip">
                ✅ Email Verified
              </div>
            )}
          </div> 

          {/* Quick Links */}
          <nav className="shivam-stack-user-profile-sidebar-nav">
            {[
              { icon: '👤', label: 'Overview',       href: '#overview',  active: true  },
              { icon: '📦', label: 'My Orders',       href: '/user/orders',    active: false },
              { icon: '⬇️', label: 'My Downloads',   href: '/user/downloads', active: false },
              { icon: '⚙️', label: 'Settings',        href: '/user/settings',  active: false },
              { icon: '❤️', label: 'Wishlist',        href: '#wishlist',  active: false },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className={`shivam-stack-user-profile-nav-item ${item.active ? 'active' : ''}`}
              >
                <span className="shivam-stack-user-profile-nav-icon">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main ── */}
        <main className="shivam-stack-user-profile-main" id="overview">

          {/* ── At a Glance Stats ── */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">📊</span>
                At a Glance
              </div>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-stats-grid">
                {STAT_ITEMS.map(s => (
                  <div key={s.label} className="shivam-stack-user-profile-stat-tile">
                    <div className="shivam-stack-user-profile-stat-tile-num">{s.value}</div>
                    <div className="shivam-stack-user-profile-stat-tile-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Basic Info ── */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">📋</span>
                Personal Information
              </div>
              <a href="/settings" className="shivam-stack-user-profile-edit-btn">
                ✏️ Edit
              </a>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-info-grid">
                {[
                  { label: 'Full Name',     value: u.name },
                  { label: 'Email Address', value: u.email },
                  { label: 'Phone Number',  value: u.phone || '—' },
                  { label: 'Account Role',  value: u.role.charAt(0).toUpperCase() + u.role.slice(1) },
                  { label: 'Member Since',  value: formatDate(u.createdAt) },
                  { label: 'Last Login',    value: formatDate(u.lastLogin, true) },
                ].map(f => (
                  <div key={f.label} className="shivam-stack-user-profile-info-field">
                    <span className="shivam-stack-user-profile-field-label">{f.label}</span>
                    <span className="shivam-stack-user-profile-field-value">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Preferences ── */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">🎨</span>
                Preferences
              </div>
              <a href="/settings" className="shivam-stack-user-profile-edit-btn">
                ✏️ Edit
              </a>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-info-grid">
                {[
                  { label: 'Theme',             value: u.preferences.theme.charAt(0).toUpperCase() + u.preferences.theme.slice(1) + ' Mode' },
                  { label: 'Newsletter',        value: u.preferences.newsletter ? '✅ Subscribed' : '❌ Unsubscribed' },
                  { label: 'Email Verified',    value: u.emailVerified ? '✅ Yes' : '❌ No — verify now' },
                  { label: 'Account Status',    value: u.isActive ? '🟢 Active' : '🔴 Inactive' },
                ].map(f => (
                  <div key={f.label} className="shivam-stack-user-profile-info-field">
                    <span className="shivam-stack-user-profile-field-label">{f.label}</span>
                    <span className="shivam-stack-user-profile-field-value">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Connected Accounts ── */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">🔗</span>
                Connected Accounts
              </div>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-info-grid">
                {[
                  { label: 'Google',  value: u.socialLogins.google?.id ? '✅ Connected' : '— Not connected', emoji: '🌐' },
                  { label: 'GitHub',  value: u.socialLogins.github?.id ? '✅ Connected' : '— Not connected', emoji: '🐙' },
                ].map(f => (
                  <div key={f.label} className="shivam-stack-user-profile-info-field">
                    <span className="shivam-stack-user-profile-field-label">{f.emoji} {f.label}</span>
                    <span className="shivam-stack-user-profile-field-value">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">⚡</span>
                Recent Activity
              </div>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-activity-list">
                {MOCK_ACTIVITY.map((act, i) => (
                  <div key={i} className="shivam-stack-user-profile-activity-item">
                    <div className="shivam-stack-user-profile-activity-icon">
                      {ACTIVITY_ICONS[act.action] || '📌'}
                    </div>
                    <div className="shivam-stack-user-profile-activity-text">
                      <div className="shivam-stack-user-profile-activity-action">
                        {act.action.replace(/_/g, ' ')}
                        {act.metadata?.productName && ` — ${act.metadata.productName}`}
                        {act.metadata?.fileName    && ` — ${act.metadata.fileName}`}
                      </div>
                      <div className="shivam-stack-user-profile-activity-meta">
                        {formatDate(act.createdAt, true)}
                        {act.metadata?.ip && ` · IP: ${act.metadata.ip}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}