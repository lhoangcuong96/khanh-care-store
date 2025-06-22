import z from "zod";

/* Create Delivery */
export const CreateDeliveryBodySchema = z.object({
  orderId: z.string().min(1, "Mã đơn hàng là bắt buộc"),
  deliveryCode: z.string().min(1, "Mã giao hàng là bắt buộc"),
  recipientFullname: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  recipientPhoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  recipientEmail: z.string().email("Email không hợp lệ").optional().nullable(),
  recipientAddress: z.object({
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
    ward: z.string().min(1, "Phường/Xã là bắt buộc"),
    district: z.string().min(1, "Quận/Huyện là bắt buộc"),
    province: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
  }),
  deliveryDate: z.date({
    required_error: "Ngày giao hàng là bắt buộc",
  }),
  deliveryPeriod: z.enum(["morning", "afternoon", "evening"], {
    required_error: "Thời gian giao hàng là bắt buộc",
  }),
  deliveryFee: z.number().min(0, "Phí giao hàng không được âm"),
  note: z
    .string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional()
    .nullable(),
  status: z
    .enum(["PENDING", "IN_TRANSIT", "DELIVERED", "FAILED", "CANCELLED"])
    .default("PENDING"),
});

export const CreateDeliveryResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    deliveryCode: z.string(),
    orderId: z.string(),
    recipientFullname: z.string(),
    recipientPhoneNumber: z.string(),
    recipientEmail: z.string().nullable(),
    recipientAddress: z.object({
      address: z.string(),
      ward: z.string(),
      district: z.string(),
      province: z.string(),
    }),
    deliveryDate: z.date(),
    deliveryPeriod: z.string(),
    deliveryFee: z.number(),
    note: z.string().nullable(),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  message: z.string(),
});

/* Get List Deliveries */
export const GetListDeliveriesQuerySchema = z.object({
  page: z.string().optional().nullable(),
  limit: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  search: z.string().optional().nullable(),
  orderBy: z.string().optional().nullable(),
  order: z.string().optional().nullable(),
  deliveryDate: z.string().optional().nullable(),
});

export const DeliveryInListSchema = z.object({
  id: z.string(),
  deliveryCode: z.string(),
  orderId: z.string(),
  orderCode: z.string(),
  recipientFullname: z.string(),
  recipientPhoneNumber: z.string(),
  recipientEmail: z.string().nullable(),
  recipientAddress: z.object({
    address: z.string(),
    ward: z.string(),
    district: z.string(),
    province: z.string(),
  }),
  deliveryDate: z.date(),
  deliveryPeriod: z.string(),
  deliveryFee: z.number(),
  note: z.string().nullable(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetListDeliveriesResponseSchema = z.object({
  data: z.array(DeliveryInListSchema),
  total: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  limit: z.number(),
  message: z.string(),
});

/* Update Delivery */
export const UpdateDeliveryBodySchema = CreateDeliveryBodySchema.partial();

export const UpdateDeliveryResponseSchema = CreateDeliveryResponseSchema;

/* Delete Delivery */
export const DeleteDeliveryResponseSchema = z.object({
  message: z.string(),
});

/* Get Delivery Detail */
export const GetDeliveryDetailResponseSchema = CreateDeliveryResponseSchema;

/* Types */
export type CreateDeliveryBodyType = z.infer<typeof CreateDeliveryBodySchema>;
export type CreateDeliveryResponseType = z.infer<
  typeof CreateDeliveryResponseSchema
>;
export type GetListDeliveriesQueryType = z.infer<
  typeof GetListDeliveriesQuerySchema
>;
export type GetListDeliveriesResponseType = z.infer<
  typeof GetListDeliveriesResponseSchema
>;
export type DeliveryInListType = z.infer<typeof DeliveryInListSchema>;
export type UpdateDeliveryBodyType = z.infer<typeof UpdateDeliveryBodySchema>;
export type UpdateDeliveryResponseType = z.infer<
  typeof UpdateDeliveryResponseSchema
>;
export type DeleteDeliveryResponseType = z.infer<
  typeof DeleteDeliveryResponseSchema
>;
export type GetDeliveryDetailResponseType = z.infer<
  typeof GetDeliveryDetailResponseSchema
>;
