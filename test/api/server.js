process.env.NODE_ENV = 'test'

const Koa  = require('../../src/lib/koa-recomposable')
const Api  = require('../../src/api')

const app  = new Koa()
app.init   = async () => await Api.mount(app, '/api')
app.finish = async () => await Api.unmount(app)

module.exports = app
