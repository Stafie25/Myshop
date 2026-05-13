"use client";

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  return (
    <nav className="navbar">
      <a href="/" className="nav-logo">
        My<span>shop</span>
      </a>

      <div className="nav-links">
        <a href="/products">Produse</a>
        <a href="/products?sale=true">Oferte</a>
        <a href="/contact">Contact</a>
      </div>

      <div className="nav-actions">
        <a href="/search" className="nav-icon" aria-label="Caută">
          🔍
        </a>
        <a href="/cart" className="nav-cart-btn">
          🛍 Coș ({cartCount})
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        aria-label="Meniu"
        onClick={() => {
          const menu = document.querySelector(".nav-links");
          menu?.classList.toggle("nav-links--open");
        }}
      >
        ☰
      </button>
    </nav>
  );
}
