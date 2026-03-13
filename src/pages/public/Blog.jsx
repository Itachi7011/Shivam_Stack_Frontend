import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Search,
  Calendar,
  Clock,
  Tag,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  X,
  Send,
  Eye,
  Rss,
  Layers,
  TrendingUp,
  Sparkles,
  User,
  Edit3,
  Trash2,
  Filter,
  ChevronDown,
  ArrowRight,
  BarChart2,
  Globe,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "/api/public/blogs";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const readingTime = (text = "") => {
  const words = text.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");
const excerpt = (html, len = 150) => {
  const plain = stripHtml(html);
  return plain.length > len ? plain.slice(0, len) + "…" : plain;
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="shivam-stack-my-public-pages-blog-card shivam-stack-my-public-pages-skeleton-card">
    <div className="shivam-stack-my-public-pages-skeleton-img" />
    <div className="shivam-stack-my-public-pages-card-body">
      <div className="shivam-stack-my-public-pages-skeleton-line shivam-stack-my-public-pages-skeleton-short" />
      <div className="shivam-stack-my-public-pages-skeleton-line" />
      <div className="shivam-stack-my-public-pages-skeleton-line shivam-stack-my-public-pages-skeleton-medium" />
      <div className="shivam-stack-my-public-pages-skeleton-line shivam-stack-my-public-pages-skeleton-short" />
    </div>
  </div>
);

// ─── Blog Card ────────────────────────────────────────────────────────────────
const BlogCard = ({ blog, user, onOpen, onLike, index }) => {
  const isLiked = user?.likedBlogs?.includes(blog._id);

  return (
    <article
      className="shivam-stack-my-public-pages-blog-card"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => onOpen(blog.slug)}
    >
      <div className="shivam-stack-my-public-pages-card-img-wrap">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="shivam-stack-my-public-pages-card-img"
            loading="lazy"
          />
        ) : (
          <div className="shivam-stack-my-public-pages-card-img-placeholder">
            <BookOpen size={36} />
          </div>
        )}
        {blog.category && (
          <span className="shivam-stack-my-public-pages-card-category-badge">
            {blog.category.name}
          </span>
        )}
      </div>

      <div className="shivam-stack-my-public-pages-card-body">
        {blog.tags?.length > 0 && (
          <div className="shivam-stack-my-public-pages-card-tags">
            {blog.tags.slice(0, 3).map((t) => (
              <span key={t} className="shivam-stack-my-public-pages-card-tag">
                <Tag size={10} />
                {t}
              </span>
            ))}
          </div>
        )}

        <h2 className="shivam-stack-my-public-pages-card-title">
          {blog.title}
        </h2>
        <p className="shivam-stack-my-public-pages-card-excerpt">
          {excerpt(blog.content, 130)}
        </p>

        <div className="shivam-stack-my-public-pages-card-meta">
          <span className="shivam-stack-my-public-pages-card-meta-item">
            <Calendar size={13} />
            {formatDate(blog.publishedAt || blog.createdAt)}
          </span>
          <span className="shivam-stack-my-public-pages-card-meta-item">
            <Clock size={13} />
            {readingTime(blog.content)} min read
          </span>
          <span className="shivam-stack-my-public-pages-card-meta-item">
            <Eye size={13} />
            {blog.views || 0}
          </span>
        </div>

        <div className="shivam-stack-my-public-pages-card-footer">
          <button
            className={`shivam-stack-my-public-pages-card-like-btn ${isLiked ? "shivam-stack-my-public-pages-liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onLike(blog._id);
            }}
            aria-label="Like"
          >
            <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
            <span>{blog.likesCount || 0}</span>
          </button>
          <button
            className="shivam-stack-my-public-pages-card-comment-count"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(blog.slug);
            }}
          >
            <MessageCircle size={15} />
            <span>{blog.commentsCount || 0}</span>
          </button>
          <span className="shivam-stack-my-public-pages-card-read-link">
            Read <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
};

// ─── Comment Item ────────────────────────────────────────────────────────────
const CommentItem = ({ comment, user, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);

  const isOwner = user?._id === (comment.user?._id || comment.user);

  const handleEdit = () => {
    onEdit(comment._id, editText);
    setEditing(false);
  };

  return (
    <div className="shivam-stack-my-public-pages-comment-item">
      <div className="shivam-stack-my-public-pages-comment-avatar">
        {comment.user?.avatar?.url ? (
          <img src={comment.user.avatar.url} alt={comment.user.name} />
        ) : (
          <User size={16} />
        )}
      </div>
      <div className="shivam-stack-my-public-pages-comment-body">
        <div className="shivam-stack-my-public-pages-comment-header">
          <span className="shivam-stack-my-public-pages-comment-author">
            {comment.user?.name || "Anonymous"}
          </span>
          <span className="shivam-stack-my-public-pages-comment-date">
            {formatDate(comment.updatedAt || comment.createdAt)}
            {comment.updatedAt &&
              comment.updatedAt !== comment.createdAt &&
              " (edited)"}
          </span>
          {isOwner && (
            <div className="shivam-stack-my-public-pages-comment-actions">
              <button
                onClick={() => setEditing(!editing)}
                aria-label="Edit comment"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                aria-label="Delete comment"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <div className="shivam-stack-my-public-pages-comment-edit-row">
            <textarea
              className="shivam-stack-my-public-pages-comment-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="shivam-stack-my-public-pages-comment-edit-btns">
              <button
                className="shivam-stack-my-public-pages-btn-save"
                onClick={handleEdit}
                disabled={!editText.trim()}
              >
                Save
              </button>
              <button
                className="shivam-stack-my-public-pages-btn-cancel"
                onClick={() => {
                  setEditing(false);
                  setEditText(comment.comment);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="shivam-stack-my-public-pages-comment-text">
            {comment.comment}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Blog Detail Modal ────────────────────────────────────────────────────────
const BlogDetail = ({ slug, user, onClose, onLike }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const modalRef = useRef(null);

   const isLiked = blog?.likes?.includes(user?._id) || false;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/slug/${slug}`, {
          withCredentials: true,
        });
        setBlog(res.data.data);
        setComments(res.data.data.comments || []);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
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
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to like this post.",
        confirmButtonColor: "#6c63ff",
      });
      return;
    }

    const originalLikesCount = blog.likesCount;
    const originalIsLiked = isLiked;

    // Optimistic update
        setBlog(prev => {
      const newLikes = isLiked 
        ? prev.likes.filter(id => id !== user._id)
        : [...(prev.likes || []), user._id];
      
      return {
        ...prev,
        likes: newLikes,
        likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      };
    });

    try {
      const result = await onLike(blog._id);
      if (!result?.success) {
        // Revert on error
        setBlog((prev) => ({
          ...prev,
          likesCount: originalLikesCount,
        }));
      }
    } catch {
      // Revert on error
      setBlog((prev) => ({
        ...prev,
        likesCount: originalLikesCount,
      }));
    }
  };

  const handleComment = async () => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to comment.",
        confirmButtonColor: "#6c63ff",
      });
      return;
    }
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_BASE}/${blog._id}/comments`,
        { comment: commentText },
        { withCredentials: true },
      );

      if (res.data.success) {
                const newComment = {
          _id: res.data.data.comment?._id || Date.now().toString(),
          comment: commentText,
          user: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setComments((prev) => [...prev, res.data.data.comment]);
        setBlog((prev) => ({
          ...prev,
          commentsCount: (prev.commentsCount || 0) + 1,
        }));
        setCommentText("");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to post comment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (!isConfirmed) return;

    try {
      const res = await axios.delete(
        `${API_BASE}/${blog._id}/comments/${commentId}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setBlog((prev) => ({
          ...prev,
          commentsCount: Math.max(0, (prev.commentsCount || 1) - 1),
        }));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your comment has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to delete comment.",
      });
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const res = await axios.put(
        `${API_BASE}/${blog._id}/comments/${commentId}`,
        { comment: newText },
        { withCredentials: true },
      );

      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, comment: newText, updatedAt: new Date() }
              : c,
          ),
        );

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Your comment has been updated.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to edit comment.",
      });
    }
  };

  const handleShare = (platform) => {
    const url = window.location.origin + "/blogs/" + slug;
    const text = encodeURIComponent(blog?.title || "Check this out!");

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Link copied to clipboard.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      const links = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      };
      window.open(links[platform], "_blank");
    }
    setShareOpen(false);
  };

  if (loading) {
    return (
      <div className="shivam-stack-my-public-pages-modal-overlay">
        <div className="shivam-stack-my-public-pages-modal-spinner">
          <div className="shivam-stack-my-public-pages-spinner" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="shivam-stack-my-public-pages-modal-overlay">
        <div className="shivam-stack-my-public-pages-modal-empty">
          <p>Blog post not found.</p>
          <button
            onClick={onClose}
            className="shivam-stack-my-public-pages-modal-close-btn"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="shivam-stack-my-public-pages-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={blog.title}
    >
      <div className="shivam-stack-my-public-pages-modal-panel" ref={modalRef}>
        <button
          className="shivam-stack-my-public-pages-modal-x"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {blog.featuredImage && (
          <div className="shivam-stack-my-public-pages-modal-hero">
            <img src={blog.featuredImage} alt={blog.title} />
            <div className="shivam-stack-my-public-pages-modal-hero-overlay" />
          </div>
        )}

        <div className="shivam-stack-my-public-pages-modal-content">
          <div className="shivam-stack-my-public-pages-modal-meta-top">
            {blog.category && (
              <span className="shivam-stack-my-public-pages-modal-category">
                <Layers size={13} /> {blog.category.name}
              </span>
            )}
            {blog.tags?.map((t) => (
              <span key={t} className="shivam-stack-my-public-pages-modal-tag">
                #{t}
              </span>
            ))}
          </div>

          <h1 className="shivam-stack-my-public-pages-modal-title">
            {blog.title}
          </h1>

          <div className="shivam-stack-my-public-pages-modal-info-row">
            <span>
              <User size={14} /> {blog.author || "Shivam"}
            </span>
            <span>
              <Calendar size={14} />{" "}
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span>
              <Clock size={14} /> {readingTime(blog.content)} min read
            </span>
            <span>
              <Eye size={14} /> {blog.views || 0} views
            </span>
          </div>

          <div
            className="shivam-stack-my-public-pages-modal-body"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="shivam-stack-my-public-pages-modal-actions">
            <button
              className={`shivam-stack-my-public-pages-modal-action-btn ${isLiked ? "shivam-stack-my-public-pages-liked" : ""}`}
              onClick={handleLikeClick}
            >
              <Heart
                size={17}
                fill={isLiked ? "currentColor" : "none"}
                color={isLiked ? "#ef4444" : "currentColor"}
              />
              <span>{blog.likesCount || 0} Likes</span>
            </button>
            <button
              className="shivam-stack-my-public-pages-modal-action-btn"
              onClick={() => {
                document
                  .getElementById("shivam-stack-comments-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <MessageCircle size={17} />
              <span>{blog.commentsCount || 0} Comments</span>
            </button>
            <div className="shivam-stack-my-public-pages-share-wrap">
              <button
                className="shivam-stack-my-public-pages-modal-action-btn"
                onClick={() => setShareOpen(!shareOpen)}
              >
                <Share2 size={17} /> Share
              </button>
              {shareOpen && (
                <div className="shivam-stack-my-public-pages-share-menu">
                  <button onClick={() => handleShare("twitter")}>
                    𝕏 Twitter
                  </button>
                  <button onClick={() => handleShare("linkedin")}>
                    <Globe size={13} /> LinkedIn
                  </button>
                  <button onClick={() => handleShare("copy")}>
                    🔗 Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            id="shivam-stack-comments-section"
            className="shivam-stack-my-public-pages-comments-section"
          >
            <h3 className="shivam-stack-my-public-pages-comments-title">
              <MessageCircle size={20} /> Comments ({comments.length})
            </h3>

            {user ? (
              <div className="shivam-stack-my-public-pages-comment-input-wrap">
                <div className="shivam-stack-my-public-pages-comment-input-avatar">
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="shivam-stack-my-public-pages-comment-input-area">
                  <textarea
                    className="shivam-stack-my-public-pages-comment-textarea"
                    placeholder="Share your thoughts…"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <button
                    className="shivam-stack-my-public-pages-comment-submit-btn"
                    onClick={handleComment}
                    disabled={submitting || !commentText.trim()}
                  >
                    {submitting ? (
                      "Posting…"
                    ) : (
                      <>
                        <Send size={14} /> Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="shivam-stack-my-public-pages-comment-login-prompt">
                <MessageCircle size={20} />
                <p>
                  Please <Link to="/login">log in</Link> to leave a comment.
                </p>
              </div>
            )}

            <div className="shivam-stack-my-public-pages-comments-list">
              {comments.length === 0 ? (
                <p className="shivam-stack-my-public-pages-no-comments">
                  No comments yet. Be the first!
                </p>
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

// ─── Main MyBlogs Page ─────────────────────────────────────────────────────────
const MyBlogs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
  });
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/categories`)
      .then((r) => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const sortMap = {
        newest: { sortBy: "publishedAt", sortOrder: "desc" },
        oldest: { sortBy: "publishedAt", sortOrder: "asc" },
        popular: { sortBy: "views", sortOrder: "desc" },
        liked: { sortBy: "likesCount", sortOrder: "desc" },
      };
      const s = sortMap[sortBy] || sortMap.newest;
      const params = {
        page,
        limit: 9,
        search: debouncedSearch,
        ...s,
      };
      if (activeCategory) params.category = activeCategory;

      const res = await axios.get(`${API_BASE}`, { params });
      setBlogs(res.data.data || []);
      setPagination(res.data.pagination || {});
      setStats(res.data.stats || {});
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeCategory, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCategory, sortBy]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleLike = async (blogId) => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to like this post.",
        confirmButtonColor: "#6c63ff",
      });
      return { success: false };
    }

    try {
      const res = await axios.post(
        `${API_BASE}/${blogId}/like`,
        {},
        { withCredentials: true },
      );

      const { liked, likesCount } = res.data.data;

      setBlogs((prev) =>
        prev.map((b) => (b._id === blogId ? { ...b, likesCount } : b)),
      );

      return { success: true, liked, likesCount };
    } catch (err) {
      console.error("Like error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: err.response?.data?.message || "Failed to like post.",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.transform = `translateY(${y * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openBlog = (slug) => setSelectedSlug(slug);
  const closeBlog = () => setSelectedSlug(null);

  const featuredBlog = blogs[0];

  return (
    <main
      className={`shivam-stack-my-public-pages-blogs-root ${isDarkMode ? "dark" : "light"}`}
    >
      <section
        className="shivam-stack-my-public-pages-hero"
        aria-label="My Blog Hero"
      >
        <div className="shivam-stack-my-public-pages-hero-bg" ref={heroRef} />
        <div className="shivam-stack-my-public-pages-hero-noise" />
        <div className="shivam-stack-my-public-pages-hero-content">
          <div className="shivam-stack-my-public-pages-hero-pill">
            <Rss size={14} /> Developer Blog
          </div>
          <h1 className="shivam-stack-my-public-pages-hero-title">
            Words that{" "}
            <span className="shivam-stack-my-public-pages-hero-highlight">
              Code
            </span>{" "}
            the Future
          </h1>
          <p className="shivam-stack-my-public-pages-hero-sub">
            Deep dives into full-stack engineering, architecture patterns,
            performance optimisations, and the craft of building things that
            last — written by a MERN stack developer who ships.
          </p>

          <div className="shivam-stack-my-public-pages-hero-stats">
            <div className="shivam-stack-my-public-pages-hero-stat">
              <span className="shivam-stack-my-public-pages-hero-stat-num">
                {stats.totalBlogs || pagination.total || 0}
              </span>
              <span className="shivam-stack-my-public-pages-hero-stat-label">
                Articles
              </span>
            </div>
            <div className="shivam-stack-my-public-pages-hero-stat-divider" />
            <div className="shivam-stack-my-public-pages-hero-stat">
              <span className="shivam-stack-my-public-pages-hero-stat-num">
                {stats.totalViews || 0}
              </span>
              <span className="shivam-stack-my-public-pages-hero-stat-label">
                Total Reads
              </span>
            </div>
            <div className="shivam-stack-my-public-pages-hero-stat-divider" />
            <div className="shivam-stack-my-public-pages-hero-stat">
              <span className="shivam-stack-my-public-pages-hero-stat-num">
                {stats.totalLikes || 0}
              </span>
              <span className="shivam-stack-my-public-pages-hero-stat-label">
                Likes
              </span>
            </div>
            <div className="shivam-stack-my-public-pages-hero-stat-divider" />
            <div className="shivam-stack-my-public-pages-hero-stat">
              <span className="shivam-stack-my-public-pages-hero-stat-num">
                {stats.totalComments || 0}
              </span>
              <span className="shivam-stack-my-public-pages-hero-stat-label">
                Comments
              </span>
            </div>
          </div>

          <div className="shivam-stack-my-public-pages-hero-search-wrap">
            <Search
              size={18}
              className="shivam-stack-my-public-pages-hero-search-icon"
            />
            <input
              type="search"
              className="shivam-stack-my-public-pages-hero-search"
              placeholder="Search articles, topics, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search blogs"
            />
            {search && (
              <button
                className="shivam-stack-my-public-pages-hero-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="shivam-stack-my-public-pages-hero-shape shivam-stack-my-public-pages-shape-1" />
        <div className="shivam-stack-my-public-pages-hero-shape shivam-stack-my-public-pages-shape-2" />
        <div className="shivam-stack-my-public-pages-hero-shape shivam-stack-my-public-pages-shape-3" />
      </section>

      {!loading &&
        featuredBlog &&
        !debouncedSearch &&
        !activeCategory &&
        page === 1 && (
          <section
            className="shivam-stack-my-public-pages-featured-section"
            aria-label="Featured Post"
          >
            <div className="shivam-stack-my-public-pages-container">
              <div className="shivam-stack-my-public-pages-section-label">
                <Sparkles size={14} /> Featured Article
              </div>
              <article
                className="shivam-stack-my-public-pages-featured-card"
                onClick={() => openBlog(featuredBlog.slug)}
              >
                <div className="shivam-stack-my-public-pages-featured-img-wrap">
                  {featuredBlog.featuredImage ? (
                    <img
                      src={featuredBlog.featuredImage}
                      alt={featuredBlog.title}
                    />
                  ) : (
                    <div className="shivam-stack-my-public-pages-featured-img-placeholder">
                      <BookOpen size={60} />
                    </div>
                  )}
                  <div className="shivam-stack-my-public-pages-featured-img-overlay" />
                </div>
                <div className="shivam-stack-my-public-pages-featured-info">
                  <div className="shivam-stack-my-public-pages-featured-badges">
                    {featuredBlog.category && (
                      <span className="shivam-stack-my-public-pages-featured-cat">
                        {featuredBlog.category.name}
                      </span>
                    )}
                    <span className="shivam-stack-my-public-pages-featured-new-badge">
                      <TrendingUp size={11} /> Trending
                    </span>
                  </div>
                  <h2 className="shivam-stack-my-public-pages-featured-title">
                    {featuredBlog.title}
                  </h2>
                  <p className="shivam-stack-my-public-pages-featured-excerpt">
                    {excerpt(featuredBlog.content, 240)}
                  </p>
                  <div className="shivam-stack-my-public-pages-featured-meta">
                    <span>
                      <User size={13} /> {featuredBlog.author || "Shivam"}
                    </span>
                    <span>
                      <Calendar size={13} />{" "}
                      {formatDate(
                        featuredBlog.publishedAt || featuredBlog.createdAt,
                      )}
                    </span>
                    <span>
                      <Clock size={13} /> {readingTime(featuredBlog.content)}{" "}
                      min read
                    </span>
                    <span>
                      <Eye size={13} /> {featuredBlog.views || 0} views
                    </span>
                  </div>
                  <div className="shivam-stack-my-public-pages-featured-footer">
                    <button className="shivam-stack-my-public-pages-featured-read-btn">
                      Read Full Article <ArrowRight size={16} />
                    </button>
                    <div className="shivam-stack-my-public-pages-featured-reactions">
                      <span>
                        <Heart size={14} /> {featuredBlog.likesCount || 0}
                      </span>
                      <span>
                        <MessageCircle size={14} />{" "}
                        {featuredBlog.commentsCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

      <section
        className="shivam-stack-my-public-pages-filter-section"
        aria-label="Filters"
      >
        <div className="shivam-stack-my-public-pages-container">
          <div className="shivam-stack-my-public-pages-filter-row">
            <div className="shivam-stack-my-public-pages-category-pills-wrap">
              <button
                className={`shivam-stack-my-public-pages-cat-pill ${activeCategory === "" ? "shivam-stack-my-public-pages-cat-pill-active" : ""}`}
                onClick={() => setActiveCategory("")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`shivam-stack-my-public-pages-cat-pill ${activeCategory === cat._id ? "shivam-stack-my-public-pages-cat-pill-active" : ""}`}
                  onClick={() => setActiveCategory(cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="shivam-stack-my-public-pages-sort-wrap">
              <button
                className="shivam-stack-my-public-pages-sort-btn"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-expanded={filterOpen}
              >
                <Filter size={14} />
                {sortBy === "newest"
                  ? "Newest"
                  : sortBy === "oldest"
                    ? "Oldest"
                    : sortBy === "popular"
                      ? "Most Read"
                      : "Most Liked"}
                <ChevronDown
                  size={14}
                  className={`shivam-stack-my-public-pages-sort-chevron ${filterOpen ? "open" : ""}`}
                />
              </button>
              {filterOpen && (
                <div className="shivam-stack-my-public-pages-sort-menu">
                  {[
                    { v: "newest", l: "Newest First" },
                    { v: "oldest", l: "Oldest First" },
                    { v: "popular", l: "Most Read" },
                    { v: "liked", l: "Most Liked" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      className={
                        sortBy === o.v
                          ? "shivam-stack-my-public-pages-sort-opt-active"
                          : ""
                      }
                      onClick={() => {
                        setSortBy(o.v);
                        setFilterOpen(false);
                      }}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!loading && (
            <p className="shivam-stack-my-public-pages-results-count">
              <BarChart2 size={14} />
              {pagination.total || 0} article{pagination.total !== 1 ? "s" : ""}{" "}
              found
              {debouncedSearch && ` for "${debouncedSearch}"`}
              {activeCategory &&
                ` in ${categories.find((c) => c._id === activeCategory)?.name || "this category"}`}
            </p>
          )}
        </div>
      </section>

      <section
        className="shivam-stack-my-public-pages-grid-section"
        aria-label="Blog posts"
      >
        <div className="shivam-stack-my-public-pages-container">
          {loading || authLoading ? (
            <div className="shivam-stack-my-public-pages-blog-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="shivam-stack-my-public-pages-empty-state">
              <BookOpen size={52} />
              <h3>No articles found</h3>
              <p>Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("");
                  setSortBy("newest");
                }}
                className="shivam-stack-my-public-pages-empty-reset-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="shivam-stack-my-public-pages-blog-grid">
              {blogs.map((blog, i) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  user={user}
                  onOpen={openBlog}
                  onLike={handleLike}
                  index={i}
                />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="shivam-stack-my-public-pages-pagination">
              <button
                className="shivam-stack-my-public-pages-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Prev
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.pages ||
                    Math.abs(p - page) <= 2,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`e-${i}`}
                      className="shivam-stack-my-public-pages-page-ellipsis"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`shivam-stack-my-public-pages-page-btn ${page === p ? "shivam-stack-my-public-pages-page-active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}
              <button
                className="shivam-stack-my-public-pages-page-btn"
                disabled={page === pagination.pages}
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        className="shivam-stack-my-public-pages-about-blog-section"
        aria-label="About the Blog"
      >
        <div className="shivam-stack-my-public-pages-container">
          <div className="shivam-stack-my-public-pages-about-blog-grid">
            <div className="shivam-stack-my-public-pages-about-blog-text">
              <div className="shivam-stack-my-public-pages-section-label">
                <Sparkles size={14} /> Why This Blog?
              </div>
              <h2 className="shivam-stack-my-public-pages-about-blog-title">
                Engineering Notes from the Trenches
              </h2>
              <p>
                Every article here is born from a real problem I've wrestled
                with — a race condition at 3 AM, a MongoDB aggregation that
                refused to cooperate, a React re-render loop that had me
                questioning life. These are battle-tested insights, not
                hypotheticals.
              </p>
              <p>
                I write about the <strong>MERN stack</strong> and everything
                around it: REST & GraphQL API design, JWT auth flows, Cloudinary
                integrations, caching strategies with Redis, CI/CD pipelines,
                and the soft skills no bootcamp teaches you. My goal is simple —
                if one post saves you two hours of debugging, it was worth
                writing.
              </p>
              <p>
                Expect honesty. I'll tell you when a technology disappointed me,
                when a design pattern backfired, and what I'd do differently.
                Real engineering is messy, and the best tutorials acknowledge
                that.
              </p>
            </div>
            <div className="shivam-stack-my-public-pages-about-blog-cards">
              {[
                {
                  icon: <Layers size={22} />,
                  title: "Architecture Deep Dives",
                  desc: "System design for scalable MERN applications — from monolith to microservices.",
                },
                {
                  icon: <TrendingUp size={22} />,
                  title: "Performance Playbooks",
                  desc: "Index tuning, lazy loading, memoisation, and bundle optimisation strategies.",
                },
                {
                  icon: <BookOpen size={22} />,
                  title: "Tutorial Series",
                  desc: "Step-by-step build-alongs with complete GitHub repos and explanations.",
                },
                {
                  icon: <BarChart2 size={22} />,
                  title: "Tech Predictions",
                  desc: "Where the JavaScript ecosystem is heading and how to future-proof your stack.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="shivam-stack-my-public-pages-about-feature-card"
                >
                  <div className="shivam-stack-my-public-pages-about-feature-icon">
                    {item.icon}
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="shivam-stack-my-public-pages-topics-section"
        aria-label="Topics"
      >
        <div className="shivam-stack-my-public-pages-container">
          <div className="shivam-stack-my-public-pages-section-label">
            <Tag size={14} /> Topics
          </div>
          <h2 className="shivam-stack-my-public-pages-topics-title">
            What You'll Find Here
          </h2>
          <div className="shivam-stack-my-public-pages-topics-grid">
            {[
              {
                name: "React.js",
                desc: "Hooks, Context, performance, custom libraries, testing, and real-world patterns that scale.",
              },
              {
                name: "Node.js & Express",
                desc: "REST API architecture, middleware design, error handling, and production-ready server code.",
              },
              {
                name: "MongoDB & Mongoose",
                desc: "Schema design, aggregation pipelines, indexing, and Atlas performance tuning.",
              },
              {
                name: "Authentication & Security",
                desc: "JWT, refresh tokens, OAuth2, RBAC, and defending against common vulnerabilities.",
              },
              {
                name: "DevOps & Deployment",
                desc: "Docker, GitHub Actions, Vercel, Railway, environment management, and zero-downtime deploys.",
              },
              {
                name: "System Design",
                desc: "Scalability patterns, caching, message queues, rate limiting, and distributed systems basics.",
              },
              {
                name: "CSS & UI Engineering",
                desc: "Modern CSS architecture, animations, accessibility, design systems, and component libraries.",
              },
              {
                name: "Career & Growth",
                desc: "Freelancing, open source, technical writing, and navigating the developer job market.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="shivam-stack-my-public-pages-topic-card"
              >
                <h4 className="shivam-stack-my-public-pages-topic-name">
                  {t.name}
                </h4>
                <p className="shivam-stack-my-public-pages-topic-desc">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="shivam-stack-my-public-pages-newsletter-section"
        aria-label="Newsletter"
      >
        <div className="shivam-stack-my-public-pages-container">
          <div className="shivam-stack-my-public-pages-newsletter-card">
            <div className="shivam-stack-my-public-pages-newsletter-glow" />
            <div className="shivam-stack-my-public-pages-newsletter-text">
              <div
                className="shivam-stack-my-public-pages-section-label"
                style={{ justifyContent: "center" }}
              >
                <Rss size={14} /> Stay Updated
              </div>
              <h2 className="shivam-stack-my-public-pages-newsletter-title">
                Never Miss an Article
              </h2>
              <p>
                Join developers getting thoughtful, in-depth articles on
                full-stack engineering delivered to their inbox — no spam, no
                fluff, just signal.
              </p>
            </div>
            <div className="shivam-stack-my-public-pages-newsletter-input-row">
              <input
                type="email"
                className="shivam-stack-my-public-pages-newsletter-input"
                placeholder="you@example.com"
                aria-label="Email address for newsletter"
              />
              <button
                className="shivam-stack-my-public-pages-newsletter-btn"
                onClick={() =>
                  Swal.fire({
                    icon: "success",
                    title: "Subscribed! 🎉",
                    text: "You're on the list. Great articles incoming!",
                    confirmButtonColor: "#6c63ff",
                  })
                }
              >
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
            <p className="shivam-stack-my-public-pages-newsletter-disclaimer">
              No spam. Unsubscribe any time.
            </p>
          </div>
        </div>
      </section>

      {selectedSlug && (
        <BlogDetail
          slug={selectedSlug}
          user={user}
          onClose={closeBlog}
          onLike={handleLike}
        />
      )}
    </main>
  );
};

export default MyBlogs;
