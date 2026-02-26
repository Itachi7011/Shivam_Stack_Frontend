import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Code2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  KeyRound,
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  MailCheck,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

/*
  Flow aligned with schema's resetPasswordToken + resetPasswordExpires:
  ─────────────────────────────────────────────────────────────────────
  STEP 1 (EMAIL):  User enters email → server generates crypto token,
                   stores hash in resetPasswordToken, sets resetPasswordExpires
                   (Date.now() + 3600000), emails a reset link.

  STEP 2 (SENT):   "Check your inbox" confirmation screen.
                   Token is passed via URL ?token=<hex32> when user clicks email link.

  STEP 3 (RESET):  If ?token= is present in URL, skip to password reset form.
                   User sets new password (min 10 chars per schema).

  STEP 4 (DONE):   Success screen with link back to login.
*/

const PASSWORD_RULES = [
  { label: "At least 10 characters", test: (v) => v.length >= 10 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
  { label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_META = [
  null,
  { label: "Very Weak", color: "#ef4444" },
  { label: "Weak", color: "#f97316" },
  { label: "Fair", color: "#f59e0b" },
  { label: "Good", color: "#22d3ee" },
  { label: "Strong", color: "#10b981" },
];

const STEPS = { EMAIL: "email", SENT: "sent", RESET: "reset", DONE: "done" };

const AdminForgotPassword = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [token, setToken] = useState(""); // from URL ?token=
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passErrors, setPassErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const swalCfg = {
    background: isDarkMode ? "#0d1117" : "#fff",
    color: isDarkMode ? "#e2e8f0" : "#1a202c",
    confirmButtonColor: "#6c63ff",
  };

  /* ── On mount: check if ?token= is in URL (user clicked email link) ─── */
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      setStep(STEPS.RESET);
    }
  }, [searchParams]);

  /* ── Resend cooldown ticker ──────────────────────────────────────────── */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  /* ── Step 1: request reset email ─────────────────────────────────────── */
  const handleSendEmail = async (ev) => {
    ev.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      // Always show "sent" screen regardless — prevents email enumeration
      if (!res.ok && res.status !== 404) {
        throw new Error(data.message || "Failed to send reset email");
      }
      setStep(STEPS.SENT);
      setResendCooldown(60);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        ...swalCfg,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend ──────────────────────────────────────────────────────────── */
  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    try {
      await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setResendCooldown(60);
      Swal.fire({
        title: "Email Sent!",
        text: "A new reset link has been sent.",
        icon: "success",
        ...swalCfg,
      });
    } catch {
      // silent fail — same email enumeration protection
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: reset password ──────────────────────────────────────────── */
  const handleResetPassword = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!newPass) e.newPass = "Password is required";
    else if (!PASSWORD_RULES.every((r) => r.test(newPass)))
      e.newPass = "Password does not meet all requirements";
    if (!confirmPass) e.confirmPass = "Please confirm your password";
    else if (newPass !== confirmPass) e.confirmPass = "Passwords do not match";
    if (Object.keys(e).length) {
      setPassErrors(e);
      return;
    }

    setPassErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || "Reset failed. The link may have expired.",
        );
      setStep(STEPS.DONE);
    } catch (err) {
      Swal.fire({
        title: "Reset Failed",
        text: err.message,
        icon: "error",
        ...swalCfg,
      });
    } finally {
      setLoading(false);
    }
  };

  const passScore = PASSWORD_RULES.filter((r) => r.test(newPass)).length;
  const strengthMeta = STRENGTH_META[passScore] || null;

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
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
            <div className="ssaa-logo-mark">
              <Code2 size={24} />
            </div>
            <span className="ssaa-brand-name">
              Shivam<strong>Stack</strong>
            </span>
          </div>

          <div className="ssaa-left-body">
            <div className="ssaa-eyebrow">
              <Shield size={12} />
              <span>Account Recovery</span>
            </div>
            <h1 className="ssaa-left-title">
              Regain
              <br />
              <span className="ssaa-gradient-text">secure access</span>
            </h1>
            <p className="ssaa-left-sub">
              We'll send a secure reset link to your email. The link is valid
              for <strong>1 hour</strong> and can only be used once.
            </p>

            <div className="ssaa-features">
              {[
                {
                  icon: KeyRound,
                  title: "Crypto-secure Token",
                  desc: "32-byte hex token via Node crypto",
                },
                {
                  icon: Shield,
                  title: "1-hour Expiry",
                  desc: "resetPasswordExpires protection",
                },
                {
                  icon: CheckCircle,
                  title: "Single-use Link",
                  desc: "Token cleared after successful reset",
                },
              ].map((f, i) => (
                <div
                  className="ssaa-feature-row"
                  key={i}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="ssaa-feature-icon-wrap">
                    <f.icon size={14} />
                  </div>
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
            {/* ──────────── STEP 1: Enter email ──────────── */}
            {step === STEPS.EMAIL && (
              <>
                <div className="ssaa-card-header">
                  <div className="ssaa-card-icon ssaa-icon-amber">
                    <KeyRound size={19} />
                  </div>
                  <div>
                    <h2 className="ssaa-card-title">Forgot password?</h2>
                    <p className="ssaa-card-sub">
                      Enter your admin email to receive a reset link
                    </p>
                  </div>
                </div>

                <form
                  className="ssaa-form"
                  onSubmit={handleSendEmail}
                  noValidate
                >
                  <div
                    className={`ssaa-field ${emailError ? "ssaa-field-err" : ""}`}
                  >
                    <label className="ssaa-label" htmlFor="ssaa-fp-email">
                      Admin email address
                    </label>
                    <div className="ssaa-input-wrap">
                      <span className="ssaa-input-icon">
                        <Mail size={15} />
                      </span>
                      <input
                        id="ssaa-fp-email"
                        className="ssaa-input"
                        type="email"
                        placeholder="admin@shivamstack.com"
                        value={email}
                        onChange={(ev) => {
                          setEmail(ev.target.value);
                          setEmailError("");
                        }}
                        autoComplete="email"
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                    {emailError && (
                      <span className="ssaa-err-msg">{emailError}</span>
                    )}
                  </div>

                  <button
                    className="ssaa-submit-btn ssaa-btn-amber"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="ssaa-spinner" />
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="ssaa-divider">
                  <span>or</span>
                </div>
                <p className="ssaa-switch-text">
                  Remembered your password?{" "}
                  <Link to="/admin/login" className="ssaa-switch-link">
                    <ArrowLeft size={11} /> Back to sign in
                  </Link>
                </p>
              </>
            )}

            {/* ──────────── STEP 2: Email sent ──────────── */}
            {step === STEPS.SENT && (
              <div className="ssaa-success-state">
                <div className="ssaa-success-icon-wrap ssaa-icon-wrap-amber">
                  <MailCheck size={32} />
                </div>
                <h2 className="ssaa-card-title ssaa-text-center">
                  Check your inbox
                </h2>
                <p className="ssaa-success-sub">
                  We've sent a password reset link to{" "}
                  <strong className="ssaa-highlight-email">{email}</strong>. The
                  link expires in <strong>1 hour</strong>.
                </p>

                <div className="ssaa-inbox-steps">
                  {[
                    "Open the email from ShivamStack Admin",
                    'Click the "Reset Password" button',
                    "Set your new password (min 10 chars)",
                  ].map((s, i) => (
                    <div className="ssaa-inbox-step" key={i}>
                      <span className="ssaa-inbox-step-num">{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`ssaa-resend-btn ${resendCooldown > 0 ? "ssaa-resend-disabled" : ""}`}
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  type="button"
                >
                  {loading ? (
                    <span className="ssaa-spinner ssaa-spinner-sm" />
                  ) : (
                    <>
                      <RefreshCw size={13} />
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend email"}
                    </>
                  )}
                </button>

                <Link to="/admin/login" className="ssaa-back-login-link">
                  <ArrowLeft size={13} /> Back to sign in
                </Link>
              </div>
            )}

            {/* ──────────── STEP 3: Reset password form ──────────── */}
            {step === STEPS.RESET && (
              <>
                <div className="ssaa-card-header">
                  <div className="ssaa-card-icon ssaa-icon-purple">
                    <Lock size={19} />
                  </div>
                  <div>
                    <h2 className="ssaa-card-title">Set new password</h2>
                    <p className="ssaa-card-sub">
                      Must be at least 10 characters
                    </p>
                  </div>
                </div>

                <form
                  className="ssaa-form"
                  onSubmit={handleResetPassword}
                  noValidate
                >
                  {/* New password */}
                  <div
                    className={`ssaa-field ${passErrors.newPass ? "ssaa-field-err" : ""}`}
                  >
                    <label className="ssaa-label" htmlFor="ssaa-fp-new">
                      New password
                    </label>
                    <div className="ssaa-input-wrap">
                      <span className="ssaa-input-icon">
                        <Lock size={15} />
                      </span>
                      <input
                        id="ssaa-fp-new"
                        className="ssaa-input ssaa-input-pr"
                        type={showNew ? "text" : "password"}
                        placeholder="Create a strong password (min 10 chars)"
                        value={newPass}
                        onChange={(ev) => {
                          setNewPass(ev.target.value);
                          setPassErrors((e) => ({ ...e, newPass: "" }));
                        }}
                        autoComplete="new-password"
                        autoFocus
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="ssaa-eye-btn"
                        onClick={() => setShowNew((v) => !v)}
                        tabIndex={-1}
                      >
                        {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {passErrors.newPass && (
                      <span className="ssaa-err-msg">{passErrors.newPass}</span>
                    )}

                    {/* Strength meter */}
                    {newPass && (
                      <div className="ssaa-strength-wrap">
                        <div className="ssaa-strength-track">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className="ssaa-strength-seg"
                              style={{
                                background:
                                  passScore >= n
                                    ? strengthMeta?.color
                                    : undefined,
                              }}
                            />
                          ))}
                        </div>
                        {strengthMeta && (
                          <span
                            className="ssaa-strength-label"
                            style={{ color: strengthMeta.color }}
                          >
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
                            <div
                              key={i}
                              className={`ssaa-rule-item ${ok ? "ssaa-rule-ok" : "ssaa-rule-no"}`}
                            >
                              {ok ? (
                                <CheckCircle size={11} />
                              ) : (
                                <XCircle size={11} />
                              )}
                              <span>{r.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div
                    className={`ssaa-field ${passErrors.confirmPass ? "ssaa-field-err" : ""}`}
                  >
                    <label className="ssaa-label" htmlFor="ssaa-fp-confirm">
                      Confirm new password
                    </label>
                    <div className="ssaa-input-wrap">
                      <span className="ssaa-input-icon">
                        <Lock size={15} />
                      </span>
                      <input
                        id="ssaa-fp-confirm"
                        className="ssaa-input ssaa-input-pr"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your new password"
                        value={confirmPass}
                        onChange={(ev) => {
                          setConfirmPass(ev.target.value);
                          setPassErrors((e) => ({ ...e, confirmPass: "" }));
                        }}
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
                    {passErrors.confirmPass && (
                      <span className="ssaa-err-msg">
                        {passErrors.confirmPass}
                      </span>
                    )}
                    {confirmPass &&
                      !passErrors.confirmPass &&
                      newPass === confirmPass && (
                        <span className="ssaa-match-ok">
                          <CheckCircle size={12} /> Passwords match
                        </span>
                      )}
                  </div>

                  <button
                    className="ssaa-submit-btn ssaa-btn-purple"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="ssaa-spinner" />
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ──────────── STEP 4: Done ──────────── */}
            {step === STEPS.DONE && (
              <div className="ssaa-success-state">
                <div className="ssaa-success-icon-wrap ssaa-icon-wrap-green">
                  <CheckCircle size={36} />
                </div>
                <h2 className="ssaa-card-title ssaa-text-center">
                  Password reset!
                </h2>
                <p className="ssaa-success-sub">
                  Your password has been updated successfully. You can now sign
                  in with your new credentials.
                </p>
                <button
                  className="ssaa-submit-btn ssaa-btn-green"
                  type="button"
                  onClick={() => navigate("/admin/login")}
                >
                  <span>Go to Sign In</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
