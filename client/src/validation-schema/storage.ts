import z from "zod";

export const generatePresignedUrlBodySchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
});

export const generatePresignedUrlResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    presignedUrl: z.string(),
    fileUrl: z.string(),
  }),
});

export type GeneratePresignedUrlBodyType = z.TypeOf<
  typeof generatePresignedUrlBodySchema
>;
export type GeneratePresignedUrlResponseType = z.TypeOf<
  typeof generatePresignedUrlResponseSchema
>;

/*---------------------------------------------------------*/
// Upload multiple files

export const generatePresignedUrlsBodySchema = z.object({
  files: z.array(
    z.object({
      fileName: z.string(),
      fileType: z.string(),
    })
  ),
});

export const generatePresignedUrlsResponseSchema = z.object({
  message: z.string(),
  data: z.array(
    z.object({
      presignedUrl: z.string(),
      fileUrl: z.string(),
    })
  ),
});

export type GeneratePresignedUrlsBodyType = z.TypeOf<
  typeof generatePresignedUrlsBodySchema
>;
export type GeneratePresignedUrlsResponseType = z.TypeOf<
  typeof generatePresignedUrlsResponseSchema
>;
