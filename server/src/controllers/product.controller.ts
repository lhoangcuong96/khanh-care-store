import { ProductListQueryType } from '@/schemaValidations/product.schema'
import { ProductService } from '@/services/product.service'

export default class ProductController {
  service: ProductService
  constructor() {
    this.service = new ProductService()
  }

  getProductList = (params: ProductListQueryType) => {
    // convert string "false" to boolean
    const newParams = JSON.parse(JSON.stringify(params))
    return this.service.list(newParams)
  }

  getProductDetail = (slug: string) => {
    return this.service.getDetailBySlug(slug)
  }
}
