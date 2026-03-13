import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { useAdmin } from "./context/AdminContext";
import { useLocation, Link } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";

import "./App.css";

import "./css/public/Home.css";
import "./css/public/PublicPages.css";
import "./css/public/Services.css";
import "./css/public/AllServices.css";
import "./css/public/AllProducts.css";
import "./css/public/Portfolio.css";
import "./css/public/BookFreeCall.css";
import "./css/public/Blog.css";
import "./css/public/Projects.css";

import "./css/components/Navbar.css";
import "./css/components/Footer.css";
import "./css/components/FloatingActionButton.css";
import "./css/components/AdminNavbar.css";
import "./css/components/AdminSidebar.css";

import "./css/components/Error/Error404.css";

import "./css/user/UserAuth.css";
import "./css/user/Profile_Settings.css";
import "./css/user/Ordersdownloads.css";
// import "./css/User/UserLogin.css"
// import "./css/User/UserProfile.css"
// import "./css/User/UserForgotPassword.css"
// import "./css/User/UserSettings.css"
// import "./css/User/UserEmailVerification.css"

import "./css/admin/AdminAuth.css";
import "./css/admin/AdminDashboard.css";
import "./css/admin/AdminPage.css";
import "./css/admin/MainSettings.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminNavbar from "./components/layout/AdminNavbar";
import AdminSidebar from "./components/layout/AdminSidebar";
import RequireAdmin from "./components/layout/RequireAdmin";
// import NotificationAlertDisplay from './components/Footer';
import FloatingActionButton from "./components/layout/FloatingActionButton";

import Homepage from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import Portfolio from "./pages/public/Portfolio";
import BookFreeCall from "./pages/public/BookFreeCall";
import Blog from "./pages/public/Blog";
// import BlogDetails from "./pages/public/BlogDetails";
// import ProductDetails from "./pages/public/ProductDetails";
// import ProjectDetails from "./pages/public/ProjectDetails";
import Projects from "./pages/public/Projects";
// import RefundPolicy from './pages/public/RefundPolicy';
import AllServices from "./pages/public/Services/AllServices";
import APIDevelopmentServices from "./pages/public/Services/APIDevelopment";
import AdminpanelscmsServices from "./pages/public/Services/Adminpanelscms";
import DevopsdeploymentServices from "./pages/public/Services/Devopsdeployment";
import EcommercesolutionsServices from "./pages/public/Services/Ecommercesolutions";
import FullStackServices from "./pages/public/Services/FullStack";
import MaintenancesupportServices from "./pages/public/Services/Maintenancesupport";
import PerformanceoptimizationServices from "./pages/public/Services/Performanceoptimization";
import PortfoliowebsitesServices from "./pages/public/Services/Portfoliowebsites";
import AllProducts from "./pages/public/Products/AllProducts";
import CodeTemplates from "./pages/public/Products/CodeTemplates";
import Ebooksandguides from "./pages/public/Products/Ebooksandguides";
import Resources from "./pages/public/Products/Resources";
// import Shop from './pages/public/Shop';
import TermsOfService from "./pages/public/TermsOfService";

import UserRegister from "./pages/user/auth/Register";
import UserLogin from "./pages/user/auth/Login";
import UserForgotPassword from "./pages/user/auth/ForgotPassword";
import UserResetPassword from "./pages/user/auth/ResetPassword";
import UserMyDownloads from "./pages/user/MyDownloads";
import UserMyOrders from "./pages/user/MyOrders";
import UserProfile from "./pages/user/Profile";
import UserSettings from "./pages/user/Settings";

import AdminRegister from "./pages/admin/auth/Register";
import AdminLogin from "./pages/admin/auth/Login";
import AdminForgotPassword from "./pages/admin/auth/ForgotPassword";
import AdminResetPassword from "./pages/admin/auth/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminAnalytics from "./pages/admin/Analytics";
import AdminMainSettings from "./pages/admin/MainSettings";
import AdminManageBlog from "./pages/admin/ManageBlog";
import AdminManageBlogCategory from "./pages/admin/ManageBlogCategory";
import AdminManageCoupons from "./pages/admin/ManageCoupons";
// import AdminManageMessages from "./pages/admin/ManageMessages";
// import AdminManageOrders from "./pages/admin/ManageOrders";
import AdminManageProducts from "./pages/admin/ManageProducts";
import AdminManageProductsCategory from "./pages/admin/ManageProductsCategory";
import AdminManageProjectsCategory from "./pages/admin/ManageProjectsCategory";
import AdminManageProjects from "./pages/admin/ManageProjects";
// import AdminManageUsers from "./pages/admin/ManageUsers";

import Error404 from "./components/Error/Error404";

function NavbarWrapper() {
  const { admin } = useAdmin();
  const location = useLocation();

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute && admin) {
    return <AdminNavbar />;
  }

  return <Navbar />;
}

// Create a wrapper for admin layout (navbar + sidebar)
function AdminLayoutWrapper({ children }) {
  const { admin } = useAdmin();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Only show admin layout on admin routes and when authenticated
  if (isAdminRoute && admin) {
    return (
      <div className="shivam-stack-admin-layout">
        <AdminSidebar />
        <div className="shivam-stack-admin-content">{children}</div>
      </div>
    );
  }

  // For non-admin routes, just return children
  return children;
}

function App() {
  const { isDarkMode } = useContext(ThemeContext);
  // const token1 = localStorage.getItem('adminToken');

  return (
    <>
      <div className={isDarkMode ? "dark" : "light"}>
        <AuthProvider>
          <AdminProvider>
            <SidebarProvider>
              <Router>
                {/* {token1 ? <AdminNavbar /> : <Navbar />} */}
                {/* <AdminSidebar /> */}

                <FloatingActionButton />
                <NavbarWrapper />
                <AdminLayoutWrapper />

                {/* <AdminNavSidebar /> */}
                <Routes>
                  <Route path="/" element={<Homepage />} />

                  <Route path="/blogs" element={<Blog />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/book-free-call" element={<BookFreeCall />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route
                    path="/terms-of-service"
                    element={<TermsOfService />}
                  />
                  <Route path="/services" element={<AllServices />} />
                  <Route
                    path="/services/api-development"
                    element={<APIDevelopmentServices />}
                  />
                  <Route
                    path="/services/admin-panel-cms-development"
                    element={<AdminpanelscmsServices />}
                  />
                  <Route
                    path="/services/devops-deployment"
                    element={<DevopsdeploymentServices />}
                  />
                  <Route
                    path="/services/ecommerce-solutions"
                    element={<EcommercesolutionsServices />}
                  />
                  <Route
                    path="/services/full-stack-development"
                    element={<FullStackServices />}
                  />
                  <Route
                    path="/services/maintenance-support"
                    element={<MaintenancesupportServices />}
                  />
                  <Route
                    path="/services/performance-optimization"
                    element={<PerformanceoptimizationServices />}
                  />
                  <Route
                    path="/services/portfolio-website-development"
                    element={<PortfoliowebsitesServices />}
                  />
                  <Route
                    path="/products"
                    element={<AllProducts />}
                  />
                  <Route
                    path="/products/code-templates"
                    element={<CodeTemplates />}
                  />
                  <Route
                    path="/products/ebooks-and-guides"
                    element={<Ebooksandguides />}
                  />
                  <Route
                    path="/products/developer-resources"
                    element={<Resources />}
                  />

                  {/* <Route path="/blog" element={<Blog />} /> */}

                  {/* <Route path="/blog/:slug" element={<BlogDetails />} /> */}
                  {/* <Route path="/projects/:slug" element={<ProjectDetails />} /> */}
                  {/* <Route path="/products/:slug" element={<ProductDetails />} /> */}

                  <Route path="/user/register" element={<UserRegister />} />
                  <Route path="/user/login" element={<UserLogin />} />
                  <Route
                    path="/user/forgot-password"
                    element={<UserForgotPassword />}
                  />
                  <Route
                    path="/user/reset-password"
                    element={<UserResetPassword />}
                  />
                  <Route path="/user/downloads" element={<UserMyDownloads />} />
                  <Route path="/user/orders" element={<UserMyOrders />} />
                  <Route path="/user/profile" element={<UserProfile />} />
                  <Route path="/user/settings" element={<UserSettings />} />
                  {/*    <Route path="/user/securitySettings" element={<SecuritySetting />} />
            <Route path="/user/notificationsSettings" element={<NotificationSettings />} /> */}

                  <Route path="/admin/register" element={<AdminRegister />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/forgot-password"
                    element={<AdminForgotPassword />}
                  />
                  <Route
                    path="/admin/reset-password"
                    element={<AdminResetPassword />}
                  />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  {/* <Route path="/admin/analytics" element={<AdminAnalytics />} /> */}
                  <Route
                    path="/admin/main-settings"
                    element={<AdminMainSettings />}
                  />
                  <Route
                    path="/admin/manage-blog"
                    element={<AdminManageBlog />}
                  />
                  <Route
                    path="/admin/manage-blog-categories"
                    element={<AdminManageBlogCategory />}
                  />
                  <Route
                    path="/admin/manage-coupons"
                    element={<AdminManageCoupons />}
                  />
                  {/* <Route path="/admin/manage-messages" element={<AdminManageMessages />} /> */}
                  {/* <Route path="/admin/manage-orders" element={<AdminManageOrders />} /> */}

                  <Route
                    path="/admin/manage-products"
                    element={<AdminManageProducts />}
                  />
                  <Route
                    path="/admin/manage-product-categories"
                    element={<AdminManageProductsCategory />}
                  />

                  <Route
                    path="/admin/manage-project-categories"
                    element={<AdminManageProjectsCategory />}
                  />
                  <Route
                    path="/admin/manage-projects"
                    element={<AdminManageProjects />}
                  />
                  {/* <Route path="/admin/manage-users" element={<AdminManageUsers />} /> */}

                  {/*  <Route path="/admin/clients/logs" element={<AdminClientLogs />} />
            <Route path="/admin/users/logs" element={<AdminUserLogs />} />
            <Route path="/admin/settings/general" element={<AdminSettings />} />
            <Route path="/admin/settings/nav-options" element={<AdminSearchBar />} /> */}

                  <Route path="*" element={<Error404 />} />
                </Routes>

                {!location.pathname.startsWith("/admin") && <Footer />}
              </Router>
            </SidebarProvider>
          </AdminProvider>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
