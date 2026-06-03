import { LegalPage } from '@/components/storefront/legal-page';
import { legalPages } from '@/lib/content/legal-pages';

export default function Page() {
  return <LegalPage content={legalPages.contact} />;
}
