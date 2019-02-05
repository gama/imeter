const UsersDb = require('./models/user')

async function index(ctx) {
    const users = await UsersDb.find({})
    console.log('users: ', users)
    ctx.body = {'users': users}
}

async function show(ctx) {
    const user = await UsersDb.findOne({_id: ctx.params.id})
    ctx.assert(user, 'user not found', 404)
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
