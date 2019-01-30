const _     = require('lodash')
const uuid  = require('uuid')
const USERS = require('./db/users')

async function login(ctx) {
    const { username, password } = ctx.query
    const user = _.find(USERS, { username })
    if (!user || user.password !== password)
        throw new Error('Invalid user or password')
    user.token = uuid.v4()
    ctx.body = { user }
}

async function logout(ctx) {
    ctx.status = 204
    ctx.body = ''
}

function mount(router) {
    router.get    ('/auth', login)
    router.delete ('/auth', logout)
}

module.exports = { mount, login, logout }
