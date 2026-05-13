const reviews = [
  {
    name: "Ana M.",
    city: "Cluj-Napoca",
    initials: "AM",
    color: "#D85A30",
    rating: 5,
    text: "Produs excelent! Livrare super rapidă, totul a ajuns în perfectă stare.",
  },
  {
    name: "Radu P.",
    city: "București",
    initials: "RP",
    color: "#185FA5",
    rating: 5,
    text: "Calitate surprinzătoare pentru prețul ăsta. Recomand cu încredere!",
  },
  {
    name: "Maria I.",
    city: "Iași",
    initials: "MI",
    color: "#3B6D11",
    rating: 4,
    text: "Foarte mulțumit de achiziție. Suportul a răspuns imediat la întrebări.",
  },
];

export default function ReviewsSection() {
  return (
    <section className="reviews-section">
      <div className="section-header">
        <h2 className="section-title">Ce spun clienții</h2>
        <span className="reviews-meta">4.9/5 din 120 recenzii</span>
      </div>

      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div key={i} className="review-card animate-fadeup" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="review-stars">
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </div>
            <p className="review-text">"{r.text}"</p>
            <div className="review-author">
              <div
                className="review-avatar"
                style={{ background: r.color }}
              >
                {r.initials}
              </div>
              <div>
                <p className="review-name">{r.name}</p>
                <p className="review-city">{r.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
