/** @jest-environment node */

const fs          = require('fs')
const { resolve } = require('path')
const { sign }    = require('jsonwebtoken')
const request     = require('supertest')
const db          = require('../../src/api/db')
const mocks       = require('./mocks')

mocks.mock('config')
const app    = require('./server')
const server = app.callback()

let user, Users
beforeAll(async  () => app.init())
afterAll(async   () => app.finish())
beforeAll(async  () => Users = await db.getRepository('User'))
beforeEach(async () => user = await Users.findOne({firstName: 'Admin'}, {}) )

test('login succeeds', async () => {
    expect((await protectedRequest(server, 'invalid-token')).status).toEqual(401)

    const { password, authToken, ...expected } = user
    const resp = await request(server).
        post('/api/auth').
        send({email: user.email, password: user.password})

    expect(resp.status).toEqual(200)
    expect(resp.body.user).toMatchObject(expected)
    expect(resp.body.user.authToken).toMatch(/.{32,}/)
    expect((await Users.findOne(user.id)).authToken).toMatch(/.{32,}/)
    expect((await protectedRequest(server, resp.body.user.authToken)).status).toEqual(200)
})

test('login fails due to invalid password', async () => {
    const resp = await request(server).
        post('/api/auth').
        send({email: user.email, password: 'invalid'})

    expect(resp.status).toEqual(401)
    expect(resp.body.error).toEqual('UnauthorizedError: invalid user or password')
})

test('login fails due to invalid email', async () => {
    const resp = await request(server).
        post('/api/auth').
        send({email: 'invalid', password: user.password})

    expect(resp.status).toEqual(401)
    expect(resp.body.error).toEqual('UnauthorizedError: invalid user or password')
})

test('logout succeeds', async () => {
    await Users.update(user.id, {authToken: 'rawToken'})
    const token = await signAsync('rawToken')
    expect((await protectedRequest(server, token)).status).toEqual(200)

    const resp = await request(server).
        delete('/api/auth').
        set('Authorization', `Bearer ${token}`)

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect((await Users.findOne(user.id)).authToken).toBeNull()
    expect((await protectedRequest(server, token)).status).toEqual(401)
})

test('logout fails due to authentication', async () => {
    await Users.update(user.id, {authToken: 'rawToken'})
    const resp = await request(server).
        delete('/api/auth').
        set('Authorization', 'Bearer invalid-token')

    expect(resp.status).toEqual(401)
    expect(resp.body).toEqual({error: 'UnauthorizedError: Authentication Error'})
})

test('current user succeeds', async () => {
    const user = await Users.findOne({firstName: 'Emily'})
    await Users.update(user.id, {authToken: 'emily-token'})
    const token = await signAsync('emily-token')
    const { password, authToken, ...attrs } = user

    const resp = await request(server).
        get('/api/auth').
        set('Authorization', `Bearer ${token}`)

    expect(resp.status).toEqual(200)
    expect(resp.body.user).toBeTruthy()
    expect(resp.body.user).toEqual(attrs)
    expect(resp.body.user.password).toBeUndefined()
    expect(resp.body.user.authToken).toBeUndefined()
})

test('current user fails due to authentication', async () => {
    await signAsync('emily-token')

    const resp = await request(server).
        get('/api/auth').
        set('Authorization', 'Bearer invalid-token')

    expect(resp.status).toEqual(401)
    expect(resp.body).toEqual({error: 'UnauthorizedError: Authentication Error'})
})

// ----- helpers -----
const signAsync = (payload) => {
    const secret = fs.readFileSync(`${resolve(__dirname)}/../../.secret`)
    return new Promise((resolve, reject) => {
        sign(payload, secret, function (err, token) {
            return (err) ? reject(err) : resolve(token)
        })
    })
}

const protectedRequest = async (server, token) => {
    return await request(server).get('/api/users').set('Authorization', `Bearer ${token}`)
}
