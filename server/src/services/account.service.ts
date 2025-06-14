import prisma from '@/database'
import RedisPlugin from '@/provider/redis'
import {
  AccountSchema,
  AccountType,
  ShippingAddressType,
  UpdateProfileBodyType,
  UpdateShippingAddressBodyType
} from '@/schemaValidations/account.schema'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { StatusError } from '@/utils/errors'
export class AccountService {
  static getMe = async (accountId: string) => {
    // const cachedAccount = await RedisPlugin.getAccountInfo(accountId)
    const cachedAccount = null
    let account: AccountType | null = null
    if (!cachedAccount) {
      account = await prisma.account.findUnique({
        where: { id: accountId },
        select: {
          id: true,
          email: true,
          fullname: true,
          avatar: true,
          role: true,
          phoneNumber: true,
          gender: true,
          dateOfBirth: true,
          address: true,
          shippingAddress: true
        }
      })
      if (account) {
        await RedisPlugin.cacheAccountInfo(account)
      }
    }
    if (!account && !cachedAccount) {
      throw new StatusError({
        message: 'Tài khoản không tồn tại',
        status: 404
      })
    }
    const data = account || cachedAccount
    return data!
  }

  static updateMe = async (accountId: string, body: UpdateProfileBodyType) => {
    const account = await prisma.account.update({
      where: {
        id: accountId
      },
      data: {
        ...body
      }
    })
    const updatedAccount = AccountSchema.parse(account)
    await RedisPlugin.cacheAccountInfo(updatedAccount)
    return updatedAccount
  }

  static updateShippingAddress = async (accountId: string, body: UpdateShippingAddressBodyType) => {
    const account = await prisma.account.update({
      where: {
        id: accountId
      },
      data: {
        shippingAddress: body
      }
    })
    const updatedAccount = AccountSchema.parse(account)
    await RedisPlugin.cacheAccountInfo(updatedAccount)
    return updatedAccount
  }

  static changePassword = async (accountId: string, oldPassword: string, newPassword: string) => {
    const account = await prisma.account.findUnique({ where: { id: accountId } })
    if (!account) {
      throw new StatusError({
        message: 'Tài khoản không tồn tại',
        status: 404
      })
    }
    const isPasswordMatch = await comparePassword(oldPassword, account.password!)
    if (!isPasswordMatch) {
      throw new StatusError({
        message: 'Mật khẩu cũ không đúng',
        status: 400
      })
    }
    const hashedPassword = await hashPassword(newPassword)
    return await prisma.account.update({
      where: {
        id: accountId
      },
      data: {
        password: hashedPassword
      }
    })
  }

  static addFavoriteProduct = async (accountId: string, productId: string) => {
    try {
      await prisma.account.update({
        where: { id: accountId },
        data: {
          favoriteProducts: { connect: { id: productId } }
        }
      })
    } catch (error) {
      throw new StatusError({
        message: 'Lỗi khi thêm sản phẩm vào danh sách yêu thích',
        status: 400
      })
    }
  }

  static removeFavoriteProduct = async (accountId: string, productId: string) => {
    try {
      await prisma.account.update({
        where: { id: accountId },
        data: {
          favoriteProducts: { disconnect: { id: productId } }
        }
      })
    } catch (error) {
      throw new StatusError({
        message: 'Lỗi khi xóa sản phẩm khỏi danh sách yêu thích',
        status: 400
      })
    }
  }
}
