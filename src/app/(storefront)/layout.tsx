import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { CartDrawer } from '@/components/storefront/cart-drawer';
import { CookieBanner } from '@/components/storefront/cookie-banner';
import { Toast } from '@/components/storefront/toast';
import { WhatsAppButton } from '@/components/storefront/whatsapp-button';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
              <Header />
              <main>{children}</main>
              <CartDrawer />
              <Toast />
              <CookieBanner />
              <WhatsAppButton />
              <Footer />
    </>
  );
}
