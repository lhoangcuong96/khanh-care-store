import { CartService } from '@/services/cart.service'

export class CartController {
  static async addProductToCart(productId: string, quantity: number, userId?: string) {
    return CartService.addProductToCart(productId, quantity, userId)
  }

  static async getCart(userId?: string) {
    return CartService.getCart(userId)
  }

  static async updateCartItemQuantity(productId: string, quantity: number, userId?: string) {
    return CartService.updateCartItemQuantity(productId, quantity, userId)
  }

  static async removeCartItem(id: string, userId?: string) {
    return CartService.removeProductFromCart(id, userId)
  }
}
