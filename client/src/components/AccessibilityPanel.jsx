import { useState } from "react";

function AccessibilityPanel({ labels, settings, onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderCloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const handleFontChange = (event) => {
    onSettingsChange({
      ...settings,
      fontScale: Number(event.target.value)
    });
  };

  const handleContrastChange = (event) => {
    onSettingsChange({
      ...settings,
      contrastMode: event.target.value
    });
  };

  const handleLanguageChange = (event) => {
    onSettingsChange({
      ...settings,
      language: event.target.value
    });
  };

  // Inline styles to avoid global CSS conflicts
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  };

  const contentStyle = {
    background: "var(--surface)",
    border: "2px solid var(--border)",
    borderRadius: "1rem",
    padding: "2rem",
    maxWidth: "90vw",
    width: "420px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "var(--shadow-lg)"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.8rem"
  };

  const titleStyle = {
    margin: 0,
    fontSize: "1.45em",
    color: "var(--text-main)",
    fontWeight: 700,
    letterSpacing: "-0.01em"
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: 0,
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.6rem",
    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    flexShrink: 0
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  };

  const groupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem"
  };

  const labelStyle = {
    display: "block",
    fontWeight: 700,
    fontSize: "0.95em",
    color: "var(--text-main)",
    letterSpacing: "-0.01em"
  };

  const rangeContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem"
  };

  const rangeStyle = {
    flex: 1,
    height: "6px",
    borderRadius: "3px",
    background: "var(--border)",
    outline: "none",
    WebkitAppearance: "none",
    appearance: "none",
    cursor: "pointer",
    transition: "background 200ms ease"
  };

  const rangeValueStyle = {
    displayInline: "block",
    minWidth: "45px",
    textAlign: "right",
    fontWeight: 700,
    color: "var(--primary)",
    fontSize: "0.95em"
  };

  const selectStyle = {
    padding: "0.8rem 1rem",
    border: "2px solid var(--border)",
    borderRadius: "0.75rem",
    fontSize: "0.95em",
    fontFamily: "inherit",
    background: "var(--surface)",
    color: "var(--text-main)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)"
  };

  return (
    <>
      <button
        className="accessibility-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle accessibility controls"
        title={labels.accessibilityControls}
      >
        ⚙️
      </button>

      {isOpen && (
        <div style={modalStyle}>
          <div style={contentStyle}>
            <div style={headerStyle}>
              <h2 style={titleStyle}>{labels.accessibilityControls}</h2>
              <button
                style={closeButtonStyle}
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility panel"
              >
                {renderCloseIcon()}
              </button>
            </div>

            <div style={formStyle}>
              <div style={groupStyle}>
                <label htmlFor="font-size" style={labelStyle}>
                  {labels.textSize}
                </label>
                <div style={rangeContainerStyle}>
                  <input
                    id="font-size"
                    type="range"
                    min="1"
                    max="1.4"
                    step="0.1"
                    value={settings.fontScale}
                    onChange={handleFontChange}
                    style={rangeStyle}
                    aria-label={labels.textSize}
                  />
                  <span style={rangeValueStyle}>{(settings.fontScale * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div style={groupStyle}>
                <label htmlFor="contrast-mode" style={labelStyle}>
                  {labels.contrastMode}
                </label>
                <select
                  id="contrast-mode"
                  value={settings.contrastMode}
                  onChange={handleContrastChange}
                  style={selectStyle}
                  aria-label={labels.contrastMode}
                >
                  <option value="normal">{labels.normalContrast}</option>
                  <option value="high">{labels.highContrast}</option>
                </select>
              </div>

              <div style={groupStyle}>
                <label htmlFor="language" style={labelStyle}>
                  {labels.language}
                </label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={handleLanguageChange}
                  style={selectStyle}
                  aria-label={labels.language}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccessibilityPanel;
