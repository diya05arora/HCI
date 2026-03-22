import { useState } from "react";

function AccessibilityPanel({ labels, settings, onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="accessibility-panel-modal">
          <div className="accessibility-panel-content">
            <div className="panel-header">
              <h3>{labels.accessibilityControls}</h3>
              <button
                className="panel-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility panel"
              >
                ✕
              </button>
            </div>

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
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccessibilityPanel;
