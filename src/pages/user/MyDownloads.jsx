// pages/user/MyDownloads.jsx
import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

/* ── Mock Data ──────────────────────────────────────────────── */
const MOCK_DOWNLOADS = [
  {
    _id: "dl001",
    fileName: "MERN-Stack-Masterclass.pdf",
    fileType: "pdf",
    fileSize: 14582016,
    downloadCount: 3,
    createdAt: "2025-03-12T10:30:00Z",
    orderId: "ORD-8821",
  },
  {
    _id: "dl002",
    fileName: "React-Design-System-Kit.zip",
    fileType: "zip",
    fileSize: 52428800,
    downloadCount: 1,
    createdAt: "2025-04-02T14:15:00Z",
    orderId: "ORD-8745",
  },
  {
    _id: "dl003",
    fileName: "NodeJS-API-Blueprint.pdf",
    fileType: "pdf",
    fileSize: 8388608,
    downloadCount: 2,
    createdAt: "2025-04-02T14:16:00Z",
    orderId: "ORD-8745",
  },
  {
    _id: "dl004",
    fileName: "Wireframe-Templates-v2.zip",
    fileType: "zip",
    fileSize: 20971520,
    downloadCount: 1,
    createdAt: "2025-04-10T09:05:00Z",
    orderId: "ORD-8610",
  },
  {
    _id: "dl005",
    fileName: "DevOps-CrashCourse.pdf",
    fileType: "pdf",
    fileSize: 11534336,
    downloadCount: 4,
    createdAt: "2024-12-15T11:20:00Z",
    orderId: "ORD-8300",
  },
];

const FILE_ICONS = {
  pdf: { icon: "📄", cls: "shivam-stack-user-mydown-order-file-icon-pdf" },
  zip: { icon: "🗜️", cls: "shivam-stack-user-mydown-order-file-icon-zip" },
  png: { icon: "🖼️", cls: "shivam-stack-user-mydown-order-file-icon-img" },
  jpg: { icon: "🖼️", cls: "shivam-stack-user-mydown-order-file-icon-img" },
  code: { icon: "⚙️", cls: "shivam-stack-user-mydown-order-file-icon-code" },
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Component ────────────────────────────────────────────── */
export default function MyDownloads() {
  const { isDarkMode } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = MOCK_DOWNLOADS.filter((d) => {
    const matchType = activeFilter === "all" || d.fileType === activeFilter;
    const matchSearch =
      d.fileName.toLowerCase().includes(search.toLowerCase()) ||
      d.orderId.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalSize = MOCK_DOWNLOADS.reduce((s, d) => s + d.fileSize, 0);
  const totalCount = MOCK_DOWNLOADS.reduce((s, d) => s + d.downloadCount, 0);

  return (
    <div
      className={`shivam-stack-user-mydown-order-root ${isDarkMode ? "dark" : "light"}`}
    >
      {/* ── Header ── */}
      <header className="shivam-stack-user-mydown-order-header">
        <div className="shivam-stack-user-mydown-order-title-wrap">
          <span className="shivam-stack-user-mydown-order-eyebrow">
            Dashboard / Downloads
          </span>
          <h1 className="shivam-stack-user-mydown-order-page-title">
            My&nbsp;
            <span className="shivam-stack-user-mydown-order-page-title-accent">
              Downloads
            </span>
          </h1>
        </div>
      </header>

      {/* ── Stats ── */}
      <div className="shivam-stack-user-mydown-order-stats-row">
        {[
          { label: "Total Files", value: MOCK_DOWNLOADS.length, icon: "📁" },
          { label: "Total Downloads", value: totalCount, icon: "⬇️" },
          { label: "Storage Used", value: formatBytes(totalSize), icon: "💾" },
          {
            label: "PDF Files",
            value: MOCK_DOWNLOADS.filter((d) => d.fileType === "pdf").length,
            icon: "📄",
          },
        ].map((s, i) => (
          <div key={i} className="shivam-stack-user-mydown-order-stat-card">
            <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
            <span className="shivam-stack-user-mydown-order-stat-number">
              {s.value}
            </span>
            <span className="shivam-stack-user-mydown-order-stat-label">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="shivam-stack-user-mydown-order-gold-line" />

      {/* ── Controls ── */}
      <div className="shivam-stack-user-mydown-order-controls">
        <div className="shivam-stack-user-mydown-order-search-wrap">
          <span className="shivam-stack-user-mydown-order-search-icon">🔍</span>
          <input
            className="shivam-stack-user-mydown-order-search-input"
            type="text"
            placeholder="Search by file name or order ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {["all", "pdf", "zip", "png"].map((f) => (
          <button
            key={f}
            className={`shivam-stack-user-mydown-order-filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="shivam-stack-user-mydown-order-table-wrap">
        <div
          className={`shivam-stack-user-mydown-order-table-head shivam-stack-user-mydown-order-table-head-downloads`}
        >
          <span className="shivam-stack-user-mydown-order-th">File</span>
          <span className="shivam-stack-user-mydown-order-th">Size</span>
          <span className="shivam-stack-user-mydown-order-th">Order</span>
          <span className="shivam-stack-user-mydown-order-th">Downloads</span>
          <span className="shivam-stack-user-mydown-order-th">Action</span>
        </div>

        {paged.length === 0 ? (
          <div className="shivam-stack-user-mydown-order-empty">
            <div className="shivam-stack-user-mydown-order-empty-icon">📂</div>
            <div className="shivam-stack-user-mydown-order-empty-title">
              No files found
            </div>
            <div className="shivam-stack-user-mydown-order-empty-sub">
              {search
                ? "Try a different search term."
                : "Purchase products to access your downloads."}
            </div>
          </div>
        ) : (
          paged.map((dl, idx) => {
            const fi = FILE_ICONS[dl.fileType] || FILE_ICONS.code;
            return (
              <div
                key={dl._id}
                className={`shivam-stack-user-mydown-order-row shivam-stack-user-mydown-order-row-downloads`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* File */}
                <div className="shivam-stack-user-mydown-order-cell-product">
                  <div
                    className={`shivam-stack-user-mydown-order-file-icon-wrap ${fi.cls}`}
                  >
                    {fi.icon}
                  </div>
                  <div>
                    <div className="shivam-stack-user-mydown-order-product-name">
                      {dl.fileName}
                    </div>
                    <div className="shivam-stack-user-mydown-order-product-sub">
                      {formatDate(dl.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div className="shivam-stack-user-mydown-order-cell">
                  {formatBytes(dl.fileSize)}
                </div>

                {/* Order */}
                <div className="shivam-stack-user-mydown-order-cell">
                  <span className="shivam-stack-user-mydown-order-cell-mono">
                    #{dl.orderId}
                  </span>
                </div>

                {/* Download count */}
                <div className="shivam-stack-user-mydown-order-cell">
                  <span className="shivam-stack-user-mydown-order-count-badge">
                    {dl.downloadCount}×
                  </span>
                </div>

                {/* Action */}
                <div className="shivam-stack-user-mydown-order-cell">
                  <button className="shivam-stack-user-mydown-order-row-action-btn">
                    ↓ Download
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="shivam-stack-user-mydown-order-pagination">
          <span className="shivam-stack-user-mydown-order-page-info">
            Showing {(page - 1) * PER_PAGE + 1}–
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}{" "}
            files
          </span>
          <div className="shivam-stack-user-mydown-order-page-btns">
            <button
              className="shivam-stack-user-mydown-order-page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`shivam-stack-user-mydown-order-page-btn ${page === n ? "active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="shivam-stack-user-mydown-order-page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
