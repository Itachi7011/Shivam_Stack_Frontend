import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Github,
  Camera,
  Sparkles,
  Bell,
  UserPlus,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

/* Password rules — schema minlength: 8 */
const PASSWORD_RULES = [
  { label: "At least 8 characters",  test: (v) => v.length >= 8 },
  { label: "One uppercase letter",    test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter",    test: (v) => /[a-z]/.test(v) },
  { label: "One number",             test: (v) => /\d/.test(v) },
];

const STRENGTH_META = [
  null,
  { label: "Very Weak", color: "#ef4444" },
  { label: "Weak",      color: "#f97316" },
  { label: "Fair",      color: "#f59e0b" },
  { label: "Strong",    color: "#10b981" },
];

const UserRegister = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate       = useNavigate();
  const avatarRef      = useRef(null);

  const [form, setForm] = useState({
    name:        "",
    email:       "",
    phone:       "",
    password:    "",
    confirm:     "",
    newsletter:  false,   // preferences.newsletter
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [errors, setErrors]               = useState({});
  const [registered, setRegistered]       = useState(false);

  const swalCfg = {
    background: isDarkMode ? "#0d1117" : "#fff",
    color:      isDarkMode ? "#e2e8f0" : "#1a202c",
    confirmButtonColor: "#6366f1",
  };

  /* ── Avatar picker ───────────────────────────────────────────────────── */
  const handleAvatarChange = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ title: "File too large", text: "Avatar must be under 5 MB.", icon: "warning", ...swalCfg });
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ── Validate ─────────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = "Full name is required";
    else if (form.name.trim().length > 100)
      e.name = "Name must be 100 characters or fewer";

    if (!form.email)
      e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";

    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
      e.phone = "Enter a valid phone number";

    if (!form.password)
      e.password = "Password is required";
    else if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      e.password = "Password does not meet requirements";

    if (!form.confirm)
      e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";

    return e;
  };

  const handleChange = (field) => (ev) => {
    const val = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  /* ── Submit ───────────────────────────────────────────────────────────── */
// This fixes the FormData handling for preferences

const handleSubmit = async (ev) => {
  ev.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length) { setErrors(errs); return; }

  setLoading(true);
  try {
    let body;
    let headers = {};

    if (avatarFile) {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim().toLowerCase());
      fd.append("password", form.password);
      if (form.phone.trim()) fd.append("phone", form.phone.trim());
      
      // Fix: Send preferences as JSON string
      fd.append("preferences", JSON.stringify({ newsletter: form.newsletter }));
      
      fd.append("avatar", avatarFile);
      body = fd;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        preferences: { newsletter: form.newsletter },
      });
    }

    const res = await fetch("/api/users/register", { 
      method: "POST", 
      headers, 
      body 
    });
    
    const data = await res.json();

    if (res.status === 409) {
      setErrors({ email: "An account with this email already exists." });
      return;
    }
    
    if (!res.ok) throw new Error(data.message || "Registration failed");

    setRegistered(true);

  } catch (err) {
    Swal.fire({ 
      title: "Registration Failed", 
      text: err.message, 
      icon: "error", 
      ...swalCfg 
    });
  } finally {
    setLoading(false);
  }
};

  const passScore    = PASSWORD_RULES.filter((r) => r.test(form.password)).length;
  const strengthMeta = STRENGTH_META[passScore] || null;

  /* ── Social login ─────────────────────────────────────────────────────── */
  const handleGoogleSignup = () => { window.location.href = "/api/users/google"; };
  const handleGithubSignup = () => { window.location.href = "/api/users/github"; };

  /* ════════════════════════════════════════════════════════════════════════
     RENDER — Email verification pending
  ════════════════════════════════════════════════════════════════════════ */
  if (registered) {
    return (
      <div className={`sua-root ${isDarkMode ? "dark" : "light"}`}>
        <div className="sua-ambient" aria-hidden="true">
          <div className="sua-orb sua-orb-1" /><div className="sua-orb sua-orb-2" /><div className="sua-orb sua-orb-3" />
          <div className="sua-grid" />
        </div>
        <div className="sua-page-wrap">
          <header className="sua-topbar">
            <Link to="/" className="sua-topbar-brand">
              <div className="sua-topbar-logo"><Sparkles size={16} /></div>
              <span>ShivamStack</span>
            </Link>
          </header>
          <main className="sua-center">
            <div className="sua-card">
              <div className="sua-verify-state">
                <div className="sua-verify-icon-wrap">
                  <Mail size={34} />
                </div>
                <h2 className="sua-card-title sua-text-center">Check your inbox!</h2>
                <p className="sua-verify-sub">
                  We've sent a verification link to{" "}
                  <strong className="sua-highlight-email">{form.email}</strong>.
                  Click the link to activate your account.
                </p>
                <div className="sua-verify-steps">
                  {[
                    "Open the email from ShivamStack",
                    "Click \"Verify Email\" in the email",
                    "Start using your account",
                  ].map((s, i) => (
                    <div className="sua-verify-step" key={i}>
                      <span className="sua-step-num">{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <p className="sua-verify-note">
                  The link expires in <strong>1 hour</strong>. Didn't receive it?{" "}
                  <Link to="/login" className="sua-switch-link">Go back to login</Link> and use the resend option.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════════
     RENDER — Registration form
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className={`sua-root ${isDarkMode ? "dark" : "light"}`}>

      <div className="sua-ambient" aria-hidden="true">
        <div className="sua-orb sua-orb-1" /><div className="sua-orb sua-orb-2" /><div className="sua-orb sua-orb-3" />
        <div className="sua-grid" />
      </div>

      <div className="sua-page-wrap">

        <header className="sua-topbar">
          <Link to="/" className="sua-topbar-brand">
            <div className="sua-topbar-logo"><Sparkles size={16} /></div>
            <span>ShivamStack</span>
          </Link>
          <span className="sua-topbar-sep" />
          <span className="sua-topbar-hint">
            Already have an account?{" "}
            <Link to="/login" className="sua-topbar-link">Sign in</Link>
          </span>
        </header>

        <main className="sua-center">
          <div className="sua-card sua-card-wide">

            <div className="sua-card-head">
              <div className="sua-card-hero-icon sua-hero-green">
                <UserPlus size={22} />
              </div>
              <h1 className="sua-card-title">Create your account</h1>
              <p className="sua-card-sub">It's free and takes less than a minute</p>
            </div>

            {/* Social signup */}
            <div className="sua-social-row">
              <button className="sua-social-btn" type="button" onClick={handleGoogleSignup}>
                <svg className="sua-social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>
              <button className="sua-social-btn sua-social-btn-gh" type="button" onClick={handleGithubSignup}>
                <Github size={17} />
                Sign up with GitHub
              </button>
            </div>

            <div className="sua-divider"><span>or sign up with email</span></div>

            <form className="sua-form" onSubmit={handleSubmit} noValidate>

              {/* Avatar picker (optional) */}
              <div className="sua-avatar-picker">
                <button
                  type="button"
                  className="sua-avatar-btn"
                  onClick={() => avatarRef.current?.click()}
                  aria-label="Upload avatar"
                >
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar preview" className="sua-avatar-preview" />
                    : <><Camera size={18} /><span>Add photo</span></>
                  }
                </button>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="sua-avatar-input"
                  onChange={handleAvatarChange}
                  tabIndex={-1}
                />
                <span className="sua-avatar-hint">Optional · max 5 MB</span>
              </div>

              {/* Two-column row for name + phone */}
              <div className="sua-two-col">

                {/* Full name */}
                <div className={`sua-field ${errors.name ? "sua-field-err" : ""}`}>
                  <label className="sua-label" htmlFor="sua-reg-name">
                    Full name <span className="sua-label-req">*</span>
                  </label>
                  <div className="sua-input-wrap">
                    <span className="sua-input-icon"><User size={15} /></span>
                    <input
                      id="sua-reg-name"
                      className="sua-input"
                      type="text"
                      placeholder="Shivam Kumar"
                      value={form.name}
                      onChange={handleChange("name")}
                      autoComplete="name"
                      maxLength={100}
                      disabled={loading}
                    />
                    {form.name.length > 80 && (
                      <span className="sua-char-count">{form.name.length}/100</span>
                    )}
                  </div>
                  {errors.name && <span className="sua-err-msg">{errors.name}</span>}
                </div>

                {/* Phone (optional, sparse index in schema) */}
                <div className={`sua-field ${errors.phone ? "sua-field-err" : ""}`}>
                  <label className="sua-label" htmlFor="sua-reg-phone">
                    Phone <span className="sua-label-opt">optional</span>
                  </label>
                  <div className="sua-input-wrap">
                    <span className="sua-input-icon"><Phone size={15} /></span>
                    <input
                      id="sua-reg-phone"
                      className="sua-input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      autoComplete="tel"
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && <span className="sua-err-msg">{errors.phone}</span>}
                </div>
              </div>

              {/* Email */}
              <div className={`sua-field ${errors.email ? "sua-field-err" : ""}`}>
                <label className="sua-label" htmlFor="sua-reg-email">
                  Email address <span className="sua-label-req">*</span>
                </label>
                <div className="sua-input-wrap">
                  <span className="sua-input-icon"><Mail size={15} /></span>
                  <input
                    id="sua-reg-email"
                    className="sua-input"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                {errors.email && <span className="sua-err-msg">{errors.email}</span>}
              </div>

              {/* Two-column row for passwords */}
              <div className="sua-two-col">

                {/* Password */}
                <div className={`sua-field ${errors.password ? "sua-field-err" : ""}`}>
                  <label className="sua-label" htmlFor="sua-reg-pass">
                    Password <span className="sua-label-req">*</span>
                  </label>
                  <div className="sua-input-wrap">
                    <span className="sua-input-icon"><Lock size={15} /></span>
                    <input
                      id="sua-reg-pass"
                      className="sua-input sua-input-pr"
                      type={showPass ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={handleChange("password")}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button type="button" className="sua-eye-btn" onClick={() => setShowPass((v) => !v)} tabIndex={-1}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <span className="sua-err-msg">{errors.password}</span>}
                </div>

                {/* Confirm */}
                <div className={`sua-field ${errors.confirm ? "sua-field-err" : ""}`}>
                  <label className="sua-label" htmlFor="sua-reg-confirm">
                    Confirm password <span className="sua-label-req">*</span>
                  </label>
                  <div className="sua-input-wrap">
                    <span className="sua-input-icon"><Lock size={15} /></span>
                    <input
                      id="sua-reg-confirm"
                      className="sua-input sua-input-pr"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={form.confirm}
                      onChange={handleChange("confirm")}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button type="button" className="sua-eye-btn" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.confirm && <span className="sua-err-msg">{errors.confirm}</span>}
                  {form.confirm && !errors.confirm && form.password === form.confirm && (
                    <span className="sua-match-ok"><CheckCircle size={12} /> Match</span>
                  )}
                </div>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="sua-strength-wrap">
                  <div className="sua-strength-track">
                    {[1,2,3,4].map((n) => (
                      <div
                        key={n}
                        className="sua-strength-seg"
                        style={{ background: passScore >= n ? strengthMeta?.color : undefined }}
                      />
                    ))}
                  </div>
                  {strengthMeta && (
                    <span className="sua-strength-label" style={{ color: strengthMeta.color }}>
                      {strengthMeta.label}
                    </span>
                  )}
                </div>
              )}

              {/* Rules */}
              {form.password && (
                <div className="sua-rules-grid">
                  {PASSWORD_RULES.map((r, i) => {
                    const ok = r.test(form.password);
                    return (
                      <div key={i} className={`sua-rule-item ${ok ? "sua-rule-ok" : "sua-rule-no"}`}>
                        {ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        <span>{r.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Newsletter preference (schema: preferences.newsletter) */}
              <label className="sua-checkbox-row">
                <input
                  type="checkbox"
                  className="sua-checkbox"
                  checked={form.newsletter}
                  onChange={handleChange("newsletter")}
                  id="sua-reg-newsletter"
                />
                <span className="sua-checkbox-box" aria-hidden="true">
                  {form.newsletter && <CheckCircle size={11} />}
                </span>
                <span className="sua-checkbox-label">
                  <Bell size={13} /> Subscribe to newsletter &amp; product updates
                </span>
              </label>

              <button className="sua-submit-btn sua-btn-green" type="submit" disabled={loading}>
                {loading
                  ? <span className="sua-spinner" />
                  : <><span>Create Account</span><ArrowRight size={15} /></>
                }
              </button>

            </form>

            <p className="sua-switch-text">
              Already have an account?{" "}
              <Link to="/login" className="sua-switch-link">Sign in <ArrowRight size={11} /></Link>
            </p>

          </div>

          <p className="sua-legal">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="sua-legal-link">Terms of Service</Link> and{" "}
            <Link to="/privacy" className="sua-legal-link">Privacy Policy</Link>.
          </p>
        </main>
      </div>
    </div>
  );
};

export default UserRegister;