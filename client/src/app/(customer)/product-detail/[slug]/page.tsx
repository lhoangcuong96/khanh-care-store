import productRequestApi from "@/api-request/product";
import AppBreadcrumb from "@/components/customer/layout/breadcrumb";
import { ErrorMessage } from "@/components/customer/UI/error-massage";
import { routePath } from "@/constants/routes";
import { HttpError } from "@/lib/http";
import { ProductDetailType } from "@/validation-schema/product";
import { ProductImages } from "./product-images";
import { ProductInfo, ProductPromotions } from "./product-info";
import { ProductTabs } from "./product-tabs";
import { PromotionCodes } from "./promotion-codes";
import { Recommendations } from "./recommendations";
import { StorePolicies } from "./store-policies";
import { cache } from "react";
import envConfig from "@/envConfig";
import { sharedMetadata, sharedOpenGraph } from "@/app/shared-metadata";

// sử dụng cache để tránh bị double fetch khi cả metadata và component cùng fetch dữ liệu
const getProductDetail = cache(productRequestApi.getProductDetail);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const res = await getProductDetail(slug);
    const product = res.payload?.data;
    const url = `${envConfig?.NEXT_PUBLIC_URL}/ ${routePath.customer}/${product?.slug}`;
    return {
      ...sharedMetadata,
      title: product?.name || "Không tìm thấy sản phẩm",
      description: product?.description || "Không tìm thấy sản phẩm",
      openGraph: {
        ...sharedOpenGraph,
        title: product?.name || "Không tìm thấy sản phẩm",
        description: product?.description || "Không tìm thấy sản phẩm",
        url: url,
        images: [
          {
            url: product?.image.thumbnail,
          },
        ],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Không tìm thấy sản phẩm",
      description: "Không tìm thấy sản phẩm",
    };
  }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let errorMessage = "";
  let productDetail: ProductDetailType | null = null;
  if (!slug) {
    errorMessage = "Không tìm thấy sản phẩm";
  }

  try {
    const resp = await getProductDetail(slug);
    if (resp.payload?.data) {
      productDetail = resp.payload.data;
    } else {
      errorMessage = "Không tìm thấy sản phẩm";
    }
  } catch (error) {
    errorMessage = (error as HttpError).message;
  }

  return (
    <div className="flex flex-col w-full items-center justify-center h-full text-sm font-medium">
      <AppBreadcrumb
        pageTitle={productDetail?.name || errorMessage}
        breadcrumbItems={[
          {
            title: "Trang chủ",
            href: routePath.customer.home,
          },
          {
            title: "Sản phẩm",
          },
          {
            title: productDetail?.name || errorMessage,
          },
        ]}
      ></AppBreadcrumb>
      <div className="w-screen p-8 flex items-center justify-center h-full">
        <div className="max-w-screen-xl w-full">
          <div className="mx-auto">
            <div className="container mx-auto px-4 py-8 font-medium">
              {!productDetail ? (
                <ErrorMessage className="text-center">
                  {errorMessage}
                </ErrorMessage>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ProductImages
                        images={
                          productDetail?.image.thumbnail
                            ? [productDetail?.image.thumbnail]
                            : []
                        }
                      />
                      <ProductInfo product={productDetail} />
                    </div>
                    <div className="my-6">
                      <ProductPromotions />
                      <ProductTabs description={productDetail.description} />
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <StorePolicies />
                    <PromotionCodes />
                    <Recommendations />
                  </div>
                  <div className="space-y-8"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
