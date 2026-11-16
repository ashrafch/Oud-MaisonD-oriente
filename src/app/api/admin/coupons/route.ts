import { readJsonBody } from '@/lib/security/json-body';
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
      .safeParse(await readJsonBody(request).catch(() => null));
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
    const parsed = z.object({ code: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/) }).safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    const { code } = parsed.data;
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
