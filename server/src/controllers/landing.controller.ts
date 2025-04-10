import LandingService from '@/services/landing.service'

export default class LandingController {
  static async getLandingData() {
    return LandingService.getLandingData()
  }
}
