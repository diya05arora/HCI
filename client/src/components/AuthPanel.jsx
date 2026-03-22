function AuthPanel({
  labels,
  mode,
  form,
  onModeChange,
  onFieldChange,
  onSubmit,
  submitting
}) {
  return (
    <section className="panel" aria-labelledby="auth-title">
      <h2 id="auth-title">{mode === "login" ? labels.signIn : labels.createAccount}</h2>

      <div className="auth-toggle" role="tablist" aria-label={labels.authTabsLabel}>
        <button
          type="button"
          className={`plain-btn ${mode === "login" ? "active-tab" : ""}`}
          onClick={() => onModeChange("login")}
        >
          {labels.signIn}
        </button>
        <button
          type="button"
          className={`plain-btn ${mode === "register" ? "active-tab" : ""}`}
          onClick={() => onModeChange("register")}
        >
          {labels.createAccount}
        </button>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        {mode === "register" && (
          <label>
            {labels.fullName}
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => onFieldChange("fullName", event.target.value)}
              required
            />
          </label>
        )}

        <label>
          {labels.email}
          <input
            type="email"
            value={form.email}
            onChange={(event) => onFieldChange("email", event.target.value)}
            required
          />
        </label>

        <label>
          {labels.password}
          <input
            type="password"
            value={form.password}
            onChange={(event) => onFieldChange("password", event.target.value)}
            required
            minLength={6}
          />
        </label>

        {mode === "register" && (
          <label>
            {labels.accountType}
            <select
              value={form.role}
              onChange={(event) => onFieldChange("role", event.target.value)}
            >
              <option value="elderly">{labels.elderlyUser}</option>
              <option value="caregiver">{labels.caregiverUser}</option>
            </select>
          </label>
        )}

        <button type="submit" className="quick-action-btn auth-submit" disabled={submitting}>
          {submitting ? labels.pleaseWait : mode === "login" ? labels.signIn : labels.createAccount}
        </button>
      </form>
    </section>
  );
}

export default AuthPanel;
