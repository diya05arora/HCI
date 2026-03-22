import { useMemo, useState } from "react";

function MedicinesPage({ labels, reminders, onToggleReminder }) {
  const [filter, setFilter] = useState("pending");

  const visibleReminders = useMemo(() => {
    if (filter === "all") {
      return reminders;
    }
    if (filter === "taken") {
      return reminders.filter((item) => item.taken);
    }
    return reminders.filter((item) => !item.taken);
  }, [filter, reminders]);

  return (
    <div className="medicines-page-main">
      <div className="medicines-header">
        <h2>{labels.medicineReminders}</h2>
        <p>Keep track of your daily medications</p>
      </div>

      <div className="medicines-filter-section">
        <div className="medicines-filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filter === "pending" ? "filter-btn-active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            {labels.pendingOnly}
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === "taken" ? "filter-btn-active" : ""}`}
            onClick={() => setFilter("taken")}
          >
            {labels.takenOnly}
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === "all" ? "filter-btn-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {labels.allMedicines}
          </button>
        </div>
      </div>

      <div className="medicines-list">
        {visibleReminders.length === 0 ? (
          <div className="no-medicines">
            <p>No medicines found in this category</p>
          </div>
        ) : (
          visibleReminders.map((reminder) => (
            <div
              key={reminder._id}
              className={`medicine-card ${reminder.taken ? "medicine-taken" : "medicine-pending"}`}
            >
              <div className="medicine-info">
                <h3>{reminder.medicineName}</h3>
                <p className="medicine-dosage">{reminder.dosage}</p>
                <span className="medicine-time">{reminder.timeLabel}</span>
              </div>
              <label className="medicine-checkbox">
                <input
                  type="checkbox"
                  checked={reminder.taken}
                  onChange={(e) => onToggleReminder(reminder._id, e.target.checked)}
                />
                <span className="checkbox-label">
                  {reminder.taken ? labels.taken : labels.notTaken}
                </span>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MedicinesPage;
