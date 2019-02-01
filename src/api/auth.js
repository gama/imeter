const uuid        = require('uuid')
const { usersDb } = require('./db')

async function login(ctx) {
    const { username, password } = ctx.request.body
    const user = await usersDb.findOne({username})
    ctx.assert(user && user.password === password, 'invalid user or password', 401)
    user.token = uuid.v4()
    usersDb.update({ _id: user._id }, user)
    ctx.body = { user }
}

async function logout(ctx) {
    const token = ctx.request.headers['Authorization']
    ctx.assert(token, 'auth token required', 401)

    const user = await usersDb.findOne({token})
    ctx.assert(user, 'user not found', 404)

    delete user.token
    usersDb.update({ _id: user._id }, user)
    ctx.status = 204
    ctx.body = ''
}

function mount(router) {
    router.post   ('/auth', login)
    router.delete ('/auth', logout)
}

module.exports = { mount, login, logout }
