const Router                     = require('koa-router')
const { getRepository }          = require('typeorm')
const { isAdmin }                = require('../auth')
const { filter, sort, paginate } = require('../typeorm-utils')

module.exports = { mount, index, show, create, update, destroy }

function mount(parentRouter, prefix = '/users') {
    const router = new Router({ prefix })
    router.use(isAdmin())

    router.get    ('/',    index)
    router.post   ('/',    create)
    router.get    ('/:id', show)
    router.put    ('/:id', update)
    router.delete ('/:id', destroy)

    parentRouter.use(router.routes())
}

// ---------- endpoints ----------
async function index(ctx) {
    // await new Promise(resolve => setTimeout(resolve, 500))
    const attrs  = ['firstName', 'lastName']
    const params = Object.assign(filter(ctx, attrs), sort(ctx), paginate(ctx))
    const users  = await Users().find(params)
    ctx.body = {users: users.map(serialize)}
}


async function show(ctx) {
    // await new Promise(resolve => setTimeout(resolve, 350))
    const user = await Users().findOne(ctx.params.id)
    ctx.assert(user, 404, 'user not found')
    ctx.body = {user: serialize(user)}
}

async function create(ctx) {
    const attrs = ctx.request.body.user
    ctx.assert(Users().target.validate(attrs), 400, 'invalid user attributes')
    const user = await Users().save(Users().create(attrs))

    ctx.status = 201
    ctx.body   = {user: serialize(user)}
}

async function update(ctx) {
    let user = await Users().findOne(ctx.params.id)
    ctx.assert(user, 404, 'user not found')

    const attrs = {id: user.id, password: user.password, ...ctx.request.body.user}
    ctx.assert(Users().target.validate(attrs), 400, 'invalid user attributes')
    user = await Users().save(attrs)

    ctx.body = {user: serialize(user)}
}

async function destroy(ctx) {
    let user = await Users().findOne(ctx.params.id)
    ctx.assert(user, 404, 'user not found')

    await Users().delete(user.id)

    ctx.status = 204
    ctx.body   = null
}

// ---------- private functions and helpers ----------
function Users() {
    return getRepository('User')
}

function serialize(user) {
    const { password, ...attrs } = user  // eslint-disable-line no-unused-vars
    return attrs
}
