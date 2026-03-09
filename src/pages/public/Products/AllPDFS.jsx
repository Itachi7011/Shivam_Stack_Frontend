import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Download, BookOpen, 
  ChevronDown, X, Star, Clock, TrendingUp,
  FileText, Grid, List, ArrowLeft, ArrowRight
} from 'lucide-react';

const API_URL = '/api/public';

const PublicProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  
  const [filters, setFilters] = useState({
    search: queryParams.get('search') || '',
    category: queryParams.get('category') || '',
    type: queryParams.get('type') || 'all',
    sort: queryParams.get('sort') || 'newest'
  });
  
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: queryParams.get('page') || 1,
        ...filters
      });
      
      const response = await fetch(`${API_URL}/products?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
      console.error('Error fetching categories:', error);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    
    navigate({ search: params.toString() });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: 'all',
      sort: 'newest'
    });
    navigate({ search: '' });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate({ search: params.toString() });
  };

const handleDownload = async (product) => {
  if (!product.isFree) {
    // Handle paid product - redirect to checkout or show message
    alert('This product requires purchase');
    return;
  }
  
  setDownloading(true);
  setSelectedProduct(product._id);
  
  try {
    // Use the existing API endpoint
    const response = await fetch(`${API_URL}/download/${product._id}`);
    const data = await response.json();
    
    if (data.success) {
      // Get the filename from the response or construct it
      let fileName = data.data.fileName;
      
      // If fileName is not provided in response, use product name
      if (!fileName) {
        fileName = product.originalName || 
                   `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      }
      
      // Ensure .pdf extension for PDF files
      if (product.fileType === 'pdf' && !fileName.toLowerCase().endsWith('.pdf')) {
        fileName += '.pdf';
      }
      
      // Create a temporary link to download
      const link = document.createElement('a');
      link.href = data.data.downloadUrl;
      link.download = fileName; // This will force download with the original filename
      link.target = '_blank'; // Open in new tab (helps with some browsers)
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href); // Clean up if using blob URLs
      }, 1000);
      
      // Optional: Track download in analytics
      console.log(`Download started: ${fileName}`);
      
      // Show success message (optional)
      // alert(`Downloading ${product.name}`);
    } else {
      alert(data.message || 'Download failed');
    }
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download file. Please try again.');
  } finally {
    setDownloading(false);
    setSelectedProduct(null);
  }
};

  const formatPrice = (product) => {
    if (product.isFree) {
      return <span className="price free">FREE</span>;
    }
    return <span className="price">₹{product.price.toLocaleString()}</span>;
  };

  const getTypeIcon = (product) => {
    if (product.isDigital) {
      return <FileText size={16} className="type-icon digital" />;
    }
    return <BookOpen size={16} className="type-icon physical" />;
  };

  return (
    <div className="public-products-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Amazing <span className="gradient-text">Digital Products</span>
          </h1>
          <p className="hero-subtitle">
            Access premium PDFs, ebooks, and learning resources to enhance your skills
          </p>
          
          {/* Search Bar */}
          <div className="hero-search">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="search-input"
            />
          </div>
        </div>
        
        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">{pagination.total}+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Free</span>
            <span className="stat-label">Downloads</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="products-section">
        <div className="products-header">
          <div className="header-left">
            <h2 className="section-title">All Products</h2>
            {filters.search && (
              <span className="search-query">
                Search: "{filters.search}"
              </span>
            )}
          </div>
          
          <div className="header-controls">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
            
            {/* Filter Button (Mobile) */}
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={`chevron ${showFilters ? 'open' : ''}`} />
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              {(filters.category || filters.type !== 'all' || filters.search) && (
                <button className="clear-filters" onClick={clearFilters}>
                  <X size={16} />
                  Clear all
                </button>
              )}
            </div>
            
            {/* Categories */}
            <div className="filter-group">
              <h4>Categories</h4>
              <div className="category-list">
                <button
                  className={`category-btn ${!filters.category ? 'active' : ''}`}
                  onClick={() => updateFilters({ category: '' })}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    className={`category-btn ${filters.category === cat._id ? 'active' : ''}`}
                    onClick={() => updateFilters({ category: cat._id })}
                  >
                    {cat.name}
                    <span className="count">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Type */}
            <div className="filter-group">
              <h4>Product Type</h4>
              <div className="type-options">
                {['all', 'free', 'paid', 'digital'].map(type => (
                  <label key={type} className="type-option">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={filters.type === type}
                      onChange={(e) => updateFilters({ type: e.target.value })}
                    />
                    <span className="type-label">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="filter-group">
              <h4>Sort By</h4>
              <select
                className="sort-select"
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
          <div className="products-content">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading amazing products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={48} />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="reset-btn" onClick={clearFilters}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`products-${viewMode}`}>
                  {products.map(product => (
                    <div key={product._id} className={`product-card ${viewMode}`}>
                      <div className="product-image">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">
                            {getTypeIcon(product)}
                          </div>
                        )}
                        {product.isFree && (
                          <span className="free-badge">FREE</span>
                        )}
                      </div>
                      
                      <div className="product-info">
                        <div className="product-header">
                          <h3 className="product-title">
                            <Link to={`/products/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h3>
                          {product.category && (
                            <span className="product-category">
                              {product.category.name}
                            </span>
                          )}
                        </div>
                        
                        <p className="product-description">
                          {product.shortDescription || product.description?.substring(0, 120)}...
                        </p>
                        
                        <div className="product-meta">
                          <span className="meta-item">
                            <Download size={14} />
                            {product.downloads || 0} downloads
                          </span>
                          {product.fileSize && (
                            <span className="meta-item">
                              <FileText size={14} />
                              {product.fileSize}
                            </span>
                          )}
                        </div>
                        
                        <div className="product-footer">
                          {formatPrice(product)}
                          <button
                            className={`download-btn ${product.isFree ? 'free' : 'paid'}`}
                            onClick={() => handleDownload(product)}
                            disabled={downloading && selectedProduct === product._id}
                          >
                            {downloading && selectedProduct === product._id ? (
                              <>Downloading...</>
                            ) : product.isFree ? (
                              <>Download Now</>
                            ) : (
                              <>Purchase</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </button>
                    
                    <div className="page-numbers">
                      {[...Array(pagination.pages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.pages ||
                          (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                        ) {
                          return (
                            <button
                              key={i}
                              className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === pagination.page - 3 ||
                          pageNum === pagination.page + 3
                        ) {
                          return <span key={i} className="page-dots">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicProducts;