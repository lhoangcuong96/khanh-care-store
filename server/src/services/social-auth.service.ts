import prisma from '@/database'
import RedisPlugin from '@/provider/redis'
import { StatusError } from '@/utils/errors'
import { createPairTokens } from '@/utils/jwt'
import { Account, Session, SocialEnum } from '@prisma/client'
import {
  google, // The top level object used to access services
  drive_v3, // For every service client, there is an exported namespace
  Auth, // Namespace for auth related types
  Common // General types used throughout the library
} from 'googleapis'

export class SocialAuthServiceFactory {
  static registry: Record<string, any> = {}
  service
  constructor(type: SocialEnum) {
    const serviceType = SocialAuthServiceFactory.registry[type]
    if (!serviceType) {
      throw new Error('Invalid social type')
    }
    this.service = new serviceType()
  }

  static registerSocialType({ type, service }: { type: SocialEnum; service: any }) {
    SocialAuthServiceFactory.registry[type] = service
  }

  async authenticate(token: string): Promise<{ account: Account; session: Session }> {
    return this.service.authenticate(token)
  }
}

export abstract class SocialAuthService {
  async createSession(account: Account) {
    const { accessToken, refreshToken } = createPairTokens({
      account: {
        id: account.id,
        email: account.email,
        phoneNumber: account.phoneNumber,
        fullname: account.fullname,
        avatar: account.avatar
      }
    })

    const session = await prisma.session.create({
      data: {
        accountId: account.id,
        accessToken,
        refreshToken
      }
    })
    return session
  }

  async checkEmailExist(email: string): Promise<boolean> {
    // const emailExist = await bloomFilter.check({ filterName: 'email', value: email })
    const result = await RedisPlugin.checkEmailInBloomFilter(email)
    return result
  }

  async handleAccount({ email, fullname, avatar }: { email: string; fullname: string; avatar: string }) {
    const emailExist = await this.checkEmailExist(email)
    let account
    if (emailExist) {
      account = await prisma.account.findUniqueOrThrow({
        where: { email }
      })
    } else {
      account = await prisma.account.create({
        data: {
          email,
          fullname,
          avatar,
          cart: {
            items: [],
            updatedAt: new Date()
          },
          shippingAddress: {
            address: '',
            district: '',
            ward: '',
            province: ''
          },
          role: 'USER'
        }
      })
    }
    return account
  }

  async authenticate(token: string): Promise<{ account: Account; session: Session }> {
    throw new Error('Method not implemented')
  }
}

const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export class GoogleAuthService extends SocialAuthService {
  async authenticate(authorizationCode: string) {
    try {
      // First, exchange the authorization code for tokens
      const tokenResponse = await client.getToken(authorizationCode)

      const { id_token } = tokenResponse.tokens

      if (!id_token) {
        throw new StatusError({ message: 'No ID token received from Google', status: 400 })
      }

      // Now verify the ID token
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      })

      const payload = ticket.getPayload()
      const email = payload?.email
      const name = payload?.name
      const avatar = payload?.picture

      const account = await this.handleAccount({ email: email!, fullname: name!, avatar: avatar! })
      const session = await this.createSession(account)

      return {
        account,
        session
      }
    } catch (e) {
      console.error('Error during Google authentication:', e)
      throw new StatusError({ message: 'Có lỗi xảy ra', status: 500 })
    }
  }
}

export class FacebookAuthService extends SocialAuthService {
  async authenticate(token: string) {
    try {
      const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`, {
        method: 'GET'
      })
      if (!response.ok) {
        throw new StatusError({ message: 'Có lỗi xảy ra', status: 500 })
      }
      const userInfo = await response.json()
      const { id, name, email, picture } = userInfo
      const account = await this.handleAccount({ email, fullname: name, avatar: picture.data.url })
      const session = await this.createSession(account)
      return {
        account,
        session
      }
    } catch (e) {
      console.error('Error during Facebook token verification:', e)
      throw new StatusError({ message: 'Có lỗi xảy ra', status: 500 })
    }
  }
}
export class XAuthService extends SocialAuthService {}

SocialAuthServiceFactory.registerSocialType({ type: SocialEnum.GOOGLE, service: GoogleAuthService })
SocialAuthServiceFactory.registerSocialType({ type: SocialEnum.FACEBOOK, service: FacebookAuthService })
