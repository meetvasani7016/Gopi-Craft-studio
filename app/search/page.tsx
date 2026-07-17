import { MainLayout } from "@/components/layout/main-layout";
import { SearchContent } from "@/features/search/search-content";

export const metadata = {
  title: "Search Catalog",
  description: "Search for handcrafted Indian decor, temple essentials, and artisan gifts.",
};

export default function SearchPage() {
  return (
    <MainLayout>
      <SearchContent />
    </MainLayout>
  );
}
