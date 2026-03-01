import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import "./css/public/Home.css";
import "./css/public/PublicPages.css";
import "./css/public/Services.css";
import "./css/public/AllServices.css";

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
// import NotificationAlertDisplay from './components/Footer';
import FloatingActionButton from "./components/layout/FloatingActionButton";

import Homepage from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
// import Blog from "./pages/public/Blog";
// import BlogDetails from "./pages/public/BlogDetails";
// import ProductDetails from "./pages/public/ProductDetails";
// import ProjectDetails from "./pages/public/ProjectDetails";
// import Projects from "./pages/public/Projects";
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
import AdminManageCoupons from "./pages/admin/ManageCoupons";
// import AdminManageMessages from "./pages/admin/ManageMessages";
// import AdminManageOrders from "./pages/admin/ManageOrders";
import AdminManageProducts from "./pages/admin/ManageProducts";
import AdminManageProductsCategory from "./pages/admin/ManageProductsCategory";
import AdminManageProjects from "./pages/admin/ManageProjects";
// import AdminManageUsers from "./pages/admin/ManageUsers";


import Error404 from "./components/Error/Error404";

function App() {
  const { isDarkMode } = useContext(ThemeContext);
  // const token1 = localStorage.getItem('adminToken');

  return (
    <>
      <div className={isDarkMode ? "dark" : "light"}>
        <Router>
          {/* {token1 ? <AdminNavbar /> : <Navbar />} */}
          {/* <AdminSidebar /> */}

          <FloatingActionButton />
          <Navbar />
          {/* <AdminNavSidebar /> */}
          <Routes>
            <Route path="/" element={<Homepage />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/services" element={<AllServices />} />
            <Route path="/services/api-development" element={<APIDevelopmentServices />} />
            <Route path="/services/admin-panel-cms-development" element={<AdminpanelscmsServices />} />
            <Route path="/services/devops-deployment" element={<DevopsdeploymentServices />} />
            <Route path="/services/ecommerce-solutions" element={<EcommercesolutionsServices />} />
            <Route path="/services/full-stack-development" element={<FullStackServices />} />
            <Route path="/services/maintenance-support" element={<MaintenancesupportServices />} />
            <Route path="/services/performance-optimization" element={<PerformanceoptimizationServices />} />
            <Route path="/services/portfolio-website-development" element={<PortfoliowebsitesServices />} />
            {/* <Route path="/projects" element={<Projects />} /> */}
            {/* <Route path="/blog" element={<Blog />} /> */}

            {/* <Route path="/blog/:slug" element={<BlogDetails />} /> */}
            {/* <Route path="/projects/:slug" element={<ProjectDetails />} /> */}
            {/* <Route path="/products/:slug" element={<ProductDetails />} /> */}

           <Route path="/user/registration" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/forgot-password" element={<UserForgotPassword />} />
            <Route path="/user/reset-password" element={<UserResetPassword />} />
           <Route path="/user/downloads" element={<UserMyDownloads />} />
            <Route path="/user/orders" element={<UserMyOrders />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/settings" element={<UserSettings />} />
           {/*    <Route path="/user/securitySettings" element={<SecuritySetting />} />
            <Route path="/user/notificationsSettings" element={<NotificationSettings />} /> */}


           <Route path="/admin/registration" element={<AdminRegister />} />
           <Route path="/admin/login" element={<AdminLogin />} />
           <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
           <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* <Route path="/admin/analytics" element={<AdminAnalytics />} /> */}
          <Route path="/admin/main-settings" element={<AdminMainSettings />} />
          <Route path="/admin/manage-blog" element={<AdminManageBlog />} />
          <Route path="/admin/manage-coupons" element={<AdminManageCoupons />} />
          {/* <Route path="/admin/manage-messages" element={<AdminManageMessages />} /> */}
          {/* <Route path="/admin/manage-orders" element={<AdminManageOrders />} /> */}
          <Route path="/admin/manage-products" element={<AdminManageProducts />} />
          <Route path="/admin/manage-product-categories" element={<AdminManageProductsCategory />} />
          <Route path="/admin/manage-projects" element={<AdminManageProjects />} />
          {/* <Route path="/admin/manage-users" element={<AdminManageUsers />} /> */}
          
           {/*  <Route path="/admin/clients/logs" element={<AdminClientLogs />} />
            <Route path="/admin/users/logs" element={<AdminUserLogs />} />
            <Route path="/admin/settings/general" element={<AdminSettings />} />
            <Route path="/admin/settings/nav-options" element={<AdminSearchBar />} /> */}

            <Route path="*" element={<Error404 />} />
          </Routes>

          <Footer />
        </Router>
      </div>
    </>
  );
}

export default App;
