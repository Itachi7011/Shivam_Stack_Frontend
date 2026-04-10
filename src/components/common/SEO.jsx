// Create a new file: src/components/SEO.jsx
import { Helmet } from "react-helmet-async";

const SEO = ({ 
  title, 
  description, 
  keywords = [],
  ogImage = "/default-og-image.jpg",
  ogType = "website",
  canonicalUrl,
  author = "Shivam",
  publishedTime,
  modifiedTime,
  noIndex = false,
}) => {
  const siteTitle = "Shivam";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = "Shivam portfolio — full-stack developer specializing in React, Node.js, and modern web technologies.";
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords.length > 0 ? keywords.join(", ") : "full-stack developer, React, Node.js, MongoDB, portfolio, web development, JavaScript";
  const url = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@shivamstack" />
      
      {/* Article specific (for blog/posts) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Viewport and theme */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#f59e0b" />
    </Helmet>
  );
};

export default SEO;