require('@zeit/next-preact/alias')()
const Koa = require('./koa-recomposable')
const Ui  = require('./ui')
const Api = require('./api')

const port   = parseInt(process.env.PORT, 10) || 3000
const next   = require('next')
const dev    = process.env.NODE_ENV !== 'production'
const dir    = './src/ui'
const app    = next({ dev, dir })
const handle = app.getRequestHandler()

;(async function () {
    await app.prepare()

    const server = new Koa()
    Api.mount(server, '/api')
    Ui.mount(server, handle)

    server.on('error', console.error)
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})()
