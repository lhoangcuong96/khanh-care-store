import AdminNewsController from '@/controllers/admin/admin-news.controller'
import { CreateNewsBodySchema, CreateNewsBodyType } from '@/schemaValidations/admin/admin-news-schema'
import { MessageResponseSchema } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'

export function AdminNewsRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new AdminNewsController()

  fastify.post(
    '/',
    {
      schema: {
        body: CreateNewsBodySchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreateNewsBodyType }>, reply: FastifyReply) => {
      const { body } = request
      await controller.createNews(body as CreateNewsBodyType)
      reply.send({
        message: 'Tạo tin tức thành công!'
      })
    }
  )
}
