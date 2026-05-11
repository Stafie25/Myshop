import { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('stock_available', true);
    setProducts(data || []);
    setLoading(false);
  }

  function addToCart(product) {
    const existing = cart.find((i) => i.product_id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((i) =>
        i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newCart = [...cart, {
        product_id: product.id,
        cj_variant_id: product.variants?.[0]?.vid || '',
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity: 1,
      }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Head>
        <title>Myshop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 2rem',
        background: 'rgba(10,10,10,0.9)',
        borderBottom: '1px solid #222',
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>Myshop</div>
        <button
          onClick={() => window.location.href = '/cart'}
          style={{
            background: '#e8ff5a', color: '#000', border: 'none',
            padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
          }}>
          Cos ({cartCount})
        </button>
      </nav>

      <section style={{
        padding: '5rem 2rem', textAlign: 'center',
        background: 'radial-gradient(ellipse at top, #1a1a00 0%, #0a0a0a 60%)'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f0f0f0', lineHeight: 1 }}>
          Produse <span style={{ color: '#e8ff5a' }}>premium</span><br />la tine acasa
        </h1>
        <p style={{ color: '#666', marginTop: '1rem', fontSize: '1.1rem' }}>
          Livrare directa. Fara stoc. Fara complicatii.
        </p>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#666' }}>
          Se incarca produsele...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#666' }}>
          <p>Nu exista produse inca.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Adauga produse in Supabase, tabela products
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem', padding: '3rem 2rem',
          maxWidth: '1200px', margin: '0 auto'
        }}>
          {products.map((product) => (
            <div key={product.id} style={{
              background: '#141414', border: '1px solid #222', overflow: 'hidden'
            }}>
              <img
                src={product.image_url || 'https://via.placeholder.com/300'}
                alt={product.name}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1.2rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#f0f0f0' }}>
                  {product.name}
                </div>
                <div style={{ color: '#e8ff5a', fontWeight: 500, fontSize: '1.1rem' }}>
                  {product.price} RON
                </div>
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    width: '100%', marginTop: '1rem',
                    background: 'transparent', color: '#f0f0f0',
                    border: '1px solid #222', padding: '0.7rem',
                    cursor: 'pointer', fontSize: '0.9rem'
                  }}>
                  + Adauga in cos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        body { background: #0a0a0a; color: #f0f0f0; margin: 0; font-family: sans-serif; }
        * { box-sizing: border-box; }
      `}</style>
    </>
  );
}