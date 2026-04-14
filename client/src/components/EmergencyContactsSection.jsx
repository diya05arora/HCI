import { useState } from "react";

function EmergencyContactsSection({ labels, contacts, onCall, onAddContact }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    relation: "",
    phone: "",
    priority: 1
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!onAddContact || isSaving) {
      return;
    }

    setIsSaving(true);
    const saved = await onAddContact({
      name: form.name.trim(),
      relation: form.relation.trim(),
      phone: form.phone.trim(),
      priority: Number(form.priority) || 1
    });
    setIsSaving(false);

    if (saved) {
      setForm({ name: "", relation: "", phone: "", priority: 1 });
      setIsDialogOpen(false);
    }
  };

  return (
    <section
      id="emergency-contacts"
      className="panel emergency-panel"
      aria-labelledby="emergency-title"
      tabIndex="-1"
    >
      <div className="emergency-header-row">
        <h4 id="emergency-title">{labels.emergencyContacts}</h4>
        <button
          type="button"
          className="emergency-add-trigger"
          onClick={() => setIsDialogOpen(true)}
        >
          + {labels.addEmergencyContact || "Add Emergency Contact"}
        </button>
      </div>

      {isDialogOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="add-emergency-title">
          <form className="modal-card emergency-add-form" onSubmit={handleSubmit}>
            <h5 id="add-emergency-title">{labels.addEmergencyContact || "Add Emergency Contact"}</h5>
            <div className="emergency-add-grid">
              <label>
                {labels.contactName || "Name"}
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder={labels.contactName || "Name"}
                  required
                />
              </label>
              <label>
                {labels.contactRelation || "Relation"}
                <input
                  type="text"
                  value={form.relation}
                  onChange={(event) => setForm((prev) => ({ ...prev, relation: event.target.value }))}
                  placeholder={labels.contactRelation || "Relation"}
                  required
                />
              </label>
              <label>
                {labels.contactPhone || "Phone"}
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="+91-9876543210"
                  required
                />
              </label>
              <label>
                {labels.contactPriority || "Priority"}
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={form.priority}
                  onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
                />
              </label>
            </div>
            <div className="modal-actions emergency-add-actions">
              <button type="button" className="plain-btn" onClick={() => setIsDialogOpen(false)}>
                {labels.cancel || "Cancel"}
              </button>
              <button className="emergency-save-btn" type="submit" disabled={isSaving}>
                {isSaving ? (labels.pleaseWait || "Please wait...") : (labels.saveContact || "Save Contact")}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="card-grid">
        {contacts.map((contact) => (
          <article key={contact._id} className="contact-card">
            <h3>{contact.name}</h3>
            <p>{contact.relation}</p>
            <p>{contact.phone}</p>
            <button
              className="danger-btn"
              onClick={() => onCall(contact)}
              aria-label={`${labels.callNow}: ${contact.name}`}
            >
              {labels.callNow}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EmergencyContactsSection;
