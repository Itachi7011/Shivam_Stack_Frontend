import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  MailCheck,
  Github,
  LogIn,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

const UserLogin = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate       = useNavigate();
  const location       = useLocation();
  const from           = location.state?.from?.pathname || "/";

  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [lockInfo, setLockInfo] = useState(null);           // { remainingMins }
  const [unverified, setUnverified] = useState(false);      // emailVerified: false
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const swalCfg = {
    background: isDarkMode ? "#0d1117" : "#fff",
    color:      isDarkMode ? "#e2e8f0" : "#1a202c",
    confirmButtonColor: "#6366f1",
  };

  /* ── Validate ─────────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.email)                             e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email    = "Enter a valid email";
    if (!form.password)                          e.password = "Password is required";
    return e;
  };

  const handleChange = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    setErrors((e) => ({ ...e, [field]: "" }));
    setLockInfo(null);
    setUnverified(false);
  };

  /* ── Resend verification email cooldown ──────────────────────────────── */
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      await fetch("/api/users/resend-verification", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email.trim().toLowerCase() }),
      });
      setResendCooldown(60);
      Swal.fire({ title: "Email Sent!", text: "Check your inbox for the verification link.", icon: "success", ...swalCfg });
    } catch {
      // silent
    } finally {
      setResendLoading(false);
    }
  };

  /* ── Submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setLockInfo(null);
    setUnverified(false);

    try {
      const res  = await fetch("/api/users/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:    form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const data = await res.json();

      /* Account locked (lockUntil) */
      if (res.status === 423) {
        setLockInfo({ remainingMins: data.lockRemainingMinutes ?? 120 });
        return;
      }

      /* Email not verified */
      if (res.status === 403 && data.code === "EMAIL_NOT_VERIFIED") {
        setUnverified(true);
        return;
      }

      /* Blocked — show blockedReason if provided */
      if (res.status === 403) {
        Swal.fire({
          title: "Account Blocked",
          text:  data.blockedReason || data.message || "Your account has been suspended. Contact support.",
          icon:  "error",
          ...swalCfg,
        });
        return;
      }

      /* Wrong credentials with remaining attempts */
      if (!res.ok) {
        if (data.attemptsRemaining !== undefined) {
          setErrors({ password: `Incorrect password. ${data.attemptsRemaining} attempt${data.attemptsRemaining !== 1 ? "s" : ""} remaining.` });
        } else {
          throw new Error(data.message || "Login failed. Please try again.");
        }
        return;
      }

      /* Success */
      localStorage.setItem("userToken", data.token);
      if (data.refreshToken) localStorage.setItem("userRefreshToken", data.refreshToken);
      navigate(from, { replace: true });

    } catch (err) {
      Swal.fire({ title: "Login Failed", text: err.message, icon: "error", ...swalCfg });
    } finally {
      setLoading(false);
    }
  };

  /* ── Google OAuth ─────────────────────────────────────────────────────── */
  const handleGoogleLogin = () => {
    window.location.href = "/api/users/google";
  };
  const handleGithubLogin = () => {
    window.location.href = "/api/users/github";
  };

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className={`sua-root ${isDarkMode ? "dark" : "light"}`}>

      <div className="sua-ambient" aria-hidden="true">
        <div className="sua-orb sua-orb-1" />
        <div className="sua-orb sua-orb-2" />
        <div className="sua-orb sua-orb-3" />
        <div className="sua-grid" />
      </div>

      <div className="sua-page-wrap">

        {/* ── Brand bar ── */}
        <header className="sua-topbar">
          <Link to="/" className="sua-topbar-brand">
            <div className="sua-topbar-logo">
              <Sparkles size={16} />
            </div>
            <span>ShivamStack</span>
          </Link>
          <span className="sua-topbar-sep" />
          <span className="sua-topbar-hint">
            Don't have an account?{" "}
            <Link to="/register" className="sua-topbar-link">Sign up free</Link>
          </span>
        </header>

        {/* ── Card ── */}
        <main className="sua-center">
          <div className="sua-card">

            <div className="sua-card-head">
              <div className="sua-card-hero-icon">
                <LogIn size={22} />
              </div>
              <h1 className="sua-card-title">Welcome back</h1>
              <p className="sua-card-sub">Sign in to your account</p>
            </div>

            {/* Social login */}
            <div className="sua-social-row">
              <button className="sua-social-btn" type="button" onClick={handleGoogleLogin}>
                <svg className="sua-social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <button className="sua-social-btn sua-social-btn-gh" type="button" onClick={handleGithubLogin}>
                <Github size={17} />
                Continue with GitHub
              </button>
            </div>

            <div className="sua-divider"><span>or sign in with email</span></div>

            {/* Account locked banner */}
            {lockInfo && (
              <div className="sua-alert sua-alert-lock">
                <AlertTriangle size={15} />
                <div>
                  <strong>Account temporarily locked</strong>
                  <span> — {lockInfo.remainingMins} minute{lockInfo.remainingMins !== 1 ? "s" : ""} remaining.</span>
                </div>
              </div>
            )}

            {/* Email not verified banner */}
            {unverified && (
              <div className="sua-alert sua-alert-warn">
                <MailCheck size={15} />
                <div className="sua-alert-body">
                  <strong>Email not verified</strong>
                  <span> — Please verify your email before signing in.</span>
                  <button
                    className={`sua-resend-inline ${resendCooldown > 0 ? "sua-resend-wait" : ""}`}
                    onClick={handleResendVerification}
                    disabled={resendCooldown > 0 || resendLoading}
                    type="button"
                  >
                    {resendLoading
                      ? "Sending…"
                      : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend verification email"
                    }
                  </button>
                </div>
              </div>
            )}

            <form className="sua-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className={`sua-field ${errors.email ? "sua-field-err" : ""}`}>
                <label className="sua-label" htmlFor="sua-login-email">Email address</label>
                <div className="sua-input-wrap">
                  <span className="sua-input-icon"><Mail size={15} /></span>
                  <input
                    id="sua-login-email"
                    className="sua-input"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                    disabled={loading || !!lockInfo}
                  />
                </div>
                {errors.email && <span className="sua-err-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={`sua-field ${errors.password ? "sua-field-err" : ""}`}>
                <div className="sua-label-row">
                  <label className="sua-label" htmlFor="sua-login-pass">Password</label>
                  <Link to="/forgot-password" className="sua-forgot-link">Forgot password?</Link>
                </div>
                <div className="sua-input-wrap">
                  <span className="sua-input-icon"><Lock size={15} /></span>
                  <input
                    id="sua-login-pass"
                    className="sua-input sua-input-pr"
                    type={showPass ? "text" : "password"}
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange("password")}
                    autoComplete="current-password"
                    disabled={loading || !!lockInfo}
                  />
                  <button type="button" className="sua-eye-btn" onClick={() => setShowPass((v) => !v)} tabIndex={-1}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <span className="sua-err-msg">{errors.password}</span>}
              </div>

              <button className="sua-submit-btn" type="submit" disabled={loading || !!lockInfo}>
                {loading
                  ? <span className="sua-spinner" />
                  : <><span>Sign in</span><ArrowRight size={15} /></>
                }
              </button>

            </form>

            <p className="sua-switch-text">
              Don't have an account?{" "}
              <Link to="/register" className="sua-switch-link">
                Create one free <ArrowRight size={11} />
              </Link>
            </p>

          </div>

          <p className="sua-legal">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="sua-legal-link">Terms</Link> and{" "}
            <Link to="/privacy" className="sua-legal-link">Privacy Policy</Link>.
          </p>
        </main>
      </div>
    </div>
  );
};

export default UserLogin;