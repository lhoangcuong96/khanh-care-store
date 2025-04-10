import HeroCarousel from "./hero-carousel";
import CategoryGrid from "./category-grid";
import ComboSection from "./combo-section";
import BestSellingSection from "./best-selling-section";
import CategorySidebar from "./category-sidebar";
import { Separator } from "@/components/ui/separator";
import MainNavigationBar from "./main-navigation-bar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <div className="container max-w-[1290px] px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="hidden md:block">
            <CategorySidebar />
          </div>

          <div className="md:col-span-3">
            <MainNavigationBar />
            <HeroCarousel />
          </div>
        </div>
        <section className="py-6">
          <div className="container px-4">
            <h1 className="text-xl md:text-2xl font-bold text-center text-blue-900 mb-6">
              Khánh Care Store – Thiết Bị Garage Và Phụ Gia Ô Tô
            </h1>

            <CategoryGrid />
          </div>
        </section>

        <Separator />

        <ComboSection />

        <Separator />

        <BestSellingSection />
      </div>
    </div>
  );
}
