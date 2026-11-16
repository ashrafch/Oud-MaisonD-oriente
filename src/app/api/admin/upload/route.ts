import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth';
import { uploadProductImage } from '@/lib/supabase/admin-products';

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApiSession();
    if (!admin) return NextResponse.json({ error: 'Accesso admin richiesto' }, { status: 401 });
    if (Number(request.headers.get('content-length')) > 6 * 1024 * 1024) {
      return NextResponse.json({ error: 'File troppo grande' }, { status: 413 });
    }
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File immagine mancante' }, { status: 400 });
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ error: 'Usa JPEG, PNG o WebP fino a 5 MB' }, { status: 400 });
    }
    const url = await uploadProductImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Errore upload Supabase';
}
