import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import "./css/public/Home.css";
import "./css/public/PublicPages.css";
import "./css/public/Services.css";

import "./css/components/Navbar.css";
import "./css/components/Footer.css";
import "./css/components/FloatingActionButton.css";
import "./css/components/AdminNavbar.css";
import "./css/components/AdminSidebar.css";

import "./css/components/Error/Error404.css";

import "./css/user/UserAuth.css";
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
import Services from "./pages/public/Services";
// import Shop from './pages/public/Shop';
import TermsOfService from "./pages/public/TermsOfService";

import UserRegister from "./pages/user/auth/Register";
import UserLogin from "./pages/user/auth/Login";
import UserForgotPassword from "./pages/user/auth/ForgotPassword";
import UserResetPassword from "./pages/user/auth/ResetPassword";
// import UserLogin from './pages/User/Auth/UserLogin';
// import UserEmailVerificatoin from './pages/User/Auth/UserEmailVerificatoin';
// import UserForgotPassword from './pages/User/Auth/UserForgotPassword';
// import UserProfile from './pages/User/Profile/UserProfile';
// import GeneralSettings from './pages/User/Settings/GeneralSettings';
// import SecuritySetting from './pages/User/Settings/SecuritySetting';
// import NotificationSettings from './pages/User/Settings/NotificationSettings';

import AdminRegister from "./pages/admin/auth/Register";
import AdminLogin from "./pages/admin/auth/Login";
import AdminForgotPassword from "./pages/admin/auth/ForgotPassword";
import AdminResetPassword from "./pages/admin/auth/ResetPassword";
// import AdminEmailVerification from './pages/Admin/Auth/AdminEmailVerification';
// import AdminLogin from './pages/Admin/Auth/AdminLogin';
// import AdminProfile from './pages/Admin/Profile/AdminProfile';
// import AdminSecurity from './pages/Admin/Profile/AdminSecurity';
// import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
// import AdminSystemHealth from './pages/Admin/Dashboard/AdminSystemHealth';
// import AdminUsersList from './pages/Admin/AdminUsersList';
// import SubscriptionPlans from './pages/Admin/SubscriptionPlans';
// import PrivacyPolicy from './pages/Admin/PrivacyPolicyAndTerms/PrivacyPolicy';
// import TermsOfUse from './pages/Admin/PrivacyPolicyAndTerms/TermsOfUse';
// import AdminClientLogs from './pages/Admin/Logs/AdminClientLogs';
// import AdminUserLogs from './pages/Admin/Logs/AdminUserLogs';
// import AdminSettings from './pages/Admin/Settings/AdminSettings';
// import AdminSearchBar from './pages/Admin/Settings/SearchBarSettings/AdminSearchBar';
// import NotificationManager from './pages/Admin/Settings/Notifications/NotificationManager';

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
            <Route path="/services" element={<Services />} />
            {/* <Route path="/projects" element={<Projects />} /> */}
            {/* <Route path="/blog" element={<Blog />} /> */}

            {/* <Route path="/blog/:slug" element={<BlogDetails />} /> */}
            {/* <Route path="/projects/:slug" element={<ProjectDetails />} /> */}
            {/* <Route path="/products/:slug" element={<ProductDetails />} /> */}

           <Route path="/user/registration" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/forgot-password" element={<UserForgotPassword />} />
            <Route path="/user/reset-password" element={<UserResetPassword />} />
            {/*  <Route path="/user/email-verification" element={<UserEmailVerificatoin />} />
            <Route path="/user/forgot-password" element={<UserForgotPassword />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/generalSettings" element={<GeneralSettings />} />
            <Route path="/user/securitySettings" element={<SecuritySetting />} />
            <Route path="/user/notificationsSettings" element={<NotificationSettings />} /> */}


           <Route path="/admin/registration" element={<AdminRegister />} />
           <Route path="/admin/login" element={<AdminLogin />} />
           <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
           <Route path="/admin/reset-password" element={<AdminResetPassword />} />
              {/* <Route path="/admin/email-verification" element={<AdminEmailVerification />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/settings/security" element={<AdminSecurity />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/system/health" element={<AdminSystemHealth />} />
            <Route path="/admin/users/all" element={<AdminUsersList />} />
            <Route path="/admin/billing/subscriptions" element={<SubscriptionPlans />} />
            <Route path="/admin/notification/manager" element={<NotificationManager />} />
            <Route path="/admin/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin/terms-of-use" element={<TermsOfUse />} />
            <Route path="/admin/clients/logs" element={<AdminClientLogs />} />
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
