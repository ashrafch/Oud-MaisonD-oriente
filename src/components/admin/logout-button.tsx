'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button onClick={() => void logout()} disabled={isLoggingOut} className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border border-oud bg-oud px-3 py-2 text-xs font-semibold text-white transition hover:bg-bark disabled:cursor-wait disabled:opacity-70 ${className}`}>
      <LogOut size={15} />
      {isLoggingOut ? 'Uscita...' : 'Esci dal portale'}
    </button>
  );
}
