import landingApiRequest from "@/api-request/landing";
import { HeroImage } from "@/components/customer/layout/hero-image";
import Spinner from "@/components/ui/spinner";
import { shopInfo } from "@/constants/shop-info";
import { GetLandingDataType } from "@/validation-schema/landing";
import { ProductInListType } from "@/validation-schema/product";
import { Metadata } from "next";
import { Suspense } from "react";
import { BestSellingProducts } from "./best-selling-products";
import { CategoryWithProducts } from "./category-with-products";
import { FeaturedCategories } from "./featured-categories";
import { FeaturedProducts } from "./featured-products";
import { OurSpecialServices } from "./our-special-services";
import NewsSection from "./news-section";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Tìm kiếm những sản phẩm nổi bật tại ${shopInfo.name}`,
    description: "",
  };
}

export default async function CustomerHomePage() {
  let landingPageData: GetLandingDataType | undefined;
  let getProductError: string | undefined;

  try {
    const response = await landingApiRequest.getLandingData();
    landingPageData = response.payload?.data;
    console.log("landingPageData", landingPageData);
  } catch (err) {
    console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm!", err);
    getProductError = "Có lỗi xảy ra khi lấy dữ liệu sản phẩm!";
  }

  return (
    <div className="flex flex-col items-center w-full">
      <HeroImage src="/images/breadcrumb.jpg"></HeroImage>
      <div className="flex flex-col items-center gap-8 px-5 w-full max-w-screen-xl">
        <Suspense fallback={<Spinner />}>
          <FeaturedCategories
            categories={landingPageData?.featuredCategories || []}
            error={getProductError}
          ></FeaturedCategories>
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <FeaturedProducts
            products={
              landingPageData?.bestSellerProducts as ProductInListType[]
            }
            error={getProductError}
          ></FeaturedProducts>
          <BestSellingProducts
            products={
              landingPageData?.bestSellerProducts as ProductInListType[]
            }
            error={getProductError}
          ></BestSellingProducts>
        </Suspense>
        <Suspense fallback={<Spinner />}>
          {landingPageData?.categoriesWithProducts.map((category) => (
            <CategoryWithProducts
              key={category.id}
              category={category}
              error={getProductError}
            ></CategoryWithProducts>
          ))}
        </Suspense>

        <OurSpecialServices></OurSpecialServices>
      </div>
      {/* News Section with mock data */}
      <NewsSection news={landingPageData?.listNews || []} />
    </div>
  );
}
