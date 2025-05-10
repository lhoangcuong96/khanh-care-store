import AdminCategoryController from '@/controllers/admin/admin-category.controller'
import {
  AdminCreateCategoryBodySchema,
  AdminCreateCategoryBodyType,
  AdminDeleteCategoryParamsSchema,
  AdminListCategoryResponseSchema,
  AdminUpdateCategoryBodyType,
  AdminUpdateCategoryParamsSchema,
  GetCategoryAttributesParamsSchema,
  GetCategoryByIdParamsSchema,
  GetCategoryDetailResponseSchema
} from '@/schemaValidations/admin/admin-category-schema'
import { GetCategoryAttributesResponseSchema } from '@/schemaValidations/category.schema'
import { MessageResponseSchema } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { console } from 'inspector'

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
      const categories = await AdminCategoryController.list()
      reply.send({
        data: categories,
        message: 'Lấy danh sách danh mục thành công thành công!'
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

  fastify.put(
    '/:id',
    {
      schema: {
        params: AdminUpdateCategoryParamsSchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string }
      const { body } = request as FastifyRequest<{ Body: AdminUpdateCategoryBodyType }>
      await AdminCategoryController.update(id, body)
      reply.send({
        message: 'Cập nhật danh mục thành công!'
      })
    }
  )

  fastify.get(
    '/:id/attributes',
    {
      schema: {
        params: GetCategoryAttributesParamsSchema,
        response: {
          200: GetCategoryAttributesResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params
      const attributes = await AdminCategoryController.getCategoryAttributes(id)
      reply.send({
        data: attributes,
        message: 'Lấy danh sách thuộc tính thành công!'
      })
    }
  )

  fastify.get(
    '/:id',
    {
      schema: {
        params: GetCategoryByIdParamsSchema,
        response: {
          200: GetCategoryDetailResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params
      const category = await AdminCategoryController.getCategoryById(id)
      reply.send({
        data: category,
        message: 'Lấy danh mục thành công!'
      })
    }
  )

  fastify.post(
    '/:id/delete',
    {
      schema: {
        params: AdminDeleteCategoryParamsSchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params
      await AdminCategoryController.delete([id])
      reply.send({
        message: 'Xóa danh mục thành công!'
      })
    }
  )
}
