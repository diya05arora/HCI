import EmergencyContactsSection from "../components/EmergencyContactsSection";
import HealthInfoSection from "../components/HealthInfoSection";
import MedicineRemindersSection from "../components/MedicineRemindersSection";
import "./HomePage.css";

// ── helpers ──────────────────────────────────────────────────────────────────

function DailyStatusStrip({ labels, reminders, contacts }) {
  const takenCount = reminders.filter((r) => r.taken).length;
  const pendingMeds = reminders.filter((r) => !r.taken).length;

  return (
    <section className="panel status-strip-panel" aria-label="Today at a glance">
      <h3 className="panel-section-label">{labels.todayGlance || "Today at a glance"}</h3>
      <div className="status-strip">
        <div className="status-card" aria-label={`${takenCount} of ${reminders.length} medicines taken`}>
          <span className="status-icon" aria-hidden="true">💊</span>
          <span className="status-value">{takenCount}/{reminders.length}</span>
          <span className="status-label">{labels.medicineReminders}</span>
        </div>
        <div className="status-card" aria-label={`${pendingMeds} medicine${pendingMeds !== 1 ? "s" : ""} pending`}>
          <span className="status-icon" aria-hidden="true">⏳</span>
          <span className={`status-value ${pendingMeds > 0 ? "status-value--alert" : ""}`}>
            {pendingMeds}
          </span>
          <span className="status-label">{labels.pending || "Pending"}</span>
        </div>
        <div className="status-card" aria-label={`${contacts.length} emergency contacts saved`}>
          <span className="status-icon" aria-hidden="true">📞</span>
          <span className="status-value">{contacts.length}</span>
          <span className="status-label">{labels.emergencyContacts}</span>
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
              <span className="med-summary-name">{med.name}</span>
              <span className="med-summary-time">{med.scheduledTime || med.time}</span>
            </span>
            <button
              className={`med-summary-badge ${med.taken ? "med-badge--taken" : "med-badge--pending"}`}
              onClick={() => onToggle && onToggle(med)}
              aria-label={`${med.name}: ${med.taken ? labels.taken : labels.notTaken}. Tap to change.`}
            >
              {med.taken ? `${labels.taken} ✓` : labels.notTaken}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DailyHealthTip({ labels, healthCards, onListen }) {
  if (!healthCards || healthCards.length === 0) return null;
  const tip = healthCards[0];

  return (
    <section className="panel daily-tip-panel" aria-labelledby="daily-tip-title">
      <h3 id="daily-tip-title" className="panel-section-label">
        {labels.dailyTip || "Daily Health Tip"}
      </h3>
      <article className="daily-tip-card">
        <span className="tip-icon" aria-hidden="true">💡</span>
        <div className="tip-body">
          <strong className="tip-title">{tip.title}</strong>
          <p className="tip-summary">{tip.summary}</p>
          <button
            className="audio-btn tip-listen-btn"
            onClick={() => onListen(tip.audioText || tip.summary)}
            aria-label={`${labels.listen}: ${tip.title}`}
          >
            {labels.listen} 🔊
          </button>
        </div>
      </article>
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

function MoodCheckin({ labels }) {
  const moods = [
    { emoji: "😄", key: "great",  label: labels.moodGreat  || "Great"  },
    { emoji: "🙂", key: "good",   label: labels.moodGood   || "Good"   },
    { emoji: "😐", key: "okay",   label: labels.moodOkay   || "Okay"   },
    { emoji: "😔", key: "low",    label: labels.moodLow    || "Low"    },
    { emoji: "😣", key: "unwell", label: labels.moodUnwell || "Unwell" },
  ];

  return (
    <section
      id="mood-checkin"
      className="panel mood-panel"
      aria-labelledby="mood-title"
    >
      <h3 id="mood-title" className="panel-section-label">
        {labels.moodCheckin || "How are you feeling today?"}
      </h3>
      <div className="mood-options" role="group" aria-label="Select your mood">
        {moods.map((m) => (
          <button
            key={m.key}
            className="mood-btn"
            aria-label={m.label}
            onClick={() => {
              // Persist mood to backend via existing API pattern if needed
              console.log("Mood logged:", m.key);
            }}
          >
            <span className="mood-emoji" aria-hidden="true">{m.emoji}</span>
            <span className="mood-label">{m.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Main HomePage ─────────────────────────────────────────────────────────────

function HomePage({
  labels,
  currentUser,
  healthCards,
  contacts,
  reminders,     // pass today's reminders from App.jsx
  onListen,
  onCall,
  onToggleReminder,
}) {
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

  return (
    <div className="home-page-main">

      {/* ── Welcome ── */}
      <div className="home-welcome" aria-live="polite">
        <p className="home-greeting">{getGreeting()},</p>
        <h2 className="home-user-name">{firstName}!</h2>
        <p className="home-date">{todayDate}</p>
      </div>

      {/* ── Daily status strip ── */}
      <DailyStatusStrip
        labels={labels}
        reminders={reminders || []}
        contacts={contacts || []}
      />

      {/* ── Quick access grid ── */}
      <QuickAccessGrid labels={labels} />

      {/* ── Medicine summary ── */}
      <MedicineSummary
        labels={labels}
        reminders={reminders || []}
        onToggle={onToggleReminder}
      />

      {/* ── Daily health tip ── */}
      <DailyHealthTip
        labels={labels}
        healthCards={healthCards}
        onListen={onListen}
      />

      {/* ── Health info (full cards, existing component) ── */}
      <section className="home-section" id="health-info">
        <h3>{labels.healthInfo}</h3>
        <HealthInfoSection
          labels={labels}
          healthCards={healthCards}
          onListen={onListen}
        />
      </section>

      {/* ── Weather ── */}
      <WeatherCard labels={labels} />

      {/* ── Mood check-in ── */}
      <MoodCheckin labels={labels} />

      {/* ── Emergency contacts (existing component) ── */}
      <section className="home-section" id="emergency-contacts">
        <h3>{labels.emergencyContacts}</h3>
        <EmergencyContactsSection
          labels={labels}
          contacts={contacts}
          onCall={onCall}
        />
      </section>

    </div>
  );
}

export default HomePage;
