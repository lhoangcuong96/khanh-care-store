import { http } from "@/lib/http";
import {
  AdminListCategoryResponseType,
  AdminCreateCategoryBodyType,
  GetCategoryAttributesResponseType,
  GetCategoryDetailResponseType,
  AdminUpdateCategoryBodyType,
} from "@/validation-schema/admin/category";

import { MessageResponseType } from "@/validation-schema/common";

function createCategory(data: AdminCreateCategoryBodyType) {
  return http.post<MessageResponseType>("/admin/category", data, {
    isPrivate: true,
    isAdminRequest: true,
  });
}

function updateCategory(id: string, data: AdminUpdateCategoryBodyType) {
  return http.put<MessageResponseType>(`/admin/category/${id}`, data, {
    isPrivate: true,
    isAdminRequest: true,
  });
}

function getCategoryList() {
  return http.get<AdminListCategoryResponseType>("/admin/category", {
    isPrivate: true,
    isAdminRequest: true,
  });
}

function deleteCategory(id: string) {
  return http.post<MessageResponseType>(
    `/admin/category/${id}/delete`,
    {},
    {
      isPrivate: true,
      isAdminRequest: true,
    }
  );
}

function getCategoryAttributes(id: string) {
  return http.get<GetCategoryAttributesResponseType>(
    `/admin/category/${id}/attributes`,
    {
      isPrivate: true,
      isAdminRequest: true,
    }
  );
}

function getCategoryDetail(id: string) {
  return http.get<GetCategoryDetailResponseType>(`/admin/category/${id}`, {
    isPrivate: true,
    isAdminRequest: true,
  });
}

export const adminCategoryRequestApis = {
  createCategory,
  updateCategory,
  getCategoryList,
  deleteCategory,
  getCategoryAttributes,
  getCategoryDetail,
};
