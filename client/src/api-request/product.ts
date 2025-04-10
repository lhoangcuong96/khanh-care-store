import { http } from "@/lib/http";
import {
  ProductDetailResponseType,
  ProductListResponseType,
  ProductListQueryType,
} from "@/validation-schema/product";

const productRequestApi = {
  getProductMetrics: () => {
    return http.get(`/products/metrics`);
  },
  getProductDetail: (slug: string) => {
    return http.get<ProductDetailResponseType>(`/products/${slug}`);
  },
  getProducts: (params: ProductListQueryType) => {
    const currentParams = new URLSearchParams(params as any);
    const url = `/products?${currentParams.toString()}`;
    return http.get<ProductListResponseType>(url);
  },
};

export default productRequestApi;
