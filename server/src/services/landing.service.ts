import prisma from '@/database'
import { CategoryStatus } from '@prisma/client'
import { CategoryService } from './category.service'
import { PublicNewsService } from './news.service'
import { ProductService } from './product.service'

export default class LandingService {
  static async getLandingData(accountId?: string) {
    const productService = new ProductService()
    let favoriteProducts: string[] = []
    if (accountId) {
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: {
          favoriteProducts: {
            select: { id: true }
          }
        }
      })
      console.log(account)
      if (account) {
        favoriteProducts = account.favoriteProducts.map((product) => product.id)
        console.log(favoriteProducts)
      }
    }

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
    const featuredProductsWithFavorite = featuredProducts.data.map((product) => ({
      ...product,
      isFavorite: favoriteProducts.includes(product.id)
    }))
    const promotionalProductsWithFavorite = promotionalProducts.data.map((product) => ({
      ...product,
      isFavorite: favoriteProducts.includes(product.id)
    }))
    const bestSellerProductsWithFavorite = bestSellerProducts.data.map((product) => ({
      ...product,
      isFavorite: favoriteProducts.includes(product.id)
    }))
    const categoriesWithProductsWithFavorite = categoriesWithProducts.map((category) => ({
      ...category,
      products: category.products.map((product) => ({
        ...product,
        isFavorite: favoriteProducts.includes(product.id)
      }))
    }))

    return {
      featuredCategories: featuredCategories,
      featuredProducts: featuredProductsWithFavorite,
      promotionalProducts: promotionalProductsWithFavorite,
      bestSellerProducts: bestSellerProductsWithFavorite,
      categoriesWithProducts: categoriesWithProductsWithFavorite,
      listNews: listNews.data
    }
  }
}
