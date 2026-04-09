import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Mail,
  MailOpen,
  Archive,
  AlertTriangle,
  MessageSquare,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Eye,
  Reply,
  Trash2,
  Flag,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Inbox,
  AlertCircle,
  Send,
  Shield,
  Tag,
  User,
  Calendar,
  Globe,
  Zap,
  MoreHorizontal,
  RotateCcw,
  CheckCheck,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const STATUS_CONFIG = {
  unread: { label: "Unread", icon: Mail, color: "unread" },
  read: { label: "Read", icon: MailOpen, color: "read" },
  replied: { label: "Replied", icon: Send, color: "replied" },
  archived: { label: "Archived", icon: Archive, color: "archived" },
  spam: { label: "Spam", icon: Shield, color: "spam" },
};

const CATEGORY_LABELS = {
  general: "General",
  support: "Support",
  purchase: "Purchase",
  refund: "Refund",
  collab: "Collab",
  bug: "Bug Report",
  privacy: "Privacy",
  legal: "Legal",
  feedback: "Feedback",
  other: "Other",
};

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "sender.name_asc", label: "Sender A–Z" },
  { value: "sender.name_desc", label: "Sender Z–A" },
  { value: "subject_asc", label: "Subject A–Z" },
  { value: "status_asc", label: "Status" },
];

export default function ManageContactMessages() {
  const { isDarkMode } = useContext(ThemeContext);
  const token = () => localStorage.getItem("adminToken");
  const API_BASE = "/api/admin/contact-messages";

  // List state
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [filterFollowUp, setFilterFollowUp] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // UI state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const searchRef = useRef(null);
  const filterRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchMessages = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const [sortField, sortOrder] = sortBy.split("_");
        const params = {
          page,
          limit: itemsPerPage,
          search: debouncedSearch,
          status: filterStatus !== "all" ? filterStatus : undefined,
          category: filterCategory !== "all" ? filterCategory : undefined,
          sortField,
          sortOrder,
          urgent: filterUrgent || undefined,
          followUp: filterFollowUp || undefined,
        };
        const res = await axios.get(API_BASE, {
          params,
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        });
        setMessages(res.data.data);
        setPagination(res.data.pagination);
        setStats(res.data.stats || {});
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch messages.",
          background: isDarkMode ? "#1a1a2e" : "#fff",
          color: isDarkMode ? "#e0e0e0" : "#222",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      debouncedSearch,
      filterStatus,
      filterCategory,
      filterUrgent,
      filterFollowUp,
      sortBy,
      itemsPerPage,
      isDarkMode,
    ],
  );

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  const openMessage = async (msg) => {
    setSelectedMessage(msg);
    setDrawerOpen(true);
    setReplyText("");
    if (msg.status === "unread") {
      try {
        await axios.patch(
          `${API_BASE}/${msg._id}/mark-read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token()}`,
              "Content-Type": "application/json",
            },
          },
        );
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m)),
        );
        setSelectedMessage((prev) =>
          prev ? { ...prev, status: "read" } : prev,
        );
        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, (prev.unread || 1) - 1),
          read: (prev.read || 0) + 1,
        }));
      } catch (_) {}
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedMessage(null);
    setReplyText("");
  };

  const handleBulkStatus = async (newStatus) => {
    if (!selectedIds.length) return;
    const result = await Swal.fire({
      title: `Mark ${selectedIds.length} message(s) as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      background: isDarkMode ? "#1a1a2e" : "#fff",
      color: isDarkMode ? "#e0e0e0" : "#222",
      confirmButtonColor: "#00d4ff",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.patch(
        `${API_BASE}/bulk-status`,
        { ids: selectedIds, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );
      setSelectedIds([]);
      fetchMessages(pagination.page);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        timer: 1500,
        showConfirmButton: false,
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Bulk update failed.",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} message(s)?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ff4757",
      background: isDarkMode ? "#1a1a2e" : "#fff",
      color: isDarkMode ? "#e0e0e0" : "#222",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE}/bulk`, {
        data: { ids: selectedIds },
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
      });
      setSelectedIds([]);
      fetchMessages(1);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Bulk delete failed.",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    }
  };

  const handleSingleStatus = async (msgId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE}/${msgId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: newStatus } : m)),
      );
      if (selectedMessage?._id === msgId)
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
      fetchMessages(pagination.page);
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    }
  };

  const handleToggleFlag = async (msgId, field) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/${msgId}/toggle-flag`,
        { field },
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );
      const updated = res.data.data;
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, ...updated } : m)),
      );
      if (selectedMessage?._id === msgId)
        setSelectedMessage((prev) => ({ ...prev, ...updated }));
    } catch (_) {}
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    setReplyLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/${selectedMessage._id}/reply`,
        { response: replyText },
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );
      setSelectedMessage(res.data.data);
      setMessages((prev) =>
        prev.map((m) => (m._id === selectedMessage._id ? res.data.data : m)),
      );
      setReplyText("");
      Swal.fire({
        icon: "success",
        title: "Reply Sent!",
        timer: 1600,
        showConfirmButton: false,
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Failed to send reply",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteSingle = async (msgId) => {
    const result = await Swal.fire({
      title: "Delete this message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ff4757",
      background: isDarkMode ? "#1a1a2e" : "#fff",
      color: isDarkMode ? "#e0e0e0" : "#222",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE}/${msgId}`, {
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
      });
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
      if (selectedMessage?._id === msgId) closeDrawer();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1200,
        showConfirmButton: false,
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } catch (_) {}
  };

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleSelectAll = () => {
    if (selectedIds.length === messages.length) setSelectedIds([]);
    else setSelectedIds(messages.map((m) => m._id));
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterCategory("all");
    setFilterUrgent(false);
    setFilterFollowUp(false);
    setSortBy("createdAt_desc");
  };

  const activeFilterCount = [
    filterStatus !== "all",
    filterCategory !== "all",
    filterUrgent,
    filterFollowUp,
  ].filter(Boolean).length;

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatFullDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unread;
    const Icon = cfg.icon;
    return (
      <span className={`swm-status-badge swm-status-${cfg.color}`}>
        <Icon size={11} />
        {cfg.label}
      </span>
    );
  };

  return (
    <div className={`swm-root ${isDarkMode ? "dark" : "light"}`}>
      {/* Header */}
      <div className="swm-header">
        <div className="swm-header-left">
          <div className="swm-header-icon">
            <Inbox size={22} />
          </div>
          <div>
            <h1 className="swm-title">Contact Messages</h1>
            <p className="swm-subtitle">
              Manage & respond to incoming messages
            </p>
          </div>
        </div>
        <button
          className="swm-refresh-btn"
          onClick={() => fetchMessages(pagination.page)}
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? "swm-spin" : ""} />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="swm-stats-row">
        {[
          { key: "all", label: "Total", icon: Inbox, val: pagination.total },
          {
            key: "unread",
            label: "Unread",
            icon: Mail,
            val: stats.unread || 0,
          },
          { key: "read", label: "Read", icon: MailOpen, val: stats.read || 0 },
          {
            key: "replied",
            label: "Replied",
            icon: Send,
            val: stats.replied || 0,
          },
          {
            key: "archived",
            label: "Archived",
            icon: Archive,
            val: stats.archived || 0,
          },
          { key: "spam", label: "Spam", icon: Shield, val: stats.spam || 0 },
        ].map(({ key, label, icon: Icon, val }) => (
          <button
            key={key}
            className={`swm-stat-card ${filterStatus === key ? "active" : ""}`}
            onClick={() => {
              setFilterStatus(key);
            }}
          >
            <Icon size={16} />
            <span className="swm-stat-num">{val}</span>
            <span className="swm-stat-label">{label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="swm-toolbar">
        {/* Search */}
        <div className="swm-search-wrap">
          <Search size={15} className="swm-search-icon" />
          <input
            ref={searchRef}
            className="swm-search-input"
            placeholder="Search by name, email, subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="swm-search-clear" onClick={() => setSearch("")}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="swm-select-wrap">
          <SortAsc size={14} className="swm-select-icon" />
          <select
            className="swm-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="swm-select-chevron" />
        </div>

        {/* Advanced Filter Dropdown */}
        <div className="swm-filter-wrap" ref={filterRef}>
          <button
            className={`swm-filter-btn ${activeFilterCount > 0 ? "has-filters" : ""}`}
            onClick={() => setFilterOpen((p) => !p)}
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="swm-filter-badge">{activeFilterCount}</span>
            )}
            <ChevronDown
              size={12}
              className={`swm-filter-chevron ${filterOpen ? "open" : ""}`}
            />
          </button>
          {filterOpen && (
            <div className="swm-filter-dropdown">
              <div className="swm-filter-section">
                <label className="swm-filter-label">Category</label>
                <select
                  className="swm-select swm-filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="swm-filter-section">
                <label className="swm-filter-label">Per Page</label>
                <select
                  className="swm-select swm-filter-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                  }}
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} per page
                    </option>
                  ))}
                </select>
              </div>
              <div className="swm-filter-toggles">
                <label className="swm-toggle-label">
                  <input
                    type="checkbox"
                    checked={filterUrgent}
                    onChange={(e) => setFilterUrgent(e.target.checked)}
                  />
                  <Zap size={13} /> Urgent only
                </label>
                <label className="swm-toggle-label">
                  <input
                    type="checkbox"
                    checked={filterFollowUp}
                    onChange={(e) => setFilterFollowUp(e.target.checked)}
                  />
                  <Flag size={13} /> Follow-up only
                </label>
              </div>
              <button
                className="swm-reset-btn"
                onClick={() => {
                  resetFilters();
                  setFilterOpen(false);
                }}
              >
                <RotateCcw size={12} /> Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Items per page quick */}
        <div className="swm-select-wrap">
          <select
            className="swm-select swm-select-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {ITEMS_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}/pg
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="swm-select-chevron" />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="swm-bulk-bar">
          <span className="swm-bulk-count">
            <CheckCheck size={14} /> {selectedIds.length} selected
          </span>
          <div className="swm-bulk-actions">
            <button
              className="swm-bulk-btn read"
              onClick={() => handleBulkStatus("read")}
            >
              <MailOpen size={13} /> Mark Read
            </button>
            <button
              className="swm-bulk-btn archive"
              onClick={() => handleBulkStatus("archived")}
            >
              <Archive size={13} /> Archive
            </button>
            <button
              className="swm-bulk-btn spam"
              onClick={() => handleBulkStatus("spam")}
            >
              <Shield size={13} /> Spam
            </button>
            <button className="swm-bulk-btn delete" onClick={handleBulkDelete}>
              <Trash2 size={13} /> Delete
            </button>
            <button
              className="swm-bulk-btn cancel"
              onClick={() => setSelectedIds([])}
            >
              <X size={13} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Messages Table */}
      <div className="swm-table-container">
        {loading ? (
          <div className="swm-loading">
            <div className="swm-loader"></div>
            <span>Fetching messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="swm-empty">
            <Inbox size={48} />
            <p>No messages found</p>
            <small>Try adjusting your filters or search query.</small>
          </div>
        ) : (
          <table className="swm-table">
            <thead>
              <tr>
                <th className="swm-th-check">
                  <input
                    type="checkbox"
                    className="swm-checkbox"
                    checked={
                      selectedIds.length === messages.length &&
                      messages.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Status</th>
                <th>Flags</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {messages.map((msg) => (
    <tr
      key={msg._id}
      className={`swm-row ${msg.status === "unread" ? "unread-row" : ""} ${selectedIds.includes(msg._id) ? "selected-row" : ""}`}
      onClick={(e) => {
        if (
          !e.target.closest(".swm-row-actions") &&
          !e.target.closest(".swm-checkbox")
        )
          openMessage(msg);
      }}
    >
      <td className="swm-td-check" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="swm-checkbox"
          checked={selectedIds.includes(msg._id)}
          onChange={() => toggleSelect(msg._id)}
        />
      </td>
      <td className="swm-td-sender">
        <div className="swm-sender-avatar">
          {msg.sender.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="swm-sender-info">
          <span className="swm-sender-name">{msg.sender.name}</span>
          <span className="swm-sender-email">
            {msg.sender.email}
          </span>
        </div>
      </td>
      <td className="swm-td-subject">
        <div className="swm-subject-wrapper">
          <span className={`swm-subject-text ${msg.status === "unread" ? "bold" : ""}`}>
            {msg.subject}
          </span>
          <span className="swm-msg-preview">
            {msg.message?.slice(0, 60)}…
          </span>
        </div>
      </td>
      <td>
        <span className="swm-category-tag">
          {CATEGORY_LABELS[msg.category?.toLowerCase()] || msg.category || "General"}
        </span>
      </td>
      <td>
        <StatusBadge status={msg.status} />
      </td>
      <td className="swm-td-flags">
        {msg.isUrgent && (
          <span className="swm-flag urgent" title="Urgent">
            <Zap size={12} />
          </span>
        )}
        {msg.requiresFollowUp && (
          <span className="swm-flag followup" title="Follow-up">
            <Flag size={12} />
          </span>
        )}
      </td>
      <td className="swm-td-date">
        <span title={formatFullDate(msg.createdAt)}>
          {formatDate(msg.createdAt)}
        </span>
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <div className="swm-row-actions">
          <button
            className="swm-action-btn view"
            title="View"
            onClick={() => openMessage(msg)}
          >
            <Eye size={14} />
          </button>
          {msg.status !== "read" && (
            <button
              className="swm-action-btn read"
              title="Mark Read"
              onClick={() => handleSingleStatus(msg._id, "read")}
            >
              <MailOpen size={14} />
            </button>
          )}
          <button
            className="swm-action-btn archive"
            title="Archive"
            onClick={() => handleSingleStatus(msg._id, "archived")}
          >
            <Archive size={14} />
          </button>
          <button
            className="swm-action-btn delete"
            title="Delete"
            onClick={() => handleDeleteSingle(msg._id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="swm-pagination">
          <span className="swm-page-info">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className="swm-page-controls">
            <button
              className="swm-page-btn"
              disabled={pagination.page <= 1}
              onClick={() => fetchMessages(pagination.page - 1)}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
              let p;
              if (pagination.pages <= 7) p = i + 1;
              else if (pagination.page <= 4) p = i + 1;
              else if (pagination.page >= pagination.pages - 3)
                p = pagination.pages - 6 + i;
              else p = pagination.page - 3 + i;
              return (
                <button
                  key={p}
                  className={`swm-page-num ${pagination.page === p ? "active" : ""}`}
                  onClick={() => fetchMessages(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="swm-page-btn"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchMessages(pagination.page + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Message Detail Drawer */}
      {drawerOpen && selectedMessage && (
        <>
          <div className="swm-drawer-backdrop" onClick={closeDrawer} />
          <div className={`swm-drawer ${isDarkMode ? "dark" : "light"}`}>
            <div className="swm-drawer-header">
              <div className="swm-drawer-title-row">
                <h2 className="swm-drawer-title">{selectedMessage.subject}</h2>
                <button className="swm-drawer-close" onClick={closeDrawer}>
                  <X size={18} />
                </button>
              </div>
              <div className="swm-drawer-meta-row">
                <StatusBadge status={selectedMessage.status} />
                <span className="swm-category-tag">
                  {CATEGORY_LABELS[selectedMessage.category]}
                </span>
                {selectedMessage.isUrgent && (
                  <span className="swm-flag urgent">
                    <Zap size={12} /> Urgent
                  </span>
                )}
                {selectedMessage.requiresFollowUp && (
                  <span className="swm-flag followup">
                    <Flag size={12} /> Follow-up
                  </span>
                )}
              </div>
            </div>

            <div className="swm-drawer-body">
              {/* Sender Info */}
              <div className="swm-detail-card">
                <div className="swm-detail-row">
                  <User size={14} />
                  <span className="swm-detail-label">Sender</span>
                  <span className="swm-detail-val">
                    {selectedMessage.sender.name} &lt;
                    {selectedMessage.sender.email}&gt;
                  </span>
                </div>
                <div className="swm-detail-row">
                  <Calendar size={14} />
                  <span className="swm-detail-label">Received</span>
                  <span className="swm-detail-val">
                    {formatFullDate(selectedMessage.createdAt)}
                  </span>
                </div>
                {selectedMessage.readAt && (
                  <div className="swm-detail-row">
                    <Eye size={14} />
                    <span className="swm-detail-label">Read at</span>
                    <span className="swm-detail-val">
                      {formatFullDate(selectedMessage.readAt)}
                    </span>
                  </div>
                )}
                {selectedMessage.ipAddress && (
                  <div className="swm-detail-row">
                    <Globe size={14} />
                    <span className="swm-detail-label">IP</span>
                    <span className="swm-detail-val swm-monospace">
                      {selectedMessage.ipAddress}
                    </span>
                  </div>
                )}
                <div className="swm-detail-row">
                  <Tag size={14} />
                  <span className="swm-detail-label">Message ID</span>
                  <span className="swm-detail-val swm-monospace">
                    {selectedMessage.messageId}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="swm-message-body">
                <h4 className="swm-section-heading">
                  <MessageSquare size={14} /> Message
                </h4>
                <div className="swm-message-text">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Previous Admin Response */}
              {selectedMessage.adminResponse?.response && (
                <div className="swm-prev-response">
                  <h4 className="swm-section-heading">
                    <Send size={14} /> Previous Reply
                  </h4>
                  <div className="swm-response-box">
                    <p>{selectedMessage.adminResponse.response}</p>
                    <small>
                      Sent{" "}
                      {formatFullDate(
                        selectedMessage.adminResponse.respondedAt,
                      )}
                    </small>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="swm-drawer-actions">
                <h4 className="swm-section-heading">
                  <Zap size={14} /> Quick Actions
                </h4>
                <div className="swm-quick-btns">
                  {["unread", "read", "replied", "archived", "spam"].map(
                    (s) => (
                      <button
                        key={s}
                        className={`swm-quick-btn ${selectedMessage.status === s ? "active-status" : ""}`}
                        onClick={() =>
                          handleSingleStatus(selectedMessage._id, s)
                        }
                      >
                        {STATUS_CONFIG[s] &&
                          React.createElement(STATUS_CONFIG[s].icon, {
                            size: 12,
                          })}
                        {STATUS_CONFIG[s]?.label}
                      </button>
                    ),
                  )}
                </div>
                <div className="swm-quick-btns">
                  <button
                    className={`swm-quick-btn flag-btn ${selectedMessage.isUrgent ? "flagged" : ""}`}
                    onClick={() =>
                      handleToggleFlag(selectedMessage._id, "isUrgent")
                    }
                  >
                    <Zap size={12} />{" "}
                    {selectedMessage.isUrgent ? "Remove Urgent" : "Mark Urgent"}
                  </button>
                  <button
                    className={`swm-quick-btn flag-btn ${selectedMessage.requiresFollowUp ? "flagged" : ""}`}
                    onClick={() =>
                      handleToggleFlag(selectedMessage._id, "requiresFollowUp")
                    }
                  >
                    <Flag size={12} />{" "}
                    {selectedMessage.requiresFollowUp
                      ? "Remove Follow-up"
                      : "Mark Follow-up"}
                  </button>
                  <button
                    className="swm-quick-btn delete-btn"
                    onClick={() => handleDeleteSingle(selectedMessage._id)}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {/* Reply Box */}
              <div className="swm-reply-section">
                <h4 className="swm-section-heading">
                  <Reply size={14} /> Reply to Sender
                </h4>
                <textarea
                  className="swm-reply-input"
                  placeholder={`Write your reply to ${selectedMessage.sender.name}…`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                />
                <div className="swm-reply-footer">
                  <span className="swm-reply-to">
                    To: {selectedMessage.sender.email}
                  </span>
                  <button
                    className="swm-reply-send-btn"
                    onClick={handleReply}
                    disabled={!replyText.trim() || replyLoading}
                  >
                    {replyLoading ? (
                      <span className="swm-btn-loader"></span>
                    ) : (
                      <>
                        <Send size={13} /> Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
