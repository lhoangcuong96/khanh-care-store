import z from 'zod'

export const NewsImageSchema = z.object({
  thumbnail: z.string(),
  banner: z.string().nullable().optional(),
  gallery: z.array(z.string()).default([])
})

export const NewsSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Tiêu đề là thông tin bắt buộc').max(256, 'Tiêu đề không được quá 256 kí tự'),
  slug: z.string().min(1).max(256),
  summary: z.string().min(1, 'Tóm tắt là thông tin bắt buộc').max(500, 'Tóm tắt không được quá 500 kí tự'),
  content: z.string().min(1, 'Nội dung là thông tin bắt buộc'),
  image: NewsImageSchema,
  author: z.string().min(1, 'Tác giả là thông tin bắt buộc'),
  tags: z.array(z.string()),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  viewCount: z.number().default(0),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  publishedAt: z.union([z.string(), z.date()]).nullable().optional(),
  metaTitle: z.string().max(256).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  metaKeywords: z.array(z.string()).optional().nullable()
})

export type NewsSchemaType = z.infer<typeof NewsSchema>

/* Get list news */

export const NewsListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional()
})

export type NewsListQueryType = z.infer<typeof NewsListQuerySchema>
export const NewsInListSchema = NewsSchema.pick({
  id: true,
  title: true,
  slug: true,
  summary: true,
  image: true,
  author: true,
  tags: true,
  isFeatured: true,
  viewCount: true,
  createdAt: true
})

export type NewsInListType = z.infer<typeof NewsInListSchema>

export const NewsListResponseSchema = z.object({
  data: z.array(NewsInListSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number()
})
