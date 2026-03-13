import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Swal from "sweetalert2";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Hash,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  Image,
  X,
  Info,
  Upload,
  Link,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const API = "/api/admin/blogs";
const CATS_API = "/api/admin/blogs/categories";
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
  title: "",
  slug: "",
  content: "",
  author: "",
  category: "",
  tags: "",
  featuredImage: "",
  isPublished: false,
  publishedAt: "",
};

const Blogs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  // New state for image handling
  const [imageUploadMethod, setImageUploadMethod] = useState("url"); // 'url' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        fetch(API, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(CATS_API, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      const [bData, cData] = await Promise.all([bRes.json(), cRes.json()]);
      setItems(bData.data || bData);
      setCategories(cData.data || cData);
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to load blogs.",
        icon: "error",
        ...swalCfg(isDarkMode),
      });
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
    setImageUploadMethod("url");
    setSelectedFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      content: item.content,
      author: item.author || "",
      category: item.category?._id || item.category || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      featuredImage: item.featuredImage || "",
      isPublished: item.isPublished,
      publishedAt: item.publishedAt ? item.publishedAt.substring(0, 10) : "",
    });
    setImageUploadMethod("url");
    setSelectedFile(null);
    setImagePreview(item.featuredImage || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY);
    setSelectedFile(null);
    setImagePreview("");
    setImageUploadMethod("url");
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        Swal.fire({
          title: "Invalid File",
          text: "Please select a valid image file (JPEG, PNG, or GIF)",
          icon: "warning",
          ...swalCfg(isDarkMode),
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large",
          text: "Image size should be less than 10MB",
          icon: "warning",
          ...swalCfg(isDarkMode),
        });
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear URL input when file is selected
      setForm((prev) => ({ ...prev, featuredImage: "" }));
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      return Swal.fire({
        title: "Validation",
        text: "Title and content are required.",
        icon: "warning",
        ...swalCfg(isDarkMode),
      });
    }

    setSaving(true);

    try {
      let response;

      if (imageUploadMethod === "upload" && selectedFile) {
        // Use FormData for file upload
        const formData = new FormData();

        // Append all form fields
        formData.append("title", form.title);
        formData.append("slug", form.slug);
        formData.append("content", form.content);
        formData.append("author", form.author || "");
        formData.append("category", form.category || "");
        formData.append("tags", form.tags || "");
        formData.append("isPublished", form.isPublished ? "true" : "false");
        if (form.isPublished && form.publishedAt) {
          formData.append("publishedAt", form.publishedAt);
        }

        // Append the file
        formData.append("featuredImage", selectedFile);

        const method = editing ? "PUT" : "POST";
        const url = editing ? `${API}/${editing._id}` : API;

        response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token()}`,
            // Don't set Content-Type header when using FormData
            // Browser will set it automatically with correct boundary
          },
          body: formData,
        });
      } else {
        // Use JSON for URL input
        const payload = {
          ...form,
          tags: form.tags
            ? form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          publishedAt:
            form.isPublished && form.publishedAt ? form.publishedAt : undefined,
        };

        const method = editing ? "PUT" : "POST";
        const url = editing ? `${API}/${editing._id}` : API;

        response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Save failed");
      }

      Swal.fire({
        title: editing ? "Blog Updated!" : "Blog Created!",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        ...swalCfg(isDarkMode),
      });

      closeModal();
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
      title: `Delete "${item.title}"?`,
      text: "This blog post will be permanently removed.",
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

  const handleTogglePublish = async (item) => {
    try {
      await fetch(`${API}/${item._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !item.isPublished,
          publishedAt: !item.isPublished
            ? new Date().toISOString()
            : item.publishedAt,
        }),
      });
      fetchAll();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to update publish status.",
        icon: "error",
        ...swalCfg(isDarkMode),
      });
    }
  };

  const filtered = (items || []).filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.author || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "published" ? i.isPublished : !i.isPublished);

    return matchSearch && matchStatus;
  });

  const catName = (cat) => {
    if (!cat) return "—";
    if (typeof cat === "object") return cat.name;
    const found = categories.find((c) => c._id === cat);
    return found ? found.name : "—";
  };

  return (
    <div className={`ssas-root ${isDarkMode ? "dark" : "light"}`}>
      <div className="ssas-bg-mesh" aria-hidden="true">
        <div className="ssas-bg-orb ssas-orb-a" />
        <div className="ssas-bg-orb ssas-orb-b" />
      </div>

      <header className="ssas-header">
        <div className="ssas-header-left">
          <div
            className="ssas-header-icon"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
          >
            <FileText size={20} />
          </div>
          <div>
            <h1 className="ssas-header-title">Blogs</h1>
            <p className="ssas-header-sub">
              Write, manage, and publish your blog posts
            </p>
          </div>
        </div>
        <div className="ssas-header-right">
          <button className="ssas-btn-ghost" onClick={fetchAll}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="ssas-btn-primary" onClick={openAdd}>
            <Plus size={15} /> New Post
          </button>
        </div>
      </header>

      <div className="saap-page-body">
        <div className="saap-stats-row">
          <div className="saap-stat-card">
            <span className="saap-stat-val">{items.length}</span>
            <span className="saap-stat-lbl">Total Posts</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-green">
              {items.filter((i) => i.isPublished).length}
            </span>
            <span className="saap-stat-lbl">Published</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-amber">
              {items.filter((i) => !i.isPublished).length}
            </span>
            <span className="saap-stat-lbl">Drafts</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-purple">
              {categories.length}
            </span>
            <span className="saap-stat-lbl">Categories</span>
          </div>
        </div>

        <div className="ssas-section-card">
          <div className="ssas-section-header">
            <div className="ssas-section-header-left">
              <div
                className="ssas-section-icon-wrap"
                style={{
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "var(--ss-amber)",
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <h2 className="ssas-section-title">All Blog Posts</h2>
                <p className="ssas-section-subtitle">
                  {filtered.length} of {items.length} shown
                </p>
              </div>
            </div>
            <div className="saap-header-controls">
              <div className="saap-filter-tabs">
                {["all", "published", "draft"].map((s) => (
                  <button
                    key={s}
                    className={`saap-filter-tab ${filterStatus === s ? "saap-filter-active" : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="saap-search-wrap">
                <Search size={15} className="saap-search-icon" />
                <input
                  className="saap-search-input"
                  placeholder="Search posts…"
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
                <FileText size={36} />
                <p>No blog posts found</p>
                <button className="ssas-btn-primary" onClick={openAdd}>
                  <Plus size={14} /> Write First Post
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
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((blog, i) => (
                      <tr key={blog._id}>
                        <td className="ssas-td-muted">{i + 1}</td>
                        <td>
                          <div className="saap-title-cell">
                            {blog.featuredImage && (
                              <img
                                src={blog.featuredImage}
                                alt=""
                                className="saap-thumb"
                              />
                            )}
                            <div>
                              <div className="saap-title-text">
                                {blog.title}
                              </div>
                              <div className="saap-slug-small">
                                <Hash size={10} />
                                {blog.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="saap-cat-badge">
                            {catName(blog.category)}
                          </span>
                        </td>
                        <td className="ssas-td-muted">
                          <User size={12} style={{ marginRight: 4 }} />
                          {blog.author || "—"}
                        </td>
                        <td>
                          <div className="saap-tags-wrap">
                            {Array.isArray(blog.tags) &&
                              blog.tags.slice(0, 3).map((t) => (
                                <span className="saap-tag" key={t}>
                                  {t}
                                </span>
                              ))}
                            {Array.isArray(blog.tags) &&
                              blog.tags.length > 3 && (
                                <span className="saap-tag saap-tag-more">
                                  +{blog.tags.length - 3}
                                </span>
                              )}
                          </div>
                        </td>
                        <td>
                          <button
                            className={`saap-status-toggle ${blog.isPublished ? "saap-active" : "saap-draft"}`}
                            onClick={() => handleTogglePublish(blog)}
                          >
                            {blog.isPublished ? (
                              <>
                                <Eye size={13} /> Published
                              </>
                            ) : (
                              <>
                                <EyeOff size={13} /> Draft
                              </>
                            )}
                          </button>
                        </td>
                        <td className="ssas-td-muted">
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString()
                            : new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="ssas-row-actions">
                            <button
                              className="ssas-icon-btn ssas-btn-edit"
                              onClick={() => openEdit(blog)}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="ssas-icon-btn ssas-btn-del"
                              onClick={() => handleDelete(blog)}
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
            className="saap-modal saap-modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="saap-modal-header">
              <h3 className="saap-modal-title">
                {editing ? "Edit Blog Post" : "New Blog Post"}
              </h3>
              <button className="saap-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="saap-modal-body saap-modal-scroll">
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">
                    Title <span className="ssas-required">*</span>
                  </label>
                  <input
                    className="ssas-input"
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="My Awesome Blog Post"
                  />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">
                    Slug <span className="saap-hint">(auto-generated)</span>
                  </label>
                  <input
                    className="ssas-input saap-mono"
                    value={form.slug}
                    onChange={(e) => handleFormChange("slug", e.target.value)}
                    placeholder="my-awesome-blog-post"
                  />
                </div>
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Author</label>
                  <input
                    className="ssas-input"
                    value={form.author}
                    onChange={(e) => handleFormChange("author", e.target.value)}
                    placeholder="Shivam Kumar"
                  />
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

              <div className="saap-form-group">
                <label className="saap-label">
                  Content <span className="ssas-required">*</span>
                </label>
                <textarea
                  className="ssas-input ssas-textarea saap-content-area"
                  rows={8}
                  value={form.content}
                  onChange={(e) => handleFormChange("content", e.target.value)}
                  placeholder="Write your blog content here… (Markdown supported)"
                />
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">
                    Tags <span className="saap-hint">(comma separated)</span>
                  </label>
                  <input
                    className="ssas-input"
                    value={form.tags}
                    onChange={(e) => handleFormChange("tags", e.target.value)}
                    placeholder="react, mern, tutorial"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="saap-form-group">
                  <label className="saap-label">Featured Image</label>

                  {/* Method Toggle */}
                  <div
                    className="saap-image-method-toggle"
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <button
                      type="button"
                      className={`ssas-btn-ghost ${imageUploadMethod === "url" ? "ssas-btn-active" : ""}`}
                      onClick={() => {
                        setImageUploadMethod("url");
                        clearSelectedFile();
                      }}
                      style={{
                        flex: 1,
                        background:
                          imageUploadMethod === "url"
                            ? "rgba(108,99,255,0.1)"
                            : "transparent",
                        borderColor:
                          imageUploadMethod === "url"
                            ? "#6c63ff"
                            : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Link size={14} /> URL
                    </button>
                    <button
                      type="button"
                      className={`ssas-btn-ghost ${imageUploadMethod === "upload" ? "ssas-btn-active" : ""}`}
                      onClick={() => setImageUploadMethod("upload")}
                      style={{
                        flex: 1,
                        background:
                          imageUploadMethod === "upload"
                            ? "rgba(108,99,255,0.1)"
                            : "transparent",
                        borderColor:
                          imageUploadMethod === "upload"
                            ? "#6c63ff"
                            : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Upload size={14} /> Upload
                    </button>
                  </div>

                  {imageUploadMethod === "url" ? (
                    <input
                      className="ssas-input"
                      type="url"
                      value={form.featuredImage}
                      onChange={(e) =>
                        handleFormChange("featuredImage", e.target.value)
                      }
                      placeholder="https://cdn.example.com/image.jpg"
                    />
                  ) : (
                    <div className="saap-file-upload-area">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        style={{ display: "none" }}
                      />

                      {!selectedFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="saap-file-upload-placeholder"
                          style={{
                            border: "2px dashed rgba(108,99,255,0.3)",
                            borderRadius: "8px",
                            padding: "24px",
                            textAlign: "center",
                            cursor: "pointer",
                            background: "rgba(108,99,255,0.05)",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(108,99,255,0.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(108,99,255,0.05)")
                          }
                        >
                          <Upload
                            size={32}
                            style={{ marginBottom: "8px", color: "#6c63ff" }}
                          />
                          <p style={{ margin: 0, fontWeight: 500 }}>
                            Click to upload image
                          </p>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "12px",
                              opacity: 0.7,
                            }}
                          >
                            JPEG, PNG, or GIF (max 10MB)
                          </p>
                        </div>
                      ) : (
                        <div
                          className="saap-file-preview"
                          style={{ position: "relative" }}
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid rgba(108,99,255,0.3)",
                            }}
                          />
                          <button
                            type="button"
                            onClick={clearSelectedFile}
                            className="ssas-icon-btn ssas-btn-del"
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              background: "rgba(0,0,0,0.7)",
                              border: "none",
                            }}
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                          <div
                            style={{
                              position: "absolute",
                              bottom: "8px",
                              left: "8px",
                              background: "rgba(0,0,0,0.7)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          >
                            {selectedFile.name}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(form.featuredImage || imagePreview) && (
                    <div
                      className="saap-image-preview"
                      style={{ marginTop: "8px" }}
                    >
                      <img
                        src={imagePreview || form.featuredImage}
                        alt="Featured"
                        style={{
                          width: "100%",
                          maxHeight: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group saap-form-row">
                  <label className="saap-label">Publish Now</label>
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
                {form.isPublished && (
                  <div className="saap-form-group">
                    <label className="saap-label">Publish Date</label>
                    <input
                      className="ssas-input"
                      type="date"
                      value={form.publishedAt}
                      onChange={(e) =>
                        handleFormChange("publishedAt", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
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
                    {editing ? "Update Post" : "Create Post"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
