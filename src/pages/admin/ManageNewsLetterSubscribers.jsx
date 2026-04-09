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
  Users,
  Zap,
  Search,
  Filter,
  SortAsc,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Inbox,
  Send,
  User,
  Calendar,
  Globe,
  RotateCcw,
  CheckCheck,
  Download,
  Eye,
  Activity,
  Clock,
  Info,
  AtSign,
  Calendar as CalendarIcon,
  Hash,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "email_asc", label: "Email A–Z" },
  { value: "email_desc", label: "Email Z–A" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "status_asc", label: "Status" },
];

export default function NewsletterSubscribers() {
  const { isDarkMode } = useContext(ThemeContext);
  const token = () => localStorage.getItem("adminToken");
  const API_BASE = "/api/admin/newsletter/subscribers";

  // List state
  const [subscribers, setSubscribers] = useState([]);
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
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // UI state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

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

  const fetchSubscribers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const [sortField, sortOrder] = sortBy.split("_");
        const params = {
          page,
          limit: itemsPerPage,
          search: debouncedSearch,
          status: filterStatus !== "all" ? filterStatus : undefined,
          sortField,
          sortOrder,
        };
        const res = await axios.get(API_BASE, {
          params,
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        });
        setSubscribers(res.data.data);
        setPagination(res.data.pagination);
        setStats(res.data.stats || {});
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch subscribers.",
          background: isDarkMode ? "#1a1a2e" : "#fff",
          color: isDarkMode ? "#e0e0e0" : "#222",
        });
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, filterStatus, sortBy, itemsPerPage, isDarkMode],
  );

  useEffect(() => {
    fetchSubscribers(1);
  }, [fetchSubscribers]);

  const openSubscriberDetails = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedSubscriber(null);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} subscriber(s)?`,
      text: "This will permanently remove them from the newsletter list.",
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
      fetchSubscribers(1);
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

  const handleSingleDelete = async (subId, event) => {
    event.stopPropagation();
    const result = await Swal.fire({
      title: "Delete this subscriber?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ff4757",
      background: isDarkMode ? "#1a1a2e" : "#fff",
      color: isDarkMode ? "#e0e0e0" : "#222",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE}/${subId}`, {
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
      });
      setSubscribers((prev) => prev.filter((s) => s._id !== subId));
      if (selectedSubscriber?._id === subId) closeDrawer();
      fetchSubscribers(pagination.page);
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

  const handleToggleStatus = async (subId, currentStatus, event) => {
    event.stopPropagation();
    try {
      await axios.patch(
        `${API_BASE}/${subId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );
      fetchSubscribers(pagination.page);
      if (selectedSubscriber?._id === subId) {
        setSelectedSubscriber((prev) => ({
          ...prev,
          isActive: !currentStatus,
        }));
      }
      Swal.fire({
        icon: "success",
        title: `Subscriber ${currentStatus ? "deactivated" : "activated"}!`,
        timer: 1500,
        showConfirmButton: false,
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Status update failed.",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    }
  };

  const handleBulkStatus = async (newStatus) => {
    if (!selectedIds.length) return;
    const result = await Swal.fire({
      title: `${newStatus === "active" ? "Activate" : "Deactivate"} ${selectedIds.length} subscriber(s)?`,
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
        { ids: selectedIds, isActive: newStatus === "active" },
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );
      setSelectedIds([]);
      fetchSubscribers(pagination.page);
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

  const handleSendNewsletter = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both subject and content.",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
      return;
    }

    const recipients = selectedIds.length > 0 ? selectedIds : "all";
    const recipientCount =
      selectedIds.length > 0 ? selectedIds.length : stats.active;

    const result = await Swal.fire({
      title: `Send newsletter to ${recipientCount} subscriber(s)?`,
      text: "This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Send",
      confirmButtonColor: "#00d4ff",
      background: isDarkMode ? "#1a1a2e" : "#fff",
      color: isDarkMode ? "#e0e0e0" : "#222",
    });

    if (!result.isConfirmed) return;

    setSendingEmail(true);
    try {
      await axios.post(
        `${API_BASE}/send-newsletter`,
        {
          subject: emailSubject,
          content: emailContent,
          recipientIds: recipients === "all" ? null : recipients,
        },
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );
      Swal.fire({
        icon: "success",
        title: "Newsletter Sent!",
        text: `Email sent to ${recipientCount} subscriber(s).`,
        timer: 2500,
        showConfirmButton: false,
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
      setEmailModalOpen(false);
      setEmailSubject("");
      setEmailContent("");
      setSelectedIds([]);
    } catch (_) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to send newsletter.",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const exportToCSV = () => {
    const csvData = subscribers.map((s) => ({
      Email: s.email,
      Name: s.name || "N/A",
      Status: s.isActive ? "Active" : "Inactive",
      "Subscribed Date": new Date(s.subscribedAt).toLocaleString(),
      "Last Updated": new Date(s.updatedAt).toLocaleString(),
    }));

    const csvHeaders = Object.keys(csvData[0]).join(",");
    const csvRows = csvData.map((row) =>
      Object.values(row)
        .map((v) => `"${v}"`)
        .join(","),
    );
    const csv = [csvHeaders, ...csvRows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSelect = (id, event) => {
    event.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === subscribers.length) setSelectedIds([]);
    else setSelectedIds(subscribers.map((s) => s._id));
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setSortBy("createdAt_desc");
  };

  const activeFilterCount = [filterStatus !== "all"].filter(Boolean).length;

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

  return (
    <div className={`swm-root ${isDarkMode ? "dark" : "light"}`}>
      {/* Header */}
      <div className="swm-header">
        <div className="swm-header-left">
          <div className="swm-header-icon">
            <Users size={22} />
          </div>
          <div>
            <h1 className="swm-title">Newsletter Subscribers</h1>
            <p className="swm-subtitle">
              Manage your email subscribers and send newsletters
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="swm-refresh-btn"
            onClick={() => fetchSubscribers(pagination.page)}
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "swm-spin" : ""} />
          </button>
          <button
            className="swm-bulk-btn read"
            onClick={exportToCSV}
            title="Export CSV"
          >
            <Download size={14} /> Export
          </button>
          <button
            className="swm-reply-send-btn"
            onClick={() => setEmailModalOpen(true)}
            style={{ padding: "9px 16px" }}
          >
            <Send size={14} /> Send Newsletter
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="swm-stats-row">
        {[
          { key: "all", label: "Total", icon: Users, val: pagination.total },
          {
            key: "active",
            label: "Active",
            icon: CheckCircle,
            val: stats.active || 0,
          },
          {
            key: "inactive",
            label: "Inactive",
            icon: XCircle,
            val: stats.inactive || 0,
          },
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
            placeholder="Search by email or name…"
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
              onClick={() => handleBulkStatus("active")}
            >
              <CheckCircle size={13} /> Activate
            </button>
            <button
              className="swm-bulk-btn archive"
              onClick={() => handleBulkStatus("inactive")}
            >
              <XCircle size={13} /> Deactivate
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

      {/* Subscribers Table */}
      <div className="swm-table-container">
        {loading ? (
          <div className="swm-loading">
            <div className="swm-loader"></div>
            <span>Fetching subscribers…</span>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="swm-empty">
            <Inbox size={48} />
            <p>No subscribers found</p>
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
                      selectedIds.length === subscribers.length &&
                      subscribers.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ width: "35%" }}>Email</th>
                <th style={{ width: "25%" }}>Name</th>
                <th style={{ width: "15%" }}>Status</th>
                <th style={{ width: "15%" }}>Subscribed</th>
                <th style={{ width: "10%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr
                  key={sub._id}
                  className={`swm-row ${selectedIds.includes(sub._id) ? "selected-row" : ""}`}
                  onClick={() => openSubscriberDetails(sub)}
                >
                  <td
                    className="swm-td-check"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="swm-checkbox"
                      checked={selectedIds.includes(sub._id)}
                      onChange={(e) => toggleSelect(sub._id, e)}
                    />
                  </td>
                  <td className="swm-td-sender">
                    <div className="swm-sender-content">
                      <div className="swm-sender-avatar">
                        {sub.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="swm-sender-info">
                        <span className="swm-sender-name">{sub.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="swm-category-tag">{sub.name || "—"}</span>
                  </td>
                  <td>
                    <span
                      className={`swm-status-badge ${sub.isActive ? "swm-status-read" : "swm-status-archived"}`}
                    >
                      {sub.isActive ? (
                        <CheckCircle size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      {sub.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="swm-td-date">
                    <span title={formatFullDate(sub.subscribedAt)}>
                      {formatDate(sub.subscribedAt)}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="swm-row-actions">
                      <button
                        className="swm-action-btn read"
                        title={sub.isActive ? "Deactivate" : "Activate"}
                        onClick={(e) =>
                          handleToggleStatus(sub._id, sub.isActive, e)
                        }
                      >
                        {sub.isActive ? (
                          <XCircle size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                      </button>
                      <button
                        className="swm-action-btn delete"
                        title="Delete"
                        onClick={(e) => handleSingleDelete(sub._id, e)}
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
              onClick={() => fetchSubscribers(pagination.page - 1)}
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
                  onClick={() => fetchSubscribers(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="swm-page-btn"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchSubscribers(pagination.page + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Subscriber Detail Drawer */}
      {drawerOpen && selectedSubscriber && (
        <>
          <div className="swm-drawer-backdrop" onClick={closeDrawer} />
          <div className={`swm-drawer ${isDarkMode ? "dark" : "light"}`}>
            <div className="swm-drawer-header">
              <div className="swm-drawer-title-row">
                <h2 className="swm-drawer-title">Subscriber Details</h2>
                <button className="swm-drawer-close" onClick={closeDrawer}>
                  <X size={18} />
                </button>
              </div>
              <div className="swm-drawer-meta-row">
                <span
                  className={`swm-status-badge ${selectedSubscriber.isActive ? "swm-status-read" : "swm-status-archived"}`}
                >
                  {selectedSubscriber.isActive ? (
                    <CheckCircle size={11} />
                  ) : (
                    <XCircle size={11} />
                  )}
                  {selectedSubscriber.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="swm-drawer-body">
              {/* Subscriber Info */}
              <div className="swm-detail-card">
                <div className="swm-detail-row">
                  <Mail size={14} />
                  <span className="swm-detail-label">Email</span>
                  <span className="swm-detail-val">
                    {selectedSubscriber.email}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <User size={14} />
                  <span className="swm-detail-label">Name</span>
                  <span className="swm-detail-val">
                    {selectedSubscriber.name || "Not provided"}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <CalendarIcon size={14} />
                  <span className="swm-detail-label">Subscribed</span>
                  <span className="swm-detail-val">
                    {formatFullDate(selectedSubscriber.subscribedAt)}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <Clock size={14} />
                  <span className="swm-detail-label">Last Updated</span>
                  <span className="swm-detail-val">
                    {formatFullDate(selectedSubscriber.updatedAt)}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <Hash size={14} />
                  <span className="swm-detail-label">Subscriber ID</span>
                  <span className="swm-detail-val swm-monospace">
                    {selectedSubscriber._id}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="swm-drawer-actions">
                <h4 className="swm-section-heading">
                  <Zap size={14} /> Quick Actions
                </h4>
                <div className="swm-quick-btns">
                  <button
                    className={`swm-quick-btn ${selectedSubscriber.isActive ? "active-status" : ""}`}
                    onClick={() => {
                      handleToggleStatus(
                        selectedSubscriber._id,
                        selectedSubscriber.isActive,
                        { stopPropagation: () => {} },
                      );
                      setSelectedSubscriber((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }));
                    }}
                  >
                    {selectedSubscriber.isActive ? (
                      <XCircle size={12} />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    {selectedSubscriber.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="swm-quick-btn delete-btn"
                    onClick={() => {
                      handleSingleDelete(selectedSubscriber._id, {
                        stopPropagation: () => {},
                      });
                      closeDrawer();
                    }}
                  >
                    <Trash2 size={12} /> Delete Subscriber
                  </button>
                </div>
              </div>

              {/* Send Email Action */}
              <div className="swm-reply-section">
                <h4 className="swm-section-heading">
                  <Send size={14} /> Send Individual Email
                </h4>
                <button
                  className="swm-reply-send-btn"
                  onClick={() => {
                    setEmailSubject(`Newsletter Update`);
                    setEmailContent(
                      `Dear ${selectedSubscriber.name || "Subscriber"},\n\n`,
                    );
                    setEmailModalOpen(true);
                    closeDrawer();
                  }}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <Mail size={13} /> Compose Email to {selectedSubscriber.email}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Send Newsletter Modal */}
      {emailModalOpen && (
        <>
          <div
            className="swm-drawer-backdrop"
            onClick={() => setEmailModalOpen(false)}
          />
          <div
            className={`swm-drawer ${isDarkMode ? "dark" : "light"}`}
            style={{ maxWidth: "600px" }}
          >
            <div className="swm-drawer-header">
              <div className="swm-drawer-title-row">
                <h2 className="swm-drawer-title">Send Newsletter</h2>
                <button
                  className="swm-drawer-close"
                  onClick={() => setEmailModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="swm-drawer-meta-row">
                <span className="swm-category-tag">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} selected`
                    : `All ${stats.active} active subscribers`}
                </span>
              </div>
            </div>

            <div className="swm-drawer-body">
              <div className="swm-message-body">
                <h4 className="swm-section-heading">
                  <Mail size={14} /> Email Details
                </h4>
                <input
                  className="swm-search-input"
                  style={{ marginBottom: "16px" }}
                  placeholder="Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
                <textarea
                  className="swm-reply-input"
                  placeholder="Email content (HTML supported)…"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={10}
                />
              </div>

              <div className="swm-reply-footer">
                <button
                  className="swm-reply-send-btn"
                  onClick={handleSendNewsletter}
                  disabled={
                    sendingEmail || !emailSubject.trim() || !emailContent.trim()
                  }
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {sendingEmail ? (
                    <span className="swm-btn-loader"></span>
                  ) : (
                    <>
                      <Send size={13} /> Send Newsletter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
