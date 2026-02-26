import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Code2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

/*
  Aligned with Admin schema:
  ─────────────────────────────────────────────────────
  - resetPasswordToken  : 32-byte hex (crypto.randomBytes)
  - resetPasswordExpires: Date.now() + 3600000  (1 hour)
  - password minlength  : 10
  ─────────────────────────────────────────────────────
  This page is reached when the admin clicks the link in their email:
  /admin/reset-password?token=<hex32>

  It ONLY handles the "set new password" step.
  The email-sending step lives in AdminForgotPassword.jsx.
*/

/* ── Password rules — schema minlength: 10 ─────────────────────────────────── */
const PASSWORD_RULES = [
  { label: "At least 10 characters",  test: (v) => v.length >= 10 },
  { label: "One uppercase letter",     test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter",     test: (v) => /[a-z]/.test(v) },
  { label: "One number",              test: (v) => /\d/.test(v) },
  { label: "One special character",   test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_META = [
  null,
  { label: "Very Weak", color: "#ef4444" },
  { label: "Weak",      color: "#f97316" },
  { label: "Fair",      color: "#f59e0b" },
  { label: "Good",      color: "#22d3ee" },
  { label: "Strong",    color: "#10b981" },
];

const AdminResetPassword = () => {
  const { isDarkMode }   = useContext(ThemeContext);
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();

  const [token, setToken]             = useState("");
  const [tokenValid, setTokenValid]   = useState(null); // null=checking, true, false
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [done, setDone]               = useState(false);

  const swalCfg = {
    background: isDarkMode ? "#0d1117" : "#fff",
    color:      isDarkMode ? "#e2e8f0" : "#1a202c",
    confirmButtonColor: "#6c63ff",
  };

  /* ── Extract & validate token from URL on mount ──────────────────────── */
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setTokenValid(false);
      return;
    }
    setToken(urlToken);

    // Optional: pre-validate token with server before showing form
    (async () => {
      try {
        const res = await fetch("/api/admin/validate-reset-token", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ token: urlToken }),
        });
        setTokenValid(res.ok);
      } catch {
        // If endpoint doesn't exist, just show the form and let submit catch it
        setTokenValid(true);
      }
    })();
  }, [searchParams]);

  /* ── Validate ─────────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!newPass)
      e.newPass = "Password is required";
    else if (!PASSWORD_RULES.every((r) => r.test(newPass)))
      e.newPass = "Password does not meet all requirements below";
    if (!confirmPass)
      e.confirmPass = "Please confirm your password";
    else if (newPass !== confirmPass)
      e.confirmPass = "Passwords do not match";
    return e;
  };

  /* ── Submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, newPassword: newPass }),
      });
      const data = await res.json();

      if (res.status === 400 && data.message?.toLowerCase().includes("expir")) {
        // Token expired
        setTokenValid(false);
        return;
      }
      if (!res.ok) throw new Error(data.message || "Password reset failed.");

      setDone(true);
    } catch (err) {
      Swal.fire({ title: "Reset Failed", text: err.message, icon: "error", ...swalCfg });
    } finally {
      setLoading(false);
    }
  };

  const passScore    = PASSWORD_RULES.filter((r) => r.test(newPass)).length;
  const strengthMeta = STRENGTH_META[passScore] || null;

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className={`ssaa-root ${isDarkMode ? "dark" : "light"}`}>

      {/* Ambient */}
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
              <Shield size={12} />
              <span>Password Reset</span>
            </div>
            <h1 className="ssaa-left-title">
              Secure your<br />
              <span className="ssaa-gradient-text">admin account</span>
            </h1>
            <p className="ssaa-left-sub">
              Choose a strong new password. Your account will be fully
              secured once the reset is complete.
            </p>

            <div className="ssaa-features">
              {[
                { icon: KeyRound,    title: "Single-use Token",     desc: "Cleared after successful reset" },
                { icon: Shield,      title: "1-hour Expiry",        desc: "resetPasswordExpires protection" },
                { icon: Sparkles,    title: "bcrypt Hashing",       desc: "12 salt rounds on every save" },
              ].map((f, i) => (
                <div className="ssaa-feature-row" key={i} style={{ animationDelay: `${i * 120}ms` }}>
                  <div className="ssaa-feature-icon-wrap"><f.icon size={14} /></div>
                  <div>
                    <div className="ssaa-feature-title">{f.title}</div>
                    <div className="ssaa-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="ssaa-left-footer">
            © {new Date().getFullYear()} ShivamStack — All rights reserved
          </footer>
        </aside>

        {/* ══════════ RIGHT CONTENT PANEL ══════════ */}
        <main className="ssaa-panel-right">
          <div className="ssaa-card">

            {/* ── Checking token ── */}
            {tokenValid === null && (
              <div className="ssaa-success-state">
                <div className="ssaa-token-checking">
                  <span className="ssaa-spinner ssaa-spinner-dark" />
                  <span>Validating reset link…</span>
                </div>
              </div>
            )}

            {/* ── Invalid / expired token ── */}
            {tokenValid === false && (
              <div className="ssaa-success-state">
                <div className="ssaa-success-icon-wrap ssaa-icon-wrap-rose">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="ssaa-card-title ssaa-text-center">Link expired or invalid</h2>
                <p className="ssaa-success-sub">
                  This password reset link has expired or has already been used.
                  Reset links are valid for <strong>1 hour</strong> and can only be used once.
                </p>
                <Link to="/admin/forgot-password" className="ssaa-submit-btn ssaa-btn-amber" style={{ textDecoration: "none" }}>
                  <span>Request new link</span><ArrowRight size={15} />
                </Link>
                <Link to="/admin/login" className="ssaa-back-login-link">
                  Back to sign in
                </Link>
              </div>
            )}

            {/* ── Reset form ── */}
            {tokenValid === true && !done && (
              <>
                <div className="ssaa-card-header">
                  <div className="ssaa-card-icon ssaa-icon-purple"><Lock size={19} /></div>
                  <div>
                    <h2 className="ssaa-card-title">Set new password</h2>
                    <p className="ssaa-card-sub">Must be at least 10 characters</p>
                  </div>
                </div>

                <form className="ssaa-form" onSubmit={handleSubmit} noValidate>

                  {/* New Password */}
                  <div className={`ssaa-field ${errors.newPass ? "ssaa-field-err" : ""}`}>
                    <label className="ssaa-label" htmlFor="ssaa-rp-new">New password</label>
                    <div className="ssaa-input-wrap">
                      <span className="ssaa-input-icon"><Lock size={15} /></span>
                      <input
                        id="ssaa-rp-new"
                        className="ssaa-input ssaa-input-pr"
                        type={showNew ? "text" : "password"}
                        placeholder="Create a strong password (min 10 chars)"
                        value={newPass}
                        onChange={(ev) => { setNewPass(ev.target.value); setErrors((e) => ({ ...e, newPass: "" })); }}
                        autoComplete="new-password"
                        autoFocus
                        disabled={loading}
                      />
                      <button type="button" className="ssaa-eye-btn" onClick={() => setShowNew((v) => !v)} tabIndex={-1}>
                        {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.newPass && <span className="ssaa-err-msg">{errors.newPass}</span>}

                    {/* Strength meter */}
                    {newPass && (
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

                    {/* Rules */}
                    {newPass && (
                      <div className="ssaa-rules-grid">
                        {PASSWORD_RULES.map((r, i) => {
                          const ok = r.test(newPass);
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
                  <div className={`ssaa-field ${errors.confirmPass ? "ssaa-field-err" : ""}`}>
                    <label className="ssaa-label" htmlFor="ssaa-rp-confirm">Confirm new password</label>
                    <div className="ssaa-input-wrap">
                      <span className="ssaa-input-icon"><Lock size={15} /></span>
                      <input
                        id="ssaa-rp-confirm"
                        className="ssaa-input ssaa-input-pr"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your new password"
                        value={confirmPass}
                        onChange={(ev) => { setConfirmPass(ev.target.value); setErrors((e) => ({ ...e, confirmPass: "" })); }}
                        autoComplete="new-password"
                        disabled={loading}
                      />
                      <button type="button" className="ssaa-eye-btn" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.confirmPass && <span className="ssaa-err-msg">{errors.confirmPass}</span>}
                    {confirmPass && !errors.confirmPass && newPass === confirmPass && (
                      <span className="ssaa-match-ok"><CheckCircle size={12} /> Passwords match</span>
                    )}
                  </div>

                  <button className="ssaa-submit-btn ssaa-btn-purple" type="submit" disabled={loading}>
                    {loading
                      ? <span className="ssaa-spinner" />
                      : <><span>Reset Password</span><ArrowRight size={15} /></>
                    }
                  </button>

                </form>
              </>
            )}

            {/* ── Done ── */}
            {done && (
              <div className="ssaa-success-state">
                <div className="ssaa-success-icon-wrap ssaa-icon-wrap-green">
                  <CheckCircle size={36} />
                </div>
                <h2 className="ssaa-card-title ssaa-text-center">Password updated!</h2>
                <p className="ssaa-success-sub">
                  Your admin password has been reset successfully.
                  All existing sessions have been invalidated for security.
                </p>
                <button
                  className="ssaa-submit-btn ssaa-btn-green"
                  type="button"
                  onClick={() => navigate("/admin/login")}
                >
                  <span>Sign in now</span><ArrowRight size={15} />
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminResetPassword;