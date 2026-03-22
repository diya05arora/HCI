const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" }
];

function AccessibilityControls({ labels, settings, onSettingsChange }) {
  return (
    <section className="panel controls" aria-labelledby="accessibility-controls-title">
      <h2 id="accessibility-controls-title">{labels.accessibilityControls}</h2>

      <div className="control-grid">
        <label htmlFor="font-size" className="control-block">
          {labels.textSize}
        </label>
        <input
          id="font-size"
          type="range"
          min="1"
          max="1.4"
          step="0.1"
          value={settings.fontScale}
          onChange={(event) =>
            onSettingsChange({
              ...settings,
              fontScale: Number(event.target.value)
            })
          }
        />

        <label htmlFor="contrast-mode" className="control-block">
          {labels.contrastMode}
        </label>
        <select
          id="contrast-mode"
          value={settings.contrastMode}
          onChange={(event) =>
            onSettingsChange({
              ...settings,
              contrastMode: event.target.value
            })
          }
        >
          <option value="normal">{labels.normalContrast}</option>
          <option value="high">{labels.highContrast}</option>
        </select>

        <label htmlFor="language" className="control-block">
          {labels.language}
        </label>
        <select
          id="language"
          value={settings.language}
          onChange={(event) =>
            onSettingsChange({
              ...settings,
              language: event.target.value
            })
          }
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default AccessibilityControls;
