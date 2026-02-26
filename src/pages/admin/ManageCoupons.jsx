import React, { useContext, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  Ticket, Plus, Edit2, Trash2, RefreshCw, Search, Copy,
  CheckCircle, XCircle, Percent, DollarSign, Calendar,
  BarChart2, AlertTriangle, Hash, Clock
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';


const API = '/admin/coupons';
const token = () => localStorage.getItem('adminToken');
const swalCfg = (d) => ({ background: d ? '#0f1117' : '#fff', color: d ? '#e2e8f0' : '#1a202c', confirmButtonColor: '#6c63ff' });
const EMPTY = { code: '', discountType: 'percentage', discountValue: '', maxUses: 1, validFrom: '', validTill: '', isActive: true };

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const isExpired = (d) => d ? new Date(d) < new Date() : false;
const usagePercent = (used, max) => max ? Math.min(100, Math.round((used / max) * 100)) : 0;

const Coupons = () => {
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
      Swal.fire({ title: 'Error', text: 'Failed to load coupons.', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setLoading(false); }
  }, [isDarkMode]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      code: item.code, discountType: item.discountType, discountValue: item.discountValue,
      maxUses: item.maxUses, validFrom: item.validFrom ? item.validFrom.substring(0, 10) : '',
      validTill: item.validTill ? item.validTill.substring(0, 10) : '', isActive: item.isActive
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY); };

  const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.code.trim() || !form.discountValue) {
      return Swal.fire({ title: 'Validation', text: 'Coupon code and discount value are required.', icon: 'warning', ...swalCfg(isDarkMode) });
    }
    setSaving(true);
    try {
      const payload = { ...form, discountValue: Number(form.discountValue), maxUses: Number(form.maxUses), code: form.code.toUpperCase().trim() };
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API}/${editing._id}` : API;
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      Swal.fire({ title: editing ? 'Coupon Updated!' : 'Coupon Created!', icon: 'success', timer: 1800, showConfirmButton: false, ...swalCfg(isDarkMode) });
      closeModal(); fetchAll();
    } catch {
      Swal.fire({ title: 'Error', text: 'Save failed.', icon: 'error', ...swalCfg(isDarkMode) });
    } finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    const r = await Swal.fire({ title: `Delete coupon "${item.code}"?`, text: 'Active users with this coupon will no longer be able to use it.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#ef4444', ...swalCfg(isDarkMode) });
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

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    Swal.fire({ title: 'Copied!', text: `"${code}" copied to clipboard.`, icon: 'success', timer: 1400, showConfirmButton: false, ...swalCfg(isDarkMode) });
  };

  const filtered = items.filter(i => {
    const matchSearch = i.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all'
      || (filterStatus === 'active' && i.isActive && !isExpired(i.validTill))
      || (filterStatus === 'inactive' && !i.isActive)
      || (filterStatus === 'expired' && isExpired(i.validTill));
    return matchSearch && matchStatus;
  });

  return (
    <div className={`ssas-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="ssas-bg-mesh" aria-hidden="true">
        <div className="ssas-bg-orb ssas-orb-a" /><div className="ssas-bg-orb ssas-orb-b" />
      </div>

      <header className="ssas-header">
        <div className="ssas-header-left">
          <div className="ssas-header-icon" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}><Ticket size={20} /></div>
          <div>
            <h1 className="ssas-header-title">Coupons</h1>
            <p className="ssas-header-sub">Create and manage discount codes for your products</p>
          </div>
        </div>
        <div className="ssas-header-right">
          <button className="ssas-btn-ghost" onClick={fetchAll}><RefreshCw size={15} /> Refresh</button>
          <button className="ssas-btn-primary" onClick={openAdd}><Plus size={15} /> New Coupon</button>
        </div>
      </header>

      <div className="saap-page-body">
        <div className="saap-stats-row">
          <div className="saap-stat-card"><span className="saap-stat-val">{items.length}</span><span className="saap-stat-lbl">Total Coupons</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-green">{items.filter(i => i.isActive && !isExpired(i.validTill)).length}</span><span className="saap-stat-lbl">Active</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-red">{items.filter(i => isExpired(i.validTill)).length}</span><span className="saap-stat-lbl">Expired</span></div>
          <div className="saap-stat-card"><span className="saap-stat-val saap-amber">{items.reduce((s, i) => s + (i.usedCount || 0), 0)}</span><span className="saap-stat-lbl">Total Uses</span></div>
        </div>

        <div className="ssas-section-card">
          <div className="ssas-section-header">
            <div className="ssas-section-header-left">
              <div className="ssas-section-icon-wrap" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: 'var(--ss-amber)' }}><Ticket size={18} /></div>
              <div>
                <h2 className="ssas-section-title">All Coupons</h2>
                <p className="ssas-section-subtitle">{filtered.length} of {items.length} shown</p>
              </div>
            </div>
            <div className="saap-header-controls">
              <div className="saap-filter-tabs">
                {['all', 'active', 'inactive', 'expired'].map(s => (
                  <button key={s} className={`saap-filter-tab ${filterStatus === s ? 'saap-filter-active' : ''}`} onClick={() => setFilterStatus(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="saap-search-wrap">
                <Search size={15} className="saap-search-icon" />
                <input className="saap-search-input" placeholder="Search code…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="ssas-section-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="ssas-loading-screen" style={{ minHeight: '200px' }}><div className="ssas-loading-ring" /></div>
            ) : filtered.length === 0 ? (
              <div className="ssas-empty-state"><Ticket size={36} /><p>No coupons found</p><button className="ssas-btn-primary" onClick={openAdd}><Plus size={14} /> Create First Coupon</button></div>
            ) : (
              <div className="ssas-table-wrap" style={{ borderRadius: 0, border: 'none' }}>
                <table className="ssas-table">
                  <thead><tr><th>#</th><th>Code</th><th>Discount</th><th>Usage</th><th>Valid From</th><th>Valid Till</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map((coupon, i) => {
                      const expired = isExpired(coupon.validTill);
                      const pct = usagePercent(coupon.usedCount, coupon.maxUses);
                      return (
                        <tr key={coupon._id}>
                          <td className="ssas-td-muted">{i + 1}</td>
                          <td>
                            <div className="saap-coupon-code-cell">
                              <span className="saap-coupon-code">{coupon.code}</span>
                              <button className="saap-copy-btn" onClick={() => copyCode(coupon.code)} title="Copy code"><Copy size={12} /></button>
                            </div>
                          </td>
                          <td>
                            <span className={`saap-discount-badge ${coupon.discountType === 'percentage' ? 'saap-pct' : 'saap-fixed'}`}>
                              {coupon.discountType === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
                              {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'} OFF
                            </span>
                          </td>
                          <td>
                            <div className="saap-usage-cell">
                              <span className="saap-usage-text">{coupon.usedCount || 0} / {coupon.maxUses}</span>
                              <div className="saap-usage-bar"><div className="saap-usage-fill" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--ss-red)' : pct >= 80 ? 'var(--ss-amber)' : 'var(--ss-green)' }} /></div>
                            </div>
                          </td>
                          <td className="ssas-td-muted">{formatDate(coupon.validFrom)}</td>
                          <td>
                            <span className={expired ? 'saap-expired-date' : 'ssas-td-muted'}>
                              {expired && <AlertTriangle size={12} style={{ marginRight: 3 }} />}
                              {formatDate(coupon.validTill)}
                            </span>
                          </td>
                          <td>
                            <button className={`saap-status-toggle ${coupon.isActive && !expired ? 'saap-active' : expired ? 'saap-expired' : 'saap-inactive'}`} onClick={() => !expired && handleToggle(coupon)} disabled={expired}>
                              {expired ? <><Clock size={13} /> Expired</> : coupon.isActive ? <><CheckCircle size={13} /> Active</> : <><XCircle size={13} /> Disabled</>}
                            </button>
                          </td>
                          <td>
                            <div className="ssas-row-actions">
                              <button className="ssas-icon-btn ssas-btn-edit" onClick={() => openEdit(coupon)} title="Edit"><Edit2 size={14} /></button>
                              <button className="ssas-icon-btn ssas-btn-del" onClick={() => handleDelete(coupon)} title="Delete"><Trash2 size={14} /></button>
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
          <div className="saap-modal" onClick={e => e.stopPropagation()}>
            <div className="saap-modal-header">
              <h3 className="saap-modal-title">{editing ? 'Edit Coupon' : 'Create New Coupon'}</h3>
              <button className="saap-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="saap-modal-body">
              <div className="saap-form-group">
                <label className="saap-label">Coupon Code <span className="ssas-required">*</span></label>
                <input className="ssas-input saap-mono saap-uppercase" value={form.code} onChange={e => handleFormChange('code', e.target.value.toUpperCase())} placeholder="SAVE20" />
              </div>
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Discount Type</label>
                  <div className="saap-radio-group">
                    <label className="saap-radio-label">
                      <input type="radio" name="discType" checked={form.discountType === 'percentage'} onChange={() => handleFormChange('discountType', 'percentage')} />
                      <Percent size={14} /> Percentage
                    </label>
                    <label className="saap-radio-label">
                      <input type="radio" name="discType" checked={form.discountType === 'fixed'} onChange={() => handleFormChange('discountType', 'fixed')} />
                      <DollarSign size={14} /> Fixed Amount
                    </label>
                  </div>
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">Discount Value <span className="ssas-required">*</span></label>
                  <div className="saap-input-prefix-wrap">
                    <span className="saap-input-prefix">{form.discountType === 'percentage' ? <Percent size={14} /> : <DollarSign size={14} />}</span>
                    <input className="ssas-input saap-input-prefixed" type="number" min="0" value={form.discountValue} onChange={e => handleFormChange('discountValue', e.target.value)} placeholder={form.discountType === 'percentage' ? '20' : '100'} />
                  </div>
                </div>
              </div>
              <div className="saap-form-group">
                <label className="saap-label">Max Uses <span className="saap-hint">(how many times this coupon can be used)</span></label>
                <input className="ssas-input" type="number" min="1" value={form.maxUses} onChange={e => handleFormChange('maxUses', e.target.value)} placeholder="1" />
              </div>
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Valid From</label>
                  <input className="ssas-input" type="date" value={form.validFrom} onChange={e => handleFormChange('validFrom', e.target.value)} />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">Valid Till</label>
                  <input className="ssas-input" type="date" value={form.validTill} onChange={e => handleFormChange('validTill', e.target.value)} />
                </div>
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
                {saving ? <><div className="ssas-spinner" /> Saving…</> : <><CheckCircle size={15} /> {editing ? 'Update' : 'Create Coupon'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;