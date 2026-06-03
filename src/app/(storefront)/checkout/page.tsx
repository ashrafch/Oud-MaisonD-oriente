import { CheckoutClient } from '@/components/storefront/checkout-client';
import { getSupabaseProducts } from '@/lib/supabase/catalog';

export default async function CheckoutPage() {
  const products = await getSupabaseProducts();
  return <CheckoutClient initialProducts={products} />;
}
