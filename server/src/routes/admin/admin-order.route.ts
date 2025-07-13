import AdminOrderController from '@/controllers/admin/admin-order.controller'
import {
  GetListOrdersQuerySchema,
  GetListOrdersQueryType,
  UpdateOrderStatusBodySchema,
  UpdateOrderStatusBodyType,
  UpdateOrderStatusParamsSchema,
  UpdateOrderStatusParamsType
} from '@/schemaValidations/admin/admin-order-schema'
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify'

const AdminOrderRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.get(
    '/',
    {
      schema: {
        querystring: GetListOrdersQuerySchema
      }
    },
    async (request: FastifyRequest<{ Querystring: GetListOrdersQueryType }>, reply) => {
      const params = request.query
      const response = await AdminOrderController.list(params)
      reply.send({
        message: 'Lấy danh sách đơn hàng thành công',
        data: response.data,
        total: response.total,
        totalPages: response.totalPages,
        page: response.page,
        limit: response.limit
      })
    }
  )

  fastify.put(
    '/:orderId/status',
    {
      schema: {
        params: UpdateOrderStatusParamsSchema,
        body: UpdateOrderStatusBodySchema
      }
    },
    async (
      request: FastifyRequest<{
        Params: UpdateOrderStatusParamsType
        Body: UpdateOrderStatusBodyType
      }>,
      reply
    ) => {
      const params = request.params
      const body = request.body
      const response = await AdminOrderController.updateStatus(params, body)
      reply.send({
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: response
      })
    }
  )
}

export default AdminOrderRoutes
