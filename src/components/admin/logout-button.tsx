'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <button onClick={() => void logout()} className="flex items-center gap-2 rounded border border-ink/10 px-3 py-2 text-xs font-semibold hover:bg-mist">
      <LogOut size={15} />
      Esci
    </button>
  );
}
