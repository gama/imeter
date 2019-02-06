process.env.NODE_ENV = 'test'

const http = require('http')
const Koa  = require('../../src/lib/koa-recomposable')
const Api  = require('../../src/api')

const app = new Koa()
Api.mount(app, '/api')

const server = http.createServer(app.callback())
module.exports = server
