'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, LogIn } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? 'Accesso non riuscito');
      router.replace('/admin');
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Accesso non riuscito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Email</span>
        <input className="min-h-11 rounded border border-ink/12 px-3 text-sm" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Password</span>
        <input className="min-h-11 rounded border border-ink/12 px-3 text-sm" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
      </label>
      {error ? <div className="rounded border border-oud/20 bg-oud/8 p-3 text-sm text-oud">{error}</div> : null}
      <button className="flex min-h-11 items-center justify-center gap-2 rounded bg-oud px-4 text-sm font-semibold text-white disabled:opacity-55" disabled={isLoading}>
        {isLoading ? <LockKeyhole size={17} /> : <LogIn size={17} />}
        {isLoading ? 'Accesso...' : 'Entra nel pannello'}
      </button>
    </form>
  );
}
