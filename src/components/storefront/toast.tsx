'use client';

import { useEffect } from 'react';
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';

export function Toast() {
  const toast = useCartStore((state) => state.toast);
  const dismissToast = useCartStore((state) => state.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3200);
    return () => window.clearTimeout(timer);
  }, [dismissToast, toast]);

  if (!toast) return null;
  const Icon = toast.tone === 'warning' ? AlertTriangle : toast.tone === 'info' ? Info : CheckCircle2;

  return (
    <div className="fixed right-4 top-24 z-50 w-[calc(100%-32px)] max-w-sm rounded border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex gap-3">
        <Icon className="mt-0.5 shrink-0 text-oud" size={20} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{toast.title}</p>
          {toast.description ? <p className="mt-1 text-sm text-ink/60">{toast.description}</p> : null}
        </div>
        <button aria-label="Chiudi notifica" className="rounded p-1 hover:bg-mist" onClick={dismissToast}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
