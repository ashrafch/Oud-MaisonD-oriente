import { ProductionSettings } from '@/components/admin/production-settings';
import { requireSuperAdminSession } from '@/lib/admin/auth';

export default async function AdminPage() {
  await requireSuperAdminSession();
  return <ProductionSettings />;
}
