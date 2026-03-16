import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Tag,
  FolderOpen,
  Ticket,
  Briefcase,
  Settings,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Package,
  Eye,
  BarChart2,
  Activity,
  RefreshCw,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Clock,
  Rocket,
  AlertTriangle,
  Globe,
  Mail,
  Phone,
  Star,
  Zap,
  Database,
  Shield,
  Calendar,
  Hash,
  Image,
  Plus,
  ExternalLink,
  ChevronRight,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Circle,
  Layers,
  BookOpen,
  ShoppingCart,
  PercentCircle,
  Award,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Download,
  PieChart,
  LineChart,
  MoreHorizontal,
  Info,
  Sparkles,
  Code2,
  GitBranch,
  Terminal,
  User,
  DownloadCloud,
  UsersRound,
  UserCog,
  CreditCard,
  FileText as FileTextIcon,
  Star as StarIcon,
  MailOpen,
  X,
  Calendar as CalendarIcon,
  MapPin,
  Globe2,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Copy,
  Check,
  EyeOff,
  Eye as EyeIcon,
  Lock,
  Unlock,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Printer,
  FileSpreadsheet,
  FileJson,
  // FileCsv,
  File,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// ─── Token helper ─────────────────────────────────────────────────────────────
const token = () => localStorage.getItem("adminToken");
const swalCfg = (d) => ({
  background: d ? "#0f1117" : "#fff",
  color: d ? "#e2e8f0" : "#1a202c",
  confirmButtonColor: "#6c63ff",
});

// ─── Nav quick links ───────────────────────────────────────────────────────────
const QUICK_LINKS = [
  {
    label: "Products",
    path: "/admin/manage-products",
    icon: ShoppingBag,
    color: "green",
  },
  {
    label: "Blogs",
    path: "/admin/manage-blog",
    icon: FileText,
    color: "amber",
  },
  {
    label: "Projects",
    path: "/admin/manage-projects",
    icon: Briefcase,
    color: "purple",
  },
  {
    label: "Coupons",
    path: "/admin/manage-coupons",
    icon: Ticket,
    color: "cyan",
  },
  {
    label: "Blog Categories",
    path: "/admin/manage-blog-categories",
    icon: FolderOpen,
    color: "rose",
  },
  {
    label: "Product Categories",
    path: "/admin/manage-product-categories",
    icon: Tag,
    color: "indigo",
  },
  {
    label: "Settings",
    path: "/admin/main-settings",
    icon: Settings,
    color: "slate",
  },
];

// ─── Greeting helper ──────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Sparkline mini chart component ───────────────────────────────────────────
const Sparkline = ({ data = [], color = "#6c63ff", height = 36 }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="sdash-sparkline"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(" ")}
      />
      <polygon
        fill={`url(#sg-${color.replace("#", "")})`}
        points={`0,${h} ${pts.join(" ")} ${w},${h}`}
      />
    </svg>
  );
};

// ─── Mini bar chart ────────────────────────────────────────────────────────────
const MiniBar = ({ value, max, color }) => (
  <div className="sdash-minibar-wrap">
    <div
      className="sdash-minibar-fill"
      style={{
        width: `${Math.min(100, (value / (max || 1)) * 100)}%`,
        background: color,
      }}
    />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  change,
  changeDir,
  color,
  sparkData,
  link,
  onClick,
  delay = 0,
}) => {
  const colors = {
    purple: { bg: "rgba(108,99,255,0.12)", icon: "#8b85ff", spark: "#6c63ff" },
    green: { bg: "rgba(16,185,129,0.12)", icon: "#10b981", spark: "#10b981" },
    amber: { bg: "rgba(245,158,11,0.12)", icon: "#f59e0b", spark: "#f59e0b" },
    cyan: { bg: "rgba(34,211,238,0.12)", icon: "#22d3ee", spark: "#22d3ee" },
    rose: { bg: "rgba(239,68,68,0.12)", icon: "#ef4444", spark: "#ef4444" },
    indigo: { bg: "rgba(99,102,241,0.12)", icon: "#818cf8", spark: "#818cf8" },
    blue: { bg: "rgba(59,130,246,0.12)", icon: "#3b82f6", spark: "#3b82f6" },
    orange: { bg: "rgba(249,115,22,0.12)", icon: "#f97316", spark: "#f97316" },
    pink: { bg: "rgba(236,72,153,0.12)", icon: "#ec4899", spark: "#ec4899" },
  };
  const c = colors[color] || colors.purple;

  return (
    <div
      className={`sdash-stat-card ${onClick ? "sdash-stat-card-clickable" : ""}`}
      style={{ "--delay": `${delay}ms` }}
      onClick={onClick}
    >
      <div className="sdash-stat-top">
        <div
          className="sdash-stat-icon"
          style={{ background: c.bg, color: c.icon }}
        >
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <span
            className={`sdash-change ${changeDir === "up" ? "sdash-change-up" : "sdash-change-dn"}`}
          >
            {changeDir === "up" ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {change}%
          </span>
        )}
      </div>
      <div className="sdash-stat-val">{value}</div>
      <div className="sdash-stat-label">{label}</div>
      {sub && <div className="sdash-stat-sub">{sub}</div>}
      {sparkData && <Sparkline data={sparkData} color={c.spark} />}
      {link && !onClick && (
        <Link to={link} className="sdash-stat-link">
          View all <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
};

// ─── Section header ────────────────────────────────────────────────────────────
const SectionHead = ({
  icon: Icon,
  title,
  sub,
  action,
  actionPath,
  onActionClick,
  color = "purple",
}) => (
  <div className="sdash-sec-head">
    <div className="sdash-sec-head-left">
      <div className={`sdash-sec-icon sdash-sec-icon-${color}`}>
        <Icon size={17} />
      </div>
      <div>
        <h2 className="sdash-sec-title">{title}</h2>
        {sub && <p className="sdash-sec-sub">{sub}</p>}
      </div>
    </div>
    {action &&
      (actionPath || onActionClick) &&
      (actionPath ? (
        <Link to={actionPath} className="sdash-sec-action">
          {action} <ChevronRight size={14} />
        </Link>
      ) : (
        <button onClick={onActionClick} className="sdash-sec-action">
          {action} <ChevronRight size={14} />
        </button>
      ))}
  </div>
);

// ─── Status badge ──────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    published: "sdash-badge-green",
    active: "sdash-badge-green",
    completed: "sdash-badge-green",
    draft: "sdash-badge-amber",
    "in-progress": "sdash-badge-amber",
    planned: "sdash-badge-purple",
    inactive: "sdash-badge-slate",
    expired: "sdash-badge-red",
    hidden: "sdash-badge-slate",
    approved: "sdash-badge-green",
    pending: "sdash-badge-amber",
    paid: "sdash-badge-green",
    unpaid: "sdash-badge-amber",
    cancelled: "sdash-badge-red",
    processing: "sdash-badge-blue",
    blocked: "sdash-badge-red",
    subscribed: "sdash-badge-green",
    unsubscribed: "sdash-badge-slate",
  };
  return (
    <span className={`sdash-badge ${map[status] || "sdash-badge-slate"}`}>
      {status}
    </span>
  );
};

// ─── Modal Components ─────────────────────────────────────────────────────────

// Downloads Modal
const DownloadsModal = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="sdash-modal-overlay" onClick={onClose}>
      <div className="sdash-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sdash-modal-header">
          <h2>
            <DownloadCloud size={20} />
            Downloads History
          </h2>
          <button className="sdash-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="sdash-modal-loading">Loading...</div>
        ) : (
          <>
            <div className="sdash-modal-stats">
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Total Downloads</span>
                <span className="sdash-modal-stat-value">
                  {data?.totalCount || 0}
                </span>
              </div>
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Last 30 Days</span>
                <span className="sdash-modal-stat-value">
                  {data?.recentDownloads || 0}
                </span>
              </div>
            </div>

            <div className="sdash-modal-filters">
              <input
                type="text"
                placeholder="Search by file name..."
                className="sdash-modal-search"
              />
              <button className="sdash-modal-export">
                <DownloadIcon size={14} />
                Export CSV
              </button>
            </div>

            <div className="sdash-modal-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Downloaded At</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.downloads?.map((download, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="sdash-user-info">
                          <span className="sdash-user-name">
                            {download.user?.name}
                          </span>
                          <span className="sdash-user-email">
                            {download.user?.email}
                          </span>
                        </div>
                      </td>
                      <td>{download.fileName}</td>
                      <td>{download.fileType}</td>
                      <td>
                        {download.fileSize
                          ? `${(download.fileSize / 1024).toFixed(2)} KB`
                          : "-"}
                      </td>
                      <td>{new Date(download.createdAt).toLocaleString()}</td>
                      <td>{download.ipAddress || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Users Modal
const UsersModal = ({ isOpen, onClose, data, loading, onToggleBlock }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  if (!isOpen) return null;

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  if (showUserDetails && selectedUser) {
    return (
      <div
        className="sdash-modal-overlay"
        onClick={() => setShowUserDetails(false)}
      >
        <div
          className="sdash-modal-content sdash-modal-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sdash-modal-header">
            <h2>
              <User size={20} />
              User Details: {selectedUser.name}
            </h2>
            <button
              className="sdash-modal-close"
              onClick={() => setShowUserDetails(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="sdash-user-details">
            <div className="sdash-user-details-header">
              <div className="sdash-user-avatar-large">
                {selectedUser.avatar?.url ? (
                  <img src={selectedUser.avatar.url} alt={selectedUser.name} />
                ) : (
                  <User size={32} />
                )}
              </div>
              <div className="sdash-user-details-info">
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
                <div className="sdash-user-details-badges">
                  <Badge
                    status={selectedUser.isActive ? "active" : "inactive"}
                  />
                  {selectedUser.isBlocked && <Badge status="blocked" />}
                  {selectedUser.emailVerified && <Badge status="verified" />}
                </div>
              </div>
            </div>

            <div className="sdash-user-details-stats">
              <div className="sdash-detail-stat">
                <span className="sdash-detail-stat-label">Downloads</span>
                <span className="sdash-detail-stat-value">
                  {selectedUser.downloadCount || 0}
                </span>
              </div>
              <div className="sdash-detail-stat">
                <span className="sdash-detail-stat-label">Orders</span>
                <span className="sdash-detail-stat-value">
                  {selectedUser.orderCount || 0}
                </span>
              </div>
              <div className="sdash-detail-stat">
                <span className="sdash-detail-stat-label">Reviews</span>
                <span className="sdash-detail-stat-value">
                  {selectedUser.reviewCount || 0}
                </span>
              </div>
              <div className="sdash-detail-stat">
                <span className="sdash-detail-stat-label">Last Login</span>
                <span className="sdash-detail-stat-value">
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>

            <div className="sdash-user-details-actions">
              <button
                className={`sdash-user-action-btn ${selectedUser.isBlocked ? "sdash-user-unblock" : "sdash-user-block"}`}
                onClick={() => onToggleBlock(selectedUser)}
              >
                {selectedUser.isBlocked ? (
                  <Unlock size={14} />
                ) : (
                  <Lock size={14} />
                )}
                {selectedUser.isBlocked ? "Unblock User" : "Block User"}
              </button>
              <button className="sdash-user-action-btn sdash-user-view-orders">
                <ShoppingCart size={14} />
                View Orders
              </button>
              <button className="sdash-user-action-btn sdash-user-view-downloads">
                <DownloadCloud size={14} />
                View Downloads
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sdash-modal-overlay" onClick={onClose}>
      <div
        className="sdash-modal-content sdash-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sdash-modal-header">
          <h2>
            <UsersRound size={20} />
            Users Management
          </h2>
          <button className="sdash-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="sdash-modal-loading">Loading...</div>
        ) : (
          <>
            <div className="sdash-modal-stats">
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Total Users</span>
                <span className="sdash-modal-stat-value">
                  {data?.pagination?.total || 0}
                </span>
              </div>
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Online Now</span>
                <span className="sdash-modal-stat-value">
                  {data?.onlineUsers || 0}
                </span>
              </div>
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Active (30d)</span>
                <span className="sdash-modal-stat-value">
                  {data?.activeUsers || 0}
                </span>
              </div>
            </div>

            <div className="sdash-modal-filters">
              <div className="sdash-filter-group">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="sdash-modal-search"
                />
                <select className="sdash-modal-select">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <button className="sdash-modal-export">
                <DownloadIcon size={14} />
                Export CSV
              </button>
            </div>

            <div className="sdash-modal-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.map((user, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleUserClick(user)}
                      className="sdash-clickable-row"
                    >
                      <td>
                        <div className="sdash-user-info">
                          <div className="sdash-user-avatar-small">
                            {user.avatar?.url ? (
                              <img src={user.avatar.url} alt={user.name} />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div>
                            <span className="sdash-user-name">{user.name}</span>
                            <span className="sdash-user-email">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td>
                        <Badge
                          status={
                            user.isBlocked
                              ? "blocked"
                              : user.isActive
                                ? "active"
                                : "inactive"
                          }
                        />
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td>
                        <button className="sdash-table-action-btn">
                          <MoreHorizontal size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Payments Modal
const PaymentsModal = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="sdash-modal-overlay" onClick={onClose}>
      <div
        className="sdash-modal-content sdash-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sdash-modal-header">
          <h2>
            <CreditCard size={20} />
            Payments
          </h2>
          <button className="sdash-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="sdash-modal-loading">Loading...</div>
        ) : (
          <>
            <div className="sdash-modal-stats">
              {data?.stats?.map((stat, idx) => (
                <div className="sdash-modal-stat" key={idx}>
                  <span className="sdash-modal-stat-label">{stat._id}</span>
                  <span className="sdash-modal-stat-value">
                    ₹{stat.total.toLocaleString()} ({stat.count})
                  </span>
                </div>
              ))}
            </div>

            <div className="sdash-modal-filters">
              <div className="sdash-filter-group">
                <input
                  type="text"
                  placeholder="Search by transaction ID..."
                  className="sdash-modal-search"
                />
                <select className="sdash-modal-select">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <button className="sdash-modal-export">
                <DownloadIcon size={14} />
                Export CSV
              </button>
            </div>

            <div className="sdash-modal-table">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.payments?.map((payment, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="sdash-code-mono">
                          {payment.transactionId || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="sdash-user-info">
                          <span className="sdash-user-name">
                            {payment.order?.user?.name}
                          </span>
                          <span className="sdash-user-email">
                            {payment.order?.user?.email}
                          </span>
                        </div>
                      </td>
                      <td>₹{payment.amount.toLocaleString()}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>
                        <Badge status={payment.status} />
                      </td>
                      <td>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Reviews Modal
const ReviewsModal = ({
  isOpen,
  onClose,
  data,
  loading,
  onApprove,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="sdash-modal-overlay" onClick={onClose}>
      <div
        className="sdash-modal-content sdash-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sdash-modal-header">
          <h2>
            <StarIcon size={20} />
            Product Reviews
          </h2>
          <button className="sdash-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="sdash-modal-loading">Loading...</div>
        ) : (
          <>
            <div className="sdash-modal-stats">
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Total Reviews</span>
                <span className="sdash-modal-stat-value">
                  {data?.totalReviews || 0}
                </span>
              </div>
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Approved</span>
                <span className="sdash-modal-stat-value">
                  {data?.approvedReviews || 0}
                </span>
              </div>
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Pending</span>
                <span className="sdash-modal-stat-value">
                  {data?.pendingReviews || 0}
                </span>
              </div>
            </div>

            <div className="sdash-modal-filters">
              <div className="sdash-filter-group">
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="sdash-modal-search"
                />
                <select className="sdash-modal-select">
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="sdash-modal-reviews">
              {data?.reviews?.map((review, idx) => (
                <div className="sdash-review-card" key={idx}>
                  <div className="sdash-review-header">
                    <div className="sdash-review-user">
                      <div className="sdash-review-user-avatar">
                        {review.user?.avatar?.url ? (
                          <img
                            src={review.user.avatar.url}
                            alt={review.user.name}
                          />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <div>
                        <span className="sdash-review-user-name">
                          {review.user?.name}
                        </span>
                        <span className="sdash-review-product">
                          on {review.product?.name}
                        </span>
                      </div>
                    </div>
                    <div className="sdash-review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < review.rating ? "#f59e0b" : "none"}
                          color={i < review.rating ? "#f59e0b" : "#666"}
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="sdash-review-title">{review.title}</h4>
                  )}
                  <p className="sdash-review-comment">{review.comment}</p>
                  <div className="sdash-review-footer">
                    <Badge
                      status={review.isApproved ? "approved" : "pending"}
                    />
                    <span className="sdash-review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <div className="sdash-review-actions">
                      {!review.isApproved && (
                        <button
                          className="sdash-review-approve"
                          onClick={() => onApprove(review)}
                        >
                          <Check size={12} />
                          Approve
                        </button>
                      )}
                      <button
                        className="sdash-review-delete"
                        onClick={() => onDelete(review)}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Newsletter Modal
const NewsletterModal = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="sdash-modal-overlay" onClick={onClose}>
      <div
        className="sdash-modal-content sdash-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sdash-modal-header">
          <h2>
            <MailOpen size={20} />
            Newsletter Subscribers
          </h2>
          <button className="sdash-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="sdash-modal-loading">Loading...</div>
        ) : (
          <>
            <div className="sdash-modal-stats">
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">
                  Total Subscribers
                </span>
                <span className="sdash-modal-stat-value">
                  {data?.totalNewsletterSubs || 0}
                </span>
              </div>
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Recent (30d)</span>
                <span className="sdash-modal-stat-value">
                  {data?.recentNewsletterSubs || 0}
                </span>
              </div>
            </div>

            <div className="sdash-modal-filters">
              <div className="sdash-filter-group">
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  className="sdash-modal-search"
                />
                <select className="sdash-modal-select">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>
              <button className="sdash-modal-export">
                <DownloadIcon size={14} />
                Export CSV
              </button>
            </div>

            <div className="sdash-modal-table">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Subscribed At</th>
                    <th>Unsubscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.subscribers?.map((sub, idx) => (
                    <tr key={idx}>
                      <td>{sub.email}</td>
                      <td>{sub.name || "-"}</td>
                      <td>
                        <Badge
                          status={sub.isActive ? "subscribed" : "unsubscribed"}
                        />
                      </td>
                      <td>
                        {new Date(
                          sub.subscribedAt || sub.createdAt,
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {sub.unsubscribedAt
                          ? new Date(sub.unsubscribedAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Invoices Modal
const InvoicesModal = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="sdash-modal-overlay" onClick={onClose}>
      <div
        className="sdash-modal-content sdash-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sdash-modal-header">
          <h2>
            <FileTextIcon size={20} />
            Invoices
          </h2>
          <button className="sdash-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="sdash-modal-loading">Loading...</div>
        ) : (
          <>
            <div className="sdash-modal-stats">
              {data?.stats?.map((stat, idx) => (
                <div className="sdash-modal-stat" key={idx}>
                  <span className="sdash-modal-stat-label">{stat._id}</span>
                  <span className="sdash-modal-stat-value">
                    ₹{stat.total.toLocaleString()} ({stat.count})
                  </span>
                </div>
              ))}
            </div>

            <div className="sdash-modal-filters">
              <div className="sdash-filter-group">
                <input
                  type="text"
                  placeholder="Search by invoice number..."
                  className="sdash-modal-search"
                />
                <select className="sdash-modal-select">
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button className="sdash-modal-export">
                <DownloadIcon size={14} />
                Export CSV
              </button>
            </div>

            <div className="sdash-modal-table">
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Issued Date</th>
                    <th>Paid Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.invoices?.map((invoice, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="sdash-code-mono">
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td>
                        <div className="sdash-user-info">
                          <span className="sdash-user-name">
                            {invoice.order?.user?.name}
                          </span>
                          <span className="sdash-user-email">
                            {invoice.order?.user?.email}
                          </span>
                        </div>
                      </td>
                      <td>₹{invoice.amount.toLocaleString()}</td>
                      <td>
                        <Badge status={invoice.status} />
                      </td>
                      <td>
                        {new Date(
                          invoice.issuedAt || invoice.createdAt,
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {invoice.paidAt
                          ? new Date(invoice.paidAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="sdash-table-action-btn"
                          title="Download PDF"
                        >
                          <File size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Admins Modal
const AdminsModal = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="sdash-modal-overlay" onClick={onClose}>
      <div
        className="sdash-modal-content sdash-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sdash-modal-header">
          <h2>
            <UserCog size={20} />
            Admin Management
          </h2>
          <button className="sdash-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="sdash-modal-loading">Loading...</div>
        ) : (
          <>
            <div className="sdash-modal-stats">
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Total Admins</span>
                <span className="sdash-modal-stat-value">
                  {data?.pagination?.total || 0}
                </span>
              </div>
              <div className="sdash-modal-stat">
                <span className="sdash-modal-stat-label">Online Now</span>
                <span className="sdash-modal-stat-value">
                  {data?.onlineAdmins || 0}
                </span>
              </div>
            </div>

            <div className="sdash-modal-filters">
              <input
                type="text"
                placeholder="Search admins..."
                className="sdash-modal-search"
              />
              <Link to="/admin/register" className="sdash-modal-add-btn">
                <Plus size={14} />
                Add Admin
              </Link>
            </div>

            <div className="sdash-modal-table">
              <table>
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>2FA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.admins?.map((admin, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="sdash-user-info">
                          <span className="sdash-user-name">{admin.name}</span>
                          <span className="sdash-user-email">
                            {admin.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Badge
                          status={
                            admin.role === "superadmin" ? "admin" : "active"
                          }
                        />
                      </td>
                      <td>
                        <Badge
                          status={admin.isActive ? "active" : "inactive"}
                        />
                      </td>
                      <td>
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td>
                        {admin.twoFactorEnabled ? (
                          <CheckCircle
                            size={14}
                            className="sdash-success-icon"
                          />
                        ) : (
                          <XCircle size={14} className="sdash-error-icon" />
                        )}
                      </td>
                      <td>
                        <button className="sdash-table-action-btn">
                          <MoreHorizontal size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const AdminDashboardWrapper = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const tickRef = useRef(null);

  // Modal states
  const [showDownloadsModal, setShowDownloadsModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showAdminsModal, setShowAdminsModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Live clock
  useEffect(() => {
    tickRef.current = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  // ── Fetch all dashboard data ──
  const fetchDashboard = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const headers = {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        };

        console.log("Fetching dashboard data...");

        const [
          statsRes,
          productsRes,
          blogsRes,
          projectsRes,
          couponsRes,
          blogCatsRes,
          prodCatsRes,
          projectCatsRes,
          newsletterRes,
          reviewsRes,
          downloadsRes,
          usersRes,
          adminsRes,
          paymentsRes,
          invoicesRes,
          settingsRes,
        ] = await Promise.allSettled([
          fetch("/api/admin/dashboard/stats", { headers }),
          fetch("/api/admin/products?limit=5&sortBy=createdAt&sortOrder=desc", {
            headers,
          }),
          fetch("/api/admin/blogs?limit=5&sortBy=createdAt&sortOrder=desc", {
            headers,
          }),
          fetch("/api/admin/projects?limit=6&sortBy=createdAt&sortOrder=desc", {
            headers,
          }),
          fetch("/api/admin/coupons?limit=5&sortBy=createdAt&sortOrder=desc", {
            headers,
          }),
          fetch("/api/admin/blogs/categories?limit=50", { headers }),
          fetch("/api/admin/products/categories?limit=50", { headers }),
          fetch("/api/admin/project-categories?limit=50", { headers }),
          fetch("/api/admin/newsletter-subscribers?limit=5", { headers }),
          fetch("/api/admin/reviews?limit=5&status=pending", { headers }),
          fetch("/api/admin/downloads?limit=5", { headers }),
          fetch("/api/admin/users?limit=5", { headers }),
          fetch("/api/admin/admins-users?limit=5", { headers }),
          fetch("/api/admin/payments?limit=5", { headers }),
          fetch("/api/admin/invoices?limit=5", { headers }),
          fetch("/api/admin/main-settings", { headers }),
        ]);

        const [
          statsResult,
          productsResult,
          blogsResult,
          projectsResult,
          couponsResult,
          blogCatsResult,
          prodCatsResult,
          projectCatsResult,
          newsletterResult,
          reviewsResult,
          downloadsResult,
          usersResult,
          adminsResult,
          paymentsResult,
          invoicesResult,
          settingsResult,
        ] = await Promise.all([
          statsRes.status === "fulfilled"
            ? statsRes.value.json()
            : { data: {} },
          productsRes.status === "fulfilled"
            ? productsRes.value.json()
            : { data: [] },
          blogsRes.status === "fulfilled"
            ? blogsRes.value.json()
            : { data: [] },
          projectsRes.status === "fulfilled"
            ? projectsRes.value.json()
            : { data: [] },
          couponsRes.status === "fulfilled"
            ? couponsRes.value.json()
            : { data: [] },
          blogCatsRes.status === "fulfilled"
            ? blogCatsRes.value.json()
            : { data: [] },
          prodCatsRes.status === "fulfilled"
            ? prodCatsRes.value.json()
            : { data: [] },
          projectCatsRes.status === "fulfilled"
            ? projectCatsRes.value.json()
            : { data: [] },
          newsletterRes.status === "fulfilled"
            ? newsletterRes.value.json()
            : { data: [] },
          reviewsRes.status === "fulfilled"
            ? reviewsRes.value.json()
            : { data: [] },
          downloadsRes.status === "fulfilled"
            ? downloadsRes.value.json()
            : { data: { downloads: [] } },
          usersRes.status === "fulfilled"
            ? usersRes.value.json()
            : { data: { users: [] } },
          adminsRes.status === "fulfilled"
            ? adminsRes.value.json()
            : { data: { admins: [] } },
          paymentsRes.status === "fulfilled"
            ? paymentsRes.value.json()
            : { data: { payments: [] } },
          invoicesRes.status === "fulfilled"
            ? invoicesRes.value.json()
            : { data: { invoices: [] } },
          settingsRes.status === "fulfilled"
            ? settingsRes.value.json()
            : { data: {} },
        ]);

        setData({
          stats: statsResult.data || {},
          products: (productsResult.data || []).slice(0, 5),
          blogs: (blogsResult.data || []).slice(0, 5),
          projects: (projectsResult.data || []).slice(0, 6),
          coupons: (couponsResult.data || []).slice(0, 5),
          blogCats: blogCatsResult.data || [],
          prodCats: prodCatsResult.data || [],
          projectCats: projectCatsResult.data || [],
          newsletter: newsletterResult.data || [],
          reviews: reviewsResult.data || [],
          downloads: downloadsResult.data || { downloads: [] },
          users: usersResult.data || { users: [] },
          admins: adminsResult.data || { admins: [] },
          payments: paymentsResult.data || { payments: [] },
          invoices: invoicesResult.data || { invoices: [] },
          settings: settingsResult.data || {},
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load dashboard data.",
          icon: "error",
          ...swalCfg(isDarkMode),
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isDarkMode],
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ── Modal data fetch functions ──
  const fetchDownloadsDetails = async () => {
    setModalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const res = await fetch("/api/admin/downloads?limit=100", { headers });
      const data = await res.json();
      setModalData(data.data);
      setShowDownloadsModal(true);
    } catch (error) {
      console.error("Failed to fetch downloads:", error);
      Swal.fire("Error", "Failed to load download details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchUsersDetails = async () => {
    setModalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const res = await fetch("/api/admin/users?limit=100", { headers });
      const data = await res.json();
      setModalData(data.data);
      setShowUsersModal(true);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Swal.fire("Error", "Failed to load user details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchAdminsDetails = async () => {
    setModalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const res = await fetch("/api/admin/admins/list?limit=100", { headers });
      const data = await res.json();
      setModalData(data.data);
      setShowAdminsModal(true);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      Swal.fire("Error", "Failed to load admin details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchPaymentsDetails = async () => {
    setModalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const res = await fetch("/api/admin/payments?limit=100", { headers });
      const data = await res.json();
      setModalData(data.data);
      setShowPaymentsModal(true);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      Swal.fire("Error", "Failed to load payment details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchInvoicesDetails = async () => {
    setModalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const res = await fetch("/api/admin/invoices?limit=100", { headers });
      const data = await res.json();
      setModalData(data.data);
      setShowInvoicesModal(true);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      Swal.fire("Error", "Failed to load invoice details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchReviewsDetails = async () => {
    setModalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const res = await fetch("/api/admin/reviews?limit=100", { headers });
      const data = await res.json();
      setModalData(data.data);
      setShowReviewsModal(true);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      Swal.fire("Error", "Failed to load review details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchNewsletterDetails = async () => {
    setModalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const res = await fetch("/api/admin/newsletter-subscribers?limit=100", {
        headers,
      });
      const data = await res.json();
      setModalData(data.data);
      setShowNewsletterModal(true);
    } catch (error) {
      console.error("Failed to fetch newsletter subscribers:", error);
      Swal.fire("Error", "Failed to load newsletter details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      const result = await Swal.fire({
        title: user.isBlocked ? "Unblock User?" : "Block User?",
        text: user.isBlocked
          ? `Are you sure you want to unblock ${user.name}?`
          : `Are you sure you want to block ${user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: user.isBlocked ? "#10b981" : "#ef4444",
        confirmButtonText: user.isBlocked ? "Yes, unblock" : "Yes, block",
        ...swalCfg(isDarkMode),
      });

      if (result.isConfirmed) {
        const headers = {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json",
        };
        const res = await fetch(`/api/admin/users/${user._id}/toggle-block`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ block: !user.isBlocked }),
        });

        if (res.ok) {
          Swal.fire(
            "Success",
            user.isBlocked
              ? "User unblocked successfully"
              : "User blocked successfully",
            "success",
          );
          fetchUsersDetails(); // Refresh data
        } else {
          throw new Error("Failed to update user status");
        }
      }
    } catch (error) {
      console.error("Toggle block error:", error);
      Swal.fire("Error", "Failed to update user status", "error");
    }
  };

  const handleApproveReview = async (review) => {
    try {
      const headers = {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
      };
      const res = await fetch(`/api/admin/reviews/${review._id}/approve`, {
        method: "PATCH",
        headers,
      });

      if (res.ok) {
        Swal.fire("Success", "Review approved successfully", "success");
        fetchReviewsDetails(); // Refresh data
      } else {
        throw new Error("Failed to approve review");
      }
    } catch (error) {
      console.error("Approve review error:", error);
      Swal.fire("Error", "Failed to approve review", "error");
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      const result = await Swal.fire({
        title: "Delete Review?",
        text: "Are you sure you want to delete this review?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete",
        ...swalCfg(isDarkMode),
      });

      if (result.isConfirmed) {
        const headers = { Authorization: `Bearer ${token()}` };
        const res = await fetch(`/api/admin/reviews/${review._id}`, {
          method: "DELETE",
          headers,
        });

        if (res.ok) {
          Swal.fire("Success", "Review deleted successfully", "success");
          fetchReviewsDetails(); // Refresh data
        } else {
          throw new Error("Failed to delete review");
        }
      }
    } catch (error) {
      console.error("Delete review error:", error);
      Swal.fire("Error", "Failed to delete review", "error");
    }
  };

  // ── Derived stats ──
  const derived = React.useMemo(() => {
    if (!data) return {};
    const s = data.stats || {};
    return {
      // Core stats
      totalProducts: s.totalProducts ?? data.products?.length ?? 0,
      publishedProducts:
        s.publishedProducts ??
        data.products?.filter((p) => p.isPublished)?.length ??
        0,
      totalBlogs: s.totalBlogs ?? data.blogs?.length ?? 0,
      publishedBlogs:
        s.publishedBlogs ??
        data.blogs?.filter((b) => b.isPublished)?.length ??
        0,
      totalProjects: s.totalProjects ?? data.projects?.length ?? 0,
      completedProjects:
        s.completedProjects ??
        data.projects?.filter((p) => p.status === "completed")?.length ??
        0,
      totalCoupons: s.totalCoupons ?? data.coupons?.length ?? 0,
      activeCoupons:
        s.activeCoupons ?? data.coupons?.filter((c) => c.isActive)?.length ?? 0,

      // Categories
      totalBlogCats: s.totalBlogCats ?? data.blogCats?.length ?? 0,
      totalProdCats: s.totalProdCats ?? data.prodCats?.length ?? 0,
      totalProjectCats: s.totalProjectCats ?? data.projectCats?.length ?? 0,

      // Newsletter
      totalNewsletterSubs:
        s.totalNewsletterSubs ?? data.newsletter?.length ?? 0,
      recentNewsletterSubs: s.recentNewsletterSubs ?? 0,

      // Reviews
      totalReviews: s.totalReviews ?? 0,
      approvedReviews: s.approvedReviews ?? 0,
      pendingReviews: s.pendingReviews ?? 0,

      // Users & Admins
      totalUsers: s.totalUsers ?? 0,
      activeUsers: s.activeUsers ?? 0,
      totalAdmins: s.totalAdmins ?? 0,
      activeAdmins: s.activeAdmins ?? 0,

      // Downloads
      totalDownloads: s.totalDownloads ?? 0,
      recentDownloads: s.recentDownloads ?? 0,

      // Orders & Revenue
      totalOrders: s.totalOrders ?? 0,
      completedOrders: s.completedOrders ?? 0,
      totalPayments: s.totalPayments ?? 0,
      completedPayments: s.completedPayments ?? 0,
      totalInvoices: s.totalInvoices ?? 0,
      paidInvoices: s.paidInvoices ?? 0,
      totalRevenue: s.totalRevenue ?? 0,

      // Sparklines
      revenueSparkline: s.revenueSparkline ?? [
        4, 7, 5, 9, 6, 11, 8, 13, 10, 14, 12, 16,
      ],
      ordersSparkline: s.ordersSparkline ?? [
        2, 4, 3, 6, 5, 7, 4, 8, 6, 9, 7, 10,
      ],
      visitorSparkline: s.visitorSparkline ?? [
        10, 14, 12, 18, 15, 20, 17, 22, 19, 24, 21, 26,
      ],
    };
  }, [data]);

  const adminName = data?.settings?.appName || "Shivam";

  if (loading) {
    return (
      <div className={`sdash-root ${isDarkMode ? "dark" : "light"}`}>
        <div className="sdash-loading-screen">
          <div className="sdash-loading-logo">
            <LayoutDashboard size={32} />
          </div>
          <div className="sdash-loading-ring" />
          <p className="sdash-loading-text">Loading Dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`sdash-root ${isDarkMode ? "dark" : "light"}`}>
      {/* Ambient Background */}
      <div className="sdash-ambient" aria-hidden="true">
        <div className="sdash-orb sdash-orb-1" />
        <div className="sdash-orb sdash-orb-2" />
        <div className="sdash-orb sdash-orb-3" />
        <div className="sdash-grid-lines" />
      </div>

      {/* Modals */}
      <DownloadsModal
        isOpen={showDownloadsModal}
        onClose={() => setShowDownloadsModal(false)}
        data={modalData}
        loading={modalLoading}
      />

      <UsersModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        data={modalData}
        loading={modalLoading}
        onToggleBlock={handleToggleBlock}
      />

      <AdminsModal
        isOpen={showAdminsModal}
        onClose={() => setShowAdminsModal(false)}
        data={modalData}
        loading={modalLoading}
      />

      <PaymentsModal
        isOpen={showPaymentsModal}
        onClose={() => setShowPaymentsModal(false)}
        data={modalData}
        loading={modalLoading}
      />

      <InvoicesModal
        isOpen={showInvoicesModal}
        onClose={() => setShowInvoicesModal(false)}
        data={modalData}
        loading={modalLoading}
      />

      <ReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        data={modalData}
        loading={modalLoading}
        onApprove={handleApproveReview}
        onDelete={handleDeleteReview}
      />

      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
        data={modalData}
        loading={modalLoading}
      />

      {/* TOPBAR */}
      <header className="sdash-topbar">
        <div className="sdash-topbar-left">
          <div className="sdash-logo">
            <div className="sdash-logo-icon">
              <Code2 size={18} />
            </div>
            <span className="sdash-logo-text">
              Shivam<strong>Stack</strong>
            </span>
          </div>
          <div className="sdash-topbar-divider" />
          <nav className="sdash-topbar-tabs" aria-label="Dashboard tabs">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "content", label: "Content", icon: Layers },
              { id: "commerce", label: "Commerce", icon: ShoppingCart },
              { id: "portfolio", label: "Portfolio", icon: Briefcase },
              { id: "users", label: "Users", icon: UsersRound },
              { id: "analytics", label: "Analytics", icon: BarChart2 },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`sdash-tab-btn ${activeTab === tab.id ? "sdash-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sdash-topbar-right">
          <div className="sdash-live-clock">
            <Circle size={7} className="sdash-clock-dot" />
            {time.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <button
            className={`sdash-refresh-btn ${refreshing ? "sdash-refreshing" : ""}`}
            onClick={() => fetchDashboard(true)}
            title="Refresh data"
          >
            <RefreshCw size={15} />
          </button>
          <Link
            to="/admin/main-settings"
            className="sdash-topbar-settings"
            title="Settings"
          >
            <Settings size={16} />
          </Link>
          <div className="sdash-admin-pill">
            <div className="sdash-admin-avatar">
              <User size={14} />
            </div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      {/* HERO GREETING */}
      <section className="sdash-hero">
        <div className="sdash-hero-text">
          <div className="sdash-hero-eyebrow">
            <Sparkles size={13} />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="sdash-hero-title">
            {getGreeting()},{" "}
            <span className="sdash-hero-name">{adminName}</span> 👋
          </h1>
          <p className="sdash-hero-sub">
            Here's what's happening with your portfolio platform today.
          </p>
        </div>
        <div className="sdash-hero-quick">
          {QUICK_LINKS.map((ql) => (
            <Link
              key={ql.label}
              to={ql.path}
              className={`sdash-quick-chip sdash-chip-${ql.color}`}
            >
              <ql.icon size={13} />
              {ql.label}
            </Link>
          ))}
        </div>
      </section>

      {/* MAINTENANCE MODE ALERT */}
      {data?.settings?.security?.isMaintenanceMode && (
        <div className="sdash-maintenance-banner">
          <AlertTriangle size={16} />
          <div>
            <strong>Maintenance Mode is ON</strong>
            <span>
              {" "}
              — Your site is currently hidden from visitors.{" "}
              {data.settings.security.maintenanceMessage}
            </span>
          </div>
          <Link to="/admin/main-settings" className="sdash-maint-link">
            Fix in Settings <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="sdash-main">
        {/* ── OVERVIEW TAB ──────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            {/* Primary KPI cards */}
            <div className="sdash-kpi-grid">
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`₹${(derived.totalRevenue || 0).toLocaleString()}`}
                change={12.5}
                changeDir="up"
                color="green"
                sparkData={derived.revenueSparkline}
                sub="All-time earnings"
                link="/admin/orders"
                delay={0}
              />
              <StatCard
                icon={ShoppingCart}
                label="Total Orders"
                value={derived.totalOrders}
                change={8.3}
                changeDir="up"
                color="purple"
                sparkData={derived.ordersSparkline}
                sub={`${derived.completedOrders} completed`}
                link="/admin/orders"
                delay={60}
              />
              <StatCard
                icon={Users}
                label="Total Users"
                value={derived.totalUsers}
                sub={`${derived.activeUsers} active`}
                color="blue"
                onClick={fetchUsersDetails}
                delay={120}
              />
              <StatCard
                icon={UserCog}
                label="Total Admins"
                value={derived.totalAdmins}
                sub={`${derived.activeAdmins} online`}
                color="orange"
                onClick={fetchAdminsDetails}
                delay={180}
              />
              <StatCard
                icon={DownloadCloud}
                label="Total Downloads"
                value={derived.totalDownloads}
                sub={`${derived.recentDownloads} this month`}
                color="cyan"
                onClick={fetchDownloadsDetails}
                delay={240}
              />
              <StatCard
                icon={StarIcon}
                label="Product Reviews"
                value={derived.totalReviews}
                sub={`${derived.pendingReviews} pending`}
                color="amber"
                onClick={fetchReviewsDetails}
                delay={300}
              />
            </div>

            {/* Secondary stats row */}
            <div className="sdash-secondary-row">
              {[
                {
                  icon: MailOpen,
                  label: "Newsletter Subs",
                  val: derived.totalNewsletterSubs,
                  total: null,
                  sub: `${derived.recentNewsletterSubs} new`,
                  path: null,
                  onClick: fetchNewsletterDetails,
                  color: "#22d3ee",
                },
                {
                  icon: CreditCard,
                  label: "Payments",
                  val: derived.totalPayments,
                  total: null,
                  sub: `${derived.completedPayments} completed`,
                  path: null,
                  onClick: fetchPaymentsDetails,
                  color: "#10b981",
                },
                {
                  icon: FileTextIcon,
                  label: "Invoices",
                  val: derived.totalInvoices,
                  total: null,
                  sub: `${derived.paidInvoices} paid`,
                  path: null,
                  onClick: fetchInvoicesDetails,
                  color: "#8b85ff",
                },
                {
                  icon: Ticket,
                  label: "Active Coupons",
                  val: derived.activeCoupons,
                  total: derived.totalCoupons,
                  sub: null,
                  path: "/admin/manage-coupons",
                  color: "#f59e0b",
                },
                {
                  icon: FolderOpen,
                  label: "Blog Categories",
                  val: derived.totalBlogCats,
                  total: null,
                  sub: null,
                  path: "/admin/manage-blog-categories",
                  color: "#ec4899",
                },
                {
                  icon: Tag,
                  label: "Product Categories",
                  val: derived.totalProdCats,
                  total: null,
                  sub: null,
                  path: "/admin/manage-product-categories",
                  color: "#3b82f6",
                },
                {
                  icon: Briefcase,
                  label: "Project Categories",
                  val: derived.totalProjectCats,
                  total: null,
                  sub: null,
                  path: "/admin/manage-project-categories",
                  color: "#8b5cf6",
                },
                {
                  icon: BarChart2,
                  label: "Published Rate",
                  val: `${derived.totalBlogs > 0 ? Math.round((derived.publishedBlogs / derived.totalBlogs) * 100) : 0}%`,
                  total: null,
                  sub: null,
                  path: "/admin/manage-blog",
                  color: "#6c63ff",
                },
              ].map((item, i) =>
                item.onClick ? (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="sdash-sec-stat sdash-sec-stat-clickable"
                  >
                    <div
                      className="sdash-sec-stat-icon"
                      style={{
                        color: item.color,
                        background: `${item.color}18`,
                      }}
                    >
                      <item.icon size={16} />
                    </div>
                    <div className="sdash-sec-stat-body">
                      <span
                        className="sdash-sec-stat-val"
                        style={{ color: item.color }}
                      >
                        {item.val}
                      </span>
                      {item.total !== null && (
                        <span className="sdash-sec-stat-total">
                          {" "}
                          / {item.total}
                        </span>
                      )}
                      <p className="sdash-sec-stat-lbl">{item.label}</p>
                      {item.sub && (
                        <span className="sdash-sec-stat-sub">{item.sub}</span>
                      )}
                    </div>
                    <ArrowUpRight size={14} className="sdash-sec-stat-arrow" />
                  </button>
                ) : (
                  <Link key={i} to={item.path} className="sdash-sec-stat">
                    <div
                      className="sdash-sec-stat-icon"
                      style={{
                        color: item.color,
                        background: `${item.color}18`,
                      }}
                    >
                      <item.icon size={16} />
                    </div>
                    <div className="sdash-sec-stat-body">
                      <span
                        className="sdash-sec-stat-val"
                        style={{ color: item.color }}
                      >
                        {item.val}
                      </span>
                      {item.total !== null && (
                        <span className="sdash-sec-stat-total">
                          {" "}
                          / {item.total}
                        </span>
                      )}
                      <p className="sdash-sec-stat-lbl">{item.label}</p>
                      {item.sub && (
                        <span className="sdash-sec-stat-sub">{item.sub}</span>
                      )}
                    </div>
                    <ArrowUpRight size={14} className="sdash-sec-stat-arrow" />
                  </Link>
                ),
              )}
            </div>

            {/* Site Info snapshot */}
            {data?.settings?.companyName && (
              <div className="sdash-site-snapshot">
                <div className="sdash-snapshot-brand">
                  {data.settings.branding?.logoUrl ? (
                    <img
                      src={data.settings.branding.logoUrl}
                      alt="logo"
                      className="sdash-snap-logo"
                    />
                  ) : (
                    <div className="sdash-snap-logo-fallback">
                      <Code2 size={20} />
                    </div>
                  )}
                  <div>
                    <div className="sdash-snap-name">
                      {data.settings.appName || "Shivam Stack"}
                    </div>
                    <div className="sdash-snap-legal">
                      {data.settings.companyLegalName ||
                        data.settings.companyName}
                    </div>
                  </div>
                </div>
                <div className="sdash-snapshot-fields">
                  {data.settings.websiteUrl && (
                    <a
                      href={data.settings.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="sdash-snap-field"
                    >
                      <Globe size={13} />
                      <span>{data.settings.websiteUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                  {data.settings.officialEmails?.[0] && (
                    <span className="sdash-snap-field">
                      <Mail size={13} />
                      {data.settings.officialEmails[0].address}
                    </span>
                  )}
                  {data.settings.contactNumbers?.[0] && (
                    <span className="sdash-snap-field">
                      <Phone size={13} />
                      {data.settings.contactNumbers[0].countryCode}
                      {data.settings.contactNumbers[0].number}
                    </span>
                  )}
                  <span
                    className={`sdash-snap-field ${data.settings.security?.isMaintenanceMode ? "sdash-snap-warn" : "sdash-snap-ok"}`}
                  >
                    {data.settings.security?.isMaintenanceMode ? (
                      <AlertTriangle size={13} />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    {data.settings.security?.isMaintenanceMode
                      ? "Maintenance Mode"
                      : "Site Live"}
                  </span>
                  <span className="sdash-snap-field">
                    <Shield size={13} />
                    2FA:{" "}
                    {data.settings.security?.enable2FA ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <Link to="/admin/main-settings" className="sdash-snap-edit">
                  <Settings size={14} /> Edit Settings
                </Link>
              </div>
            )}

            {/* Two-col: Recent Products + Recent Blogs */}
            <div className="sdash-two-col">
              {/* Recent Products */}
              <div className="sdash-panel">
                <SectionHead
                  icon={ShoppingBag}
                  title="Recent Products"
                  sub="Latest additions to your store"
                  action="View All"
                  actionPath="/admin/manage-products"
                  color="green"
                />
                <div className="sdash-panel-body">
                  {!data?.products?.length ? (
                    <div className="sdash-panel-empty">
                      <ShoppingBag size={28} />
                      <p>No products yet</p>
                      <Link
                        to="/admin/manage-products"
                        className="sdash-mini-btn"
                      >
                        <Plus size={12} /> Add Product
                      </Link>
                    </div>
                  ) : (
                    data.products.map((p, i) => (
                      <div className="sdash-item-row" key={p._id || i}>
                        <div className="sdash-item-thumb">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} />
                          ) : (
                            <div className="sdash-item-thumb-ph">
                              <ShoppingBag size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{p.name}</span>
                          <span className="sdash-item-meta">
                            <span className="sdash-price">
                              ₹{Number(p.price).toLocaleString()}
                            </span>
                            <span className="sdash-dot">·</span>
                            <span>Stock: {p.stock ?? 0}</span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={p.isPublished ? "published" : "hidden"}
                          />
                          <Link
                            to="/admin/manage-products"
                            className="sdash-item-edit"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Blogs */}
              <div className="sdash-panel">
                <SectionHead
                  icon={FileText}
                  title="Recent Blog Posts"
                  sub="Your latest articles"
                  action="View All"
                  actionPath="/admin/manage-blog"
                  color="amber"
                />
                <div className="sdash-panel-body">
                  {!data?.blogs?.length ? (
                    <div className="sdash-panel-empty">
                      <FileText size={28} />
                      <p>No blog posts yet</p>
                      <Link to="/admin/manage-blog" className="sdash-mini-btn">
                        <Plus size={12} /> Write Post
                      </Link>
                    </div>
                  ) : (
                    data.blogs.map((b, i) => (
                      <div className="sdash-item-row" key={b._id || i}>
                        <div className="sdash-item-thumb">
                          {b.featuredImage ? (
                            <img src={b.featuredImage} alt={b.title} />
                          ) : (
                            <div className="sdash-item-thumb-ph sdash-ph-amber">
                              <FileText size={13} />
                            </div>
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{b.title}</span>
                          <span className="sdash-item-meta">
                            {b.author && (
                              <>
                                <span>{b.author}</span>
                                <span className="sdash-dot">·</span>
                              </>
                            )}
                            <span>
                              {b.publishedAt
                                ? new Date(b.publishedAt).toLocaleDateString()
                                : new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={b.isPublished ? "published" : "draft"}
                          />
                          <Link
                            to="/admin/manage-blog"
                            className="sdash-item-edit"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="sdash-panel">
              <SectionHead
                icon={Briefcase}
                title="Recent Projects"
                sub="Your latest portfolio work"
                action="View All"
                actionPath="/admin/manage-projects"
                color="purple"
              />
              <div className="sdash-panel-body">
                {!data?.projects?.length ? (
                  <div className="sdash-panel-empty">
                    <Briefcase size={28} />
                    <p>No projects yet</p>
                    <Link
                      to="/admin/manage-projects"
                      className="sdash-mini-btn"
                    >
                      <Plus size={12} /> Add Project
                    </Link>
                  </div>
                ) : (
                  <div className="sdash-projects-grid">
                    {data.projects.map((proj, i) => (
                      <div className="sdash-project-card" key={proj._id || i}>
                        {proj.images?.[0] ? (
                          <img
                            src={proj.images[0]}
                            alt={proj.title}
                            className="sdash-proj-img"
                          />
                        ) : (
                          <div className="sdash-proj-img-ph">
                            <Code2 size={22} />
                          </div>
                        )}
                        <div className="sdash-proj-body">
                          <div className="sdash-proj-top">
                            <span className="sdash-proj-title">
                              {proj.title}
                            </span>
                          </div>
                          {proj.client && (
                            <p className="sdash-proj-client">
                              <User size={11} />
                              {proj.client}
                            </p>
                          )}
                          <div className="sdash-proj-footer">
                            <Badge status={proj.status} />
                            {proj.endDate && (
                              <span className="sdash-proj-date">
                                <Calendar size={11} />
                                {new Date(proj.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Coupons snapshot */}
            <div className="sdash-panel">
              <SectionHead
                icon={Ticket}
                title="Coupon Overview"
                sub="Discount codes and their usage"
                action="Manage Coupons"
                actionPath="/admin/manage-coupons"
                color="cyan"
              />
              <div className="sdash-panel-body">
                {!data?.coupons?.length ? (
                  <div className="sdash-panel-empty">
                    <Ticket size={28} />
                    <p>No coupons created</p>
                    <Link to="/admin/manage-coupons" className="sdash-mini-btn">
                      <Plus size={12} /> Create Coupon
                    </Link>
                  </div>
                ) : (
                  <div className="sdash-coupon-grid">
                    {data.coupons.map((c, i) => {
                      const expired =
                        c.validTill && new Date(c.validTill) < new Date();
                      const pct = c.maxUses
                        ? Math.min(
                            100,
                            Math.round(((c.usedCount || 0) / c.maxUses) * 100),
                          )
                        : 0;
                      return (
                        <div
                          className={`sdash-coupon-card ${expired ? "sdash-coupon-expired" : c.isActive ? "" : "sdash-coupon-off"}`}
                          key={c._id || i}
                        >
                          <div className="sdash-coupon-top">
                            <span className="sdash-coupon-code">{c.code}</span>
                            <span
                              className={`sdash-coupon-disc ${c.discountType === "percentage" ? "sdash-disc-pct" : "sdash-disc-fixed"}`}
                            >
                              {c.discountValue}
                              {c.discountType === "percentage" ? "%" : "₹"} OFF
                            </span>
                          </div>
                          <div className="sdash-coupon-usage">
                            <span>
                              {c.usedCount || 0} / {c.maxUses} uses
                            </span>
                            <span
                              className={`sdash-coupon-status ${expired ? "sdash-cs-expired" : c.isActive ? "sdash-cs-active" : "sdash-cs-off"}`}
                            >
                              {expired
                                ? "Expired"
                                : c.isActive
                                  ? "Active"
                                  : "Off"}
                            </span>
                          </div>
                          <div className="sdash-coupon-bar">
                            <div
                              className="sdash-coupon-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {c.validTill && (
                            <div className="sdash-coupon-date">
                              Expires:{" "}
                              {new Date(c.validTill).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── USERS TAB ───────────────────────────────────────────── */}
        {activeTab === "users" && (
          <>
            <div className="sdash-content-banner">
              <div className="sdash-cb-left">
                <UsersRound size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">User Management</h2>
                  <p className="sdash-cb-sub">
                    Manage users, admins, and their activities
                  </p>
                </div>
              </div>
              <div className="sdash-cb-stats">
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalUsers}</span>
                  <span>Users</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.activeUsers}</span>
                  <span>Active</span>
                </div>
                <div className="sdash-cb-stat sdash-cb-divider" />
                <div className="sdash-cb-stat">
                  <span className="sdash-cb-val">{derived.totalAdmins}</span>
                  <span>Admins</span>
                </div>
              </div>
            </div>

            <div className="sdash-two-col">
              {/* Recent Users */}
              <div className="sdash-panel">
                <SectionHead
                  icon={Users}
                  title="Recent Users"
                  sub="Latest user registrations"
                  action="View All"
                  onActionClick={fetchUsersDetails}
                  color="blue"
                />
                <div className="sdash-panel-body">
                  {!data?.users?.users?.length ? (
                    <div className="sdash-panel-empty">
                      <Users size={28} />
                      <p>No users yet</p>
                    </div>
                  ) : (
                    data.users.users.map((user, i) => (
                      <div className="sdash-item-row" key={user._id || i}>
                        <div className="sdash-item-thumb sdash-user-thumb">
                          {user.avatar?.url ? (
                            <img src={user.avatar.url} alt={user.name} />
                          ) : (
                            <User size={13} />
                          )}
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{user.name}</span>
                          <span className="sdash-item-meta">
                            <span>{user.email}</span>
                            <span className="sdash-dot">·</span>
                            <span>{user.role}</span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={user.isActive ? "active" : "inactive"}
                          />
                          {user.isBlocked && <Badge status="blocked" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="sdash-panel-footer">
                  <button
                    onClick={fetchUsersDetails}
                    className="sdash-panel-footer-link"
                  >
                    <Users size={13} /> Manage All Users
                  </button>
                </div>
              </div>

              {/* Recent Admins */}
              <div className="sdash-panel">
                <SectionHead
                  icon={UserCog}
                  title="Recent Admins"
                  sub="Admin accounts"
                  action="View All"
                  onActionClick={fetchAdminsDetails}
                  color="orange"
                />
                <div className="sdash-panel-body">
                  {!data?.admins?.admins?.length ? (
                    <div className="sdash-panel-empty">
                      <UserCog size={28} />
                      <p>No admins yet</p>
                    </div>
                  ) : (
                    data.admins.admins.map((admin, i) => (
                      <div className="sdash-item-row" key={admin._id || i}>
                        <div className="sdash-item-thumb sdash-user-thumb">
                          <UserCog size={13} />
                        </div>
                        <div className="sdash-item-info">
                          <span className="sdash-item-name">{admin.name}</span>
                          <span className="sdash-item-meta">
                            <span>{admin.email}</span>
                            <span className="sdash-dot">·</span>
                            <span>{admin.role}</span>
                          </span>
                        </div>
                        <div className="sdash-item-right">
                          <Badge
                            status={admin.isActive ? "active" : "inactive"}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="sdash-panel-footer">
                  <Link
                    to="/admin/register"
                    className="sdash-panel-footer-link"
                  >
                    <Plus size={13} /> Add New Admin
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Downloads */}
            <div className="sdash-panel">
              <SectionHead
                icon={DownloadCloud}
                title="Recent Downloads"
                sub="Latest file downloads by users"
                action="View All"
                onActionClick={fetchDownloadsDetails}
                color="cyan"
              />
              <div className="sdash-panel-body">
                {!data?.downloads?.downloads?.length ? (
                  <div className="sdash-panel-empty">
                    <DownloadCloud size={28} />
                    <p>No downloads yet</p>
                  </div>
                ) : (
                  data.downloads.downloads.map((download, i) => (
                    <div className="sdash-item-row" key={i}>
                      <div className="sdash-item-thumb">
                        <DownloadCloud size={13} />
                      </div>
                      <div className="sdash-item-info">
                        <span className="sdash-item-name">
                          {download.fileName}
                        </span>
                        <span className="sdash-item-meta">
                          <span>{download.user?.name}</span>
                          <span className="sdash-dot">·</span>
                          <span>{download.fileType}</span>
                          <span className="sdash-dot">·</span>
                          <span>
                            {new Date(download.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                      <div className="sdash-item-right">
                        <Badge status="completed" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* ── ANALYTICS TAB ───────────────────────────────────────── */}
        {activeTab === "analytics" && (
          <>
            <div className="sdash-content-banner sdash-banner-purple">
              <div className="sdash-cb-left">
                <BarChart2 size={22} className="sdash-cb-icon" />
                <div>
                  <h2 className="sdash-cb-title">Analytics Dashboard</h2>
                  <p className="sdash-cb-sub">
                    Detailed statistics and insights
                  </p>
                </div>
              </div>
            </div>

            <div className="sdash-analytics-grid">
              {/* Payments Overview */}
              <div className="sdash-panel">
                <SectionHead
                  icon={CreditCard}
                  title="Payments Overview"
                  sub="Payment statistics"
                  action="View All"
                  onActionClick={fetchPaymentsDetails}
                  color="green"
                />
                <div className="sdash-panel-body">
                  <div className="sdash-analytics-stats">
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">
                        Total Payments
                      </span>
                      <span className="sdash-analytics-stat-value">
                        {derived.totalPayments}
                      </span>
                    </div>
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">
                        Completed
                      </span>
                      <span className="sdash-analytics-stat-value">
                        {derived.completedPayments}
                      </span>
                    </div>
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">
                        Success Rate
                      </span>
                      <span className="sdash-analytics-stat-value">
                        {derived.totalPayments > 0
                          ? Math.round(
                              (derived.completedPayments /
                                derived.totalPayments) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices Overview */}
              <div className="sdash-panel">
                <SectionHead
                  icon={FileTextIcon}
                  title="Invoices Overview"
                  sub="Invoice statistics"
                  action="View All"
                  onActionClick={fetchInvoicesDetails}
                  color="purple"
                />
                <div className="sdash-panel-body">
                  <div className="sdash-analytics-stats">
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">
                        Total Invoices
                      </span>
                      <span className="sdash-analytics-stat-value">
                        {derived.totalInvoices}
                      </span>
                    </div>
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">Paid</span>
                      <span className="sdash-analytics-stat-value">
                        {derived.paidInvoices}
                      </span>
                    </div>
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">
                        Pending
                      </span>
                      <span className="sdash-analytics-stat-value">
                        {derived.totalInvoices - derived.paidInvoices}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Overview */}
              <div className="sdash-panel">
                <SectionHead
                  icon={MailOpen}
                  title="Newsletter"
                  sub="Subscriber statistics"
                  action="View All"
                  onActionClick={fetchNewsletterDetails}
                  color="cyan"
                />
                <div className="sdash-panel-body">
                  <div className="sdash-analytics-stats">
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">
                        Total Subscribers
                      </span>
                      <span className="sdash-analytics-stat-value">
                        {derived.totalNewsletterSubs}
                      </span>
                    </div>
                    <div className="sdash-analytics-stat">
                      <span className="sdash-analytics-stat-label">
                        New (30d)
                      </span>
                      <span className="sdash-analytics-stat-value">
                        {derived.recentNewsletterSubs}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Overview */}
            <div className="sdash-panel">
              <SectionHead
                icon={StarIcon}
                title="Recent Reviews"
                sub="Latest product reviews"
                action="Manage Reviews"
                onActionClick={fetchReviewsDetails}
                color="amber"
              />
              <div className="sdash-panel-body">
                {!data?.reviews?.data?.length ? (
                  <div className="sdash-panel-empty">
                    <StarIcon size={28} />
                    <p>No reviews yet</p>
                  </div>
                ) : (
                  data.reviews.data.map((review, i) => (
                    <div className="sdash-item-row" key={review._id || i}>
                      <div className="sdash-item-thumb">
                        <StarIcon size={13} />
                      </div>
                      <div className="sdash-item-info">
                        <span className="sdash-item-name">
                          {review.title || "Review"}
                        </span>
                        <span className="sdash-item-meta">
                          <span>{review.user?.name}</span>
                          <span className="sdash-dot">·</span>
                          <span>Rating: {review.rating}/5</span>
                          <span className="sdash-dot">·</span>
                          <span>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                      <div className="sdash-item-right">
                        <Badge
                          status={review.isApproved ? "approved" : "pending"}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Integrations & System - always visible */}
        <div className="sdash-integrations-row">
          <SectionHead
            icon={Zap}
            title="Integrations & Services"
            sub="Connection status of third-party services"
            color="purple"
          />
          <div className="sdash-int-cards">
            {[
              {
                label: "Stripe",
                enabled: data?.settings?.integrations?.stripe?.enabled,
                icon: DollarSign,
                color: "#635bff",
              },
              {
                label: "SendGrid",
                enabled: data?.settings?.integrations?.sendgrid?.enabled,
                icon: Mail,
                color: "#1ab394",
              },
              {
                label: "Razorpay",
                enabled: data?.settings?.integrations?.razorpay?.enabled,
                icon: Hash,
                color: "#2a61ff",
              },
              {
                label: "Google Analytics",
                enabled: !!data?.settings?.analytics?.googleAnalyticsId,
                icon: BarChart2,
                color: "#ea4335",
              },
              {
                label: "2FA Auth",
                enabled: data?.settings?.security?.enable2FA,
                icon: Shield,
                color: "#10b981",
              },
              {
                label: "Auto Backup",
                enabled: data?.settings?.backup?.autoBackup,
                icon: Database,
                color: "#f59e0b",
              },
              {
                label: "Cookie Consent",
                enabled: data?.settings?.compliance?.cookieConsent?.enabled,
                icon: Globe,
                color: "#8b85ff",
              },
              {
                label: "GDPR",
                enabled: data?.settings?.compliance?.gdprCompliant,
                icon: CheckCircle,
                color: "#22d3ee",
              },
            ].map((int, i) => (
              <div
                className={`sdash-int-card ${int.enabled ? "sdash-int-on" : "sdash-int-off"}`}
                key={i}
              >
                <div
                  className="sdash-int-icon"
                  style={{ color: int.enabled ? int.color : undefined }}
                >
                  <int.icon size={16} />
                </div>
                <span className="sdash-int-label">{int.label}</span>
                <span
                  className={`sdash-int-dot ${int.enabled ? "sdash-idot-on" : "sdash-idot-off"}`}
                />
              </div>
            ))}
          </div>
          <Link to="/admin/main-settings" className="sdash-int-manage">
            <Settings size={14} /> Manage Integrations <ArrowRight size={13} />
          </Link>
        </div>

        {/* System Info */}
        <div className="sdash-system-row">
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Server size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">Backup Status</div>
              <div className="sdash-sys-val">
                {data?.settings?.backup?.autoBackup ? (
                  <>
                    <CheckCircle size={13} className="sdash-sys-ok" />{" "}
                    Auto-backup ON · {data.settings.backup.backupFrequency}
                  </>
                ) : (
                  <>
                    <XCircle size={13} className="sdash-sys-warn" /> Auto-backup
                    disabled
                  </>
                )}
              </div>
            </div>
            <Link to="/admin/main-settings" className="sdash-sys-link">
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Shield size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">Security</div>
              <div className="sdash-sys-val">
                <CheckCircle size={13} className="sdash-sys-ok" />
                Session: {data?.settings?.security?.sessionTimeout ?? 24}h · Max
                attempts: {data?.settings?.security?.maxLoginAttempts ?? 5}
              </div>
            </div>
            <Link to="/admin/main-settings" className="sdash-sys-link">
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Globe size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">API Base URL</div>
              <div className="sdash-sys-val sdash-sys-mono">
                {data?.settings?.apiBaseUrl || "Not configured"}
              </div>
            </div>
            <Link to="/admin/main-settings" className="sdash-sys-link">
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="sdash-sys-card">
            <div className="sdash-sys-icon">
              <Database size={16} />
            </div>
            <div className="sdash-sys-body">
              <div className="sdash-sys-title">Data Retention</div>
              <div className="sdash-sys-val">
                {data?.settings?.backup?.retentionDays ?? 30} days
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="sdash-footer">
          <span>Shivam Stack Admin — Built with MERN Stack</span>
          <span className="sdash-footer-dot">·</span>
          <span>Last refreshed: {time.toLocaleTimeString()}</span>
          <span className="sdash-footer-dot">·</span>
          <Link to="/admin/main-settings" className="sdash-footer-link">
            <Settings size={12} /> Settings
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboardWrapper;
