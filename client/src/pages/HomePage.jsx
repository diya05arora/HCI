import EmergencyContactsSection from "../components/EmergencyContactsSection";
import HealthInfoSection from "../components/HealthInfoSection";

function HomePage({
  labels,
  currentUser,
  healthCards,
  contacts,
  onListen,
  onCall
}) {
  return (
    <div className="home-page-main">
      <div className="home-welcome">
        <h2>{labels.welcome}, {currentUser?.fullName}!</h2>
      </div>

      <section className="home-section">
        <h3>{labels.healthInfo}</h3>
        <HealthInfoSection labels={labels} healthCards={healthCards} onListen={onListen} />
      </section>

      <section className="home-section">
        <h3>{labels.emergencyContacts}</h3>
        <EmergencyContactsSection labels={labels} contacts={contacts} onCall={onCall} />
      </section>
    </div>
  );
}

export default HomePage;
