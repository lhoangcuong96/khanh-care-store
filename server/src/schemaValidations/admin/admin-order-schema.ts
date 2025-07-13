import z from 'zod'
import { OrderDeliveryInformationSchema, OrderSchema } from '../order.schema'
import { OrderStatus } from '@prisma/client'

/* Get List Orders */

export const GetListOrdersQuerySchema = z
  .object({
    page: z.string().optional().nullable(),
    limit: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    search: z.string().optional().nullable(),
    sort: z.string().optional().nullable(),
    order: z.string().optional().nullable()
  })
  .strip()

export const GetListOrderDataSchema = OrderSchema.pick({
  id: true,
  orderCode: true,
  status: true,
  items: true,
  totalAmount: true,
  createdAt: true
})
  .merge(
    z.object({
      deliveryInformation: OrderDeliveryInformationSchema.omit({
        recipientEmail: true
      })
    })
  )
  .strip()

export const GetListOrdersResponseSchema = z.object({
  data: z.array(GetListOrderDataSchema),
  total: z.number(),
  totalPages: z.number(),
  page: z.number(),
  limit: z.number(),
  message: z.string()
})

export type GetListOrdersQueryType = z.TypeOf<typeof GetListOrdersQuerySchema>
export type OrderInListDataType = z.TypeOf<typeof GetListOrderDataSchema>
export type GetListOrdersResponseType = z.TypeOf<typeof GetListOrdersResponseSchema>

/* Update Order Status */
export const UpdateOrderStatusBodySchema = z.object({
  status: z.enum(Object.values(OrderStatus) as [string, ...string[]])
})

export const UpdateOrderStatusParamsSchema = z.object({
  orderId: z.string()
})

export type UpdateOrderStatusBodyType = z.TypeOf<typeof UpdateOrderStatusBodySchema>
export type UpdateOrderStatusParamsType = z.TypeOf<typeof UpdateOrderStatusParamsSchema>

/* Get List Orders */
