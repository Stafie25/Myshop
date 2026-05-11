-- ============================================
-- RULEAZA ACEST SQL IN SUPABASE > SQL EDITOR
-- ============================================

-- Tabela produse
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cj_product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,       -- pretul tau (cu profit)
  cost_price DECIMAL(10,2) NOT NULL,  -- pretul de la CJ
  image_url TEXT,
  images TEXT[],                       -- array de imagini
  variants JSONB,                      -- culori, marimi, etc
  stock_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela comenzi
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Date client
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Adresa livrare
  shipping_address JSONB NOT NULL,
  -- exemplu: { "street": "Str. X", "city": "Bucuresti", "country": "RO", "zip": "010101" }
  
  -- Produse comandate
  items JSONB NOT NULL,
  -- exemplu: [{ "product_id": "xxx", "quantity": 2, "price": 99.99 }]
  
  -- Preturi
  total_amount DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2),           -- cat te-a costat tie
  profit DECIMAL(10,2),               -- profitul tau
  
  -- Status
  status TEXT DEFAULT 'pending',
  -- pending -> paid -> processing -> shipped -> delivered
  
  -- Plata Stripe
  stripe_payment_intent TEXT UNIQUE,
  stripe_session_id TEXT,
  
  -- CJ Dropshipping
  cj_order_id TEXT,                   -- ID-ul comenzii la CJ
  tracking_number TEXT,
  tracking_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Functie auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index pentru cautari rapide
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe ON orders(stripe_payment_intent);
