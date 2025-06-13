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
  ProductListResType,
  ProductRelatedParamsSchema,
  ProductRelatedQueryParamsSchema
} from '@/schemaValidations/product.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import z from 'zod'

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

  fastify.get(
    '/:slug/related-products',
    {
      schema: {
        params: ProductRelatedParamsSchema,
        querystring: ProductRelatedQueryParamsSchema,
        response: {
          200: ProductListResSchema
        }
      }
    },
    async (request, reply) => {
      const { slug } = request.params as { slug: string }
      const { limit, page } = request.query as { limit?: number; page?: number }
      const relatedProducts = await controller.getRelatedProducts(slug, limit, page)
      console.log(relatedProducts)
      reply.send({
        ...relatedProducts,
        message: 'Lấy danh sách sản phẩm liên quan thành công!'
      })
    }
  )
}
