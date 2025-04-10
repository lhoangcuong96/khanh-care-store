import { http } from "@/lib/http";
import { ListCategoryResponseType } from "@/validation-schema/category";

export const categoryApiRequests = {
  getListCategory: () => {
    return http.get<ListCategoryResponseType>("/category");
  },
};
