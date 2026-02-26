import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  MailCheck,
  RefreshCw,
  KeyRound,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

/*
  Flow — mirrors User schema's resetPasswordToken (crypto.randomBytes 32-byte hex):
  ────────────────────────────────────────────────────────────────────────
  STEP 1 (EMAIL) : User submits email → server generates token, sets
                   resetPasswordToken + resetPasswordExpires (+1h), sends link.
  STEP 2 (SENT)  : "Check your inbox" screen. Resend with 60s cooldown.
  ────────────────────────────────────────────────────────────────────────
  The actual password reset is handled by UserResetPassword.jsx (?token= in URL).
  Always show SENT screen regardless of whether email exists (prevents enumeration).
*/

const STEPS = { EMAIL: "email", SENT: "sent" };

const UserForgotPassword = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [step, setStep]                     = useState(STEPS.EMAIL);
  const [email, setEmail]                   = useState("");
  const [emailError, setEmailError]         = useState("");
  const [loading, setLoading]               = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading]   = useState(false);

  const swalCfg = {
    background: isDarkMode ? "#0d1117" : "#fff",
    color:      isDarkMode ? "#e2e8f0" : "#1a202c",
    confirmButtonColor: "#6366f1",
  };

  /* ── Cooldown ticker ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  /* ── Send reset email ─────────────────────────────────────────────────── */
  const handleSend = async (ev) => {
    ev.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      // Show SENT regardless of 404 (email enumeration protection)
      if (!res.ok && res.status !== 404) {
        throw new Error(data.message || "Failed to send reset email.");
      }
      setStep(STEPS.SENT);
      setResendCooldown(60);
    } catch (err) {
      Swal.fire({ title: "Error", text: err.message, icon: "error", ...swalCfg });
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend ──────────────────────────────────────────────────────────── */
  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      await fetch("/api/users/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setResendCooldown(60);
      Swal.fire({ title: "Email Sent!", text: "A new reset link has been sent.", icon: "success", ...swalCfg });
    } catch {
      // silent — enumeration protection
    } finally {
      setResendLoading(false);
    }
  };

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

        {/* Topbar */}
        <header className="sua-topbar">
          <Link to="/" className="sua-topbar-brand">
            <div className="sua-topbar-logo"><Sparkles size={16} /></div>
            <span>ShivamStack</span>
          </Link>
          <span className="sua-topbar-sep" />
          <span className="sua-topbar-hint">
            Remembered it?{" "}
            <Link to="/login" className="sua-topbar-link">Sign in</Link>
          </span>
        </header>

        <main className="sua-center">
          <div className="sua-card">

            {/* ───── STEP 1: Enter email ───── */}
            {step === STEPS.EMAIL && (
              <>
                <div className="sua-card-head">
                  <div className="sua-card-hero-icon sua-hero-amber">
                    <KeyRound size={22} />
                  </div>
                  <h1 className="sua-card-title">Forgot your password?</h1>
                  <p className="sua-card-sub">
                    Enter your email and we'll send you a secure reset link
                  </p>
                </div>

                <form className="sua-form" onSubmit={handleSend} noValidate>
                  <div className={`sua-field ${emailError ? "sua-field-err" : ""}`}>
                    <label className="sua-label" htmlFor="sua-fp-email">Email address</label>
                    <div className="sua-input-wrap">
                      <span className="sua-input-icon"><Mail size={15} /></span>
                      <input
                        id="sua-fp-email"
                        className="sua-input"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(ev) => { setEmail(ev.target.value); setEmailError(""); }}
                        autoComplete="email"
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                    {emailError && <span className="sua-err-msg">{emailError}</span>}
                  </div>

                  <button className="sua-submit-btn sua-btn-amber" type="submit" disabled={loading}>
                    {loading
                      ? <span className="sua-spinner" />
                      : <><span>Send Reset Link</span><ArrowRight size={15} /></>
                    }
                  </button>
                </form>

                <div className="sua-divider"><span>or</span></div>

                <p className="sua-switch-text">
                  <Link to="/login" className="sua-switch-link">
                    <ArrowLeft size={11} /> Back to sign in
                  </Link>
                </p>
              </>
            )}

            {/* ───── STEP 2: Check inbox ───── */}
            {step === STEPS.SENT && (
              <div className="sua-verify-state">
                <div className="sua-verify-icon-wrap sua-verify-icon-green">
                  <MailCheck size={34} />
                </div>
                <h2 className="sua-card-title sua-text-center">Check your inbox</h2>
                <p className="sua-verify-sub">
                  We sent a reset link to{" "}
                  <strong className="sua-highlight-email">{email}</strong>.
                  The link expires in <strong>1 hour</strong>.
                </p>

                <div className="sua-verify-steps">
                  {[
                    "Open the email from ShivamStack",
                    "Click \"Reset Password\" in the email",
                    "Set your new password on the next page",
                  ].map((s, i) => (
                    <div className="sua-verify-step" key={i}>
                      <span className="sua-step-num">{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`sua-resend-btn ${resendCooldown > 0 ? "sua-resend-disabled" : ""}`}
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resendLoading}
                  type="button"
                >
                  {resendLoading
                    ? <span className="sua-spinner sua-spinner-sm" />
                    : <><RefreshCw size={13} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend email"}
                    </>
                  }
                </button>

                <Link to="/login" className="sua-back-link">
                  <ArrowLeft size={13} /> Back to sign in
                </Link>
              </div>
            )}

          </div>

          <p className="sua-legal">
            Didn't request this?{" "}
            <Link to="/login" className="sua-legal-link">Ignore this email</Link> — your password won't change.
          </p>
        </main>
      </div>
    </div>
  );
};

export default UserForgotPassword;