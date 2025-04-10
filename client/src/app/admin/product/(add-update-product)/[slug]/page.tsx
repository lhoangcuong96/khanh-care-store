import { adminProductApiRequest } from "@/api-request/admin/product";
import { ProductForm } from "../product-form";
import { ProductDetailType } from "@/validation-schema/admin/product";

export default async function UpdateProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  let errorMessage = "";
  let productDetail: ProductDetailType | undefined;
  if (!slug) {
    errorMessage = "Lỗi không tìm thấy sản phẩm";
  } else {
    try {
      const response = await adminProductApiRequest.getProductDetail(slug);
      productDetail = response.payload?.data;
      if (!productDetail) {
        throw new Error("Lỗi không tìm thấy sản phẩm");
      }
      // console.log(response);
      console.log(productDetail);
    } catch (error) {
      errorMessage = (error as Error).message;
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 w-full ">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <ProductForm productDetail={productDetail} />
      )}
    </div>
  );
}
