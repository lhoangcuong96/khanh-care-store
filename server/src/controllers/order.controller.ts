import { CreateOrderBodyType } from '@/schemaValidations/order.schema'
import OrderService from '@/services/order.service'

export default class OrderController {
  static createOrder = async (body: CreateOrderBodyType, accountId?: string) => {
    return OrderService.createOrderWithTransaction(body, accountId)
  }
  static getOrderDetails = async (orderCode: string, accountId?: string) => {
    return OrderService.getOrderDetails(orderCode, accountId)
  }

  static getOrders = async (accountId?: string) => {
    return OrderService.getOrders(accountId)
  }
}
