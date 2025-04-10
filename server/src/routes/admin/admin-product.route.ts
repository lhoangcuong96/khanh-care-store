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
  ProductDetailSchema,
  ProductListQueryParamsSchema,
  ProductListQueryType,
  ProductListResSchema,
  ProductListResType,
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
      const products = await controller.getProductList({
        ...queryParams
      })
      reply.send({
        data: products,
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
          200: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      await controller.updateProduct(request.params.id, request.body)
      reply.send({
        message: 'Cập nhật sản phẩm thành công!'
      })
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
}
