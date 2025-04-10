import z from 'zod'

const CreateInventoryBodySchema = z.object({
  quantity: z.number().int().positive(),
  location: z.string().optional(),
  productId: z.string().optional()
})

export type CreateInventoryBodyType = z.TypeOf<typeof CreateInventoryBodySchema>

export type UpdateInventoryBodyType = CreateInventoryBodyType
