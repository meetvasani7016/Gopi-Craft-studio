import { MainLayout } from "@/components/layout/main-layout";
import { ContactContent } from "@/features/contact/contact-content";

export const metadata = {
  title: "Contact Us",
  description: "We'd love to hear from you. Reach out for custom orders, bulk inquiries, or any questions.",
};

export default function ContactPage() {
  return (
    <MainLayout>
      <ContactContent />
    </MainLayout>
  );
}
