import { AccountController } from '@/controllers/account.controller'
import { requireLoggedHook } from '@/hooks/auth.hooks'
import {
  AccountResponseSchema,
  AccountResponseType,
  AddFavoriteProductBodySchema,
  ChangePasswordBody,
  ChangePasswordBodyType,
  RemoveFavoriteProductBodySchema,
  UpdateProfileBodyType,
  UpdateShippingAddressBody,
  UpdateShippingAddressBodyType
} from '@/schemaValidations/account.schema'
import { MessageResponseSchema, MessageResponseType } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function accountRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook('preValidation', fastify.auth([requireLoggedHook]))
  fastify.get<{ Reply: AccountResponseType }>(
    '/me',
    {
      schema: {
        response: {
          200: AccountResponseSchema
        }
      }
    },
    async (request, reply) => {
      reply.send({
        data: await AccountController.getMe(request.account!.id),
        message: 'Lấy thông tin thành công'
      })
    }
  )

  fastify.put<{
    Reply: AccountResponseType
    Body: UpdateProfileBodyType
  }>(
    '/me',
    {
      schema: {
        response: {
          200: AccountResponseSchema
        }
      }
    },
    async (request, reply) => {
      const result = await AccountController.updateMe(request.account!.id, request.body)
      reply.send({
        data: result,
        message: 'Cập nhật thông tin thành công'
      })
    }
  )

  fastify.post<{ Rely: MessageResponseType; Body: ChangePasswordBodyType }>(
    '/change-password',
    {
      schema: {
        body: ChangePasswordBody,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      await AccountController.changePassword(request.account!.id, request.body.oldPassword, request.body.newPassword)
      reply.send({
        message: 'Đổi mật khẩu thành công'
      })
    }
  )

  fastify.put<{ Reply: MessageResponseType; Body: UpdateShippingAddressBodyType }>(
    '/shipping-address',
    {
      schema: {
        body: UpdateShippingAddressBody,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      const result = await AccountController.updateShippingAddress(request.account!.id, request.body)
      reply.send({
        message: 'Cập nhật địa chỉ giao hàng thành công'
      })
    }
  )

  fastify.post<{ Reply: MessageResponseType; Body: { productId: string } }>(
    '/favorite',
    {
      schema: {
        body: AddFavoriteProductBodySchema,
        response: {
          200: MessageResponseSchema
        }
      }
    },
    async (request, reply) => {
      await AccountController.addFavoriteProduct(request.account!.id, request.body.productId)
      reply.send({
        message: 'Thêm sản phẩm vào danh sách yêu thích thành công'
      })
    }
  )

  fastify.delete<{ Reply: MessageResponseType; Body: { productId: string } }>(
    '/favorite',
    {
      schema: {
        body: RemoveFavoriteProductBodySchema
      }
    },
    async (request, reply) => {
      await AccountController.removeFavoriteProduct(request.account!.id, request.body.productId)
      reply.send({
        message: 'Xóa sản phẩm khỏi danh sách yêu thích thành công'
      })
    }
  )
}
