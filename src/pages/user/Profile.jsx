// pages/user/MyProfile.jsx
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ACTIVITY_ICONS = {
  login: "🔐",
  logout: "🚪",
  view_product: "👀",
  add_to_cart: "🛒",
  purchase: "💳",
  download_file: "⬇️",
  update_profile: "✏️",
  change_password: "🔑",
};

function formatDate(iso, full = false) {
  if (!iso) return "—";
  const opts = full
    ? {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : { day: "2-digit", month: "short", year: "numeric" };
  return new Date(iso).toLocaleDateString("en-IN", opts);
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MyProfile() {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [stats, setStats] = useState({
    downloads: 0,
    products: 0,
    wishlist: 0,
    reviews: 0,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/user/login");
    }
  }, [user, loading, navigate]);

  // Fetch real activity data
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      try {
        const response = await axios.get("/api/users/activities?limit=10", {
          withCredentials: true,
        });
        setActivities(response.data.activities || []);

        // You can calculate stats from activities or fetch from separate endpoint
        const downloadCount =
          response.data.activities?.filter((a) => a.action === "download_file")
            .length || 0;
        setStats((prev) => ({ ...prev, downloads: downloadCount }));
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  // Show loading state
  if (loading || !user) {
    return (
      <div
        className={`shivam-stack-user-profile-root ${isDarkMode ? "dark" : "light"}`}
      >
        <div style={{ textAlign: "center", padding: "4rem" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  const u = user; // Use real user data

  // Stats items using real data
  const STAT_ITEMS = [
    { label: "Downloads", value: stats.downloads },
    { label: "Products", value: user.purchasedProducts?.length || 0 },
    { label: "Wishlist", value: user.wishlist?.length || 0 },
    { label: "Reviews", value: user.reviews?.length || 0 },
  ];

  // The rest of your JSX remains EXACTLY the same, just replace:
  // - MOCK_USER with u
  // - MOCK_ACTIVITY with activities
  // - MOCK_ACTIVITY.map with activities.map

  return (
    <div
      className={`shivam-stack-user-profile-root ${isDarkMode ? "dark" : "light"}`}
    >
      <div className="shivam-stack-user-profile-layout">
        {/* Sidebar - uses u instead of MOCK_USER */}
        <aside className="shivam-stack-user-profile-sidebar">
          <div className="shivam-stack-user-profile-avatar-card">
            <div className="shivam-stack-user-profile-avatar-ring">
              {u.avatar?.url ? (
                <img
                  src={u.avatar.url}
                  alt={u.name}
                  className="shivam-stack-user-profile-avatar-img"
                />
              ) : (
                <div className="shivam-stack-user-profile-avatar-initials">
                  {getInitials(u.name)}
                </div>
              )}
            </div>
            <div className="shivam-stack-user-profile-avatar-name">
              {u.name}
            </div>
            <div className="shivam-stack-user-profile-avatar-email">
              {u.email}
            </div>
            <div className="shivam-stack-user-profile-role-badge">
              ✦ {u.role}
            </div>
            {u.emailVerified && (
              <div className="shivam-stack-user-profile-verified-chip">
                ✅ Email Verified
              </div>
            )}
          </div>

          {/* Quick Links - update hrefs to match your routes */}
          <nav className="shivam-stack-user-profile-sidebar-nav">
            {[
              { icon: "👤", label: "Overview", href: "/profile", active: true },
              {
                icon: "📦",
                label: "My Orders",
                href: "/orders",
                active: false,
              },
              {
                icon: "⬇️",
                label: "My Downloads",
                href: "/downloads",
                active: false,
              },
              {
                icon: "⚙️",
                label: "Settings",
                href: "/settings",
                active: false,
              },
              {
                icon: "❤️",
                label: "Wishlist",
                href: "/wishlist",
                active: false,
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`shivam-stack-user-profile-nav-item ${item.active ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
              >
                <span className="shivam-stack-user-profile-nav-icon">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content - uses u and activities */}
        <main className="shivam-stack-user-profile-main" id="overview">
          {/* Stats Section */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">
                  📊
                </span>
                At a Glance
              </div>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-stats-grid">
                {STAT_ITEMS.map((s) => (
                  <div
                    key={s.label}
                    className="shivam-stack-user-profile-stat-tile"
                  >
                    <div className="shivam-stack-user-profile-stat-tile-num">
                      {s.value}
                    </div>
                    <div className="shivam-stack-user-profile-stat-tile-label">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">
                  📋
                </span>
                Personal Information
              </div>
              <a
                href="/settings"
                className="shivam-stack-user-profile-edit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/settings");
                }}
              >
                ✏️ Edit
              </a>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-info-grid">
                {[
                  { label: "Full Name", value: u.name },
                  { label: "Email Address", value: u.email },
                  { label: "Phone Number", value: u.phone || "—" },
                  {
                    label: "Account Role",
                    value: u.role.charAt(0).toUpperCase() + u.role.slice(1),
                  },
                  { label: "Member Since", value: formatDate(u.createdAt) },
                  { label: "Last Login", value: formatDate(u.lastLogin, true) },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="shivam-stack-user-profile-info-field"
                  >
                    <span className="shivam-stack-user-profile-field-label">
                      {f.label}
                    </span>
                    <span className="shivam-stack-user-profile-field-value">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">
                  🎨
                </span>
                Preferences
              </div>
              <a
                href="/settings"
                className="shivam-stack-user-profile-edit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/settings");
                }}
              >
                ✏️ Edit
              </a>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-info-grid">
                {[
                  {
                    label: "Theme",
                    value: u.preferences?.theme
                      ? u.preferences.theme.charAt(0).toUpperCase() +
                        u.preferences.theme.slice(1) +
                        " Mode"
                      : "System",
                  },
                  {
                    label: "Newsletter",
                    value: u.preferences?.newsletter
                      ? "✅ Subscribed"
                      : "❌ Unsubscribed",
                  },
                  {
                    label: "Email Verified",
                    value: u.emailVerified ? "✅ Yes" : "❌ No — verify now",
                  },
                  {
                    label: "Account Status",
                    value: u.isActive ? "🟢 Active" : "🔴 Inactive",
                  },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="shivam-stack-user-profile-info-field"
                  >
                    <span className="shivam-stack-user-profile-field-label">
                      {f.label}
                    </span>
                    <span className="shivam-stack-user-profile-field-value">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">
                  🔗
                </span>
                Connected Accounts
              </div>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-info-grid">
                {[
                  {
                    label: "Google",
                    value: u.socialLogins?.google?.id
                      ? "✅ Connected"
                      : "— Not connected",
                    emoji: "🌐",
                  },
                  {
                    label: "GitHub",
                    value: u.socialLogins?.github?.id
                      ? "✅ Connected"
                      : "— Not connected",
                    emoji: "🐙",
                  },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="shivam-stack-user-profile-info-field"
                  >
                    <span className="shivam-stack-user-profile-field-label">
                      {f.emoji} {f.label}
                    </span>
                    <span className="shivam-stack-user-profile-field-value">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="shivam-stack-user-profile-section">
            <div className="shivam-stack-user-profile-section-header">
              <div className="shivam-stack-user-profile-section-title">
                <span className="shivam-stack-user-profile-section-title-icon">
                  ⚡
                </span>
                Recent Activity
              </div>
            </div>
            <div className="shivam-stack-user-profile-section-body">
              <div className="shivam-stack-user-profile-activity-list">
                {activitiesLoading ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    Loading activities...
                  </div>
                ) : activities.length > 0 ? (
                  activities.map((act, i) => (
                    <div
                      key={i}
                      className="shivam-stack-user-profile-activity-item"
                    >
                      <div className="shivam-stack-user-profile-activity-icon">
                        {ACTIVITY_ICONS[act.action] || "📌"}
                      </div>
                      <div className="shivam-stack-user-profile-activity-text">
                        <div className="shivam-stack-user-profile-activity-action">
                          {act.action.replace(/_/g, " ")}
                          {act.metadata?.productName &&
                            ` — ${act.metadata.productName}`}
                          {act.metadata?.fileName &&
                            ` — ${act.metadata.fileName}`}
                        </div>
                        <div className="shivam-stack-user-profile-activity-meta">
                          {formatDate(act.createdAt, true)}
                          {act.metadata?.ip && ` · IP: ${act.metadata.ip}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
