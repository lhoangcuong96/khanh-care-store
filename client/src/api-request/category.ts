import { http } from "@/lib/http";
import {
  ListCategoryResponseLiteType,
  ListCategoryResponseType,
} from "@/validation-schema/category";

export const categoryApiRequests = {
  getListCategory: () => {
    return http.get<ListCategoryResponseType>("/category");
  },
  getListCategoryLite: () => {
    return http.get<ListCategoryResponseLiteType>("/category/lite");
  },
};
