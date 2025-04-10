import { CreateCategoryBodyType } from '@/schemaValidations/admin/admin-category-schema'
import AdminCategoryService from '@/services/admin/admin-category.service'

export default class AdminCategoryController {
  static async create(data: CreateCategoryBodyType) {
    return AdminCategoryService.create(data)
  }

  static async delete(ids: string[]) {
    return AdminCategoryService.delete(ids)
  }

  static async list() {
    return AdminCategoryService.list()
  }
}
