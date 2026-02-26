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
  UserPlus,
  User,
  CheckCircle,
  XCircle,
  KeyRound,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

/* Password rules — aligned with schema: minlength: 10 */
const PASSWORD_RULES = [
  { label: "At least 10 characters",   test: (v) => v.length >= 10 },
  { label: "One uppercase letter",      test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter",      test: (v) => /[a-z]/.test(v) },
  { label: "One number",               test: (v) => /\d/.test(v) },
  { label: "One special character",    test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_META = [
  null,
  { label: "Very Weak", color: "#ef4444" },
  { label: "Weak",      color: "#f97316" },
  { label: "Fair",      color: "#f59e0b" },
  { label: "Good",      color: "#22d3ee" },
  { label: "Strong",    color: "#10b981" },
];

const AdminRegister = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    confirm:  "",
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});

  const swalCfg = {
    background: isDarkMode ? "#0d1117" : "#fff",
    color:      isDarkMode ? "#e2e8f0" : "#1a202c",
    confirmButtonColor: "#6c63ff",
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

    if (!form.password)
      e.password = "Password is required";
    else if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      e.password = "Password does not meet all requirements below";

    if (!form.confirm)
      e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";

    return e;
  };

  const handleChange = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  /* ── Submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim().toLowerCase(),
          password: form.password,
          // role defaults to "admin" on the model — server assigns it
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      await Swal.fire({
        title: "Account Created!",
        text:  "Your admin account is ready. Please sign in.",
        icon:  "success",
        ...swalCfg,
      });
      navigate("/admin/login");
    } catch (err) {
      Swal.fire({ title: "Registration Failed", text: err.message, icon: "error", ...swalCfg });
    } finally {
      setLoading(false);
    }
  };

  /* ── Password strength ───────────────────────────────────────────────── */
  const passScore = PASSWORD_RULES.filter((r) => r.test(form.password)).length;
  const strengthMeta = STRENGTH_META[passScore] || null;

  /* ── JSX ──────────────────────────────────────────────────────────────── */
  return (
    <div className={`ssaa-root ${isDarkMode ? "dark" : "light"}`}>

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
              <UserPlus size={12} />
              <span>Create Admin Account</span>
            </div>
            <h1 className="ssaa-left-title">
              Join the<br />
              <span className="ssaa-gradient-text">control center</span>
            </h1>
            <p className="ssaa-left-sub">
              Set up your admin credentials to unlock full platform
              management — products, blogs, projects, coupons &amp; more.
            </p>

            <div className="ssaa-features">
              {[
                { icon: Shield,      title: "Role-based Security",  desc: "admin &amp; superadmin permissions" },
                { icon: KeyRound,    title: "Account Protection",   desc: "Lockout after 5 failed attempts" },
                { icon: Sparkles,    title: "Full CMS Access",      desc: "8 granular permission scopes" },
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
              <div className="ssaa-card-icon ssaa-icon-green"><UserPlus size={19} /></div>
              <div>
                <h2 className="ssaa-card-title">Create account</h2>
                <p className="ssaa-card-sub">Set up your admin profile</p>
              </div>
            </div>

            <form className="ssaa-form" onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className={`ssaa-field ${errors.name ? "ssaa-field-err" : ""}`}>
                <label className="ssaa-label" htmlFor="ssaa-reg-name">
                  Full name <span className="ssaa-label-hint">(max 100 chars)</span>
                </label>
                <div className="ssaa-input-wrap">
                  <span className="ssaa-input-icon"><User size={15} /></span>
                  <input
                    id="ssaa-reg-name"
                    className="ssaa-input"
                    type="text"
                    placeholder="Shivam Kumar"
                    value={form.name}
                    onChange={handleChange("name")}
                    autoComplete="name"
                    maxLength={100}
                    disabled={loading}
                  />
                  {form.name.length > 80 && (
                    <span className="ssaa-char-count">{form.name.length}/100</span>
                  )}
                </div>
                {errors.name && <span className="ssaa-err-msg">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className={`ssaa-field ${errors.email ? "ssaa-field-err" : ""}`}>
                <label className="ssaa-label" htmlFor="ssaa-reg-email">Email address</label>
                <div className="ssaa-input-wrap">
                  <span className="ssaa-input-icon"><Mail size={15} /></span>
                  <input
                    id="ssaa-reg-email"
                    className="ssaa-input"
                    type="email"
                    placeholder="admin@shivamstack.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                {errors.email && <span className="ssaa-err-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={`ssaa-field ${errors.password ? "ssaa-field-err" : ""}`}>
                <label className="ssaa-label" htmlFor="ssaa-reg-pass">Password</label>
                <div className="ssaa-input-wrap">
                  <span className="ssaa-input-icon"><Lock size={15} /></span>
                  <input
                    id="ssaa-reg-pass"
                    className="ssaa-input ssaa-input-pr"
                    type={showPass ? "text" : "password"}
                    placeholder="Create a strong password (min 10 chars)"
                    value={form.password}
                    onChange={handleChange("password")}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="ssaa-eye-btn"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <span className="ssaa-err-msg">{errors.password}</span>}

                {/* Strength meter */}
                {form.password && (
                  <div className="ssaa-strength-wrap">
                    <div className="ssaa-strength-track">
                      {[1,2,3,4,5].map((n) => (
                        <div
                          key={n}
                          className="ssaa-strength-seg"
                          style={{ background: passScore >= n ? strengthMeta?.color : undefined }}
                        />
                      ))}
                    </div>
                    {strengthMeta && (
                      <span className="ssaa-strength-label" style={{ color: strengthMeta.color }}>
                        {strengthMeta.label}
                      </span>
                    )}
                  </div>
                )}

                {/* Rules checklist */}
                {form.password && (
                  <div className="ssaa-rules-grid">
                    {PASSWORD_RULES.map((r, i) => {
                      const ok = r.test(form.password);
                      return (
                        <div key={i} className={`ssaa-rule-item ${ok ? "ssaa-rule-ok" : "ssaa-rule-no"}`}>
                          {ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
                          <span>{r.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`ssaa-field ${errors.confirm ? "ssaa-field-err" : ""}`}>
                <label className="ssaa-label" htmlFor="ssaa-reg-confirm">Confirm password</label>
                <div className="ssaa-input-wrap">
                  <span className="ssaa-input-icon"><Lock size={15} /></span>
                  <input
                    id="ssaa-reg-confirm"
                    className="ssaa-input ssaa-input-pr"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={handleChange("confirm")}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="ssaa-eye-btn"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirm && <span className="ssaa-err-msg">{errors.confirm}</span>}
                {/* Match indicator */}
                {form.confirm && !errors.confirm && form.password === form.confirm && (
                  <span className="ssaa-match-ok">
                    <CheckCircle size={12} /> Passwords match
                  </span>
                )}
              </div>

              <button
                className="ssaa-submit-btn ssaa-btn-green"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? <span className="ssaa-spinner" />
                  : <><span>Create Account</span><ArrowRight size={15} /></>
                }
              </button>

            </form>

            <div className="ssaa-divider"><span>or</span></div>

            <p className="ssaa-switch-text">
              Already have an account?{" "}
              <Link to="/admin/login" className="ssaa-switch-link">
                Sign in <ArrowRight size={11} />
              </Link>
            </p>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRegister;