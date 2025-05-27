import NewsController from '@/controllers/news.controller'
import { NewsListQuerySchema, NewsListResponseSchema } from '@/schemaValidations/admin/admin-news-schema'
import { NewsSchema } from '@/schemaValidations/news.schema'
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

  fastify.get(
    '/:slug',
    {
      schema: {
        params: z.object({
          slug: z.string()
        }),
        response: {
          200: z.object({
            data: NewsSchema,
            message: z.string()
          })
        }
      }
    },
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
      const { slug } = request.params
      const news = await controller.getNewsDetails(slug)

      if (!news) {
        return reply.status(404).send({
          message: 'Không tìm thấy tin tức!'
        })
      }

      reply.send({
        data: news,
        message: 'Lấy chi tiết tin tức thành công!'
      })
    }
  )
}
