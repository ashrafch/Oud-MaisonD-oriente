'use client';

import { useEffect, useState } from 'react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem('oude-cookie-consent') !== 'accepted');
  }, []);

  const accept = () => {
    window.localStorage.setItem('oude-cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded border border-ink/10 bg-white p-4 shadow-soft md:left-auto md:max-w-lg">
      <p className="font-semibold">Privacy e cookie</p>
      <p className="mt-1 text-sm leading-6 text-ink/62">Usiamo cookie tecnici necessari al funzionamento del sito. Analytics, pixel o marketing saranno attivati solo dopo configurazione consenso e relativa informativa.</p>
      <div className="mt-3 flex gap-2">
        <button className="rounded bg-oud px-4 py-2 text-sm font-semibold text-white" onClick={accept}>Accetta</button>
        <a className="rounded border border-ink/12 px-4 py-2 text-sm font-semibold" href="/privacy">Privacy</a>
      </div>
    </div>
  );
}
