import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Swal from "sweetalert2";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Hash,
  CheckCircle,
  Clock,
  Rocket,
  Calendar,
  User,
  Image,
  BarChart2,
  AlertTriangle,
  Code2,
  ExternalLink,
  FolderTree,
  Upload,
  Link,
  X,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const API = "/api/admin/projects";
const CATS_API = "/api/admin/projects/categories";
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
  description: "",
  client: "",
  startDate: "",
  endDate: "",
  status: "planned",
  images: [], // Will store URLs
  category: "",
  demoUrl: "",
  repoUrl: "",
  clientUrl: "",
  tags: "",
  technologies: "",
  isFeatured: false,
  priority: 0,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  isPublished: true,
  requiresLogin: false,
};

const STATUS_META = {
  planned: { label: "Planned", color: "saap-planned", icon: Clock },
  "in-progress": {
    label: "In Progress",
    color: "saap-inprogress",
    icon: Rocket,
  },
  completed: { label: "Completed", color: "saap-completed", icon: CheckCircle },
};

const Projects = () => {
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

  // Image upload states
  const [mainImageMethod, setMainImageMethod] = useState("url"); // 'url' or 'upload'
  const [additionalImagesMethod, setAdditionalImagesMethod] = useState("url"); // 'url' or 'upload'
  const [selectedMainFile, setSelectedMainFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [selectedAdditionalFiles, setSelectedAdditionalFiles] = useState([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // For edit mode
  const mainFileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        fetch(API, { headers: { Authorization: `Bearer ${token()}` } }),
        fetch(CATS_API, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);

      const projectsData = await projectsRes.json();
      const categoriesData = await categoriesRes.json();

      setItems(projectsData.data || projectsData);
      setCategories(categoriesData.data || categoriesData);
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load projects.",
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
    // Reset image states
    setMainImageMethod("url");
    setAdditionalImagesMethod("url");
    setSelectedMainFile(null);
    setMainImagePreview("");
    setSelectedAdditionalFiles([]);
    setAdditionalImagesPreviews([]);
    setExistingImages([]);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      client: item.client || "",
      status: item.status,
      category: item.category?._id || item.category || "",
      startDate: item.startDate ? item.startDate.substring(0, 10) : "",
      endDate: item.endDate ? item.endDate.substring(0, 10) : "",
      demoUrl: item.demoUrl || "",
      repoUrl: item.repoUrl || "",
      clientUrl: item.clientUrl || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(", ")
        : item.technologies || "",
      isFeatured: item.isFeatured || false,
      priority: item.priority || 0,
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      metaKeywords: Array.isArray(item.metaKeywords)
        ? item.metaKeywords.join(", ")
        : item.metaKeywords || "",
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
      requiresLogin: item.requiresLogin || false,
    });

    // Set existing images - COMBINE mainImage and images for display purposes
    const allImages = [];
    if (item.mainImage) allImages.push(item.mainImage);
    if (Array.isArray(item.images) && item.images.length > 0) {
      allImages.push(...item.images);
    }

    setExistingImages(allImages);

    // Set main image preview if exists
    if (item.mainImage) {
      setMainImagePreview(item.mainImage);
    }

    // Reset upload states
    setMainImageMethod("url");
    setAdditionalImagesMethod("url");
    setSelectedMainFile(null);
    setSelectedAdditionalFiles([]);
    setAdditionalImagesPreviews([]);

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY);
    // Reset all image states
    setMainImageMethod("url");
    setAdditionalImagesMethod("url");
    setSelectedMainFile(null);
    setMainImagePreview("");
    setSelectedAdditionalFiles([]);
    setAdditionalImagesPreviews([]);
    setExistingImages([]);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !editing) next.slug = slugify(value);
      return next;
    });
  };

  // Main image handlers
  const handleMainFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        Swal.fire({
          title: "Invalid File",
          text: "Please select a valid image file (JPEG, PNG, GIF, or WEBP)",
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

      setSelectedMainFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMainFile = () => {
    setSelectedMainFile(null);
    setMainImagePreview("");
    if (mainFileInputRef.current) {
      mainFileInputRef.current.value = "";
    }
  };

  // Additional images handlers
  const handleAdditionalFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        invalidFiles.push(file.name);
      } else if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      Swal.fire({
        title: "Invalid Files",
        text: `Some files were rejected:\n${invalidFiles.join("\n")}\n\nOnly images under 10MB are allowed.`,
        icon: "warning",
        ...swalCfg(isDarkMode),
      });
    }

    if (validFiles.length > 0) {
      // Check total files limit (existing + new)
      const totalAfterAdd = selectedAdditionalFiles.length + validFiles.length;
      if (totalAfterAdd > 10) {
        Swal.fire({
          title: "Too Many Files",
          text: `You can only upload up to 10 additional images. You already have ${selectedAdditionalFiles.length} selected.`,
          icon: "warning",
          ...swalCfg(isDarkMode),
        });
        return;
      }

      setSelectedAdditionalFiles((prev) => [...prev, ...validFiles]);

      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagesPreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalFile = (index) => {
    setSelectedAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImageUp = (index, isExisting = true) => {
    if (isExisting) {
      if (index > 0) {
        const newImages = [...existingImages];
        [newImages[index - 1], newImages[index]] = [
          newImages[index],
          newImages[index - 1],
        ];
        setExistingImages(newImages);
      }
    } else {
      if (index > 0) {
        const newFiles = [...selectedAdditionalFiles];
        const newPreviews = [...additionalImagesPreviews];
        [newFiles[index - 1], newFiles[index]] = [
          newFiles[index],
          newFiles[index - 1],
        ];
        [newPreviews[index - 1], newPreviews[index]] = [
          newPreviews[index],
          newPreviews[index - 1],
        ];
        setSelectedAdditionalFiles(newFiles);
        setAdditionalImagesPreviews(newPreviews);
      }
    }
  };

  const moveImageDown = (index, isExisting = true) => {
    if (isExisting) {
      if (index < existingImages.length - 1) {
        const newImages = [...existingImages];
        [newImages[index], newImages[index + 1]] = [
          newImages[index + 1],
          newImages[index],
        ];
        setExistingImages(newImages);
      }
    } else {
      if (index < selectedAdditionalFiles.length - 1) {
        const newFiles = [...selectedAdditionalFiles];
        const newPreviews = [...additionalImagesPreviews];
        [newFiles[index], newFiles[index + 1]] = [
          newFiles[index + 1],
          newFiles[index],
        ];
        [newPreviews[index], newPreviews[index + 1]] = [
          newPreviews[index + 1],
          newPreviews[index],
        ];
        setSelectedAdditionalFiles(newFiles);
        setAdditionalImagesPreviews(newPreviews);
      }
    }
  };

  const handleSave = async () => {
    if (!form.title.trim())
      return Swal.fire({
        title: "Validation",
        text: "Title is required.",
        icon: "warning",
        ...swalCfg(isDarkMode),
      });

    setSaving(true);

    try {
      let response;

      // Check if we're using file upload for any images
      const hasMainUpload = mainImageMethod === "upload" && selectedMainFile;
      const hasAdditionalUploads =
        additionalImagesMethod === "upload" &&
        selectedAdditionalFiles.length > 0;

      if (hasMainUpload || hasAdditionalUploads) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Append all form fields
        formData.append("title", form.title);
        formData.append("slug", form.slug);
        formData.append("description", form.description || "");
        formData.append("client", form.client || "");
        formData.append("status", form.status);
        formData.append("category", form.category || "");
        formData.append("startDate", form.startDate || "");
        formData.append("endDate", form.endDate || "");
        formData.append("demoUrl", form.demoUrl || "");
        formData.append("repoUrl", form.repoUrl || "");
        formData.append("clientUrl", form.clientUrl || "");
        formData.append("tags", form.tags || "");
        formData.append("technologies", form.technologies || "");
        formData.append("isFeatured", form.isFeatured ? "true" : "false");
        formData.append("priority", form.priority.toString());
        formData.append("metaTitle", form.metaTitle || "");
        formData.append("metaDescription", form.metaDescription || "");
        formData.append("metaKeywords", form.metaKeywords || "");
        formData.append("isPublished", form.isPublished ? "true" : "false");
        formData.append("requiresLogin", form.requiresLogin ? "true" : "false");

        // Handle existing main image - SEPARATE FIELD
        if (existingImages.length > 0) {
          formData.append("existingMainImage", existingImages[0] || "");
        } else {
          formData.append("existingMainImage", "");
        }

        // Handle existing additional images - SEPARATE FIELD (excluding the first one)
        if (existingImages.length > 1) {
          formData.append(
            "existingImages",
            JSON.stringify(existingImages.slice(1)),
          );
        } else {
          formData.append("existingImages", JSON.stringify([]));
        }

        // Upload new main image if selected - SEPARATE FIELD
        if (hasMainUpload && selectedMainFile) {
          formData.append("mainImage", selectedMainFile);
        }

        // Upload new additional images if selected - SEPARATE FIELD
        if (hasAdditionalUploads && selectedAdditionalFiles.length > 0) {
          selectedAdditionalFiles.forEach((file) => {
            formData.append("images", file);
          });
        }

        const method = editing ? "PUT" : "POST";
        const url = editing ? `${API}/${editing._id}` : API;

        response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token()}`,
          },
          body: formData,
        });
      } else {
        // Use JSON for URL-only input
        const payload = {
          ...form,
          mainImage: existingImages[0] || "", // SEPARATE FIELD
          images: existingImages.slice(1), // SEPARATE FIELD
          tags: form.tags
            ? form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          technologies: form.technologies
            ? form.technologies
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          metaKeywords: form.metaKeywords
            ? form.metaKeywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : [],
          priority: parseInt(form.priority) || 0,
          isFeatured: form.isFeatured === true,
          isPublished: form.isPublished === true,
          requiresLogin: form.requiresLogin === true,
        };

        // Remove empty category
        if (!payload.category) {
          delete payload.category;
        }

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
        title: editing ? "Project Updated!" : "Project Added!",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        ...swalCfg(isDarkMode),
      });
      closeModal();
      fetchAll();
    } catch (error) {
      console.error("Save error:", error);
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
      text: "This project will be permanently removed from your portfolio.",
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

  const handleStatusChange = async (item, newStatus) => {
    try {
      await fetch(`${API}/${item._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
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

  // Helper function to get category name
  const getCategoryName = (cat) => {
    if (!cat) return "—";
    if (typeof cat === "object") return cat.name;
    const found = categories.find((c) => c._id === cat);
    return found ? found.name : "—";
  };

  const filtered = items.filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.client || "").toLowerCase().includes(search.toLowerCase()) ||
      (i.description || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

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
            style={{ background: "linear-gradient(135deg,#6c63ff,#22d3ee)" }}
          >
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="ssas-header-title">Projects</h1>
            <p className="ssas-header-sub">
              Showcase your portfolio projects to potential clients
            </p>
          </div>
        </div>
        <div className="ssas-header-right">
          <button className="ssas-btn-ghost" onClick={fetchAll}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="ssas-btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Project
          </button>
        </div>
      </header>

      <div className="saap-page-body">
        <div className="saap-stats-row">
          <div className="saap-stat-card">
            <span className="saap-stat-val">{items.length}</span>
            <span className="saap-stat-lbl">Total Projects</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-purple">
              {items.filter((i) => i.status === "planned").length}
            </span>
            <span className="saap-stat-lbl">Planned</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-amber">
              {items.filter((i) => i.status === "in-progress").length}
            </span>
            <span className="saap-stat-lbl">In Progress</span>
          </div>
          <div className="saap-stat-card">
            <span className="saap-stat-val saap-green">
              {items.filter((i) => i.status === "completed").length}
            </span>
            <span className="saap-stat-lbl">Completed</span>
          </div>
        </div>

        {/* Kanban-style cards for visual overview */}
        {items.length > 0 && (
          <div className="saap-kanban-row">
            {Object.entries(STATUS_META).map(([status, meta]) => {
              const group = items.filter((i) => i.status === status);
              const Icon = meta.icon;
              return (
                <div
                  className={`saap-kanban-col saap-kanban-${status.replace("-", "")}`}
                  key={status}
                >
                  <div className="saap-kanban-head">
                    <Icon size={14} />
                    <span>{meta.label}</span>
                    <span className="saap-kanban-count">{group.length}</span>
                  </div>
                  {group.slice(0, 3).map((p) => (
                    <div
                      className="saap-kanban-card"
                      key={p._id}
                      onClick={() => openEdit(p)}
                    >
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          alt=""
                          className="saap-kanban-img"
                        />
                      )}
                      <p className="saap-kanban-title">{p.title}</p>
                      {p.client && (
                        <p className="saap-kanban-client">
                          <User size={10} />
                          {p.client}
                        </p>
                      )}
                      {p.category && (
                        <p className="saap-kanban-category">
                          <FolderTree size={10} />
                          {getCategoryName(p.category)}
                        </p>
                      )}
                    </div>
                  ))}
                  {group.length > 3 && (
                    <p className="saap-kanban-more">+{group.length - 3} more</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="ssas-section-card">
          <div className="ssas-section-header">
            <div className="ssas-section-header-left">
              <div className="ssas-section-icon-wrap">
                <Briefcase size={18} />
              </div>
              <div>
                <h2 className="ssas-section-title">All Projects</h2>
                <p className="ssas-section-subtitle">
                  {filtered.length} of {items.length} shown
                </p>
              </div>
            </div>
            <div className="saap-header-controls">
              <div className="saap-filter-tabs">
                {["all", "planned", "in-progress", "completed"].map((s) => (
                  <button
                    key={s}
                    className={`saap-filter-tab ${filterStatus === s ? "saap-filter-active" : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === "in-progress"
                      ? "In Progress"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="saap-search-wrap">
                <Search size={15} className="saap-search-icon" />
                <input
                  className="saap-search-input"
                  placeholder="Search projects…"
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
                <Briefcase size={36} />
                <p>No projects found</p>
                <button className="ssas-btn-primary" onClick={openAdd}>
                  <Plus size={14} /> Add First Project
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
                      <th>Project</th>
                      <th>Category</th>
                      <th>Client</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((proj, i) => {
                      const meta =
                        STATUS_META[proj.status] || STATUS_META.planned;
                      const StatusIcon = meta.icon;
                      return (
                        <tr key={proj._id}>
                          <td className="ssas-td-muted">{i + 1}</td>
                          <td>
                            <div className="saap-title-cell">
                              {proj.mainImage ? (
                                <img
                                  src={proj.mainImage}
                                  alt=""
                                  className="saap-thumb"
                                />
                              ) : proj.images?.[0] ? (
                                <img
                                  src={proj.images[0]}
                                  alt=""
                                  className="saap-thumb"
                                />
                              ) : (
                                <div className="saap-thumb-placeholder">
                                  <Code2 size={14} />
                                </div>
                              )}
                              <div>
                                <div className="saap-title-text">
                                  {proj.title}
                                </div>
                                <div className="saap-slug-small">
                                  <Hash size={10} />
                                  {proj.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="saap-cat-badge">
                              <FolderTree size={12} />
                              {getCategoryName(proj.category)}
                            </span>
                          </td>
                          <td className="ssas-td-muted">
                            {proj.client || "—"}
                          </td>
                          <td>
                            <select
                              className={`saap-status-select ${meta.color}`}
                              value={proj.status}
                              onChange={(e) =>
                                handleStatusChange(proj, e.target.value)
                              }
                            >
                              {Object.entries(STATUS_META).map(([val, sm]) => (
                                <option key={val} value={val}>
                                  {sm.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="ssas-td-muted">
                            {proj.startDate
                              ? new Date(proj.startDate).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="ssas-td-muted">
                            {proj.endDate
                              ? new Date(proj.endDate).toLocaleDateString()
                              : "—"}
                          </td>
                          <td>
                            <div className="ssas-row-actions">
                              <button
                                className="ssas-icon-btn ssas-btn-edit"
                                onClick={() => openEdit(proj)}
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                className="ssas-icon-btn ssas-btn-del"
                                onClick={() => handleDelete(proj)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
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
          <div
            className="saap-modal saap-modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="saap-modal-header">
              <h3 className="saap-modal-title">
                {editing ? "Edit Project" : "Add New Project"}
              </h3>
              <button className="saap-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="saap-modal-body saap-modal-scroll">
              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">
                    Project Title <span className="ssas-required">*</span>
                  </label>
                  <input
                    className="ssas-input"
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="E-commerce Website"
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
                    placeholder="e-commerce-website"
                  />
                </div>
              </div>

              <div className="saap-form-group">
                <label className="saap-label">Description</label>
                <textarea
                  className="ssas-input ssas-textarea"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  placeholder="Brief description of the project…"
                />
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Client Name</label>
                  <input
                    className="ssas-input"
                    value={form.client}
                    onChange={(e) => handleFormChange("client", e.target.value)}
                    placeholder="ABC Corp"
                  />
                </div>

                {/* Category Dropdown */}
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
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Status</label>
                  <select
                    className="ssas-input"
                    value={form.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    {Object.entries(STATUS_META).map(([val, sm]) => (
                      <option key={val} value={val}>
                        {sm.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="saap-form-group">
                  <label className="saap-label">Priority</label>
                  <input
                    className="ssas-input"
                    type="number"
                    min="0"
                    value={form.priority}
                    onChange={(e) =>
                      handleFormChange("priority", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Start Date</label>
                  <input
                    className="ssas-input"
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      handleFormChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">End Date</label>
                  <input
                    className="ssas-input"
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      handleFormChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="saap-form-group">
                <label className="saap-label">
                  Technologies (comma separated)
                </label>
                <input
                  className="ssas-input"
                  value={form.technologies}
                  onChange={(e) =>
                    handleFormChange("technologies", e.target.value)
                  }
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="saap-form-group">
                <label className="saap-label">Tags (comma separated)</label>
                <input
                  className="ssas-input"
                  value={form.tags}
                  onChange={(e) => handleFormChange("tags", e.target.value)}
                  placeholder="ecommerce, responsive, mobile"
                />
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group">
                  <label className="saap-label">Demo URL</label>
                  <input
                    className="ssas-input"
                    type="url"
                    value={form.demoUrl}
                    onChange={(e) =>
                      handleFormChange("demoUrl", e.target.value)
                    }
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div className="saap-form-group">
                  <label className="saap-label">Repository URL</label>
                  <input
                    className="ssas-input"
                    type="url"
                    value={form.repoUrl}
                    onChange={(e) =>
                      handleFormChange("repoUrl", e.target.value)
                    }
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="saap-form-group">
                <label className="saap-label">Client URL</label>
                <input
                  className="ssas-input"
                  type="url"
                  value={form.clientUrl}
                  onChange={(e) =>
                    handleFormChange("clientUrl", e.target.value)
                  }
                  placeholder="https://client-website.com"
                />
              </div>

              <div className="saap-form-grid-2">
                <div className="saap-form-group saap-form-row">
                  <label className="saap-label">Featured</label>
                  <button
                    type="button"
                    className={`ssas-toggle ${form.isFeatured ? "ssas-toggle-on" : ""}`}
                    onClick={() =>
                      handleFormChange("isFeatured", !form.isFeatured)
                    }
                  >
                    <span className="ssas-toggle-thumb" />
                  </button>
                </div>

                <div className="saap-form-group saap-form-row">
                  <label className="saap-label">Published</label>
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
              </div>

              <div className="saap-form-group saap-form-row">
                <label className="saap-label">Requires Login</label>
                <button
                  type="button"
                  className={`ssas-toggle ${form.requiresLogin ? "ssas-toggle-on" : ""}`}
                  onClick={() =>
                    handleFormChange("requiresLogin", !form.requiresLogin)
                  }
                >
                  <span className="ssas-toggle-thumb" />
                </button>
              </div>

              {/* Main/Front Image Section */}
              <div className="saap-form-group">
                <label className="saap-label">
                  <Star size={14} style={{ marginRight: 4 }} /> Main/Front Image
                </label>

                {/* Method Toggle */}
                <div
                  className="saap-image-method-toggle"
                  style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
                >
                  <button
                    type="button"
                    className={`ssas-btn-ghost ${mainImageMethod === "url" ? "ssas-btn-active" : ""}`}
                    onClick={() => {
                      setMainImageMethod("url");
                      clearMainFile();
                    }}
                    style={{
                      flex: 1,
                      background:
                        mainImageMethod === "url"
                          ? "rgba(108,99,255,0.1)"
                          : "transparent",
                      borderColor:
                        mainImageMethod === "url"
                          ? "#6c63ff"
                          : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Link size={14} /> URL
                  </button>
                  <button
                    type="button"
                    className={`ssas-btn-ghost ${mainImageMethod === "upload" ? "ssas-btn-active" : ""}`}
                    onClick={() => setMainImageMethod("upload")}
                    style={{
                      flex: 1,
                      background:
                        mainImageMethod === "upload"
                          ? "rgba(108,99,255,0.1)"
                          : "transparent",
                      borderColor:
                        mainImageMethod === "upload"
                          ? "#6c63ff"
                          : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Upload size={14} /> Upload
                  </button>
                </div>

                {mainImageMethod === "url" ? (
                  <input
                    className="ssas-input"
                    type="url"
                    value={existingImages[0] || ""}
                    onChange={(e) => {
                      const newImages = [...existingImages];
                      if (newImages.length > 0) {
                        newImages[0] = e.target.value;
                      } else {
                        newImages.push(e.target.value);
                      }
                      setExistingImages(newImages);
                      setMainImagePreview(e.target.value);
                    }}
                    placeholder="https://cdn.example.com/main-image.jpg"
                  />
                ) : (
                  <div className="saap-file-upload-area">
                    <input
                      type="file"
                      ref={mainFileInputRef}
                      onChange={handleMainFileSelect}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      style={{ display: "none" }}
                    />

                    {!selectedMainFile && !existingImages[0] ? (
                      <div
                        onClick={() => mainFileInputRef.current?.click()}
                        className="saap-file-upload-placeholder"
                      >
                        <Upload
                          size={32}
                          style={{ marginBottom: "8px", color: "#6c63ff" }}
                        />
                        <p style={{ margin: 0, fontWeight: 500 }}>
                          Click to upload main image
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: "12px",
                            opacity: 0.7,
                          }}
                        >
                          JPEG, PNG, GIF, WEBP (max 10MB)
                        </p>
                      </div>
                    ) : (
                      <div
                        className="saap-file-preview"
                        style={{ position: "relative" }}
                      >
                        <img
                          src={mainImagePreview || existingImages[0]}
                          alt="Main preview"
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid rgba(108,99,255,0.3)",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x200?text=Image+Not+Found";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            clearMainFile();
                            setExistingImages((prev) =>
                              prev.filter((_, i) => i !== 0),
                            );
                            setMainImagePreview("");
                          }}
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
                        {selectedMainFile ? (
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
                            {selectedMainFile.name}
                          </div>
                        ) : (
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
                            Existing Image
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Images Section */}
              <div className="saap-form-group">
                <label className="saap-label">
                  <Image size={14} style={{ marginRight: 4 }} /> Additional
                  Images (up to 10)
                </label>

                {/* Method Toggle */}
                <div
                  className="saap-image-method-toggle"
                  style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
                >
                  <button
                    type="button"
                    className={`ssas-btn-ghost ${additionalImagesMethod === "url" ? "ssas-btn-active" : ""}`}
                    onClick={() => setAdditionalImagesMethod("url")}
                    style={{
                      flex: 1,
                      background:
                        additionalImagesMethod === "url"
                          ? "rgba(108,99,255,0.1)"
                          : "transparent",
                      borderColor:
                        additionalImagesMethod === "url"
                          ? "#6c63ff"
                          : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Link size={14} /> URL(s)
                  </button>
                  <button
                    type="button"
                    className={`ssas-btn-ghost ${additionalImagesMethod === "upload" ? "ssas-btn-active" : ""}`}
                    onClick={() => setAdditionalImagesMethod("upload")}
                    style={{
                      flex: 1,
                      background:
                        additionalImagesMethod === "upload"
                          ? "rgba(108,99,255,0.1)"
                          : "transparent",
                      borderColor:
                        additionalImagesMethod === "upload"
                          ? "#6c63ff"
                          : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Upload size={14} /> Upload
                  </button>
                </div>

                {additionalImagesMethod === "url" ? (
                  <textarea
                    className="ssas-input ssas-textarea saap-mono"
                    rows={4}
                    value={existingImages.slice(1).join("\n")}
                    onChange={(e) => {
                      const urls = e.target.value
                        .split("\n")
                        .map((u) => u.trim())
                        .filter(Boolean);
                      setExistingImages((prev) => [prev[0] || "", ...urls]);
                    }}
                    placeholder="https://cdn.example.com/image1.jpg&#10;https://cdn.example.com/image2.jpg&#10;https://cdn.example.com/image3.jpg"
                  />
                ) : (
                  <div className="saap-file-upload-area">
                    <input
                      type="file"
                      ref={additionalFileInputRef}
                      onChange={handleAdditionalFilesSelect}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      multiple
                      style={{ display: "none" }}
                    />

                    <div
                      onClick={() => additionalFileInputRef.current?.click()}
                      className="saap-file-upload-placeholder"
                      style={{ marginBottom: "16px" }}
                    >
                      <Upload
                        size={32}
                        style={{ marginBottom: "8px", color: "#6c63ff" }}
                      />
                      <p style={{ margin: 0, fontWeight: 500 }}>
                        Click to select multiple images
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "12px",
                          opacity: 0.7,
                        }}
                      >
                        Select up to 10 images (JPEG, PNG, GIF, WEBP, max 10MB
                        each)
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "12px",
                          opacity: 0.7,
                        }}
                      >
                        Selected: {selectedAdditionalFiles.length} / 10
                      </p>
                    </div>

                    {/* Existing Images Preview - Show all existing images except the first one (main) */}
                    {existingImages.slice(1).length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <h4 style={{ margin: "0 0 8px", fontSize: "14px" }}>
                          Existing Images:
                        </h4>
                        <div
                          className="saap-image-grid"
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: "12px",
                          }}
                        >
                          {existingImages.slice(1).map((url, idx) => (
                            <div
                              key={`existing-${idx}`}
                              className="saap-image-item"
                              style={{ position: "relative" }}
                            >
                              <img
                                src={url}
                                alt={`Existing ${idx + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid rgba(108,99,255,0.3)",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/120x100?text=Error";
                                }}
                              />
                              <div
                                className="saap-image-actions"
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  display: "flex",
                                  gap: "4px",
                                  opacity: 0,
                                  transition: "opacity 0.2s",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => moveImageUp(idx + 1, true)}
                                  className="ssas-icon-btn"
                                  title="Move up"
                                  style={{
                                    background: "rgba(0,0,0,0.7)",
                                    padding: "4px",
                                  }}
                                  disabled={idx === 0}
                                >
                                  <ChevronUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveImageDown(idx + 1, true)}
                                  className="ssas-icon-btn"
                                  title="Move down"
                                  style={{
                                    background: "rgba(0,0,0,0.7)",
                                    padding: "4px",
                                  }}
                                  disabled={
                                    idx === existingImages.slice(1).length - 1
                                  }
                                >
                                  <ChevronDown size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(idx + 1)}
                                  className="ssas-icon-btn ssas-btn-del"
                                  title="Remove"
                                  style={{
                                    background: "rgba(239,68,68,0.9)",
                                    padding: "4px",
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Uploaded Images Preview */}
                    {additionalImagesPreviews.length > 0 && (
                      <div>
                        <h4 style={{ margin: "0 0 8px", fontSize: "14px" }}>
                          New Images to Upload:
                        </h4>
                        <div
                          className="saap-image-grid"
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: "12px",
                          }}
                        >
                          {additionalImagesPreviews.map((preview, idx) => (
                            <div
                              key={`new-${idx}`}
                              className="saap-image-item"
                              style={{ position: "relative" }}
                            >
                              <img
                                src={preview}
                                alt={`New ${idx + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid rgba(108,99,255,0.3)",
                                }}
                              />
                              <div
                                className="saap-image-actions"
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  display: "flex",
                                  gap: "4px",
                                  opacity: 0,
                                  transition: "opacity 0.2s",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => moveImageUp(idx, false)}
                                  className="ssas-icon-btn"
                                  title="Move up"
                                  style={{
                                    background: "rgba(0,0,0,0.7)",
                                    padding: "4px",
                                  }}
                                  disabled={idx === 0}
                                >
                                  <ChevronUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveImageDown(idx, false)}
                                  className="ssas-icon-btn"
                                  title="Move down"
                                  style={{
                                    background: "rgba(0,0,0,0.7)",
                                    padding: "4px",
                                  }}
                                  disabled={
                                    idx === additionalImagesPreviews.length - 1
                                  }
                                >
                                  <ChevronDown size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeAdditionalFile(idx)}
                                  className="ssas-icon-btn ssas-btn-del"
                                  title="Remove"
                                  style={{
                                    background: "rgba(239,68,68,0.9)",
                                    padding: "4px",
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "4px",
                                  left: "4px",
                                  background: "rgba(0,0,0,0.7)",
                                  padding: "2px 4px",
                                  borderRadius: "4px",
                                  fontSize: "10px",
                                }}
                              >
                                {selectedAdditionalFiles[idx].name.substring(
                                  0,
                                  10,
                                )}
                                ...
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SEO Section */}
              <details className="saap-details">
                <summary className="saap-details-summary">SEO Settings</summary>
                <div className="saap-details-content">
                  <div className="saap-form-group">
                    <label className="saap-label">Meta Title</label>
                    <input
                      className="ssas-input"
                      value={form.metaTitle}
                      onChange={(e) =>
                        handleFormChange("metaTitle", e.target.value)
                      }
                    />
                  </div>
                  <div className="saap-form-group">
                    <label className="saap-label">Meta Description</label>
                    <textarea
                      className="ssas-input ssas-textarea"
                      rows={2}
                      value={form.metaDescription}
                      onChange={(e) =>
                        handleFormChange("metaDescription", e.target.value)
                      }
                    />
                  </div>
                  <div className="saap-form-group">
                    <label className="saap-label">
                      Meta Keywords (comma separated)
                    </label>
                    <input
                      className="ssas-input"
                      value={form.metaKeywords}
                      onChange={(e) =>
                        handleFormChange("metaKeywords", e.target.value)
                      }
                    />
                  </div>
                </div>
              </details>
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
                    {editing ? "Update Project" : "Add Project"}
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

export default Projects;
