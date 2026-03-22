function HealthInfoSection({ labels, healthCards, onListen }) {
  return (
    <section
      id="health-info"
      className="panel"
      aria-labelledby="health-info-title"
      tabIndex="-1"
    >
      <h2 id="health-info-title">{labels.healthInfo}</h2>
      <div className="card-grid">
        {healthCards.map((card) => (
          <article key={card._id} className="info-card">
            <h3>{card.title}</h3>
            <p className="summary-text">{card.summary}</p>
            <p>{card.details}</p>
            <button
              className="audio-btn"
              onClick={() => onListen(card.audioText)}
              aria-label={`${labels.listenToCard}: ${card.title}`}
            >
              {labels.listen} 🔊
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HealthInfoSection;
