import z from "zod";

export const generatePresignedUrlResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    presignedUrl: z.string(),
    fileUrl: z.string(),
  }),
});

export type GeneratePresignedUrlResponseType = z.TypeOf<
  typeof generatePresignedUrlResponseSchema
>;
