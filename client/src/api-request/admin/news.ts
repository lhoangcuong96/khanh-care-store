import { News } from "@/types/news";
import { http } from "@/lib/http";
import {
  CreateNewsBodyType,
  UpdateNewsBodyType,
} from "@/validation-schema/admin/admin-news-schema";

export const adminNewsApiRequest = {
  create: (data: CreateNewsBodyType) =>
    http.post<News>("/api/admin/news", data, {
      isPrivate: true,
      isAdminRequest: true,
    }),

  update: (data: UpdateNewsBodyType) =>
    http.put<News>(`/api/admin/news/${data.id}`, data, {
      isPrivate: true,
      isAdminRequest: true,
    }),

  delete: (id: string) =>
    http.delete<void>(
      `/api/admin/news/${id}`,
      {},
      {
        isPrivate: true,
        isAdminRequest: true,
      }
    ),

  getAll: () =>
    http.get<News[]>("/api/admin/news", {
      isPrivate: true,
      isAdminRequest: true,
    }),

  getById: (id: string) =>
    http.get<News>(`/api/admin/news/${id}`, {
      isPrivate: true,
      isAdminRequest: true,
    }),
};
