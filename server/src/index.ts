// Import the framework and instantiate it
import envConfig, { API_URL } from '@/config'
import { errorHandlerPlugin } from '@/plugins/errorHandler.plugins'
import validatorCompilerPlugin from '@/plugins/validatorCompiler.plugins'
import accountRoutes from '@/routes/account.route'
import authRoutes from '@/routes/auth.route'
import mediaRoutes from '@/routes/media.route'
import productRoutes from '@/routes/product.route'
import staticRoutes from '@/routes/static.route'
import testRoutes from '@/routes/test.route'
import { createFolder } from '@/utils/helpers'
import fastifyAuth from '@fastify/auth'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import RateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import path from 'path'
import adminRoutes from './routes/admin'
import { CartRoutes } from './routes/cart.route'
import { CategoryRoutes } from './routes/category.routes'
import OrderRoutes from './routes/order.route'
import StorageRoutes from './routes/storage.route'
import ProductRoutes from '@/routes/product.route'
import LandingRoutes from './routes/landing.route'

const fastify = Fastify({
  logger: true
})

// Run the server!
const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER))

    // Giới hạn số lượng requests của 1 IP
    fastify.register(RateLimit, {
      max: 100,
      timeWindow: '1 minute',
      allowList: ['127.0.0.1', 'localhost'],
      errorResponseBuilder(req, context) {
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: 'Quá nhiều requests từ IP này, vui lòng thử lại sau 1 phút',
          date: new Date().toISOString(),
          expires: context.ttl
        }
      }
    })

    const whitelist = ['*']
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true // Cho phép trình duyệt gửi cookie đến server
    })

    fastify.register(fastifyAuth, {
      defaultRelation: 'and'
    })
    fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
    fastify.register(fastifyCookie)
    fastify.register(validatorCompilerPlugin)
    fastify.register(errorHandlerPlugin)
    fastify.register(authRoutes, {
      prefix: '/auth'
    })
    fastify.register(accountRoutes, {
      prefix: '/account'
    })
    fastify.register(mediaRoutes, {
      prefix: '/media'
    })
    fastify.register(staticRoutes, {
      prefix: '/static'
    })
    fastify.register(ProductRoutes, {
      prefix: '/products'
    })
    fastify.register(CartRoutes, {
      prefix: '/cart'
    })
    fastify.register(OrderRoutes, {
      prefix: '/order'
    })
    fastify.register(CategoryRoutes, {
      prefix: '/category'
    })
    fastify.register(adminRoutes, {
      prefix: '/admin'
    })
    fastify.register(LandingRoutes, {
      prefix: '/landing'
    }),
      fastify.register(StorageRoutes, {
        prefix: '/storage'
      })

    fastify.register(testRoutes, {
      prefix: '/test'
    })

    fastify.register(fastifyStatic, {
      root: path.resolve('public')
    })
    fastify.get('/', (request, reply) => {
      reply.sendFile('index.html') // Serve index.html from the public directory
    })
    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.IS_PRODUCTION ? '0.0.0.0' : 'localhost'
    })
    console.log(`Server đang chạy dưới local tại: ${API_URL}`)
    if (envConfig.IS_PRODUCTION) {
      console.log(`Đang ở mode production với domain: ${envConfig.PRODUCTION_URL}`)
    } else {
      console.log(`Server đang chạy dưới local tại: ${API_URL}`)
    }
  } catch (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
