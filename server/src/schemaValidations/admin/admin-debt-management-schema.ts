import z from 'zod'

import { PartnerType, TransactionType, TransactionStatus } from '@prisma/client'

/* Partner */
const PartnerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Tên là thông tin bắt buộc').max(255, 'Tên không được quá 255 kí tự'),
  phone: z.string().regex(new RegExp('^(0[1-9]{1}[0-9]{8})$|^(84[1-9]{1}[0-9]{8})$'), 'Số điện thoại không đúng!'),
  email: z.string().email('Email không đúng!').optional().nullable().or(z.literal('')),
  address: z.string().max(255, 'Địa chỉ không được quá 255 kí tự'),
  type: z.enum(Object.values(PartnerType) as [PartnerType, ...PartnerType[]]).default(PartnerType.INDIVIDUAL),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  notes: z.string().max(255, 'Ghi chú không được quá 255 kí tự').optional().nullable(),
  totalDebt: z.number().default(0).optional().nullable(),
  paidAmount: z.number().default(0).optional().nullable(),
  remainingDebt: z.number().default(0).optional().nullable(),
  contactPerson: z.string().max(255, 'Người liên hệ không được quá 255 kí tự').optional().nullable(),
  contactPosition: z.string().max(255, 'Chức vụ không được quá 255 kí tự').optional().nullable(),
  contactPhone: z
    .string()
    .regex(new RegExp('^(0[1-9]{1}[0-9]{8})$|^(84[1-9]{1}[0-9]{8})$'), 'Số điện thoại không đúng!')
    .optional()
    .nullable()
    .or(z.literal('')),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable()
})
export type PartnerSchemaType = z.infer<typeof PartnerSchema>

/* Create partner */
export const CreatePartnerSchema = PartnerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).strip()
export const CreatePartnerResponseSchema = z.object({
  message: z.string(),
  data: PartnerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
  }).strip()
})

export type CreatePartnerType = z.infer<typeof CreatePartnerSchema>
export type CreatePartnerResponseType = z.infer<typeof CreatePartnerResponseSchema>
/* Create partner */

/* Get list partners */
export const GetListPartnerParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => {
      return Number(val)
    }),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => {
      return Number(val)
    }),
  search: z.string().optional().nullable()
})

export const PartnerInListSchema = PartnerSchema.omit({
  contactPerson: true,
  contactPosition: true,
  contactPhone: true,
  createdAt: true,
  updatedAt: true
}).strip()

export const GetListPartnerResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    partners: z.array(PartnerSchema)
  })
})

export type GetListPartnerParamsType = z.infer<typeof GetListPartnerParamsSchema>
export type GetListPartnerResponseType = z.infer<typeof GetListPartnerResponseSchema>
export type PartnerInListType = z.infer<typeof PartnerInListSchema>
/* Get list partners */

/* Get list partner option */
export const PartnerInListOptionSchema = PartnerSchema.pick({
  id: true,
  name: true,
  remainingDebt: true
})
export const GetListPartnerOptionResponseSchema = z.object({
  message: z.string(),
  data: z.array(PartnerInListOptionSchema)
})
export type GetListPartnerOptionResponseType = z.infer<typeof GetListPartnerOptionResponseSchema>
export type PartnerInListOptionType = z.infer<typeof PartnerInListOptionSchema>
/* Get list partner option */
/* Partner */

/* Transaction */
export const TransactionItemSchema = z.object({
  productName: z
    .string({
      required_error: 'Tên sản phẩm là thông tin bắt buộc'
    })
    .max(255, 'Tên sản phẩm không được quá 255 kí tự'),
  quantity: z.number().min(1, 'Số lượng là thông tin bắt buộc').max(1000, 'Số lượng không được quá 1000'),
  price: z.number().min(1, 'Giá là thông tin bắt buộc').max(1000000000, 'Giá không được quá 1 tỷ'),
  total: z.number().min(1, 'Thành tiền là thông tin bắt buộc').max(1000000000, 'Thành tiền không được quá 1 tỷ'),
  notes: z.string().max(255, 'Ghi chú không được quá 255 kí tự').optional().nullable()
})

export const TransactionSchema = z.object({
  id: z.string(),
  transactionCode: z.string(),
  partnerId: z.string(),
  type: z.enum(Object.values(TransactionType) as [TransactionType, ...TransactionType[]]),
  amount: z.number(),
  paidAmount: z.number().optional().nullable(),
  notes: z.string().max(255, 'Ghi chú không được quá 255 kí tự').optional().nullable(),
  date: z.string(),
  referenceCode: z.string().optional().nullable(),
  items: z.array(TransactionItemSchema).optional().nullable(),
  status: z.enum(Object.values(TransactionStatus) as [TransactionStatus, ...TransactionStatus[]])
})

export const AddTransactionBodySchema = TransactionSchema.omit({
  id: true,
  transactionCode: true,
  amount: true,
  items: true
}).merge(
  z.object({
    items: z
      .array(
        TransactionItemSchema.omit({
          total: true
        })
      )
      .optional()
      .nullable()
  })
)

export const AddTransactionResponseSchema = z.object({
  message: z.string(),
  data: TransactionSchema
})

export type AddTransactionBodyType = z.infer<typeof AddTransactionBodySchema>
export type AddTransactionResponseType = z.infer<typeof AddTransactionResponseSchema>
/* Transaction */
