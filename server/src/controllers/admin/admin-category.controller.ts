import {
  AdminCategoryInListType,
  AdminCreateCategoryBodyType,
  AdminUpdateCategoryBodyType
} from '@/schemaValidations/admin/admin-category-schema'
import AdminCategoryService from '@/services/admin/admin-category.service'

export default class AdminCategoryController {
  static async create(data: AdminCreateCategoryBodyType) {
    return AdminCategoryService.create(data)
  }

  static async update(id: string, data: AdminUpdateCategoryBodyType) {
    return AdminCategoryService.update(id, data)
  }

  static async delete(ids: string[]) {
    return AdminCategoryService.delete(ids)
  }

  static async list(): Promise<AdminCategoryInListType[]> {
    return AdminCategoryService.list()
  }

  static async getCategoryAttributes(id: string) {
    return AdminCategoryService.getCategoryAttributes(id)
  }

  static async getCategoryById(id: string) {
    return AdminCategoryService.getCategoryById(id)
  }
}
