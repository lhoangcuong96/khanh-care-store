import { LoginBodyType, RegisterBodyType } from '@/schemaValidations/auth.schema'
import AuthService from '@/services/auth.service'
import { SocialAuthServiceFactory } from '@/services/social-auth.service'
import { Account, Session, SocialEnum } from '@prisma/client'

export default class AuthController {
  authService: AuthService
  constructor() {
    this.authService = new AuthService()
  }
  registerController = async (body: RegisterBodyType) => {
    return this.authService.register(body)
  }
  logoutController = async (accessToken: string) => {
    return this.authService.logout(accessToken)
  }

  loginController = async (body: LoginBodyType) => {
    return this.authService.login(body)
  }

  refreshTokenController = async (accessToken: string, refreshToken: string) => {
    return this.authService.refreshToken(accessToken, refreshToken)
  }
}

export class SocialAuthController {
  service: SocialAuthServiceFactory
  constructor(type: SocialEnum) {
    this.service = new SocialAuthServiceFactory(type)
  }
  authenticate = async (
    token: string
  ): Promise<{
    account: Account
    session: Session
  }> => {
    return this.service.authenticate(token)
  }
}
