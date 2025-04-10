import z from 'zod'

export enum Order {
  Asc = 'asc',
  Desc = 'desc'
}

export const MessageResponseSchema = z
  .object({
    message: z.string()
  })
  .strict()

export type MessageResponseType = z.TypeOf<typeof MessageResponseSchema>

export const PaginationQuery = z.object({
  // positive: số dương
  // int: luôn là số nguyên nếu không raise error
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20)
})

export const CommonQuery = z.object({
  ...PaginationQuery.shape,
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.nativeEnum(Order).optional()
})
