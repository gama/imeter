const uuid              = require('uuid')
const fs                = require('fs')
const { resolve }       = require('path')
const { sign }          = require('jsonwebtoken')
const jwt               = require('koa-jwt')
const { getRepository } = require('typeorm')

module.exports = { mount, login, logout, verifyJwt, userAuth, isAdmin, generateToken }

const PUBLIC_ENDPOINTS = [
    ['POST', /^\/api\/auth/],     // login
    ['GET',  /^\/api\/version/],  // version/heartbeat
    ['GET',  /^\/(?!api\/)/]      // non-api requests
]

// ----- koa middleware -----
function verifyJwt() {
    const isPublic = (ctx) => {
        return PUBLIC_ENDPOINTS.some(([method, path]) => {
            return method === ctx.req.method && path.test(ctx.req.url)
        })
    }
    return jwt({secret: getSecret(), key: 'jwt', cookie: 'authToken'}).unless(isPublic)
}

function userAuth() {
    return async (ctx, next) => {
        console.log('********************* USERAUTH **************')
        if (ctx.state.jwt) {
            const Users = getRepository('User')
            ctx.state.user = await Users.findOne({ authToken: ctx.state.jwt })
            ctx.assert(ctx.state.user, 401, 'invalid or expired auth token')
        }
        await next()
    }
}

function isAdmin() {
    return async (ctx, next) => {
        ctx.assert(ctx.state.user.role === 'admin', 401, 'permission denied')
        return await next()
    }
}

// ----- routes -----
function mount(router) {
    router.post   ('/auth', login)
    router.delete ('/auth', logout)
}


// ----- endpoints -----
async function login(ctx) {
    const Users = getRepository('User')

    const { email, password } = ctx.request.body
    ctx.assert(email && password, 400, 'required params missing (email & password)')

    const user = await Users.findOne({email}, {})
    ctx.assert(user && user.password === password, 401, 'invalid user or password')

    const { rawToken, signedToken } = await generateToken()
    await Users.update(user, {authToken: rawToken})

    ctx.body = { token: signedToken }
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
