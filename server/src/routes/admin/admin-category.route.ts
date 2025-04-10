import AdminCategoryController from '@/controllers/admin/admin-category.controller'
import {
  CreateCategoryBodySchema,
  CreateCategoryBodyType,
  ListCategoryResponseSchema
} from '@/schemaValidations/admin/admin-category-schema'
import { MessageResponseSchema, MessageResponseType } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export function AdminCategoryRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
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
      const orders = await AdminCategoryController.list()
      reply.send({
        data: orders,
        message: 'Lấy danh sách đơn hàng thành công!'
      })
    }
  )
}
