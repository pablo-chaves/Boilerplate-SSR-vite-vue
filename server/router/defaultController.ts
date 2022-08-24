import * as path from 'path'
import * as vite from 'vite'
import * as fs from 'fs'
import createViteServer from '../createViteServer'


const distClient = path.join(process.cwd(), 'dist/app/client')
const distServer = path.join(process.cwd(), 'dist/app/server')

const isProd = process.env.NODE_ENV === 'production'
const resolve = (p: string) => path.resolve(__dirname, p)

const indexProd = isProd
    ? fs.readFileSync(resolve(path.join(distClient, 'index.html')), 'utf-8')
    : ''
  const manifest = isProd ? require(`${distClient}/ssr-manifest.json`) : {}

const spaController = async (ctx: any, next: any) => {
  let viteServer: vite.ViteDevServer | null = null
  try {
    const url = ctx.originalUrl
    const root = process.cwd()
    viteServer = await createViteServer()
    let template, render
    if (!isProd) {
      // always read fresh template in dev
      template = fs.readFileSync(
        resolve(path.join(root, 'index.html')),
        'utf-8'
      )

      template = await (viteServer as vite.ViteDevServer).transformIndexHtml(
        url,
        template
      )

      render = (
        await (viteServer as vite.ViteDevServer).ssrLoadModule(
          path.join(root, 'ssr', 'server.ts')
        )
      ).render
    } else {
      template = indexProd
      render = require(`${distServer}/server.js`).render
    }

    const [appHtml, preloadLinks] = await render(url, manifest, process.cwd())
    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml)

    ctx.status = 200
    ctx.res.setHeader('Content-Type', 'text/html')

    ctx.body = html
  } catch (e) {
    viteServer && viteServer.ssrFixStacktrace(e as Error)
    // console.log(e.stack)
    ctx.status = 500
    ctx.body = (e as Error).stack
  } finally {
    next()
  }
}

export default spaController