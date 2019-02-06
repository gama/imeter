const fs          = require('fs')
const { resolve } = require('path')
const { sign }    = require('jsonwebtoken')
const request     = require('supertest')

require('./mocks').defaults()
const server      = require('./server')
const Users       = require('../../src/api/models/users')

test('login succeeds', async () => {
    const resp = await request(server).
        post('/api/auth').
        send({username: user.username, password: user.password})

    expect(resp.status).toEqual(200)
    expect(resp.body.token).toMatch(/.+/)
    expect((await Users.findOne({_id: user._id})).token).toMatch(/.+/)
})

test('login fails due to invalid password', async () => {
    const resp = await request(server).
        post('/api/auth').
        send({username: user.username, password: 'invalid'})

    expect(resp.status).toEqual(401)
    expect(resp.body.error).toEqual('UnauthorizedError: invalid user or password')
})

test('login fails due to invalid username', async () => {
    const resp = await request(server).
        post('/api/auth').
        send({username: 'invalid', password: user.password})

    expect(resp.status).toEqual(401)
    expect(resp.body.error).toEqual('UnauthorizedError: invalid user or password')
})

test('logout succeeds', async () => {
    Users.update(user, {$set: {token: 'rawToken'}})
    const signedToken = await signAsync('rawToken')
    const resp = await request(server).
        delete('/api/auth').
        set('Authorization', `Bearer ${signedToken}`)

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect((await Users.findOne({_id: user._id})).token).toBeUndefined()
})

test('logout fails due to authentication', async () => {
    Users.update(user, {$set: {token: 'rawToken'}})
    const resp = await request(server).
        delete('/api/auth').
        set('Authorization', 'Bearer invalid-token')

    expect(resp.status).toEqual(401)
    expect(resp.body).toEqual({error: 'UnauthorizedError: Authentication Error'})
})


// ----- fixtures, helpers, setup & teardown -----
const signAsync = (payload) => {
    const secret = fs.readFileSync(`${resolve(__dirname)}/../../data/.secret`)
    return new Promise((resolve, reject) => {
        sign(payload, secret, function (err, token) {
            return (err) ? reject(err) : resolve(token)
        })
    })
}

let user
beforeEach(async () => {
    user = await Users.findOne({username: 'johndoe'}, {})
})

afterEach(() => server.close())
