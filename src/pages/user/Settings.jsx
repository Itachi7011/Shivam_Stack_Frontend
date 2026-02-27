// pages/user/MySettings.jsx
import { useState, useContext, useCallback } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

/* ── Password Strength ────────────────────────────────────── */
function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd))  score++;
  return score;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

/* ── Toggle Component ─────────────────────────────────────── */
function SettingsToggle({ label, desc, value, onChange }) {
  return (
    <div className="shivam-stack-user-mySettings-toggle-row">
      <div className="shivam-stack-user-mySettings-toggle-info">
        <div className="shivam-stack-user-mySettings-toggle-name">{label}</div>
        {desc && <div className="shivam-stack-user-mySettings-toggle-desc">{desc}</div>}
      </div>
      <div
        className={`shivam-stack-user-mySettings-toggle-track ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onKeyDown={e => e.key === ' ' && onChange(!value)}
      >
        <div className="shivam-stack-user-mySettings-toggle-thumb" />
      </div>
    </div>
  );
}

/* ── Toast Component ──────────────────────────────────────── */
function Toast({ message, emoji = '✅', onClose }) {
  return (
    <div className="shivam-stack-user-mySettings-toast">
      <span className="shivam-stack-user-mySettings-toast-icon">{emoji}</span>
      {message}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function MySettings() {
  const { isDarkMode } = useContext(ThemeContext);

  /* Profile form */
  const [profile, setProfile] = useState({
    name:  'Shivam Kumar',
    email: 'shivam@shivamstack.dev',
    phone: '+91 98765 43210',
    bio:   'Full-stack MERN developer. Building cool things at Shivam Stack.',
  });

  /* Password form */
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
  const strength = getStrength(passwords.newPwd);

  /* Preferences */
  const [prefs, setPrefs] = useState({
    newsletter:         true,
    emailNotifications: true,
    pushNotifications:  false,
    twoFactor:          false,
    publicProfile:      true,
    showActivity:       false,
  });

  /* Avatar upload preview */
  const [avatarPreview, setAvatarPreview] = useState(null);

  /* Toast */
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, emoji) => {
    setToast({ msg, emoji });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* Active sidebar section */
  const [activeSection, setActiveSection] = useState('profile');

  const handleProfileChange = e =>
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePasswordChange = e =>
    setPasswords(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatarChange = e => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSave = e => {
    e.preventDefault();
    showToast('Profile updated successfully!', '✅');
  };

  const handlePasswordSave = e => {
    e.preventDefault();
    if (passwords.newPwd !== passwords.confirm) {
      showToast('Passwords do not match.', '❌');
      return;
    }
    showToast('Password changed successfully!', '🔑');
    setPasswords({ current: '', newPwd: '', confirm: '' });
  };

  const handlePrefsSave = () => showToast('Preferences saved!', '🎨');

  const NAV_ITEMS = [
    { id: 'profile',        icon: '👤', label: 'Profile'          },
    { id: 'password',       icon: '🔑', label: 'Password'         },
    { id: 'preferences',    icon: '🎨', label: 'Preferences'      },
    { id: 'notifications',  icon: '🔔', label: 'Notifications'    },
    { id: 'privacy',        icon: '🛡️', label: 'Privacy'          },
    { id: 'danger',         icon: '⚠️', label: 'Danger Zone'      },
  ];

  return (
    <div className={`shivam-stack-user-mySettings-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="shivam-stack-user-mySettings-layout">

        {/* ── Sidebar ── */}
        <aside className="shivam-stack-user-mySettings-sidebar">

          {/* Back to profile link */}
          <div className="shivam-stack-user-mySettings-sidebar-nav" style={{ marginBottom: 0 }}>
            <a href="/profile" className="shivam-stack-user-mySettings-nav-item">
              <span className="shivam-stack-user-mySettings-nav-icon">←</span>
              Back to Profile
            </a>
          </div>

          {/* Section Nav */}
          <nav className="shivam-stack-user-mySettings-sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`shivam-stack-user-mySettings-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="shivam-stack-user-mySettings-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main ── */}
        <main className="shivam-stack-user-mySettings-main">

          {/* ===== PROFILE ===== */}
          {activeSection === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <div className="shivam-stack-user-mySettings-section">
                <div className="shivam-stack-user-mySettings-section-header">
                  <div className="shivam-stack-user-mySettings-section-title">
                    <span className="shivam-stack-user-mySettings-section-title-icon">👤</span>
                    Edit Profile
                  </div>
                </div>
                <div className="shivam-stack-user-mySettings-section-body">

                  {/* Avatar Upload */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.75rem' }}>
                    <div className="shivam-stack-user-profile-avatar-ring" style={{ cursor: 'default' }}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="shivam-stack-user-profile-avatar-img" />
                      ) : (
                        <div className="shivam-stack-user-profile-avatar-initials">SK</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label
                        htmlFor="shivam-stack-user-mySettings-avatar-upload"
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="shivam-stack-user-mySettings-action-btn" style={{ display: 'inline-flex' }}>
                          📷 Upload Photo
                        </span>
                      </label>
                      <input
                        id="shivam-stack-user-mySettings-avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                      />
                      <span style={{ fontSize: '0.74rem', color: 'var(--pf-text-muted)' }}>
                        JPG, PNG or WebP · Max 2MB
                      </span>
                    </div>
                  </div>

                  <div className="shivam-stack-user-mySettings-form-grid">
                    <div className="shivam-stack-user-mySettings-form-field">
                      <label className="shivam-stack-user-mySettings-label">Full Name</label>
                      <input
                        className="shivam-stack-user-mySettings-input"
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="shivam-stack-user-mySettings-form-field">
                      <label className="shivam-stack-user-mySettings-label">Email Address</label>
                      <input
                        className="shivam-stack-user-mySettings-input"
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="shivam-stack-user-mySettings-form-field">
                      <label className="shivam-stack-user-mySettings-label">Phone Number</label>
                      <input
                        className="shivam-stack-user-mySettings-input"
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="shivam-stack-user-mySettings-form-field shivam-stack-user-mySettings-form-field-full">
                      <label className="shivam-stack-user-mySettings-label">Short Bio</label>
                      <textarea
                        className="shivam-stack-user-mySettings-textarea"
                        name="bio"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us a bit about yourself…"
                      />
                    </div>
                  </div>

                  <div className="shivam-stack-user-mySettings-form-footer">
                    <button type="button" className="shivam-stack-user-mySettings-cancel-btn"
                      onClick={() => setProfile({ name: 'Shivam Kumar', email: 'shivam@shivamstack.dev', phone: '+91 98765 43210', bio: '' })}>
                      Reset
                    </button>
                    <button type="submit" className="shivam-stack-user-mySettings-save-btn">
                      ✓ Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ===== PASSWORD ===== */}
          {activeSection === 'password' && (
            <form onSubmit={handlePasswordSave}>
              <div className="shivam-stack-user-mySettings-section">
                <div className="shivam-stack-user-mySettings-section-header">
                  <div className="shivam-stack-user-mySettings-section-title">
                    <span className="shivam-stack-user-mySettings-section-title-icon">🔑</span>
                    Change Password
                  </div>
                </div>
                <div className="shivam-stack-user-mySettings-section-body">
                  <div className="shivam-stack-user-mySettings-form-grid">
                    <div className="shivam-stack-user-mySettings-form-field shivam-stack-user-mySettings-form-field-full">
                      <label className="shivam-stack-user-mySettings-label">Current Password</label>
                      <input
                        className="shivam-stack-user-mySettings-input"
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div className="shivam-stack-user-mySettings-form-field">
                      <label className="shivam-stack-user-mySettings-label">New Password</label>
                      <input
                        className="shivam-stack-user-mySettings-input"
                        type="password"
                        name="newPwd"
                        value={passwords.newPwd}
                        onChange={handlePasswordChange}
                        placeholder="Min. 8 characters"
                        required
                      />
                      {passwords.newPwd && (
                        <div>
                          <div className="shivam-stack-user-mySettings-strength-bar">
                            <div className={`shivam-stack-user-mySettings-strength-fill shivam-stack-user-mySettings-strength-${strength}`} />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--pf-text-muted)', marginTop: '3px', display: 'block' }}>
                            Strength: {STRENGTH_LABELS[strength]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="shivam-stack-user-mySettings-form-field">
                      <label className="shivam-stack-user-mySettings-label">Confirm New Password</label>
                      <input
                        className="shivam-stack-user-mySettings-input"
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                        required
                        style={{
                          borderColor: passwords.confirm && passwords.confirm !== passwords.newPwd
                            ? 'var(--pf-rose)' : undefined
                        }}
                      />
                      {passwords.confirm && passwords.confirm !== passwords.newPwd && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--pf-rose)' }}>Passwords do not match</span>
                      )}
                    </div>
                  </div>
                  <div className="shivam-stack-user-mySettings-form-footer">
                    <button type="submit" className="shivam-stack-user-mySettings-save-btn">
                      🔑 Update Password
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ===== PREFERENCES ===== */}
          {activeSection === 'preferences' && (
            <div className="shivam-stack-user-mySettings-section">
              <div className="shivam-stack-user-mySettings-section-header">
                <div className="shivam-stack-user-mySettings-section-title">
                  <span className="shivam-stack-user-mySettings-section-title-icon">🎨</span>
                  Preferences
                </div>
              </div>
              <div className="shivam-stack-user-mySettings-section-body">
                <div className="shivam-stack-user-mySettings-form-grid" style={{ marginBottom: '1.25rem' }}>
                  <div className="shivam-stack-user-mySettings-form-field">
                    <label className="shivam-stack-user-mySettings-label">Theme</label>
                    <select className="shivam-stack-user-mySettings-select">
                      <option value="light">☀️ Light Mode</option>
                      <option value="dark">🌙 Dark Mode</option>
                      <option value="system">💻 System Default</option>
                    </select>
                  </div>
                  <div className="shivam-stack-user-mySettings-form-field">
                    <label className="shivam-stack-user-mySettings-label">Language</label>
                    <select className="shivam-stack-user-mySettings-select">
                      <option value="en">🇬🇧 English</option>
                      <option value="hi">🇮🇳 Hindi</option>
                    </select>
                  </div>
                </div>
                <SettingsToggle
                  label="Newsletter Subscription"
                  desc="Receive updates, offers and new product launches via email."
                  value={prefs.newsletter}
                  onChange={v => setPrefs(p => ({ ...p, newsletter: v }))}
                />
                <div className="shivam-stack-user-mySettings-form-footer">
                  <button type="button" className="shivam-stack-user-mySettings-save-btn" onClick={handlePrefsSave}>
                    ✓ Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {activeSection === 'notifications' && (
            <div className="shivam-stack-user-mySettings-section">
              <div className="shivam-stack-user-mySettings-section-header">
                <div className="shivam-stack-user-mySettings-section-title">
                  <span className="shivam-stack-user-mySettings-section-title-icon">🔔</span>
                  Notification Settings
                </div>
              </div>
              <div className="shivam-stack-user-mySettings-section-body">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications',  desc: 'Order updates, invoices, and account alerts.' },
                  { key: 'pushNotifications',  label: 'Push Notifications',   desc: 'Real-time alerts in your browser.' },
                  { key: 'newsletter',         label: 'Newsletter Emails',     desc: 'Tips, tutorials, and new product launches.' },
                ].map(t => (
                  <SettingsToggle
                    key={t.key}
                    label={t.label}
                    desc={t.desc}
                    value={prefs[t.key]}
                    onChange={v => setPrefs(p => ({ ...p, [t.key]: v }))}
                  />
                ))}
                <div className="shivam-stack-user-mySettings-form-footer">
                  <button type="button" className="shivam-stack-user-mySettings-save-btn" onClick={handlePrefsSave}>
                    ✓ Save Notifications
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== PRIVACY ===== */}
          {activeSection === 'privacy' && (
            <div className="shivam-stack-user-mySettings-section">
              <div className="shivam-stack-user-mySettings-section-header">
                <div className="shivam-stack-user-mySettings-section-title">
                  <span className="shivam-stack-user-mySettings-section-title-icon">🛡️</span>
                  Privacy &amp; Security
                </div>
              </div>
              <div className="shivam-stack-user-mySettings-section-body">
                {[
                  { key: 'twoFactor',     label: 'Two-Factor Authentication (2FA)', desc: 'Extra layer of security on login.' },
                  { key: 'publicProfile', label: 'Public Profile',                  desc: 'Allow others to see your profile.' },
                  { key: 'showActivity',  label: 'Show Activity Feed',              desc: 'Display recent activity on your profile.' },
                ].map(t => (
                  <SettingsToggle
                    key={t.key}
                    label={t.label}
                    desc={t.desc}
                    value={prefs[t.key]}
                    onChange={v => setPrefs(p => ({ ...p, [t.key]: v }))}
                  />
                ))}

                {/* Connected Accounts */}
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--pf-text-muted)', marginBottom: '0.75rem' }}>
                    Connected Social Accounts
                  </div>
                  {[
                    { name: 'Google', emoji: '🌐', connected: true  },
                    { name: 'GitHub', emoji: '🐙', connected: false },
                  ].map(acc => (
                    <div key={acc.name} className="shivam-stack-user-mySettings-toggle-row">
                      <div className="shivam-stack-user-mySettings-toggle-info">
                        <div className="shivam-stack-user-mySettings-toggle-name">{acc.emoji} {acc.name}</div>
                        <div className="shivam-stack-user-mySettings-toggle-desc">
                          {acc.connected ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                      <button
                        className={`shivam-stack-user-mySettings-action-btn ${acc.connected ? 'shivam-stack-user-mySettings-action-btn-danger' : ''}`}
                        onClick={() => showToast(acc.connected ? `${acc.name} disconnected.` : `${acc.name} connected!`, acc.connected ? '🔓' : '🔗')}
                      >
                        {acc.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="shivam-stack-user-mySettings-form-footer">
                  <button type="button" className="shivam-stack-user-mySettings-save-btn" onClick={handlePrefsSave}>
                    ✓ Save Privacy Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== DANGER ZONE ===== */}
          {activeSection === 'danger' && (
            <div className="shivam-stack-user-mySettings-section shivam-stack-user-mySettings-danger-section">
              <div className="shivam-stack-user-mySettings-section-header shivam-stack-user-mySettings-danger-header">
                <div className="shivam-stack-user-mySettings-section-title shivam-stack-user-mySettings-danger-title">
                  <span className="shivam-stack-user-mySettings-section-title-icon">⚠️</span>
                  Danger Zone
                </div>
              </div>
              <div className="shivam-stack-user-mySettings-section-body">
                {[
                  {
                    title: 'Deactivate Account',
                    desc:  'Temporarily disable your account. You can reactivate it anytime by logging back in.',
                    btn:   'Deactivate',
                    emoji: '⚠️',
                  },
                  {
                    title: 'Delete Account',
                    desc:  'Permanently delete your account and all associated data. This action is irreversible. All your orders, downloads, and data will be lost.',
                    btn:   'Delete Account',
                    emoji: '🗑️',
                  },
                  {
                    title: 'Request Data Export',
                    desc:  'Download a copy of all your personal data, orders, and activity in a portable format.',
                    btn:   'Export Data',
                    emoji: '📦',
                  },
                ].map(item => (
                  <div key={item.title} style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    gap: '1.5rem', padding: '1.1rem 0', borderBottom: '1px solid var(--pf-border)',
                    flexWrap: 'wrap',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--pf-text-primary)', marginBottom: '0.3rem' }}>
                        {item.title}
                      </div>
                      <div className="shivam-stack-user-mySettings-danger-text">{item.desc}</div>
                    </div>
                    <button
                      className="shivam-stack-user-mySettings-action-btn shivam-stack-user-mySettings-action-btn-danger"
                      style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                      onClick={() => showToast(`${item.emoji} ${item.title} — Are you sure? (Demo mode)`, item.emoji)}
                    >
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.msg} emoji={toast.emoji} />}
    </div>
  );
}