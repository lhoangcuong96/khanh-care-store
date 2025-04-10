import { UpdateProfileBodyType, UpdateShippingAddressBodyType } from '@/schemaValidations/account.schema'
import { AccountService } from '@/services/account.service'

export class AccountController {
  static getMe = async (accountId: string) => {
    return AccountService.getMe(accountId)
  }

  static updateMe = async (accountId: string, body: UpdateProfileBodyType) => {
    return AccountService.updateMe(accountId, body)
  }

  static updateShippingAddress = async (accountId: string, body: UpdateShippingAddressBodyType) => {
    return AccountService.updateShippingAddress(accountId, body)
  }

  static changePassword = async (accountId: string, oldPassword: string, newPassword: string) => {
    return AccountService.changePassword(accountId, oldPassword, newPassword)
  }
}
