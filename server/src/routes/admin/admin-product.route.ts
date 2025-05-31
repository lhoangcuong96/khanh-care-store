import AdminProductController from '@/controllers/admin/admin-product.controller'
import {
  CreateProductBodySchema,
  CreateProductBodyType,
  DeleteProductParamsSchema,
  DeleteProductParamsType,
  ProductDetailParamsSchema,
  ProductDetailParamsType,
  ProductDetailResponseSchema,
  ProductDetailResponseType,
  ProductListQueryParamsSchema,
  ProductListQueryType,
  ProductListResSchema,
  ProductListResType,
  PublishProductParamsSchema,
  PublishProductParamsType,
  UnpublishProductParamsSchema,
  UnpublishProductParamsType,
  UpdateProductBodySchema,
  UpdateProductBodyType,
  UpdateProductParamsSchema,
  UpdateProductParamsType
} from '@/schemaValidations/admin/admin-product-schema'
import { MessageResponseSchema, MessageResponseType } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'

export default async function AdminProductRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new AdminProductController()
  fastify.get<{
    Reply: ProductListResType
    Request: {
      Querystring: ProductListQueryType
    }
  }>(
    '/',
    {
      schema: {
        response: {
          200: ProductListResSchema
        },
        querystring: ProductListQueryParamsSchema
      }
    },
    async (request, reply) => {
      const queryParams = request.query as ProductListQueryType
      const { data, total, limit, page, totalPages } = await controller.getProductList({
        ...queryParams
      })
      reply.send({
        data,
        total,
        limit,
        page,
        totalPages,
        message: 'Lấy danh sách sản phẩm thành công!'
      })
    }
  )

  fastify.get<{
    Params: ProductDetailParamsType
    Reply: ProductDetailResponseType
  }>(
    '/:slug',
    {
      schema: {
        params: ProductDetailParamsSchema,
        response: {
          200: ProductDetailResponseSchema
        }
      }
    },
    async (request, reply) => {
      const product = await controller.getProductDetail(request.params.slug)
      reply.send({
        data: product,
        message: 'Lấy thông tin sản phẩm thành công!'
      })
    }
  )

  fastify.post<{
    Body: CreateProductBodyType
    Reply: MessageResponseType
  }>(
    '/',
    {
      schema: {
        body: CreateProductBodySchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreateProductBodyType }>, reply: FastifyReply) => {
      await controller.createProduct(request.body)
      reply.send({
        message: 'Tạo sản phẩm thành công!'
      })
    }
  )

  fastify.put<{
    Params: UpdateProductParamsType
    Body: UpdateProductBodyType
    Reply: MessageResponseType
  }>(
    '/:id',
    {
      schema: {
        params: UpdateProductParamsSchema,
        body: UpdateProductBodySchema,
        response: {
          200: MessageResponseSchema,
          404: MessageResponseSchema,
          500: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      try {
        await controller.updateProduct(request.params.id, request.body)
        reply.send({
          message: 'Cập nhật sản phẩm thành công!'
        })
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            reply.code(404).send({
              message: 'Không tìm thấy sản phẩm!'
            })
          } else {
            reply.code(500).send({
              message: error.message
            })
          }
        } else {
          reply.code(500).send({
            message: 'Có lỗi xảy ra khi cập nhật sản phẩm!'
          })
        }
      }
    }
  )

  fastify.delete<{
    Params: DeleteProductParamsType
    Reply: MessageResponseType
  }>(
    '/:id',
    {
      schema: {
        params: DeleteProductParamsSchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      await controller.deleteProduct(request.params.id)
      reply.send({
        message: 'Xóa sản phẩm thành công!'
      })
    }
  )

  fastify.delete<{
    Body: {
      ids: string[]
    }
    Reply: MessageResponseType
  }>('/', async (request, reply) => {
    console.log(request.body.ids)
    await controller.bulkDeleteProduct(request.body.ids)
    reply.send({
      message: 'Xóa sản phẩm thành công!'
    })
  })

  fastify.post<{
    Params: PublishProductParamsType
    Reply: MessageResponseType
  }>(
    '/:id/publish',
    {
      schema: {
        params: PublishProductParamsSchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      await controller.publishProduct(request.params.id)
      reply.send({
        message: 'Xuất bản sản phẩm thành công!'
      })
    }
  )

  fastify.post<{
    Params: UnpublishProductParamsType
    Reply: MessageResponseType
  }>(
    '/:id/unpublish',
    {
      schema: {
        params: UnpublishProductParamsSchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      await controller.unpublishProduct(request.params.id)
      reply.send({
        message: 'Hủy xuất bản sản phẩm thành công!'
      })
    }
  )
}
