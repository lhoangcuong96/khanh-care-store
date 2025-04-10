import prisma from '@/database'
import { CreateOrderBodyType, OrderInListDataType, GetOrderDataType } from '@/schemaValidations/order.schema'
import { Order, Prisma } from '@prisma/client'
import { CartService } from './cart.service'

export default class OrderService {
  static async generateOrderCode(): Promise<string> {
    const orderCount = await prisma.order.count()
    return `ORDER-${orderCount + 1}`
  }

  static async createOrder(body: CreateOrderBodyType, accountId: string): Promise<Order> {
    const { items, deliveryInformation } = body

    // Check if the cart is empty
    const cart = await CartService.getCart(accountId)
    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng của bạn đang trống, vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng')
    }

    // Validate that the items in the request body match the items in the cart
    const cartItemIds = cart.items.map((item) => item.productId)
    const bodyItemIds = items.map((item) => item.productId)
    const isValid = bodyItemIds.every((id) => cartItemIds.includes(id))
    if (!isValid) {
      throw new Error('Các sản phẩm trong giỏ hàng không khớp với yêu cầu')
    }

    // Calculate total price
    const listProductIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: listProductIds
        }
      },
      select: {
        id: true,
        price: true,
        name: true,
        image: {
          select: {
            thumbnail: true
          }
        }
      }
    })
    const mapItemsWithPrice = items.map((item) => {
      const product = products.find((product) => product.id === item.productId)
      return {
        productId: item.productId,
        productPrice: product!.price || 0,
        productQuantity: item.quantity,
        productName: product!.name,
        productImage: product!.image.thumbnail
      }
    })
    const subtotal = mapItemsWithPrice.reduce((acc, item) => {
      return acc + item.productPrice! * item.productQuantity
    }, 0)

    const orderCode = await this.generateOrderCode()

    const data = {
      deliveryInformation: {
        recipientFullname: deliveryInformation.recipientFullname,
        recipientPhoneNumber: deliveryInformation.recipientPhoneNumber,
        recipientEmail: deliveryInformation.recipientEmail,
        recipientAddress: {
          address: deliveryInformation.recipientAddress.address,
          ward: deliveryInformation.recipientAddress.ward,
          district: deliveryInformation.recipientAddress.district,
          province: deliveryInformation.recipientAddress.province
        },
        shippingFee: 0,
        shippingDate: deliveryInformation.shippingDate,
        shippingPeriod: deliveryInformation.shippingPeriod,
        note: deliveryInformation.note
      },
      totalAmount: subtotal + deliveryInformation.shippingFee,
      subtotal,
      items: mapItemsWithPrice,
      account: {
        connect: {
          id: accountId
        }
      },
      orderCode
    }

    const order = await prisma.order.create({
      data
    })
    return order
  }

  static async createOrderWithTransaction(body: CreateOrderBodyType, accountId?: string): Promise<Order> {
    if (!accountId) {
      throw new Error('Thông tin tài khoản không hợp lệ')
    }
    const order = await prisma.$transaction(async (prisma) => {
      const data = await Promise.all([OrderService.createOrder(body, accountId), CartService.clearCart(accountId)])
      return data[0]
    })
    return order
  }

  static async getOrderDetails(orderCode: string, accountId?: string): Promise<GetOrderDataType | null> {
    if (!accountId) {
      throw new Error('Thông tin tài khoản không hợp lệ')
    }

    const order = await prisma.order.findFirst({
      where: {
        orderCode,
        accountId
      },
      select: {
        id: true,
        orderCode: true,
        totalAmount: true,
        status: true,
        subtotal: true,
        deliveryInformation: true,
        items: true
      }
    })
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng')
    }
    return order
  }

  static async getOrders(accountId?: string): Promise<OrderInListDataType[]> {
    if (!accountId) {
      throw new Error('Thông tin tài khoản không hợp lệ')
    }
    const orders = await prisma.order.findMany({
      where: {
        accountId
      },
      select: {
        id: true,
        orderCode: true,
        totalAmount: true,
        status: true,
        items: {
          select: {
            productId: true,
            productPrice: true,
            productQuantity: true,
            productName: true,
            productImage: true
          }
        },
        createdAt: true
      }
    })
    return orders
  }
}
