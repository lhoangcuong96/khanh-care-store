import StorageController from '@/controllers/storage.controller'
import { requireLoggedHook } from '@/hooks/auth.hooks'
import {
  generatePresignedUrlBodySchema,
  GeneratePresignedUrlBodyType,
  generatePresignedUrlResponseSchema,
  GeneratePresignedUrlResponseType,
  generatePresignedUrlsBodySchema,
  GeneratePresignedUrlsBodyType,
  generatePresignedUrlsResponseSchema,
  GeneratePresignedUrlsResponseType
} from '@/schemaValidations/storage.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'

export default function StorageRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook('preValidation', requireLoggedHook)
  const storageController = new StorageController()

  fastify.post<{
    Reply: GeneratePresignedUrlResponseType
    Body: GeneratePresignedUrlBodyType
  }>(
    '/generate-presigned-url',
    {
      schema: {
        body: generatePresignedUrlBodySchema,
        response: {
          200: generatePresignedUrlResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: GeneratePresignedUrlBodyType }>, reply: FastifyReply) => {
      const { fileName, fileType } = request.body
      const data = await storageController.generatePresignedUrl(fileName, fileType)
      return reply.send({
        message: 'Generate presigned url successfully',
        data
      })
    }
  )

  fastify.post<{
    Reply: GeneratePresignedUrlsResponseType
    Body: GeneratePresignedUrlsBodyType
  }>(
    '/generate-presigned-urls',
    {
      schema: {
        body: generatePresignedUrlsBodySchema,
        response: {
          200: generatePresignedUrlsResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: GeneratePresignedUrlsBodyType }>, reply: FastifyReply) => {
      const { files } = request.body
      const data = await storageController.generatePresignedUrls(files)
      return reply.send({
        message: 'Generate presigned url successfully',
        data
      })
    }
  )
}
