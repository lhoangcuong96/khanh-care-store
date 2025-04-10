import { z } from "zod";

export const MessageResponse = z
  .object({
    message: z.string(),
  })
  .strict();
export type MessageResponseType = z.infer<typeof MessageResponse>;

export const CommonResponse = z.object({
  data: z.any(),
  message: z.string(),
});
export type CommonResponseType = z.infer<typeof CommonResponse>;

export const UploadResponse = z.object({
  data: z.string(),
  message: z.string(),
});

export type UploadResponseType = z.infer<typeof UploadResponse>;

export enum Order {
  Asc = "asc",
  Desc = "desc",
}

export const PaginationQuery = z.object({
  // positive: số dương
  // int: luôn là số nguyên nếu không raise error
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
});

export const CommonQuery = z.object({
  ...PaginationQuery.shape,
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.nativeEnum(Order).optional(),
});
