"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

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

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  loading = false,
  onAddToCart,
}: ProductGridProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="products-section" ref={ref}>
      <div className="section-header">
        <h2 className="section-title">Produse populare</h2>
        <a href="/products" className="section-link">
          Vezi toate →
        </a>
      </div>

      <div className={`products-grid ${visible ? "grid-visible" : ""}`}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                animationDelay={visible ? i * 80 : 999}
              />
            ))}
      </div>
    </section>
  );
}
