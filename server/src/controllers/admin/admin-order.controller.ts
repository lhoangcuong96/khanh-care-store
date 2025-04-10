import { GetListOrdersQueryType, OrderInListDataType } from '@/schemaValidations/admin/admin-order-schema'
import AdminOrderService from '@/services/admin/admin-order.service'

export default class AdminOrderController {
  static async list(params: GetListOrdersQueryType): Promise<OrderInListDataType[]> {
    return AdminOrderService.getOrders(params)
  }
}
