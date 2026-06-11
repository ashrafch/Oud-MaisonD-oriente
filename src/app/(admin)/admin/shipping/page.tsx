import { requireAdminSession } from '@/lib/admin/auth';
import { ShippingSettings } from '@/components/admin/shipping-settings';

export const dynamic = 'force-dynamic';

export default async function ShippingPage() {
  await requireAdminSession();
  return <ShippingSettings />;
}
