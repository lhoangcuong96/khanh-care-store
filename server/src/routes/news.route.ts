import NewsController from '@/controllers/news.controller'
import { NewsListQuerySchema, NewsListResponseSchema } from '@/schemaValidations/admin/admin-news-schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export function NewsRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new NewsController()

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
      const result = await controller.getNewsList(query)
      reply.send({
        ...result,
        message: 'Lấy danh sách tin tức thành công!'
      })
    }
  )
}
