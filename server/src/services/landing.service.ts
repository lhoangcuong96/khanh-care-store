import prisma from '@/database'
import { CategoryService } from './category.service'
import { ProductService } from './product.service'

export default class LandingService {
  static async getLandingData() {
    const productService = new ProductService()
    const getFeaturedProducts = productService.list({
      page: 1,
      limit: 8,
      isFeatured: true
    })

    const getPromotionalProducts = productService.list({
      page: 1,
      limit: 8,
      isPromotion: true
    })

    const getBestSellerProducts = productService.list({
      page: 1,
      limit: 8,
      isBestSeller: true
    })

    const [featuredProducts, promotionalProducts, bestSellerProducts] = await Promise.all([
      getFeaturedProducts,
      getPromotionalProducts,
      getBestSellerProducts
    ])
    return {
      featuredProducts,
      promotionalProducts,
      bestSellerProducts
    }
  }
}
