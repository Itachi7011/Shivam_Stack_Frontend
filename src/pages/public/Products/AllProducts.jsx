import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

// Icons
const Search = () => <span className="ss-icon">🔍</span>;
const Filter = () => <span className="ss-icon">⚙️</span>;
const Download = () => <span className="ss-icon">📥</span>;
const BookOpen = () => <span className="ss-icon">📚</span>;
const ChevronDown = () => <span className="ss-icon">▼</span>;
const X = () => <span className="ss-icon">✕</span>;
const FileText = () => <span className="ss-icon">📄</span>;
const Grid = () => <span className="ss-icon">🔲</span>;
const List = () => <span className="ss-icon">📋</span>;
const ArrowLeft = () => <span className="ss-icon">←</span>;
const ArrowRight = () => <span className="ss-icon">→</span>;

const API_URL = "/api/public";

const AllProducts = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    search: queryParams.get("search") || "",
    category: queryParams.get("category") || "",
    type: queryParams.get("type") || "all",
    sort: queryParams.get("sort") || "newest",
  });

  // Static data for UI enhancements
  const TESTIMONIALS = [
    {
      name: "Rohit Sharma",
      role: "Startup Founder",
      text: "Shivam delivered the entire MERN stack backend in 3 days, clean code with proper documentation. Absolutely top-notch.",
      rating: 5,
      initials: "RS",
    },
    {
      name: "Priya Mehta",
      role: "Frontend Developer",
      text: "The React hooks library saved me weeks of work. The code quality and documentation are exceptional.",
      rating: 5,
      initials: "PM",
    },
    {
      name: "Alex Turner",
      role: "Tech Lead",
      text: "Best developer I have hired on the platform. The codebase he delivered was production-ready from day one.",
      rating: 5,
      initials: "AT",
    },
  ];

  const WHY_ME_FEATURES = [
    {
      icon: "⚡",
      title: "Lightning Fast Delivery",
      desc: "Most projects delivered within 3–7 business days. I respect deadlines and communicate progress daily.",
    },
    {
      icon: "🧹",
      title: "Clean, Scalable Code",
      desc: "Production-ready, well-commented, and documented code that your team can extend without headaches.",
    },
    {
      icon: "🔒",
      title: "Security First",
      desc: "Every project includes JWT auth, input sanitization, rate limiting, and CORS configuration as standard.",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      desc: "All UIs are pixel-perfect on mobile, tablet, and desktop with dark/light mode support built-in.",
    },
  ];

  const TECH_STACK_ITEMS = [
    "MongoDB",
    "Express.js",
    "React.js",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
    "Socket.io",
    "JWT",
    "Cloudinary",
    "Stripe",
  ];

  const faqs = [
    {
      q: "Can I request custom features in any of your projects?",
      a: "Absolutely. Every product can be customized to fit your needs. Contact me via email or the hire form and we will discuss scope, timeline, and pricing.",
    },
    {
      q: "Do I get the full source code?",
      a: "Yes. All purchases include 100% full source code, project setup instructions, a README, and .env configuration guidance.",
    },
    {
      q: "Which tech stack do you primarily work with?",
      a: "I specialize in the MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript, Tailwind CSS, and integrations with Stripe, Cloudinary, and more.",
    },
    {
      q: "Do you offer refunds?",
      a: "Due to the digital nature of code products, refunds are not available. However, I offer free revisions until you are satisfied. Please review previews carefully before purchasing.",
    },
    {
      q: "Can you deploy the project for me?",
      a: "Yes, deployment assistance is available as an add-on. I can deploy to Vercel, Netlify, Render, Railway, or AWS depending on your stack.",
    },
    {
      q: "How do I get support after purchase?",
      a: "All purchases include 30 days of free bug-fix support via email. Extended support plans are available for monthly retainers.",
    },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: queryParams.get("page") || 1,
        ...filters,
      });

      const response = await fetch(`${API_URL}/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      }
    });

    navigate({ search: params.toString() });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      type: "all",
      sort: "newest",
    });
    navigate({ search: "" });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set("page", newPage);
    navigate({ search: params.toString() });
  };

  const handleDownload = async (product) => {
    if (!product.isFree) {
      alert("This product requires purchase");
      return;
    }

    setDownloading(true);
    setSelectedProduct(product._id);

    try {
      const response = await fetch(`${API_URL}/download/${product._id}`);
      const data = await response.json();

      if (data.success) {
        let fileName = data.data.fileName;

        if (!fileName) {
          fileName =
            product.originalName ||
            `${product.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        }

        if (
          product.fileType === "pdf" &&
          !fileName.toLowerCase().endsWith(".pdf")
        ) {
          fileName += ".pdf";
        }

        const link = document.createElement("a");
        link.href = data.data.downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }, 1000);
      } else {
        alert(data.message || "Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setDownloading(false);
      setSelectedProduct(null);
    }
  };

  const formatPrice = (product) => {
    if (product.isFree) {
      return <span className="ss-product-price-free">Free</span>;
    }
    return (
      <>
        <span className="ss-product-price-currency">₹</span>
        <span className="ss-product-price-amount">
          {product.price?.toLocaleString()}
        </span>
      </>
    );
  };

  const getTypeIcon = (product) => {
    if (product.isDigital) {
      return <FileText />;
    }
    return <BookOpen />;
  };

  return (
    <div className={`ss-page-wrapper ${isDarkMode ? "dark" : "light"}`}>
      {/* Hero Section */}
      <section className="ss-page-hero">
        <div className="ss-page-hero-grid-bg" />
        <div className="ss-page-hero-content ss-animate-in">
          <div className="ss-page-hero-eyebrow">
            <span className="ss-page-hero-eyebrow-dot" />
            Shivam Stack · Digital Products
          </div>
          <h1 className="ss-page-hero-title">
            Discover Amazing
            <br />
            <span className="ss-page-hero-title-accent">Digital Products</span>
          </h1>
          <p className="ss-page-hero-subtitle">
            Access premium PDFs, ebooks, and learning resources to enhance your
            skills
          </p>

          {/* Search Bar */}
          <div className="ss-hero-search">
            <span className="ss-hero-search-icon">
              <Search />
            </span>
            <input
              type="text"
              placeholder="Search for products..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="ss-hero-search-input"
            />
          </div>

          <div className="ss-page-hero-stats">
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">
                {pagination.total}
                <span>+</span>
              </div>
              <div className="ss-page-hero-stat-label">Products</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">
                {categories.length}
                <span></span>
              </div>
              <div className="ss-page-hero-stat-label">Categories</div>
            </div>
            <div className="ss-page-hero-stat">
              <div className="ss-page-hero-stat-number">
                Free<span></span>
              </div>
              <div className="ss-page-hero-stat-label">Downloads</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <div className="ss-marquee-wrap">
        <div className="ss-marquee-track">
          {[...TECH_STACK_ITEMS, ...TECH_STACK_ITEMS].map((item, i) => (
            <div className="ss-marquee-item" key={i}>
              <span className="ss-marquee-dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">📦 All Products</div>
            <h2 className="ss-section-title">
              Everything You Need to Build Faster
            </h2>
            <p className="ss-section-desc">
              Complete MERN projects, templates, and tools — all
              production-ready.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="ss-products-controls">
            <div className="ss-view-toggle">
              <button
                className={`ss-view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid />
              </button>
              <button
                className={`ss-view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List />
              </button>
            </div>

            <button
              className="ss-filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter />
              <span>Filters</span>
              <ChevronDown />
            </button>
          </div>

          <div className="ss-products-layout">
            {/* Filters Sidebar */}
            <aside
              className={`ss-filters-sidebar ${showFilters ? "show" : ""}`}
            >
              <div className="ss-filters-header">
                <h3>Filters</h3>
                {(filters.category ||
                  filters.type !== "all" ||
                  filters.search) && (
                  <button className="ss-clear-filters" onClick={clearFilters}>
                    <X />
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="ss-filter-group">
                <h4>Categories</h4>
                <div className="ss-category-list">
                  <button
                    className={`ss-category-btn ${!filters.category ? "active" : ""}`}
                    onClick={() => updateFilters({ category: "" })}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      className={`ss-category-btn ${filters.category === cat._id ? "active" : ""}`}
                      onClick={() => updateFilters({ category: cat._id })}
                    >
                      {cat.name}
                      <span className="ss-count">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Type */}
              <div className="ss-filter-group">
                <h4>Product Type</h4>
                <div className="ss-type-options">
                  {["all", "free", "paid", "digital"].map((type) => (
                    <label key={type} className="ss-type-option">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={filters.type === type}
                        onChange={(e) =>
                          updateFilters({ type: e.target.value })
                        }
                      />
                      <span className="ss-type-label">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="ss-filter-group">
                <h4>Sort By</h4>
                <select
                  className="ss-sort-select"
                  value={filters.sort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </aside>

            {/* Products Grid/List */}
            <div className="ss-products-content">
              {loading ? (
                <div className="ss-loading-state">
                  <div className="ss-spinner"></div>
                  <p>Loading amazing products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="ss-empty-state">
                  <BookOpen />
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search query</p>
                  <button className="ss-reset-btn" onClick={clearFilters}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className={`ss-products-${viewMode}`}>
                    {products.map((product, index) => (
                      <div
                        key={product._id}
                        className={`ss-product-card ${viewMode} ss-animate-in ss-animate-delay-${(index % 5) + 1}`}
                      >
                        <div className="ss-product-card-image-wrap">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} />
                          ) : (
                            <div className="ss-product-card-image-placeholder">
                              {product.isDigital ? "📄" : "📚"}
                            </div>
                          )}
                          {product.isFree && (
                            <span className="ss-product-card-badge ss-badge-free">
                              FREE
                            </span>
                          )}
                        </div>

                        <div className="ss-product-card-body">
                          <div className="ss-product-card-category">
                            {product.category?.name || "Uncategorized"}
                          </div>

                          <h3 className="ss-product-card-title">
                            <Link to={`/products/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h3>

                          <p className="ss-product-card-desc">
                            {product.shortDescription ||
                              product.description?.substring(0, 120)}
                            ...
                          </p>

                          <div className="ss-product-card-meta">
                            <span className="ss-meta-item">
                              <Download />
                              {product.downloads || 0} downloads
                            </span>
                            {product.fileSize && (
                              <span className="ss-meta-item">
                                <FileText />
                                {product.fileSize}
                              </span>
                            )}
                          </div>

                          <div className="ss-product-card-tags">
                            {product.tags?.map((tag) => (
                              <span className="ss-product-tag" key={tag}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="ss-product-card-footer">
                            <div className="ss-product-price">
                              {formatPrice(product)}
                            </div>
                            <div className="ss-product-actions">
                              {product.previewUrl && (
                                <a
                                  href={product.previewUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="ss-btn-ghost"
                                >
                                  Preview
                                </a>
                              )}
                              <button
                                className={`ss-btn-primary ${product.isFree ? "free" : "paid"}`}
                                onClick={() => handleDownload(product)}
                                disabled={
                                  downloading && selectedProduct === product._id
                                }
                              >
                                {downloading && selectedProduct === product._id
                                  ? "Downloading..."
                                  : product.isFree
                                    ? "Download Now"
                                    : "Purchase"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="ss-pagination">
                      <button
                        className="ss-pagination-btn"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ArrowLeft />
                        Previous
                      </button>

                      <div className="ss-page-numbers">
                        {[...Array(pagination.pages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === pagination.pages ||
                            (pageNum >= pagination.page - 2 &&
                              pageNum <= pagination.page + 2)
                          ) {
                            return (
                              <button
                                key={i}
                                className={`ss-page-btn ${pagination.page === pageNum ? "active" : ""}`}
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === pagination.page - 3 ||
                            pageNum === pagination.page + 3
                          ) {
                            return (
                              <span key={i} className="ss-page-dots">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        className="ss-pagination-btn"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                      >
                        Next
                        <ArrowRight />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* Why Choose Me Section */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">🌟 Why Shivam Stack</div>
            <h2 className="ss-section-title">Developer You Can Trust</h2>
            <p className="ss-section-desc">
              More than just code — I deliver reliable, scalable, and beautiful
              digital products every single time.
            </p>
          </div>
          <div className="ss-features-grid">
            {WHY_ME_FEATURES.map((f, i) => (
              <div
                className={`ss-feature-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`}
                key={i}
              >
                <div className="ss-feature-icon">{f.icon}</div>
                <div className="ss-feature-title">{f.title}</div>
                <div className="ss-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* Testimonials */}
      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">💬 Testimonials</div>
            <h2 className="ss-section-title">What Clients Say</h2>
            <p className="ss-section-desc">
              Real words from real clients who shipped real products with me.
            </p>
          </div>
          <div className="ss-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                className={`ss-testimonial-card ss-animate-in ss-animate-delay-${(i % 5) + 1}`}
                key={i}
              >
                <div className="ss-star-rating">{"★".repeat(t.rating)}</div>
                <div className="ss-testimonial-quote">"</div>
                <p className="ss-testimonial-text">{t.text}</p>
                <div className="ss-testimonial-author">
                  <div className="ss-testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="ss-testimonial-name">{t.name}</div>
                    <div className="ss-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ss-gradient-divider" />

      {/* FAQ Section */}
      <section className="ss-section ss-section-alt">
        <div className="ss-container">
          <div className="ss-section-header">
            <div className="ss-section-tag">❓ FAQ</div>
            <h2 className="ss-section-title">Frequently Asked Questions</h2>
            <p className="ss-section-desc">
              Everything you need to know before making a purchase.
            </p>
          </div>
          <div className="ss-faq-list">
            {faqs.map((faq, i) => (
              <div
                className={`ss-faq-item ${openFaq === i ? "ss-faq-open" : ""}`}
                key={i}
              >
                <button
                  className="ss-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className="ss-faq-icon">+</span>
                </button>
                <div className="ss-faq-answer">
                  <div className="ss-faq-answer-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ss-cta-section">
        <div className="ss-cta-inner">
          <div className="ss-section-tag" style={{ marginBottom: "1rem" }}>
            🤝 Let's Work Together
          </div>
          <h2 className="ss-cta-title">Ready to Build Something Amazing?</h2>
          <p className="ss-cta-desc">
            Whether you need a custom MERN application, a quick template, or
            ongoing development support — I'm here to turn your ideas into
            production-ready digital products.
          </p>
          <div className="ss-cta-actions">
            <button className="ss-btn-primary">💬 Hire Me Now</button>
            <Link to="/projects" className="ss-btn-secondary">
              📂 View Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProducts;
