import landingApiRequest from "@/api-request/landing";
import { HeroImage } from "@/components/customer/layout/hero-image";
import { shopInfo } from "@/constants/shop-info";
import { GetLandingDataType } from "@/validation-schema/landing";
import { Metadata } from "next";
import { cookies } from "next/headers";
import PageContent from "./page-content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Tìm kiếm những sản phẩm nổi bật tại ${shopInfo.name}`,
    description: "",
  };
}

export default async function CustomerHomePage() {
  let landingPageData: GetLandingDataType | undefined;
  let getProductError: string | undefined;

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  try {
    const response = await landingApiRequest.getLandingData(userId);
    landingPageData = response.payload?.data;
  } catch (err) {
    console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm!", err);
    getProductError = "Có lỗi xảy ra khi lấy dữ liệu sản phẩm!";
  }

  return (
    <div className="flex flex-col items-center w-full">
      <HeroImage src="/images/breadcrumb.jpg"></HeroImage>
      <PageContent
        landingPageData={
          landingPageData || {
            bestSellerProducts: [],
            featuredProducts: [],
            featuredCategories: [], // TODO: add featured categories
            categoriesWithProducts: [], // TODO: add categories with products
            promotionalProducts: [], // TODO: add promotional products
            listNews: [],
          }
        }
        getProductError={getProductError || ""}
      ></PageContent>
    </div>
  );
}
