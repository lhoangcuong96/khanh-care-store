import StorageController from '@/controllers/storage.controller'
import { requireLoggedHook } from '@/hooks/auth.hooks'
import {
  generatePresignedUrlBodySchema,
  GeneratePresignedUrlBodyType,
  generatePresignedUrlResponseSchema,
  GeneratePresignedUrlResponseType
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
}
