import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Search,
  X,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Send,
  Edit3,
  Trash2,
  ChevronDown,
  Filter,
  ArrowRight,
  ExternalLink,
  Github,
  Code2,
  Layers,
  Zap,
  Star,
  Calendar,
  Tag,
  User,
  Globe,
  Monitor,
  Cpu,
  Grid3x3,
  List,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Circle,
  Timer,
  BarChart3,
  Flame,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "/api/public/projects";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");
const excerpt = (text = "", len = 160) => {
  const plain = stripHtml(text);
  return plain.length > len ? plain.slice(0, len) + "…" : plain;
};

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "ssp-status-completed",
  },
  "in-progress": {
    label: "In Progress",
    icon: Timer,
    className: "ssp-status-progress",
  },
  planned: { label: "Planned", icon: Circle, className: "ssp-status-planned" },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = ({ view }) => (
  <div className={`ssp-project-card ssp-skeleton-card ${view === "list" ? "ssp-card-list" : ""}`}>
    <div className="ssp-skeleton-img" />
    <div className="ssp-skeleton-body">
      <div className="ssp-skeleton-line ssp-sk-short" />
      <div className="ssp-skeleton-line" />
      <div className="ssp-skeleton-line ssp-sk-medium" />
    </div>
  </div>
);

// ─── Tech Badge ───────────────────────────────────────────────────────────────
const TechBadge = ({ name }) => (
  <span className="ssp-tech-badge">{name}</span>
);

// ─── Comment Item ─────────────────────────────────────────────────────────────
const CommentItem = ({ comment, user, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const isOwner = user?._id === (comment.user?._id || comment.user);

  const handleSave = () => {
    if (!editText.trim()) return;
    onEdit(comment._id, editText.trim());
    setEditing(false);
  };

  return (
    <div className="ssp-comment-item">
      <div className="ssp-comment-avatar">
        {comment.user?.avatar?.url ? (
          <img src={comment.user.avatar.url} alt={comment.user.name} />
        ) : (
          <User size={14} />
        )}
      </div>
      <div className="ssp-comment-body">
        <div className="ssp-comment-header">
          <span className="ssp-comment-author">{comment.user?.name || "Anonymous"}</span>
          <span className="ssp-comment-date">
            {formatDate(comment.updatedAt || comment.createdAt)}
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && " (edited)"}
          </span>
          {isOwner && (
            <div className="ssp-comment-actions">
              <button onClick={() => setEditing(!editing)} aria-label="Edit">
                <Edit3 size={12} />
              </button>
              <button onClick={() => onDelete(comment._id)} aria-label="Delete">
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <div className="ssp-comment-edit">
            <textarea
              className="ssp-comment-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="ssp-comment-edit-btns">
              <button className="ssp-btn-save" onClick={handleSave} disabled={!editText.trim()}>Save</button>
              <button className="ssp-btn-cancel" onClick={() => { setEditing(false); setEditText(comment.comment); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="ssp-comment-text">{comment.comment}</p>
        )}
      </div>
    </div>
  );
};

// ─── Project Detail Modal ─────────────────────────────────────────────────────
const ProjectDetail = ({ slug, user, isAuthenticated, onClose, onLike }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const modalRef = useRef(null);

  const isLiked =
    project?.projectLikes?.some((id) =>
      typeof id === "object"
        ? id._id?.toString() === user?._id
        : id?.toString() === user?._id,
    ) || false;

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/slug/${slug}`, { withCredentials: true });
        const data = res.data.data;
        setProject(data);
        setComments(data.projectComments || []);
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      Swal.fire({ icon: "info", title: "Login Required", text: "Please log in to like this project.", confirmButtonColor: "#f59e0b" });
      return;
    }
    const prev = project.likesCount;
    setProject((p) => ({ ...p, likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1 }));
    const res = await onLike(project._id);
    if (!res?.success) setProject((p) => ({ ...p, likesCount: prev }));
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      Swal.fire({ icon: "info", title: "Login Required", text: "Please log in to comment.", confirmButtonColor: "#f59e0b" });
      return;
    }
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_BASE}/${project._id}/comments`,
        { comment: commentText },
        { withCredentials: true },
      );
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.data.comment]);
        setProject((p) => ({ ...p, commentsCount: (p.commentsCount || 0) + 1 }));
        setCommentText("");
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to post comment." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;
    try {
      const res = await axios.delete(`${API_BASE}/${project._id}/comments/${commentId}`, { withCredentials: true });
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setProject((p) => ({ ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) }));
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to delete." });
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const res = await axios.put(
        `${API_BASE}/${project._id}/comments/${commentId}`,
        { comment: newText },
        { withCredentials: true },
      );
      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, comment: newText, updatedAt: new Date() } : c)),
        );
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to edit." });
    }
  };

  const handleShare = (platform) => {
    const url = window.location.origin + "/projects/" + slug;
    const text = encodeURIComponent(project?.title || "Check this project!");
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      Swal.fire({ icon: "success", title: "Copied!", timer: 1500, showConfirmButton: false });
    } else {
      const links = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      };
      window.open(links[platform], "_blank");
    }
    setShareOpen(false);
  };

  if (loading)
    return (
      <div className="ssp-modal-overlay">
        <div className="ssp-modal-spinner"><div className="ssp-spinner" /></div>
      </div>
    );

  if (!project)
    return (
      <div className="ssp-modal-overlay">
        <div className="ssp-modal-empty">
          <p>Project not found.</p>
          <button className="ssp-modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );

  const allImages = [project.mainImage, ...(project.images || [])].filter(Boolean);
  const StatusIcon = STATUS_CONFIG[project.status]?.icon || Circle;

  return (
    <div className="ssp-modal-overlay" role="dialog" aria-modal="true">
      <div className="ssp-modal-panel" ref={modalRef}>
        <button className="ssp-modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>

        {/* Image gallery */}
        {allImages.length > 0 && (
          <div className="ssp-modal-gallery">
            <div className="ssp-modal-gallery-main">
              <img src={allImages[activeImg]} alt={project.title} />
              <div className="ssp-modal-gallery-overlay" />
            </div>
            {allImages.length > 1 && (
              <div className="ssp-modal-gallery-thumbs">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`ssp-modal-thumb ${i === activeImg ? "ssp-thumb-active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="ssp-modal-content">
          {/* Header */}
          <div className="ssp-modal-header">
            <div className="ssp-modal-header-left">
              <div className="ssp-modal-badges">
                {project.category && (
                  <span className="ssp-modal-cat">{project.category.name}</span>
                )}
                <span className={`ssp-modal-status ${STATUS_CONFIG[project.status]?.className || ""}`}>
                  <StatusIcon size={11} />
                  {STATUS_CONFIG[project.status]?.label || project.status}
                </span>
                {project.isFeatured && (
                  <span className="ssp-modal-featured-badge"><Star size={10} fill="currentColor" /> Featured</span>
                )}
              </div>
              <h1 className="ssp-modal-title">{project.title}</h1>
            </div>
            <div className="ssp-modal-header-links">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="ssp-modal-link-btn ssp-link-demo">
                  <Monitor size={15} /> Live Demo <ArrowUpRight size={13} />
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="ssp-modal-link-btn ssp-link-repo">
                  <Github size={15} /> Source <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="ssp-modal-meta-row">
            {project.client && <span><User size={13} /> {project.client}</span>}
            {project.startDate && <span><Calendar size={13} /> {formatDate(project.startDate)}</span>}
            {project.endDate && <span><CheckCircle2 size={13} /> {formatDate(project.endDate)}</span>}
            <span><Eye size={13} /> {project.views || 0} views</span>
          </div>

          {/* Description */}
          {project.description && (
            <p className="ssp-modal-description">{project.description}</p>
          )}

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="ssp-modal-section">
              <h4 className="ssp-modal-section-title"><Cpu size={14} /> Technologies</h4>
              <div className="ssp-modal-techs">
                {project.technologies.map((t) => <TechBadge key={t} name={t} />)}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="ssp-modal-section">
              <h4 className="ssp-modal-section-title"><Tag size={14} /> Tags</h4>
              <div className="ssp-modal-tags">
                {project.tags.map((t) => <span key={t} className="ssp-modal-tag">#{t}</span>)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="ssp-modal-actions">
            <button
              className={`ssp-modal-action-btn ${isLiked ? "ssp-liked" : ""}`}
              onClick={handleLikeClick}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span>{project.likesCount || 0}</span>
            </button>
            <button
              className="ssp-modal-action-btn"
              onClick={() => document.getElementById("ssp-comments")?.scrollIntoView({ behavior: "smooth" })}
            >
              <MessageCircle size={16} />
              <span>{project.commentsCount || 0}</span>
            </button>
            <div className="ssp-share-wrap">
              <button className="ssp-modal-action-btn" onClick={() => setShareOpen(!shareOpen)}>
                <Share2 size={16} /> Share
              </button>
              {shareOpen && (
                <div className="ssp-share-menu">
                  <button onClick={() => handleShare("twitter")}>𝕏 Twitter</button>
                  <button onClick={() => handleShare("linkedin")}><Globe size={12} /> LinkedIn</button>
                  <button onClick={() => handleShare("copy")}>🔗 Copy Link</button>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div id="ssp-comments" className="ssp-comments-section">
            <h3 className="ssp-comments-title">
              <MessageCircle size={18} /> Discussion ({comments.length})
            </h3>

            {isAuthenticated ? (
              <div className="ssp-comment-input-wrap">
                <div className="ssp-comment-avatar">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <div className="ssp-comment-input-area">
                  <textarea
                    className="ssp-comment-textarea"
                    placeholder="Share your thoughts on this project…"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <button
                    className="ssp-comment-submit"
                    onClick={handleComment}
                    disabled={submitting || !commentText.trim()}
                  >
                    {submitting ? "Posting…" : <><Send size={13} /> Post</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="ssp-comment-login-prompt">
                <Code2 size={18} />
                <p>Please <Link to="/login">log in</Link> to join the discussion.</p>
              </div>
            )}

            <div className="ssp-comments-list">
              {comments.length === 0 ? (
                <p className="ssp-no-comments">No comments yet — be the first to share your thoughts.</p>
              ) : (
                comments.map((c) => (
                  <CommentItem
                    key={c._id}
                    comment={c}
                    user={user}
                    onDelete={handleDeleteComment}
                    onEdit={handleEditComment}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, user, isAuthenticated, onOpen, onLike, index, view }) => {
  const isLiked =
    user?.likedProjects?.includes(project._id) || false;
  const StatusIcon = STATUS_CONFIG[project.status]?.icon || Circle;

  return (
    <article
      className={`ssp-project-card ${view === "list" ? "ssp-card-list" : ""}`}
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={() => onOpen(project.slug)}
    >
      <div className="ssp-card-img-wrap">
        {project.mainImage ? (
          <img src={project.mainImage} alt={project.title} className="ssp-card-img" loading="lazy" />
        ) : (
          <div className="ssp-card-img-placeholder">
            <Code2 size={32} />
          </div>
        )}
        <div className="ssp-card-img-gradient" />

        {/* Overlay badges */}
        <div className="ssp-card-overlay-top">
          {project.isFeatured && (
            <span className="ssp-card-featured-badge">
              <Star size={9} fill="currentColor" /> Featured
            </span>
          )}
          <span className={`ssp-card-status ${STATUS_CONFIG[project.status]?.className || ""}`}>
            <StatusIcon size={9} />
            {STATUS_CONFIG[project.status]?.label || project.status}
          </span>
        </div>

        {/* Quick links */}
        <div className="ssp-card-quick-links">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ssp-card-quick-link"
              onClick={(e) => e.stopPropagation()}
              title="Live Demo"
            >
              <ExternalLink size={13} />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ssp-card-quick-link"
              onClick={(e) => e.stopPropagation()}
              title="Repository"
            >
              <Github size={13} />
            </a>
          )}
        </div>
      </div>

      <div className="ssp-card-body">
        {project.category && (
          <span className="ssp-card-category">{project.category.name}</span>
        )}
        <h2 className="ssp-card-title">{project.title}</h2>

        {project.description && (
          <p className="ssp-card-desc">{excerpt(project.description, view === "list" ? 200 : 110)}</p>
        )}

        {/* Tech stack */}
        {project.technologies?.length > 0 && (
          <div className="ssp-card-techs">
            {project.technologies.slice(0, 4).map((t) => (
              <TechBadge key={t} name={t} />
            ))}
            {project.technologies.length > 4 && (
              <span className="ssp-card-tech-more">+{project.technologies.length - 4}</span>
            )}
          </div>
        )}

        <div className="ssp-card-footer">
          <div className="ssp-card-stats">
            <button
              className={`ssp-card-stat-btn ${isLiked ? "ssp-liked" : ""}`}
              onClick={(e) => { e.stopPropagation(); onLike(project._id); }}
              aria-label="Like"
            >
              <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
              <span>{project.likesCount || 0}</span>
            </button>
            <span className="ssp-card-stat">
              <MessageCircle size={13} />
              <span>{project.commentsCount || 0}</span>
            </span>
            <span className="ssp-card-stat">
              <Eye size={13} />
              <span>{project.views || 0}</span>
            </span>
          </div>
          <span className="ssp-card-view-link">
            View <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  );
};

// ─── Main Projects Page ───────────────────────────────────────────────────────
const MyProjects = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, featured: 0 });
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Animated canvas grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const draw = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const cols = 16;
      const rows = 8;
      const cw = W / cols;
      const ch = H / rows;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const pulse = Math.sin(t * 0.008 + r * 0.7 + c * 0.5) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(245,158,11,${pulse * 0.07})`;
          ctx.beginPath();
          ctx.arc(c * cw, r * ch, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.strokeStyle = "rgba(245,158,11,0.04)";
      ctx.lineWidth = 0.5;
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * ch);
        ctx.lineTo(W, r * ch);
        ctx.stroke();
      }
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cw, 0);
        ctx.lineTo(c * cw, H);
        ctx.stroke();
      }

      t++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Fetch categories
  useEffect(() => {
    axios.get("/api/public/projects/categories")
      .then((r) => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const sortMap = {
        newest: { sortBy: "createdAt", sortOrder: "desc" },
        oldest: { sortBy: "createdAt", sortOrder: "asc" },
        popular: { sortBy: "views", sortOrder: "desc" },
        liked: { sortBy: "likesCount", sortOrder: "desc" },
        featured: { sortBy: "isFeatured", sortOrder: "desc" },
      };
      const s = sortMap[sortBy] || sortMap.newest;
      const params = { page, limit: view === "list" ? 8 : 9, search: debouncedSearch, ...s };
      if (activeCategory) params.category = activeCategory;
      if (activeStatus) params.status = activeStatus;

      const res = await axios.get(`${API_BASE}`, { params });
      setProjects(res.data.data || []);
      setPagination(res.data.pagination || {});

      // Derive simple stats from data
      const all = res.data.data || [];
      setStats({
        total: res.data.pagination?.total || 0,
        completed: all.filter((p) => p.status === "completed").length,
        inProgress: all.filter((p) => p.status === "in-progress").length,
        featured: all.filter((p) => p.isFeatured).length,
      });
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeCategory, activeStatus, sortBy, view]);

  useEffect(() => { setPage(1); }, [debouncedSearch, activeCategory, activeStatus, sortBy]);
  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleLike = async (projectId) => {
    if (!isAuthenticated) {
      Swal.fire({ icon: "info", title: "Login Required", text: "Please log in to like.", confirmButtonColor: "#f59e0b" });
      return { success: false };
    }
    try {
      const res = await axios.post(`${API_BASE}/${projectId}/like`, {}, { withCredentials: true });
      const { liked, likesCount } = res.data.data;
      setProjects((prev) => prev.map((p) => p._id === projectId ? { ...p, likesCount } : p));
      return { success: true, liked, likesCount };
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops!", text: err.response?.data?.message || "Failed to like." });
      return { success: false };
    }
  };

  return (
    <main className={`ssp-root ${isDarkMode ? "dark" : "light"}`}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="ssp-hero">
        <canvas ref={canvasRef} className="ssp-hero-canvas" />
        <div className="ssp-hero-noise" />
        <div ref={heroRef} className="ssp-hero-inner">
          <div className="ssp-hero-eyebrow">
            <span className="ssp-hero-eyebrow-dot" />
            <Code2 size={13} />
            <span>Portfolio</span>
          </div>

          <h1 className="ssp-hero-heading">
            <span className="ssp-hero-h-line1">Built with</span>
            <span className="ssp-hero-h-line2">
              Purpose<span className="ssp-hero-accent">.</span>
            </span>
          </h1>

          <p className="ssp-hero-sub">
            A curated collection of production projects — from complex MERN applications to
            microservice architectures. Each one shipped, iterated, and refined in the real world.
          </p>

          {/* Stat counters */}
          <div className="ssp-hero-counters">
            <div className="ssp-counter">
              <span className="ssp-counter-num">{pagination.total || 0}</span>
              <span className="ssp-counter-label">Total Projects</span>
            </div>
            <div className="ssp-counter-sep" />
            <div className="ssp-counter">
              <span className="ssp-counter-num">{stats.completed}</span>
              <span className="ssp-counter-label">Shipped</span>
            </div>
            <div className="ssp-counter-sep" />
            <div className="ssp-counter">
              <span className="ssp-counter-num">{stats.inProgress}</span>
              <span className="ssp-counter-label">In Progress</span>
            </div>
            <div className="ssp-counter-sep" />
            <div className="ssp-counter">
              <span className="ssp-counter-num">{stats.featured}</span>
              <span className="ssp-counter-label">Featured</span>
            </div>
          </div>

          {/* Search */}
          <div className="ssp-hero-search-wrap">
            <Search size={16} className="ssp-hero-search-icon" />
            <input
              type="search"
              className="ssp-hero-search"
              placeholder="Search projects, technologies, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="ssp-hero-search-clear" onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="ssp-hero-deco ssp-deco-1"><Zap size={22} /></div>
        <div className="ssp-hero-deco ssp-deco-2"><Star size={18} /></div>
        <div className="ssp-hero-deco ssp-deco-3"><Layers size={20} /></div>
      </section>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <section className="ssp-filter-bar">
        <div className="ssp-container">
          <div className="ssp-filter-row">

            {/* Category pills */}
            <div className="ssp-pills-wrap">
              <button
                className={`ssp-pill ${activeCategory === "" && activeStatus === "" ? "ssp-pill-active" : ""}`}
                onClick={() => { setActiveCategory(""); setActiveStatus(""); }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`ssp-pill ${activeCategory === cat._id ? "ssp-pill-active" : ""}`}
                  onClick={() => { setActiveCategory(cat._id); setActiveStatus(""); }}
                >
                  {cat.name}
                </button>
              ))}
              <div className="ssp-pill-divider" />
              {["completed", "in-progress", "planned"].map((s) => (
                <button
                  key={s}
                  className={`ssp-pill ssp-pill-status ${activeStatus === s ? "ssp-pill-active" : ""}`}
                  onClick={() => { setActiveStatus(s === activeStatus ? "" : s); setActiveCategory(""); }}
                >
                  {STATUS_CONFIG[s]?.label}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="ssp-filter-right">
              {/* View toggle */}
              <div className="ssp-view-toggle">
                <button
                  className={`ssp-view-btn ${view === "grid" ? "ssp-view-active" : ""}`}
                  onClick={() => setView("grid")}
                  title="Grid view"
                >
                  <Grid3x3 size={15} />
                </button>
                <button
                  className={`ssp-view-btn ${view === "list" ? "ssp-view-active" : ""}`}
                  onClick={() => setView("list")}
                  title="List view"
                >
                  <List size={15} />
                </button>
              </div>

              {/* Sort */}
              <div className="ssp-sort-wrap">
                <button className="ssp-sort-btn" onClick={() => setFilterOpen(!filterOpen)}>
                  <Filter size={13} />
                  {{ newest: "Newest", oldest: "Oldest", popular: "Popular", liked: "Most Liked", featured: "Featured" }[sortBy]}
                  <ChevronDown size={13} className={`ssp-sort-chevron ${filterOpen ? "open" : ""}`} />
                </button>
                {filterOpen && (
                  <div className="ssp-sort-menu">
                    {[
                      { v: "newest", l: "Newest First" },
                      { v: "oldest", l: "Oldest First" },
                      { v: "popular", l: "Most Viewed" },
                      { v: "liked", l: "Most Liked" },
                      { v: "featured", l: "Featured First" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        className={sortBy === o.v ? "ssp-sort-active" : ""}
                        onClick={() => { setSortBy(o.v); setFilterOpen(false); }}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {!loading && (
            <p className="ssp-results-count">
              <BarChart3 size={13} />
              {pagination.total || 0} project{pagination.total !== 1 ? "s" : ""}
              {debouncedSearch && ` matching "${debouncedSearch}"`}
              {activeCategory && ` in ${categories.find((c) => c._id === activeCategory)?.name || "category"}`}
              {activeStatus && ` · ${STATUS_CONFIG[activeStatus]?.label}`}
            </p>
          )}
        </div>
      </section>

      {/* ── Project Grid ─────────────────────────────────────── */}
      <section className="ssp-grid-section">
        <div className="ssp-container">
          {loading || authLoading ? (
            <div className={view === "list" ? "ssp-project-list" : "ssp-project-grid"}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} view={view} />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="ssp-empty-state">
              <div className="ssp-empty-icon"><Code2 size={44} /></div>
              <h3>No projects found</h3>
              <p>Try adjusting your search or filters.</p>
              <button
                className="ssp-empty-reset"
                onClick={() => { setSearch(""); setActiveCategory(""); setActiveStatus(""); setSortBy("newest"); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={view === "list" ? "ssp-project-list" : "ssp-project-grid"}>
              {projects.map((project, i) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  user={user}
                  isAuthenticated={isAuthenticated}
                  onOpen={(slug) => setSelectedSlug(slug)}
                  onLike={handleLike}
                  index={i}
                  view={view}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="ssp-pagination">
              <button
                className="ssp-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >← Prev</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 2)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`e-${i}`} className="ssp-page-ellipsis">…</span>
                  ) : (
                    <button
                      key={p}
                      className={`ssp-page-btn ${page === p ? "ssp-page-active" : ""}`}
                      onClick={() => setPage(p)}
                    >{p}</button>
                  ),
                )}
              <button
                className="ssp-page-btn"
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              >Next →</button>
            </div>
          )}
        </div>
      </section>

      {/* ── Stack Section ─────────────────────────────────────── */}
      <section className="ssp-stack-section">
        <div className="ssp-container">
          <div className="ssp-stack-grid">
            <div className="ssp-stack-text">
              <div className="ssp-section-eyebrow"><Flame size={13} /> The Stack</div>
              <h2 className="ssp-stack-title">Engineered for the Real World</h2>
              <p>
                Every project is built on a carefully chosen foundation — technologies selected not
                for hype, but for reliability, performance, and developer experience. The goal is
                always the same: ship fast, scale gracefully.
              </p>
              <p>
                From RESTful APIs to real-time sockets, from static sites to full MERN applications —
                the right tool for the right job, every time.
              </p>
            </div>
            <div className="ssp-stack-cards">
              {[
                { icon: <Monitor size={20} />, title: "React Frontends", desc: "Production SPAs with optimised bundles, lazy loading, and polished UX." },
                { icon: <Cpu size={20} />, title: "Node.js APIs", desc: "Scalable REST & GraphQL backends with clean architecture and solid error handling." },
                { icon: <Layers size={20} />, title: "MongoDB Databases", desc: "Thoughtfully modelled schemas, aggregation pipelines, and Atlas deployments." },
                { icon: <Zap size={20} />, title: "DevOps & CI/CD", desc: "Dockerised deployments, GitHub Actions pipelines, and zero-downtime releases." },
              ].map((item) => (
                <div key={item.title} className="ssp-stack-card">
                  <div className="ssp-stack-icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────── */}
      <section className="ssp-cta-section">
        <div className="ssp-container">
          <div className="ssp-cta-card">
            <div className="ssp-cta-glow" />
            <div className="ssp-cta-grid-overlay" />
            <div className="ssp-cta-content">
              <div className="ssp-section-eyebrow ssp-eyebrow-center">
                <Star size={13} fill="currentColor" /> Let's Collaborate
              </div>
              <h2 className="ssp-cta-title">Have a project in mind?</h2>
              <p className="ssp-cta-sub">
                Whether it's a new product, a rebuild, or a tricky engineering challenge —
                let's talk. I'm available for freelance and contract work.
              </p>
              <div className="ssp-cta-actions">
                <a href="/contact" className="ssp-cta-btn-primary">
                  Get in Touch <ArrowRight size={15} />
                </a>
                <a href="/about" className="ssp-cta-btn-ghost">
                  Learn More <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedSlug && (
        <ProjectDetail
          slug={selectedSlug}
          user={user}
          isAuthenticated={isAuthenticated}
          onClose={() => setSelectedSlug(null)}
          onLike={handleLike}
        />
      )}
    </main>
  );
};

export default MyProjects;