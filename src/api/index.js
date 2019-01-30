const Router   = require('koa-router')
const chokidar = require('chokidar')
const path     = require('path')

module.exports = {mount}

const isProd = process.env.NODE_ENV === 'production'
let routes, allowedMethods

function mount(server, prefix = undefined) {
    const remounting = (routes || allowedMethods)
    const router     = createRouter(prefix)
    routes           = useMiddleware(server, router.routes(), routes)
    allowedMethods   = useMiddleware(server, router.allowedMethods(), allowedMethods)

    if (isProd)
        return

    if (remounting)
        server.recompose()
    else
        setupWatcher(() => mount(server, prefix))
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
        const invalidate = (id) => {
            // console.debug('removing %s from require.cache', id)
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
