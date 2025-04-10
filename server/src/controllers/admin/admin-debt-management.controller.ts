import {
  AddTransactionBodyType,
  CreatePartnerType,
  GetListPartnerParamsType
} from '@/schemaValidations/admin/admin-debt-management-schema'
import AdminDebtManagementService from '@/services/admin/admin-debt-management.service'

class AdminDebtManagementController {
  static async createPartner(body: CreatePartnerType) {
    return AdminDebtManagementService.createPartner(body)
  }

  static async getListPartners(params: GetListPartnerParamsType) {
    return AdminDebtManagementService.getListPartners(params)
  }

  static async getListPartnerOptions() {
    return AdminDebtManagementService.getListPartnerOptions()
  }

  static async deletePartner(id: string) {
    return AdminDebtManagementService.deletePartner(id)
  }

  static async addTransaction(body: AddTransactionBodyType) {
    return AdminDebtManagementService.addTransaction(body)
  }
}

export default AdminDebtManagementController
