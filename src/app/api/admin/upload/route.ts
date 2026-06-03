import { NextResponse } from 'next/server';
import { uploadProductImage } from '@/lib/supabase/admin-products';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File immagine mancante' }, { status: 400 });
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
