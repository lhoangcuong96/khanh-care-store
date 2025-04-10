import { http } from "@/lib/http";
import {
  CreateProductBodyType,
  ProductDetailResponseType,
  ProductListQueryType,
  ProductListResponseType,
  UpdateProductBodyType,
} from "@/validation-schema/admin/product";
import { MessageResponseType } from "@/validation-schema/common";

export const adminProductApiRequest = {
  getProducts: (params: ProductListQueryType) => {
    const url = `/admin/products?page=${params.page || 1}&limit=${
      params.limit | 20
    }&
       search=${params.search}&sort=${params.sort || "name"}&order=${
      params.order || "asc"
    }`;
    return http.get<ProductListResponseType>(url, {
      isAdminRequest: true,
    });
  },

  getProductDetail: (slug: string) => {
    return http.get<ProductDetailResponseType>(`/admin/products/${slug}`, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },

  createProduct: (data: CreateProductBodyType) => {
    return http.post<MessageResponseType>(`/admin/products`, data, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },

  updateProduct: (id: string, data: UpdateProductBodyType) => {
    return http.put<MessageResponseType>(`/admin/products/${id}`, data, {
      isAdminRequest: true,
      isPrivate: true,
    });
  },
};
