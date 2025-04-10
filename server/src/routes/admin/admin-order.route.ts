import AdminOrderController from '@/controllers/admin/admin-order.controller'
import { GetListOrdersQuerySchema, GetListOrdersQueryType } from '@/schemaValidations/admin/admin-order-schema'
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
      const orders = await AdminOrderController.list(params)
      reply.send({
        message: 'Lấy danh sách đơn hàng thành công',
        data: orders
      })
    }
  )
}

export default AdminOrderRoutes
