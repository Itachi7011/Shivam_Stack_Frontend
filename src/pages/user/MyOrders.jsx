// pages/user/MyOrders.jsx
import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

/* ── Mock Data ────────────────────────────────────────────── */
const MOCK_ORDERS = [
  {
    _id: "ORD-8821",
    products: [
      {
        product: { name: "Full-Stack Masterclass PDF", images: [""] },
        quantity: 1,
        price: 1499,
      },
    ],
    totalAmount: 1499,
    status: "completed",
    orderedAt: "2025-03-12T10:24:00Z",
    invoice: "INV-2025-001",
  },
  {
    _id: "ORD-8745",
    products: [
      {
        product: { name: "React Design System Kit", images: [""] },
        quantity: 1,
        price: 799,
      },
      {
        product: { name: "Node.js API Blueprint", images: [""] },
        quantity: 1,
        price: 499,
      },
    ],
    totalAmount: 1298,
    status: "processing",
    orderedAt: "2025-04-02T14:05:00Z",
    invoice: "INV-2025-002",
  },
  {
    _id: "ORD-8610",
    products: [
      {
        product: { name: "MongoDB Advanced Guide", images: [""] },
        quantity: 1,
        price: 599,
      },
    ],
    totalAmount: 599,
    status: "pending",
    orderedAt: "2025-04-10T09:00:00Z",
    invoice: null,
  },
  {
    _id: "ORD-8401",
    products: [
      {
        product: { name: "UI/UX Wireframe Templates", images: [""] },
        quantity: 2,
        price: 350,
      },
    ],
    totalAmount: 700,
    status: "cancelled",
    orderedAt: "2025-01-28T16:40:00Z",
    invoice: null,
  },
  {
    _id: "ORD-8300",
    products: [
      {
        product: { name: "DevOps Crash Course PDF", images: [""] },
        quantity: 1,
        price: 899,
      },
    ],
    totalAmount: 899,
    status: "completed",
    orderedAt: "2024-12-15T11:11:00Z",
    invoice: "INV-2024-099",
  },
];

const PRODUCT_EMOJIS = ["📦", "📘", "🗂️", "🎨", "⚙️"];

const STATUS_MAP = {
  pending: {
    label: "Pending",
    cls: "shivam-stack-user-mydown-order-badge-pending",
  },
  processing: {
    label: "Processing",
    cls: "shivam-stack-user-mydown-order-badge-processing",
  },
  completed: {
    label: "Completed",
    cls: "shivam-stack-user-mydown-order-badge-completed",
  },
  cancelled: {
    label: "Cancelled",
    cls: "shivam-stack-user-mydown-order-badge-cancelled",
  },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatINR(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/* ── Component ────────────────────────────────────────────── */
export default function MyOrders() {
  const { isDarkMode } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchStatus = activeFilter === "all" || o.status === activeFilter;
    const matchSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.products.some((p) =>
        p.product.name.toLowerCase().includes(search.toLowerCase()),
      );
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = {
    total: MOCK_ORDERS.length,
    completed: MOCK_ORDERS.filter((o) => o.status === "completed").length,
    pending: MOCK_ORDERS.filter((o) => o.status === "pending").length,
    spent: MOCK_ORDERS.filter((o) => o.status === "completed").reduce(
      (s, o) => s + o.totalAmount,
      0,
    ),
  };

  return (
    <div
      className={`shivam-stack-user-mydown-order-root ${isDarkMode ? "dark" : "light"}`}
    >
      {/* ── Header ── */}
      <header className="shivam-stack-user-mydown-order-header">
        <div className="shivam-stack-user-mydown-order-title-wrap">
          <span className="shivam-stack-user-mydown-order-eyebrow">
            Dashboard / Orders
          </span>
          <h1 className="shivam-stack-user-mydown-order-page-title">
            My&nbsp;
            <span className="shivam-stack-user-mydown-order-page-title-accent">
              Orders
            </span>
          </h1>
        </div>
      </header>

      {/* ── Stats ── */}
      <div className="shivam-stack-user-mydown-order-stats-row">
        {[
          { label: "Total Orders", value: stats.total, icon: "🛒" },
          { label: "Completed", value: stats.completed, icon: "✅" },
          { label: "Pending", value: stats.pending, icon: "⏳" },
          { label: "Total Spent", value: formatINR(stats.spent), icon: "💳" },
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
            placeholder="Search by Order ID or product name…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {["all", "pending", "processing", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            className={`shivam-stack-user-mydown-order-filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="shivam-stack-user-mydown-order-table-wrap">
        <div
          className={`shivam-stack-user-mydown-order-table-head shivam-stack-user-mydown-order-table-head-orders`}
        >
          <span className="shivam-stack-user-mydown-order-th">Product</span>
          <span className="shivam-stack-user-mydown-order-th">Order ID</span>
          <span className="shivam-stack-user-mydown-order-th">Qty</span>
          <span className="shivam-stack-user-mydown-order-th">Amount</span>
          <span className="shivam-stack-user-mydown-order-th">Status</span>
          <span className="shivam-stack-user-mydown-order-th">Action</span>
        </div>

        {paged.length === 0 ? (
          <div className="shivam-stack-user-mydown-order-empty">
            <div className="shivam-stack-user-mydown-order-empty-icon">🛒</div>
            <div className="shivam-stack-user-mydown-order-empty-title">
              No orders found
            </div>
            <div className="shivam-stack-user-mydown-order-empty-sub">
              {search
                ? "Try a different search term."
                : "You haven't placed any orders yet."}
            </div>
          </div>
        ) : (
          paged.map((order, idx) => {
            const firstProduct = order.products[0];
            const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
            return (
              <div
                key={order._id}
                className={`shivam-stack-user-mydown-order-row shivam-stack-user-mydown-order-row-orders`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Product */}
                <div className="shivam-stack-user-mydown-order-cell-product">
                  <div className="shivam-stack-user-mydown-order-product-thumb">
                    {PRODUCT_EMOJIS[idx % PRODUCT_EMOJIS.length]}
                  </div>
                  <div>
                    <div className="shivam-stack-user-mydown-order-product-name">
                      {firstProduct.product.name}
                    </div>
                    {order.products.length > 1 && (
                      <div className="shivam-stack-user-mydown-order-product-sub">
                        +{order.products.length - 1} more item
                        {order.products.length > 2 ? "s" : ""}
                      </div>
                    )}
                    <div className="shivam-stack-user-mydown-order-product-sub">
                      {formatDate(order.orderedAt)}
                    </div>
                  </div>
                </div>

                {/* Order ID */}
                <div className="shivam-stack-user-mydown-order-cell">
                  <span className="shivam-stack-user-mydown-order-cell-mono">
                    #{order._id}
                  </span>
                  {order.invoice && (
                    <div style={{ marginTop: "2px" }}>
                      <span
                        className="shivam-stack-user-mydown-order-cell-mono"
                        style={{ fontSize: "0.72rem", opacity: 0.7 }}
                      >
                        {order.invoice}
                      </span>
                    </div>
                  )}
                </div>

                {/* Qty */}
                <div className="shivam-stack-user-mydown-order-cell">
                  {order.products.reduce((s, p) => s + p.quantity, 0)}
                </div>

                {/* Amount */}
                <div
                  className="shivam-stack-user-mydown-order-cell"
                  style={{ fontWeight: 600, fontFamily: "'Syne', sans-serif" }}
                >
                  {formatINR(order.totalAmount)}
                </div>

                {/* Status */}
                <div className="shivam-stack-user-mydown-order-cell">
                  <span
                    className={`shivam-stack-user-mydown-order-badge ${s.cls}`}
                  >
                    <span className="shivam-stack-user-mydown-order-badge-dot" />
                    {s.label}
                  </span>
                </div>

                {/* Action */}
                <div className="shivam-stack-user-mydown-order-cell">
                  {order.status === "completed" && order.invoice ? (
                    <button className="shivam-stack-user-mydown-order-row-action-btn">
                      ↓ Invoice
                    </button>
                  ) : order.status === "pending" ? (
                    <button className="shivam-stack-user-mydown-order-row-action-btn">
                      Pay Now →
                    </button>
                  ) : (
                    <button className="shivam-stack-user-mydown-order-row-action-btn">
                      Details
                    </button>
                  )}
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
            orders
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
