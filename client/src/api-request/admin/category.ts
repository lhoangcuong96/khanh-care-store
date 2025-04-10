import { http } from "@/lib/http";
import {
  CreateCategoryType,
  ListCategoryResponseType,
} from "@/validation-schema/category";
import { MessageResponseType } from "@/validation-schema/common";

function createCategory(data: CreateCategoryType) {
  return http.post<MessageResponseType>("/admin/category", data, {
    isPrivate: true,
    isAdminRequest: true,
  });
}

function getCategoryList() {
  return http.get<ListCategoryResponseType>("/admin/category", {
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

export const categoryAdminRequestApis = {
  createCategory,
  getCategoryList,
  deleteCategory,
};
