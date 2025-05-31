import prisma from '@/database'
import { CategoryService } from './category.service'
import { ProductService } from './product.service'
import { CategoryStatus } from '@prisma/client'
import { PublicNewsService } from './news.service'

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

    // Get list categories that their products will be shown on home page
    const getHomeCategoriesWithProducts = prisma.category.findMany({
      where: {
        status: CategoryStatus.ACTIVE,
        isShowOnHomePage: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        products: {
          where: {
            isPublished: true
          },
          select: {
            id: true,
            name: true,
            price: true,
            slug: true,
            description: true,
            title: true,
            stock: true,
            isBestSeller: true,
            isFeatured: true,
            isPromotion: true,
            promotionPercent: true,
            promotionStart: true,
            promotionEnd: true,
            image: true
          }
        }
      }
    })

    const getNews = new PublicNewsService().list({
      page: 1,
      limit: 10
    })

    const [
      featuredCategories,
      featuredProducts,
      promotionalProducts,
      bestSellerProducts,
      categoriesWithProducts,
      listNews
    ] = await Promise.all([
      getFeaturedCategories,
      getFeaturedProducts,
      getPromotionalProducts,
      getBestSellerProducts,
      getHomeCategoriesWithProducts,
      getNews
    ])
    return {
      featuredCategories: featuredCategories,
      featuredProducts: featuredProducts.data,
      promotionalProducts: promotionalProducts.data,
      bestSellerProducts: bestSellerProducts.data,
      categoriesWithProducts: categoriesWithProducts,
      listNews: listNews.data
    }
  }
}
