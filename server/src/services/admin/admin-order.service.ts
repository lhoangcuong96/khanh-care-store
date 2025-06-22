import prisma from '@/database'
import { GetListOrdersQueryType, OrderInListDataType } from '@/schemaValidations/admin/admin-order-schema'
import { Order } from '@/schemaValidations/common.schema'
import { OrderStatus, Prisma } from '@prisma/client'

export default class AdminOrderService {
  static async getOrders(params: GetListOrdersQueryType) {
    const page = params.page ? parseInt(params.page) : 1
    const limit = params.limit ? parseInt(params.limit) : 10
    const skip = (page - 1) * limit
    const where: Prisma.OrderWhereInput = {
      AND: [
        params.search
          ? {
              OR: [
                { orderCode: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
                {
                  account: {
                    OR: [
                      { fullname: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
                      { email: { contains: params.search, mode: Prisma.QueryMode.insensitive } }
                    ]
                  }
                }
              ]
            }
          : {},
        params.status ? { status: params.status as OrderStatus } : {}
      ]
    }
    let orderBy: { [x: string]: string } = {
      createdAt: 'desc'
    }
    if (params.sort) {
      orderBy = {
        [params.sort]: params.order === Order.Asc ? 'asc' : 'desc'
      }
    }
    const getOrdersPromise = prisma.order.findMany({
      where,
      take: limit,
      skip,
      orderBy,
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
            productVariant: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        },
        createdAt: true,
        deliveryInformation: {
          select: {
            recipientFullname: true,
            recipientPhoneNumber: true,
            recipientAddress: true,
            // shippingDate: true,
            shippingFee: true,
            // shippingPeriod: true,
            note: true
          }
        }
      }
    })
    const totalPromise = prisma.order.count({
      where
    })
    const [orders, total] = await Promise.all([getOrdersPromise, totalPromise])
    return {
      data: orders,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit
    }
  }

  static async changeStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    })
    if (!order) {
      throw new Error('Order not found')
    }
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      }
    })
    return updatedOrder
  }
}
