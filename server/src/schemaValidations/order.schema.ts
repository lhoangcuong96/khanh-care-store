import z from 'zod'

export const OrderDeliveryInformationSchema = z.object({
  recipientFullname: z.string(),
  recipientPhoneNumber: z.string(),
  recipientEmail: z
    .string()
    .optional()
    .nullable()
    .refine((value) => {
      if (!value) return true
      return z.string().email('Email không hợp lệ').safeParse(value).success
    }, 'Email không hợp lệ'),
  recipientAddress: z.object({
    address: z.string(),
    ward: z.string(),
    district: z.string(),
    province: z.string()
  }),
  shippingFee: z.number().positive('Phí vận chuyển không hợp lệ'),
  // shippingDate: z.union([z.string(), z.date()]).optional().nullable(),
  // shippingPeriod: z.string().optional().nullable(),
  note: z.string().optional().nullable()
})

export const ProductVariantInfoSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  price: z.number().optional().nullable()
})

export const OrderItemSchema = z.object({
  productId: z.string(),
  productQuantity: z.number(),
  productPrice: z.number(),
  productName: z.string(),
  productImage: z.string(),
  productVariant: ProductVariantInfoSchema.optional().nullable()
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
      variantId: z.string().optional().nullable(),
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
    search: z.string().optional().nullable(),
    status: z.string().optional().nullable()
  })
  .strip()

export const GetListOrderDataSchema = OrderSchema.pick({
  id: true,
  orderCode: true,
  status: true,
  items: true,
  totalAmount: true,
  createdAt: true,
  deliveryInformation: true
}).strip()

export const GetListOrdersResponseSchema = z.object({
  data: z.array(GetListOrderDataSchema),
  message: z.string()
})

export type GetListOrdersQueryType = z.TypeOf<typeof GetListOrdersQuerySchema>
export type OrderInListDataType = z.TypeOf<typeof GetListOrderDataSchema>
export type GetListOrdersResponseType = z.TypeOf<typeof GetListOrdersResponseSchema>

/* Get List Orders */
