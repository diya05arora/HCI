import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AccessibilityPanel from "./components/AccessibilityPanel";
import ConfirmDialog from "./components/ConfirmDialog";
import MainMenu from "./components/MainMenu";
import Logo from "./components/Logo";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import MedicinesPage from "./pages/MedicinesPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ExercisesPage from "./pages/ExercisesPage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const dictionary = {
  en: {
    appTitle: "Senior Care Companion",
    appSubtitle:
      "Simple, safe, and clear digital support for health, medicine, and emergency help.",
    mainActions: "Main Actions",
    healthInfo: "Appointments",
    medicineReminders: "Medicine Reminders",
    emergencyContacts: "Emergency Contacts",
    addEmergencyContact: "Add Emergency Contact",
    contactName: "Name",
    contactRelation: "Relation",
    contactPhone: "Phone",
    contactPriority: "Priority",
    saveContact: "Save Contact",
    contactAdded: "Emergency contact added successfully.",
    listen: "Listen",
    listenToCard: "Listen to health tip",
    taken: "Taken",
    notTaken: "Not Taken",
    callNow: "Call Now",
    emergencyShortcut: "Emergency Call",
    accessibilityControls: "Accessibility Controls",
    textSize: "Text Size",
    contrastMode: "Contrast Mode",
    normalContrast: "Normal",
    highContrast: "High Contrast",
    language: "Language",
    confirmCallTitle: "Confirm Emergency Call",
    confirmCallText: "Do you want to call",
    cancel: "Cancel",
    confirm: "Yes, Call",
    loading: "Loading, please wait...",
    callSuccess: "Call request sent successfully.",
    signIn: "Sign In",
    createAccount: "Create Account",
    signInTitle: "Sign in to continue",
    registerTitle: "Create your account",
    signInSubtitle: "Access your care tools securely.",
    registerSubtitle: "Set up your account to get started.",
    passwordHint: "Use at least 6 characters.",
    invalidEmail: "Please enter a valid email address.",
    invalidPhone: "Please enter a valid phone number.",
    shortPassword: "Password must be at least 6 characters.",
    confirmPassword: "Confirm Password",
    passwordMismatch: "Passwords do not match.",
    showPassword: "Show",
    hidePassword: "Hide",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    switchToPhone: "Use Phone",
    switchToEmail: "Use Email",
    loginWith: "Login With",
    emailOption: "Email",
    phoneOption: "Phone Number",
    optional: "Optional",
    password: "Password",
    accountType: "Account Type",
    elderlyUser: "Elderly User",
    caregiverUser: "Caregiver",
    authTabsLabel: "Authentication options",
    pleaseWait: "Please wait...",
    loginSuccess: "Signed in successfully.",
    registerSuccess: "Account created successfully.",
    signOut: "Sign Out",
    welcome: "Welcome",
    caregiverProfile: "Caregiver Profile",
    relationshipToElder: "Relationship to Elder",
    elderName: "Elder Name",
    elderAge: "Elder Age",
    notes: "Care Notes",
    saveProfile: "Save Profile",
    profileSaved: "Caregiver profile saved.",
    authRequired: "Please sign in to access health and emergency tools.",
    mainMenu: "Main menu",
    home: "Home",
    medicinesPageTitle: "Medicine Schedule",
    medicineFilterMenu: "Medicine filter menu",
    pendingOnly: "Not Taken",
    takenOnly: "Taken",
    allMedicines: "All Medicines",
    appointments: "Appointments",
    appointmentsPageTitle: "Doctor Appointments",
    addAppointment: "Add Appointment",
    exercises: "Workouts",
    exercisesPageTitle: "Guided Workouts",
    medicinesToday: "MEDICINES TODAY",
    nextAppointment: "NEXT APPOINTMENT",
    workoutStreak: "WORKOUT STREAK",
    keepItUp: "Keep it up!",
    noAppointments: "No appointments scheduled",
    todayGlance: "Today at a Glance",
    todaysMedicines: "Today's medicines",
    upcomingAppointments: "Upcoming appointments",
    noUpcomingAppointments: "No upcoming appointments"
  },
  hi: {
    appTitle: "सीनियर केयर साथी",
    appSubtitle: "स्वास्थ्य, दवा और आपातकालीन सहायता के लिए सरल और सुरक्षित डिजिटल सहयोग।",
    mainActions: "मुख्य विकल्प",
    healthInfo: "स्वास्थ्य जानकारी",
    medicineReminders: "दवा रिमाइंडर",
    emergencyContacts: "आपातकालीन संपर्क",
    addEmergencyContact: "आपातकालीन संपर्क जोड़ें",
    contactName: "नाम",
    contactRelation: "संबंध",
    contactPhone: "फ़ोन",
    contactPriority: "प्राथमिकता",
    saveContact: "संपर्क सहेजें",
    contactAdded: "आपातकालीन संपर्क सफलतापूर्वक जोड़ा गया।",
    listen: "सुनें",
    listenToCard: "स्वास्थ्य जानकारी सुनें",
    taken: "ले ली",
    notTaken: "नहीं ली",
    callNow: "अभी कॉल करें",
    emergencyShortcut: "आपातकालीन कॉल",
    accessibilityControls: "सुगम्यता नियंत्रण",
    textSize: "अक्षर आकार",
    contrastMode: "कॉन्ट्रास्ट मोड",
    normalContrast: "सामान्य",
    highContrast: "उच्च कॉन्ट्रास्ट",
    language: "भाषा",
    confirmCallTitle: "आपातकालीन कॉल की पुष्टि",
    confirmCallText: "क्या आप कॉल करना चाहते हैं",
    cancel: "रद्द करें",
    confirm: "हाँ, कॉल करें",
    loading: "लोड हो रहा है, कृपया प्रतीक्षा करें...",
    callSuccess: "कॉल अनुरोध सफलतापूर्वक भेजा गया।",
    signIn: "साइन इन",
    createAccount: "खाता बनाएं",
    signInTitle: "जारी रखने के लिए साइन इन करें",
    registerTitle: "अपना खाता बनाएं",
    signInSubtitle: "अपने देखभाल टूल्स तक सुरक्षित पहुंच पाएं।",
    registerSubtitle: "शुरू करने के लिए अपना खाता सेट करें।",
    passwordHint: "कम से कम 6 अक्षर इस्तेमाल करें।",
    invalidEmail: "कृपया मान्य ईमेल पता दर्ज करें।",
    invalidPhone: "कृपया मान्य फोन नंबर दर्ज करें।",
    shortPassword: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    passwordMismatch: "पासवर्ड मेल नहीं खाते।",
    showPassword: "दिखाएं",
    hidePassword: "छुपाएं",
    fullName: "पूरा नाम",
    email: "ईमेल",
    phone: "फोन नंबर",
    switchToPhone: "फोन से करें",
    switchToEmail: "ईमेल से करें",
    loginWith: "लॉगिन विकल्प",
    emailOption: "ईमेल",
    phoneOption: "फोन नंबर",
    optional: "वैकल्पिक",
    password: "पासवर्ड",
    accountType: "खाता प्रकार",
    elderlyUser: "वरिष्ठ उपयोगकर्ता",
    caregiverUser: "देखभालकर्ता",
    authTabsLabel: "प्रमाणीकरण विकल्प",
    pleaseWait: "कृपया प्रतीक्षा करें...",
    loginSuccess: "सफलतापूर्वक साइन इन हुआ।",
    registerSuccess: "खाता सफलतापूर्वक बन गया।",
    signOut: "साइन आउट",
    welcome: "स्वागत है",
    caregiverProfile: "देखभालकर्ता प्रोफ़ाइल",
    relationshipToElder: "वरिष्ठ से संबंध",
    elderName: "वरिष्ठ का नाम",
    elderAge: "वरिष्ठ की आयु",
    notes: "देखभाल नोट्स",
    saveProfile: "प्रोफ़ाइल सहेजें",
    profileSaved: "देखभालकर्ता प्रोफ़ाइल सहेजी गई।",
    authRequired: "स्वास्थ्य और आपातकालीन सुविधाओं के लिए कृपया साइन इन करें।",
    mainMenu: "मुख्य मेनू",
    home: "होम",
    medicinesPageTitle: "दवा समय-सारणी",
    medicineFilterMenu: "दवा फ़िल्टर मेनू",
    pendingOnly: "नहीं ली",
    takenOnly: "ले ली",
    allMedicines: "सभी दवाएं",
    appointments: "नियुक्तियां",
    appointmentsPageTitle: "डॉक्टर की नियुक्तियां",
    addAppointment: "नियुक्ति जोड़ें",
    exercises: "व्यायाम",
    exercisesPageTitle: "निर्देशित कसरत",
    medicinesToday: "आज की दवा",
    nextAppointment: "अगली नियुक्ति",
    workoutStreak: "व्यायाम स्ट्रीक",
    keepItUp: "बढ़ते रहो!",
    noAppointments: "कोई नियुक्ति निर्धारित नहीं है",
    todayGlance: "आज एक नजर में",
    todaysMedicines: "आज की दवाएं",
    upcomingAppointments: "आने वाली नियुक्तियां",
    noUpcomingAppointments: "कोई आने वाली नियुक्ति नहीं"
  }
};

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("hui_token") || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [authForm, setAuthForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    loginMethod: "email",
    role: "elderly"
  });
  const [caregiverProfile, setCaregiverProfile] = useState({
    relationshipToElder: "",
    elderName: "",
    elderAge: "",
    notes: ""
  });
  const [healthCards, setHealthCards] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [settings, setSettings] = useState({
    fontScale: 1,
    contrastMode: "normal",
    language: "en"
  });

  const labels = useMemo(() => dictionary[settings.language], [settings.language]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  const setSession = (nextToken, user) => {
    setToken(nextToken);
    setCurrentUser(user);
    localStorage.setItem("hui_token", nextToken);
  };

  const clearSession = () => {
    setToken("");
    setCurrentUser(null);
    setHealthCards([]);
    setReminders([]);
    setContacts([]);
    setAppointments([]);
    setCaregiverProfile({ relationshipToElder: "", elderName: "", elderAge: "", notes: "" });
    localStorage.removeItem("hui_token");
  };

  const loadProtectedData = async (activeToken) => {
    setLoading(true);
    try {
      const authHeaders = { Authorization: `Bearer ${activeToken}` };
      const [meResponse, healthResponse, reminderResponse, contactResponse] = await Promise.all([
        fetch(`${API_URL}/auth/me`, { headers: authHeaders }),
        fetch(`${API_URL}/health-info`, { headers: authHeaders }),
        fetch(`${API_URL}/reminders`, { headers: authHeaders }),
        fetch(`${API_URL}/contacts`, { headers: authHeaders })
      ]);

      if (!meResponse.ok) {
        throw new Error("Session expired. Please sign in again.");
      }

      const meData = await meResponse.json();
      const [healthData, reminderData, contactData] = await Promise.all([
        healthResponse.json(),
        reminderResponse.json(),
        contactResponse.json()
      ]);

      // Fetch appointments with user ID
      const appointmentResponse = await fetch(`${API_URL}/appointments/${meData.user._id}`, {
        headers: authHeaders
      });
      const appointmentData = appointmentResponse.ok ? await appointmentResponse.json() : [];

      setCurrentUser(meData.user);
      setHealthCards(healthData);
      setReminders(reminderData);
      setContacts(contactData);
      setAppointments(appointmentData);

      if (meData.user.role === "caregiver") {
        const profileResponse = await fetch(`${API_URL}/caregiver/profile`, {
          headers: authHeaders
        });

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          setCaregiverProfile({
            relationshipToElder: profile.relationshipToElder || "",
            elderName: profile.elderName || "",
            elderAge: profile.elderAge || "",
            notes: profile.notes || ""
          });
        }
      }
    } catch (error) {
      clearSession();
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/auth", { replace: true });
      return;
    }

    loadProtectedData(token);
    navigate("/home", { replace: true });
  }, [token]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthSubmitting(true);
    setStatusMessage("");

    const endpoint = authMode === "login" ? "login" : "register";
    const payload =
      authMode === "login"
        ? {
            email: authForm.loginMethod === "email" ? authForm.email : "",
            phone: authForm.loginMethod === "phone" ? authForm.phone : "",
            password: authForm.password
          }
        : {
            fullName: authForm.fullName,
            email: authForm.email,
            phone: authForm.phone,
            password: authForm.password,
            role: authForm.role
          };

    try {
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      setSession(data.token, data.user);
      setAuthForm({ fullName: "", email: "", phone: "", password: "", loginMethod: "email", role: "elderly" });
      navigate("/home", { replace: true });
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleListen = (text) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleReminderToggle = async (id, nextState) => {
    try {
      const response = await fetch(`${API_URL}/reminders/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ taken: nextState })
      });

      const updated = await response.json();
      setReminders((current) =>
        current.map((entry) => (entry._id === id ? { ...entry, taken: updated.taken } : entry))
      );
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleAddReminder = async (reminderData) => {
    const response = await fetch(`${API_URL}/reminders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(reminderData)
    });

    const created = await response.json();
    if (!response.ok) {
      throw new Error(created.message || "Could not add medicine.");
    }

    setReminders((current) => [...current, created]);
    return created;
  };

  const handleDeleteReminder = async (id) => {
    try {
      const response = await fetch(`${API_URL}/reminders/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Could not delete medicine.");
      }

      setReminders((current) => current.filter((entry) => entry._id !== id));
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleConfirmCall = async () => {
    if (!selectedContact) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/contacts/call`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ contactId: selectedContact._id })
      });

      if (!response.ok) {
        throw new Error("Could not place emergency call.");
      }

      setStatusMessage(labels.callSuccess);
      setSelectedContact(null);
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleAddEmergencyContact = async (contactData) => {
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(contactData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not add emergency contact.");
      }

      setContacts((current) =>
        [...current, data].sort((a, b) => (a.priority || 1) - (b.priority || 1))
      );
      setStatusMessage(labels.contactAdded || "Emergency contact added successfully.");
      return true;
    } catch (error) {
      setStatusMessage(error.message);
      return false;
    }
  };

  const handleCaregiverProfileSave = async (event) => {
    event.preventDefault();
    setProfileSaving(true);

    try {
      const response = await fetch(`${API_URL}/caregiver/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(caregiverProfile)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not save profile.");
      }

      setCaregiverProfile({
        relationshipToElder: data.relationshipToElder || "",
        elderName: data.elderName || "",
        elderAge: data.elderAge || "",
        notes: data.notes || ""
      });
      setStatusMessage(labels.profileSaved);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddAppointment = async (appointmentData) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${currentUser._id}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not add appointment.");
      }

      setAppointments([...appointments, data]);
      setStatusMessage("Appointment added successfully!");
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error("Could not delete appointment.");
      }

      setAppointments((current) => current.filter((apt) => apt._id !== appointmentId));
      setStatusMessage("Appointment deleted successfully!");
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}/complete`, {
        method: "PATCH",
        headers: getAuthHeaders()
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Could not mark appointment as complete.");
      }

      setAppointments((current) =>
        current.map((apt) => (apt._id === appointmentId ? data : apt))
      );
      setStatusMessage("Appointment marked as completed!");
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleEmergencyShortcut = () => {
    navigate("/home", {
      state: { scrollToEmergencyContacts: true }
    });
  };

  return (
    <div
      className={`app-shell ${settings.contrastMode === "high" ? "high-contrast" : ""}`}
      style={{ fontSize: `${settings.fontScale}rem` }}
    >
      <div className="ambient-shape ambient-one" />
      <div className="ambient-shape ambient-two" />

      <header className="hero-header">
        {currentUser && (
          <nav className="top-nav">
            <MainMenu labels={labels} />
          </nav>
        )}
        
        <div className="header-content panel">
          <div className="header-top">
            <div className="header-left">
              <div className="logo-section">
                <Logo />
              </div>
              <div className="header-text">
                <h1>{labels.appTitle}</h1>
                <p>{labels.appSubtitle}</p>
              </div>
            </div>
            <div className="header-right">
              <AccessibilityPanel
                labels={labels}
                settings={settings}
                onSettingsChange={setSettings}
              />
              {currentUser && (
                <button className="header-emergency-btn" onClick={handleEmergencyShortcut}>
                  <span className="header-emergency-btn-icon" aria-hidden="true">☎</span>
                  {labels.emergencyShortcut}
                </button>
              )}
              {currentUser && (
                <button className="header-signout-btn" onClick={clearSession}>
                  {labels.signOut}
                </button>
              )}
            </div>
          </div>
          {currentUser && (
            <div className="header-welcome">
              {labels.welcome}, {currentUser.fullName}!
            </div>
          )}
        </div>
      </header>

      {!token ? (
        <Routes>
          <Route
            path="*"
            element={
              <AuthPage
                labels={labels}
                authMode={authMode}
                authForm={authForm}
                authSubmitting={authSubmitting}
                statusMessage={statusMessage}
                onModeChange={setAuthMode}
                onFieldChange={(field, value) =>
                  setAuthForm((current) => ({ ...current, [field]: value }))
                }
                onSubmit={handleAuthSubmit}
              />
            }
          />
        </Routes>
      ) : (
        <>
          <div className="page-content">
            {loading ? (
              <p className="panel notice">{labels.loading}</p>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/auth" element={<Navigate to="/home" replace />} />
                <Route
                  path="/home"
                  element={
                    <HomePage
                      labels={labels}
                      currentUser={currentUser}
                      healthCards={healthCards}
                      reminders={reminders}
                      appointments={appointments}
                      contacts={contacts}
                      onListen={handleListen}
                      onCall={setSelectedContact}
                      onAddContact={handleAddEmergencyContact}
                      onToggleReminder={handleReminderToggle}
                    />
                  }
                />
                <Route
                  path="/medicines"
                  element={
                    <MedicinesPage
                      labels={labels}
                      reminders={reminders}
                      onToggleReminder={handleReminderToggle}
                      onAddReminder={handleAddReminder}
                      onDeleteReminder={handleDeleteReminder}
                    />
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <AppointmentsPage
                      labels={labels}
                      currentUser={currentUser}
                      appointments={appointments}
                      onAddAppointment={handleAddAppointment}
                      onDeleteAppointment={handleDeleteAppointment}
                      onCompleteAppointment={handleCompleteAppointment}
                    />
                  }
                />
                <Route
                  path="/exercises"
                  element={
                    <ExercisesPage
                      labels={labels}
                      currentUser={currentUser}
                      onListen={handleListen}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            )}
          </div>
        </>
      )}

      {token && statusMessage && <p className="panel notice">{statusMessage}</p>}

      <ConfirmDialog
        labels={labels}
        contact={selectedContact}
        onCancel={() => setSelectedContact(null)}
        onConfirm={handleConfirmCall}
      />
    </div>
  );
}

/*import LabTestsPage from "./pages/LabTestsPage";

// Add state
const [testBookings, setTestBookings] = useState([]);

// Add handlers
const handleBookingAdded = (booking) => setTestBookings(prev => [booking, ...prev]);
const handleCancelBooking = async (id) => {
  await fetch(`${API_URL}/test-bookings/${id}`, { method:"DELETE", headers: getAuthHeaders() });
  setTestBookings(prev => prev.filter(b => b._id !== id));
};

// Add route
<Route path="/tests" element={
  <LabTestsPage
    currentUser={currentUser}
    bookings={testBookings}
    onBookingAdded={handleBookingAdded}
    onCancelBooking={handleCancelBooking}
  />
}/>*/

export default App;
