import prisma from '@/database'
import { CategoryService } from './category.service'
import { ProductService } from './product.service'

export default class LandingService {
  static async getLandingData() {
    const productService = new ProductService()

    const getFeaturedCategories = CategoryService.getFeaturedCategories()
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

    const [featuredCategories, featuredProducts, promotionalProducts, bestSellerProducts] = await Promise.all([
      getFeaturedCategories,
      getFeaturedProducts,
      getPromotionalProducts,
      getBestSellerProducts
    ])
    return {
      featuredCategories,
      featuredProducts,
      promotionalProducts,
      bestSellerProducts
    }
  }
}
