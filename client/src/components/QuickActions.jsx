function QuickActions({ labels }) {
  const actions = [
    { href: "#health-info", text: labels.healthInfo },
    { href: "#medicine-reminders", text: labels.medicineReminders },
    { href: "#emergency-contacts", text: labels.emergencyContacts }
  ];

  return (
    <section className="panel quick-actions" aria-label={labels.mainActions}>
      <h2>{labels.mainActions}</h2>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <a key={action.href} href={action.href} className="quick-action-btn">
            {action.text}
          </a>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
