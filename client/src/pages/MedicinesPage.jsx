import { useMemo, useState } from "react";

const TABS = [
  { id: "schedule", icon: "📅", label: "Weekly\nSchedule"   },
  { id: "pending",  icon: "📋", label: "Pending\nMedicines" },
  { id: "taken",    icon: "✅", label: "Taken\nToday"       },
  { id: "add",      icon: "➕", label: "Add\nMedicine"      },
];

const TIME_OPTIONS = [
  { id: "morning",   icon: "🌅", label: "Morning",   text: "Morning"   },
  { id: "afternoon", icon: "☀️", label: "Afternoon", text: "Afternoon" },
  { id: "evening",   icon: "🌆", label: "Evening",   text: "Evening"   },
  { id: "night",     icon: "🌙", label: "Night",     text: "Night"     },
];

function getTimeIcon(timeLabel = "") {
  const t = String(timeLabel).toLowerCase();
  if (t.includes("morning") || t.includes("breakfast") || t.includes("dawn")) return "🌅";
  if (t.includes("noon")    || t.includes("lunch")     || t.includes("afternoon")) return "☀️";
  if (t.includes("evening") || t.includes("dinner")    || t.includes("dusk"))      return "🌆";
  if (t.includes("night")   || t.includes("bedtime"))  return "🌙";
  return "💊";
}

function getWeekDays() {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const diff = d.getTime() - today0.getTime();
    let state = "future";
    if (diff < 0) state = "past";
    else if (diff === 0) state = "today";
    return { date: d.getDate(), label: labels[i], state };
  });
}

function MedicineCard({ reminder, onToggle, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const accent = reminder.taken ? "#27AE82" : "#E68B00";
  return (
    <div className="mrc-card" style={{ "--card-accent": accent }}>
      <div className="mrc-card-accent-bar" />
      <div className="mrc-card-header">
        <span className="mrc-type-icon">{getTimeIcon(reminder.timeLabel)}</span>
        <div className="mrc-card-title-group">
          <h4>{reminder.medicineName}</h4>
          <span className="mrc-dosage">{reminder.dosage}</span>
          {reminder.timeLabel && <span className="mrc-time-tag">🕐 {reminder.timeLabel}</span>}
        </div>
        {reminder.taken
          ? <span className="mrc-done-badge">✓ Taken</span>
          : <span className="mrc-pending-badge">⏳ Pending</span>}
      </div>
      <div className="mrc-card-actions">
        {reminder.taken
          ? <button className="mrc-btn mrc-btn-undo" onClick={() => onToggle(reminder._id, false)}>↺ Mark as Not Taken</button>
          : <button className="mrc-btn mrc-btn-take" onClick={() => onToggle(reminder._id, true)}>✓ Mark as Taken</button>}
        {onDelete && (
          <button
            className="mrc-btn mrc-btn-delete"
            onClick={() => (confirmDel ? onDelete(reminder._id) : setConfirmDel(true))}
            onMouseLeave={() => setConfirmDel(false)}
            title="Remove medicine"
          >
            {confirmDel ? "Confirm?" : "🗑"}
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="mrc-empty">
      <div className="mrc-empty-icon">{icon}</div>
      <p>{text}</p>
    </div>
  );
}

function MedicineList({ reminders, onToggle, onDelete, emptyText, emptyIcon }) {
  if (reminders.length === 0) return <EmptyState icon={emptyIcon} text={emptyText} />;
  return (
    <div className="mrc-list">
      {reminders.map((r) => (
        <MedicineCard key={r._id} reminder={r} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}

function WeekTimeline({ pendingCount, totalCount }) {
  const days = getWeekDays();
  const allDoneToday = totalCount > 0 && pendingCount === 0;
  return (
    <div className="mrc-week-hero">
      <div className="mrc-week-head">
        <div>
          <div className="mrc-week-eyebrow">This Week</div>
          <h3 className="mrc-week-title">Adherence Timeline</h3>
        </div>
        <div className="mrc-week-legend">
          <span className="mrc-legend-item"><span className="mrc-legend-dot done" />Done</span>
          <span className="mrc-legend-item"><span className="mrc-legend-dot today" />Today</span>
          <span className="mrc-legend-item"><span className="mrc-legend-dot future" />Upcoming</span>
        </div>
      </div>
      <div className="mrc-week-track">
        <div className="mrc-week-line-bg" />
        <div className="mrc-week-line-fill" style={{ width: `${(days.findIndex(d => d.state === "today") + 0.5) / 7 * 100}%` }} />
        {days.map((d, i) => {
          const isPast = d.state === "past";
          const isToday = d.state === "today";
          const showTick = isPast || (isToday && allDoneToday);
          return (
            <div key={i} className={`mrc-week-day ${d.state}`}>
              <div className="mrc-week-marker">
                {showTick ? (
                  <span className="mrc-week-tick">✓</span>
                ) : isToday ? (
                  <span className="mrc-week-num">{pendingCount}</span>
                ) : (
                  <span className="mrc-week-dot" />
                )}
              </div>
              <div className="mrc-week-label">{d.label.slice(0, 2)}</div>
              <div className="mrc-week-date">{d.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdherenceCard({ reminder }) {
  const days = getWeekDays();
  const pastDays = days.filter((d) => d.state === "past").length;
  const todayCounted = reminder.taken ? 1 : 0;
  const weekPct = Math.round(((pastDays + todayCounted) / 7) * 100);
  return (
    <div className="mrc-adherence-card">
      <div className="mrc-adherence-head">
        <span className="mrc-adherence-icon">{getTimeIcon(reminder.timeLabel)}</span>
        <div className="mrc-adherence-info">
          <h4>{reminder.medicineName}</h4>
          <span className="mrc-adherence-sub">{reminder.dosage} · {reminder.timeLabel}</span>
        </div>
        <div className="mrc-adherence-ring" style={{ "--pct": weekPct }}>
          <div className="mrc-adherence-ring-inner">{weekPct}%</div>
        </div>
      </div>
      <div className="mrc-adherence-row">
        {days.map((d, i) => {
          let cls = "mrc-adherence-slot";
          let content;
          if (d.state === "past") { cls += " done"; content = <span className="mrc-slot-tick">✓</span>; }
          else if (d.state === "today") {
            if (reminder.taken) { cls += " done"; content = <span className="mrc-slot-tick">✓</span>; }
            else { cls += " today"; content = <span className="mrc-slot-pulse" />; }
          } else { cls += " future"; content = <span className="mrc-slot-dot" />; }
          return (
            <div key={i} className={cls}>
              <div className="mrc-slot-chip">{content}</div>
              <div className="mrc-slot-label">{d.label.slice(0, 1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScheduleTab({ reminders, onSwitchToAdd }) {
  const total   = reminders.length;
  const taken   = reminders.filter((r) => r.taken).length;
  const pending = total - taken;

  return (
    <div className="mrc-schedule">
      <WeekTimeline pendingCount={pending} totalCount={total} />

      <div className="mrc-sched-stats">
        <div className="mrc-sched-stat">
          <div className="mrc-sched-stat-icon" style={{ background: "#EBF4FF", color: "#2B6CB0" }}>💊</div>
          <div>
            <div className="mrc-sched-stat-num">{total}</div>
            <div className="mrc-sched-stat-label">Total Medicines</div>
          </div>
        </div>
        <div className="mrc-sched-stat">
          <div className="mrc-sched-stat-icon" style={{ background: "#EBFAF4", color: "#27AE82" }}>✓</div>
          <div>
            <div className="mrc-sched-stat-num" style={{ color: "#27AE82" }}>{taken}</div>
            <div className="mrc-sched-stat-label">Taken Today</div>
          </div>
        </div>
        <div className="mrc-sched-stat">
          <div className="mrc-sched-stat-icon" style={{ background: "#FFF7E6", color: "#E68B00" }}>⏳</div>
          <div>
            <div className="mrc-sched-stat-num" style={{ color: "#E68B00" }}>{pending}</div>
            <div className="mrc-sched-stat-label">Pending</div>
          </div>
        </div>
      </div>

      <div className="mrc-adherence-section">
        <div className="mrc-section-head">
          <h3 className="mrc-section-title">Medicine Tracker</h3>
          <button className="mrc-ghost-btn" onClick={onSwitchToAdd}>+ Add Medicine</button>
        </div>
        {total === 0 ? (
          <EmptyState icon="💊" text="No medicines yet. Tap 'Add Medicine' to create your first reminder." />
        ) : (
          <div className="mrc-adherence-list">
            {reminders.map((r) => <AdherenceCard key={r._id} reminder={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function AddTab({ onAddReminder, onSuccessSwitch }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("morning");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const timeMeta = TIME_OPTIONS.find((t) => t.id === time);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !dosage.trim()) {
      setError("Please fill in both medicine name and dosage.");
      return;
    }
    setSaving(true);
    try {
      await onAddReminder({
        medicineName: name.trim(),
        dosage: dosage.trim(),
        timeLabel: timeMeta.text,
      });
      setName(""); setDosage(""); setTime("morning");
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onSuccessSwitch && onSuccessSwitch(); }, 1400);
    } catch (err) {
      setError(err.message || "Could not add medicine.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mrc-add">
      <form className="mrc-add-form" onSubmit={handleSubmit}>
        <div className="mrc-form-group">
          <label>Medicine Name</label>
          <div className="mrc-input-wrap">
            <span className="mrc-input-icon">💊</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin"
              maxLength={60}
            />
          </div>
        </div>

        <div className="mrc-form-group">
          <label>Dosage</label>
          <div className="mrc-input-wrap">
            <span className="mrc-input-icon">⚖️</span>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 500mg · 1 tablet"
              maxLength={40}
            />
          </div>
        </div>

        <div className="mrc-form-group">
          <label>Time of Day</label>
          <div className="mrc-time-grid">
            {TIME_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.id}
                className={`mrc-time-btn ${time === opt.id ? "active" : ""}`}
                onClick={() => setTime(opt.id)}
              >
                <span className="mrc-time-btn-icon">{opt.icon}</span>
                <span className="mrc-time-btn-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mrc-error">⚠️ {error}</div>}
        {success && <div className="mrc-success">✓ Medicine added successfully!</div>}

        <button type="submit" className="mrc-add-btn" disabled={saving}>
          {saving ? "Adding…" : "➕ Add Medicine"}
        </button>
      </form>

      <aside className="mrc-preview">
        <div className="mrc-preview-label">Live Preview</div>
        <div className="mrc-card" style={{ "--card-accent": "#E68B00" }}>
          <div className="mrc-card-accent-bar" />
          <div className="mrc-card-header">
            <span className="mrc-type-icon">{getTimeIcon(timeMeta.text)}</span>
            <div className="mrc-card-title-group">
              <h4>{name || "Medicine Name"}</h4>
              <span className="mrc-dosage">{dosage || "Dosage"}</span>
              <span className="mrc-time-tag">🕐 {timeMeta.text}</span>
            </div>
            <span className="mrc-pending-badge">⏳ Pending</span>
          </div>
        </div>
        <p className="mrc-preview-hint">This is how your medicine will appear in the Pending tab.</p>
      </aside>
    </div>
  );
}

function MedicinesPage({ reminders = [], onToggleReminder, onAddReminder, onDeleteReminder }) {
  const [activeTab, setActiveTab] = useState("schedule");
  const [animating, setAnimating] = useState(false);
  const [search, setSearch] = useState("");

  const handleTabChange = (id) => {
    if (id === activeTab) return;
    setAnimating(true);
    setTimeout(() => { setActiveTab(id); setAnimating(false); }, 180);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reminders;
    return reminders.filter((r) =>
      r.medicineName.toLowerCase().includes(q) ||
      r.dosage.toLowerCase().includes(q) ||
      (r.timeLabel || "").toLowerCase().includes(q)
    );
  }, [reminders, search]);

  const pending = useMemo(() => filtered.filter((r) => !r.taken), [filtered]);
  const taken   = useMemo(() => filtered.filter((r) =>  r.taken), [filtered]);

  const tabCounts = {
    pending:  reminders.filter((r) => !r.taken).length,
    taken:    reminders.filter((r) =>  r.taken).length,
    schedule: reminders.length,
    add:      null,
  };

  return (
    <>
      <style>{`
        .mrc-shell { --mrc-bg:#F7F9FC; --mrc-bg-soft:#EEF2F8; --mrc-surface:#FFFFFF; --mrc-border:#E5E9F0; --mrc-border-soft:#F1F4F9; --mrc-primary:#2B6CB0; --mrc-primary2:#3182CE; --mrc-primary-soft:#EBF4FF; --mrc-text:#0F172A; --mrc-muted:#64748B; --mrc-success:#10B981; --mrc-warning:#F59E0B; --mrc-danger:#EF4444; --mrc-radius:20px; --mrc-radius-sm:12px; --mrc-shadow:0 1px 3px rgba(15,23,42,0.04),0 8px 32px rgba(15,23,42,0.06); background:linear-gradient(180deg,#F7F9FC 0%,#EEF2F8 100%); border-radius:var(--mrc-radius); overflow:hidden; box-shadow:var(--mrc-shadow); font-family:'Inter','Segoe UI',system-ui,sans-serif; min-height:82vh; display:flex; flex-direction:column; }

        .mrc-topbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.4rem 1.8rem 1rem; background:var(--mrc-surface); border-bottom:1px solid var(--mrc-border-soft); flex-wrap:wrap; }
        .mrc-brand { display:flex; align-items:center; gap:14px; min-width:0; }
        .mrc-brand-icon { width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,#2B6CB0 0%,#3182CE 100%); display:flex; align-items:center; justify-content:center; font-size:1.5rem; box-shadow:0 6px 18px rgba(43,108,176,0.3); flex-shrink:0; }
        .mrc-brand-title { font-size:1.3rem; font-weight:800; color:var(--mrc-text); letter-spacing:-0.02em; line-height:1.1; margin:0; }
        .mrc-brand-subtitle { font-size:0.82rem; color:var(--mrc-muted); font-weight:500; margin-top:2px; }
        .mrc-topbar-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .mrc-search { display:flex; align-items:center; gap:8px; background:var(--mrc-bg-soft); border:1.5px solid transparent; border-radius:12px; padding:0.55rem 0.9rem; min-width:240px; transition:all 0.2s; }
        .mrc-search:focus-within { background:var(--mrc-surface); border-color:var(--mrc-primary2); box-shadow:0 0 0 4px rgba(49,130,206,0.1); }
        .mrc-search-icon { font-size:0.95rem; color:var(--mrc-muted); }
        .mrc-search input { flex:1; border:none; background:transparent; outline:none; font-size:0.9rem; color:var(--mrc-text); font-weight:500; min-width:0; }
        .mrc-search input::placeholder { color:#94A3B8; }
        .mrc-search-clear { background:none; border:none; color:var(--mrc-muted); cursor:pointer; padding:0; font-size:1rem; }
        .mrc-primary-btn { display:inline-flex; align-items:center; gap:6px; padding:0.65rem 1.1rem; background:linear-gradient(135deg,#2B6CB0 0%,#3182CE 100%); color:#fff; border:none; border-radius:12px; font-size:0.88rem; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(43,108,176,0.28); transition:transform 0.15s,box-shadow 0.2s; }
        .mrc-primary-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(43,108,176,0.36); }
        .mrc-primary-btn:active { transform:translateY(0); }

        .mrc-tabs { display:flex; gap:4px; padding:0.8rem 1.8rem 0; background:var(--mrc-surface); border-bottom:1px solid var(--mrc-border-soft); overflow-x:auto; scrollbar-width:none; }
        .mrc-tabs::-webkit-scrollbar { display:none; }
        .mrc-tab { display:inline-flex; align-items:center; gap:8px; padding:0.75rem 1.1rem; background:transparent; border:none; color:var(--mrc-muted); font-size:0.88rem; font-weight:600; cursor:pointer; border-radius:10px 10px 0 0; position:relative; white-space:nowrap; transition:color 0.18s,background 0.18s; }
        .mrc-tab:hover { color:var(--mrc-text); background:var(--mrc-bg-soft); }
        .mrc-tab.active { color:var(--mrc-primary); }
        .mrc-tab.active::after { content:""; position:absolute; left:10%; right:10%; bottom:-1px; height:3px; background:linear-gradient(90deg,var(--mrc-primary) 0%,var(--mrc-primary2) 100%); border-radius:3px 3px 0 0; }
        .mrc-tab-icon { font-size:1.05rem; }
        .mrc-tab-count { display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:20px; padding:0 6px; border-radius:99px; background:var(--mrc-bg-soft); color:var(--mrc-muted); font-size:0.72rem; font-weight:700; }
        .mrc-tab.active .mrc-tab-count { background:var(--mrc-primary-soft); color:var(--mrc-primary); }

        .mrc-panel { flex:1; overflow-y:auto; padding:1.8rem; background:transparent; transition:opacity 0.18s,transform 0.18s; }
        .mrc-panel.fade { opacity:0; transform:translateY(6px); }
        .mrc-panel-header { margin-bottom:1.3rem; }
        .mrc-panel-header h2 { font-size:1.5rem; font-weight:800; color:var(--mrc-text); margin:0 0 4px; letter-spacing:-0.02em; }
        .mrc-panel-header p  { color:var(--mrc-muted); margin:0; font-size:0.9rem; }
        .mrc-tab-content { animation:mrc-slidein 0.22s ease; }
        @keyframes mrc-slidein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        /* CARDS */
        .mrc-list { display:flex; flex-direction:column; gap:12px; }
        .mrc-card { background:var(--mrc-surface); border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:hidden; border:1.5px solid var(--mrc-border); transition:box-shadow 0.2s,transform 0.2s; }
        .mrc-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.1); transform:translateY(-2px); }
        .mrc-card-accent-bar { height:5px; background:var(--card-accent,var(--mrc-primary)); }
        .mrc-card-header { display:flex; align-items:flex-start; gap:12px; padding:1rem 1.2rem 0.8rem; }
        .mrc-type-icon { font-size:2rem; flex-shrink:0; margin-top:2px; }
        .mrc-card-title-group { flex:1; min-width:0; }
        .mrc-card-title-group h4 { margin:0 0 3px; font-size:1.1rem; font-weight:700; color:var(--mrc-text); }
        .mrc-dosage { font-size:0.88rem; color:var(--mrc-muted); display:block; font-weight:600; }
        .mrc-time-tag { font-size:0.8rem; color:var(--mrc-primary); font-weight:700; display:inline-block; margin-top:6px; background:#EBF4FF; padding:3px 10px; border-radius:99px; }
        .mrc-done-badge { background:#EBFAF4; color:var(--mrc-success); font-size:0.75rem; font-weight:700; border-radius:99px; padding:4px 12px; white-space:nowrap; flex-shrink:0; }
        .mrc-pending-badge { background:#FFF7E6; color:var(--mrc-warning); font-size:0.75rem; font-weight:700; border-radius:99px; padding:4px 12px; white-space:nowrap; flex-shrink:0; }
        .mrc-card-actions { display:flex; gap:8px; padding:0.8rem 1.2rem 1rem; border-top:1px solid var(--mrc-border); }
        .mrc-btn { flex:1; padding:0.75rem 1rem; border-radius:10px; border:none; font-size:0.92rem; font-weight:700; cursor:pointer; transition:opacity 0.15s,transform 0.1s,background 0.15s; }
        .mrc-btn:active { transform:scale(0.97); }
        .mrc-btn:hover { opacity:0.9; }
        .mrc-btn-take { background:var(--mrc-success); color:#fff; }
        .mrc-btn-take:hover { background:#219a74; opacity:1; }
        .mrc-btn-undo { background:#F7FAFC; color:var(--mrc-muted); border:1.5px solid var(--mrc-border); }
        .mrc-btn-undo:hover { background:#EDF2F7; opacity:1; }
        .mrc-btn-delete { flex:0 0 auto; min-width:48px; background:#FFF0F0; color:var(--mrc-danger); border:1.5px solid #FECACA; }
        .mrc-btn-delete:hover { background:#FFE4E4; opacity:1; }

        .mrc-empty { text-align:center; padding:3rem 1rem; color:var(--mrc-muted); background:var(--mrc-surface); border-radius:12px; border:2px dashed var(--mrc-border); }
        .mrc-empty-icon { font-size:3rem; margin-bottom:0.5rem; }
        .mrc-empty p { margin:0; font-size:1rem; font-weight:600; }

        /* SCHEDULE TAB */
        .mrc-schedule { display:flex; flex-direction:column; gap:1.5rem; }
        .mrc-week-hero { background:linear-gradient(135deg,#2B6CB0 0%,#3182CE 100%); border-radius:18px; padding:1.4rem 1.6rem; color:#fff; box-shadow:0 8px 24px rgba(43,108,176,0.25); position:relative; overflow:hidden; }
        .mrc-week-hero::before { content:""; position:absolute; top:-60px; right:-60px; width:200px; height:200px; background:radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%); pointer-events:none; }
        .mrc-week-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.4rem; flex-wrap:wrap; gap:0.8rem; position:relative; }
        .mrc-week-eyebrow { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:rgba(255,255,255,0.7); }
        .mrc-week-title { margin:2px 0 0; font-size:1.25rem; font-weight:700; color:#fff; }
        .mrc-week-legend { display:flex; gap:10px; font-size:0.72rem; color:rgba(255,255,255,0.8); font-weight:600; flex-wrap:wrap; }
        .mrc-legend-item { display:flex; align-items:center; gap:5px; }
        .mrc-legend-dot { width:10px; height:10px; border-radius:50%; display:inline-block; }
        .mrc-legend-dot.done   { background:#7BE4B5; }
        .mrc-legend-dot.today  { background:#FFC46B; box-shadow:0 0 0 3px rgba(255,196,107,0.3); }
        .mrc-legend-dot.future { background:rgba(255,255,255,0.4); }

        .mrc-week-track { position:relative; display:grid; grid-template-columns:repeat(7,1fr); gap:4px; padding:0.8rem 0.5rem 0.4rem; }
        .mrc-week-line-bg { position:absolute; left:7%; right:7%; top:calc(0.8rem + 22px); height:3px; background:rgba(255,255,255,0.2); border-radius:2px; }
        .mrc-week-line-fill { position:absolute; left:7%; top:calc(0.8rem + 22px); height:3px; background:linear-gradient(90deg,#7BE4B5 0%,#FFC46B 100%); border-radius:2px; transition:width 0.4s ease; max-width:86%; }
        .mrc-week-day { display:flex; flex-direction:column; align-items:center; gap:4px; position:relative; z-index:1; }
        .mrc-week-marker { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.05rem; transition:transform 0.2s; }
        .mrc-week-day.past .mrc-week-marker { background:#7BE4B5; color:#0F5132; box-shadow:0 2px 10px rgba(123,228,181,0.4); }
        .mrc-week-day.today .mrc-week-marker { background:#FFC46B; color:#7A4B00; box-shadow:0 0 0 4px rgba(255,196,107,0.25),0 4px 16px rgba(255,196,107,0.4); animation:mrc-pulse 2s ease-in-out infinite; transform:scale(1.1); }
        .mrc-week-day.future .mrc-week-marker { background:rgba(255,255,255,0.08); border:2px dashed rgba(255,255,255,0.35); }
        .mrc-week-tick { font-size:1.1rem; }
        .mrc-week-num { font-size:1.05rem; }
        .mrc-week-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.55); }
        .mrc-week-label { font-size:0.7rem; font-weight:700; color:rgba(255,255,255,0.8); text-transform:uppercase; letter-spacing:0.05em; margin-top:4px; }
        .mrc-week-date { font-size:0.78rem; font-weight:600; color:rgba(255,255,255,0.55); }
        @keyframes mrc-pulse { 0%,100%{box-shadow:0 0 0 4px rgba(255,196,107,0.25),0 4px 16px rgba(255,196,107,0.4)} 50%{box-shadow:0 0 0 8px rgba(255,196,107,0.15),0 4px 20px rgba(255,196,107,0.5)} }

        .mrc-sched-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .mrc-sched-stat { background:var(--mrc-surface); border:1.5px solid var(--mrc-border); border-radius:14px; padding:1rem 1.1rem; display:flex; gap:12px; align-items:center; transition:transform 0.2s,box-shadow 0.2s; }
        .mrc-sched-stat:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,0,0,0.06); }
        .mrc-sched-stat-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0; }
        .mrc-sched-stat-num { font-size:1.8rem; font-weight:800; color:var(--mrc-primary); line-height:1; }
        .mrc-sched-stat-label { font-size:0.78rem; color:var(--mrc-muted); font-weight:600; margin-top:3px; }

        .mrc-section-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem; }
        .mrc-section-title { margin:0; font-size:1.1rem; font-weight:700; color:var(--mrc-text); }
        .mrc-ghost-btn { background:transparent; border:1.5px solid var(--mrc-primary); color:var(--mrc-primary); padding:0.5rem 1rem; border-radius:8px; font-size:0.85rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .mrc-ghost-btn:hover { background:var(--mrc-primary); color:#fff; }
        .mrc-adherence-list { display:flex; flex-direction:column; gap:12px; }
        .mrc-adherence-card { background:var(--mrc-surface); border:1.5px solid var(--mrc-border); border-radius:14px; padding:1rem 1.2rem; transition:box-shadow 0.2s; }
        .mrc-adherence-card:hover { box-shadow:0 6px 18px rgba(0,0,0,0.06); }
        .mrc-adherence-head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .mrc-adherence-icon { font-size:1.7rem; flex-shrink:0; }
        .mrc-adherence-info { flex:1; min-width:0; }
        .mrc-adherence-info h4 { margin:0; font-size:1.02rem; font-weight:700; color:var(--mrc-text); }
        .mrc-adherence-sub { font-size:0.82rem; color:var(--mrc-muted); font-weight:600; }
        .mrc-adherence-ring { width:52px; height:52px; border-radius:50%; background:conic-gradient(var(--mrc-success) calc(var(--pct)*1%),#EDF2F7 0); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .mrc-adherence-ring-inner { width:40px; height:40px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:800; color:var(--mrc-text); }
        .mrc-adherence-row { display:grid; grid-template-columns:repeat(7,1fr); gap:6px; }
        .mrc-adherence-slot { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .mrc-slot-chip { width:100%; aspect-ratio:1/1; max-width:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:800; transition:transform 0.15s; }
        .mrc-adherence-slot.done .mrc-slot-chip { background:linear-gradient(135deg,#EBFAF4 0%,#C6F0DF 100%); color:var(--mrc-success); border:1.5px solid #A7F3D0; }
        .mrc-adherence-slot.today .mrc-slot-chip { background:linear-gradient(135deg,#FFF7E6 0%,#FFE5B4 100%); border:2px solid var(--mrc-warning); animation:mrc-pulse-soft 2s ease-in-out infinite; }
        .mrc-adherence-slot.future .mrc-slot-chip { background:#F7FAFC; border:1.5px dashed var(--mrc-border); }
        .mrc-adherence-slot:hover .mrc-slot-chip { transform:scale(1.05); }
        .mrc-slot-tick { font-size:1rem; }
        .mrc-slot-pulse { width:10px; height:10px; border-radius:50%; background:var(--mrc-warning); }
        .mrc-slot-dot { width:6px; height:6px; border-radius:50%; background:#CBD5E0; }
        .mrc-slot-label { font-size:0.68rem; font-weight:700; color:var(--mrc-muted); text-transform:uppercase; }
        @keyframes mrc-pulse-soft { 0%,100%{box-shadow:0 0 0 0 rgba(230,139,0,0.4)} 50%{box-shadow:0 0 0 6px rgba(230,139,0,0)} }

        /* ADD TAB */
        .mrc-add { display:grid; grid-template-columns:1fr 320px; gap:1.5rem; }
        .mrc-add-form { background:var(--mrc-surface); border:1.5px solid var(--mrc-border); border-radius:14px; padding:1.5rem; display:flex; flex-direction:column; gap:1.2rem; }
        .mrc-form-group { display:flex; flex-direction:column; gap:8px; }
        .mrc-form-group label { font-size:0.88rem; font-weight:700; color:var(--mrc-text); }
        .mrc-input-wrap { display:flex; align-items:center; gap:10px; padding:0.2rem 0.9rem; background:#F7FAFC; border:2px solid var(--mrc-border); border-radius:12px; transition:border-color 0.2s,background 0.2s; }
        .mrc-input-wrap:focus-within { border-color:var(--mrc-primary2); background:#fff; }
        .mrc-input-icon { font-size:1.2rem; }
        .mrc-input-wrap input { flex:1; border:none; background:transparent; padding:0.8rem 0; font-size:1rem; color:var(--mrc-text); font-weight:600; outline:none; min-width:0; }
        .mrc-input-wrap input::placeholder { color:#A0AEC0; font-weight:500; }
        .mrc-time-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .mrc-time-btn { display:flex; flex-direction:column; align-items:center; gap:4px; padding:0.9rem 0.4rem; border:2px solid var(--mrc-border); border-radius:12px; background:#F7FAFC; cursor:pointer; transition:all 0.18s; }
        .mrc-time-btn:hover { border-color:var(--mrc-primary2); background:#EBF4FF; transform:translateY(-2px); }
        .mrc-time-btn.active { border-color:var(--mrc-primary); background:linear-gradient(135deg,#EBF4FF 0%,#D6E9FF 100%); box-shadow:0 4px 12px rgba(43,108,176,0.15); transform:translateY(-2px); }
        .mrc-time-btn-icon { font-size:1.6rem; }
        .mrc-time-btn-label { font-size:0.78rem; font-weight:700; color:var(--mrc-text); }
        .mrc-time-btn.active .mrc-time-btn-label { color:var(--mrc-primary); }
        .mrc-error { background:#FFF0F0; border:1px solid #FECACA; border-radius:10px; padding:0.7rem 1rem; font-size:0.88rem; color:var(--mrc-danger); font-weight:600; }
        .mrc-success { background:#EBFAF4; border:1px solid #A7F3D0; border-radius:10px; padding:0.7rem 1rem; font-size:0.88rem; color:var(--mrc-success); font-weight:600; animation:mrc-slidein 0.3s ease; }
        .mrc-add-btn { padding:1rem; background:linear-gradient(135deg,var(--mrc-primary) 0%,var(--mrc-primary2) 100%); color:#fff; border:none; border-radius:12px; font-size:1.02rem; font-weight:700; cursor:pointer; box-shadow:0 6px 16px rgba(43,108,176,0.25); transition:transform 0.1s,box-shadow 0.2s; }
        .mrc-add-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 20px rgba(43,108,176,0.35); }
        .mrc-add-btn:active { transform:scale(0.98); }
        .mrc-add-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .mrc-preview { display:flex; flex-direction:column; gap:10px; }
        .mrc-preview-label { font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--mrc-muted); }
        .mrc-preview-hint { font-size:0.78rem; color:var(--mrc-muted); margin:0; line-height:1.5; }

        @media(max-width:800px) {
          .mrc-add { grid-template-columns:1fr; }
          .mrc-sched-stats { grid-template-columns:1fr; }
        }
        @media(max-width:700px) {
          .mrc-topbar { padding:1rem 1rem 0.8rem; }
          .mrc-brand-subtitle { display:none; }
          .mrc-search { min-width:0; flex:1; }
          .mrc-tabs { padding:0.6rem 1rem 0; }
          .mrc-tab { padding:0.6rem 0.8rem; font-size:0.82rem; }
          .mrc-tab span:not(.mrc-tab-icon):not(.mrc-tab-count) { display:none; }
          .mrc-panel { padding:1rem; }
          .mrc-week-marker { width:36px; height:36px; font-size:0.9rem; }
          .mrc-time-grid { grid-template-columns:repeat(2,1fr); }
        }
      `}</style>

      <div className="mrc-shell">
        <header className="mrc-topbar">
          <div className="mrc-brand">
            <div className="mrc-brand-icon">💊</div>
            <div>
              <div className="mrc-brand-title">Medicines</div>
              <div className="mrc-brand-subtitle">Manage your daily medications</div>
            </div>
          </div>
          <div className="mrc-topbar-actions">
            <div className="mrc-search">
              <span className="mrc-search-icon">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicines, dosage, time…"
              />
              {search && (
                <button type="button" className="mrc-search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
              )}
            </div>
            <button type="button" className="mrc-primary-btn" onClick={() => handleTabChange("add")}>
              <span>➕</span> Add Medicine
            </button>
          </div>
        </header>

        <nav className="mrc-tabs" role="tablist">
          {TABS.map((tab) => {
            const count = tabCounts[tab.id];
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`mrc-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="mrc-tab-icon">{tab.icon}</span>
                <span>{tab.label.replace("\n", " ")}</span>
                {count !== null && count > 0 && <span className="mrc-tab-count">{count}</span>}
              </button>
            );
          })}
        </nav>

        <main className={`mrc-panel ${animating ? "fade" : ""}`}>
          <div className="mrc-panel-header">
            <h2>
              {activeTab === "pending"  && "Pending Medicines"}
              {activeTab === "taken"    && "Taken Today"}
              {activeTab === "schedule" && "Weekly Schedule"}
              {activeTab === "add"      && "Add New Medicine"}
            </h2>
            <p>
              {activeTab === "pending"  && "Medicines you still need to take today"}
              {activeTab === "taken"    && "Medicines you've already completed"}
              {activeTab === "schedule" && "Your week at a glance and per-medicine adherence"}
              {activeTab === "add"      && "Create a new medicine reminder"}
            </p>
          </div>
          <div className="mrc-tab-content">
            {activeTab === "pending" && (
              <MedicineList
                reminders={pending}
                onToggle={onToggleReminder}
                onDelete={onDeleteReminder}
                emptyText="All caught up! No pending medicines."
                emptyIcon="🎉"
              />
            )}
            {activeTab === "taken" && (
              <MedicineList
                reminders={taken}
                onToggle={onToggleReminder}
                onDelete={onDeleteReminder}
                emptyText="No medicines marked as taken yet."
                emptyIcon="💊"
              />
            )}
            {activeTab === "schedule" && (
              <ScheduleTab
                reminders={reminders}
                onSwitchToAdd={() => handleTabChange("add")}
              />
            )}
            {activeTab === "add" && (
              <AddTab
                onAddReminder={onAddReminder}
                onSuccessSwitch={() => handleTabChange("pending")}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default MedicinesPage;
