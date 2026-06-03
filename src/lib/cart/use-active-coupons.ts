'use client';

import { useEffect, useState } from 'react';
import type { Coupon } from '@/lib/supabase/coupons';

const fallbackCoupons: Coupon[] = [
  { code: 'OUDE10', type: 'percent', value: 10, active: true },
  { code: 'WELCOME15', type: 'percent', value: 15, active: true }
];

export function useActiveCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(fallbackCoupons);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await fetch('/api/coupons', { cache: 'no-store' });
        if (!response.ok) throw new Error('Coupon non disponibili');
        const payload = await response.json() as { coupons: Coupon[] };
        setCoupons(payload.coupons);
      } catch {
        setCoupons(fallbackCoupons);
      }
    };
    void loadCoupons();
  }, []);

  return coupons;
}
