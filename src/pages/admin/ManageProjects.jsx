import React, { useContext, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  Briefcase, Plus, Edit2, Trash2, RefreshCw, Search, Hash,
  CheckCircle, Clock, Rocket, Calendar, User, Image,
  BarChart2, AlertTriangle, Code2, ExternalLink
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';


const API = '/admin/projects';
const token = () => localStorage.getItem('adminToken');
const swalCfg = (d) => ({ background: d ? '#0f1117' : '#fff', color: d ? '#e2e8f0' : '#1a202c', confirmButtonColor: '#6c63ff' });
const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const EMPTY = { title: '', slug: '', description: '', client: '', startDate: '', endDate: '', status: 'planned', images: '' };

const STATUS_META = {
  planned:     { label: 'Planned',     color: 'saap-planned',     icon: Clock },
  'in-progress': { label: 'In Progress', color: 'saap-inprogress',  icon: Rocket },
  completed:   { label: 'Completed',   color: 'saap-completed',   icon: CheckCircle },
};

const Projects = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setItems(data.data || data);
    } catch {
      Swal.fire({ title: 'Error', text: 'Failed to load projects.', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setLoading(false); }
  }, [isDarkMode]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title, slug: item.slug, description: item.description || '',
      client: item.client || '', status: item.status,
      startDate: item.startDate ? item.startDate.substring(0, 10) : '',
      endDate: item.endDate ? item.endDate.substring(0, 10) : '',
      images: Array.isArray(item.images) ? item.images.join('\n') : (item.images || ''),
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY); };

  const handleFormChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return Swal.fire({ title: 'Validation', text: 'Title is required.', icon: 'warning', ...swalCfg(isDarkMode) });
    setSaving(true);
    try {
      const payload = { ...form, images: form.images ? form.images.split('\n').map(u => u.trim()).filter(Boolean) : [] };
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API}/${editing._id}` : API;
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      Swal.fire({ title: editing ? 'Project Updated!' : 'Project Added!', icon: 'success', timer: 1800, showConfirmButton: false, ...swalCfg(isDarkMode) });
      closeModal(); fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Save failed.', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    const r = await Swal.fire({ title: `Delete "${item.title}"?`, text: 'This project will be permanently removed from your portfolio.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#ef4444', ...swalCfg(isDarkMode) });
    if (!r.isConfirmed) return;
    try {
      await fetch(`${API}/${item._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false, ...swalCfg(isDarkMode) });
      fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Delete failed.', icon: 'error', ...swalCfg(isDarkMode) });
    }
  };

  const handleStatusChange = async (item, newStatus) => {
    try {
      await fetch(`${API}/${item._id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, status: newStatus }) });
      fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Status update failed.', icon: 'error', ...swalCfg(isDarkMode) });
    }
  };

  const filtered = items.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || (i.client || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className={`ssas-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="ssas-bg-mesh" aria-hidden="true">
        <div className="ssas-bg-orb ssas-orb-a" /><div className="ssas-bg-orb ssas-orb-b" />
      </div>

      <header className="ssas-header">
        <div className="ssas-header-left">
          <div className="ssas-header-icon" style={{ background: 'linear-gradient(135deg,#6c63ff,#22d3ee)' }}><Briefcase size={20} /></div>
          <div>
            <h1 className="ssas-header-title">Projects</h1>
            <p className="ssas-header-sub">Showcase your portfolio projects to potential clients</p>
          </div>
        </div>
        <div className="ssas-header-right">
          <button className="ssas-btn-ghost" onClick={fetchAll}><RefreshCw size={15} /> Refresh</button>
          <button className="ssas-btn-primary" onClick={openAdd}><Plus size={15} /> Add Project</button>
        </div>
      </header>

      <div className="saap-page-body">
        <div className="saap-stats-row">
          <div className="saap-stat-card"><span className="saap-stat-val">{items.length}</span><span className="saap-stat-lbl">Total Projects</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-purple">{items.filter(i => i.status === 'planned').length}</span><span className="saap-stat-lbl">Planned</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-amber">{items.filter(i => i.status === 'in-progress').length}</span><span className="saap-stat-lbl">In Progress</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-green">{items.filter(i => i.status === 'completed').length}</span><span className="saap-stat-lbl">Completed</span></div>
        </div>

        {/* Kanban-style cards for visual overview */}
        {items.length > 0 && (
          <div className="saap-kanban-row">
            {Object.entries(STATUS_META).map(([status, meta]) => {
              const group = items.filter(i => i.status === status);
              const Icon = meta.icon;
              return (
                <div className={`saap-kanban-col saap-kanban-${status.replace('-','')}`} key={status}>
                  <div className="saap-kanban-head">
                    <Icon size={14} /><span>{meta.label}</span><span className="saap-kanban-count">{group.length}</span>
                  </div>
                  {group.slice(0, 3).map(p => (
                    <div className="saap-kanban-card" key={p._id} onClick={() => openEdit(p)}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="saap-kanban-img" />}
                      <p className="saap-kanban-title">{p.title}</p>
                      {p.client && <p className="saap-kanban-client"><User size={10} />{p.client}</p>}
                    </div>
                  ))}
                  {group.length > 3 && <p className="saap-kanban-more">+{group.length - 3} more</p>}
                </div>
              );
            })}
          </div>
        )}

        <div className="ssas-section-card">
          <div className="ssas-section-header">
            <div className="ssas-section-header-left">
              <div className="ssas-section-icon-wrap"><Briefcase size={18} /></div>
              <div>
                <h2 className="ssas-section-title">All Projects</h2>
                <p className="ssas-section-subtitle">{filtered.length} of {items.length} shown</p>
              </div>
            </div>
            <div className="saap-header-controls">
              <div className="saap-filter-tabs">
                {['all', 'planned', 'in-progress', 'completed'].map(s => (
                  <button key={s} className={`saap-filter-tab ${filterStatus === s ? 'saap-filter-active' : ''}`} onClick={() => setFilterStatus(s)}>
                    {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="saap-search-wrap">
                <Search size={15} className="saap-search-icon" />
                <input className="saap-search-input" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="ssas-section-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="ssas-loading-screen" style={{ minHeight: '200px' }}><div className="ssas-loading-ring" /></div>
            ) : filtered.length === 0 ? (
              <div className="ssas-empty-state"><Briefcase size={36} /><p>No projects found</p><button className="ssas-btn-primary" onClick={openAdd}><Plus size={14} /> Add First Project</button></div>
            ) : (
              <div className="ssas-table-wrap" style={{ borderRadius: 0, border: 'none' }}>
                <table className="ssas-table">
                  <thead><tr><th>#</th><th>Project</th><th>Client</th><th>Status</th><th>Start Date</th><th>End Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map((proj, i) => {
                      const meta = STATUS_META[proj.status] || STATUS_META.planned;
                      const StatusIcon = meta.icon;
                      return (
                        <tr key={proj._id}>
                          <td className="ssas-td-muted">{i + 1}</td>
                          <td>
                            <div className="saap-title-cell">
                              {proj.images?.[0] ? <img src={proj.images[0]} alt="" className="saap-thumb" /> : <div className="saap-thumb-placeholder"><Code2 size={14} /></div>}
                              <div>
                                <div className="saap-title-text">{proj.title}</div>
                                <div className="saap-slug-small"><Hash size={10} />{proj.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="ssas-td-muted">{proj.client || '—'}</td>
                          <td>
                            <select
                              className={`saap-status-select ${meta.color}`}
                              value={proj.status}
                              onChange={e => handleStatusChange(proj, e.target.value)}
                            >
                              {Object.entries(STATUS_META).map(([val, sm]) => <option key={val} value={val}>{sm.label}</option>)}
                            </select>
                          </td>
                          <td className="ssas-td-muted">{proj.startDate ? new Date(proj.startDate).toLocaleDateString() : '—'}</td>
                          <td className="ssas-td-muted">{proj.endDate ? new Date(proj.endDate).toLocaleDateString() : '—'}</td>
                          <td>
                            <div className="ssas-row-actions">
                              <button className="ssas-icon-btn ssas-btn-edit" onClick={() => openEdit(proj)} title="Edit"><Edit2 size={14} /></button>
                              <button className="ssas-icon-btn ssas-btn-del" onClick={() => handleDelete(proj)} title="Delete"><Trash2 size={14} /></button>
                            </div>
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
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="saap-modal-overlay" onClick={closeModal}>
          <div className="saap-modal saap-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="saap-modal-header">
              <h3 className="saap-modal-title">{editing ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="saap-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="saap-modal-body saap-modal-scroll">
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Project Title <span className="ssas-required">*</span></label>
                  <input className="ssas-input" value={form.title} onChange={e => handleFormChange('title', e.target.value)} placeholder="E-commerce Website" />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">Slug <span className="saap-hint">(auto-generated)</span></label>
                  <input className="ssas-input saap-mono" value={form.slug} onChange={e => handleFormChange('slug', e.target.value)} placeholder="e-commerce-website" />
                </div>
              </div>
              <div className="saap-form-group">
                <label className="saap-label">Description</label>
                <textarea className="ssas-input ssas-textarea" rows={3} value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Brief description of the project…" />
              </div>
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Client Name</label>
                  <input className="ssas-input" value={form.client} onChange={e => handleFormChange('client', e.target.value)} placeholder="ABC Corp" />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">Status</label>
                  <select className="ssas-input" value={form.status} onChange={e => handleFormChange('status', e.target.value)}>
                    {Object.entries(STATUS_META).map(([val, sm]) => <option key={val} value={val}>{sm.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Start Date</label>
                  <input className="ssas-input" type="date" value={form.startDate} onChange={e => handleFormChange('startDate', e.target.value)} />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">End Date</label>
                  <input className="ssas-input" type="date" value={form.endDate} onChange={e => handleFormChange('endDate', e.target.value)} />
                </div>
              </div>
              <div className="saap-form-group">
                <label className="saap-label">Image URLs <span className="saap-hint">(one per line)</span></label>
                <textarea className="ssas-input ssas-textarea saap-mono" rows={3} value={form.images} onChange={e => handleFormChange('images', e.target.value)} placeholder="https://cdn.example.com/screenshot1.jpg&#10;https://cdn.example.com/screenshot2.jpg" />
              </div>
            </div>
            <div className="saap-modal-footer">
              <button className="ssas-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className={`ssas-btn-primary ${saving ? 'ssas-btn-loading' : ''}`} onClick={handleSave} disabled={saving}>
                {saving ? <><div className="ssas-spinner" /> Saving…</> : <><CheckCircle size={15} /> {editing ? 'Update Project' : 'Add Project'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;