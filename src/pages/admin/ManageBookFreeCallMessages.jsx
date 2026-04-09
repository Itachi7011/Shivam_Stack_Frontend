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
  Phone,
  Calendar,
  Clock,
  Mail,
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
  Calendar as CalendarIcon,
  Globe,
  RotateCcw,
  CheckCheck,
  Eye,
  Video,
  MessageSquare,
  DollarSign,
  Tag,
  MapPin,
  Briefcase,
  Star,
  AlertCircle,
  Edit2,
  MoreHorizontal,
  Download,
  FileText,
  Zap,
  Shield,
  Users,
  Clock as ClockIcon,
  PhoneCall,
  CalendarDays,
  Award,
  Target,
  BarChart,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "pending",
    bg: "swm-status-pending",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "confirmed",
    bg: "swm-status-confirmed",
  },
  completed: {
    label: "Completed",
    icon: Award,
    color: "completed",
    bg: "swm-status-completed",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "cancelled",
    bg: "swm-status-cancelled",
  },
  rescheduled: {
    label: "Rescheduled",
    icon: RotateCcw,
    color: "rescheduled",
    bg: "swm-status-rescheduled",
  },
};

const CONVERSION_STATUS_CONFIG = {
  new: { label: "New", icon: Star, color: "new" },
  contacted: { label: "Contacted", icon: Phone, color: "contacted" },
  negotiating: {
    label: "Negotiating",
    icon: MessageSquare,
    color: "negotiating",
  },
  converted: { label: "Converted", icon: Award, color: "converted" },
  lost: { label: "Lost", icon: XCircle, color: "lost" },
};

const PLATFORM_OPTIONS = [
  "Google Meet",
  "Zoom",
  "Microsoft Teams",
  "WhatsApp Video",
  "No preference",
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "selectedDate.date_desc", label: "Meeting Date (Newest)" },
  { value: "selectedDate.date_asc", label: "Meeting Date (Oldest)" },
  { value: "clientDetails.name_asc", label: "Client Name A–Z" },
  { value: "clientDetails.name_desc", label: "Client Name Z–A" },
  { value: "status_asc", label: "Status" },
  { value: "conversionStatus_asc", label: "Lead Stage" },
];

export default function ManageBookCalls() {
  const { isDarkMode } = useContext(ThemeContext);
  const token = () => localStorage.getItem("adminToken");
  const API_BASE = "/api/admin/book-calls";

  // List state
  const [bookings, setBookings] = useState([]);
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
  const [filterConversionStatus, setFilterConversionStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // UI state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    conversionStatus: "",
    meetingLink: "",
    callNotes: "",
    leadScore: 0,
  });
  const [updating, setUpdating] = useState(false);

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

  const fetchBookings = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const [sortField, sortOrder] = sortBy.split("_");
        const params = {
          page,
          limit: itemsPerPage,
          search: debouncedSearch,
          status: filterStatus !== "all" ? filterStatus : undefined,
          conversionStatus:
            filterConversionStatus !== "all"
              ? filterConversionStatus
              : undefined,
          platform: filterPlatform !== "all" ? filterPlatform : undefined,
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
        setBookings(res.data.data);
        setPagination(res.data.pagination);
        setStats(res.data.stats || {});
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch bookings.",
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
      filterConversionStatus,
      filterPlatform,
      sortBy,
      itemsPerPage,
      isDarkMode,
    ],
  );

  useEffect(() => {
    fetchBookings(1);
  }, [fetchBookings]);

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const openUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setUpdateForm({
      status: booking.status,
      conversionStatus: booking.conversionStatus,
      meetingLink: booking.meetingLink || "",
      callNotes: booking.callNotes || "",
      leadScore: booking.leadScore || 0,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateBooking = async () => {
    setUpdating(true);
    try {
      const res = await axios.put(
        `${API_BASE}/${selectedBooking._id}`,
        updateForm,
        {
          headers: {
            Authorization: `Bearer ${token()}`,
            "Content-Type": "application/json",
          },
        },
      );

      setBookings((prev) =>
        prev.map((b) => (b._id === selectedBooking._id ? res.data.data : b)),
      );
      if (selectedBooking._id === selectedBooking?._id) {
        setSelectedBooking(res.data.data);
      }

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Booking details updated successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });

      setUpdateModalOpen(false);
      fetchBookings(pagination.page);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to update booking.",
        background: isDarkMode ? "#1a1a2e" : "#fff",
        color: isDarkMode ? "#e0e0e0" : "#222",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} booking(s)?`,
      text: "This will permanently remove these bookings.",
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
      fetchBookings(1);
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

  const handleSingleDelete = async (bookingId, event) => {
    event.stopPropagation();
    const result = await Swal.fire({
      title: "Delete this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ff4757",
      background: isDarkMode ? "#1a1a2e" : "#fff",
      color: isDarkMode ? "#e0e0e0" : "#222",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE}/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      if (selectedBooking?._id === bookingId) closeDrawer();
      fetchBookings(pagination.page);
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

  const handleBulkStatus = async (newStatus) => {
    if (!selectedIds.length) return;
    const result = await Swal.fire({
      title: `Mark ${selectedIds.length} booking(s) as ${newStatus}?`,
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
      fetchBookings(pagination.page);
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

  const exportToCSV = () => {
    const csvData = bookings.map((b) => ({
      "Booking ID": b.bookingId,
      "Client Name": b.clientDetails.name,
      "Client Email": b.clientDetails.email,
      "Client Phone": b.clientDetails.phone || "N/A",
      Service: b.selectedService.name,
      Date: new Date(b.selectedDate.date).toLocaleDateString(),
      Time: b.selectedTimeSlot,
      Platform: b.preferredPlatform,
      Status: STATUS_CONFIG[b.status]?.label || b.status,
      "Lead Stage":
        CONVERSION_STATUS_CONFIG[b.conversionStatus]?.label ||
        b.conversionStatus,
      "Lead Score": b.leadScore,
      "Booked At": new Date(b.bookedAt).toLocaleString(),
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
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
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
    if (selectedIds.length === bookings.length) setSelectedIds([]);
    else setSelectedIds(bookings.map((b) => b._id));
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterConversionStatus("all");
    setFilterPlatform("all");
    setSortBy("createdAt_desc");
  };

  const activeFilterCount = [
    filterStatus !== "all",
    filterConversionStatus !== "all",
    filterPlatform !== "all",
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
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <span className={`swm-status-badge swm-status-${cfg.color}`}>
        <Icon size={11} />
        {cfg.label}
      </span>
    );
  };

  const ConversionStatusBadge = ({ status }) => {
    const cfg =
      CONVERSION_STATUS_CONFIG[status] || CONVERSION_STATUS_CONFIG.new;
    const Icon = cfg.icon;
    const colorMap = {
      new: "swm-status-pending",
      contacted: "swm-status-confirmed",
      negotiating: "swm-status-rescheduled",
      converted: "swm-status-completed",
      lost: "swm-status-cancelled",
    };
    return (
      <span className={`swm-status-badge ${colorMap[status]}`}>
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
            <PhoneCall size={22} />
          </div>
          <div>
            <h1 className="swm-title">Book a Call Management</h1>
            <p className="swm-subtitle">
              Manage all scheduled calls and client consultations
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="swm-refresh-btn"
            onClick={() => fetchBookings(pagination.page)}
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
        </div>
      </div>

      {/* Stats Bar */}
      <div className="swm-stats-row">
        {[
          {
            key: "all",
            label: "Total",
            icon: PhoneCall,
            val: pagination.total,
          },
          {
            key: "pending",
            label: "Pending",
            icon: Clock,
            val: stats.pending || 0,
          },
          {
            key: "confirmed",
            label: "Confirmed",
            icon: CheckCircle,
            val: stats.confirmed || 0,
          },
          {
            key: "completed",
            label: "Completed",
            icon: Award,
            val: stats.completed || 0,
          },
          {
            key: "cancelled",
            label: "Cancelled",
            icon: XCircle,
            val: stats.cancelled || 0,
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
            placeholder="Search by name, email, booking ID…"
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
                <label className="swm-filter-label">Lead Stage</label>
                <select
                  className="swm-select swm-filter-select"
                  value={filterConversionStatus}
                  onChange={(e) => setFilterConversionStatus(e.target.value)}
                >
                  <option value="all">All Stages</option>
                  {Object.entries(CONVERSION_STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="swm-filter-section">
                <label className="swm-filter-label">Platform</label>
                <select
                  className="swm-select swm-filter-select"
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                >
                  <option value="all">All Platforms</option>
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
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
              onClick={() => handleBulkStatus("confirmed")}
            >
              <CheckCircle size={13} /> Confirm
            </button>
            <button
              className="swm-bulk-btn archive"
              onClick={() => handleBulkStatus("cancelled")}
            >
              <XCircle size={13} /> Cancel
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

      {/* Bookings Table */}
      <div className="swm-table-container">
        {loading ? (
          <div className="swm-loading">
            <div className="swm-loader"></div>
            <span>Fetching bookings…</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="swm-empty">
            <Inbox size={48} />
            <p>No bookings found</p>
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
                      selectedIds.length === bookings.length &&
                      bookings.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ width: "20%" }}>Client</th>
                <th style={{ width: "15%" }}>Service</th>
                <th style={{ width: "15%" }}>Date & Time</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "10%" }}>Lead Stage</th>
                <th style={{ width: "10%" }}>Score</th>
                <th style={{ width: "10%" }}>Booked</th>
                <th style={{ width: "10%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className={`swm-row ${selectedIds.includes(booking._id) ? "selected-row" : ""}`}
                  onClick={() => openBookingDetails(booking)}
                >
                  <td
                    className="swm-td-check"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="swm-checkbox"
                      checked={selectedIds.includes(booking._id)}
                      onChange={(e) => toggleSelect(booking._id, e)}
                    />
                  </td>
                  <td className="swm-td-sender">
                    <div className="swm-sender-content">
                      <div className="swm-sender-avatar">
                        {booking.clientDetails.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="swm-sender-info">
                        <span className="swm-sender-name">
                          {booking.clientDetails.name}
                        </span>
                        <span className="swm-sender-email">
                          {booking.clientDetails.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="swm-category-tag">
                      {booking.selectedService.name}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontSize: "12px", fontWeight: "500" }}>
                        {new Date(
                          booking.selectedDate.date,
                        ).toLocaleDateString()}
                      </span>
                      <span
                        style={{ fontSize: "11px", color: "var(--swm-text3)" }}
                      >
                        {booking.selectedTimeSlot}
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                  <td>
                    <ConversionStatusBadge status={booking.conversionStatus} />
                  </td>
                  <td className="swm-td-date">
                    <span
                      className="swm-category-tag"
                      style={{ fontWeight: "600" }}
                    >
                      {booking.leadScore || 0}
                    </span>
                  </td>
                  <td className="swm-td-date">
                    <span title={formatFullDate(booking.bookedAt)}>
                      {formatDate(booking.bookedAt)}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="swm-row-actions">
                      <button
                        className="swm-action-btn view"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUpdateModal(booking);
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="swm-action-btn delete"
                        title="Delete"
                        onClick={(e) => handleSingleDelete(booking._id, e)}
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
              onClick={() => fetchBookings(pagination.page - 1)}
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
                  onClick={() => fetchBookings(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="swm-page-btn"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchBookings(pagination.page + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Booking Detail Drawer */}
      {drawerOpen && selectedBooking && (
        <>
          <div className="swm-drawer-backdrop" onClick={closeDrawer} />
          <div className={`swm-drawer ${isDarkMode ? "dark" : "light"}`}>
            <div className="swm-drawer-header">
              <div className="swm-drawer-title-row">
                <h2 className="swm-drawer-title">Booking Details</h2>
                <button className="swm-drawer-close" onClick={closeDrawer}>
                  <X size={18} />
                </button>
              </div>
              <div className="swm-drawer-meta-row">
                <StatusBadge status={selectedBooking.status} />
                <ConversionStatusBadge
                  status={selectedBooking.conversionStatus}
                />
              </div>
            </div>

            <div className="swm-drawer-body">
              {/* Client Information */}
              <div className="swm-detail-card">
                <h4 className="swm-section-heading">
                  <User size={14} /> Client Information
                </h4>
                <div className="swm-detail-row">
                  <User size={14} />
                  <span className="swm-detail-label">Name</span>
                  <span className="swm-detail-val">
                    {selectedBooking.clientDetails.name}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <Mail size={14} />
                  <span className="swm-detail-label">Email</span>
                  <span className="swm-detail-val">
                    {selectedBooking.clientDetails.email}
                  </span>
                </div>
                {selectedBooking.clientDetails.phone && (
                  <div className="swm-detail-row">
                    <Phone size={14} />
                    <span className="swm-detail-label">Phone</span>
                    <span className="swm-detail-val">
                      {selectedBooking.clientDetails.phone}
                    </span>
                  </div>
                )}
                {selectedBooking.clientDetails.company && (
                  <div className="swm-detail-row">
                    <Briefcase size={14} />
                    <span className="swm-detail-label">Company</span>
                    <span className="swm-detail-val">
                      {selectedBooking.clientDetails.company}
                    </span>
                  </div>
                )}
              </div>

              {/* Booking Information */}
              <div className="swm-detail-card">
                <h4 className="swm-section-heading">
                  <CalendarIcon size={14} /> Booking Information
                </h4>
                <div className="swm-detail-row">
                  <Tag size={14} />
                  <span className="swm-detail-label">Booking ID</span>
                  <span className="swm-detail-val swm-monospace">
                    {selectedBooking.bookingId}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <Award size={14} />
                  <span className="swm-detail-label">Service</span>
                  <span className="swm-detail-val">
                    {selectedBooking.selectedService.name}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <CalendarIcon size={14} />
                  <span className="swm-detail-label">Date</span>
                  <span className="swm-detail-val">
                    {formatFullDate(selectedBooking.selectedDate.date)}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <ClockIcon size={14} />
                  <span className="swm-detail-label">Time Slot</span>
                  <span className="swm-detail-val">
                    {selectedBooking.selectedTimeSlot}
                  </span>
                </div>
                <div className="swm-detail-row">
                  <Video size={14} />
                  <span className="swm-detail-label">Platform</span>
                  <span className="swm-detail-val">
                    {selectedBooking.preferredPlatform}
                  </span>
                </div>
                {selectedBooking.meetingLink && (
                  <div className="swm-detail-row">
                    <Globe size={14} />
                    <span className="swm-detail-label">Meeting Link</span>
                    <a
                      href={selectedBooking.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--swm-accent)",
                        textDecoration: "none",
                      }}
                    >
                      {selectedBooking.meetingLink}
                    </a>
                  </div>
                )}
              </div>

              {/* Project Details */}
              {(selectedBooking.projectDetails.budget ||
                selectedBooking.projectDetails.message ||
                selectedBooking.projectDetails.projectDescription) && (
                <div className="swm-detail-card">
                  <h4 className="swm-section-heading">
                    <Briefcase size={14} /> Project Details
                  </h4>
                  {selectedBooking.projectDetails.budget && (
                    <div className="swm-detail-row">
                      <DollarSign size={14} />
                      <span className="swm-detail-label">Budget</span>
                      <span className="swm-detail-val">
                        {selectedBooking.projectDetails.budget}
                      </span>
                    </div>
                  )}
                  {selectedBooking.projectDetails.message && (
                    <div className="swm-detail-row">
                      <MessageSquare size={14} />
                      <span className="swm-detail-label">Message</span>
                      <span className="swm-detail-val">
                        {selectedBooking.projectDetails.message}
                      </span>
                    </div>
                  )}
                  {selectedBooking.projectDetails.projectDescription && (
                    <div className="swm-detail-row">
                      <FileText size={14} />
                      <span className="swm-detail-label">Description</span>
                      <span className="swm-detail-val">
                        {selectedBooking.projectDetails.projectDescription}
                      </span>
                    </div>
                  )}
                  {selectedBooking.projectDetails.hearAbout && (
                    <div className="swm-detail-row">
                      <Globe size={14} />
                      <span className="swm-detail-label">How they heard</span>
                      <span className="swm-detail-val">
                        {selectedBooking.projectDetails.hearAbout}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Call Notes & Feedback */}
              {(selectedBooking.callNotes ||
                selectedBooking.clientFeedback) && (
                <div className="swm-detail-card">
                  <h4 className="swm-section-heading">
                    <MessageSquare size={14} /> Notes & Feedback
                  </h4>
                  {selectedBooking.callNotes && (
                    <div className="swm-detail-row">
                      <span className="swm-detail-label">Call Notes</span>
                      <span className="swm-detail-val">
                        {selectedBooking.callNotes}
                      </span>
                    </div>
                  )}
                  {selectedBooking.clientFeedback && (
                    <div className="swm-detail-row">
                      <span className="swm-detail-label">Client Feedback</span>
                      <span className="swm-detail-val">
                        {selectedBooking.clientFeedback}
                      </span>
                    </div>
                  )}
                  {selectedBooking.rating && (
                    <div className="swm-detail-row">
                      <Star size={14} />
                      <span className="swm-detail-label">Rating</span>
                      <span className="swm-detail-val">
                        {selectedBooking.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
<div className="swm-drawer-actions">
  <h4 className="swm-section-heading">
    <Zap size={14} /> Quick Actions
  </h4>
  <div className="swm-quick-btns">
    <button
      className="swm-quick-btn"
      onClick={() => {
        setUpdateModalOpen(true);
        // Don't close the drawer, keep it open while modal opens
      }}
    >
      <Edit2 size={12} /> Edit Details
    </button>
    <button
      className="swm-quick-btn delete-btn"
      onClick={() => {
        handleSingleDelete(selectedBooking._id, { stopPropagation: () => {} });
        closeDrawer();
      }}
    >
      <Trash2 size={12} /> Delete Booking
    </button>
  </div>
</div>
            </div>
          </div>
        </>
      )}

      {/* Update Modal */}
      {updateModalOpen && selectedBooking && (
        <>
          <div
            className="swm-drawer-backdrop"
            onClick={() => setUpdateModalOpen(false)}
          />
          <div
            className={`swm-drawer ${isDarkMode ? "dark" : "light"}`}
            style={{ maxWidth: "600px" }}
          >
            <div className="swm-drawer-header">
              <div className="swm-drawer-title-row">
                <h2 className="swm-drawer-title">Update Booking</h2>
                <button
                  className="swm-drawer-close"
                  onClick={() => setUpdateModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="swm-drawer-meta-row">
                <span className="swm-category-tag">
                  Booking ID: {selectedBooking.bookingId}
                </span>
              </div>
            </div>

            <div className="swm-drawer-body">
              <div className="swm-message-body">
                <h4 className="swm-section-heading">
                  <CalendarIcon size={14} /> Update Status & Details
                </h4>

                <div className="swm-filter-section">
                  <label className="swm-filter-label">Booking Status</label>
                  <select
                    className="swm-select"
                    value={updateForm.status}
                    onChange={(e) =>
                      setUpdateForm({ ...updateForm, status: e.target.value })
                    }
                    style={{ width: "100%" }}
                  >
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="swm-filter-section">
                  <label className="swm-filter-label">Lead Stage</label>
                  <select
                    className="swm-select"
                    value={updateForm.conversionStatus}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        conversionStatus: e.target.value,
                      })
                    }
                    style={{ width: "100%" }}
                  >
                    {Object.entries(CONVERSION_STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="swm-filter-section">
                  <label className="swm-filter-label">Lead Score (0-100)</label>
                  <input
                    type="number"
                    className="swm-search-input"
                    min="0"
                    max="100"
                    value={updateForm.leadScore}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        leadScore: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="swm-filter-section">
                  <label className="swm-filter-label">Meeting Link</label>
                  <input
                    className="swm-search-input"
                    placeholder="https://meet.google.com/..."
                    value={updateForm.meetingLink}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        meetingLink: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="swm-filter-section">
                  <label className="swm-filter-label">Call Notes</label>
                  <textarea
                    className="swm-reply-input"
                    rows={4}
                    placeholder="Add notes about the call..."
                    value={updateForm.callNotes}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        callNotes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="swm-reply-footer">
                <button
                  className="swm-reply-send-btn"
                  onClick={handleUpdateBooking}
                  disabled={updating}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {updating ? (
                    <span className="swm-btn-loader"></span>
                  ) : (
                    <>
                      <CheckCircle size={13} /> Update Booking
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
