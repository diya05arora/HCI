function EmergencyContactsSection({ labels, contacts, onCall }) {
  return (
    <section
      id="emergency-contacts"
      className="panel emergency-panel"
      aria-labelledby="emergency-title"
      tabIndex="-1"
    >
      <h2 id="emergency-title">{labels.emergencyContacts}</h2>
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
