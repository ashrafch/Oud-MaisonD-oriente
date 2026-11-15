import { createSupabaseServiceClient } from '@/lib/supabase/server';

export type Coupon = {
  id?: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
};

export async function getSupabaseCoupons(): Promise<Coupon[]> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('coupons')
    .select('id, code, discount_type, discount_value, is_active')
    .or(`starts_at.is.null,starts_at.lte.${new Date().toISOString()}`)
    .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((coupon: { id: string; code: string; discount_type: 'percent' | 'fixed'; discount_value: number | string; is_active: boolean }) => ({
    id: coupon.id,
    code: coupon.code,
    type: coupon.discount_type,
    value: Number(coupon.discount_value),
    active: coupon.is_active
  }));
}

export async function upsertSupabaseCoupon(coupon: Coupon) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase
    .from('coupons')
    .upsert({
      code: coupon.code.trim().toUpperCase(),
      discount_type: coupon.type,
      discount_value: coupon.value,
      is_active: coupon.active,
      updated_at: new Date().toISOString()
    }, { onConflict: 'code' });
  if (error) throw error;
}

export async function deleteSupabaseCoupon(code: string) {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) throw new Error('Supabase service client non configurato');
  const { error } = await supabase.from('coupons').delete().eq('code', code);
  if (error) throw error;
}
