import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { deleteSupabaseCoupon, getSupabaseCoupons, upsertSupabaseCoupon, type Coupon } from '@/lib/supabase/coupons';

export async function GET() {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const coupons = await getSupabaseCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const coupon = await request.json() as Coupon;
    if (!coupon.code || coupon.value <= 0) {
      return NextResponse.json({ error: 'Coupon non valido' }, { status: 400 });
    }
    await upsertSupabaseCoupon(coupon);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const { code } = await request.json() as { code?: string };
    if (!code) return NextResponse.json({ error: 'Codice coupon mancante' }, { status: 400 });
    await deleteSupabaseCoupon(code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Errore coupon Supabase';
}
