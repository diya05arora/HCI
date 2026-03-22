function MedicineRemindersSection({ labels, reminders, onToggleReminder }) {
  return (
    <section
      id="medicine-reminders"
      className="panel"
      aria-labelledby="reminder-title"
      tabIndex="-1"
    >
      <h2 id="reminder-title">{labels.medicineReminders}</h2>
      <div className="card-grid">
        {reminders.map((reminder) => (
          <article
            key={reminder._id}
            className={`reminder-card ${reminder.taken ? "taken" : "not-taken"}`}
          >
            <h3>{reminder.medicineName}</h3>
            <p>{reminder.dosage}</p>
            <p className="time-badge">{reminder.timeLabel}</p>
            <label className="check-control">
              <input
                type="checkbox"
                checked={reminder.taken}
                onChange={(event) => onToggleReminder(reminder._id, event.target.checked)}
              />
              <span>{reminder.taken ? labels.taken : labels.notTaken}</span>
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MedicineRemindersSection;
