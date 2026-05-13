export default function TrustBar() {
  const items = [
    { icon: "🚚", label: "Livrare rapidă" },
    { icon: "🔒", label: "Plată securizată" },
    { icon: "🔄", label: "Retur gratuit" },
    { icon: "🎧", label: "Suport 24/7" },
  ];

  return (
    <div className="trust-bar">
      {items.map((item, i) => (
        <div key={i} className="trust-item">
          <span className="trust-icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
