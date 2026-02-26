import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

/*
  Aligned with User schema:
  ─────────────────────────────────────────────────────────────────────
  - resetPasswordToken   : 32-byte hex (crypto.randomBytes)
  - resetPasswordExpires : Date.now() + 3600000  (1 hour)
  - password minlength   : 8
  ─────────────────────────────────────────────────────────────────────
  Reached when user clicks link in email: /reset-password?token=<hex32>
*/

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

const UserResetPassword = () => {
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
    confirmButtonColor: "#6366f1",
  };

  /* ── Extract & pre-validate token from URL ───────────────────────────── */
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) { setTokenValid(false); return; }
    setToken(urlToken);
    (async () => {
      try {
        const res = await fetch("/api/users/validate-reset-token", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ token: urlToken }),
        });
        setTokenValid(res.ok);
      } catch {
        setTokenValid(true); // fall-through; let submit handle it
      }
    })();
  }, [searchParams]);

  /* ── Validate ─────────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!newPass)
      e.newPass = "Password is required";
    else if (!PASSWORD_RULES.every((r) => r.test(newPass)))
      e.newPass = "Password does not meet all requirements";
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
      const res  = await fetch("/api/users/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, newPassword: newPass }),
      });
      const data = await res.json();

      if (res.status === 400 && data.message?.toLowerCase().includes("expir")) {
        setTokenValid(false); return;
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

            {/* ── Checking ── */}
            {tokenValid === null && (
              <div className="sua-verify-state">
                <div className="sua-token-checking">
                  <span className="sua-spinner sua-spinner-indigo" />
                  <span>Validating reset link…</span>
                </div>
              </div>
            )}

            {/* ── Invalid / expired ── */}
            {tokenValid === false && (
              <div className="sua-verify-state">
                <div className="sua-verify-icon-wrap sua-verify-icon-rose">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="sua-card-title sua-text-center">Link expired or invalid</h2>
                <p className="sua-verify-sub">
                  This password reset link has expired or has already been used.
                  Reset links are valid for <strong>1 hour</strong>.
                </p>
                <Link
                  to="/forgot-password"
                  className="sua-submit-btn sua-btn-amber"
                  style={{ textDecoration: "none" }}
                >
                  <span>Request a new link</span><ArrowRight size={15} />
                </Link>
                <Link to="/login" className="sua-back-link">Back to sign in</Link>
              </div>
            )}

            {/* ── Reset form ── */}
            {tokenValid === true && !done && (
              <>
                <div className="sua-card-head">
                  <div className="sua-card-hero-icon">
                    <Lock size={22} />
                  </div>
                  <h1 className="sua-card-title">Set new password</h1>
                  <p className="sua-card-sub">Must be at least 8 characters</p>
                </div>

                <form className="sua-form" onSubmit={handleSubmit} noValidate>

                  {/* New password */}
                  <div className={`sua-field ${errors.newPass ? "sua-field-err" : ""}`}>
                    <label className="sua-label" htmlFor="sua-rp-new">New password</label>
                    <div className="sua-input-wrap">
                      <span className="sua-input-icon"><Lock size={15} /></span>
                      <input
                        id="sua-rp-new"
                        className="sua-input sua-input-pr"
                        type={showNew ? "text" : "password"}
                        placeholder="Create a new password (min 8 chars)"
                        value={newPass}
                        onChange={(ev) => { setNewPass(ev.target.value); setErrors((e) => ({ ...e, newPass: "" })); }}
                        autoComplete="new-password"
                        autoFocus
                        disabled={loading}
                      />
                      <button type="button" className="sua-eye-btn" onClick={() => setShowNew((v) => !v)} tabIndex={-1}>
                        {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.newPass && <span className="sua-err-msg">{errors.newPass}</span>}

                    {newPass && (
                      <div className="sua-strength-wrap">
                        <div className="sua-strength-track">
                          {[1,2,3,4].map((n) => (
                            <div key={n} className="sua-strength-seg"
                              style={{ background: passScore >= n ? strengthMeta?.color : undefined }} />
                          ))}
                        </div>
                        {strengthMeta && (
                          <span className="sua-strength-label" style={{ color: strengthMeta.color }}>
                            {strengthMeta.label}
                          </span>
                        )}
                      </div>
                    )}

                    {newPass && (
                      <div className="sua-rules-grid">
                        {PASSWORD_RULES.map((r, i) => {
                          const ok = r.test(newPass);
                          return (
                            <div key={i} className={`sua-rule-item ${ok ? "sua-rule-ok" : "sua-rule-no"}`}>
                              {ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
                              <span>{r.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div className={`sua-field ${errors.confirmPass ? "sua-field-err" : ""}`}>
                    <label className="sua-label" htmlFor="sua-rp-confirm">Confirm new password</label>
                    <div className="sua-input-wrap">
                      <span className="sua-input-icon"><Lock size={15} /></span>
                      <input
                        id="sua-rp-confirm"
                        className="sua-input sua-input-pr"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your new password"
                        value={confirmPass}
                        onChange={(ev) => { setConfirmPass(ev.target.value); setErrors((e) => ({ ...e, confirmPass: "" })); }}
                        autoComplete="new-password"
                        disabled={loading}
                      />
                      <button type="button" className="sua-eye-btn" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.confirmPass && <span className="sua-err-msg">{errors.confirmPass}</span>}
                    {confirmPass && !errors.confirmPass && newPass === confirmPass && (
                      <span className="sua-match-ok"><CheckCircle size={12} /> Passwords match</span>
                    )}
                  </div>

                  <button className="sua-submit-btn" type="submit" disabled={loading}>
                    {loading
                      ? <span className="sua-spinner" />
                      : <><span>Reset Password</span><ArrowRight size={15} /></>
                    }
                  </button>

                </form>
              </>
            )}

            {/* ── Done ── */}
            {done && (
              <div className="sua-verify-state">
                <div className="sua-verify-icon-wrap sua-verify-icon-green">
                  <CheckCircle size={36} />
                </div>
                <h2 className="sua-card-title sua-text-center">Password updated!</h2>
                <p className="sua-verify-sub">
                  Your password has been reset. You can now sign in with your new credentials.
                </p>
                <button
                  className="sua-submit-btn sua-btn-green"
                  type="button"
                  onClick={() => navigate("/login")}
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

export default UserResetPassword;