import { http } from "@/lib/http";
import { News } from "@/types/news";
import {
  AdminGetNewsListResponseType,
  CreateNewsBodyType,
  NewsListQueryType,
  UpdateNewsBodyType,
} from "@/validation-schema/admin/admin-news-schema";

export const adminNewsApiRequest = {
  create: (data: CreateNewsBodyType) =>
    http.post<News>("/admin/news", data, {
      isPrivate: true,
      isAdminRequest: true,
    }),

  update: (data: UpdateNewsBodyType) =>
    http.put<News>(`/admin/news/${data.id}`, data, {
      isPrivate: true,
      isAdminRequest: true,
    }),

  delete: (id: string) =>
    http.delete<void>(
      `/admin/news/${id}`,
      {},
      {
        isPrivate: true,
        isAdminRequest: true,
      }
    ),

  getAll: (query: NewsListQueryType) => {
    const { page, limit, search, isPublished, isFeatured } = query;
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (isPublished !== undefined)
      params.append("isPublished", isPublished.toString());
    if (isFeatured !== undefined)
      params.append("isFeatured", isFeatured.toString());
    return http.get<AdminGetNewsListResponseType>(
      `/admin/news?${params.toString()}`,
      {
        isPrivate: true,
        isAdminRequest: true,
      }
    );
  },

  getById: (id: string) =>
    http.get<News>(`/admin/news/${id}`, {
      isPrivate: true,
      isAdminRequest: true,
    }),
};
