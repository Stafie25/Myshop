# Myshop — Ghid de integrare design îmbunătățit

## Fișiere incluse

```
components/
  Navbar.tsx              ← Navigație cu hamburger mobile
  HeroSection.tsx         ← Hero cu titlu, CTA, statistici
  TrustBar.tsx            ← Bara cu badge-uri de încredere
  ProductCard.tsx         ← Card produs cu hover + animație
  ProductCardSkeleton.tsx ← Loading skeleton pentru produse
  ProductGrid.tsx         ← Grid cu Intersection Observer
  ReviewsSection.tsx      ← Secțiune recenzii clienți

app/
  page.tsx                ← Homepage complet (înlocuiește cel existent)
  layout.tsx              ← Layout cu Navbar + import CSS

styles/
  myshop.css              ← Toate stilurile (copiat în /styles/)
```

---

## Pași de instalare

### 1. Copiezi fișierele în proiect

Deschizi proiectul tău la:
```
C:\Users\Cosmin\Downloads\dropship
```

Copiezi astfel:

| Fișier din acest ZIP           | Destinație în proiect                    |
|-------------------------------|------------------------------------------|
| `components/Navbar.tsx`       | `components/Navbar.tsx`                  |
| `components/HeroSection.tsx`  | `components/HeroSection.tsx`             |
| `components/TrustBar.tsx`     | `components/TrustBar.tsx`                |
| `components/ProductCard.tsx`  | `components/ProductCard.tsx`             |
| `components/ProductCardSkeleton.tsx` | `components/ProductCardSkeleton.tsx` |
| `components/ProductGrid.tsx`  | `components/ProductGrid.tsx`             |
| `components/ReviewsSection.tsx` | `components/ReviewsSection.tsx`        |
| `styles/myshop.css`           | `styles/myshop.css`                      |
| `app/page.tsx`                | `app/page.tsx` (înlocuiești complet)     |
| `app/layout.tsx`              | `app/layout.tsx` (înlocuiești complet)   |

---

### 2. Verifici că ai folderul `styles/`

Dacă nu există `styles/` în rădăcina proiectului, îl creezi manual și pui `myshop.css` în el.

---

### 3. Verifici coloanele din Supabase

În tabelul `products` din Supabase, asigură-te că ai coloanele:

| Coloană      | Tip      | Descriere                          |
|-------------|----------|------------------------------------|
| `id`        | uuid/int | ID produs                          |
| `name`      | text     | Numele produsului                  |
| `price`     | numeric  | Prețul în RON                      |
| `category`  | text     | Ex: "Electronice", "Accesorii"     |
| `image_url` | text     | URL imagine (poate fi null)        |
| `rating`    | numeric  | Rating 1-5 (optional, default 5)   |
| `badge`     | text     | "nou" sau "sale" (optional)        |
| `sale_percent` | int   | Ex: 20 pentru -20% (optional)      |

Dacă nu ai toate coloanele, rulezi în Supabase SQL Editor:
```sql
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 5,
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS sale_percent integer;
```

---

### 4. Testezi local

```bash
cd C:\Users\Cosmin\Downloads\dropship
npm run dev
```

Deschizi http://localhost:3000 și verifici că arată bine.

---

### 5. Deploy pe Vercel

```bash
git add .
git commit -m "feat: redesign homepage cu hero, trust bar, animatii, reviews"
git push
```

Vercel deployează automat din GitHub. Gata!

---

## Ce face fiecare îmbunătățire

1. **Hero Section** — Prima impresie: titlu mare Playfair Display, background întunecat cu accent portocaliu, CTA-uri, statistici animate
2. **Carduri produs** — Hover cu overlay "Adaugă în coș", zoom pe imagine, badge Nou/Sale, rating cu stele, feedback "✓ Adăugat!"
3. **Mobile-first** — Hamburger menu pe mobil, grid 2 coloane pe telefon, trust bar 2×2 pe ecrane mici
4. **Animații fade-up** — Fiecare element apare progresiv (fadeUp), skeleton loading cât se încarcă produsele, Intersection Observer pentru grid
5. **Trust signals** — Bara cu Livrare rapidă / Plată securizată / Retur gratuit / Suport 24/7 + secțiune recenzii cu avatare colorate

---

## Întrebări frecvente

**Imaginile produselor nu apar?**
Asigură-te că `image_url` în Supabase conține URL-uri publice (de la CJ Dropshipping sau Supabase Storage).

**Fontul nu se încarcă?**
Verifici că ai conexiune la internet (fontul vine de la Google Fonts). Alternativ, instalezi local:
```bash
npm install @fontsource/playfair-display @fontsource/dm-sans
```
Și înlocuiești `@import url(...)` din `myshop.css` cu:
```js
import '@fontsource/playfair-display/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
```

**Eroare la `createClient`?**
Verifici că ai `utils/supabase/server.ts` în proiect (era deja acolo din setup-ul inițial Supabase).
