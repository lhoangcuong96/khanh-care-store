import landingApiRequest from "@/api-request/landing";
import { HeroImage } from "@/components/customer/layout/hero-image";
import Spinner from "@/components/ui/spinner";
import { routePath } from "@/constants/routes";
import { GetLandingDataType } from "@/validation-schema/landing";
import { ProductInListType } from "@/validation-schema/product";
import { Metadata } from "next";
import { Suspense } from "react";
import { FeaturedCategories } from "./featured-categories";
import { OurSpecialServices } from "./our-special-services";
import { ProductSection } from "./product-section";
import { shopInfo } from "@/constants/shop-info";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Tìm kiếm những sản phẩm nổi bật tại ${shopInfo.name}`,
    description: "",
  };
}

export default async function CustomerHomePage() {
  let landingPageData: GetLandingDataType | undefined;
  let getProductError;

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
          ></FeaturedCategories>
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <ProductSection
            products={
              landingPageData?.promotionalProducts as ProductInListType[]
            }
            error={getProductError}
            title="Sản phẩm khuyến mãi"
            viewAllUrl={routePath.customer.products({
              isPromotion: true,
            })}
          ></ProductSection>
          <ProductSection
            products={
              landingPageData?.bestSellerProducts as ProductInListType[]
            }
            error={getProductError}
            title="Sản phẩm bán chạy"
            banner="/images/best-seller-banner.jpg"
            viewAllUrl={routePath.customer.products({
              isBestSeller: true,
            })}
          ></ProductSection>
          <ProductSection
            products={
              landingPageData?.bestSellerProducts as ProductInListType[]
            }
            error={getProductError}
            title="Sản phẩm nổi bật"
            banner="/images/featured-products-banner.jpg"
            viewAllUrl={routePath.customer.products({
              isFeatured: true,
            })}
          ></ProductSection>
        </Suspense>

        <OurSpecialServices></OurSpecialServices>
      </div>
    </div>
  );
}
