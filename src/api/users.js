const Users = require('./models/users')

async function index(ctx) {
    const users = await Users.find({})
    ctx.body = {users}
}

async function show(ctx) {
    const user = await Users.findOne({_id: ctx.params.id})
    ctx.assert(user, 'user not found', 404)
    ctx.body = {user}
}

async function create(ctx) {
    const attrs = ctx.request.body
    ctx.assert(attrs && Users.validateAttrs(attrs.user), 'invalid user attributes', 400)

    const user = await Users.insert(attrs.user)
    ctx.assert(user, 'unable to create user', 500)

    ctx.status = 201
    ctx.body = {user}
}

async function update(ctx) {
    let user = await Users.findOne({_id: ctx.params.id})
    ctx.assert(user, 'user not found', 404)

    const attrs = ctx.request.body
    ctx.assert(attrs && Users.validateAttrs(attrs.user), 'invalid user attributes', 400)

    user = await Users.update(user, attrs.user)
    ctx.assert(user, 'unable to update user', 500)

    ctx.status = 204
    ctx.body = ''
}

async function destroy(ctx) {
    let user = await Users.findOne({_id: ctx.params.id})
    ctx.assert(user, 'user not found', 404)

    await Users.remove({_id: user._id})

    ctx.status = 204
    ctx.body = ''
}

function mount(router) {
    router.get    ('/users',     index)
    router.post   ('/users',     create)
    router.get    ('/users/:id', show)
    router.put    ('/users/:id', update)
    router.delete ('/users/:id', destroy)
}

module.exports = { mount, index, show, create, update, destroy }
