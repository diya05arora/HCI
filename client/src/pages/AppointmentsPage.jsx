import { useEffect, useState } from "react";

function AppointmentsPage({ labels, currentUser, appointments, onAddAppointment, onDeleteAppointment, onCompleteAppointment }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "General Checkup",
    appointmentDate: "",
    location: "",
    notes: "",
    type: "doctor"
  });

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const appointmentsInMonth = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    return (
      aptDate.getFullYear() === currentMonth.getFullYear() &&
      aptDate.getMonth() === currentMonth.getMonth()
    );
  });

  const appointmentsOnDay = (day) => {
    return appointmentsInMonth.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.getDate() === day;
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.appointmentDate) {
      alert("Please fill in doctor name and appointment date");
      return;
    }
    await onAddAppointment(formData);
    setFormData({
      doctorName: "",
      specialty: "General Checkup",
      appointmentDate: "",
      location: "",
      notes: "",
      type: "doctor"
    });
    setShowAddForm(false);
  };

  const calendarDays = [];
  const firstDay = firstDayOfMonth(currentMonth);
  const daysCount = daysInMonth(currentMonth);

  // Fill empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Fill calendar days
  for (let day = 1; day <= daysCount; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="appointments-page-main">
      <div className="appointments-header">
        <h2>{labels.appointmentsPageTitle || "Doctor Appointments"}</h2>
        <p>Keep track of your medical visits</p>
      </div>

      <button
        className="add-appointment-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Close Form" : "+ Add Appointment"}
      </button>

      {showAddForm && (
        <form className="add-appointment-form panel" onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label htmlFor="doctor-name">Doctor Name *</label>
            <input
              id="doctor-name"
              type="text"
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              placeholder="Dr. John Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialty">Specialty</label>
            <input
              id="specialty"
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="General Checkup"
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointment-date">Appointment Date *</label>
            <input
              id="appointment-date"
              type="datetime-local"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location/Clinic</label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Medical Center, Address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointment-type">Type of Appointment</label>
            <select
              id="appointment-type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="doctor">Doctor Visit</option>
              <option value="hospital">Hospital</option>
              <option value="lab">Lab Test</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions or notes"
            />
          </div>

          <button type="submit" className="form-submit-btn">
            Save Appointment
          </button>
        </form>
      )}

      <div className="calendar-section">
        <div className="calendar-nav">
          <button className="calendar-btn" onClick={handlePrevMonth}>
            ← Previous
          </button>
          <h3 className="calendar-month">{monthName(currentMonth)}</h3>
          <button className="calendar-btn" onClick={handleNextMonth}>
            Next →
          </button>
        </div>

        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day === null ? "empty" : ""} ${
                appointmentsOnDay(day).length > 0 ? "has-appointments" : ""
              }`}
            >
              {day !== null && (
                <>
                  <div className="day-number">{day}</div>
                  {appointmentsOnDay(day).map((apt) => (
                    <div key={apt._id} className="day-appointment">
                      <span className="apt-time">
                        {new Date(apt.appointmentDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="appointments-list-section">
        <h3>Upcoming Appointments</h3>
        {appointmentsInMonth.length === 0 ? (
          <p className="no-appointments">No appointments this month</p>
        ) : (
          <div className="appointments-list">
            {appointmentsInMonth
              .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className={`appointment-card ${appointment.completed ? "completed" : ""}`}
                >
                  <div className="appointment-date-time">
                    <div className="apt-date">
                      {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </div>
                    <div className="apt-time">
                      {new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>

                  <div className="appointment-details">
                    <h4>{appointment.doctorName}</h4>
                    <p className="specialty">{appointment.specialty}</p>
                    {appointment.location && (
                      <p className="location">
                        📍 {appointment.location}
                      </p>
                    )}
                    {appointment.notes && (
                      <p className="notes">{appointment.notes}</p>
                    )}
                    <span className={`apt-type apt-type-${appointment.type}`}>
                      {appointment.type}
                    </span>
                  </div>

                  <div className="appointment-actions">
                    {!appointment.completed && (
                      <button
                        className="apt-btn apt-complete-btn"
                        onClick={() => onCompleteAppointment(appointment._id)}
                      >
                        ✓ Done
                      </button>
                    )}
                    <button
                      className="apt-btn apt-delete-btn"
                      onClick={() => onDeleteAppointment(appointment._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;
