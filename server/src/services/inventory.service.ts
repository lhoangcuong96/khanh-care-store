import prisma from '@/database'
import { CreateInventoryBodyType, UpdateInventoryBodyType } from '@/schemaValidations/inventory.schema'

export class InventoryService {
  static getInventory(id: string) {
    return prisma.inventory.findFirstOrThrow({
      where: {
        id
      }
    })
  }

  static createInventory(data: CreateInventoryBodyType) {
    return prisma.inventory.create({
      data
    })
  }

  static updateInventory(id: string, data: UpdateInventoryBodyType) {
    return prisma.inventory.update({
      where: {
        id
      },
      data: data
    })
  }
}
