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
      throw new Error('Không tìm thấy đơn hàng')
    }

    // Validation: Prevent status changes from CANCELED, RETURNED, REFUNDED, COMPLETED to active statuses
    const finalStatuses: OrderStatus[] = [
      OrderStatus.CANCELLED,
      OrderStatus.RETURNED,
      OrderStatus.REFUNDED,
      OrderStatus.COMPLETED
    ]
    const activeStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.FAILED
    ]

    // Allow changes between final statuses, but prevent changes from final statuses to active statuses
    if (finalStatuses.includes(order.status) && activeStatuses.includes(status)) {
      throw new Error(
        `Không thể thay đổi trạng thái từ ${order.status} sang ${status}. Đơn hàng đã ở trạng thái cuối cùng.`
      )
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
