import AdminNewsController from '@/controllers/admin/admin-news.controller'
import {
  CreateNewsBodySchema,
  CreateNewsBodyType,
  NewsListQuerySchema,
  NewsListResponseSchema
} from '@/schemaValidations/admin/admin-news-schema'
import { MessageResponseSchema } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export function AdminNewsRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new AdminNewsController()

  fastify.get(
    '/',
    {
      schema: {
        querystring: NewsListQuerySchema,
        response: {
          200: NewsListResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Querystring: z.infer<typeof NewsListQuerySchema> }>, reply: FastifyReply) => {
      const { query } = request
      console.log('query', request.url)
      const result = await controller.getNewsList(query)
      reply.send({
        ...result,
        message: 'Lấy danh sách tin tức thành công!'
      })
    }
  )

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
