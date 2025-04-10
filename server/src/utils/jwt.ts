import envConfig from '@/config'
import { TokenPayload } from '@/types/jwt.types'
import { Account } from '@prisma/client'
import { createSigner, createVerifier } from 'fast-jwt'
import ms from 'ms'

const verify = createVerifier({
  key: envConfig.TOKEN_SECRET
})

const accessTokenSigner = createSigner({
  key: envConfig.TOKEN_SECRET,
  algorithm: 'HS256',
  expiresIn: ms(envConfig.ACCESS_TOKEN_EXPIRES_IN)
})

const refreshTokenSigner = createSigner({
  key: envConfig.TOKEN_SECRET,
  algorithm: 'HS256',
  expiresIn: ms(envConfig.REFRESH_TOKEN_EXPIRES_IN)
})

export const createPairTokens = (payload: { account: Partial<Account> }) => {
  const accessToken = accessTokenSigner(payload)
  const refreshToken = refreshTokenSigner(payload)
  return { accessToken, refreshToken }
}

export const verifyToken = (token: string) => verify(token)
