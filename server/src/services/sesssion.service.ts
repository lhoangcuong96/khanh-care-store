import prisma from '@/database'
import { Session } from 'inspector'

export default class SessionService {
  static checkSessionExist({ token }: { token: string }) {
    return prisma.session.findFirst({
      where: {
        accessToken: token
      },
      select: {
        id: true
      }
    })
  }
}
