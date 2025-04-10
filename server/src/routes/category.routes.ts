import { CategoryController } from '@/controllers/category.controller'
import { ListCategoryResponseSchema } from '@/schemaValidations/category.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export function CategoryRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: ListCategoryResponseSchema
        }
      }
    },
    async (request, reply) => {
      const listCategory = await CategoryController.list()
      reply.send({
        data: listCategory,
        message: 'Lấy danh sách danh mục thành công'
      })
    }
  )
}
