import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Toast } from '@/components/storefront/toast';
import { WhatsAppButton } from '@/components/storefront/whatsapp-button';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
              <Header />
              <main>{children}</main>
              <Toast />
              <WhatsAppButton />
              <Footer />
    </>
  );
}
