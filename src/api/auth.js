const fs                = require('fs')
const { resolve }       = require('path')
const jwt               = require('koa-jwt')
const verify            = require('koa-jwt/lib/verify')
const { getRepository } = require('typeorm')

module.exports = { verifyJwt, userAuth, isAdmin, decodeToken, getSecret }

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

// ----- helpers -----

async function decodeToken(token) {
    console.log('token: %s; secret: %s', token, getSecret())
    return await verify(token, getSecret())
}

function getSecret() {
    let secret
    if (process.env.NODE_ENV === 'production') {
        secret = process.env.NODE_JWT_SECRET
    } else {
        const secretPath = `${resolve(__dirname)}/../../.secret`
        secret           = fs.readFileSync(secretPath)
    }
    if (!secret)
        throw 'unable to verify JWT tokens (missing secret)'
    return secret
}
