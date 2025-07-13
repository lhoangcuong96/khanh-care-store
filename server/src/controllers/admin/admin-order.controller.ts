import {
  GetListOrdersQueryType,
  OrderInListDataType,
  UpdateOrderStatusBodyType,
  UpdateOrderStatusParamsType
} from '@/schemaValidations/admin/admin-order-schema'
import AdminOrderService from '@/services/admin/admin-order.service'
import { OrderStatus } from '@prisma/client'

export default class AdminOrderController {
  static async list(params: GetListOrdersQueryType) {
    return AdminOrderService.getOrders(params)
  }

  static async updateStatus(params: UpdateOrderStatusParamsType, body: UpdateOrderStatusBodyType) {
    return AdminOrderService.changeStatus(params.orderId, body.status as OrderStatus)
  }
}
