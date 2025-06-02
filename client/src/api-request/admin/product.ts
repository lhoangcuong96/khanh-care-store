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
    const queryParams = new URLSearchParams();
    // Add common query params
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);

    // Add product-specific params
    if (params.category) queryParams.append("category", params.category);
    if (params.priceFrom)
      queryParams.append("priceFrom", params.priceFrom.toString());
    if (params.priceTo)
      queryParams.append("priceTo", params.priceTo.toString());
    if (params.stockStatus)
      queryParams.append("stockStatus", params.stockStatus);
    if (params.createdFrom)
      queryParams.append("createdFrom", params.createdFrom.toISOString());
    if (params.createdTo)
      queryParams.append("createdTo", params.createdTo.toISOString());
    if (params.isPublished)
      queryParams.append("isPublished", params.isPublished);

    const url = `/admin/products?${queryParams.toString()}`;
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

  publishProduct: (id: string) => {
    return http.post<MessageResponseType>(
      `/admin/products/${id}/publish`,
      {},
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  unpublishProduct: (id: string) => {
    return http.post<MessageResponseType>(
      `/admin/products/${id}/unpublish`,
      {},
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  deleteProduct: (id: string) => {
    return http.delete<MessageResponseType>(
      `/admin/products/${id}`,
      {},
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },

  deleteProducts: (ids: string[]) => {
    return http.delete<MessageResponseType>(
      `/admin/products`,
      {
        ids,
      },
      {
        isAdminRequest: true,
        isPrivate: true,
      }
    );
  },
};
