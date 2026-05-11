// pages/cart.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', zip: '', country: 'RO',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function updateQty(productId, delta) {
    const newCart = cart
      .map((i) => i.product_id === productId ? { ...i, quantity: i.quantity + delta } : i)
      .filter((i) => i.quantity > 0);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  function removeItem(productId) {
    const newCart = cart.filter((i) => i.product_id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'RON';

  async function handleCheckout() {
    if (!form.name || !form.email || !form.street || !form.city || !form.zip) {
      setError('Te rugam sa completezi toate campurile obligatorii.');
      return;
    }
    if (!cart.length) {
      setError('Cosul tau este gol.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: { name: form.name, email: form.email, phone: form.phone },
          shipping_address: {
            street: form.street,
            city: form.city,
            zip: form.zip,
            country: form.country,
          },
        }),
      });

      const data = await res.json();
      if (data.url) {
        localStorage.removeItem('cart'); // Goleste cosul
        window.location.href = data.url; // Redirect la Stripe
      } else {
        setError(data.error || 'Eroare la procesarea comenzii.');
      }
    } catch (err) {
      setError('Eroare de retea. Incearca din nou.');
    } finally {
      setLoading(false);
    }
  }

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'MyStore';

  return (
    <>
      <Head>
        <title>Cos | {storeName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0a; --surface: #141414; --border: #222;
          --accent: #e8ff5a; --text: #f0f0f0; --muted: #666;
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

        nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.2rem 2rem;
          border-bottom: 1px solid var(--border);
        }
        .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; cursor: pointer; }
        .back-btn { background: none; border: 1px solid var(--border); color: var(--muted); padding: 0.5rem 1rem; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .back-btn:hover { border-color: var(--accent); color: var(--accent); }

        .container { max-width: 900px; margin: 3rem auto; padding: 0 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
        @media (max-width: 700px) { .container { grid-template-columns: 1fr; } }

        h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; margin-bottom: 1.5rem; }

        .cart-item { display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border); align-items: center; }
        .cart-img { width: 60px; height: 60px; object-fit: cover; background: var(--surface); }
        .cart-item-info { flex: 1; }
        .cart-item-name { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; }
        .cart-item-price { color: var(--accent); font-size: 0.9rem; margin-top: 0.2rem; }
        .qty-controls { display: flex; align-items: center; gap: 0.5rem; }
        .qty-btn { background: var(--surface); border: 1px solid var(--border); color: var(--text); width: 28px; height: 28px; cursor: pointer; font-size: 1rem; }
        .qty-btn:hover { border-color: var(--accent); }
        .remove-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 0.8rem; margin-left: 0.5rem; }
        .remove-btn:hover { color: #ff4444; }

        .total { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.2rem; }
        .total span { color: var(--accent); }

        .form-group { margin-bottom: 1rem; }
        label { display: block; font-size: 0.8rem; color: var(--muted); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; }
        input, select {
          width: 100%; background: var(--surface); border: 1px solid var(--border);
          color: var(--text); padding: 0.7rem 1rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; outline: none; transition: border-color 0.2s;
        }
        input:focus, select:focus { border-color: var(--accent); }
        select { appearance: none; }

        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .checkout-btn {
          width: 100%; margin-top: 1.5rem;
          background: var(--accent); color: #000;
          border: none; padding: 1rem;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1rem; cursor: pointer;
          transition: opacity 0.2s;
        }
        .checkout-btn:hover:not(:disabled) { opacity: 0.85; }
        .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .error { background: #2a0000; border: 1px solid #ff4444; color: #ff8888; padding: 0.8rem 1rem; margin-top: 1rem; font-size: 0.9rem; }
        .empty { text-align: center; padding: 3rem; color: var(--muted); }
      `}</style>

      <nav>
        <div className="logo" onClick={() => window.location.href = '/'}>{storeName}</div>
        <button className="back-btn" onClick={() => window.location.href = '/'}>← Continua cumparaturile</button>
      </nav>

      <div className="container">
        {/* COLOANA STANGA: Produse in cos */}
        <div>
          <h2>Cosul tau</h2>
          {cart.length === 0 ? (
            <div className="empty">Cosul tau este gol.</div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <img src={item.image || '/placeholder.png'} className="cart-img" alt={item.name} />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{item.price} {currency}</div>
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.product_id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.product_id, 1)}>+</button>
                    <button className="remove-btn" onClick={() => removeItem(item.product_id)}>✕</button>
                  </div>
                </div>
              ))}
              <div className="total">
                <span>Total:</span>
                <span>{total.toFixed(2)} {currency}</span>
              </div>
            </>
          )}
        </div>

        {/* COLOANA DREAPTA: Formular checkout */}
        <div>
          <h2>Detalii livrare</h2>

          <div className="form-group">
            <label>Nume complet *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ion Popescu" />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ion@gmail.com" />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="07XX XXX XXX" />
            </div>
          </div>

          <div className="form-group">
            <label>Adresa *</label>
            <input value={form.street} onChange={e => setForm({...form, street: e.target.value})} placeholder="Str. Exemplu nr. 10, Ap. 5" />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Oras *</label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Bucuresti" />
            </div>
            <div className="form-group">
              <label>Cod postal *</label>
              <input value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} placeholder="010101" />
            </div>
          </div>

          <div className="form-group">
            <label>Tara</label>
            <select value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
              <option value="RO">Romania</option>
              <option value="MD">Moldova</option>
              <option value="DE">Germania</option>
              <option value="GB">Marea Britanie</option>
              <option value="US">SUA</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
          >
            {loading ? 'Se proceseaza...' : `Plateste ${total.toFixed(2)} ${currency} →`}
          </button>
        </div>
      </div>
    </>
  );
}
