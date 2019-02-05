const uuid        = require('uuid')
const fs          = require('fs')
const { resolve } = require('path')
const { sign }    = require('jsonwebtoken')
const jwt         = require('koa-jwt')
const UsersDb     = require('./models/user')

module.exports = { mount, login, logout, verifyJwt, userAuth }

const NO_AUTH_ENDPOINTS = [
    ['POST', /^\/api\/auth/],    // login
    ['POST', /^\/api\/version/]  // version/heartbeat
]

// ----- koa middleware -----
function verifyJwt() {
    return jwt({
        secret: getSecret(),
        key:    'jwt'
    }).unless((ctx) => {
        return NO_AUTH_ENDPOINTS.some(([method, path]) => {
            return method === ctx.req.method && path.test(ctx.req.url)
        })
    })
}

function userAuth() {
    return async (ctx, next) => {
        if (ctx.state.jwt) {
            ctx.state.user = await UsersDb.findOne({token: ctx.state.jwt})
            ctx.assert(ctx.state.user, `user bearing token "${ctx.state.jwt}" not found`, 404)
        }
        // console.log('CTX.STATE: %o', ctx.state)
        return next()
    }
}


// ----- routes -----
function mount(router) {
    router.post   ('/auth', login)
    router.delete ('/auth', logout)
}


// ----- endpoints -----
async function login(ctx) {
    const { username, password } = ctx.request.body
    const user = await UsersDb.findOne({username})
    ctx.assert(user && user.password === password, 'invalid user or password', 401)

    const { rawToken, signedToken } = await generateToken()
    user.token = rawToken
    UsersDb.save(user)

    ctx.body = { token: signedToken }
    console.log(`AUTH | user ${user.username} logged in`)
}

async function logout(ctx) {
    delete ctx.state.user.token
    UsersDb.save(ctx.state.user)

    ctx.status = 204
    ctx.body = ''
    console.log(`AUTH | user ${ctx.state.user.username} logged out`)
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

function getSecret() {
    let secret
    if (process.env.NODE_ENV === 'production') {
        secret = process.env.NODE_JWT_SECRET
    } else {
        const secretPath = `${resolve(__dirname)}/../../data/.secret`
        secret           = fs.readFileSync(secretPath)
    }
    if (!secret)
        throw 'unable to verify JWT tokens (missing secret)'
    return secret
}
