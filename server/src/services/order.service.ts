import prisma from '@/database'
import { CreateOrderBodyType, OrderInListDataType, GetOrderDataType } from '@/schemaValidations/order.schema'
import { Order, OrderStatus, Prisma, PrismaClient } from '@prisma/client'
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
    const cartItemIds = cart.items.map((item) => item.product?.id)
    const bodyItemIds = items.map((item) => item.productId)
    const isValid = bodyItemIds.every((id) => cartItemIds.includes(id))
    if (!isValid) {
      throw new Error('Các sản phẩm trong giỏ hàng không khớp với yêu cầu')
    }

    // Calculate total price
    const listProductIds = items.map((item) => item.productId)
    const listVariantIds = items.map((item) => item.variantId).filter((id) => !!id) as string[]
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
        stock: true,
        image: {
          select: {
            thumbnail: true
          }
        },
        variants: {
          select: {
            id: true,
            price: true,
            name: true
          },
          where: {
            id: {
              in: listVariantIds
            }
          }
        }
      }
    })
    const outOfStockProducts = products.filter((product) => product.stock === 0)

    if (outOfStockProducts.length > 0) {
      throw new Error('Các sản phẩm đã hết hàng: ' + outOfStockProducts.map((product) => product.name).join(', '))
    }

    const mapItemsWithPrice = items.map((item) => {
      const product = products.find((product) => product.id === item.productId)
      const variant = product?.variants.find((variant) => variant.id === item.variantId)
      console.log(variant, product?.variants, item)
      return {
        productId: item.productId,
        productPrice: variant?.price || product!.price || 0,
        productQuantity: item.quantity,
        productName: product!.name,
        productImage: product!.image.thumbnail,
        productVariant: {
          id: variant?.id,
          name: variant?.name,
          price: variant?.price
        }
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
        // shippingDate: deliveryInformation.shippingDate,
        // shippingPeriod: deliveryInformation.shippingPeriod,
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
      orderCode,
      status: OrderStatus.PENDING
    }

    try {
      const order = await prisma.order.create({
        data
      })
      return order
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Đơn hàng đã tồn tại')
        }
      }
      console.log(error)
      throw new Error('Lỗi khi tạo đơn hàng')
    }
  }

  static async updateProduct(prisma: PrismaClient, productId: string, variantId: string | null, quantity: number) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    })
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm')
    }
    let variant
    let stock = product.stock
    if (variantId) {
      variant = await prisma.productVariant.findUnique({
        where: {
          id: variantId
        }
      })
      if (!variant) {
        throw new Error('Không tìm thấy biến thể sản phẩm')
      }
      stock = variant.stock
    }

    const newStock = stock - quantity

    if (newStock < 0) {
      throw new Error('Sản phẩm đã hết hàng')
    }
    if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock }
      })
    } else {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock, sold: { increment: quantity } }
      })
    }
  }

  static async createOrderWithTransaction(body: CreateOrderBodyType, accountId?: string): Promise<Order> {
    if (!accountId) {
      throw new Error('Thông tin tài khoản không hợp lệ')
    }
    const order = await prisma.$transaction(async (prisma) => {
      const order = await this.createOrder(body, accountId)
      await CartService.clearCart(accountId)
      for (const item of order.items) {
        await this.updateProduct(
          prisma as PrismaClient,
          item.productId,
          item.productVariant?.id || null,
          item.productQuantity
        )
      }
      return order
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
            productImage: true,
            productVariant: true
          }
        },
        createdAt: true
      }
    })
    return orders
  }

  static async cancelOrder(orderCode: string, accountId?: string): Promise<Order> {
    if (!accountId) {
      throw new Error('Thông tin tài khoản không hợp lệ')
    }
    const orderToCancel = await prisma.order.findFirst({
      where: { orderCode, accountId }
    })
    if (!orderToCancel) {
      throw new Error('Không tìm thấy đơn hàng')
    }
    if (orderToCancel.status !== OrderStatus.PENDING) {
      throw new Error('Đơn hàng không thể hủy')
    }
    const order = await prisma.order.update({
      where: { id: orderToCancel.id, accountId },
      data: { status: OrderStatus.CANCELLED }
    })
    return orderToCancel
  }
}
