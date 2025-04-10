import envConfig from '@/config'
import { AccountType } from '@/schemaValidations/account.schema'
import { Account } from '@prisma/client'
import Redis from 'ioredis'

const redisClient = new Redis(envConfig.REDIS_URL)

async function setupBloomFilter() {
  try {
    // Check if filter exists (by trying BF.EXISTS)
    const exists = await redisClient.call('BF.EXISTS', 'emails', 'test@example.com').catch(() => null)
    // If the Bloom filter doesn't exist, create it
    if (exists === null) {
      console.log('Creating Bloom filter: emails, phone')
      await redisClient.call('BF.RESERVE', 'emails', 0.01, 10000) // 1% false positive rate, 10k capacity
      await redisClient.call('BF.ADD', 'email', 'test@example.com')

      await redisClient.call('BF.RESERVE', 'phone', 0.01, 10000)
    } else {
      console.log('Bloom filter already exists')
    }
  } catch (err) {
    console.error('Error initializing Bloom filter:', err)
  }
}

async function addEmailToBloomFilter(email: string) {
  await redisClient.call('BF.ADD', 'emails', email)
}

async function checkEmailInBloomFilter(email: string) {
  const isExist: boolean = (await redisClient.call('BF.EXISTS', 'emails', email)) as boolean
  return isExist
}

async function addPhoneNumberToBloomFilter(email: string) {
  await redisClient.call('BF.ADD', 'emails', email)
}

async function checkPhoneNumberInBloomFilter(email: string) {
  const isExist: boolean = (await redisClient.call('BF.EXISTS', 'emails', email)) as boolean
  return isExist
}

async function cacheAccountInfo(user: AccountType) {
  if (!user.id) {
    throw new Error('User id is required')
  }
  await redisClient.set(`user:${user.id}`, JSON.stringify(user))
}

async function getAccountInfo(userId: string): Promise<AccountType | null> {
  const user = await redisClient.get(`user:${userId}`)
  return user ? JSON.parse(user) : null
}

async function invalidateAccountInfo(userId: string) {
  await redisClient.del(`user:${userId}`)
}

// Initialize Bloom filter on startup
setupBloomFilter()

const RedisPlugin = {
  redisClient,
  addEmailToBloomFilter,
  checkEmailInBloomFilter,
  addPhoneNumberToBloomFilter,
  checkPhoneNumberInBloomFilter,
  cacheAccountInfo,
  getAccountInfo,
  invalidateAccountInfo
}

export default RedisPlugin
