'use client';

import { useEffect, useState } from 'react';
import type { ShippingConfig } from '@/lib/cart/store';

export const DEFAULT_SHIPPING: ShippingConfig = { baseCost: 6.9, freeThreshold: 79 };

let cached: ShippingConfig | null = null;
let pending = false;
const subscribers = new Set<(cfg: ShippingConfig) => void>();

export function useShippingConfig(): ShippingConfig {
  const [config, setConfig] = useState<ShippingConfig>(cached ?? DEFAULT_SHIPPING);

  useEffect(() => {
    if (cached) { setConfig(cached); return; }
    subscribers.add(setConfig);
    if (!pending) {
      pending = true;
      fetch('/api/settings/shipping')
        .then((r) => (r.ok ? (r.json() as Promise<ShippingConfig>) : null))
        .then((data) => {
          if (data && typeof data.baseCost === 'number') {
            cached = data;
            subscribers.forEach((fn) => fn(data));
          }
        })
        .catch(() => {})
        .finally(() => { pending = false; });
    }
    return () => { subscribers.delete(setConfig); };
  }, []);

  return config;
}

export function invalidateShippingCache() {
  cached = null;
}
