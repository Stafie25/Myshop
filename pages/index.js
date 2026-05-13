import { createClient } from '@supabase/supabase-js';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import ProductGrid from '../components/ProductGrid';
import ReviewsSection from '../components/ReviewsSection';

export default function HomePage({ products }) {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <ProductGrid products={products} />
      <ReviewsSection />
    </main>
  );
}

export async function getServerSideProps() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Eroare Supabase:', error.message);
  }

  const mappedProducts = (products ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category ?? null,
    image_url: p.image_url ?? null,
    rating: p.rating ?? 5,
    badge: p.badge ?? null,
    sale_percent: p.sale_percent ?? null,
  }));

  return {
    props: { products: mappedProducts },
  };
}
