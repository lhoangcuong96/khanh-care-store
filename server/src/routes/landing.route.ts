import LandingController from '@/controllers/landing.controller'
import {
  GetLandingDataSchema,
  GetLandingBodySchema,
  GetLandingBodyType,
  GetLandingResponseSchema
} from '@/schemaValidations/landing.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

const LandingRoutes = (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.post(
    '/',
    {
      schema: {
        body: GetLandingBodySchema,
        response: {
          200: GetLandingResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: GetLandingBodyType }>, reply: FastifyReply) => {
      const data = await LandingController.getLandingData(request.body.userId ?? undefined)
      reply.send({
        data: data,
        message: 'Lấy dữ liệu trang chủ thành công'
      })
    }
  )
}

export default LandingRoutes
