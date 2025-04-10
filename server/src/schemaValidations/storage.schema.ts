import z from 'zod'

export const generatePresignedUrlBodySchema = z.object({
  fileName: z.string(),
  fileType: z.string()
})

export const generatePresignedUrlResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    presignedUrl: z.string(),
    fileUrl: z.string()
  })
})

export type GeneratePresignedUrlBodyType = z.TypeOf<typeof generatePresignedUrlBodySchema>
export type GeneratePresignedUrlResponseType = z.TypeOf<typeof generatePresignedUrlResponseSchema>
