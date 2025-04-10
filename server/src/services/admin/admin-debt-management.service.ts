import prisma from '@/database'
import {
  AddTransactionBodyType,
  CreatePartnerType,
  GetListPartnerParamsType,
  PartnerInListOptionType
} from '@/schemaValidations/admin/admin-debt-management-schema'
import { Prisma, PartnerStatus, TransactionStatus } from '@prisma/client'

class AdminDebtManagementService {
  static async createPartner(body: CreatePartnerType) {
    const partner = prisma.partner.create({
      data: body
    })

    return partner
  }

  static async getListPartners({ page = 1, limit = 10, search = '' }: GetListPartnerParamsType) {
    const skip = (page - 1) * limit
    const take = limit

    const select: Prisma.PartnerSelect = {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
      type: true,
      status: true,
      notes: true,
      totalDebt: true,
      paidAmount: true,
      remainingDebt: true
    }

    const where: Prisma.PartnerWhereInput = {
      AND: [
        search
          ? {
              name: { contains: search, mode: 'insensitive' }
            }
          : {},
        {
          status: 'ACTIVE'
        }
      ]
    }

    const getPartnersQuery = prisma.partner.findMany({
      where: where,
      skip,
      take,
      select
    })
    const getTotalQuery = prisma.partner.count({
      where: where
    })

    const data = await Promise.all([getPartnersQuery, getTotalQuery])

    return {
      partners: data[0],
      page: page,
      limit: limit,
      total: data[1]
    }
  }

  static async getListPartnerOptions(): Promise<PartnerInListOptionType[]> {
    const partners = await prisma.partner.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        remainingDebt: true
      }
    })

    return partners
  }

  static async deletePartner(id: string) {
    const partner = await prisma.partner.update({
      where: {
        id: id
      },
      data: {
        status: PartnerStatus.DELETED
      }
    })

    return partner
  }

  static async addTransaction(transaction: AddTransactionBodyType) {
    let transactionAmount = 0
    const items = transaction.items?.map((item) => {
      transactionAmount += item.price * item.quantity
      return {
        ...item,
        total: item.price * item.quantity
      }
    })
    let paidAmount = 0
    if (transaction.status === TransactionStatus.PAID) {
      paidAmount = transactionAmount
    }
    if (transaction.status === TransactionStatus.PARTIAL) {
      paidAmount = transaction.paidAmount || 0
    }

    const debtChange = transactionAmount - paidAmount

    const updatePartnerPromise = prisma.partner.update({
      where: {
        id: transaction.partnerId
      },
      data: {
        remainingDebt: {
          increment: debtChange
        },
        paidAmount: {
          increment: paidAmount
        }
      }
    })

    const updateTransactionPromise = prisma.transaction.create({
      data: {
        ...transaction,
        transactionCode: `T${Date.now().toString().slice(-6)}`,
        items: items,
        amount: transactionAmount
      }
    })
    const [updatedPartner, createdTransaction] = await prisma.$transaction([
      updatePartnerPromise,
      updateTransactionPromise
    ])
    return createdTransaction
  }
}

export default AdminDebtManagementService
