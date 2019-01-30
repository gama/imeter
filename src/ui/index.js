const Router = require('koa-router')

module.exports = {mount}

function mount(server, handler) {
    const router = createRouter(handler)
    server.use(router.routes())
    server.use(router.allowedMethods())
}

function createRouter(handler) {
    const router = new Router()
    router.get('*', async (ctx) => {
        handler(ctx.req, ctx.res)
        ctx.respond = false
    })
    return router
}
