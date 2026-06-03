import { NextResponse } from 'next/server';
import { getSupabaseCoupons } from '@/lib/supabase/coupons';

export async function GET() {
  const coupons = await getSupabaseCoupons();
  return NextResponse.json({ coupons: coupons.filter((coupon) => coupon.active) });
}
