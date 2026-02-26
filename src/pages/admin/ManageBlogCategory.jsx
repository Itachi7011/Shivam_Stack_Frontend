import React, { useContext, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { FolderOpen, Plus, Edit2, Trash2, RefreshCw, Search, ToggleLeft, Hash, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';


const API = '/admin/blog-categories';
const token = () => localStorage.getItem('adminToken');
const swalCfg = (d) => ({ background: d ? '#0f1117' : '#fff', color: d ? '#e2e8f0' : '#1a202c', confirmButtonColor: '#6c63ff' });

const EMPTY = { name: '', slug: '', description: '', isActive: true };

const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const BlogCategory = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = add mode
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' } });
      const data = await res.json();
      setItems(data.data || data);
    } catch {
      Swal.fire({ title: 'Error', text: 'Failed to load blog categories', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setLoading(false); }
  }, [isDarkMode]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setForm({ name: item.name, slug: item.slug, description: item.description || '', isActive: item.isActive }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY); };

  const handleFormChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return Swal.fire({ title: 'Validation', text: 'Name is required.', icon: 'warning', ...swalCfg(isDarkMode) });
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API}/${editing._id}` : API;
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      Swal.fire({ title: editing ? 'Updated!' : 'Created!', icon: 'success', timer: 1800, showConfirmButton: false, ...swalCfg(isDarkMode) });
      closeModal(); fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Save failed. Please try again.', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    const r = await Swal.fire({ title: `Delete "${item.name}"?`, text: 'This will remove the category. Blogs using it may become uncategorised.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete', confirmButtonColor: '#ef4444', ...swalCfg(isDarkMode) });
    if (!r.isConfirmed) return;
    try {
      await fetch(`${API}/${item._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false, ...swalCfg(isDarkMode) });
      fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Delete failed.', icon: 'error', ...swalCfg(isDarkMode) });
    }
  };

  const handleToggle = async (item) => {
    try {
      await fetch(`${API}/${item._id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, isActive: !item.isActive }) });
      fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Status update failed.', icon: 'error', ...swalCfg(isDarkMode) });
    }
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || (i.slug || '').includes(search.toLowerCase()));

  return (
    <div className={`ssas-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="ssas-bg-mesh" aria-hidden="true">
        <div className="ssas-bg-orb ssas-orb-a" /><div className="ssas-bg-orb ssas-orb-b" />
      </div>

      <header className="ssas-header">
        <div className="ssas-header-left">
          <div className="ssas-header-icon"><FolderOpen size={20} /></div>
          <div>
            <h1 className="ssas-header-title">Blog Categories</h1>
            <p className="ssas-header-sub">Organise your blog posts with categories</p>
          </div>
        </div>
        <div className="ssas-header-right">
          <button className="ssas-btn-ghost" onClick={fetchAll}><RefreshCw size={15} /> Refresh</button>
          <button className="ssas-btn-primary" onClick={openAdd}><Plus size={15} /> New Category</button>
        </div>
      </header>

      <div className="saap-page-body">
        {/* Stats */}
        <div className="saap-stats-row">
          <div className="saap-stat-card">
            <span className="saap-stat-val">{items.length}</span>
            <span className="saap-stat-lbl">Total Categories</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-green">{items.filter(i => i.isActive).length}</span>
            <span className="saap-stat-lbl">Active</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-red">{items.filter(i => !i.isActive).length}</span>
            <span className="saap-stat-lbl">Inactive</span>
          </div>
        </div>

        {/* Table card */}
        <div className="ssas-section-card">
          <div className="ssas-section-header">
            <div className="ssas-section-header-left">
              <div className="ssas-section-icon-wrap"><FolderOpen size={18} /></div>
              <div>
                <h2 className="ssas-section-title">All Blog Categories</h2>
                <p className="ssas-section-subtitle">{filtered.length} of {items.length} categories shown</p>
              </div>
            </div>
            <div className="saap-search-wrap">
              <Search size={15} className="saap-search-icon" />
              <input className="saap-search-input" placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="ssas-section-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="ssas-loading-screen" style={{ minHeight: '200px' }}><div className="ssas-loading-ring" /></div>
            ) : filtered.length === 0 ? (
              <div className="ssas-empty-state"><FolderOpen size={36} /><p>No categories found</p><button className="ssas-btn-primary" onClick={openAdd}><Plus size={14} /> Add First Category</button></div>
            ) : (
              <div className="ssas-table-wrap" style={{ borderRadius: 0, border: 'none' }}>
                <table className="ssas-table">
                  <thead><tr><th>#</th><th>Name</th><th>Slug</th><th>Description</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map((cat, i) => (
                      <tr key={cat._id}>
                        <td className="ssas-td-muted">{i + 1}</td>
                        <td><span className="saap-name-cell"><FolderOpen size={14} className="saap-row-icon" />{cat.name}</span></td>
                        <td><span className="saap-slug-pill"><Hash size={11} />{cat.slug}</span></td>
                        <td className="ssas-td-muted saap-desc-cell">{cat.description || '—'}</td>
                        <td>
                          <button className={`saap-status-toggle ${cat.isActive ? 'saap-active' : 'saap-inactive'}`} onClick={() => handleToggle(cat)} title="Toggle status">
                            {cat.isActive ? <><CheckCircle size={13} /> Active</> : <><XCircle size={13} /> Inactive</>}
                          </button>
                        </td>
                        <td className="ssas-td-muted">{new Date(cat.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="ssas-row-actions">
                            <button className="ssas-icon-btn ssas-btn-edit" onClick={() => openEdit(cat)} title="Edit"><Edit2 size={14} /></button>
                            <button className="ssas-icon-btn ssas-btn-del" onClick={() => handleDelete(cat)} title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
          <div className="saap-modal" onClick={e => e.stopPropagation()}>
            <div className="saap-modal-header">
              <h3 className="saap-modal-title">{editing ? 'Edit Category' : 'New Blog Category'}</h3>
              <button className="saap-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="saap-modal-body">
              <div className="saap-form-group">
                <label className="saap-label">Name <span className="ssas-required">*</span></label>
                <input className="ssas-input" value={form.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="e.g. Web Development" />
              </div>
              <div className="saap-form-group">
                <label className="saap-label">Slug <span className="saap-hint">(auto-generated)</span></label>
                <input className="ssas-input saap-mono" value={form.slug} onChange={e => handleFormChange('slug', e.target.value)} placeholder="web-development" />
              </div>
              <div className="saap-form-group">
                <label className="saap-label">Description</label>
                <textarea className="ssas-input ssas-textarea" rows={3} value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Short description of this category…" />
              </div>
              <div className="saap-form-group saap-form-row">
                <label className="saap-label">Active</label>
                <button type="button" className={`ssas-toggle ${form.isActive ? 'ssas-toggle-on' : ''}`} onClick={() => handleFormChange('isActive', !form.isActive)}>
                  <span className="ssas-toggle-thumb" />
                </button>
              </div>
            </div>
            <div className="saap-modal-footer">
              <button className="ssas-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className={`ssas-btn-primary ${saving ? 'ssas-btn-loading' : ''}`} onClick={handleSave} disabled={saving}>
                {saving ? <><div className="ssas-spinner" /> Saving…</> : <><CheckCircle size={15} /> {editing ? 'Update' : 'Create'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCategory;