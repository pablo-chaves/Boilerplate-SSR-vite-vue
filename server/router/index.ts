import Router from '@koa/router'
import defaultController from './defaultController'

const router = new Router()

// inject routes.
router.all('/api/(.*)', async (ctx, next) => {
  ctx.status = 201
  ctx.body = 'hello api'
  console.log(ctx)
  next()
})

router.get('/((?!api).*)', defaultController)

export default router