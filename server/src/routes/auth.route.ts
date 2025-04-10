import envConfig from '@/config'
import { TokenType } from '@/constants/type'
import AuthController, { SocialAuthController } from '@/controllers/auth.controller'
import { requireLoggedHook } from '@/hooks/auth.hooks'
import {
  LoginBody,
  LoginBodyType,
  LoginRes,
  LoginResType,
  RefreshTokenBodyType,
  RefreshTokenRes,
  RegisterBody,
  RegisterBodyType,
  RegisterRes,
  RegisterResType,
  SocialAuthBody,
  SocialAuthBodyType,
  SocialAuthRes,
  SocialAuthResType
} from '@/schemaValidations/auth.schema'
import { MessageResponseSchema, MessageResponseType } from '@/schemaValidations/common.schema'
import { SocialEnum } from '@prisma/client'
import { addMilliseconds } from 'date-fns'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import ms from 'ms'

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const authController = new AuthController()
  fastify.post<{
    Reply: RegisterResType
    Body: RegisterBodyType
  }>(
    '/register',
    {
      schema: {
        response: {
          200: RegisterRes
        },
        body: RegisterBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const { session, account } = await authController.registerController(body)
      if (envConfig.COOKIE_MODE) {
        reply
          .setCookie(TokenType.AccessToken, session.accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: addMilliseconds(new Date(), ms(envConfig.ACCESS_TOKEN_EXPIRES_IN)),
            sameSite: 'none',
            domain: envConfig.DOMAIN
          })
          .setCookie(TokenType.RefreshToken, session.accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: addMilliseconds(new Date(), ms(envConfig.ACCESS_TOKEN_EXPIRES_IN)),
            sameSite: 'none',
            domain: envConfig.DOMAIN
          })
          .send({
            message: 'Đăng ký thành công',
            data: {
              accessToken: session.accessToken,
              refreshToken: session.refreshToken,
              account
            }
          })
      } else {
        reply.send({
          message: 'Đăng ký thành công',
          data: {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            account
          }
        })
      }
    }
  )
  fastify.post<{ Reply: MessageResponseType }>(
    '/logout',
    {
      schema: {
        response: {
          200: MessageResponseSchema
        }
      },
      preValidation: fastify.auth([requireLoggedHook])
    },
    async (request, reply) => {
      const accessToken = envConfig.COOKIE_MODE
        ? request.cookies.accessToken
        : request.headers.authorization?.split(' ')[1]
      const message = await authController.logoutController(accessToken as string)
      if (envConfig.COOKIE_MODE) {
        reply
          .clearCookie(TokenType.AccessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: true
          })
          .clearCookie(TokenType.RefreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: true
          })
          .send({
            message
          })
      } else {
        reply.send({
          message
        })
      }
    }
  )
  fastify.post<{ Reply: LoginResType; Body: LoginBodyType }>(
    '/login',
    {
      schema: {
        response: {
          200: LoginRes
        },
        body: LoginBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const { session, account } = await authController.loginController(body)
      if (envConfig.COOKIE_MODE) {
        reply
          .setCookie('accessToken', session.accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: addMilliseconds(new Date(), ms(envConfig.ACCESS_TOKEN_EXPIRES_IN)),
            sameSite: 'none',
            domain: envConfig.DOMAIN
          })
          .setCookie('accessToken', session.accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: addMilliseconds(new Date(), ms(envConfig.ACCESS_TOKEN_EXPIRES_IN)),
            sameSite: 'none',
            domain: envConfig.DOMAIN
          })
          .send({
            message: 'Đăng nhập thành công',
            data: {
              accessToken: session.accessToken,
              refreshToken: session.refreshToken,
              account
            }
          })
      } else {
        reply.send({
          message: 'Đăng nhập thành công',
          data: {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            account
          }
        })
      }
    }
  )

  fastify.post(
    '/refresh-token',
    {
      schema: {
        response: {
          200: RefreshTokenRes
        }
      },
      preValidation: fastify.auth([requireLoggedHook])
    },
    async (request, reply) => {
      const { refreshToken } = request.body as RefreshTokenBodyType
      const accessToken = request.headers.authorization!.split(' ')[1]
      const { session } = await authController.refreshTokenController(accessToken, refreshToken)
      reply.send({
        message: 'Đăng nhập thành công',
        data: {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken
        }
      })
    }
  )

  fastify.post<{
    Reply: SocialAuthResType
    Body: SocialAuthBodyType
  }>(
    '/google',
    {
      schema: {
        response: {
          200: SocialAuthRes
        },
        body: SocialAuthBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const controller = new SocialAuthController(SocialEnum.GOOGLE)
      const { account, session } = await controller.authenticate(body.token)
      reply.send({
        message: 'Đăng nhập thành công',
        data: {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          account
        }
      })
    }
  )

  fastify.post<{
    Reply: SocialAuthResType
    Body: SocialAuthBodyType
  }>(
    '/facebook',
    {
      schema: {
        response: {
          200: SocialAuthRes
        },
        body: SocialAuthBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const controller = new SocialAuthController(SocialEnum.FACEBOOK)
      const { account, session } = await controller.authenticate(body.token)
      reply.send({
        message: 'Đăng nhập thành công',
        data: {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          account
        }
      })
    }
  )
}
