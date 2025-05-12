import z from "zod";
import { NewsSchema } from "../news.schema";
import { Order } from "../common";

/*----------------------List------------------------*/
export const NewsInListSchema = NewsSchema.pick({
  id: true,
  title: true,
  slug: true,
  summary: true,
  image: true,
  author: true,
  tags: true,
  isPublished: true,
  isFeatured: true,
  viewCount: true,
  createdAt: true,
  publishedAt: true,
});

export type NewsInListType = z.infer<typeof NewsInListSchema>;

export const NewsListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.nativeEnum(Order).optional(),
  search: z.string().optional(),
  isPublished: z
    .union([z.boolean(), z.string().transform((val) => val === "true")])
    .optional(),
  isFeatured: z
    .union([z.boolean(), z.string().transform((val) => val === "true")])
    .optional(),
});

export type NewsListQueryType = z.infer<typeof NewsListQuerySchema>;

export const AdminGetNewsListResponseSchema = z.object({
  data: z.array(NewsInListSchema),
  total: z.number(),
  totalPages: z.number(),
  limit: z.number(),
  currentPage: z.number(),
  message: z.string(),
});

export type AdminGetNewsListResponseType = z.infer<
  typeof AdminGetNewsListResponseSchema
>;
/*----------------------Create------------------------*/
export const CreateNewsBodySchema = NewsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export type CreateNewsBodyType = z.infer<typeof CreateNewsBodySchema>;

/*----------------------Update------------------------*/
export const UpdateNewsBodySchema = CreateNewsBodySchema.partial().extend({
  id: z.string(),
});

export type UpdateNewsBodyType = z.infer<typeof UpdateNewsBodySchema>;
