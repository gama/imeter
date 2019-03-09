const uuid              = require('uuid')
const { sign }          = require('jsonwebtoken')
const { getRepository } = require('typeorm')
const { getSecret }     = require('../auth')

module.exports = { mount, login, logout, generateToken }

function mount(router) {
    router.get    ('/auth', current)
    router.post   ('/auth', login)
    router.delete ('/auth', logout)
}

async function current(ctx) {
    const { password, authToken, ...attrs } = ctx.state.user
    ctx.body = { user: attrs }
}

async function login(ctx) {
    const Users = getRepository('User')

    const { email, password } = ctx.request.body
    ctx.assert(email && password, 400, 'required params missing (email & password)')

    const user = await Users.findOne({email}, {})
    ctx.assert(user && user.password === password, 401, 'invalid user or password')

    const { rawToken, signedToken } = await generateToken()
    await Users.update(user, {authToken: rawToken})

    ctx.body = { user: serializeUser(user, signedToken) }

    console.log(`AUTH | user ${user.email} logged in`)
}

async function logout(ctx) {
    const Users = getRepository('User')

    await Users.update(ctx.state.user, {authToken: null})

    ctx.status = 204
    ctx.body = ''
    console.log(`AUTH | user ${ctx.state.user.email} logged out`)
}


// ----- private helpers -----
async function generateToken() {
    const rawToken    = uuid.v4()
    const secret      = await getSecret()
    const signedToken = await signAsync(rawToken, secret)
    return { rawToken, signedToken }
}

function signAsync(payload, secret) {
    return new Promise((resolve, reject) => {
        sign(payload, secret, function (err, token) {
            return (err) ? reject(err) : resolve(token)
        })
    })
}

function serializeUser(dbUser, signedToken) {
    const { password, ...user } = { ...dbUser, authToken: signedToken }
    return user
}
