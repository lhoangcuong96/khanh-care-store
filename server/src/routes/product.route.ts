import ProductController from '@/controllers/product.controller'
import {
  ProductDetailParamsSchema,
  ProductDetailParamsType,
  ProductDetailResponseSchema,
  ProductDetailResponseType,
  ProductDetailSchema,
  ProductListQueryParamsSchema,
  ProductListQueryType,
  ProductListResSchema,
  ProductListResType
} from '@/schemaValidations/product.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function ProductRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new ProductController()
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
}
