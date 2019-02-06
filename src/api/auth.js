const uuid        = require('uuid')
const fs          = require('fs')
const { resolve } = require('path')
const { sign }    = require('jsonwebtoken')
const jwt         = require('koa-jwt')
const Users       = require('./models/users')

module.exports = { mount, login, logout, verifyJwt, userAuth, generateToken }

const PUBLIC_ENDPOINTS = [
    ['POST', /^\/api\/auth/],    // login
    ['POST', /^\/api\/version/]  // version/heartbeat
]

// ----- koa middleware -----
function verifyJwt() {
    const isPublic = (ctx) => {
        return PUBLIC_ENDPOINTS.some(([method, path]) => {
            return method === ctx.req.method && path.test(ctx.req.url)
        })
    }
    return jwt({secret: getSecret(), key: 'jwt'}).unless(isPublic)
}

function userAuth() {
    return async (ctx, next) => {
        if (ctx.state.jwt) {
            ctx.state.user = await Users.findOne({token: ctx.state.jwt})
            ctx.assert(ctx.state.user, `user bearing token "${ctx.state.jwt}" not found`, 404)
        }
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
    ctx.assert(username && password, 'required params missing (username & password)', 400)

    const user = await Users.findOne({username}, {})
    ctx.assert(user && user.password === password, 'invalid user or password', 401)

    const { rawToken, signedToken } = await generateToken()
    user.token = rawToken
    Users.save(user)

    ctx.body = { token: signedToken }
    console.log(`AUTH | user ${user.username} logged in`)
}

async function logout(ctx) {
    delete ctx.state.user.token
    Users.save(ctx.state.user)

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
