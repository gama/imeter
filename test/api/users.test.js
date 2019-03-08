/** @jest-environment node */ 

const request             = require('supertest')
const db                  = require('../../src/api/db')
const { loadAllFixtures } = require('../data/seed')
const mocks               = require('./mocks')
    
mocks.mock('config', 'authMiddleware')
const app    = require('./server')
const server = app.callback()

let Users
beforeAll(async () => Users = await db.getRepository('User'))
afterAll(async  () => db.closeConnection())
afterEach(async () => await loadAllFixtures())


test('users/index', async () => {
    const expected = ['Admin', 'John', 'Ann', 'Mary', 'Peter', 'Emily'].sort()

    const resp = await request(server).get('/api/users')

    expect(resp.status).toEqual(200)
    expect(resp.body.users).toHaveLength(6)
    expect(resp.body.users.map((u) => u.firstName).sort()).toEqual(expected)
    expect(resp.body.users.every((u) => u.password === undefined)).toBe(true)
})

test('users/show', async () => {
    const attrs = {
        id:         25,
        email:      'emily@nowhere.org',
        firstName:  'Emily',
        lastName:   'Johnson',
        role:       'customer',
        customerId: 11
    }
    const resp = await request(server).get('/api/users/25')

    expect(resp.status).toEqual(200)
    expect(resp.body.user).toBeTruthy()
    expect(resp.body.user).toMatchObject(attrs)
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
    const { password, ...expected } = attrs  // eslint-disable-line no-unused-vars
    const resp = await request(server)
        .post('/api/users')
        .send({user: attrs})

    expect(resp.status).toEqual(201)
    expect(resp.body.user).toBeTruthy()
    expect(resp.body.user).toMatchObject(expected)
    expect(await Users.count({})).toEqual(7)
    expect(await Users.findOne({order: {id: 'DESC'}})).toMatchObject(expected)
})

test('users/update', async () => {
    const attrs = {
        'email':     'edited@example.com',
        'password':  'editedpass',
        'firstName': 'Edited',
        'lastName':  'User',
        'role':      'operator'
    }

    const resp = await request(server)
        .put('/api/users/25')
        .send({user: attrs})

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Users.count({})).toEqual(6)
    expect(await Users.findOne({firstName: 'Emily'})).toBeUndefined()
    expect(await Users.findOne(25)).toMatchObject(attrs)
})

test('users/destroy', async () => {
    const resp = await request(server).delete('/api/users/25')

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Users.count({})).toEqual(5)
    expect(await Users.findOne(25)).toBeUndefined()
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

    resp = await request(server).put('/api/users/25').send({invalid: true})
    expect(resp.status).toEqual(400)
})

test('permission denied when logged in as non-admin', async () => {
    mocks.loginAs('Emily')
    const expect401 = (resp) => expect(resp.status).toEqual(401)

    expect401(await request(server).get('/api/users'))
    expect401(await request(server).get('/api/users/24'))
    expect401(await request(server).post('/api/users').send({}))
    expect401(await request(server).put('/api/users/24').send({}))
    expect401(await request(server).delete('/api/users/24'))
})
