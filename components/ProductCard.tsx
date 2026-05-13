"use client";

import { useState } from "react";

interface Product {
  id: string | number;
  name: string;
  price: number;
  category?: string;
  image_url?: string;
  rating?: number;
  badge?: "nou" | "sale" | null;
  sale_percent?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  animationDelay?: number;
}

export default function ProductCard({
  product,
  onAddToCart,
  animationDelay = 0,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stars = Math.round(product.rating ?? 5);

  return (
    <div
      className="product-card animate-fadeup"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="product-img-wrap">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img"
          />
        ) : (
          <div className="product-img-placeholder">📦</div>
        )}

        {product.badge === "nou" && (
          <span className="badge badge-nou">Nou</span>
        )}
        {product.badge === "sale" && product.sale_percent && (
          <span className="badge badge-sale">-{product.sale_percent}%</span>
        )}

        <div className="product-overlay">
          <button
            className={`overlay-btn ${added ? "overlay-btn--added" : ""}`}
            onClick={handleAdd}
          >
            {added ? "✓ Adăugat!" : "Adaugă în coș"}
          </button>
        </div>
      </div>

      <div className="product-info">
        {product.category && (
          <p className="product-tag">{product.category}</p>
        )}
        <p className="product-name">{product.name}</p>
        <div className="product-footer">
          <span className="product-price">{product.price} RON</span>
          <span className="product-stars">
            {"★".repeat(stars)}
            {"☆".repeat(5 - stars)}
          </span>
        </div>
      </div>
    </div>
  );
}
