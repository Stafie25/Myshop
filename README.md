# 🛒 Magazin Dropshipping - Ghid Setup

## Pași simpli după descărcare

### 1. Instalează dependențele
Deschide cmd/terminal în acest folder și scrie:
```
npm install
```

### 2. Creează fișierul cu chei secrete
- Copiază fișierul `.env.example` și redenumește-l `.env.local`
- Completează toate cheile (Stripe, Supabase, CJ)

### 3. Configurează baza de date
- Mergi pe supabase.com → SQL Editor
- Copiază conținutul din `database.sql` și apasă Run

### 4. Pornește site-ul local
```
npm run dev
```
Deschide browserul la: http://localhost:3000

### 5. Publică online (gratuit)
- Urci pe GitHub
- Conectezi cu Vercel (vercel.com)
- Adaugi variabilele din .env.local în Vercel

---

## Structura fișierelor

```
pages/
  index.js          → pagina principală cu produse
  cart.js           → coșul și checkout
  success.js        → pagina după plată
  api/
    checkout.js     → creează sesiunea Stripe
    webhook.js      → procesează automat comanda după plată
    update-tracking.js → actualizează tracking zilnic

lib/
  supabase.js       → conexiunea la baza de date
  cj.js             → API CJ Dropshipping

database.sql        → rulează în Supabase SQL Editor
.env.example        → template pentru chei secrete
```

## Fluxul automat
1. Client cumpără → Stripe procesează plata
2. Stripe trimite webhook → site-ul tău îl primește
3. Automat se creează comanda la CJ Dropshipping
4. CJ expediază direct la client
5. Tracking se actualizează automat

**Zero intervenție manuală!** 🚀
