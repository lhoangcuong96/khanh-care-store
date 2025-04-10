import z from 'zod'

export const OrderDeliveryInformationSchema = z.object({
  recipientFullname: z.string(),
  recipientPhoneNumber: z.string(),
  recipientEmail: z.string().email().optional().nullable(),
  recipientAddress: z.object({
    address: z.string(),
    ward: z.string(),
    district: z.string(),
    province: z.string()
  }),
  shippingFee: z.number(),
  shippingDate: z.union([z.string(), z.date()]).optional().nullable(),
  shippingPeriod: z.string().optional().nullable(),
  note: z.string().optional().nullable()
})

export const OrderItemSchema = z.object({
  productId: z.string(),
  productQuantity: z.number(),
  productPrice: z.number(),
  productName: z.string(),
  productImage: z.string()
})

export const OrderSchema = z.object({
  id: z.string(),
  orderCode: z.string(),
  status: z.string(),
  items: z.array(OrderItemSchema),
  deliveryInformation: OrderDeliveryInformationSchema,
  subtotal: z.number(),
  totalAmount: z.number(),
  createdAt: z.date()
})

/* Create Order */
export const CreateOrderBodySchema = OrderSchema.pick({
  deliveryInformation: true
}).extend({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number()
    })
  )
})

export const CreateOrderResponseSchema = z
  .object({
    data: OrderSchema,
    message: z.string()
  })
  .strip()

export type CreateOrderBodyType = z.TypeOf<typeof CreateOrderBodySchema>
export type CreateOrderResponseType = z.TypeOf<typeof CreateOrderResponseSchema>
/* Create Order */

/* Get Order */
export const GetOrderParamSchema = z
  .object({
    orderCode: z.string()
  })
  .strip()

export const GetOrderDataSchema = OrderSchema.omit({
  createdAt: true
})

export const GetOrderResponseSchema = z
  .object({
    data: GetOrderDataSchema,
    message: z.string()
  })
  .strip()

export type GetOrderDataType = z.TypeOf<typeof GetOrderDataSchema>
export type GetOrderResponseType = z.TypeOf<typeof GetOrderResponseSchema>
/* Get Order */

/* Get List Orders */
export const GetListOrdersQuerySchema = z
  .object({
    page: z.string().optional().nullable(),
    limit: z.string().optional().nullable()
  })
  .strip()

export const GetListOrderDataSchema = OrderSchema.pick({
  id: true,
  orderCode: true,
  status: true,
  items: true,
  totalAmount: true,
  createdAt: true
}).strip()

export const GetListOrdersResponseSchema = z.object({
  data: z.array(GetListOrderDataSchema),
  message: z.string()
})

export type GetListOrdersQueryType = z.TypeOf<typeof GetListOrdersQuerySchema>
export type OrderInListDataType = z.TypeOf<typeof GetListOrderDataSchema>
export type GetListOrdersResponseType = z.TypeOf<typeof GetListOrdersResponseSchema>

/* Get List Orders */
