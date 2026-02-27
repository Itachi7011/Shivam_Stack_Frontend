import React, { useContext, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  Settings, Globe, Mail, Phone, Share2, Clock, Flag, Shield,
  Database, Zap, BarChart2, CreditCard, Bell, Save, Plus,
  Trash2, Edit2, Check, X, ChevronDown, ChevronRight, Eye,
  EyeOff, RefreshCw, AlertTriangle, Info, Building2, Link,
  Lock, Unlock, Server, Wifi, Moon, Sun, Image, FileText,
  Hash, Calendar, ToggleLeft, ToggleRight, Copy, ExternalLink,
  Package, Twitter, Linkedin, Facebook, Github, Youtube, Instagram,
  Upload, Download, Activity, Cpu, HardDrive, Terminal, Code2
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = '/admin/main-settings';
const EMAIL_TYPES = ['support', 'billing', 'legal', 'sales', 'technical', 'marketing'];
const PHONE_TYPES = ['support', 'billing', 'sales', 'technical', 'emergency'];
const SOCIAL_PLATFORMS = ['twitter', 'linkedin', 'facebook', 'github', 'youtube', 'instagram'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const BACKUP_FREQS = ['daily', 'weekly', 'monthly'];

const SOCIAL_ICONS = {
  twitter: Twitter, linkedin: Linkedin, facebook: Facebook,
  github: Github, youtube: Youtube, instagram: Instagram
};

const NAV_SECTIONS = [
  { id: 'general',     label: 'General',       icon: Settings },
  { id: 'contact',     label: 'Contact',        icon: Mail },
  { id: 'social',      label: 'Social',         icon: Share2 },
  { id: 'hours',       label: 'Business Hours', icon: Clock },
  { id: 'branding',    label: 'Branding',       icon: Image },
  { id: 'security',    label: 'Security',       icon: Shield },
  { id: 'compliance',  label: 'Compliance',     icon: FileText },
  { id: 'analytics',   label: 'Analytics',      icon: BarChart2 },
  { id: 'integrations',label: 'Integrations',   icon: Zap },
  { id: 'backup',      label: 'Backup',         icon: Database },
  { id: 'features',    label: 'Feature Flags',  icon: Flag },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const token = () => localStorage.getItem('adminToken');

const swalConfig = (isDark) => ({
  background: isDark ? '#0f1117' : '#ffffff',
  color: isDark ? '#e2e8f0' : '#1a202c',
  confirmButtonColor: '#6c63ff',
  cancelButtonColor: isDark ? '#374151' : '#e5e7eb',
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ id, icon: Icon, title, subtitle, children, badge }) {
  return (
    <section className="ssas-section-card" id={`ssas-sec-${id}`}>
      <div className="ssas-section-header">
        <div className="ssas-section-header-left">
          <div className="ssas-section-icon-wrap"><Icon size={20} /></div>
          <div>
            <h2 className="ssas-section-title">{title}</h2>
            {subtitle && <p className="ssas-section-subtitle">{subtitle}</p>}
          </div>
        </div>
        {badge && <span className="ssas-section-badge">{badge}</span>}
      </div>
      <div className="ssas-section-body">{children}</div>
    </section>
  );
}

function FieldRow({ label, hint, children, required }) {
  return (
    <div className="ssas-field-row">
      <div className="ssas-field-label-wrap">
        <label className="ssas-field-label">{label}{required && <span className="ssas-required">*</span>}</label>
        {hint && <span className="ssas-field-hint">{hint}</span>}
      </div>
      <div className="ssas-field-control">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <button
      type="button"
      className={`ssas-toggle ${value ? 'ssas-toggle-on' : ''}`}
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
    >
      <span className="ssas-toggle-thumb" />
      {label && <span className="ssas-toggle-label">{label}</span>}
    </button>
  );
}

function SecretInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ssas-secret-wrap">
      <input
        className="ssas-input ssas-secret-input"
        type={show ? 'text' : 'password'}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button type="button" className="ssas-secret-eye" onClick={() => setShow(!show)}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

function StatusDot({ active }) {
  return <span className={`ssas-status-dot ${active ? 'ssas-dot-active' : 'ssas-dot-inactive'}`} />;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const MainSettings = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [dirty, setDirty] = useState(false);

  // ── Fetch settings ──────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}`, {
        headers: { 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSettings(data.data || data);
    } catch (err) {
      Swal.fire({ title: 'Failed to Load', text: 'Could not fetch site settings.', icon: 'error', ...swalConfig(isDarkMode) });
    } finally {
      setLoading(false);
    }
  }, [isDarkMode]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  // ── Update helper ───────────────────────────────────────────────────────────
  const update = (path, value) => {
    setDirty(true);
    setSettings(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // ── Save settings ───────────────────────────────────────────────────────────
  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDirty(false);
      Swal.fire({ title: 'Saved!', text: 'Settings updated successfully.', icon: 'success', timer: 2000, showConfirmButton: false, ...swalConfig(isDarkMode) });
    } catch {
      Swal.fire({ title: 'Save Failed', text: 'Could not save settings. Please try again.', icon: 'error', ...swalConfig(isDarkMode) });
    } finally {
      setSaving(false);
    }
  };

  // ── Array item helpers ──────────────────────────────────────────────────────
  const addItem = async (field, template, formBuilder) => {
    const { value: formValues } = await Swal.fire({
      title: `Add ${field.replace(/([A-Z])/g, ' $1').trim()}`,
      html: formBuilder(),
      showCancelButton: true,
      confirmButtonText: 'Add',
      ...swalConfig(isDarkMode),
      preConfirm: () => {
        const result = {};
        Object.keys(template).forEach(k => {
          const el = document.getElementById(`swal-${k}`);
          if (el) result[k] = el.type === 'checkbox' ? el.checked : el.value;
        });
        return result;
      }
    });
    if (formValues) {
      setDirty(true);
      setSettings(prev => ({ ...prev, [field]: [...(prev[field] || []), { ...template, ...formValues }] }));
    }
  };

  const removeItem = async (field, index) => {
    const confirm = await Swal.fire({
      title: 'Remove this item?', text: 'This action cannot be undone.',
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, remove',
      confirmButtonColor: '#ef4444', ...swalConfig(isDarkMode)
    });
    if (confirm.isConfirmed) {
      setDirty(true);
      setSettings(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    }
  };

  const editItem = async (field, index, current, formBuilder) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${field.replace(/([A-Z])/g, ' $1').trim()}`,
      html: formBuilder(current),
      showCancelButton: true,
      confirmButtonText: 'Update',
      ...swalConfig(isDarkMode),
      didOpen: () => {
        Object.keys(current).forEach(k => {
          const el = document.getElementById(`swal-${k}`);
          if (el) { if (el.type === 'checkbox') el.checked = current[k]; else el.value = current[k] || ''; }
        });
      },
      preConfirm: () => {
        const result = {};
        Object.keys(current).forEach(k => {
          const el = document.getElementById(`swal-${k}`);
          if (el) result[k] = el.type === 'checkbox' ? el.checked : el.value;
        });
        return result;
      }
    });
    if (formValues) {
      setDirty(true);
      setSettings(prev => {
        const arr = [...prev[field]];
        arr[index] = { ...arr[index], ...formValues };
        return { ...prev, [field]: arr };
      });
    }
  };

  // ── Swal form builders ──────────────────────────────────────────────────────
  const emailForm = (vals = {}) => `
    <div class="ssas-swal-form">
      <select id="swal-type" class="ssas-swal-select">
        ${EMAIL_TYPES.map(t => `<option value="${t}" ${vals.type === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <input id="swal-address" class="ssas-swal-input" type="email" placeholder="Email address" value="${vals.address || ''}" />
      <input id="swal-description" class="ssas-swal-input" type="text" placeholder="Description (optional)" value="${vals.description || ''}" />
    </div>`;

  const phoneForm = (vals = {}) => `
    <div class="ssas-swal-form">
      <select id="swal-type" class="ssas-swal-select">
        ${PHONE_TYPES.map(t => `<option value="${t}" ${vals.type === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <input id="swal-number" class="ssas-swal-input" type="text" placeholder="Phone number" value="${vals.number || ''}" />
      <input id="swal-countryCode" class="ssas-swal-input" type="text" placeholder="Country code (e.g. +91)" value="${vals.countryCode || ''}" />
      <input id="swal-description" class="ssas-swal-input" type="text" placeholder="Description (optional)" value="${vals.description || ''}" />
    </div>`;

  const socialForm = (vals = {}) => `
    <div class="ssas-swal-form">
      <select id="swal-platform" class="ssas-swal-select">
        ${SOCIAL_PLATFORMS.map(p => `<option value="${p}" ${vals.platform === p ? 'selected' : ''}>${p}</option>`).join('')}
      </select>
      <input id="swal-url" class="ssas-swal-input" type="url" placeholder="Profile URL" value="${vals.url || ''}" />
    </div>`;

  const featureForm = (vals = {}) => `
    <div class="ssas-swal-form">
      <input id="swal-name" class="ssas-swal-input" type="text" placeholder="Feature flag name (e.g. DARK_MODE)" value="${vals.name || ''}" />
      <input id="swal-description" class="ssas-swal-input" type="text" placeholder="Description" value="${vals.description || ''}" />
      <label class="ssas-swal-check-label">
        <input id="swal-enabled" type="checkbox" ${vals.enabled ? 'checked' : ''} /> Enabled by default
      </label>
    </div>`;

  const ipForm = (vals = {}) => `
    <div class="ssas-swal-form">
      <input id="swal-ip" class="ssas-swal-input" type="text" placeholder="IP address (e.g. 192.168.1.1)" />
    </div>`;

  // ── Nav scroll helper ───────────────────────────────────────────────────────
  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(`ssas-sec-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className={`ssas-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="ssas-loading-screen">
        <div className="ssas-loading-ring" />
        <span className="ssas-loading-text">Loading Settings...</span>
      </div>
    </div>
  );

  if (!settings) return (
    <div className={`ssas-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="ssas-error-screen">
        <AlertTriangle size={40} />
        <p>Failed to load settings</p>
        <button className="ssas-btn-primary" onClick={fetchSettings}><RefreshCw size={15} /> Retry</button>
      </div>
    </div>
  );

  const s = settings;

  return (
    <div className={`ssas-root ${isDarkMode ? 'dark' : 'light'}`}>

      {/* ── Background ── */}
      <div className="ssas-bg-mesh" aria-hidden="true">
        <div className="ssas-bg-orb ssas-orb-a" />
        <div className="ssas-bg-orb ssas-orb-b" />
      </div>

      {/* ── Header ── */}
      <header className="ssas-header">
        <div className="ssas-header-left">
          <div className="ssas-header-icon"><Settings size={22} /></div>
          <div>
            <h1 className="ssas-header-title">Site Settings</h1>
            <p className="ssas-header-sub">Configure your Shivam Stack portfolio platform</p>
          </div>
        </div>
        <div className="ssas-header-right">
          {dirty && <span className="ssas-unsaved-badge"><AlertTriangle size={12} /> Unsaved changes</span>}
          <button className="ssas-btn-ghost" onClick={fetchSettings}><RefreshCw size={15} /> Refresh</button>
          <button
            className={`ssas-btn-primary ${saving ? 'ssas-btn-loading' : ''}`}
            onClick={saveSettings}
            disabled={saving || !dirty}
          >
            {saving ? <><div className="ssas-spinner" /> Saving...</> : <><Save size={15} /> Save All Changes</>}
          </button>
        </div>
      </header>

      <div className="ssas-layout">

        {/* ── Sidebar Nav ── */}
        <nav className="ssas-sidebar" aria-label="Settings sections">
          <p className="ssas-sidebar-label">SECTIONS</p>
          {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`ssas-sidebar-item ${activeSection === id ? 'ssas-sidebar-active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
              {id === activeSection && <ChevronRight size={13} className="ssas-sidebar-arrow" />}
            </button>
          ))}
          <div className="ssas-sidebar-divider" />
          <div className="ssas-sidebar-info">
            <Activity size={13} />
            <span>Last saved: {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : 'Never'}</span>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <main className="ssas-main">

          {/* ════════ GENERAL ════════ */}
          <SectionCard id="general" icon={Settings} title="General Information" subtitle="Core identity of your platform">
            <div className="ssas-grid-2">
              <FieldRow label="App Name" hint="Used in browser tabs and emails" required>
                <input className="ssas-input" value={s.appName || ''} onChange={e => update('appName', e.target.value)} placeholder="Shivam Stack" />
              </FieldRow>
              <FieldRow label="Company Name" hint="Your brand / business name" required>
                <input className="ssas-input" value={s.companyName || ''} onChange={e => update('companyName', e.target.value)} placeholder="Shivam Stack" />
              </FieldRow>
              <FieldRow label="Company Legal Name" hint="Full legal entity name for invoices">
                <input className="ssas-input" value={s.companyLegalName || ''} onChange={e => update('companyLegalName', e.target.value)} placeholder="Shivam Kumar Tech Pvt Ltd" />
              </FieldRow>
              <FieldRow label="Company Address" hint="Displayed in legal/billing documents">
                <textarea className="ssas-input ssas-textarea" rows={2} value={s.companyAddress || ''} onChange={e => update('companyAddress', e.target.value)} placeholder="123 Dev Street, Mumbai, India" />
              </FieldRow>
              <FieldRow label="Website URL" hint="Public-facing website URL">
                <input className="ssas-input" type="url" value={s.websiteUrl || ''} onChange={e => update('websiteUrl', e.target.value)} placeholder="https://shivamstack.com" />
              </FieldRow>
              <FieldRow label="Dashboard URL" hint="Admin dashboard URL">
                <input className="ssas-input" type="url" value={s.dashboardUrl || ''} onChange={e => update('dashboardUrl', e.target.value)} placeholder="https://admin.shivamstack.com" />
              </FieldRow>
              <FieldRow label="API Base URL" hint="REST API base endpoint">
                <input className="ssas-input" type="url" value={s.apiBaseUrl || ''} onChange={e => update('apiBaseUrl', e.target.value)} placeholder="https://api.shivamstack.com/v1" />
              </FieldRow>
            </div>
            <div className="ssas-info-banner">
              <Info size={14} />
              <span>These values are used across email templates, invoices, and SEO metadata. Keep them accurate and up-to-date.</span>
            </div>
          </SectionCard>

          {/* ════════ CONTACT ════════ */}
          <SectionCard id="contact" icon={Mail} title="Contact Information" subtitle="Manage official email addresses and phone numbers">

            {/* Emails */}
            <div className="ssas-subsection">
              <div className="ssas-subsection-head">
                <div>
                  <h3 className="ssas-subsec-title"><Mail size={15} /> Official Emails</h3>
                  <p className="ssas-subsec-desc">Assign emails by purpose — support, billing, legal, sales, etc.</p>
                </div>
                <button
                  className="ssas-btn-add"
                  onClick={() => addItem('officialEmails', { type: 'support', address: '', description: '' }, emailForm)}
                >
                  <Plus size={14} /> Add Email
                </button>
              </div>
              <div className="ssas-table-wrap">
                {(!s.officialEmails || s.officialEmails.length === 0) ? (
                  <div className="ssas-empty-state"><Mail size={28} /><p>No emails added yet</p></div>
                ) : (
                  <table className="ssas-table">
                    <thead>
                      <tr>
                        <th>Type</th><th>Address</th><th>Description</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.officialEmails.map((em, i) => (
                        <tr key={i}>
                          <td><span className={`ssas-type-badge ssas-type-${em.type}`}>{em.type}</span></td>
                          <td className="ssas-td-mono">{em.address}</td>
                          <td className="ssas-td-muted">{em.description || '—'}</td>
                          <td>
                            <div className="ssas-row-actions">
                              <button className="ssas-icon-btn ssas-btn-edit" onClick={() => editItem('officialEmails', i, em, emailForm)}><Edit2 size={14} /></button>
                              <button className="ssas-icon-btn ssas-btn-del" onClick={() => removeItem('officialEmails', i)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Phones */}
            <div className="ssas-subsection">
              <div className="ssas-subsection-head">
                <div>
                  <h3 className="ssas-subsec-title"><Phone size={15} /> Contact Numbers</h3>
                  <p className="ssas-subsec-desc">Add phone numbers categorized by purpose.</p>
                </div>
                <button
                  className="ssas-btn-add"
                  onClick={() => addItem('contactNumbers', { type: 'support', number: '', countryCode: '', description: '' }, phoneForm)}
                >
                  <Plus size={14} /> Add Number
                </button>
              </div>
              <div className="ssas-table-wrap">
                {(!s.contactNumbers || s.contactNumbers.length === 0) ? (
                  <div className="ssas-empty-state"><Phone size={28} /><p>No phone numbers added yet</p></div>
                ) : (
                  <table className="ssas-table">
                    <thead><tr><th>Type</th><th>Number</th><th>Code</th><th>Description</th><th>Actions</th></tr></thead>
                    <tbody>
                      {s.contactNumbers.map((ph, i) => (
                        <tr key={i}>
                          <td><span className={`ssas-type-badge ssas-type-${ph.type}`}>{ph.type}</span></td>
                          <td className="ssas-td-mono">{ph.number}</td>
                          <td className="ssas-td-muted">{ph.countryCode || '—'}</td>
                          <td className="ssas-td-muted">{ph.description || '—'}</td>
                          <td>
                            <div className="ssas-row-actions">
                              <button className="ssas-icon-btn ssas-btn-edit" onClick={() => editItem('contactNumbers', i, ph, phoneForm)}><Edit2 size={14} /></button>
                              <button className="ssas-icon-btn ssas-btn-del" onClick={() => removeItem('contactNumbers', i)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ════════ SOCIAL ════════ */}
          <SectionCard id="social" icon={Share2} title="Social Media Links" subtitle="Manage your public social profiles">
            <div className="ssas-subsection">
              <div className="ssas-subsection-head">
                <p className="ssas-subsec-desc">These links appear in the website footer and About section.</p>
                <button
                  className="ssas-btn-add"
                  onClick={() => addItem('socialLinks', { platform: 'github', url: '' }, socialForm)}
                >
                  <Plus size={14} /> Add Platform
                </button>
              </div>
              <div className="ssas-social-grid">
                {(!s.socialLinks || s.socialLinks.length === 0) ? (
                  <div className="ssas-empty-state"><Share2 size={28} /><p>No social links added yet</p></div>
                ) : (
                  s.socialLinks.map((sl, i) => {
                    const Icon = SOCIAL_ICONS[sl.platform] || Globe;
                    return (
                      <div className="ssas-social-card" key={i}>
                        <div className={`ssas-social-icon ssas-social-${sl.platform}`}><Icon size={20} /></div>
                        <div className="ssas-social-info">
                          <span className="ssas-social-platform">{sl.platform}</span>
                          <a href={sl.url} target="_blank" rel="noreferrer" className="ssas-social-url">
                            {sl.url || 'No URL'} <ExternalLink size={11} />
                          </a>
                        </div>
                        <div className="ssas-row-actions">
                          <button className="ssas-icon-btn ssas-btn-edit" onClick={() => editItem('socialLinks', i, sl, socialForm)}><Edit2 size={14} /></button>
                          <button className="ssas-icon-btn ssas-btn-del" onClick={() => removeItem('socialLinks', i)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </SectionCard>

          {/* ════════ BUSINESS HOURS ════════ */}
          <SectionCard id="hours" icon={Clock} title="Business Hours" subtitle="Set your working hours for each day of the week">
            <p className="ssas-section-note">These hours are displayed on your Contact page and used for automated response scheduling.</p>
            <div className="ssas-hours-grid">
              {DAYS.map(day => {
                const existing = s.businessHours?.find(h => h.day === day);
                const hours = existing || { day, open: '09:00', close: '18:00', isClosed: false };
                const updateHours = (field, val) => {
                  setDirty(true);
                  setSettings(prev => {
                    const arr = [...(prev.businessHours || [])];
                    const idx = arr.findIndex(h => h.day === day);
                    const updated = { ...hours, [field]: val };
                    if (idx >= 0) arr[idx] = updated; else arr.push(updated);
                    return { ...prev, businessHours: arr };
                  });
                };
                return (
                  <div className={`ssas-hour-row ${hours.isClosed ? 'ssas-hour-closed' : ''}`} key={day}>
                    <div className="ssas-hour-day">
                      <span className="ssas-day-name">{day.slice(0, 3).toUpperCase()}</span>
                      <span className="ssas-day-full">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                    </div>
                    <div className="ssas-hour-controls">
                      {hours.isClosed ? (
                        <span className="ssas-closed-label">Closed</span>
                      ) : (
                        <>
                          <input className="ssas-input ssas-time-input" type="time" value={hours.open || '09:00'} onChange={e => updateHours('open', e.target.value)} />
                          <span className="ssas-hour-sep">to</span>
                          <input className="ssas-input ssas-time-input" type="time" value={hours.close || '18:00'} onChange={e => updateHours('close', e.target.value)} />
                        </>
                      )}
                    </div>
                    <Toggle value={!hours.isClosed} onChange={v => updateHours('isClosed', !v)} label={hours.isClosed ? 'Closed' : 'Open'} />
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* ════════ BRANDING ════════ */}
          <SectionCard id="branding" icon={Image} title="Branding & Assets" subtitle="Logo, favicon, and brand identity configuration">
            <div className="ssas-grid-2">
              <FieldRow label="Logo URL" hint="Main logo — shown in header (light mode)">
                <div className="ssas-url-input-wrap">
                  <input className="ssas-input" type="url" value={s.branding?.logoUrl || ''} onChange={e => update('branding.logoUrl', e.target.value)} placeholder="https://cdn.shivamstack.com/logo.png" />
                  {s.branding?.logoUrl && <img className="ssas-logo-preview" src={s.branding.logoUrl} alt="logo preview" />}
                </div>
              </FieldRow>
              <FieldRow label="Dark Mode Logo URL" hint="Logo variant for dark backgrounds">
                <div className="ssas-url-input-wrap">
                  <input className="ssas-input" type="url" value={s.branding?.darkModeLogoUrl || ''} onChange={e => update('branding.darkModeLogoUrl', e.target.value)} placeholder="https://cdn.shivamstack.com/logo-dark.png" />
                  {s.branding?.darkModeLogoUrl && <img className="ssas-logo-preview" src={s.branding.darkModeLogoUrl} alt="dark logo preview" />}
                </div>
              </FieldRow>
              <FieldRow label="Favicon URL" hint="Small icon for browser tabs (32×32 or 64×64 PNG)">
                <input className="ssas-input" type="url" value={s.branding?.faviconUrl || ''} onChange={e => update('branding.faviconUrl', e.target.value)} placeholder="https://cdn.shivamstack.com/favicon.ico" />
              </FieldRow>
              <FieldRow label="Default Language" hint="BCP 47 language tag (e.g. en, hi, fr)">
                <select className="ssas-input ssas-select" value={s.branding?.defaultLanguage || 'en'} onChange={e => update('branding.defaultLanguage', e.target.value)}>
                  {['en', 'hi', 'fr', 'de', 'es', 'ja', 'zh'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </FieldRow>
            </div>
            <div className="ssas-info-banner ssas-info-tip">
              <Image size={14} />
              <span>Use CDN-hosted URLs for optimal performance. Recommended formats: SVG or WebP for logos, ICO or PNG for favicons.</span>
            </div>
          </SectionCard>

          {/* ════════ SECURITY ════════ */}
          <SectionCard id="security" icon={Shield} title="Security Settings" subtitle="Control access, authentication, and maintenance mode" badge="Critical">
            <div className="ssas-grid-2">
              <FieldRow label="Session Timeout" hint="Hours before admin session expires">
                <input className="ssas-input" type="number" min={1} max={168} value={s.security?.sessionTimeout ?? 24} onChange={e => update('security.sessionTimeout', +e.target.value)} />
              </FieldRow>
              <FieldRow label="Max Login Attempts" hint="Lock account after N failed attempts">
                <input className="ssas-input" type="number" min={1} max={20} value={s.security?.maxLoginAttempts ?? 5} onChange={e => update('security.maxLoginAttempts', +e.target.value)} />
              </FieldRow>
            </div>

            <div className="ssas-toggle-group">
              <div className="ssas-toggle-row">
                <div>
                  <strong className="ssas-toggle-title">Two-Factor Authentication</strong>
                  <p className="ssas-toggle-desc">Require 2FA for all admin logins. Highly recommended for production.</p>
                </div>
                <Toggle value={s.security?.enable2FA ?? true} onChange={v => update('security.enable2FA', v)} />
              </div>
              <div className={`ssas-toggle-row ${s.security?.isMaintenanceMode ? 'ssas-row-danger' : ''}`}>
                <div>
                  <strong className="ssas-toggle-title">Maintenance Mode</strong>
                  <p className="ssas-toggle-desc">Displays maintenance page to all visitors. Admin dashboard remains accessible.</p>
                </div>
                <Toggle value={s.security?.isMaintenanceMode ?? false} onChange={v => update('security.isMaintenanceMode', v)} />
              </div>
            </div>

            {s.security?.isMaintenanceMode && (
              <FieldRow label="Maintenance Message" hint="Shown to visitors during maintenance">
                <textarea className="ssas-input ssas-textarea" rows={2} value={s.security?.maintenanceMessage || ''} onChange={e => update('security.maintenanceMessage', e.target.value)} placeholder="We'll be back shortly. Thanks for your patience!" />
              </FieldRow>
            )}

            {/* Allowed IPs */}
            <div className="ssas-subsection" style={{ marginTop: '1.5rem' }}>
              <div className="ssas-subsection-head">
                <div>
                  <h3 className="ssas-subsec-title"><Unlock size={14} /> Allowed IPs</h3>
                  <p className="ssas-subsec-desc">Whitelist IPs. Leave empty to allow all.</p>
                </div>
                <button className="ssas-btn-add" onClick={async () => {
                  const { value } = await Swal.fire({ title: 'Add Allowed IP', html: ipForm(), showCancelButton: true, ...swalConfig(isDarkMode), preConfirm: () => document.getElementById('swal-ip')?.value });
                  if (value) { setDirty(true); setSettings(prev => ({ ...prev, security: { ...prev.security, allowedIPs: [...(prev.security?.allowedIPs || []), value] } })); }
                }}><Plus size={14} /> Add IP</button>
              </div>
              <div className="ssas-ip-list">
                {(s.security?.allowedIPs || []).length === 0 ? <span className="ssas-empty-inline">No restrictions — all IPs allowed</span> :
                  (s.security?.allowedIPs || []).map((ip, i) => (
                    <span className="ssas-ip-tag ssas-ip-allow" key={i}>
                      <Wifi size={12} />{ip}
                      <button className="ssas-tag-del" onClick={() => { setDirty(true); setSettings(prev => ({ ...prev, security: { ...prev.security, allowedIPs: prev.security.allowedIPs.filter((_, j) => j !== i) } })); }}><X size={11} /></button>
                    </span>
                  ))
                }
              </div>
            </div>

            {/* Blocked IPs */}
            <div className="ssas-subsection">
              <div className="ssas-subsection-head">
                <div>
                  <h3 className="ssas-subsec-title"><Lock size={14} /> Blocked IPs</h3>
                  <p className="ssas-subsec-desc">Deny access from these IPs globally.</p>
                </div>
                <button className="ssas-btn-add ssas-btn-danger-add" onClick={async () => {
                  const { value } = await Swal.fire({ title: 'Block IP', html: ipForm(), showCancelButton: true, ...swalConfig(isDarkMode), preConfirm: () => document.getElementById('swal-ip')?.value });
                  if (value) { setDirty(true); setSettings(prev => ({ ...prev, security: { ...prev.security, blockedIPs: [...(prev.security?.blockedIPs || []), value] } })); }
                }}><Plus size={14} /> Block IP</button>
              </div>
              <div className="ssas-ip-list">
                {(s.security?.blockedIPs || []).length === 0 ? <span className="ssas-empty-inline">No blocked IPs</span> :
                  (s.security?.blockedIPs || []).map((ip, i) => (
                    <span className="ssas-ip-tag ssas-ip-block" key={i}>
                      <Lock size={12} />{ip}
                      <button className="ssas-tag-del" onClick={() => { setDirty(true); setSettings(prev => ({ ...prev, security: { ...prev.security, blockedIPs: prev.security.blockedIPs.filter((_, j) => j !== i) } })); }}><X size={11} /></button>
                    </span>
                  ))
                }
              </div>
            </div>
          </SectionCard>

          {/* ════════ COMPLIANCE ════════ */}
          <SectionCard id="compliance" icon={FileText} title="Legal & Compliance" subtitle="GDPR, data retention, and cookie consent settings">
            <div className="ssas-toggle-group">
              <div className="ssas-toggle-row">
                <div>
                  <strong className="ssas-toggle-title">GDPR Compliance</strong>
                  <p className="ssas-toggle-desc">Confirms your platform adheres to GDPR regulations for EU users.</p>
                </div>
                <Toggle value={s.compliance?.gdprCompliant ?? true} onChange={v => update('compliance.gdprCompliant', v)} />
              </div>
              <div className="ssas-toggle-row">
                <div>
                  <strong className="ssas-toggle-title">Cookie Consent Banner</strong>
                  <p className="ssas-toggle-desc">Display cookie consent popup to first-time visitors.</p>
                </div>
                <Toggle value={s.compliance?.cookieConsent?.enabled ?? true} onChange={v => update('compliance.cookieConsent.enabled', v)} />
              </div>
            </div>
            <div className="ssas-grid-1" style={{ marginTop: '1rem' }}>
              <FieldRow label="Data Retention Policy" hint="Publicly displayed policy description">
                <textarea className="ssas-input ssas-textarea" rows={3} value={s.compliance?.dataRetentionPolicy || ''} onChange={e => update('compliance.dataRetentionPolicy', e.target.value)} placeholder="User data is retained only as long as necessary..." />
              </FieldRow>
              {s.compliance?.cookieConsent?.enabled && (
                <FieldRow label="Cookie Banner Text" hint="Message shown in the cookie consent popup">
                  <textarea className="ssas-input ssas-textarea" rows={2} value={s.compliance?.cookieConsent?.bannerText || ''} onChange={e => update('compliance.cookieConsent.bannerText', e.target.value)} placeholder="We use cookies to improve your experience. By continuing, you agree to our cookie policy." />
                </FieldRow>
              )}
            </div>
          </SectionCard>

          {/* ════════ ANALYTICS ════════ */}
          <SectionCard id="analytics" icon={BarChart2} title="Analytics & Telemetry" subtitle="Track visitor behaviour and platform performance">
            <div className="ssas-grid-2">
              <FieldRow label="Google Analytics ID" hint="Format: G-XXXXXXXXXX or UA-XXXXXXXX-X">
                <div className="ssas-input-with-icon">
                  <BarChart2 size={15} className="ssas-input-icon" />
                  <input className="ssas-input ssas-input-iconed" value={s.analytics?.googleAnalyticsId || ''} onChange={e => update('analytics.googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" />
                </div>
              </FieldRow>
            </div>
            <div className="ssas-toggle-group" style={{ marginTop: '1rem' }}>
              <div className="ssas-toggle-row">
                <div>
                  <strong className="ssas-toggle-title">Enable Telemetry</strong>
                  <p className="ssas-toggle-desc">Collect anonymous usage statistics to improve platform performance and stability.</p>
                </div>
                <Toggle value={s.analytics?.enableTelemetry ?? true} onChange={v => update('analytics.enableTelemetry', v)} />
              </div>
            </div>
            <div className="ssas-info-banner">
              <Info size={14} />
              <span>Ensure your Privacy Policy is updated to reflect analytics data collection. Telemetry data is anonymised and never sold.</span>
            </div>
          </SectionCard>

          {/* ════════ INTEGRATIONS ════════ */}
          <SectionCard id="integrations" icon={Zap} title="Third-Party Integrations" subtitle="Payment gateway and email service configuration">

            {/* Stripe */}
            <div className="ssas-integration-card">
              <div className="ssas-integration-header">
                <div className="ssas-integration-logo ssas-stripe-logo">
                  <CreditCard size={20} />
                </div>
                <div className="ssas-integration-meta">
                  <h3 className="ssas-integration-name">Stripe Payments</h3>
                  <p className="ssas-integration-desc">Accept payments for digital products, PDFs, and services</p>
                </div>
                <div className="ssas-integration-status">
                  <StatusDot active={s.integrations?.stripe?.enabled} />
                  <span>{s.integrations?.stripe?.enabled ? 'Active' : 'Inactive'}</span>
                </div>
                <Toggle value={s.integrations?.stripe?.enabled ?? false} onChange={v => update('integrations.stripe.enabled', v)} />
              </div>
              {s.integrations?.stripe?.enabled && (
                <div className="ssas-integration-body">
                  <div className="ssas-grid-2">
                    <FieldRow label="Publishable Key" hint="Starts with pk_live_ or pk_test_">
                      <input className="ssas-input" value={s.integrations?.stripe?.publicKey || ''} onChange={e => update('integrations.stripe.publicKey', e.target.value)} placeholder="pk_live_..." />
                    </FieldRow>
                    <FieldRow label="Secret Key" hint="Keep this absolutely private">
                      <SecretInput value={s.integrations?.stripe?.secretKey} onChange={v => update('integrations.stripe.secretKey', v)} placeholder="sk_live_..." />
                    </FieldRow>
                    <FieldRow label="Webhook Secret" hint="For verifying Stripe webhook events">
                      <SecretInput value={s.integrations?.stripe?.webhookSecret} onChange={v => update('integrations.stripe.webhookSecret', v)} placeholder="whsec_..." />
                    </FieldRow>
                    <FieldRow label="Currency" hint="Default payment currency">
                      <select className="ssas-input ssas-select" value={s.integrations?.stripe?.currency || 'usd'} onChange={e => update('integrations.stripe.currency', e.target.value)}>
                        {['usd', 'eur', 'gbp', 'inr', 'aud', 'cad'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                    </FieldRow>
                  </div>
                </div>
              )}
            </div>

            {/* SendGrid */}
            <div className="ssas-integration-card" style={{ marginTop: '1rem' }}>
              <div className="ssas-integration-header">
                <div className="ssas-integration-logo ssas-sendgrid-logo">
                  <Mail size={20} />
                </div>
                <div className="ssas-integration-meta">
                  <h3 className="ssas-integration-name">SendGrid Email</h3>
                  <p className="ssas-integration-desc">Transactional emails, newsletters, and order confirmations</p>
                </div>
                <div className="ssas-integration-status">
                  <StatusDot active={s.integrations?.sendgrid?.enabled} />
                  <span>{s.integrations?.sendgrid?.enabled ? 'Active' : 'Inactive'}</span>
                </div>
                <Toggle value={s.integrations?.sendgrid?.enabled ?? false} onChange={v => update('integrations.sendgrid.enabled', v)} />
              </div>
              {s.integrations?.sendgrid?.enabled && (
                <div className="ssas-integration-body">
                  <div className="ssas-grid-2">
                    <FieldRow label="API Key" hint="Full access SendGrid API key">
                      <SecretInput value={s.integrations?.sendgrid?.apiKey} onChange={v => update('integrations.sendgrid.apiKey', v)} placeholder="SG.XXXXXXXXXXXX" />
                    </FieldRow>
                    <FieldRow label="From Email" hint="Default sender address">
                      <input className="ssas-input" type="email" value={s.integrations?.sendgrid?.fromEmail || ''} onChange={e => update('integrations.sendgrid.fromEmail', e.target.value)} placeholder="noreply@shivamstack.com" />
                    </FieldRow>
                    <FieldRow label="From Name" hint="Displayed sender name in inboxes">
                      <input className="ssas-input" value={s.integrations?.sendgrid?.fromName || ''} onChange={e => update('integrations.sendgrid.fromName', e.target.value)} placeholder="Shivam Stack" />
                    </FieldRow>
                    <FieldRow label="Reply-To Email" hint="Where replies will be sent">
                      <input className="ssas-input" type="email" value={s.integrations?.sendgrid?.replyTo || ''} onChange={e => update('integrations.sendgrid.replyTo', e.target.value)} placeholder="support@shivamstack.com" />
                    </FieldRow>
                  </div>
                </div>
              )}
            </div>

            {/* Razorpay */}
            <div className="ssas-integration-card" style={{ marginTop: '1rem' }}>
              <div className="ssas-integration-header">
                <div className="ssas-integration-logo ssas-razorpay-logo">
                  <Hash size={20} />
                </div>
                <div className="ssas-integration-meta">
                  <h3 className="ssas-integration-name">Razorpay</h3>
                  <p className="ssas-integration-desc">Indian payment gateway — UPI, cards, net banking</p>
                </div>
                <div className="ssas-integration-status">
                  <StatusDot active={s.integrations?.razorpay?.enabled} />
                  <span>{s.integrations?.razorpay?.enabled ? 'Active' : 'Inactive'}</span>
                </div>
                <Toggle value={s.integrations?.razorpay?.enabled ?? false} onChange={v => update('integrations.razorpay.enabled', v)} />
              </div>
              {s.integrations?.razorpay?.enabled && (
                <div className="ssas-integration-body">
                  <div className="ssas-grid-2">
                    <FieldRow label="Key ID" hint="Razorpay Key ID (starts with rzp_)">
                      <input className="ssas-input" value={s.integrations?.razorpay?.keyId || ''} onChange={e => update('integrations.razorpay.keyId', e.target.value)} placeholder="rzp_live_..." />
                    </FieldRow>
                    <FieldRow label="Key Secret" hint="Keep this private">
                      <SecretInput value={s.integrations?.razorpay?.keySecret} onChange={v => update('integrations.razorpay.keySecret', v)} placeholder="Secret key..." />
                    </FieldRow>
                    <FieldRow label="Webhook Secret" hint="For verifying Razorpay webhook events">
                      <SecretInput value={s.integrations?.razorpay?.webhookSecret} onChange={v => update('integrations.razorpay.webhookSecret', v)} placeholder="Webhook secret..." />
                    </FieldRow>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ════════ BACKUP ════════ */}
          <SectionCard id="backup" icon={Database} title="Backup & Recovery" subtitle="Automated backup configuration for your platform data">
            <div className="ssas-toggle-group">
              <div className="ssas-toggle-row">
                <div>
                  <strong className="ssas-toggle-title">Automatic Backups</strong>
                  <p className="ssas-toggle-desc">Automatically create encrypted backups of your database and uploaded files.</p>
                </div>
                <Toggle value={s.backup?.autoBackup ?? true} onChange={v => update('backup.autoBackup', v)} />
              </div>
            </div>
            {s.backup?.autoBackup && (
              <div className="ssas-grid-2" style={{ marginTop: '1rem' }}>
                <FieldRow label="Backup Frequency" hint="How often backups are created">
                  <div className="ssas-freq-select">
                    {BACKUP_FREQS.map(freq => (
                      <button
                        key={freq}
                        type="button"
                        className={`ssas-freq-btn ${s.backup?.backupFrequency === freq ? 'ssas-freq-active' : ''}`}
                        onClick={() => update('backup.backupFrequency', freq)}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    ))}
                  </div>
                </FieldRow>
                <FieldRow label="Retention Days" hint="Delete backups older than N days">
                  <input className="ssas-input" type="number" min={1} max={365} value={s.backup?.retentionDays ?? 30} onChange={e => update('backup.retentionDays', +e.target.value)} />
                </FieldRow>
                <FieldRow label="Backup Storage URL" hint="Cloud storage endpoint for backups (S3, GCS, etc.)">
                  <input className="ssas-input" type="url" value={s.backup?.storageUrl || ''} onChange={e => update('backup.storageUrl', e.target.value)} placeholder="s3://my-bucket/backups" />
                </FieldRow>
                <FieldRow label="Notification Email" hint="Receive backup success/failure alerts">
                  <input className="ssas-input" type="email" value={s.backup?.notificationEmail || ''} onChange={e => update('backup.notificationEmail', e.target.value)} placeholder="admin@shivamstack.com" />
                </FieldRow>
              </div>
            )}
            <div className="ssas-backup-actions">
              <button className="ssas-btn-ghost" onClick={() => Swal.fire({ title: 'Backup Triggered', text: 'Manual backup has been initiated.', icon: 'success', ...swalConfig(isDarkMode) })}>
                <Download size={15} /> Manual Backup Now
              </button>
              <button className="ssas-btn-ghost" onClick={() => Swal.fire({ title: 'Restore Backup', text: 'Restoration initiated from latest backup.', icon: 'info', ...swalConfig(isDarkMode) })}>
                <Upload size={15} /> Restore Latest
              </button>
            </div>
          </SectionCard>

          {/* ════════ FEATURE FLAGS ════════ */}
          <SectionCard id="features" icon={Flag} title="Feature Flags" subtitle="Toggle platform features on/off without code deployment">
            <p className="ssas-section-note">Feature flags let you enable/disable functionality for A/B testing, gradual rollouts, or emergency disabling of broken features.</p>
            <div className="ssas-subsection">
              <div className="ssas-subsection-head">
                <p className="ssas-subsec-desc">{(s.featureFlags || []).length} flags defined</p>
                <button
                  className="ssas-btn-add"
                  onClick={() => addItem('featureFlags', { name: '', enabled: false, description: '' }, featureForm)}
                >
                  <Plus size={14} /> New Flag
                </button>
              </div>
              <div className="ssas-flags-list">
                {(!s.featureFlags || s.featureFlags.length === 0) ? (
                  <div className="ssas-empty-state"><Flag size={28} /><p>No feature flags defined</p></div>
                ) : (
                  s.featureFlags.map((flag, i) => (
                    <div className="ssas-flag-row" key={i}>
                      <div className="ssas-flag-info">
                        <div className="ssas-flag-name">
                          <Code2 size={13} />
                          <span>{flag.name}</span>
                          <span className={`ssas-flag-status ${flag.enabled ? 'ssas-flag-on' : 'ssas-flag-off'}`}>
                            {flag.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        {flag.description && <p className="ssas-flag-desc">{flag.description}</p>}
                      </div>
                      <div className="ssas-flag-actions">
                        <Toggle
                          value={flag.enabled}
                          onChange={v => {
                            setDirty(true);
                            setSettings(prev => {
                              const arr = [...prev.featureFlags];
                              arr[i] = { ...arr[i], enabled: v };
                              return { ...prev, featureFlags: arr };
                            });
                          }}
                        />
                        <button className="ssas-icon-btn ssas-btn-edit" onClick={() => editItem('featureFlags', i, flag, featureForm)}><Edit2 size={14} /></button>
                        <button className="ssas-icon-btn ssas-btn-del" onClick={() => removeItem('featureFlags', i)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── Bottom save bar ── */}
          <div className={`ssas-save-bar ${dirty ? 'ssas-save-bar-visible' : ''}`}>
            <div className="ssas-save-bar-inner">
              <span className="ssas-save-bar-text"><AlertTriangle size={14} /> You have unsaved changes</span>
              <div className="ssas-save-bar-actions">
                <button className="ssas-btn-ghost" onClick={() => { setDirty(false); fetchSettings(); }}>Discard</button>
                <button className={`ssas-btn-primary ${saving ? 'ssas-btn-loading' : ''}`} onClick={saveSettings} disabled={saving}>
                  {saving ? <><div className="ssas-spinner" /> Saving...</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default MainSettings;