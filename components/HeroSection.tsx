"use client";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-bg" />

      <div className="hero-content">
        <div className="hero-badge">🔥 Livrare gratuită peste 150 RON</div>

        <h1 className="hero-title">
          Produse premium,<br />
          prețuri <em>imbatabile</em>
        </h1>

        <p className="hero-sub">
          Descoperă colecția noastră de produse selectate cu grijă,
          livrate direct la ușa ta.
        </p>

        <div className="hero-cta">
          <a href="/products" className="btn-primary">
            Cumpără acum
          </a>
          <a href="/products?sale=true" className="btn-ghost">
            Vezi ofertele
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">500+</span>
            <span className="hero-stat-label">Clienți mulțumiți</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">4.9★</span>
            <span className="hero-stat-label">Rating mediu</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">24h</span>
            <span className="hero-stat-label">Procesare comenzi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
