const logger     = require('koa-logger')
const Router     = require('koa-router')
const bodyParser = require('koa-body')
const chokidar   = require('chokidar')
const path       = require('path')
const auth       = require('./auth')
const db         = require('./db')

module.exports = {mount, unmount}

const isDev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'
let routes, allowedMethods

async function mount(app, prefix = undefined) {
    const initialMount = (!routes && !allowedMethods)
    if (initialMount) {
        await db.ensureConnection()

        if (isDev)
            app.use(logger((str, args) => {
                if (!args[2].includes('/on-demand-entries-ping'))
                    console.log(...args)
            }))
        app.use(jsonErrors())
        app.use(bodyParser())
        app.use(auth.verifyJwt())
        app.use(auth.userAuth())
        if (isDev)
            setupWatcher(() => mount(app, prefix))
    }

    const router   = createRouter(prefix)
    routes         = useMiddleware(app, router.routes(), routes)
    allowedMethods = useMiddleware(app, router.allowedMethods(), allowedMethods)

    if (isDev && !initialMount)
        app.recompose()
}

async function unmount(/*app*/) {
    await db.closeConnection()
}

function createRouter(prefix) {
    const router = new Router({prefix: prefix})
    require('./controllers/auth').mount(router)
    require('./controllers/customers').mount(router)
    require('./controllers/users').mount(router)
    require('./controllers/locations').mount(router)
    require('./controllers/meters').mount(router)
    require('./controllers/measurements').mount(router)
    require('./controllers/version').mount(router)
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
            ctx.type   = 'json'
            ctx.status = err.status || 500
            ctx.body   = {error: err.toString()}
            ctx.app.emit('error', err, ctx)
        }
    }
}
