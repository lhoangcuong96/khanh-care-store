import { TokenType } from '@/constants/type'

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]

interface AccountJwtPayload {
  id: string
  email: string
  role: string
  fullname: string
  avatar?: string | null
  phoneNumber?: string | null
}

export interface TokenPayload {
  account: AccountJwtPayload
  tokenType: TokenTypeValue
  exp: number
  iat: number
}
