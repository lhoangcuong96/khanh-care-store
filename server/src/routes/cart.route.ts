import { CartController } from '@/controllers/cart.controller'
import { requireLoggedHook } from '@/hooks/auth.hooks'
import {
  AddProductToCartResponseSchema,
  AddProductToCartSchema,
  AddProductToCartType,
  DeleteCartItemSchema,
  GetCartResponseSchema,
  UpdateCartItemQuantityBodySchema,
  UpdateCartItemQuantityBodyType
} from '@/schemaValidations/cart.schema'
import { MessageResponseSchema } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'

export function CartRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook('preHandler', fastify.auth([requireLoggedHook]))
  fastify.post(
    '/add',
    {
      schema: {
        body: AddProductToCartSchema,
        response: {
          200: AddProductToCartResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: AddProductToCartType }>, reply: FastifyReply) => {
      const { productId, quantity } = request.body
      const cart = await CartController.addProductToCart(productId, quantity, request.account?.id)
      reply.send({
        message: 'Thêm sản phẩm vào giỏ hàng thành công',
        data: cart
      })
    }
  )

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: GetCartResponseSchema
        }
      }
    },
    async (fastify: FastifyRequest, reply: FastifyReply) => {
      const cart = await CartController.getCart(fastify.account?.id)
      reply.send({
        data: cart,
        message: 'Lấy thông tin giỏ hàng thành công'
      })
    }
  )

  fastify.put(
    '/',
    {
      schema: {
        body: UpdateCartItemQuantityBodySchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: UpdateCartItemQuantityBodyType }>, reply: FastifyReply) => {
      const { productId, quantity } = request.body
      await CartController.updateCartItemQuantity(productId, quantity, request.account?.id)
      reply.send({
        message: 'Cập nhật số lượng sản phẩm trong giỏ hàng thành công'
      })
    }
  )

  fastify.delete(
    '/:id',
    {
      schema: {
        params: DeleteCartItemSchema
      }
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params
      await CartController.removeCartItem(id, request.account?.id)
      reply.send({
        message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
      })
    }
  )
}
