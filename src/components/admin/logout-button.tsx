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
    <button onClick={() => void logout()} disabled={isLoggingOut} className={`flex w-full items-center justify-center gap-2 rounded bg-ink px-3 py-3 text-xs font-semibold text-white transition hover:bg-bark disabled:cursor-wait disabled:opacity-70 ${className}`}>
      <LogOut size={15} />
      {isLoggingOut ? 'Uscita...' : 'Esci dal portale'}
    </button>
  );
}
