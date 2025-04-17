import { http } from "@/lib/http";
import {
  AdminListCategoryResponseType,
  CreateCategoryBodyType,
} from "@/validation-schema/admin/category";

import { MessageResponseType } from "@/validation-schema/common";

function createCategory(data: CreateCategoryBodyType) {
  return http.post<MessageResponseType>("/admin/category", data, {
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
    `/admin/category/delete/`,
    {
      ids: [id],
    },
    {
      isPrivate: true,
      isAdminRequest: true,
    }
  );
}

export const adminCategoryRequestApis = {
  createCategory,
  getCategoryList,
  deleteCategory,
};
