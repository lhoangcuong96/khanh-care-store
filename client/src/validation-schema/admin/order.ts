import z from "zod";
import { OrderDeliveryInformationSchema, OrderSchema } from "../order";

/* Get List Orders */
export const GetListOrdersQuerySchema = z
  .object({
    page: z.string().optional().nullable(),
    limit: z.string().optional().nullable(),
  })
  .strip();

export const GetListOrderDataSchema = OrderSchema.pick({
  id: true,
  orderCode: true,
  status: true,
  items: true,
  totalAmount: true,
  createdAt: true,
})
  .merge(
    z.object({
      deliveryInformation: OrderDeliveryInformationSchema.omit({
        recipientEmail: true,
      }),
    })
  )
  .strip();

export const GetListOrdersResponseSchema = z.object({
  data: z.array(GetListOrderDataSchema),
  message: z.string(),
});

export type GetListOrdersQueryType = z.TypeOf<typeof GetListOrdersQuerySchema>;
export type OrderInListDataType = z.TypeOf<typeof GetListOrderDataSchema>;
export type GetListOrdersResponseType = z.TypeOf<
  typeof GetListOrdersResponseSchema
>;

/* Get List Orders */
