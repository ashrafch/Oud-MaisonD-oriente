import { redirect } from 'next/navigation';
import { createSupabaseCookieServerClient } from '@/lib/supabase/ssr';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export type AdminRole = 'super_admin' | 'admin';

export type AdminSession = {
  id: string;
  email: string;
  role: AdminRole;
  fullName?: string;
};

const adminRoles = new Set(['super_admin', 'admin']);

export function isAdminAuthEnabled() {
  return process.env.ADMIN_AUTH_ENABLED === 'true';
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

export async function requireAdminApiSession(): Promise<AdminSession | null> {
  return getCurrentAdminSession();
}

export async function ensureAdminProfile(userId: string, email: string, fullName?: string): Promise<AdminSession | null> {
  const supabase = createSupabaseServiceClient() as any;
  if (!supabase) return null;

  const configuredRole = getConfiguredAdminRole(email);
  const { data: existing } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', userId)
    .maybeSingle();

  const existingRole = adminRoles.has(existing?.role) ? existing.role as AdminRole : null;
  const role = configuredRole ?? existingRole;
  if (!role) return null;

  if (configuredRole || !existing) {
    await supabase.from('profiles').upsert({
      id: userId,
      role,
      full_name: existing?.full_name ?? fullName ?? email,
      updated_at: new Date().toISOString()
    });
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
