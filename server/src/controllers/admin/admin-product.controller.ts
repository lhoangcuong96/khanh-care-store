import {
  CreateProductBodyType,
  ProductListQueryType,
  ProductType,
  UpdateProductBodyType
} from '@/schemaValidations/admin/admin-product-schema'
import { AdminProductService } from '@/services/admin/admin-product.service'

export default class AdminProductController {
  service: AdminProductService
  constructor() {
    this.service = new AdminProductService()
  }

  getProductList = (params: ProductListQueryType) => {
    return this.service.list(params)
  }

  getProductDetail = (slug: string) => {
    return this.service.getDetailBySlug(slug)
  }

  createProduct = (data: CreateProductBodyType): Promise<void> => {
    return this.service.create(data)
  }
  updateProduct = async (id: string, data: UpdateProductBodyType) => {
    try {
      const updatedProduct = await this.service.update(id, data)
      return updatedProduct
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update product: ${error.message}`)
      }
      throw new Error('Failed to update product')
    }
  }

  deleteProduct = (id: string) => {
    return this.service.delete([id])
  }

  bulkDeleteProduct = (ids: string[]) => {
    return this.service.delete(ids)
  }

  publishProduct = (id: string) => {
    return this.service.publish(id)
  }

  unpublishProduct = (id: string) => {
    return this.service.unpublish(id)
  }
}
