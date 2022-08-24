import Router from '@koa/router'
import spaController from './defaultController'

const router = new Router()

// inject routes.
router.all('/api/(.*)', async (ctx, next) => {
  ctx.status = 201
  ctx.body = 'hello api :)'
  console.log(ctx)
  next()
})

router.get('/((?!api).*)', spaController)

export default router