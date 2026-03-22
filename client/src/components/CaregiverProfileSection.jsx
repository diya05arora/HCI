function CaregiverProfileSection({ labels, profile, onFieldChange, onSave, saving }) {
  return (
    <section className="panel" aria-labelledby="caregiver-title">
      <h2 id="caregiver-title">{labels.caregiverProfile}</h2>
      <form className="auth-form" onSubmit={onSave}>
        <label>
          {labels.relationshipToElder}
          <input
            type="text"
            value={profile.relationshipToElder}
            onChange={(event) => onFieldChange("relationshipToElder", event.target.value)}
            required
          />
        </label>

        <label>
          {labels.elderName}
          <input
            type="text"
            value={profile.elderName}
            onChange={(event) => onFieldChange("elderName", event.target.value)}
            required
          />
        </label>

        <label>
          {labels.elderAge}
          <input
            type="number"
            min="1"
            max="120"
            value={profile.elderAge}
            onChange={(event) => onFieldChange("elderAge", event.target.value)}
            required
          />
        </label>

        <label>
          {labels.notes}
          <textarea
            value={profile.notes}
            onChange={(event) => onFieldChange("notes", event.target.value)}
            rows={4}
          />
        </label>

        <button className="quick-action-btn auth-submit" type="submit" disabled={saving}>
          {saving ? labels.pleaseWait : labels.saveProfile}
        </button>
      </form>
    </section>
  );
}

export default CaregiverProfileSection;
