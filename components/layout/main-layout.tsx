import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { 
  getThemeSettings, 
  getWebsiteSettings, 
  getNavigationItems, 
  getFooterLinks 
} from "@/lib/supabase/queries";

interface MainLayoutProps {
  children: ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const [theme, website, navItems, footerLinks] = await Promise.all([
    getThemeSettings(),
    getWebsiteSettings(),
    getNavigationItems(),
    getFooterLinks(),
  ]);

  return (
    <>
      <Header 
        logoText={theme.logoText} 
        navItems={navItems}
        announcementText={website.announcementText}
        announcementVisible={website.announcementVisible}
      />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer 
        logoText={theme.logoText}
        footerLinks={footerLinks}
        whatsappNumber={website.whatsappNumber}
        whatsappMessage={website.whatsappMessage}
        instagramHandle={website.instagramHandle}
        phone={website.phone}
        email={website.email}
      />
      <WhatsAppButton 
        number={website.whatsappNumber} 
        message={website.whatsappMessage}
      />
    </>
  );
}
