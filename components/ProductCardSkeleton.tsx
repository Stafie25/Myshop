export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="product-info">
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-name" />
        <div className="skeleton skeleton-price" />
      </div>
    </div>
  );
}
