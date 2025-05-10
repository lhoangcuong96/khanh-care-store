import z from 'zod'
import { NewsSchema } from '../news.schema'

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
  publishedAt: true
})

export type NewsInListType = z.infer<typeof NewsInListSchema>

/*----------------------Create------------------------*/
export const CreateNewsBodySchema = NewsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true
})

export type CreateNewsBodyType = z.infer<typeof CreateNewsBodySchema>

/*----------------------Update------------------------*/
export const UpdateNewsBodySchema = CreateNewsBodySchema.partial().extend({
  id: z.string()
})

export type UpdateNewsBodyType = z.infer<typeof UpdateNewsBodySchema>
