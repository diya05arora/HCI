import { useEffect, useMemo, useRef, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMMON_EMAIL_TYPOS = {
  "@gm.com": "gmail.com",
  "@gmil.com": "gmail.com",
  "@gmal.com": "gmail.com",
  "@yaho.com": "yahoo.com",
  "@hotnail.com": "hotmail.com"
};

function AuthPage({ labels, authMode, authForm, authSubmitting, onModeChange, onFieldChange, onSubmit, statusMessage }) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [inputVersion, setInputVersion] = useState(0);
  const [submittedInputVersion, setSubmittedInputVersion] = useState(-1);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const text = {
    invalidEmail: labels.invalidEmail || "Please enter a valid email address.",
    shortPassword: labels.shortPassword || "Password must be at least 6 characters.",
    confirmPassword: labels.confirmPassword || "Confirm Password",
    passwordMismatch: labels.passwordMismatch || "Passwords do not match.",
    passwordHint: labels.passwordHint || "Use at least 6 characters.",
    signInTitle: labels.signInTitle || "Sign in to continue",
    registerTitle: labels.registerTitle || "Create your account",
    signInSubtitle: labels.signInSubtitle || "Access your care tools securely.",
    registerSubtitle: labels.registerSubtitle || "Set up your account to get started.",
    showPassword: labels.showPassword || "Show",
    hidePassword: labels.hidePassword || "Hide"
  };

  const renderToggleContent = (isVisible) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {isVisible ? (
          <>
            <path
              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d="M4 4l16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path
              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          </>
        )}
      </svg>
      <span>{isVisible ? text.hidePassword : text.showPassword}</span>
    </span>
  );

  const helperSlotStyle = {
    minHeight: "1.25rem"
  };

  const inlineErrorStyle = {
    margin: 0,
    color: "#b91c1c",
    fontSize: "0.92rem",
    fontWeight: 700,
    lineHeight: 1.25
  };

  const messageBoxBaseStyle = {
    minHeight: "3.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const successMessageStyle = {
    background: "#dcfce7",
    borderColor: "#16a34a",
    color: "#166534"
  };

  useEffect(() => {
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setSubmitAttempted(false);
    setInputVersion(0);
    setSubmittedInputVersion(-1);

    if (authMode === "register") {
      nameInputRef.current?.focus();
      return;
    }

    emailInputRef.current?.focus();
  }, [authMode]);

  const errors = useMemo(() => {
    const next = {};
    const email = (authForm.email || "").trim();
    const password = authForm.password || "";
    const hasCommonTypoEmail = Object.keys(COMMON_EMAIL_TYPOS).some((suffix) => email.toLowerCase().endsWith(suffix));

    if (!EMAIL_REGEX.test(email)) {
      next.email = text.invalidEmail;
    }

    if (hasCommonTypoEmail) {
      const matchedTypo = Object.entries(COMMON_EMAIL_TYPOS).find(([suffix]) => email.toLowerCase().endsWith(suffix));
      if (matchedTypo) {
        next.emailSuggestion = `Did you mean ${matchedTypo[1]}?`;
      }
    }

    if (password.length < 6) {
      next.password = text.shortPassword;
    }

    if (authMode === "register" && confirmPassword !== password) {
      next.confirmPassword = text.passwordMismatch;
    }

    return next;
  }, [authForm.email, authForm.password, confirmPassword, authMode, text.invalidEmail, text.passwordMismatch, text.shortPassword]);

  const visibleErrors = submitAttempted
    ? {
        email: errors.email,
        password: errors.password,
        confirmPassword: errors.confirmPassword
      }
    : {};
  const hasInlineErrors = Boolean(visibleErrors.email || visibleErrors.password || visibleErrors.confirmPassword);

  const handleFieldChange = (field, value) => {
    setInputVersion((current) => current + 1);
    onFieldChange(field, value);
  };

  const handleConfirmPasswordChange = (value) => {
    setInputVersion((current) => current + 1);
    setConfirmPassword(value);
  };

  const handleSubmit = (event) => {
    setSubmitAttempted(true);
    setSubmittedInputVersion(inputVersion);

    const currentEmail = (authForm.email || "").trim().toLowerCase();
    const emailOk = EMAIL_REGEX.test(currentEmail);
    const passwordOk = (authForm.password || "").length >= 6;
    const confirmOk = authMode !== "register" || confirmPassword === (authForm.password || "");

    if (!emailOk || !passwordOk || !confirmOk) {
      event.preventDefault();
      return;
    }

    onSubmit(event);
  };

  const message = (statusMessage || "").trim();
  const successMessages = [labels.registerSuccess, labels.loginSuccess].filter(Boolean);
  const isSuccessMessage = successMessages.includes(message);
  const showStatusMessage =
    Boolean(message) &&
    !hasInlineErrors &&
    submitAttempted &&
    submittedInputVersion === inputVersion;

  const inputStateStyle = (fieldError, hasValue) => {
    if (!submitAttempted) {
      return {};
    }

    if (fieldError) {
      return {
        borderColor: "var(--danger)",
        boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.12)"
      };
    }

    if (hasValue) {
      return {
        borderColor: "var(--accent)",
        boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.12)"
      };
    }

    return {};
  };

  const pageSubmittingStyle = authSubmitting
    ? {
        opacity: 0.92
      }
    : {};

  const pageInteractionStyle = authSubmitting
    ? {
        pointerEvents: "none"
      }
    : {};

  const modeHeading = authMode === "login" ? text.signInTitle : text.registerTitle;
  const modeCopy = authMode === "login" ? text.signInSubtitle : text.registerSubtitle;

  return (
    <div className="auth-page-full auth-page-professional" style={pageSubmittingStyle}>
      <div className="auth-page-center" style={pageInteractionStyle}>
        <div className="auth-header-section">
          <h1>{modeHeading}</h1>
          <p>{modeCopy}</p>
        </div>

        <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={authMode === "login"}
            aria-controls="auth-form"
            className={`auth-mode-btn ${authMode === "login" ? "auth-mode-active" : ""}`}
            onClick={() => onModeChange("login")}
            disabled={authSubmitting}
          >
            {labels.signIn}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={authMode === "register"}
            aria-controls="auth-form"
            className={`auth-mode-btn ${authMode === "register" ? "auth-mode-active" : ""}`}
            onClick={() => onModeChange("register")}
            disabled={authSubmitting}
          >
            {labels.createAccount}
          </button>
        </div>

        <form id="auth-form" className="auth-page-form" onSubmit={handleSubmit} noValidate>
          {authMode === "register" && (
            <div className="auth-form-group">
              <label htmlFor="fname">{labels.fullName}</label>
              <input
                ref={nameInputRef}
                id="fname"
                type="text"
                value={authForm.fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                autoComplete="name"
                aria-label={labels.fullName}
                style={inputStateStyle(visibleErrors.fullName, Boolean(authForm.fullName))}
                className="auth-input-large"
                required
              />
            </div>
          )}

          <div className="auth-form-group">
            <label htmlFor="femail">{labels.email}</label>
            <input
              ref={authMode === "login" ? emailInputRef : null}
              id="femail"
              type="email"
              value={authForm.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              inputMode="email"
              autoComplete="email"
              aria-label={labels.email}
              aria-invalid={Boolean(visibleErrors.email)}
              aria-describedby={visibleErrors.email ? "email-error" : undefined}
              className="auth-input-large"
              style={inputStateStyle(visibleErrors.email, Boolean((authForm.email || "").trim()))}
              required
            />
            {visibleErrors.email && (
              <div style={helperSlotStyle}>
                <p id="email-error" role="alert" aria-live="assertive" style={inlineErrorStyle}>
                  {visibleErrors.email}
                </p>
              </div>
            )}
            {!visibleErrors.email && submitAttempted && errors.emailSuggestion && (
              <div style={helperSlotStyle}>
                <p
                  role="status"
                  aria-live="polite"
                  style={{ margin: 0, color: "#9a3412", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.25 }}
                >
                  {errors.emailSuggestion}
                </p>
              </div>
            )}
            {!visibleErrors.email && !(submitAttempted && errors.emailSuggestion) && <div style={helperSlotStyle} aria-hidden="true" />}
          </div>

          <div className="auth-form-group">
            <label htmlFor="fpass">{labels.password}</label>
            <div className="auth-password-row">
              <input
                id="fpass"
                type={showPassword ? "text" : "password"}
                value={authForm.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                minLength={6}
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
                aria-label={labels.password}
                aria-invalid={Boolean(visibleErrors.password)}
                aria-describedby={visibleErrors.password ? "password-error" : undefined}
                className="auth-input-large"
                style={inputStateStyle(visibleErrors.password, Boolean(authForm.password))}
                required
              />
              <button
                type="button"
                className="auth-mode-btn auth-toggle-btn"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? text.hidePassword : text.showPassword}
                disabled={authSubmitting}
              >
                {renderToggleContent(showPassword)}
              </button>
            </div>
            {visibleErrors.password && (
              <div style={helperSlotStyle}>
                <p id="password-error" role="alert" aria-live="assertive" style={inlineErrorStyle}>
                  {visibleErrors.password}
                </p>
              </div>
            )}
            {!visibleErrors.password && <div style={helperSlotStyle} aria-hidden="true" />}
            <p style={{ margin: "-0.1rem 0 0", color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: 600 }}>
              {text.passwordHint}
            </p>
          </div>

          {authMode === "register" && (
            <>
              <div className="auth-form-group">
                <label htmlFor="fconfirm">{text.confirmPassword}</label>
                <div className="auth-password-row">
                  <input
                    id="fconfirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    minLength={6}
                    autoComplete="new-password"
                    aria-label={text.confirmPassword}
                    aria-invalid={Boolean(visibleErrors.confirmPassword)}
                    aria-describedby={visibleErrors.confirmPassword ? "confirm-error" : undefined}
                    className="auth-input-large"
                    style={inputStateStyle(visibleErrors.confirmPassword, Boolean(confirmPassword))}
                    required
                  />
                  <button
                    type="button"
                    className="auth-mode-btn auth-toggle-btn"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={showConfirmPassword ? text.hidePassword : text.showPassword}
                    disabled={authSubmitting}
                  >
                    {renderToggleContent(showConfirmPassword)}
                  </button>
                </div>
                {visibleErrors.confirmPassword && (
                  <div style={helperSlotStyle}>
                    <p id="confirm-error" role="alert" aria-live="assertive" style={inlineErrorStyle}>
                      {visibleErrors.confirmPassword}
                    </p>
                  </div>
                )}
                {!visibleErrors.confirmPassword && <div style={helperSlotStyle} aria-hidden="true" />}
              </div>

              <div className="auth-form-group">
                <label htmlFor="frole">{labels.accountType}</label>
                <select
                  id="frole"
                  value={authForm.role}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  aria-label={labels.accountType}
                  className="auth-input-large"
                >
                  <option value="elderly">{labels.elderlyUser}</option>
                  <option value="caregiver">{labels.caregiverUser}</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-large" disabled={authSubmitting} aria-busy={authSubmitting}>
            {authSubmitting ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 12 12"
                      to="360 12 12"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
                
                {labels.pleaseWait}
              </span>
            ) : authMode === "login" ? (
              labels.signIn
            ) : (
              labels.createAccount
            )}
          </button>
        </form>

        {showStatusMessage && (
          <div
            className="auth-message-box"
            role={isSuccessMessage ? "status" : "alert"}
            aria-live="polite"
            style={{
              ...messageBoxBaseStyle,
              ...(isSuccessMessage ? successMessageStyle : {})
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;