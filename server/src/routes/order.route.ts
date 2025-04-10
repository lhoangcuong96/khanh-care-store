import OrderController from '@/controllers/order.controller'
import { requireLoggedHook } from '@/hooks/auth.hooks'
import {
  CreateOrderBodySchema,
  CreateOrderBodyType,
  CreateOrderResponseSchema,
  GetListOrdersResponseSchema,
  GetOrderParamSchema,
  GetOrderResponseSchema
} from '@/schemaValidations/order.schema'
import { FastifyAuthPluginOptions } from '@fastify/auth'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default function OrderRoutes(fastify: FastifyInstance, options: FastifyAuthPluginOptions) {
  fastify.addHook('preValidation', fastify.auth([requireLoggedHook]))
  fastify.post(
    '/create',
    {
      schema: {
        body: CreateOrderBodySchema,
        response: {
          200: CreateOrderResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreateOrderBodyType }>, reply: FastifyReply) => {
      request.account
      const body = request.body
      const order = await OrderController.createOrder(body, request.account?.id)
      reply.send({
        data: order,
        message: 'Tạo đơn hàng thành công'
      })
    }
  )
  fastify.get(
    '/get/:orderCode',
    {
      schema: {
        params: GetOrderParamSchema,
        response: {
          200: GetOrderResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Params: { orderCode: string } }>, reply: FastifyReply) => {
      const orderCode = request.params?.orderCode
      const accountId = request.account?.id
      console.log('Order code:', orderCode)
      const order = await OrderController.getOrderDetails(orderCode, accountId)
      console.log(order)
      reply.send({
        data: order,
        message: 'Lấy thông tin đơn hàng thành công'
      })
    }
  )
  fastify.get(
    '/list',
    {
      schema: {
        response: {
          200: GetListOrdersResponseSchema
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const accountId = request.account?.id
      const orders = await OrderController.getOrders(accountId)
      reply.send({
        data: orders,
        message: 'Lấy danh sách đơn hàng thành công'
      })
    }
  )
}
