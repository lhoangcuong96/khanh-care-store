import AdminCategoryController from '@/controllers/admin/admin-category.controller'
import {
  AdminCreateCategoryBodySchema,
  AdminCreateCategoryBodyType,
  AdminListCategoryResponseSchema
} from '@/schemaValidations/admin/admin-category-schema'
import { MessageResponseSchema } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'

export function AdminCategoryRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: AdminListCategoryResponseSchema
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

  fastify.post(
    '/',
    {
      schema: {
        body: AdminCreateCategoryBodySchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: AdminCreateCategoryBodyType }>, rely: FastifyReply) => {
      const { body } = request
      await AdminCategoryController.create(body)
      rely.send({
        message: 'Tạo danh mục thành công!'
      })
    }
  )
}
