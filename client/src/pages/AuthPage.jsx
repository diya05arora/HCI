import { useState } from "react";

function AuthPage({ labels, authMode, authForm, authSubmitting, onModeChange, onFieldChange, onSubmit, statusMessage }) {
  const [mode, setMode] = useState(authMode);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    onModeChange(newMode);
  };

  return (
    <div className="auth-page-full">
      <div className="auth-page-center">
        <div className="auth-header-section">
          <h1>{labels.appTitle}</h1>
          <p>{labels.appSubtitle}</p>
        </div>

        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`auth-mode-btn ${mode === "login" ? "auth-mode-active" : ""}`}
            onClick={() => handleModeChange("login")}
          >
            {labels.signIn}
          </button>
          <button
            type="button"
            className={`auth-mode-btn ${mode === "register" ? "auth-mode-active" : ""}`}
            onClick={() => handleModeChange("register")}
          >
            {labels.createAccount}
          </button>
        </div>

        <form className="auth-page-form" onSubmit={onSubmit}>
          {mode === "register" && (
            <div className="auth-form-group">
              <label htmlFor="fname">{labels.fullName}</label>
              <input
                id="fname"
                type="text"
                value={authForm.fullName}
                onChange={(e) => onFieldChange("fullName", e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-form-group">
            <label htmlFor="femail">{labels.email}</label>
            <input
              id="femail"
              type="email"
              value={authForm.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="fpass">{labels.password}</label>
            <input
              id="fpass"
              type="password"
              value={authForm.password}
              onChange={(e) => onFieldChange("password", e.target.value)}
              minLength={6}
              required
            />
          </div>

          {mode === "register" && (
            <div className="auth-form-group">
              <label htmlFor="frole">{labels.accountType}</label>
              <select
                id="frole"
                value={authForm.role}
                onChange={(e) => onFieldChange("role", e.target.value)}
              >
                <option value="elderly">{labels.elderlyUser}</option>
                <option value="caregiver">{labels.caregiverUser}</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-submit-large" disabled={authSubmitting}>
            {authSubmitting ? labels.pleaseWait : mode === "login" ? labels.signIn : labels.createAccount}
          </button>
        </form>

        {statusMessage && <div className="auth-message-box">{statusMessage}</div>}
      </div>
    </div>
  );
}

export default AuthPage;
