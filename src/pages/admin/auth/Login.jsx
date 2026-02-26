import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Code2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  LogIn,
  AlertTriangle,
  KeyRound,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

const AdminLogin = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [form, setForm]           = useState({ email: "", password: "", twoFactorCode: "" });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [requires2FA, set2FA]     = useState(false);
  const [lockInfo, setLockInfo]   = useState(null); // { remainingMins }

  const swalCfg = {
    background: isDarkMode ? "#0d1117" : "#fff",
    color:      isDarkMode ? "#e2e8f0" : "#1a202c",
    confirmButtonColor: "#6c63ff",
  };

  /* ── Validate ─────────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.email)                          e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = "Enter a valid email";
    if (!form.password)                        e.password = "Password is required";
    if (requires2FA && !form.twoFactorCode.trim())
                                               e.twoFactorCode = "2FA code is required";
    return e;
  };

  const handleChange = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    setErrors((e) => ({ ...e, [field]: "" }));
    setLockInfo(null);
  };

  /* ── Submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setLockInfo(null);

    try {
      const body = {
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      };
      if (requires2FA) body.twoFactorCode = form.twoFactorCode.trim();

      const res  = await fetch("/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      /* Account locked (lockUntil > Date.now()) */
      if (res.status === 423) {
        setLockInfo({ remainingMins: data.lockRemainingMinutes ?? 120 });
        return;
      }

      /* 2FA required */
      if (res.status === 202 && data.requires2FA) {
        set2FA(true);
        return;
      }

      /* Blocked / inactive */
      if (res.status === 403) {
        Swal.fire({
          title: "Access Denied",
          text:  data.message || "Account blocked. Contact support.",
          icon:  "error",
          ...swalCfg,
        });
        return;
      }

      /* Wrong credentials — show remaining attempts */
      if (!res.ok) {
        if (data.attemptsRemaining !== undefined) {
          setErrors({
            password: `Incorrect password. ${data.attemptsRemaining} attempt${data.attemptsRemaining !== 1 ? "s" : ""} remaining before lockout.`,
          });
        } else {
          throw new Error(data.message || "Login failed. Please try again.");
        }
        return;
      }

      /* Success */
      localStorage.setItem("adminToken", data.token);
      if (data.refreshToken) localStorage.setItem("adminRefreshToken", data.refreshToken);
      navigate("/admin/dashboard");

    } catch (err) {
      Swal.fire({ title: "Login Failed", text: err.message, icon: "error", ...swalCfg });
    } finally {
      setLoading(false);
    }
  };

  /* ── JSX ──────────────────────────────────────────────────────────────── */
  return (
    <div className={`ssaa-root ${isDarkMode ? "dark" : "light"}`}>

      {/* Ambient background */}
      <div className="ssaa-ambient" aria-hidden="true">
        <div className="ssaa-orb ssaa-orb-1" />
        <div className="ssaa-orb ssaa-orb-2" />
        <div className="ssaa-orb ssaa-orb-3" />
        <div className="ssaa-grid" />
        <div className="ssaa-scanlines" />
      </div>

      <div className="ssaa-layout">

        {/* ══════════ LEFT BRANDING PANEL ══════════ */}
        <aside className="ssaa-panel-left">
          <div className="ssaa-brand-wrap">
            <div className="ssaa-logo-mark"><Code2 size={24} /></div>
            <span className="ssaa-brand-name">Shivam<strong>Stack</strong></span>
          </div>

          <div className="ssaa-left-body">
            <div className="ssaa-eyebrow">
              <Sparkles size={12} />
              <span>Admin Control Panel</span>
            </div>
            <h1 className="ssaa-left-title">
              Command your<br />
              <span className="ssaa-gradient-text">digital empire</span>
            </h1>
            <p className="ssaa-left-sub">
              Full-stack MERN portfolio platform. Manage products, blogs,
              projects and more — secured with JWT &amp; bcrypt.
            </p>

            <div className="ssaa-features">
              {[
                { icon: Shield,   title: "Secure JWT Auth",     desc: "bcrypt · 2FA · account lockout" },
                { icon: KeyRound, title: "Role-based Access",   desc: "admin &amp; superadmin roles" },
                { icon: Sparkles, title: "Real-time Dashboard", desc: "Live stats &amp; platform insights" },
              ].map((f, i) => (
                <div className="ssaa-feature-row" key={i} style={{ animationDelay: `${i * 120}ms` }}>
                  <div className="ssaa-feature-icon-wrap"><f.icon size={14} /></div>
                  <div>
                    <div className="ssaa-feature-title">{f.title}</div>
                    <div className="ssaa-feature-desc" dangerouslySetInnerHTML={{ __html: f.desc }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="ssaa-left-footer">
            © {new Date().getFullYear()} ShivamStack — All rights reserved
          </footer>
        </aside>

        {/* ══════════ RIGHT FORM PANEL ══════════ */}
        <main className="ssaa-panel-right">
          <div className="ssaa-card">

            <div className="ssaa-card-header">
              <div className="ssaa-card-icon ssaa-icon-purple"><LogIn size={19} /></div>
              <div>
                <h2 className="ssaa-card-title">Welcome back</h2>
                <p className="ssaa-card-sub">Sign in to your admin panel</p>
              </div>
            </div>

            {/* Account locked banner */}
            {lockInfo && (
              <div className="ssaa-alert-banner ssaa-alert-lock">
                <AlertTriangle size={15} />
                <div>
                  <strong>Account temporarily locked</strong>
                  <span> — Too many failed attempts. Try again in {lockInfo.remainingMins} minute{lockInfo.remainingMins !== 1 ? "s" : ""}.</span>
                </div>
              </div>
            )}

            {/* 2FA required notice */}
            {requires2FA && (
              <div className="ssaa-alert-banner ssaa-alert-info">
                <KeyRound size={15} />
                <span>Enter the 6-digit code from your authenticator app to continue.</span>
              </div>
            )}

            <form className="ssaa-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className={`ssaa-field ${errors.email ? "ssaa-field-err" : ""}`}>
                <label className="ssaa-label" htmlFor="ssaa-login-email">Email address</label>
                <div className="ssaa-input-wrap">
                  <span className="ssaa-input-icon"><Mail size={15} /></span>
                  <input
                    id="ssaa-login-email"
                    className="ssaa-input"
                    type="email"
                    placeholder="admin@shivamstack.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                    disabled={loading || !!lockInfo}
                  />
                </div>
                {errors.email && <span className="ssaa-err-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={`ssaa-field ${errors.password ? "ssaa-field-err" : ""}`}>
                <div className="ssaa-label-row">
                  <label className="ssaa-label" htmlFor="ssaa-login-pass">Password</label>
                  <Link to="/admin/forgot-password" className="ssaa-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="ssaa-input-wrap">
                  <span className="ssaa-input-icon"><Lock size={15} /></span>
                  <input
                    id="ssaa-login-pass"
                    className="ssaa-input ssaa-input-pr"
                    type={showPass ? "text" : "password"}
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange("password")}
                    autoComplete="current-password"
                    disabled={loading || !!lockInfo}
                  />
                  <button
                    type="button"
                    className="ssaa-eye-btn"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <span className="ssaa-err-msg">{errors.password}</span>}
              </div>

              {/* 2FA code — shown only after server requests it */}
              {requires2FA && (
                <div className={`ssaa-field ssaa-field-2fa ${errors.twoFactorCode ? "ssaa-field-err" : ""}`}>
                  <label className="ssaa-label" htmlFor="ssaa-login-2fa">Authenticator Code</label>
                  <div className="ssaa-input-wrap">
                    <span className="ssaa-input-icon"><KeyRound size={15} /></span>
                    <input
                      id="ssaa-login-2fa"
                      className="ssaa-input ssaa-input-mono"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000 000"
                      value={form.twoFactorCode}
                      onChange={handleChange("twoFactorCode")}
                      autoComplete="one-time-code"
                      autoFocus
                    />
                  </div>
                  {errors.twoFactorCode && <span className="ssaa-err-msg">{errors.twoFactorCode}</span>}
                </div>
              )}

              <button className="ssaa-submit-btn ssaa-btn-purple" type="submit" disabled={loading || !!lockInfo}>
                {loading
                  ? <span className="ssaa-spinner" />
                  : <><span>{requires2FA ? "Verify & Sign in" : "Sign in"}</span><ArrowRight size={15} /></>
                }
              </button>

            </form>

            <div className="ssaa-divider"><span>or</span></div>

            <p className="ssaa-switch-text">
              Don't have an account?{" "}
              <Link to="/admin/register" className="ssaa-switch-link">
                Create one <ArrowRight size={11} />
              </Link>
            </p>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLogin;