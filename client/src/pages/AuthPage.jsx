import { useEffect, useMemo, useRef, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
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
  const identifierInputRef = useRef(null);

  const text = {
    invalidEmail: labels.invalidEmail || "Please enter a valid email address.",
    invalidPhone: labels.invalidPhone || "Please enter a valid phone number.",
    shortPassword: labels.shortPassword || "Password must be at least 6 characters.",
    confirmPassword: labels.confirmPassword || "Confirm Password",
    passwordMismatch: labels.passwordMismatch || "Passwords do not match.",
    passwordHint: labels.passwordHint || "Use at least 6 characters.",
    signInTitle: labels.signInTitle || "Sign in to continue",
    registerTitle: labels.registerTitle || "Create your account",
    signInSubtitle: labels.signInSubtitle || "Access your care tools securely.",
    registerSubtitle: labels.registerSubtitle || "Set up your account to get started.",
    showPassword: labels.showPassword || "Show",
    hidePassword: labels.hidePassword || "Hide",
    switchToPhone: labels.switchToPhone || "Use Phone",
    switchToEmail: labels.switchToEmail || "Use Email",
    phone: labels.phone || "Phone Number",
    email: labels.email || "Email"
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

    identifierInputRef.current?.focus();
  }, [authMode]);

  const errors = useMemo(() => {
    const next = {};
    const loginMethod = authForm.loginMethod || "email";
    const email = (authForm.email || "").trim();
    const phone = (authForm.phone || "").trim().replace(/[\s-]/g, "");
    const password = authForm.password || "";
    const hasCommonTypoEmail = Object.keys(COMMON_EMAIL_TYPOS).some((suffix) => email.toLowerCase().endsWith(suffix));

    if (loginMethod === "phone") {
      if (!PHONE_REGEX.test(phone)) {
        next.identifier = text.invalidPhone;
      }
    } else if (!EMAIL_REGEX.test(email)) {
      next.identifier = text.invalidEmail;
    }

    if (loginMethod === "email" && hasCommonTypoEmail) {
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
  }, [
    authForm.email,
    authForm.phone,
    authForm.password,
    authForm.loginMethod,
    confirmPassword,
    authMode,
    text.invalidEmail,
    text.invalidPhone,
    text.passwordMismatch,
    text.shortPassword
  ]);

  const visibleErrors = submitAttempted
    ? {
        identifier: errors.identifier,
        password: errors.password,
        confirmPassword: errors.confirmPassword
      }
    : {};
  const hasInlineErrors = Boolean(
    visibleErrors.identifier || visibleErrors.password || visibleErrors.confirmPassword
  );

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

    const loginMethod = authForm.loginMethod || "email";
    const currentEmail = (authForm.email || "").trim().toLowerCase();
    const currentPhone = (authForm.phone || "").trim().replace(/[\s-]/g, "");
    const identifierOk = loginMethod === "phone" ? PHONE_REGEX.test(currentPhone) : EMAIL_REGEX.test(currentEmail);
    const passwordOk = (authForm.password || "").length >= 6;
    const confirmOk = authMode !== "register" || confirmPassword === (authForm.password || "");

    if (!identifierOk || !passwordOk || !confirmOk) {
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
            <label htmlFor="fidentifier">{(authForm.loginMethod || "email") === "phone" ? text.phone : text.email}</label>
            <div className="auth-password-row">
              <input
                ref={identifierInputRef}
                id="fidentifier"
                type={(authForm.loginMethod || "email") === "phone" ? "tel" : "email"}
                value={(authForm.loginMethod || "email") === "phone" ? authForm.phone || "" : authForm.email || ""}
                onChange={(e) => handleFieldChange((authForm.loginMethod || "email") === "phone" ? "phone" : "email", e.target.value)}
                placeholder={(authForm.loginMethod || "email") === "phone" ? "Enter phone number" : "Enter email address"}
                inputMode={(authForm.loginMethod || "email") === "phone" ? "tel" : "email"}
                autoComplete={(authForm.loginMethod || "email") === "phone" ? "tel" : "email"}
                aria-label={(authForm.loginMethod || "email") === "phone" ? text.phone : text.email}
                aria-invalid={Boolean(visibleErrors.identifier)}
                aria-describedby={visibleErrors.identifier ? "identifier-error" : undefined}
                className="auth-input-large"
                style={inputStateStyle(
                  visibleErrors.identifier,
                  Boolean(((authForm.loginMethod || "email") === "phone" ? authForm.phone || "" : authForm.email || "").trim())
                )}
                required
              />
              <button
                type="button"
                className="auth-mode-btn auth-toggle-btn"
                onClick={() => {
                  const newMethod = (authForm.loginMethod || "email") === "phone" ? "email" : "phone";
                  handleFieldChange("loginMethod", newMethod);
                  handleFieldChange(newMethod === "phone" ? "email" : "phone", "");
                  setTimeout(() => identifierInputRef.current?.focus(), 0);
                }}
                aria-label={(authForm.loginMethod || "email") === "phone" ? text.switchToEmail : text.switchToPhone}
                disabled={authSubmitting}
              >
                <span>
                  {(authForm.loginMethod || "email") === "phone" ? text.switchToEmail : text.switchToPhone}
                </span>
              </button>
            </div>
            {visibleErrors.identifier && (
              <div style={helperSlotStyle}>
                <p id="identifier-error" role="alert" aria-live="assertive" style={inlineErrorStyle}>
                  {visibleErrors.identifier}
                </p>
              </div>
            )}
            {!visibleErrors.identifier && submitAttempted && errors.emailSuggestion && (authForm.loginMethod || "email") === "email" && (
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
            {!visibleErrors.identifier && !(submitAttempted && errors.emailSuggestion && (authForm.loginMethod || "email") === "email") && (
              <div style={helperSlotStyle} aria-hidden="true" />
            )}
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