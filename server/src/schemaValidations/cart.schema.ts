import z from 'zod'
/* Get */
const CartItemSchema = z.object({
  quantity: z.number().int().positive(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    slug: z.string(),
    image: z.object({
      thumbnail: z.string()
    }),
    variant: z
      .object({
        id: z.string(),
        name: z.string(),
        price: z.number().positive()
      })
      .optional()
  })
})

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  updatedAt: z.date()
})

export const GetCartResponseSchema = z.object({
  data: CartSchema,
  message: z.string()
})

export type CartType = z.TypeOf<typeof CartSchema>
export type GetCartResponseType = z.TypeOf<typeof GetCartResponseSchema>
/* Get */

/* Add */
export const AddProductToCartBodySchema = z
  .object({
    productId: z.string(),
    variantId: z.string().optional().nullable(),
    quantity: z.number().int().positive()
  })
  .strict()

export const AddProductToCartResponseSchema = z.object({
  data: CartSchema,
  message: z.string()
})

export type AddProductToCartBodyType = z.TypeOf<typeof AddProductToCartBodySchema>
export type AddProductToCartResponseType = z.TypeOf<typeof AddProductToCartResponseSchema>
/* Add */

/* Update */

export const UpdateCartItemQuantityBodySchema = AddProductToCartBodySchema

export type UpdateCartItemQuantityBodyType = z.TypeOf<typeof UpdateCartItemQuantityBodySchema>

/* Update */

/* Delete */
export const DeleteCartItemSchema = z.object({
  id: z.string()
})
/* Delete */
