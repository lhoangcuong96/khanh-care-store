import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import z from 'zod'

// Set NODE_ENV if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

// Load base .env file
config({
  path: '.env'
})

// Load production env if NODE_ENV is production
if (process.env.NODE_ENV === 'production') {
  config({
    path: '.env.production',
    override: true // This will override values from .env with .env.production
  })
}

const checkEnv = async () => {
  const chalk = (await import('chalk')).default
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'

  if (!fs.existsSync(path.resolve(envFile))) {
    console.log(chalk.red(`Không tìm thấy file môi trường ${envFile}`))
    process.exit(1)
  }
}
checkEnv()

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  DOMAIN: z.string(),
  PROTOCOL: z.string(),
  UPLOAD_FOLDER: z.string(),
  COOKIE_MODE: z.enum(['true', 'false']).transform((val) => val === 'true'),
  IS_PRODUCTION: z.enum(['true', 'false']).transform((val) => val === 'true'),
  PRODUCTION_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string()
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}
const envConfig = configServer.data
export const API_URL = envConfig.IS_PRODUCTION
  ? envConfig.PRODUCTION_URL
  : `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export default envConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
