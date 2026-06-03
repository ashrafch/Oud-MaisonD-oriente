import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { getSupabaseOrders, updateSupabaseOrderStatus } from '@/lib/supabase/orders';
import type { Order } from '@/lib/cart/store';

const statuses: Order['status'][] = ['new', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'];

export async function GET() {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const orders = await getSupabaseOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return unauthorized();
    const { orderId, status } = await request.json() as { orderId?: string; status?: Order['status'] };
    if (!orderId || !status || !statuses.includes(status)) {
      return NextResponse.json({ error: 'Stato ordine non valido' }, { status: 400 });
    }
    await updateSupabaseOrderStatus(orderId, status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Errore ordini Supabase';
}
