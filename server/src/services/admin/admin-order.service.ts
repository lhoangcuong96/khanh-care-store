import prisma from '@/database'
import { GetListOrdersQueryType, OrderInListDataType } from '@/schemaValidations/admin/admin-order-schema'
import { Order } from '@/schemaValidations/common.schema'
import { OrderStatus } from '@prisma/client'

export default class AdminOrderService {
  static async getOrders(params: GetListOrdersQueryType): Promise<OrderInListDataType[]> {
    const page = params.page ? parseInt(params.page) : 1
    const limit = params.limit ? parseInt(params.limit) : 10
    const skip = (page - 1) * limit
    const where = {
      status: params.status ? (params.status as OrderStatus) : undefined,
      orderCode: params.search ? { contains: params.search } : undefined
    }
    let orderBy: { [x: string]: string } = {
      createdAt: 'desc'
    }
    if (params.sort) {
      orderBy = {
        [params.sort]: params.order === Order.Asc ? 'asc' : 'desc'
      }
    }
    const orders = await prisma.order.findMany({
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
            productImage: true
          }
        },
        createdAt: true,
        deliveryInformation: {
          select: {
            recipientFullname: true,
            recipientPhoneNumber: true,
            recipientAddress: true,
            shippingDate: true,
            shippingFee: true,
            shippingPeriod: true,
            note: true
          }
        }
      }
    })
    return orders
  }
}
