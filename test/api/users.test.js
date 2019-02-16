/** @jest-environment node */

const request          = require('supertest')
const db               = require('../../src/api/db')
const { loadFixtures } = require('../../data/seed.js')

require('./mocks').mock('config', 'authMiddleware')
const app    = require('./server')
const server = app.callback()

test('users/index', async () => {
    const expectedUsers = ['Admin', 'John', 'Ann', 'Mary', 'Peter', 'Emily'].sort()
    const resp = await request(server).get('/api/users')

    expect(resp.status).toEqual(200)
    expect(resp.body.users).toHaveLength(6)
    expect(resp.body.users.map((u) => u.firstName).sort()).toEqual(expectedUsers)
    expect(resp.body.users.every((u) => u.password === undefined)).toBe(true)
})

test('users/show', async () => {
    const user = await Users.findOne({firstName: 'Admin'})
    const resp = await request(server).get('/api/users/' + user.id)

    expect(resp.status).toEqual(200)
    expect(resp.body.user).toBeTruthy()
    expect(resp.body.user.firstName).toEqual('Admin')
    expect(resp.body.user.password).toBeUndefined()
})

test('users/create', async () => {
    const attrs = {
        'email':     'ljones@example.com',
        'password':  'lisa',
        'firstName': 'Lisa',
        'lastName':  'Jones',
        'role':      'customer'
    }
    const { password, ...expAttrs } = attrs  // eslint-disable-line no-unused-vars
    const resp = await request(server)
        .post('/api/users')
        .send({user: attrs})

    expect(resp.status).toEqual(201)
    expect(resp.body.user).toBeTruthy()
    expect(resp.body.user).toEqual(expect.objectContaining(expAttrs))
    expect(await Users.count({})).toEqual(7)
    expect(await Users.findOne({firstName: 'Lisa'}, {})).toEqual(expect.objectContaining(expAttrs))
})

test('users/update', async () => {
    const attrs = {
        'email':     'edited@example.com',
        'password':  'editedpass',
        'firstName': 'Edited',
        'lastName':  'User',
        'role':      'consumer'
    }

    const user = await Users.findOne({firstName: 'John'})
    const resp = await request(server)
        .put('/api/users/' + user.id)
        .send({user: attrs})

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Users.count({})).toEqual(6)
    expect(await Users.findOne({firstName: 'John'})).toBeUndefined()
    expect(await Users.findOne({firstName: 'Edited'})).toEqual(expect.objectContaining(attrs))
})

test('users/destroy', async () => {
    const user = await Users.findOne({firstName: 'John'})
    const resp = await request(server).delete('/api/users/' + user.id)

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Users.count({})).toEqual(5)
    expect(await Users.findOne({firstName: 'John'})).toBeUndefined()
})

test('user not-found errors', async () => {
    let resp = await request(server).get('/api/users/999')
    expect(resp.status).toEqual(404)

    resp = await request(server).put('/api/users/999')
    expect(resp.status).toEqual(404)

    resp = await request(server).delete('/api/users/999')
    expect(resp.status).toEqual(404)
})


test('invalid attributes errors', async () => {
    let resp = await request(server).post('/api/users').send({invalid: true})
    expect(resp.status).toEqual(400)

    resp = await request(server).post('/api/users').send({user: {invalid: true}})
    expect(resp.status).toEqual(400)

    const user = await Users.findOne({username: 'johndoe'})
    resp = await request(server).put('/api/users/' + user.id).send({invalid: true})
    expect(resp.status).toEqual(400)
})

// ----- fixtures, helpers, setup & teardown ----
let Users
beforeAll(async () => Users = await db.getRepository('User'))
afterAll(async  () => db.closeConnection())
afterEach(async () => {
    await Users.clear()
    await loadFixtures('users')
})
