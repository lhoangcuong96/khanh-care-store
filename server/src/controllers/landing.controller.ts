import LandingService from '@/services/landing.service'

export default class LandingController {
  static async getLandingData(accountId?: string) {
    return LandingService.getLandingData(accountId)
  }
}
