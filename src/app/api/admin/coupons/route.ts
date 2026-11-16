import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { deleteSupabaseCoupon, getSupabaseCoupons, upsertSupabaseCoupon } from '@/lib/supabase/coupons';

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
    const coupon = z.object({
      code: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
      type: z.enum(['percent', 'fixed']),
      value: z.number().positive().max(100000),
      active: z.boolean()
    }).refine(value => value.type !== 'percent' || value.value <= 100)
      .safeParse(await request.json().catch(() => null));
    if (!coupon.success) {
      return NextResponse.json({ error: 'Coupon non valido' }, { status: 400 });
    }
    await upsertSupabaseCoupon(coupon.data);
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
