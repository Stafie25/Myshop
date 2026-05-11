// pages/success.js
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { order } = router.query;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'MyStore';

  return (
    <>
      <Head>
        <title>Comanda confirmata | {storeName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0a0a0a; --accent: #e8ff5a; --text: #f0f0f0; --muted: #666; --border: #222; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .box { text-align: center; padding: 3rem; border: 1px solid var(--border); max-width: 500px; }
        .icon { font-size: 4rem; margin-bottom: 1.5rem; }
        h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2rem; margin-bottom: 1rem; }
        p { color: var(--muted); line-height: 1.6; margin-bottom: 0.5rem; }
        .order-id { color: var(--accent); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; margin: 1rem 0; word-break: break-all; }
        .btn { display: inline-block; margin-top: 2rem; background: var(--accent); color: #000; padding: 0.8rem 2rem; font-family: 'Syne', sans-serif; font-weight: 800; cursor: pointer; border: none; font-size: 1rem; }
        .btn:hover { opacity: 0.85; }
      `}</style>
      <div className="box">
        <div className="icon">✅</div>
        <h1>Comanda confirmata!</h1>
        <p>Multumim pentru comanda ta.</p>
        <p>Produsul va fi expediat direct la adresa ta.</p>
        {order && <div className="order-id">ID Comanda: {order}</div>}
        <p style={{marginTop:'1rem'}}>Vei primi un email cu detaliile comenzii.</p>
        <button className="btn" onClick={() => window.location.href = '/'}>Continua cumparaturile</button>
      </div>
    </>
  );
}
