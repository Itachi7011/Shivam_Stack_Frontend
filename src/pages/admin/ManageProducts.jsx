import React, { useContext, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  ShoppingBag, Plus, Edit2, Trash2, RefreshCw, Search, Hash,
  CheckCircle, XCircle, DollarSign, Package, Tag, Image, X, AlertTriangle
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';


const API = '/admin/products';
const CATS_API = '/admin/product-categories';
const token = () => localStorage.getItem('adminToken');
const swalCfg = (d) => ({ background: d ? '#0f1117' : '#fff', color: d ? '#e2e8f0' : '#1a202c', confirmButtonColor: '#6c63ff' });
const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const EMPTY = { name: '', slug: '', description: '', price: '', category: '', images: '', stock: 0, isPublished: true };

const Products = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
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
      const [pRes, cRes] = await Promise.all([
        fetch(API, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(CATS_API, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      setItems(pData.data || pData);
      setCategories(cData.data || cData);
    } catch {
      Swal.fire({ title: 'Error', text: 'Failed to load products.', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setLoading(false); }
  }, [isDarkMode]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name, slug: item.slug, description: item.description || '',
      price: item.price, category: item.category?._id || item.category || '',
      images: Array.isArray(item.images) ? item.images.join('\n') : (item.images || ''),
      stock: item.stock ?? 0, isPublished: item.isPublished
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY); };

  const handleFormChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.price === '' || isNaN(Number(form.price))) {
      return Swal.fire({ title: 'Validation', text: 'Name and valid price are required.', icon: 'warning', ...swalCfg(isDarkMode) });
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images ? form.images.split('\n').map(u => u.trim()).filter(Boolean) : [],
      };
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API}/${editing._id}` : API;
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      Swal.fire({ title: editing ? 'Product Updated!' : 'Product Created!', icon: 'success', timer: 1800, showConfirmButton: false, ...swalCfg(isDarkMode) });
      closeModal(); fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Save failed.', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    const r = await Swal.fire({ title: `Delete "${item.name}"?`, text: 'This product will be permanently removed.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#ef4444', ...swalCfg(isDarkMode) });
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
      await fetch(`${API}/${item._id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, isPublished: !item.isPublished }) });
      fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Status update failed.', icon: 'error', ...swalCfg(isDarkMode) });
    }
  };

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || (filterStatus === 'published' ? i.isPublished : !i.isPublished);
    return matchSearch && matchStatus;
  });

  const catName = (cat) => {
    if (!cat) return '—';
    if (typeof cat === 'object') return cat.name;
    const found = categories.find(c => c._id === cat);
    return found ? found.name : '—';
  };

  const totalValue = items.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

  return (
    <div className={`ssas-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="ssas-bg-mesh" aria-hidden="true">
        <div className="ssas-bg-orb ssas-orb-a" /><div className="ssas-bg-orb ssas-orb-b" />
      </div>

      <header className="ssas-header">
        <div className="ssas-header-left">
          <div className="ssas-header-icon" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}><ShoppingBag size={20} /></div>
          <div>
            <h1 className="ssas-header-title">Products</h1>
            <p className="ssas-header-sub">Manage PDFs, digital content, and physical products</p>
          </div>
        </div>
        <div className="ssas-header-right">
          <button className="ssas-btn-ghost" onClick={fetchAll}><RefreshCw size={15} /> Refresh</button>
          <button className="ssas-btn-primary" onClick={openAdd}><Plus size={15} /> Add Product</button>
        </div>
      </header>

      <div className="saap-page-body">
        <div className="saap-stats-row">
          <div className="saap-stat-card"><span className="saap-stat-val">{items.length}</span><span className="saap-stat-lbl">Total Products</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-green">{items.filter(i => i.isPublished).length}</span><span className="saap-stat-lbl">Published</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-amber">{items.filter(i => !i.isPublished).length}</span><span className="saap-stat-lbl">Hidden</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-red">{items.filter(i => (i.stock || 0) === 0).length}</span><span className="saap-stat-lbl">Out of Stock</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-purple">₹{totalValue.toLocaleString()}</span><span className="saap-stat-lbl">Inventory Value</span></div>
        </div>

        <div className="ssas-section-card">
          <div className="ssas-section-header">
            <div className="ssas-section-header-left">
              <div className="ssas-section-icon-wrap" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: 'var(--ss-green)' }}><ShoppingBag size={18} /></div>
              <div>
                <h2 className="ssas-section-title">All Products</h2>
                <p className="ssas-section-subtitle">{filtered.length} of {items.length} shown</p>
              </div>
            </div>
            <div className="saap-header-controls">
              <div className="saap-filter-tabs">
                {['all', 'published', 'hidden'].map(s => (
                  <button key={s} className={`saap-filter-tab ${filterStatus === s ? 'saap-filter-active' : ''}`} onClick={() => setFilterStatus(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="saap-search-wrap">
                <Search size={15} className="saap-search-icon" />
                <input className="saap-search-input" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="ssas-section-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="ssas-loading-screen" style={{ minHeight: '200px' }}><div className="ssas-loading-ring" /></div>
            ) : filtered.length === 0 ? (
              <div className="ssas-empty-state"><ShoppingBag size={36} /><p>No products found</p><button className="ssas-btn-primary" onClick={openAdd}><Plus size={14} /> Add First Product</button></div>
            ) : (
              <div className="ssas-table-wrap" style={{ borderRadius: 0, border: 'none' }}>
                <table className="ssas-table">
                  <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map((prod, i) => (
                      <tr key={prod._id}>
                        <td className="ssas-td-muted">{i + 1}</td>
                        <td>
                          <div className="saap-title-cell">
                            {prod.images?.[0] ? <img src={prod.images[0]} alt="" className="saap-thumb" /> : <div className="saap-thumb-placeholder"><ShoppingBag size={14} /></div>}
                            <div>
                              <div className="saap-title-text">{prod.name}</div>
                              <div className="saap-slug-small"><Hash size={10} />{prod.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="saap-cat-badge saap-cat-green">{catName(prod.category)}</span></td>
                        <td><span className="saap-price-cell">₹{Number(prod.price).toLocaleString()}</span></td>
                        <td>
                          <span className={`saap-stock-badge ${(prod.stock || 0) === 0 ? 'saap-stock-out' : (prod.stock || 0) < 5 ? 'saap-stock-low' : 'saap-stock-ok'}`}>
                            <Package size={12} />{prod.stock ?? 0}
                          </span>
                        </td>
                        <td>
                          <button className={`saap-status-toggle ${prod.isPublished ? 'saap-active' : 'saap-inactive'}`} onClick={() => handleToggle(prod)}>
                            {prod.isPublished ? <><CheckCircle size={13} /> Live</> : <><XCircle size={13} /> Hidden</>}
                          </button>
                        </td>
                        <td className="ssas-td-muted">{new Date(prod.updatedAt).toLocaleDateString()}</td>
                        <td>
                          <div className="ssas-row-actions">
                            <button className="ssas-icon-btn ssas-btn-edit" onClick={() => openEdit(prod)} title="Edit"><Edit2 size={14} /></button>
                            <button className="ssas-icon-btn ssas-btn-del" onClick={() => handleDelete(prod)} title="Delete"><Trash2 size={14} /></button>
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
          <div className="saap-modal saap-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="saap-modal-header">
              <h3 className="saap-modal-title">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="saap-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="saap-modal-body saap-modal-scroll">
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Product Name <span className="ssas-required">*</span></label>
                  <input className="ssas-input" value={form.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="MERN Stack PDF Guide" />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">Slug <span className="saap-hint">(auto-generated)</span></label>
                  <input className="ssas-input saap-mono" value={form.slug} onChange={e => handleFormChange('slug', e.target.value)} placeholder="mern-stack-pdf-guide" />
                </div>
              </div>
              <div className="saap-form-group">
                <label className="saap-label">Description</label>
                <textarea className="ssas-input ssas-textarea" rows={3} value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Describe your product…" />
              </div>
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Price (₹) <span className="ssas-required">*</span></label>
                  <div className="saap-input-prefix-wrap">
                    <span className="saap-input-prefix"><DollarSign size={14} /></span>
                    <input className="ssas-input saap-input-prefixed" type="number" min="0" step="0.01" value={form.price} onChange={e => handleFormChange('price', e.target.value)} placeholder="499" />
                  </div>
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">Category</label>
                  <select className="ssas-input" value={form.category} onChange={e => handleFormChange('category', e.target.value)}>
                    <option value="">— Select Category —</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Stock Quantity</label>
                  <input className="ssas-input" type="number" min="0" value={form.stock} onChange={e => handleFormChange('stock', e.target.value)} placeholder="0 for digital/unlimited" />
                </div>
                <div className="saap-form-group saap-form-row">
                  <label className="saap-label">Published / Live</label>
                  <button type="button" className={`ssas-toggle ${form.isPublished ? 'ssas-toggle-on' : ''}`} onClick={() => handleFormChange('isPublished', !form.isPublished)}>
                    <span className="ssas-toggle-thumb" />
                  </button>
                </div>
              </div>
              <div className="saap-form-group">
                <label className="saap-label">Image URLs <span className="saap-hint">(one per line)</span></label>
                <textarea className="ssas-input ssas-textarea saap-mono" rows={3} value={form.images} onChange={e => handleFormChange('images', e.target.value)} placeholder="https://cdn.example.com/product1.jpg&#10;https://cdn.example.com/product2.jpg" />
              </div>
            </div>
            <div className="saap-modal-footer">
              <button className="ssas-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className={`ssas-btn-primary ${saving ? 'ssas-btn-loading' : ''}`} onClick={handleSave} disabled={saving}>
                {saving ? <><div className="ssas-spinner" /> Saving…</> : <><CheckCircle size={15} /> {editing ? 'Update Product' : 'Create Product'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;