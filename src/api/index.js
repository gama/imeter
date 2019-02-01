const Router     = require('koa-router')
const bodyParser = require('koa-body')
const chokidar   = require('chokidar')
const path       = require('path')

module.exports = {mount}

const isDev = process.env.NODE_ENV !== 'production'
let routes, allowedMethods

function mount(server, prefix = undefined) {
    const initialMount = (!routes && !allowedMethods)
    if (initialMount) {
        server.use(jsonErrors())
        server.use(bodyParser())
        if (isDev)
            setupWatcher(() => mount(server, prefix))
    }

    const router     = createRouter(prefix)
    routes           = useMiddleware(server, router.routes(), routes)
    allowedMethods   = useMiddleware(server, router.allowedMethods(), allowedMethods)

    if (isDev && !initialMount)
        server.recompose()
}

function createRouter(prefix) {
    const router = new Router({prefix: prefix})
    require('./auth').mount(router)
    require('./users').mount(router)
    return router
}

function useMiddleware(server, middleware, prevMiddleware) {
    if (prevMiddleware) {
        middleware._id = 'newmiddleware.' + (new Date()).toISOString()
        const index = server.middleware.indexOf(prevMiddleware)
        server.middleware[index] = middleware
    } else {
        server.use(middleware)
    }
    return middleware
}

function setupWatcher(remount) {
    // setup file watching + live reloading
    console.log('INFO: watching folder "%s"', path.resolve(__dirname))
    const watcher = chokidar.watch(path.resolve(__dirname), {useFsEvents: true, usePolling: false})
    watcher.on('change', (path) => {
        console.debug('on change')
        const invalidate = (id) => {
            console.debug('removing %s from require.cache', id)
            delete require.cache[id]
        }

        for (let module of Object.values(require.cache))
            for (let childModule of module.children)
                if (childModule.id === path)
                    invalidate(module.id)
        invalidate(path)

        remount()
    })
}

function jsonErrors() {
    return async (ctx, next) => {
        try {
            await next()
        } catch (err) {
            ctx.type = 'json'
            ctx.body = {error: err.toString()}
            ctx.app.emit('error', err, ctx)
        }
    }
}
