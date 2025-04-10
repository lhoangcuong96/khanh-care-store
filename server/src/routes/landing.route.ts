import LandingController from '@/controllers/landing.controller'
import { GetLandingDataSchema, GetLandingResponseSchema } from '@/schemaValidations/landing.schema'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'

const LandingRoutes = (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: GetLandingResponseSchema
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await LandingController.getLandingData()
      reply.send({
        data: data,
        message: 'Lấy dữ liệu trang chủ thành công'
      })
    }
  )
}

export default LandingRoutes
