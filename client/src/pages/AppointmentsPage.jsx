import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Doctors Directory Data ───────────────────────────────────────────────────
const DOCTORS_DATA = [
  {
    hospital: "Apollo Hospital", branch: "Main Branch",
    doctors: [
      { name: "Dr. Anil Sharma",     specialty: "General Checkup",  exp: 18, avatar: "👨‍⚕️", bio: "Dr. Sharma brings nearly two decades of experience in preventive medicine and routine health management. Known for his calm bedside manner, he is particularly popular among elderly patients who appreciate his thorough yet unhurried consultations." },
      { name: "Dr. Priya Mehta",     specialty: "General Checkup",  exp: 12, avatar: "👩‍⚕️", bio: "Dr. Mehta specialises in lifestyle disease management and early detection. She has a special interest in nutrition-based interventions and regularly conducts health awareness workshops for senior citizens." },
      { name: "Dr. Suresh Nair",     specialty: "Cardiologist",     exp: 22, avatar: "👨‍⚕️", bio: "A gold medallist from AIIMS, Dr. Nair is a senior interventional cardiologist with expertise in complex angioplasties and heart failure management. He has performed over 4,000 cardiac procedures." },
      { name: "Dr. Kavita Rao",      specialty: "Cardiologist",     exp: 15, avatar: "👩‍⚕️", bio: "Dr. Rao focuses on preventive cardiology and women's heart health. She was instrumental in establishing the cardiac rehabilitation programme at Apollo." },
      { name: "Dr. Neha Joshi",      specialty: "Dentist",          exp: 10, avatar: "👩‍⚕️", bio: "Dr. Joshi is a gentle and patient dentist specialising in geriatric dentistry and dental implants. She is trained in anxiety-free dentistry techniques." },
      { name: "Dr. Rajesh Bose",     specialty: "Orthopedic",       exp: 20, avatar: "👨‍⚕️", bio: "Dr. Bose is a renowned joint replacement surgeon with over 3,500 successful knee and hip replacements. He pioneered minimally invasive techniques that significantly reduce recovery time." },
      { name: "Dr. Pooja Desai",     specialty: "Dermatologist",    exp: 11, avatar: "👩‍⚕️", bio: "Dr. Desai combines clinical dermatology with cosmetic expertise, specialising in chronic skin conditions in older adults including psoriasis, eczema, and age-related skin changes." },
      { name: "Dr. Karan Malhotra",  specialty: "Neurologist",      exp: 16, avatar: "👨‍⚕️", bio: "Dr. Malhotra is a movement disorder specialist with extensive experience in Parkinson's disease and dementia care. He runs a dedicated memory clinic." },
      { name: "Dr. Anjali Saxena",   specialty: "Ophthalmologist",  exp: 14, avatar: "👩‍⚕️", bio: "Dr. Saxena is an expert in cataract surgery and age-related macular degeneration. She has restored vision for over 6,000 patients." },
      { name: "Dr. Girish Kulkarni", specialty: "Pediatrician",     exp: 19, avatar: "👨‍⚕️", bio: "Dr. Kulkarni is a warm and experienced paediatrician known for his holistic approach to child health. He has been voted best paediatrician in the region for four consecutive years." },
    ]
  },
  {
    hospital: "Apollo Hospital", branch: "North Branch",
    doctors: [
      { name: "Dr. Rohan Gupta",   specialty: "General Checkup", exp: 9,  avatar: "👨‍⚕️", bio: "Dr. Gupta is a family physician focused on chronic disease management and elderly care. He is known for his detailed consultations and ability to explain complex conditions simply." },
      { name: "Dr. Arjun Kapoor",  specialty: "Cardiologist",    exp: 17, avatar: "👨‍⚕️", bio: "Dr. Kapoor specialises in electrophysiology and pacemaker implantation. With 17 years of experience, he has been at the forefront of treating arrhythmias." },
      { name: "Dr. Vikram Patel",  specialty: "Dentist",         exp: 13, avatar: "👨‍⚕️", bio: "Dr. Patel is skilled in full mouth rehabilitation and prosthetic dentistry, helping patients who have lost teeth due to age or illness." },
      { name: "Dr. Rekha Nambiar", specialty: "Gynecologist",    exp: 21, avatar: "👩‍⚕️", bio: "Dr. Nambiar is a senior gynaecologist with special expertise in menopausal health and osteoporosis prevention in women." },
      { name: "Dr. Nidhi Agarwal", specialty: "Psychiatrist",    exp: 12, avatar: "👩‍⚕️", bio: "Dr. Agarwal is a compassionate psychiatrist specialising in geriatric mental health, depression, and anxiety disorders." },
      { name: "Dr. Bhavna Yadav",  specialty: "Physiotherapist", exp: 8,  avatar: "👩‍⚕️", bio: "Dr. Yadav is an expert in post-surgical rehabilitation. She has developed a specialised fall-prevention programme for elderly patients." },
      { name: "Dr. Harish Pandey", specialty: "ENT Specialist",  exp: 15, avatar: "👨‍⚕️", bio: "Dr. Pandey is an ENT surgeon with expertise in hearing loss and balance disorders common in older adults." },
    ]
  },
  {
    hospital: "Fortis Healthcare", branch: "City Centre",
    doctors: [
      { name: "Dr. Sunita Pillai", specialty: "General Checkup", exp: 14, avatar: "👩‍⚕️", bio: "Dr. Pillai is a dedicated general physician known for her empathetic approach and extensive experience managing multi-system diseases in elderly patients." },
      { name: "Dr. Deepak Jain",   specialty: "Cardiologist",    exp: 23, avatar: "👨‍⚕️", bio: "Dr. Jain is one of the most experienced cardiologists in the region, a pioneer in structural heart disease interventions with over two decades of practice." },
      { name: "Dr. Meena Iyer",    specialty: "Orthopedic",      exp: 16, avatar: "👩‍⚕️", bio: "Dr. Iyer is a spinal and joint specialist known for excellent outcomes in revision joint surgeries and osteoporosis management." },
      { name: "Dr. Amit Thakur",   specialty: "Dermatologist",   exp: 10, avatar: "👨‍⚕️", bio: "Dr. Thakur is a clinical and cosmetic dermatologist with training from the UK, specialising in skin cancer detection." },
      { name: "Dr. Naveen Reddy",  specialty: "Ophthalmologist", exp: 12, avatar: "👨‍⚕️", bio: "Dr. Reddy is an expert in vitreoretinal surgery and diabetic eye disease, having performed over 2,000 vitrectomies." },
      { name: "Dr. Lalita Mishra", specialty: "ENT Specialist",  exp: 18, avatar: "👩‍⚕️", bio: "Dr. Mishra is a highly regarded ENT specialist with expertise in endoscopic sinus surgery and age-related hearing rehabilitation." },
      { name: "Dr. Pallavi Sood",  specialty: "Gynecologist",    exp: 13, avatar: "👩‍⚕️", bio: "Dr. Sood specialises in minimally invasive gynaecological surgery and urogynaecology for elderly women." },
      { name: "Dr. Madhuri Shah",  specialty: "Pediatrician",    exp: 15, avatar: "👩‍⚕️", bio: "Dr. Shah is a developmental paediatrician with special training in autism spectrum disorders and learning disabilities." },
    ]
  },
  {
    hospital: "Fortis Healthcare", branch: "East Wing",
    doctors: [
      { name: "Dr. Ramesh Kumar",  specialty: "General Checkup", exp: 20, avatar: "👨‍⚕️", bio: "Dr. Kumar is a veteran family physician beloved by patients for his patient, thorough approach across 20 years." },
      { name: "Dr. Sanjay Verma",  specialty: "Cardiologist",    exp: 18, avatar: "👨‍⚕️", bio: "Dr. Verma is an expert in cardiac imaging and non-invasive cardiology, known for accurate early diagnosis." },
      { name: "Dr. Simran Kaur",   specialty: "Dentist",         exp: 7,  avatar: "👩‍⚕️", bio: "Dr. Kaur is skilled in aesthetic dentistry and orthodontics, adept at treating patients with dental anxiety." },
      { name: "Dr. Saurabh Menon", specialty: "Psychiatrist",    exp: 14, avatar: "👨‍⚕️", bio: "Dr. Menon is a senior psychiatrist with expertise in mood disorders, cognitive decline, and addiction medicine." },
      { name: "Dr. Rohit Bansal",  specialty: "Physiotherapist", exp: 11, avatar: "👨‍⚕️", bio: "Dr. Bansal focuses on rehabilitation of joint replacement patients and chronic pain management in elderly patients." },
    ]
  },
  {
    hospital: "Max Super Speciality", branch: "Central Block",
    doctors: [
      { name: "Dr. Ritu Singh",      specialty: "Cardiologist",    exp: 19, avatar: "👩‍⚕️", bio: "Dr. Singh is a highly accomplished interventional cardiologist recognised nationally for her work in primary angioplasty." },
      { name: "Dr. Seema Bhat",      specialty: "Neurologist",     exp: 17, avatar: "👩‍⚕️", bio: "Dr. Bhat is a stroke specialist whose rapid response protocols have significantly improved patient outcomes at Max." },
      { name: "Dr. Manish Tiwari",   specialty: "Orthopedic",      exp: 15, avatar: "👨‍⚕️", bio: "Dr. Tiwari is one of the few surgeons in India trained in robotic-assisted knee surgery, ensuring faster recovery." },
      { name: "Dr. Usha Trivedi",    specialty: "Gynecologist",    exp: 24, avatar: "👩‍⚕️", bio: "Dr. Trivedi is one of the most experienced gynaecologists in the country with 24 years of practice." },
      { name: "Dr. Tarun Bajaj",     specialty: "Pediatrician",    exp: 13, avatar: "👨‍⚕️", bio: "Dr. Bajaj is a neonatologist and paediatric intensivist who heads the NICU at Max." },
      { name: "Dr. Divya Choudhary", specialty: "General Checkup", exp: 8,  avatar: "👩‍⚕️", bio: "Dr. Choudhary is building a reputation for thorough annual health assessments and clear patient communication." },
    ]
  },
  {
    hospital: "AIIMS", branch: "Main Campus",
    doctors: [
      { name: "Dr. Prakash Nair",     specialty: "General Checkup", exp: 25, avatar: "👨‍⚕️", bio: "Dr. Nair is a Professor of Medicine at AIIMS with 25 years of clinical and academic experience, having authored three medical textbooks." },
      { name: "Dr. Sunanda Roy",      specialty: "Cardiologist",    exp: 21, avatar: "👩‍⚕️", bio: "Dr. Roy is a Professor of Cardiology and leading researcher in heart failure whose work is cited in international guidelines." },
      { name: "Dr. Vikram Bose",      specialty: "Neurologist",     exp: 20, avatar: "👨‍⚕️", bio: "Dr. Bose is an expert in neuromuscular diseases who runs the country's largest clinic for Myasthenia Gravis." },
      { name: "Dr. Anita Menon",      specialty: "Orthopedic",      exp: 18, avatar: "👩‍⚕️", bio: "Dr. Menon is a spine surgeon who pioneered minimally invasive spine surgery techniques in India." },
      { name: "Dr. Farhan Siddiqui",  specialty: "Dermatologist",   exp: 16, avatar: "👨‍⚕️", bio: "Dr. Siddiqui is a dermatopathologist whose research has contributed to national treatment protocols for rare skin disorders." },
      { name: "Dr. Leela Krishnan",   specialty: "Psychiatrist",    exp: 22, avatar: "👩‍⚕️", bio: "Dr. Krishnan is a Professor of Psychiatry known internationally for geriatric psychiatry and has been a WHO mental health consultant." },
      { name: "Dr. Gaurav Tiwari",    specialty: "Ophthalmologist", exp: 14, avatar: "👨‍⚕️", bio: "Dr. Tiwari is an ocular oncologist who runs the eye bank at AIIMS and has performed corneal transplants for patients nationwide." },
      { name: "Dr. Nisha Kapoor",     specialty: "ENT Specialist",  exp: 13, avatar: "👩‍⚕️", bio: "Dr. Kapoor is a cochlear implant specialist who has given the gift of hearing to over 300 profoundly deaf patients." },
      { name: "Dr. Arvind Pandey",    specialty: "Pediatrician",    exp: 17, avatar: "👨‍⚕️", bio: "Dr. Pandey leads the national thalassemia management programme and has helped over 1,000 children access affordable care." },
      { name: "Dr. Meera Chatterjee", specialty: "Gynecologist",    exp: 19, avatar: "👩‍⚕️", bio: "Dr. Chatterjee is a reproductive endocrinologist and recipient of the national excellence award in medicine." },
    ]
  },
  {
    hospital: "Medanta Hospital", branch: "Gurugram",
    doctors: [
      { name: "Dr. Rajiv Anand",  specialty: "Cardiologist",    exp: 26, avatar: "👨‍⚕️", bio: "Dr. Anand is a legendary cardiologist recognised among the top 10 in India, pioneering complex coronary interventions." },
      { name: "Dr. Preethi Nair", specialty: "Neurologist",     exp: 15, avatar: "👩‍⚕️", bio: "Dr. Nair's golden hour stroke protocols at Medanta have dramatically improved survival and recovery rates." },
      { name: "Dr. Sunil Mathur", specialty: "Orthopedic",      exp: 20, avatar: "👨‍⚕️", bio: "Dr. Mathur is a senior orthopaedic oncologist with expertise in limb-salvage surgery and complex revision arthroplasty." },
      { name: "Dr. Kamla Verma",  specialty: "General Checkup", exp: 16, avatar: "👩‍⚕️", bio: "Dr. Verma is passionate about improving quality of life for India's ageing population through geriatric medicine." },
      { name: "Dr. Shweta Dubey", specialty: "Physiotherapist", exp: 9,  avatar: "👩‍⚕️", bio: "Dr. Dubey leads the post-ICU rehabilitation programme, helping critically ill patients recover to independent living." },
      { name: "Dr. Yusuf Khan",   specialty: "Dentist",         exp: 12, avatar: "👨‍⚕️", bio: "Dr. Khan is an oral and maxillofacial surgeon with expertise in jaw reconstruction and dental implants for cancer patients." },
    ]
  },
  {
    hospital: "Kokilaben Hospital", branch: "Mumbai West",
    doctors: [
      { name: "Dr. Hema Rao",      specialty: "Cardiologist",    exp: 20, avatar: "👩‍⚕️", bio: "Dr. Rao is the director of the cardiac catheterisation lab at Kokilaben, known for expertise in complex coronary interventions." },
      { name: "Dr. Cyrus Patel",   specialty: "Neurologist",     exp: 18, avatar: "👨‍⚕️", bio: "Dr. Patel manages one of India's largest deep brain stimulation programmes, transforming lives of Parkinson's patients." },
      { name: "Dr. Savita Iyer",   specialty: "Gynecologist",    exp: 22, avatar: "👩‍⚕️", bio: "Dr. Iyer heads the women's cancer programme and has pioneered fertility-sparing surgeries for gynaecological cancers." },
      { name: "Dr. Fiona D'Souza", specialty: "Dermatologist",   exp: 14, avatar: "👩‍⚕️", bio: "Dr. D'Souza is an expert in laser dermatology and managing complex pigmentation disorders across different skin types." },
      { name: "Dr. Abhijit Sen",   specialty: "General Checkup", exp: 17, avatar: "👨‍⚕️", bio: "Dr. Sen is known for his systematic diagnostic approach and his ability to coordinate complex multi-specialty care." },
      { name: "Dr. Nalini Reddy",  specialty: "Pediatrician",    exp: 11, avatar: "👩‍⚕️", bio: "Dr. Reddy is a paediatric pulmonologist who has helped hundreds of children with asthma lead active, normal lives." },
    ]
  },
];

const TYPE_META = {
  doctor:     { icon: "🩺", color: "#4A90D9" },
  hospital:   { icon: "🏥", color: "#E05C5C" },
  lab:        { icon: "🔬", color: "#7B6CF6" },
  specialist: { icon: "👨‍⚕️", color: "#27AE82" },
};

const TABS = [
  { id: "book",     icon: "📋", label: "Book\nAppointment"    },
  { id: "upcoming", icon: "📅", label: "Upcoming\nAppointments" },
  { id: "history",  icon: "🕐", label: "History"              },
  { id: "doctors",  icon: "🏥", label: "Our\nDoctors"         },
];

const apiFetch = async (path) => {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
};

function daysBetween(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const apt   = new Date(dateStr); apt.setHours(0,0,0,0);
  return Math.round((apt - today) / 86400000);
}

function DayBadge({ dateStr }) {
  const diff = daysBetween(dateStr);
  if (diff === 0) return <span className="apc-badge badge-today">🔔 Today!</span>;
  if (diff === 1) return <span className="apc-badge badge-tomorrow">🔔 Tomorrow!</span>;
  if (diff > 1)   return <span className="apc-badge badge-future">in {diff} days</span>;
  return null;
}

function StepBar({ step }) {
  const steps = ["Patient", "Hospital", "Specialty & Doctor", "Date & Time", "Confirm"];
  return (
    <div className="apc-stepbar">
      {steps.map((s, i) => (
        <div key={i} className={`apc-step ${i+1===step?"active":i+1<step?"done":""}`}>
          <div className="apc-step-dot">{i+1<step?"✓":i+1}</div>
          <span className="apc-step-label">{s}</span>
          {i < steps.length-1 && <div className="apc-step-line"/>}
        </div>
      ))}
    </div>
  );
}

function LoadingRow({ text }) {
  return <div className="apc-loading"><div className="apc-spinner"/><span>{text}</span></div>;
}

function ErrorRow({ text, onRetry }) {
  return <div className="apc-error-box">⚠️ {text}{onRetry && <button className="apc-retry-btn" onClick={onRetry}>Retry</button>}</div>;
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="apc-overlay">
      <div className="apc-modal">
        <p>{message}</p>
        <div className="apc-modal-actions">
          <button className="apc-modal-yes" onClick={onConfirm}>Yes, confirm</button>
          <button className="apc-modal-no"  onClick={onCancel}>Go back</button>
        </div>
      </div>
    </div>
  );
}

function RescheduleModal({ appointment, onSave, onCancel }) {
  const [newDate, setNewDate] = useState(appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().slice(0,16) : "");
  return (
    <div className="apc-overlay">
      <div className="apc-modal">
        <h3 style={{marginBottom:"1rem"}}>Reschedule Appointment</h3>
        <p style={{marginBottom:"0.5rem",color:"var(--apc-muted)"}}>{appointment.doctorName} — {appointment.specialty}</p>
        <input className="apc-input" type="datetime-local" value={newDate} onChange={e=>setNewDate(e.target.value)}/>
        <div className="apc-modal-actions" style={{marginTop:"1rem"}}>
          <button className="apc-modal-yes" onClick={()=>onSave(newDate)}>Save</button>
          <button className="apc-modal-no"  onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ apt, showActions, onCancel, onComplete, onReschedule }) {
  const meta = TYPE_META[apt.type] || TYPE_META.doctor;
  const [confirmCancel,  setConfirmCancel]  = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  return (
    <div className="apc-card" style={{"--card-accent":meta.color}}>
      {confirmCancel  && <ConfirmModal message={`Cancel appointment with ${apt.doctorName}?`} onConfirm={()=>{setConfirmCancel(false);onCancel(apt._id);}} onCancel={()=>setConfirmCancel(false)}/>}
      {showReschedule && <RescheduleModal appointment={apt} onSave={d=>{setShowReschedule(false);onReschedule(apt._id,d);}} onCancel={()=>setShowReschedule(false)}/>}
      <div className="apc-card-accent-bar"/>
      <div className="apc-card-header">
        <span className="apc-type-icon">{meta.icon}</span>
        <div className="apc-card-title-group">
          <h4>{apt.doctorName}</h4>
          <span className="apc-specialty">{apt.specialty}</span>
          {apt.patientName  && <span className="apc-patient-tag">👤 {apt.patientName}</span>}
          {apt.hospitalName && <span className="apc-hospital-tag">🏥 {apt.hospitalName}{apt.hospitalBranch?` — ${apt.hospitalBranch}`:""}</span>}
        </div>
        {apt.completed  ? <span className="apc-done-badge">✓ Done</span> : <DayBadge dateStr={apt.appointmentDate}/>}
      </div>
      <div className="apc-card-body">
        <div className="apc-card-row">
          <span>📅</span>
          <span>{new Date(apt.appointmentDate).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</span>
          <span style={{marginLeft:"1rem"}}>🕐 {new Date(apt.appointmentDate).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
        </div>
        {apt.notes && <div className="apc-card-notes">💬 {apt.notes}</div>}
      </div>
      {showActions && !apt.completed && (
        <div className="apc-card-actions">
          <button className="apc-btn apc-btn-done"       onClick={()=>onComplete(apt._id)}>✓ Mark Done</button>
          <button className="apc-btn apc-btn-reschedule" onClick={()=>setShowReschedule(true)}>📅 Reschedule</button>
          <button className="apc-btn apc-btn-cancel"     onClick={()=>setConfirmCancel(true)}>✕ Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── BOOK TAB ─────────────────────────────────────────────────────────────────
function BookTab({ onAddAppointment }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ patientName:"", hospitalId:"", hospitalName:"", hospitalBranch:"", specialty:"", doctorId:"", doctorName:"", date:"", time:"", notes:"" });
  const [hospitals,   setHospitals]   = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors,     setDoctors]     = useState([]);
  const [loadingH, setLoadingH] = useState(false); const [errorH, setErrorH] = useState(null);
  const [loadingS, setLoadingS] = useState(false); const [errorS, setErrorS] = useState(null);
  const [loadingD, setLoadingD] = useState(false); const [errorD, setErrorD] = useState(null);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    setLoadingH(true); setErrorH(null);
    apiFetch("/hospitals").then(d=>{setHospitals(d.hospitals||[]);setLoadingH(false);}).catch(()=>{setErrorH("Could not load hospitals.");setLoadingH(false);});
  }, []);

  useEffect(() => {
    if (!form.hospitalId) { setSpecialties([]); return; }
    setLoadingS(true); setErrorS(null);
    setForm(f=>({...f,specialty:"",doctorId:"",doctorName:""})); setDoctors([]);
    apiFetch(`/specialties?hospitalId=${form.hospitalId}`).then(d=>{setSpecialties(d.specialties||[]);setLoadingS(false);}).catch(()=>{setErrorS("Could not load specialties.");setLoadingS(false);});
  }, [form.hospitalId]);

  useEffect(() => {
    if (!form.hospitalId||!form.specialty) { setDoctors([]); return; }
    setLoadingD(true); setErrorD(null);
    setForm(f=>({...f,doctorId:"",doctorName:""}));
    apiFetch(`/doctors?hospitalId=${form.hospitalId}&specialty=${encodeURIComponent(form.specialty)}`).then(d=>{setDoctors(d.doctors||[]);setLoadingD(false);}).catch(()=>{setErrorD("Could not load doctors.");setLoadingD(false);});
  }, [form.hospitalId, form.specialty]);

  const handleHospitalSelect = (h) => setForm(f=>({...f,hospitalId:h._id,hospitalName:h.name,hospitalBranch:h.branch,specialty:"",doctorId:"",doctorName:""}));

  const handleSubmit = async () => {
    const appointmentDate = new Date(`${form.date}T${form.time}`).toISOString();
    await onAddAppointment({...form,appointmentDate,type:"doctor"});
    setForm({patientName:"",hospitalId:"",hospitalName:"",hospitalBranch:"",specialty:"",doctorId:"",doctorName:"",date:"",time:"",notes:""});
    setSpecialties([]); setDoctors([]); setStep(1);
  };

  const groupedHospitals = hospitals.reduce((acc,h)=>{ if(!acc[h.name])acc[h.name]=[]; acc[h.name].push(h); return acc; },{});

  return (
    <div className="apc-tab-content">
      <StepBar step={step}/>
      {step===1 && (
        <div className="apc-form-section">
          <h3>Patient Details</h3>
          <div className="apc-form-group"><label>Patient Name *</label><input className="apc-input" placeholder="Enter patient's full name" value={form.patientName} onChange={e=>set("patientName",e.target.value)}/></div>
          <div className="apc-form-group"><label>Notes (optional)</label><textarea className="apc-input apc-textarea" placeholder="Symptoms or special instructions..." value={form.notes} onChange={e=>set("notes",e.target.value)}/></div>
          <button className="apc-next-btn" onClick={()=>{if(!form.patientName.trim()){alert("Please enter the patient name");return;}setStep(2);}}>Next →</button>
        </div>
      )}
      {step===2 && (
        <div className="apc-form-section">
          <h3>Choose Hospital</h3>
          {loadingH && <LoadingRow text="Loading hospitals..."/>}
          {errorH   && <ErrorRow  text={errorH}/>}
          {!loadingH && !errorH && Object.entries(groupedHospitals).map(([name,branches])=>(
            <div key={name} className="apc-hospital-group">
              <div className="apc-hospital-group-name">🏥 {name}</div>
              {branches.map(h=>(
                <button key={h._id} type="button" className={`apc-select-btn ${form.hospitalId===h._id?"selected":""}`} onClick={()=>handleHospitalSelect(h)}>
                  <span className="apc-select-label">{h.branch}</span>
                  {form.hospitalId===h._id && <span className="apc-check">✓</span>}
                </button>
              ))}
            </div>
          ))}
          <div className="apc-btn-row">
            <button className="apc-back-btn" onClick={()=>setStep(1)}>← Back</button>
            <button className="apc-next-btn" onClick={()=>{if(!form.hospitalId){alert("Please select a hospital");return;}setStep(3);}}>Next →</button>
          </div>
        </div>
      )}
      {step===3 && (
        <div className="apc-form-section">
          <h3>Specialty & Doctor</h3>
          <div className="apc-form-group">
            <label>Choose Specialty *</label>
            {loadingS && <LoadingRow text="Loading specialties..."/>}
            {errorS   && <ErrorRow  text={errorS}/>}
            {!loadingS && !errorS && specialties.length===0 && <div className="apc-empty-inline">No specialties found for this hospital.</div>}
            {!loadingS && !errorS && specialties.length>0 && (
              <div className="apc-specialty-grid">
                {specialties.map(s=>(
                  <button key={s} type="button" className={`apc-specialty-btn ${form.specialty===s?"selected":""}`} onClick={()=>set("specialty",s)}>
                    {s}{form.specialty===s&&<span className="apc-check" style={{marginLeft:"auto"}}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {form.specialty && (
            <div className="apc-form-group">
              <label>Choose Doctor *</label>
              {loadingD && <LoadingRow text={`Loading doctors...`}/>}
              {errorD   && <ErrorRow  text={errorD}/>}
              {!loadingD && !errorD && doctors.length===0 && <div className="apc-empty-inline">No doctors available.</div>}
              {!loadingD && !errorD && doctors.length>0 && (
                <div className="apc-doctor-list">
                  {doctors.map(doc=>(
                    <button key={doc._id} type="button" className={`apc-doctor-btn ${form.doctorId===doc._id?"selected":""}`} onClick={()=>{set("doctorId",doc._id);set("doctorName",doc.name);}}>
                      <span className="apc-doc-avatar">👨‍⚕️</span>
                      <span className="apc-doc-name">{doc.name}</span>
                      {form.doctorId===doc._id && <span className="apc-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="apc-btn-row">
            <button className="apc-back-btn" onClick={()=>setStep(2)}>← Back</button>
            <button className="apc-next-btn" onClick={()=>{if(!form.specialty){alert("Please select a specialty");return;}if(!form.doctorName){alert("Please select a doctor");return;}setStep(4);}}>Next →</button>
          </div>
        </div>
      )}
      {step===4 && (
        <div className="apc-form-section">
          <h3>Date & Time</h3>
          <div className="apc-form-group"><label>Date *</label><input className="apc-input" type="date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={e=>set("date",e.target.value)}/></div>
          <div className="apc-form-group"><label>Time *</label><input className="apc-input" type="time" value={form.time} onChange={e=>set("time",e.target.value)}/></div>
          <div className="apc-btn-row">
            <button className="apc-back-btn" onClick={()=>setStep(3)}>← Back</button>
            <button className="apc-next-btn" onClick={()=>{if(!form.date||!form.time){alert("Please select date and time");return;}setStep(5);}}>Next →</button>
          </div>
        </div>
      )}
      {step===5 && (
        <div className="apc-form-section">
          <h3>Confirm Appointment</h3>
          <div className="apc-confirm-card">
            <div className="apc-confirm-row"><b>👤 Patient:</b>   {form.patientName}</div>
            <div className="apc-confirm-row"><b>🏥 Hospital:</b>  {form.hospitalName} — {form.hospitalBranch}</div>
            <div className="apc-confirm-row"><b>🩺 Specialty:</b> {form.specialty}</div>
            <div className="apc-confirm-row"><b>👨‍⚕️ Doctor:</b>   {form.doctorName}</div>
            <div className="apc-confirm-row"><b>📅 Date:</b>      {new Date(form.date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</div>
            <div className="apc-confirm-row"><b>🕐 Time:</b>      {form.time}</div>
            {form.notes && <div className="apc-confirm-row"><b>💬 Notes:</b> {form.notes}</div>}
          </div>
          <div className="apc-btn-row">
            <button className="apc-back-btn"   onClick={()=>setStep(4)}>← Back</button>
            <button className="apc-submit-btn" onClick={handleSubmit}>✓ Book Appointment</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UPCOMING TAB ─────────────────────────────────────────────────────────────
function UpcomingTab({ appointments, onCancel, onComplete, onReschedule }) {
  const [search, setSearch] = useState("");
  const upcoming = appointments
    .filter(a=>!a.completed&&new Date(a.appointmentDate)>=new Date(new Date().setHours(0,0,0,0)))
    .filter(a=>a.doctorName?.toLowerCase().includes(search.toLowerCase())||a.specialty?.toLowerCase().includes(search.toLowerCase())||a.hospitalName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>new Date(a.appointmentDate)-new Date(b.appointmentDate));
  return (
    <div className="apc-tab-content">
      <div className="apc-search-bar"><input className="apc-input" placeholder="🔍 Search by doctor, specialty or hospital..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {upcoming.length===0 ? <div className="apc-empty"><div className="apc-empty-icon">📅</div><p>No upcoming appointments</p></div>
        : upcoming.map(apt=><AppointmentCard key={apt._id} apt={apt} showActions={true} onCancel={onCancel} onComplete={onComplete} onReschedule={onReschedule}/>)}
    </div>
  );
}

// ─── HISTORY TAB ─────────────────────────────────────────────────────────────
function HistoryTab({ appointments }) {
  const [search, setSearch] = useState("");
  const past = appointments
    .filter(a=>a.completed||new Date(a.appointmentDate)<new Date(new Date().setHours(0,0,0,0)))
    .filter(a=>a.doctorName?.toLowerCase().includes(search.toLowerCase())||a.specialty?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>new Date(b.appointmentDate)-new Date(a.appointmentDate));
  const countThisYear = appointments.filter(a=>new Date(a.appointmentDate).getFullYear()===new Date().getFullYear()&&a.completed).length;
  return (
    <div className="apc-tab-content">
      <div className="apc-history-stats">
        <div className="apc-stat-card"><span className="apc-stat-num">{countThisYear}</span><span className="apc-stat-label">completed this year</span></div>
        <div className="apc-stat-card"><span className="apc-stat-num">{appointments.filter(a=>a.completed).length}</span><span className="apc-stat-label">total visits</span></div>
      </div>
      <div className="apc-search-bar"><input className="apc-input" placeholder="🔍 Search history..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {past.length===0 ? <div className="apc-empty"><div className="apc-empty-icon">🕐</div><p>No past appointments yet</p></div>
        : past.map(apt=><AppointmentCard key={apt._id} apt={{...apt,completed:true}} showActions={false}/>)}
    </div>
  );
}

// ─── OUR DOCTORS TAB ─────────────────────────────────────────────────────────
function OurDoctorsTab() {
  const [search,          setSearch]          = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterHospital,  setFilterHospital]  = useState("all");
  const [expanded,        setExpanded]        = useState(null);

  const allSpecialties = [...new Set(DOCTORS_DATA.flatMap(h=>h.doctors.map(d=>d.specialty)))].sort();
  const allHospitals   = DOCTORS_DATA.map(h=>`${h.hospital} — ${h.branch}`);

  const filtered = DOCTORS_DATA
    .filter(h=>filterHospital==="all"||`${h.hospital} — ${h.branch}`===filterHospital)
    .map(h=>({...h, doctors: h.doctors.filter(d=>{
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())||d.specialty.toLowerCase().includes(search.toLowerCase())||d.bio.toLowerCase().includes(search.toLowerCase());
      const matchSpec   = filterSpecialty==="all"||d.specialty===filterSpecialty;
      return matchSearch && matchSpec;
    })}))
    .filter(h=>h.doctors.length>0);

  const totalDoctors = filtered.reduce((s,h)=>s+h.doctors.length, 0);

  return (
    <div className="apc-tab-content">
      <div className="od-filters">
        <input className="apc-input od-search" placeholder="🔍 Search by name, specialty or keyword..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="apc-input od-select" value={filterSpecialty} onChange={e=>setFilterSpecialty(e.target.value)}>
          <option value="all">All Specialties</option>
          {allSpecialties.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="apc-input od-select" value={filterHospital} onChange={e=>setFilterHospital(e.target.value)}>
          <option value="all">All Hospitals</option>
          {allHospitals.map(h=><option key={h}>{h}</option>)}
        </select>
      </div>

      <p className="od-count">{totalDoctors} doctor{totalDoctors!==1?"s":""} found</p>

      {filtered.length===0 ? (
        <div className="apc-empty"><div className="apc-empty-icon">🔍</div><p>No doctors found matching your search</p></div>
      ) : filtered.map((hosp,hi)=>(
        <div key={hi} className="od-hospital-block">
          <div className="od-hospital-header">
            <span className="od-hosp-icon">🏥</span>
            <div><div className="od-hosp-name">{hosp.hospital}</div><div className="od-hosp-branch">{hosp.branch}</div></div>
            <span className="od-hosp-count">{hosp.doctors.length} doctors</span>
          </div>
          <div className="od-doctors-grid">
            {hosp.doctors.map((doc,di)=>{
              const key=`${hi}-${di}`;
              const isOpen=expanded===key;
              return (
                <div key={di} className={`od-doctor-card ${isOpen?"open":""}`}>
                  <div className="od-doc-top" onClick={()=>setExpanded(prev=>prev===key?null:key)}>
                    <div className="od-doc-avatar">{doc.avatar}</div>
                    <div className="od-doc-info">
                      <div className="od-doc-name">{doc.name}</div>
                      <div className="od-doc-spec">{doc.specialty}</div>
                      <div className="od-doc-exp">⭐ {doc.exp} yrs experience</div>
                    </div>
                    <div className={`od-chevron ${isOpen?"up":""}`}>▼</div>
                  </div>
                  {isOpen && <div className="od-doc-bio"><p>{doc.bio}</p></div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function AppointmentsPage({ appointments=[], onAddAppointment, onDeleteAppointment, onCompleteAppointment, onRescheduleAppointment }) {
  const [activeTab, setActiveTab] = useState("book");
  const [animating, setAnimating] = useState(false);
  const handleTabChange = (id) => {
    if(id===activeTab)return;
    setAnimating(true);
    setTimeout(()=>{setActiveTab(id);setAnimating(false);},180);
  };

  return (
    <>
      <style>{`
        :root { --apc-bg:#F4F7FB; --apc-surface:#FFFFFF; --apc-border:#E2E8F0; --apc-primary:#2B6CB0; --apc-primary2:#3182CE; --apc-text:#1A202C; --apc-muted:#718096; --apc-radius:14px; --apc-shadow:0 4px 24px rgba(0,0,0,0.08); }
        .apc-root { display:flex; min-height:80vh; background:var(--apc-bg); border-radius:var(--apc-radius); overflow:hidden; box-shadow:var(--apc-shadow); font-family:'Segoe UI',system-ui,sans-serif; }
        .apc-sidebar { width:110px; background:var(--apc-primary); display:flex; flex-direction:column; align-items:center; padding:1.5rem 0; gap:0.5rem; flex-shrink:0; }
        .apc-sidebar-logo { font-size:1.6rem; margin-bottom:1rem; }
        .apc-tab-btn { width:88px; min-height:88px; background:transparent; border:none; border-radius:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; color:rgba(255,255,255,0.65); font-size:0.7rem; font-weight:600; text-align:center; line-height:1.3; transition:background 0.2s,color 0.2s,transform 0.15s; white-space:pre-line; padding:0.5rem; }
        .apc-tab-btn .apc-tab-icon { font-size:1.5rem; display:block; transition:transform 0.2s; }
        .apc-tab-btn:hover  { background:rgba(255,255,255,0.12); color:#fff; }
        .apc-tab-btn.active { background:#fff; color:var(--apc-primary); box-shadow:4px 0 16px rgba(0,0,0,0.12); transform:translateX(6px); }
        .apc-tab-btn.active .apc-tab-icon { transform:scale(1.15); }
        .apc-panel { flex:1; overflow-y:auto; padding:2rem; background:var(--apc-bg); }
        .apc-panel.fade { opacity:0; transform:translateX(8px); }
        .apc-panel-header { margin-bottom:1.5rem; }
        .apc-panel-header h2 { font-size:1.6rem; font-weight:700; color:var(--apc-text); margin:0 0 4px; }
        .apc-panel-header p  { color:var(--apc-muted); margin:0; font-size:0.95rem; }
        .apc-stepbar { display:flex; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:4px; }
        .apc-step { display:flex; align-items:center; gap:6px; font-size:0.72rem; color:var(--apc-muted); font-weight:600; }
        .apc-step.active { color:var(--apc-primary); } .apc-step.done { color:#27AE82; }
        .apc-step-dot { width:26px; height:26px; border-radius:50%; background:var(--apc-border); display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; flex-shrink:0; }
        .apc-step.active .apc-step-dot { background:var(--apc-primary); color:#fff; } .apc-step.done .apc-step-dot { background:#27AE82; color:#fff; }
        .apc-step-line { width:20px; height:2px; background:var(--apc-border); margin:0 2px; }
        .apc-step-label { display:none; } @media(min-width:700px){ .apc-step-label { display:inline; } }
        .apc-form-section h3 { font-size:1.1rem; font-weight:700; color:var(--apc-text); margin:0 0 1.5rem; }
        .apc-form-group { margin-bottom:1.2rem; } .apc-form-group label { display:block; font-size:0.88rem; font-weight:600; color:var(--apc-text); margin-bottom:8px; }
        .apc-input { width:100%; padding:0.75rem 1rem; border:2px solid var(--apc-border); border-radius:10px; font-size:1rem; color:var(--apc-text); background:var(--apc-surface); transition:border-color 0.2s; box-sizing:border-box; }
        .apc-input:focus { outline:none; border-color:var(--apc-primary2); } .apc-textarea { min-height:90px; resize:vertical; }
        .apc-hospital-group { margin-bottom:1rem; } .apc-hospital-group-name { font-size:0.82rem; font-weight:700; color:var(--apc-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px; padding-left:4px; }
        .apc-select-btn { display:flex; align-items:center; width:100%; padding:0.8rem 1rem; border:2px solid var(--apc-border); border-radius:10px; background:var(--apc-surface); cursor:pointer; font-size:0.95rem; font-weight:600; color:var(--apc-text); margin-bottom:6px; transition:all 0.18s; text-align:left; }
        .apc-select-btn:hover { border-color:var(--apc-primary2); background:#EBF4FF; } .apc-select-btn.selected { border-color:var(--apc-primary); background:#EBF4FF; color:var(--apc-primary); }
        .apc-select-label { flex:1; } .apc-check { color:#27AE82; font-weight:800; font-size:1.05rem; }
        .apc-specialty-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
        .apc-specialty-btn { display:flex; align-items:center; padding:0.7rem 0.9rem; border:2px solid var(--apc-border); border-radius:10px; background:var(--apc-surface); cursor:pointer; font-size:0.88rem; font-weight:600; color:var(--apc-text); transition:all 0.18s; gap:6px; }
        .apc-specialty-btn:hover { border-color:var(--apc-primary2); background:#EBF4FF; } .apc-specialty-btn.selected { border-color:var(--apc-primary); background:#EBF4FF; color:var(--apc-primary); }
        .apc-doctor-list { display:flex; flex-direction:column; gap:8px; }
        .apc-doctor-btn { display:flex; align-items:center; gap:12px; padding:0.85rem 1rem; border:2px solid var(--apc-border); border-radius:10px; background:var(--apc-surface); cursor:pointer; font-size:0.95rem; font-weight:600; color:var(--apc-text); transition:all 0.18s; text-align:left; width:100%; }
        .apc-doctor-btn:hover { border-color:var(--apc-primary2); background:#EBF4FF; } .apc-doctor-btn.selected { border-color:var(--apc-primary); background:#EBF4FF; color:var(--apc-primary); }
        .apc-doc-avatar { font-size:1.4rem; flex-shrink:0; } .apc-doc-name { flex:1; }
        .apc-loading { display:flex; align-items:center; gap:10px; padding:1rem; color:var(--apc-muted); font-size:0.9rem; }
        .apc-spinner { width:20px; height:20px; border:3px solid var(--apc-border); border-top-color:var(--apc-primary); border-radius:50%; animation:apc-spin 0.7s linear infinite; flex-shrink:0; }
        @keyframes apc-spin { to { transform:rotate(360deg); } }
        .apc-error-box { background:#FFF0F0; border:1px solid #FECACA; border-radius:10px; padding:0.8rem 1rem; font-size:0.9rem; color:#E05C5C; display:flex; align-items:center; gap:10px; margin-bottom:0.5rem; }
        .apc-retry-btn { margin-left:auto; padding:4px 12px; background:#E05C5C; color:#fff; border:none; border-radius:6px; font-size:0.8rem; font-weight:700; cursor:pointer; }
        .apc-empty-inline { padding:1rem; text-align:center; color:var(--apc-muted); font-size:0.9rem; background:var(--apc-surface); border-radius:10px; border:2px dashed var(--apc-border); }
        .apc-next-btn,.apc-submit-btn { width:100%; padding:1rem; background:var(--apc-primary); color:#fff; border:none; border-radius:10px; font-size:1.05rem; font-weight:700; cursor:pointer; transition:background 0.2s,transform 0.1s; margin-top:0.5rem; }
        .apc-submit-btn { background:#27AE82; } .apc-next-btn:hover { background:var(--apc-primary2); } .apc-submit-btn:hover { background:#219a74; }
        .apc-next-btn:active,.apc-submit-btn:active { transform:scale(0.98); }
        .apc-back-btn { padding:0.9rem 1.5rem; background:transparent; border:2px solid var(--apc-border); border-radius:10px; font-size:1rem; font-weight:600; color:var(--apc-muted); cursor:pointer; transition:border-color 0.2s; }
        .apc-back-btn:hover { border-color:var(--apc-primary); color:var(--apc-primary); }
        .apc-btn-row { display:flex; gap:12px; margin-top:0.5rem; } .apc-btn-row .apc-next-btn { flex:1; margin-top:0; }
        .apc-confirm-card { background:var(--apc-surface); border:2px solid var(--apc-border); border-radius:12px; padding:1.2rem 1.5rem; margin-bottom:1.5rem; }
        .apc-confirm-row { padding:0.45rem 0; border-bottom:1px solid var(--apc-border); font-size:0.95rem; color:var(--apc-text); } .apc-confirm-row:last-child { border-bottom:none; }
        .apc-search-bar { margin-bottom:1.2rem; }
        .apc-history-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:1.5rem; }
        .apc-stat-card { background:var(--apc-surface); border:2px solid var(--apc-border); border-radius:12px; padding:1rem 1.2rem; display:flex; flex-direction:column; gap:4px; }
        .apc-stat-num { font-size:2rem; font-weight:800; color:var(--apc-primary); line-height:1; } .apc-stat-label { font-size:0.8rem; color:var(--apc-muted); font-weight:600; }
        .apc-card { background:var(--apc-surface); border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,0.06); margin-bottom:1rem; overflow:hidden; border:1.5px solid var(--apc-border); transition:box-shadow 0.2s; }
        .apc-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.1); }
        .apc-card-accent-bar { height:5px; background:var(--card-accent,var(--apc-primary)); }
        .apc-card-header { display:flex; align-items:flex-start; gap:12px; padding:1rem 1.2rem 0.5rem; }
        .apc-type-icon { font-size:1.8rem; flex-shrink:0; margin-top:2px; } .apc-card-title-group { flex:1; }
        .apc-card-title-group h4 { margin:0; font-size:1.05rem; font-weight:700; color:var(--apc-text); }
        .apc-specialty { font-size:0.85rem; color:var(--apc-muted); display:block; }
        .apc-patient-tag { font-size:0.8rem; color:var(--apc-primary); font-weight:600; display:block; margin-top:2px; }
        .apc-hospital-tag { font-size:0.8rem; color:#27AE82; font-weight:600; display:block; margin-top:2px; }
        .apc-card-body { padding:0.5rem 1.2rem 0.8rem; display:flex; flex-direction:column; gap:4px; }
        .apc-card-row { display:flex; align-items:center; gap:6px; font-size:0.9rem; color:var(--apc-text); flex-wrap:wrap; }
        .apc-card-notes { font-size:0.88rem; color:var(--apc-muted); background:#F7FAFC; border-radius:8px; padding:6px 10px; margin-top:4px; }
        .apc-card-actions { display:flex; gap:8px; padding:0.8rem 1.2rem 1rem; border-top:1px solid var(--apc-border); flex-wrap:wrap; }
        .apc-btn { padding:0.55rem 1rem; border-radius:8px; border:none; font-size:0.88rem; font-weight:700; cursor:pointer; transition:opacity 0.15s,transform 0.1s; }
        .apc-btn:active { transform:scale(0.96); } .apc-btn-done { background:#EBFAF4; color:#27AE82; } .apc-btn-reschedule { background:#EBF4FF; color:#3182CE; } .apc-btn-cancel { background:#FFF0F0; color:#E05C5C; } .apc-btn:hover { opacity:0.8; }
        .apc-badge { font-size:0.72rem; font-weight:700; border-radius:99px; padding:3px 10px; white-space:nowrap; }
        .badge-today { background:#FFF3CD; color:#856404; } .badge-tomorrow { background:#D1ECF1; color:#0C5460; } .badge-future { background:#E8F4FD; color:#2B6CB0; }
        .apc-done-badge { background:#EBFAF4; color:#27AE82; font-size:0.75rem; font-weight:700; border-radius:99px; padding:3px 10px; white-space:nowrap; }
        .apc-empty { text-align:center; padding:3rem 1rem; color:var(--apc-muted); } .apc-empty-icon { font-size:3rem; margin-bottom:0.5rem; }
        .apc-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; }
        .apc-modal { background:var(--apc-surface); border-radius:16px; padding:2rem; max-width:380px; width:90%; box-shadow:0 20px 60px rgba(0,0,0,0.2); }
        .apc-modal p { font-size:1rem; color:var(--apc-text); margin:0 0 1.5rem; } .apc-modal h3 { font-size:1.1rem; color:var(--apc-text); margin:0; }
        .apc-modal-actions { display:flex; gap:10px; }
        .apc-modal-yes { flex:1; padding:0.8rem; background:#E05C5C; color:#fff; border:none; border-radius:10px; font-size:0.95rem; font-weight:700; cursor:pointer; }
        .apc-modal-no  { flex:1; padding:0.8rem; background:var(--apc-border); color:var(--apc-text); border:none; border-radius:10px; font-size:0.95rem; font-weight:700; cursor:pointer; }
        .apc-tab-content { animation:apc-slidein 0.22s ease; }
        @keyframes apc-slidein { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

        /* Our Doctors Tab */
        .od-filters { display:flex; flex-direction:column; gap:10px; margin-bottom:1rem; }
        .od-search { width:100%; }
        .od-select { width:100%; }
        .od-count { font-size:0.85rem; color:var(--apc-muted); font-weight:600; margin-bottom:1rem; }
        .od-hospital-block { margin-bottom:1.5rem; }
        .od-hospital-header { display:flex; align-items:center; gap:12px; background:var(--apc-primary); color:#fff; border-radius:12px 12px 0 0; padding:0.9rem 1.2rem; }
        .od-hosp-icon { font-size:1.4rem; }
        .od-hosp-name { font-size:1rem; font-weight:700; }
        .od-hosp-branch { font-size:0.8rem; opacity:0.8; }
        .od-hosp-count { margin-left:auto; font-size:0.8rem; background:rgba(255,255,255,0.2); border-radius:99px; padding:3px 10px; font-weight:700; white-space:nowrap; }
        .od-doctors-grid { display:flex; flex-direction:column; border:1.5px solid var(--apc-border); border-top:none; border-radius:0 0 12px 12px; overflow:hidden; }
        .od-doctor-card { border-bottom:1px solid var(--apc-border); background:var(--apc-surface); transition:background 0.18s; }
        .od-doctor-card:last-child { border-bottom:none; }
        .od-doctor-card.open { background:#F0F7FF; }
        .od-doc-top { display:flex; align-items:center; gap:12px; padding:0.9rem 1.2rem; cursor:pointer; }
        .od-doc-top:hover { background:#F7FAFF; }
        .od-doc-avatar { font-size:2rem; flex-shrink:0; }
        .od-doc-info { flex:1; }
        .od-doc-name { font-size:0.97rem; font-weight:700; color:var(--apc-text); }
        .od-doc-spec { font-size:0.82rem; color:var(--apc-primary); font-weight:600; margin-top:1px; }
        .od-doc-exp  { font-size:0.78rem; color:#27AE82; font-weight:600; margin-top:2px; }
        .od-chevron  { font-size:0.7rem; color:var(--apc-muted); transition:transform 0.2s; flex-shrink:0; }
        .od-chevron.up { transform:rotate(180deg); }
        .od-doc-bio  { padding:0 1.2rem 1rem 4rem; }
        .od-doc-bio p { font-size:0.88rem; color:var(--apc-muted); line-height:1.6; margin:0; }

        @media(min-width:600px){
          .od-filters { flex-direction:row; }
          .od-search { flex:1; }
          .od-select { width:160px; flex-shrink:0; }
          .od-doctors-grid { display:grid; grid-template-columns:repeat(2,1fr); }
          .od-doctor-card { border-right:1px solid var(--apc-border); }
          .od-doctor-card:nth-child(2n) { border-right:none; }
        }

        @media(max-width:600px){
          .apc-root { flex-direction:column; }
          .apc-sidebar { flex-direction:row; width:100%; padding:0.5rem; justify-content:center; gap:4px; overflow-x:auto; }
          .apc-tab-btn { min-height:64px; width:72px; font-size:0.62rem; }
          .apc-tab-btn.active { transform:translateY(-4px); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
          .apc-panel { padding:1rem; }
          .apc-specialty-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="apc-root">
        <aside className="apc-sidebar">
          <div className="apc-sidebar-logo">🏥</div>
          {TABS.map(tab=>(
            <button key={tab.id} className={`apc-tab-btn ${activeTab===tab.id?"active":""}`} onClick={()=>handleTabChange(tab.id)}>
              <span className="apc-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>
        <main className={`apc-panel ${animating?"fade":""}`}>
          <div className="apc-panel-header">
            <h2>
              {activeTab==="book"     && "Book Appointment"}
              {activeTab==="upcoming" && "Upcoming Appointments"}
              {activeTab==="history"  && "Appointment History"}
              {activeTab==="doctors"  && "Our Doctors"}
            </h2>
            <p>
              {activeTab==="book"     && "Schedule a new doctor visit"}
              {activeTab==="upcoming" && "Your scheduled visits"}
              {activeTab==="history"  && "Your past medical visits"}
              {activeTab==="doctors"  && "Browse our doctors and specialists"}
            </p>
          </div>
          {activeTab==="book"     && <BookTab onAddAppointment={onAddAppointment}/>}
          {activeTab==="upcoming" && <UpcomingTab appointments={appointments} onCancel={onDeleteAppointment} onComplete={onCompleteAppointment} onReschedule={onRescheduleAppointment}/>}
          {activeTab==="history"  && <HistoryTab appointments={appointments}/>}
          {activeTab==="doctors"  && <OurDoctorsTab/>}
        </main>
      </div>
    </>
  );
}

export default AppointmentsPage;