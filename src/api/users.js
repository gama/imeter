const _     = require('lodash')
const USERS = require('./db/users')

async function index(ctx) {
    ctx.body = {'users': USERS}
}

async function show(ctx) {
    const user = _.find(USERS, {id: ctx.query.id})
    if (!user)
        throw 404
    ctx.body = user
}

async function create(ctx) {
    ctx.status = 201
    ctx.body = {}
}

async function update(ctx) {
    ctx.status = 204
    ctx.body = ''
}

async function destroy(ctx) {
    ctx.status = 204
    ctx.body = ''
}

function mount(router) {
    router.get    ('/users',     index)
    router.get    ('/users/:id', show)
    router.post   ('/users/:id', create)
    router.put    ('/users/:id', update)
    router.delete ('/users/:id', destroy)
}

module.exports = { mount, index, show, create, update, destroy }
