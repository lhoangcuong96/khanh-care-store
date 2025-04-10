import { z } from "zod";

/* Get cart*/
const CartItemSchema = z.object({
  quantity: z.number().int().positive(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    slug: z.string(),
    image: z.object({
      thumbnail: z.string(),
    }),
  }),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  updatedAt: z.date(),
});

export const GetCartResponseSchema = z.object({
  data: CartSchema,
  message: z.string(),
});

export type CartType = z.TypeOf<typeof CartSchema>;
export type GetCartResponseType = z.TypeOf<typeof GetCartResponseSchema>;
/* Get cart*/

/* Add product to cart*/
export const AddProductToCartSchema = z
  .object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })
  .strict();

export const AddProductToCartResponseSchema = z.object({
  data: CartSchema,
  message: z.string(),
});

export type AddProductToCartRequestType = z.infer<
  typeof AddProductToCartSchema
>;
export type AddProductToCartResponseType = z.infer<
  typeof AddProductToCartResponseSchema
>;

/* Add product to cart*/

/* Update cart*/
export type UpdateCartRequestType = AddProductToCartRequestType;
/* Update cart*/
