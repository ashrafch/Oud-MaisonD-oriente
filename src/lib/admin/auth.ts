import { redirect } from 'next/navigation';
import { createSupabaseCookieServerClient } from '@/lib/supabase/ssr';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export type AdminRole = 'super_admin' | 'admin';

export type AdminSession = {
  id: string;
  email: string;
  role: AdminRole;
  fullName?: string;
};

export function isAdminAuthEnabled() {
  return !(process.env.NODE_ENV === 'development' && process.env.ADMIN_AUTH_ENABLED === 'false');
}

export function getConfiguredAdminRole(email?: string | null): AdminRole | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  if (parseEmailList(process.env.ADMIN_SUPER_EMAILS).has(normalized)) return 'super_admin';
  if (parseEmailList(process.env.ADMIN_EMAILS).has(normalized)) return 'admin';
  return null;
}

export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  if (!isAdminAuthEnabled()) {
    return {
      id: 'local-dev-admin',
      email: 'local-admin@oude.local',
      role: 'super_admin',
      fullName: 'Local admin'
    };
  }

  const supabase = await createSupabaseCookieServerClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email) return null;
  return ensureAdminProfile(user.id, user.email, user.user_metadata?.full_name);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getCurrentAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function requireSuperAdminSession(): Promise<AdminSession> {
  const session = await requireAdminSession();
  if (session.role !== 'super_admin') redirect('/admin');
  return session;
}

export async function requireAdminApiSession(): Promise<AdminSession | null> {
  const requestHeaders = await headers();
  if (requestHeaders.get('sec-fetch-site') === 'cross-site') return null;
  return getCurrentAdminSession();
}

export async function ensureAdminProfile(userId: string, email: string, fullName?: string): Promise<AdminSession | null> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return null;

  const configuredRole = getConfiguredAdminRole(email);
  const { data, error } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  const existing = data as { role: string; full_name: string | null } | null;

  const role = configuredRole;
  if (!role) return null;

  if (!existing || existing.role !== role) {
    const { error: saveError } = await supabase.from('profiles').upsert({
      id: userId,
      role,
      full_name: existing?.full_name ?? fullName ?? email,
      updated_at: new Date().toISOString()
    });
    if (saveError) return null;
  }

  return {
    id: userId,
    email,
    role,
    fullName: existing?.full_name ?? fullName ?? email
  };
}

function parseEmailList(value?: string) {
  return new Set((value ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean));
}
