import React, { useContext, useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Hash,
  CheckCircle,
  XCircle,
  IndianRupee,
  Package,
  Tag,
  Image,
  X,
  AlertTriangle,
  Download,
  FileText,
  Lock,
  Globe,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const API = "/api/admin/products"; // Same base as categories
const token = () => localStorage.getItem("adminToken");
const swalCfg = (d) => ({
  background: d ? "#0f1117" : "#fff",
  color: d ? "#e2e8f0" : "#1a202c",
  confirmButtonColor: "#6c63ff",
});
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  category: "",
  images: "",
  stock: 0,
  isPublished: true,
  isDigital: true,
  isFree: false,
  fileUrl: "",
  fileSize: "",
  fileType: "pdf",
  downloadLimit: 0,
  sampleFileUrl: "",
  requiresLogin: false,
  requiresPurchase: false,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const Products = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

const fetchAll = useCallback(async () => {
  setLoading(true);
  try {
    const [pRes, cRes] = await Promise.all([
      fetch(API, { headers: { Authorization: `Bearer ${token()}` } }),
      fetch(`${API}/categories`, {
        headers: { Authorization: `Bearer ${token()}` },
      }),
    ]);
    const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
    
    // Fix: Ensure we always set arrays
    setItems(Array.isArray(pData.data) ? pData.data : Array.isArray(pData) ? pData : []);
    setCategories(Array.isArray(cData.data) ? cData.data : Array.isArray(cData) ? cData : []);
  } catch {
    Swal.fire({
      title: "Error",
      text: "Failed to load products.",
      icon: "error",
      ...swalCfg(isDarkMode),
    });
    // Fix: Set empty arrays on error
    setItems([]);
    setCategories([]);
  } finally {
    setLoading(false);
  }
}, [isDarkMode]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
    setActiveTab("basic");
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      shortDescription: item.shortDescription || "",
      price: item.price,
      category: item.category?._id || item.category || "",
      images: Array.isArray(item.images)
        ? item.images.join("\n")
        : item.images || "",
      stock: item.stock ?? 0,
      isPublished: item.isPublished,
      isDigital: item.isDigital ?? true,
      isFree: item.isFree ?? false,
      fileUrl: item.fileUrl || "",
      fileSize: item.fileSize || "",
      fileType: item.fileType || "pdf",
      downloadLimit: item.downloadLimit || 0,
      sampleFileUrl: item.sampleFileUrl || "",
      requiresLogin: item.requiresLogin || false,
      requiresPurchase: item.requiresPurchase || false,
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      metaKeywords: Array.isArray(item.metaKeywords)
        ? item.metaKeywords.join(", ")
        : item.metaKeywords || "",
    });
    setModalOpen(true);
    setActiveTab("basic");
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !editing) next.slug = slugify(value);

      if (field === "isFree" && value === true) {
        next.requiresPurchase = false;
      } else if (field === "price" && parseFloat(value) > 0) {
        next.isFree = false;
      } else if (field === "price" && parseFloat(value) === 0) {
        next.isFree = true;
        next.requiresPurchase = false;
      }

      return next;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setSelectedFile(file);
        // Auto-set file type based on actual file
        if (file.type === "application/pdf") {
          handleFormChange("fileType", "pdf");
        }
      } else {
        Swal.fire({
          title: "Invalid File",
          text: "Please select a PDF or image file",
          icon: "warning",
          ...swalCfg(isDarkMode),
        });
      }
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.price === "" || isNaN(Number(form.price))) {
      return Swal.fire({
        title: "Validation",
        text: "Name and valid price are required.",
        icon: "warning",
        ...swalCfg(isDarkMode),
      });
    }

    setSaving(true);
    try {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(form).forEach((key) => {
        if (key === "images") {
          // Handle images as JSON string if needed
          if (form.images) {
            const imagesArray = form.images
              .split("\n")
              .map((u) => u.trim())
              .filter(Boolean);
            formData.append("images", JSON.stringify(imagesArray));
          }
        } else if (key === "metaKeywords" && form.metaKeywords) {
          const keywordsArray = form.metaKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
          formData.append("metaKeywords", JSON.stringify(keywordsArray));
        } else {
          formData.append(key, form[key]);
        }
      });

      // Add file if selected
      if (selectedFile) {
        formData.append("productFile", selectedFile);
      }

      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API}/${editing._id}` : API;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token()}`,
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Save failed");
      }

      Swal.fire({
        title: editing ? "Product Updated!" : "Product Created!",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        ...swalCfg(isDarkMode),
      });
      closeModal();
      setSelectedFile(null);
      fetchAll();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Save failed.",
        icon: "error",
        ...swalCfg(isDarkMode),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const r = await Swal.fire({
      title: `Delete "${item.name}"?`,
      text: "This product will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      ...swalCfg(isDarkMode),
    });
    if (!r.isConfirmed) return;

    try {
      await fetch(`${API}/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      Swal.fire({
        title: "Deleted!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        ...swalCfg(isDarkMode),
      });
      fetchAll();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Delete failed.",
        icon: "error",
        ...swalCfg(isDarkMode),
      });
    }
  };

  const handleToggle = async (item) => {
    try {
      await fetch(`${API}/${item._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...item, isPublished: !item.isPublished }),
      });
      fetchAll();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Status update failed.",
        icon: "error",
        ...swalCfg(isDarkMode),
      });
    }
  };

  const filtered = items.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.slug || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "published" ? i.isPublished : !i.isPublished);
    const matchType =
      filterType === "all" ||
      (filterType === "free"
        ? i.isFree
        : filterType === "paid"
          ? !i.isFree && i.price > 0
          : filterType === "digital"
            ? i.isDigital
            : true);
    return matchSearch && matchStatus && matchType;
  });

  const catName = (cat) => {
    if (!cat) return "—";
    if (typeof cat === "object") return cat.name;
    const found = categories.find((c) => c._id === cat);
    return found ? found.name : "—";
  };

  const totalValue = items.reduce(
    (sum, p) => sum + p.price * (p.stock || 0),
    0,
  );
  const totalDownloads = items.reduce((sum, p) => sum + (p.downloads || 0), 0);

  return (
    <div className={`ssas-root ${isDarkMode ? "dark" : "light"}`}>
      {/* ... rest of your existing JSX remains exactly the same ... */}
      {/* Only the API calls are updated above */}

      <div className="ssas-bg-mesh" aria-hidden="true">
        <div className="ssas-bg-orb ssas-orb-a" />
        <div className="ssas-bg-orb ssas-orb-b" />
      </div>

      <header className="ssas-header">
        <div className="ssas-header-left">
          <div
            className="ssas-header-icon"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
          >
            <ShoppingBag size={20} />
          </div>
          <div>
            <h1 className="ssas-header-title">Products</h1>
            <p className="ssas-header-sub">
              Manage PDFs, ebooks, and digital content
            </p>
          </div>
        </div>
        <div className="ssas-header-right">
          <button className="ssas-btn-ghost" onClick={fetchAll}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="ssas-btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      </header>

      <div className="saap-page-body">
        <div className="saap-stats-row">
          <div className="saap-stat-card">
            <span className="saap-stat-val">{items.length}</span>
            <span className="saap-stat-lbl">Total Products</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-green">
              {items.filter((i) => i.isPublished).length}
            </span>
            <span className="saap-stat-lbl">Published</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-blue">
              {items.filter((i) => i.isDigital).length}
            </span>
            <span className="saap-stat-lbl">Digital</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-purple">
              {items.filter((i) => i.isFree).length}
            </span>
            <span className="saap-stat-lbl">Free</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-amber">{totalDownloads}</span>
            <span className="saap-stat-lbl">Total Downloads</span>
          </div>
        </div>

        <div className="ssas-section-card">
          <div className="ssas-section-header">
            <div className="ssas-section-header-left">
              <div
                className="ssas-section-icon-wrap"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "var(--ss-green)",
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="ssas-section-title">All Products</h2>
                <p className="ssas-section-subtitle">
                  {filtered.length} of {items.length} shown
                </p>
              </div>
            </div>
            <div className="saap-header-controls">
              <div className="saap-filter-tabs">
                {["all", "published", "hidden"].map((s) => (
                  <button
                    key={s}
                    className={`saap-filter-tab ${filterStatus === s ? "saap-filter-active" : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <select
                className="saap-filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="digital">Digital</option>
              </select>
              <div className="saap-search-wrap">
                <Search size={15} className="saap-search-icon" />
                <input
                  className="saap-search-input"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="ssas-section-body" style={{ padding: 0 }}>
            {loading ? (
              <div
                className="ssas-loading-screen"
                style={{ minHeight: "200px" }}
              >
                <div className="ssas-loading-ring" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="ssas-empty-state">
                <ShoppingBag size={36} />
                <p>No products found</p>
                <button className="ssas-btn-primary" onClick={openAdd}>
                  <Plus size={14} /> Add First Product
                </button>
              </div>
            ) : (
              <div
                className="ssas-table-wrap"
                style={{ borderRadius: 0, border: "none" }}
              >
                <table className="ssas-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Downloads</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((prod, i) => (
                      <tr key={prod._id}>
                        <td className="ssas-td-muted">{i + 1}</td>
                        <td>
                          <div className="saap-title-cell">
                            {prod.images?.[0] ? (
                              <img
                                src={prod.images[0]}
                                alt=""
                                className="saap-thumb"
                              />
                            ) : (
                              <div className="saap-thumb-placeholder">
                                {prod.isDigital ? (
                                  <FileText size={14} />
                                ) : (
                                  <ShoppingBag size={14} />
                                )}
                              </div>
                            )}
                            <div>
                              <div className="saap-title-text">{prod.name}</div>
                              <div className="saap-slug-small">
                                <Hash size={10} />
                                {prod.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="saap-cat-badge saap-cat-green">
                            {catName(prod.category)}
                          </span>
                        </td>
                        <td>
                          <span className="saap-price-cell">
                            {prod.isFree ? (
                              <span className="saap-free-badge">FREE</span>
                            ) : (
                              `₹${Number(prod.price).toLocaleString()}`
                            )}
                          </span>
                        </td>
                        <td>
                          {prod.isDigital ? (
                            <span className="saap-type-badge saap-type-digital">
                              <FileText size={12} /> Digital
                            </span>
                          ) : (
                            <span className="saap-type-badge saap-type-physical">
                              <Package size={12} /> Physical
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="saap-download-count">
                            <Download size={12} /> {prod.downloads || 0}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`saap-status-toggle ${prod.isPublished ? "saap-active" : "saap-inactive"}`}
                            onClick={() => handleToggle(prod)}
                          >
                            {prod.isPublished ? (
                              <>
                                <CheckCircle size={13} /> Live
                              </>
                            ) : (
                              <>
                                <XCircle size={13} /> Hidden
                              </>
                            )}
                          </button>
                        </td>
                        <td>
                          <div className="ssas-row-actions">
                            <button
                              className="ssas-icon-btn ssas-btn-edit"
                              onClick={() => openEdit(prod)}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="ssas-icon-btn ssas-btn-del"
                              onClick={() => handleDelete(prod)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
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
          <div
            className="saap-modal saap-modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="saap-modal-header">
              <h3 className="saap-modal-title">
                {editing ? "Edit Product" : "Add New Product"}
              </h3>
              <button className="saap-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="saap-modal-tabs">
              <button
                className={`saap-tab ${activeTab === "basic" ? "saap-tab-active" : ""}`}
                onClick={() => setActiveTab("basic")}
              >
                Basic Info
              </button>
              <button
                className={`saap-tab ${activeTab === "digital" ? "saap-tab-active" : ""}`}
                onClick={() => setActiveTab("digital")}
              >
                Digital Options
              </button>
              <button
                className={`saap-tab ${activeTab === "seo" ? "saap-tab-active" : ""}`}
                onClick={() => setActiveTab("seo")}
              >
                SEO & Meta
              </button>
            </div>

            <div className="saap-modal-body saap-modal-scroll">
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <>
                  <div className="saap-form-grid-2">
                    <div className="saap-form-group">
                      <label className="saap-label">
                        Product Name <span className="ssas-required">*</span>
                      </label>
                      <input
                        className="ssas-input"
                        value={form.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        placeholder="MERN Stack PDF Guide"
                      />
                    </div>
                    <div className="saap-form-group">
                      <label className="saap-label">
                        Slug <span className="saap-hint">(auto-generated)</span>
                      </label>
                      <input
                        className="ssas-input saap-mono"
                        value={form.slug}
                        onChange={(e) =>
                          handleFormChange("slug", e.target.value)
                        }
                        placeholder="mern-stack-pdf-guide"
                      />
                    </div>
                  </div>

                  <div className="saap-form-group">
                    <label className="saap-label">Short Description</label>
                    <input
                      className="ssas-input"
                      value={form.shortDescription}
                      onChange={(e) =>
                        handleFormChange("shortDescription", e.target.value)
                      }
                      placeholder="Brief summary of the product"
                    />
                  </div>

                  <div className="saap-form-group">
                    <label className="saap-label">Full Description</label>
                    <textarea
                      className="ssas-input ssas-textarea"
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      placeholder="Detailed product description..."
                    />
                  </div>

                  <div className="saap-form-grid-2">
                    <div className="saap-form-group">
                      <label className="saap-label">
                        Price (₹) <span className="ssas-required">*</span>
                      </label>
                      <div className="saap-input-prefix-wrap">
                        <span className="saap-input-prefix">
                          <IndianRupee size={14} />
                        </span>
                        <input
                          className="ssas-input saap-input-prefixed saas-input-product-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={(e) =>
                            handleFormChange("price", e.target.value)
                          }
                          placeholder="    499"
                        />
                      </div>
                    </div>
                    <div className="saap-form-group">
                      <label className="saap-label">Category</label>
                      <select
                        className="ssas-input"
                        value={form.category}
                        onChange={(e) =>
                          handleFormChange("category", e.target.value)
                        }
                      >
                        <option value="">— Select Category —</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="saap-form-grid-2">
                    <div className="saap-form-group">
                      <label className="saap-label">
                        <input
                          type="checkbox"
                          checked={form.isDigital}
                          onChange={(e) =>
                            handleFormChange("isDigital", e.target.checked)
                          }
                          className="saap-checkbox"
                        />
                        Digital Product
                      </label>
                    </div>
                    <div className="saap-form-group">
                      <label className="saap-label">
                        <input
                          type="checkbox"
                          checked={form.isFree}
                          onChange={(e) =>
                            handleFormChange("isFree", e.target.checked)
                          }
                          className="saap-checkbox"
                        />
                        Free Product
                      </label>
                    </div>
                  </div>

                  {!form.isDigital && (
                    <div className="saap-form-grid-2">
                      <div className="saap-form-group">
                        <label className="saap-label">Stock Quantity</label>
                        <input
                          className="ssas-input"
                          type="number"
                          min="0"
                          value={form.stock}
                          onChange={(e) =>
                            handleFormChange("stock", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}

                  <div className="saap-form-group">
                    <label className="saap-label">
                      Image URLs{" "}
                      <span className="saap-hint">(one per line)</span>
                    </label>
                    <textarea
                      className="ssas-input ssas-textarea saap-mono"
                      rows={3}
                      value={form.images}
                      onChange={(e) =>
                        handleFormChange("images", e.target.value)
                      }
                      placeholder="https://cdn.example.com/product1.jpg&#10;https://cdn.example.com/product2.jpg"
                    />
                  </div>

                  <div className="saap-form-group saap-form-row">
                    <label className="saap-label">Published / Live</label>
                    <button
                      type="button"
                      className={`ssas-toggle ${form.isPublished ? "ssas-toggle-on" : ""}`}
                      onClick={() =>
                        handleFormChange("isPublished", !form.isPublished)
                      }
                    >
                      <span className="ssas-toggle-thumb" />
                    </button>
                  </div>
                </>
              )}

              {/* Digital Options Tab */}
              {activeTab === "digital" && (
                <>
                  <div className="saap-form-group">
                    <label className="saap-label">
                      Upload Product File (PDF/Image)
                    </label>
                    <div className="saap-file-upload">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="saap-file-input"
                        id="product-file"
                      />
                      <label htmlFor="product-file" className="saap-file-label">
                        {selectedFile ? selectedFile.name : "Choose a file..."}
                      </label>
                    </div>
                    {form.fileUrl && !selectedFile && (
                      <div className="saap-current-file">
                        Current file:{" "}
                        <a
                          href={form.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="saap-form-group">
                    <label className="saap-label">
                      File URL (if not uploading)
                    </label>
                    <input
                      className="ssas-input"
                      value={form.fileUrl}
                      onChange={(e) =>
                        handleFormChange("fileUrl", e.target.value)
                      }
                      placeholder="https://cdn.example.com/files/product.pdf"
                      disabled={!!selectedFile}
                    />
                  </div>

                  <div className="saap-form-grid-2">
                    <div className="saap-form-group">
                      <label className="saap-label">File Size</label>
                      <input
                        className="ssas-input"
                        value={form.fileSize}
                        onChange={(e) =>
                          handleFormChange("fileSize", e.target.value)
                        }
                        placeholder="10 MB"
                      />
                    </div>
                    <div className="saap-form-group">
                      <label className="saap-label">File Type</label>
                      <select
                        className="ssas-input"
                        value={form.fileType}
                        onChange={(e) =>
                          handleFormChange("fileType", e.target.value)
                        }
                      >
                        <option value="pdf">PDF</option>
                        <option value="epub">EPUB</option>
                        <option value="mobi">MOBI</option>
                        <option value="zip">ZIP</option>
                      </select>
                    </div>
                  </div>

                  <div className="saap-form-group">
                    <label className="saap-label">Sample File URL</label>
                    <input
                      className="ssas-input"
                      value={form.sampleFileUrl}
                      onChange={(e) =>
                        handleFormChange("sampleFileUrl", e.target.value)
                      }
                      placeholder="https://cdn.example.com/samples/product-sample.pdf"
                    />
                  </div>

                  <div className="saap-form-group">
                    <label className="saap-label">
                      Download Limit{" "}
                      <span className="saap-hint">(0 = unlimited)</span>
                    </label>
                    <input
                      className="ssas-input"
                      type="number"
                      min="0"
                      value={form.downloadLimit}
                      onChange={(e) =>
                        handleFormChange("downloadLimit", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="saap-form-group saap-form-row">
                    <label className="saap-label">
                      <input
                        type="checkbox"
                        checked={form.requiresLogin}
                        onChange={(e) =>
                          handleFormChange("requiresLogin", e.target.checked)
                        }
                        className="saap-checkbox"
                      />
                      Require Login to Download
                    </label>
                  </div>

                  <div className="saap-form-group saap-form-row">
                    <label className="saap-label">
                      <input
                        type="checkbox"
                        checked={form.requiresPurchase}
                        onChange={(e) =>
                          handleFormChange("requiresPurchase", e.target.checked)
                        }
                        className="saap-checkbox"
                        disabled={form.isFree}
                      />
                      Require Purchase to Download
                    </label>
                    {form.isFree && (
                      <small className="saap-hint">
                        (Free products don't require purchase)
                      </small>
                    )}
                  </div>
                </>
              )}

              {/* SEO Tab */}
              {activeTab === "seo" && (
                <>
                  <div className="saap-form-group">
                    <label className="saap-label">Meta Title</label>
                    <input
                      className="ssas-input"
                      value={form.metaTitle}
                      onChange={(e) =>
                        handleFormChange("metaTitle", e.target.value)
                      }
                      placeholder="SEO Title (leave empty to use product name)"
                    />
                  </div>

                  <div className="saap-form-group">
                    <label className="saap-label">Meta Description</label>
                    <textarea
                      className="ssas-input ssas-textarea"
                      rows={3}
                      value={form.metaDescription}
                      onChange={(e) =>
                        handleFormChange("metaDescription", e.target.value)
                      }
                      placeholder="SEO Description"
                    />
                  </div>

                  <div className="saap-form-group">
                    <label className="saap-label">
                      Meta Keywords{" "}
                      <span className="saap-hint">(comma separated)</span>
                    </label>
                    <input
                      className="ssas-input"
                      value={form.metaKeywords}
                      onChange={(e) =>
                        handleFormChange("metaKeywords", e.target.value)
                      }
                      placeholder="mern, react, node, javascript"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="saap-modal-footer">
              <button className="ssas-btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`ssas-btn-primary ${saving ? "ssas-btn-loading" : ""}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="ssas-spinner" /> Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle size={15} />{" "}
                    {editing ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .saap-file-upload {
          position: relative;
          margin-bottom: 10px;
        }
        .saap-file-input {
          position: absolute;
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          z-index: -1;
        }
        .saap-file-label {
          display: block;
          padding: 12px;
          background: ${isDarkMode ? "#2d3748" : "#f8fafc"};
          border: 2px dashed ${isDarkMode ? "#4a5568" : "#cbd5e1"};
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          color: ${isDarkMode ? "#94a3b8" : "#475569"};
          transition: all 0.2s;
        }
        .saap-file-label:hover {
          border-color: #10b981;
          background: ${isDarkMode ? "#374151" : "#f1f5f9"};
        }
        .saap-current-file {
          margin-top: 8px;
          padding: 8px;
          background: ${isDarkMode ? "#1a1d24" : "#f1f5f9"};
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .saap-current-file a {
          color: #10b981;
          text-decoration: none;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

export default Products;
