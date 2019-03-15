require('module-alias/register')      // TODO: replace with path logic in _app
require('@zeit/next-preact/alias')()
const Koa  = require('./lib/koa-recomposable')
const Ui   = require('./ui')
const Api  = require('./api')

const port = parseInt(process.env.PORT, 10) || 3000

;(async function () {
    const server = new Koa()
    await Api.mount(server, '/api')
    await Ui.mount(server)

    server.listen(port, () => {
        process.env.IVMETER_API_URL = `http://localhost:${port}`
        console.log(`> Ready on ${process.env.IVMETER_API_URL}`)
    })
})()
