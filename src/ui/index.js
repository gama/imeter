// const routes = require('next-routes')
const Router = require('koa-router')

const next   = require('next')
const dev    = process.env.NODE_ENV !== 'production'
const dir    = './src/ui'
const app    = next({ dev, dir })

module.exports = { mount }

async function mount(server) {
    await app.prepare()
    const handler = app.getRequestHandler()
    const router  = createRouter(app, handler)
    // const handler = router.getRequestHandler(app)
    server.use(router.routes())
    server.use(router.allowedMethods())
    server.use(handler)
}

function createRouter(app, handler) {
    const render = (path, params = {}) => async (ctx) => app.render(ctx.req, ctx.res, path, {...ctx.params, ...params})

    return new Router().
        get('/users/new',         render('/users', {action: 'new'})).
        get('/users/:id',         render('/users')).
        get('/users/:id/:action', render('/users')).

        get('*', async (ctx) => {
            handler(ctx.req, ctx.res)
            ctx.respond = false
        })
}
