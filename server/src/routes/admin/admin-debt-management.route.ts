import AdminDebtManagementController from '@/controllers/admin/admin-debt-management.controller'
import {
  CreatePartnerSchema,
  CreatePartnerResponseSchema,
  CreatePartnerType,
  GetListPartnerParamsSchema,
  GetListPartnerResponseSchema,
  GetListPartnerParamsType,
  AddTransactionBodySchema,
  AddTransactionResponseSchema,
  AddTransactionBodyType,
  GetListPartnerOptionResponseSchema
} from '@/schemaValidations/admin/admin-debt-management-schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

const AdminDebtManagementRoute = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.post(
    '/partner',
    {
      schema: {
        body: CreatePartnerSchema,
        response: {
          200: CreatePartnerResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreatePartnerType }>, reply) => {
      const partner = await AdminDebtManagementController.createPartner(request.body)
      reply.send({
        data: partner,
        message: 'Tạo đối tác thành công'
      })
    }
  )

  fastify.get(
    '/partner',
    {
      schema: {
        querystring: GetListPartnerParamsSchema,
        response: {
          200: GetListPartnerResponseSchema
        }
      }
    },
    async (fastify: FastifyRequest<{ Querystring: GetListPartnerParamsType }>, reply: FastifyReply) => {
      const queryParams = fastify.query as GetListPartnerParamsType
      const partners = await AdminDebtManagementController.getListPartners(queryParams)
      reply.send({
        data: partners,
        message: 'Lấy danh sách đối tác thành công!'
      })
    }
  )

  fastify.get(
    '/partner/options',
    {
      schema: {
        response: {
          200: GetListPartnerOptionResponseSchema
        }
      }
    },
    async (fastify: FastifyRequest, reply: FastifyReply) => {
      const partners = await AdminDebtManagementController.getListPartnerOptions()
      reply.send({
        data: partners,
        message: 'Lấy danh sách đối tác thành công!'
      })
    }
  )

  fastify.post(
    '/partner/:id/delete',
    {
      schema: {
        params: z.object({
          id: z.string()
        })
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string }
      await AdminDebtManagementController.deletePartner(id)
      reply.send({
        message: 'Xóa đối tác thành công!'
      })
    }
  )

  fastify.post(
    '/transaction',
    {
      schema: {
        body: AddTransactionBodySchema,
        response: {
          200: AddTransactionResponseSchema
        }
      }
    },
    (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as AddTransactionBodyType
      const data = AdminDebtManagementController.addTransaction(body)
      reply.send({
        data: data,
        message: 'Thêm giao dịch thành công!'
      })
    }
  )
}

export default AdminDebtManagementRoute
