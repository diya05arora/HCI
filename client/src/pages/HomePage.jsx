import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import EmergencyContactsSection from "../components/EmergencyContactsSection";
import HealthInfoSection from "../components/HealthInfoSection";
import MedicineRemindersSection from "../components/MedicineRemindersSection";
import "./HomePage.css";

const WORKOUT_LIBRARY = [
  { id: 1, name: "Gentle Walking", duration: 10 },
  { id: 2, name: "Seated Stretches", duration: 8 },
  { id: 3, name: "Arm Circles", duration: 5 },
  { id: 4, name: "Standing Balance", duration: 10 },
  { id: 5, name: "Wall Push-ups", duration: 8 },
  { id: 6, name: "Gentle Step-Ups", duration: 10 },
  { id: 7, name: "Advanced Chair Squats", duration: 12 },
  { id: 8, name: "Resistance Band Rows", duration: 15 },
  { id: 9, name: "Supported Lunges", duration: 10 }
];

const WEEKLY_PLAN_DATA = [
  { day: "MON", exerciseName: "Seated Stretches", isRest: false },
  { day: "TUE", exerciseName: "Wall Push-ups", isRest: false },
  { day: "WED", exerciseName: "Rest day", isRest: true },
  { day: "THU", exerciseName: "Gentle Walking", isRest: false },
  { day: "FRI", exerciseName: "Standing Balance", isRest: false },
  { day: "SAT", exerciseName: "Supported Lunges", isRest: false },
  { day: "SUN", exerciseName: "Rest day", isRest: true }
];

// ── helpers ──────────────────────────────────────────────────────────────────

function DailyStatusStrip({ labels, reminders, appointments }) {
  const takenCount = reminders.filter((r) => r.taken).length;
  const pendingMeds = reminders.filter((r) => !r.taken);
  const getReminderTime = (reminder) => reminder.scheduledTime || reminder.time || reminder.timeLabel || "";
  
  // Get next medicine to take
  let nextMedicineTime = null;
  if (pendingMeds.length > 0) {
    const sorted = pendingMeds.sort((a, b) => {
      const timeA = getReminderTime(a);
      const timeB = getReminderTime(b);
      return timeA.localeCompare(timeB);
    });
    nextMedicineTime = getReminderTime(sorted[0]);
  }
  
  // Get next appointment
  let nextAppointment = null;
  let daysUntilAppointment = 0;
  if (appointments && appointments.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureApts = appointments.filter(apt => !apt.completed);
    
    if (futureApts.length > 0) {
      const sorted = futureApts.sort((a, b) => 
        new Date(a.appointmentDate) - new Date(b.appointmentDate)
      );
      nextAppointment = sorted[0];
      
      const aptDate = new Date(nextAppointment.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);
      daysUntilAppointment = Math.ceil((aptDate - today) / (1000 * 60 * 60 * 24));
    }
  }
  
  // Workout streak placeholder
  const workoutStreak = 6; // This would come from exercise tracking data

  return (
    <section className="panel status-strip-panel" aria-label="Today at a glance">
      <h3 className="panel-section-label">{labels.todayGlance || "Today at a glance"}</h3>
      <div className="status-strip">
        <div className="status-card">
          <span className="status-card-title">{labels.medicinesToday || "MEDICINES TODAY"}</span>
          <span className="status-value">{takenCount}/{reminders.length}</span>
          {nextMedicineTime && <span className="status-subtitle">1 due at {nextMedicineTime}</span>}
        </div>
        <div className="status-card">
          <span className="status-card-title">{labels.nextAppointment || "NEXT APPOINTMENT"}</span>
          {nextAppointment ? (
            <>
              <span className="status-value">{daysUntilAppointment} {daysUntilAppointment === 1 ? "day" : "days"}</span>
              <span className="status-subtitle">{nextAppointment.doctorName} – {nextAppointment.specialty}</span>
            </>
          ) : (
            <span className="status-subtitle">{labels.noAppointments || "No appointments scheduled"}</span>
          )}
        </div>
        <div className="status-card">
          <span className="status-card-title">{labels.workoutStreak || "WORKOUT STREAK"}</span>
          <span className="status-value">{workoutStreak} days</span>
          <span className="status-subtitle">{labels.keepItUp || "Keep it up!"}</span>
        </div>
      </div>
    </section>
  );
}

function QuickAccessGrid({ labels }) {
  const items = [
    { href: "#health-info",         icon: "🫀", title: labels.healthInfo,        sub: labels.healthInfoSub    || "Tips & articles"     },
    { href: "#medicine-reminders",  icon: "💊", title: labels.medicineReminders, sub: labels.medicineSub      || "Today's schedule"    },
    { href: "#emergency-contacts",  icon: "📞", title: labels.emergencyContacts, sub: labels.emergencySub     || "One-tap call"        },
    { href: "#mood-checkin",        icon: "😊", title: labels.moodCheckin        || "Mood Check",
                                                sub: labels.moodCheckinSub      || "How are you today?" },
  ];

  return (
    <section className="panel quick-access-panel" aria-label={labels.mainActions}>
      <h3 className="panel-section-label">{labels.mainActions}</h3>
      <div className="quick-access-grid">
        {items.map((item) => (
          <a key={item.href} href={item.href} className="quick-access-btn" aria-label={item.title}>
            <span className="qa-icon" aria-hidden="true">{item.icon}</span>
            <span className="qa-title">{item.title}</span>
            <span className="qa-sub">{item.sub}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function MedicineSummary({ labels, reminders, onToggle }) {
  if (!reminders || reminders.length === 0) return null;
  const todayItems = reminders.slice(0, 4); // show max 4 on home page

  return (
    <section className="panel medicine-summary-panel" aria-labelledby="med-summary-title">
      <h3 id="med-summary-title" className="panel-section-label">
        {labels.todaysMedicines || "Today's Medicines"}
      </h3>
      <ul className="med-summary-list" role="list">
        {todayItems.map((med) => (
          <li key={med._id} className="med-summary-item">
            <span
              className={`med-status-dot ${med.taken ? "med-status-dot--taken" : "med-status-dot--pending"}`}
              aria-hidden="true"
            />
            <span className="med-summary-info">
              <span className="med-summary-name">{med.name || med.medicineName}</span>
              <span className="med-summary-time">{med.scheduledTime || med.time || med.timeLabel}</span>
            </span>
            <button
              className={`med-summary-badge ${med.taken ? "med-badge--taken" : "med-badge--pending"}`}
              onClick={() => onToggle && onToggle(med)}
              aria-label={`${med.name || med.medicineName}: ${med.taken ? labels.taken : labels.notTaken}. Tap to change.`}
            >
              {med.taken ? `${labels.taken} ✓` : labels.notTaken}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}


function WeatherCard({ labels }) {
  // Static placeholder — wire to a weather API or env variable as needed.
  return (
    <section className="panel weather-panel" aria-label={labels.weatherLabel || "Weather today"}>
      <h3 className="panel-section-label">{labels.weatherLabel || "Today's Weather"}</h3>
      <div className="weather-card">
        <span className="weather-icon" aria-hidden="true">☀️</span>
        <div className="weather-info">
          <span className="weather-temp">--°</span>
          <span className="weather-desc">{labels.weatherNote || "Check your local weather before going out."}</span>
        </div>
      </div>
    </section>
  );
}


// ── Main HomePage ─────────────────────────────────────────────────────────────

function TodaysMedicinesPanel({ labels, reminders, onToggleReminder }) {
  if (!reminders || reminders.length === 0) return null;
  
  return (
    <section className="medicines-appointments-panel">
      <h3 className="panel-section-label">{labels.todaysMedicines || "Today's medicines"}</h3>
      <div className="medicines-list">
        {reminders.map((med) => {
          const isTaken = med.taken;
          const isPending = !isTaken;
          const isDueSoon = !med.taken && isPending; // Could add logic for time-based urgency
          const medicineDisplayName = med.name || med.medicineName || "Medicine";
          
          return (
            <div key={med._id} className="medicine-item">
              <div className="medicine-status-icon">
                <span className={`status-circle ${isTaken ? "status-taken" : isDueSoon ? "status-due-soon" : "status-pending"}`}>
                  {isTaken ? "✓" : "○"}
                </span>
              </div>
              <div className="medicine-info">
                <h4 className="medicine-name">{medicineDisplayName}</h4>
              </div>
              <button
                className={`medicine-btn ${isTaken ? "btn-taken" : "btn-pending"}`}
                onClick={() => onToggleReminder && onToggleReminder(med._id, !isTaken)}
              >
                {isTaken ? "Taken" : isDueSoon ? "Due soon" : "Take"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function UpcomingAppointmentsPanel({ labels, appointments }) {
  const futureAppointments = (appointments || [])
    .filter(apt => !apt.completed)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3); // Show max 3 upcoming
  
  return (
    <section className="medicines-appointments-panel">
      <h3 className="panel-section-label">{labels.upcomingAppointments || "Upcoming appointments"}</h3>
      <div className="appointments-list">
        {futureAppointments.length > 0 ? (
          futureAppointments.map((apt) => {
            const aptDate = new Date(apt.appointmentDate);
            const dateStr = aptDate.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short"
            });
            const timeStr = aptDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            });
            
            return (
              <div key={apt._id} className="appointment-item">
                <div className="appointment-header">
                  <h4 className="doctor-name">{apt.doctorName || apt.hospitalName}</h4>
                  <span className="appointment-type">{apt.specialty}</span>
                </div>
                <p className="appointment-details">{dateStr} · {timeStr}</p>
              </div>
            );
          })
        ) : (
          <div className="appointment-item empty">
            <p className="appointment-details">{labels.noUpcomingAppointments || "No upcoming appointments"}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function WorkoutAndTipsPanel({ labels }) {
  const dayKeys = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const todayKey = dayKeys[new Date().getDay()];
  const dateKey = new Date().toISOString().slice(0, 10);

  const workoutItems = useMemo(() => {
    const todayPlan = WEEKLY_PLAN_DATA.find((entry) => entry.day === todayKey);
    if (!todayPlan) return [];

    if (todayPlan.isRest) {
      return [
        { id: "recovery-1", title: "Seated Stretches", duration: "8 min" },
        { id: "recovery-2", title: "Arm Circles", duration: "5 min" }
      ];
    }

    const planned = WORKOUT_LIBRARY.find((item) => item.name === todayPlan.exerciseName);
    const support = WORKOUT_LIBRARY.filter(
      (item) => item.name !== todayPlan.exerciseName
    ).slice(0, 2);

    return [
      ...(planned ? [{ id: `main-${planned.id}`, title: planned.name, duration: `${planned.duration} min` }] : []),
      ...support.map((item) => ({
        id: `support-${item.id}`,
        title: item.name,
        duration: `${item.duration} min`
      }))
    ];
  }, [todayKey]);

  const completionStorageKey = `home-workout-completed-${dateKey}`;
  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const raw = localStorage.getItem(completionStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const toggleWorkoutItem = (itemId) => {
    setCompletedItems((prev) => {
      const next = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem(completionStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const tips = [
    "Stay hydrated - aim for 6-8 glasses of water before 6 PM.",
    "Your Vitamin D dose tonight is best taken with a small meal.",
    "Blood test in 11 days - avoid heavy meals the night before."
  ];

  return (
    <section className="workout-tips-row" aria-label={labels.exercisesPageTitle || "Daily wellness plan"}>
      <article className="wellness-panel">
        <h3 className="wellness-title">Today's workout</h3>
        <ul className="workout-list" role="list">
          {workoutItems.map((item) => (
            <li key={item.id} className="workout-item">
              <button
                type="button"
                className={`workout-check-btn ${completedItems.includes(item.id) ? "is-complete" : ""}`}
                onClick={() => toggleWorkoutItem(item.id)}
                aria-label={`Mark ${item.title} as completed`}
                aria-pressed={completedItems.includes(item.id)}
              >
                <span className="workout-check" aria-hidden="true">
                  {completedItems.includes(item.id) ? "✓" : ""}
                </span>
              </button>
              <button
                type="button"
                className={`workout-text-btn ${completedItems.includes(item.id) ? "is-complete" : ""}`}
                onClick={() => toggleWorkoutItem(item.id)}
              >
                {item.title} - {item.duration}
              </button>
            </li>
          ))}
        </ul>
      </article>

      <article className="wellness-panel">
        <h3 className="wellness-title">Health tips</h3>
        <ol className="tips-list">
          {tips.map((tip, index) => (
            <li key={tip} className="tip-item">
              <span className="tip-number" aria-hidden="true">{index + 1}</span>
              <p className="tip-text">{tip}</p>
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}

function HomePage({
  labels,
  currentUser,
  healthCards,
  reminders,
  appointments,
  contacts,
  onListen,
  onCall,
  onAddContact,
  onToggleReminder,
}) {
  const location = useLocation();
  const firstName = currentUser?.fullName?.split(" ")[0] || currentUser?.fullName;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return labels.goodMorning  || "Good morning";
    if (hour < 17) return labels.goodAfternoon || "Good afternoon";
    return labels.goodEvening || "Good evening";
  };

  const todayDate = new Date().toLocaleDateString(
    labels.__locale || "en-IN",
    { weekday: "long", day: "numeric", month: "long" }
  );

  useEffect(() => {
    if (!location.state?.scrollToEmergencyContacts) {
      return;
    }

    const scrollToEmergencyContacts = () => {
      const target = document.getElementById("emergency-contacts");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const timeoutId = window.setTimeout(scrollToEmergencyContacts, 0);
    return () => window.clearTimeout(timeoutId);
  }, [location.state]);

  return (
    <div className="home-page-main">

      {/* ── Daily status strip ── */}
      <DailyStatusStrip
        labels={labels}
        reminders={reminders || []}
        appointments={appointments || []}
      />

      {/* ── Today's medicines & Upcoming appointments ── */}
      <div className="medicines-appointments-row">
        <TodaysMedicinesPanel
          labels={labels}
          reminders={reminders || []}
          onToggleReminder={onToggleReminder}
        />
        <UpcomingAppointmentsPanel
          labels={labels}
          appointments={appointments || []}
        />
      </div>

      <WorkoutAndTipsPanel labels={labels} />

      {/* ── Quick access grid ── */}
      <QuickAccessGrid labels={labels} />

    
      {/* ── Weather ── */}
      <WeatherCard labels={labels} />


      {/* ── Emergency contacts (existing component) ── */}
      <EmergencyContactsSection
        labels={labels}
        contacts={contacts}
        onCall={onCall}
        onAddContact={onAddContact}
      />

    </div>
  );
}

export default HomePage;
