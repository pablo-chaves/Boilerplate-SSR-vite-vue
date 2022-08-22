import * as fs from 'fs'
import * as path from 'path'
import Koa from 'koa'
import * as vite from 'vite'
import connect from 'koa-connect'
import createViteServer from './createViteServer'

import router from './router/index'

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
const distClient = path.join(process.cwd(), 'dist/app/client')

async function createServer(
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p: string) => path.resolve(__dirname, p)

  const app = new Koa()

  let viteServer: vite.ViteDevServer | null = null

  if (!isProd) {
    // cover express middleware to koa middleware
    viteServer = await createViteServer()

    // use vite's connect instance as middleware
    // use koa-connect covert express's middleware to koa's middleware
    app.use(connect(viteServer.middlewares))
  } else {
    app.use(
      require('koa-static')(resolve(distClient), {
        index: false,
      })
    )
  }

  app.use(router.routes())
  app.use(router.allowedMethods())

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) => {
    const port = Number(process.env.PORT || 3002)
    app.listen(port, () => {
      console.log(`server running port: ${port} ☕`)
    })
  })
}

exports.createServer = createServer
