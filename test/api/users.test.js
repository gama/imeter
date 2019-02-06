const request = require('supertest')

require('./mocks').mock('config', 'baseModel', 'authMiddleware')
const server = require('./server')
const Users  = require('../../src/api/models/users')

test('users/index', async () => {
    const resp = await request(server).get('/api/users')

    expect(resp.status).toEqual(200)
    expect(resp.body.users).toHaveLength(2)
    expect(resp.body.users.map((u) => u.username).sort()).toEqual(['admin', 'johndoe'])
    expect(resp.body.users.every((u) => u.password === undefined)).toBe(true)
})

test('users/show', async () => {
    const user = await Users.findOne({username: 'admin'})
    const resp = await request(server).get('/api/users/' + user._id)

    expect(resp.status).toEqual(200)
    expect(resp.body.user).toBeTruthy()
    expect(resp.body.user.username).toEqual('admin')
})

test('users/create', async () => {
    const attrs = {
        'username':    'maryann',
        'password':    'mypass',
        'firstName':   'Mary',
        'lastName':    'Ann',
        'dateOfBirth': '2000-10-10',
        'admin':       false
    }
    const resp = await request(server)
        .post('/api/users')
        .send({user: attrs})

    expect(resp.status).toEqual(201)
    expect(resp.body.user).toBeTruthy()
    expect(resp.body.user).toEqual(expect.objectContaining(attrs))

    expect(await Users.count({})).toEqual(3)
    expect(await Users.findOne({username: 'maryann'}, {})).toEqual(expect.objectContaining(attrs))
})

test('users/update', async () => {
    const attrs = {
        'username':    'newuser',
        'password':    'newpass',
        'firstName':   'New',
        'lastName':    'User',
        'dateOfBirth': '2011-11-11',
        'admin':       true
    }

    const user = await Users.findOne({username: 'johndoe'})
    const resp = await request(server)
        .put('/api/users/' + user._id)
        .send({user: attrs})

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})

    expect(await Users.count({})).toEqual(2)
    expect(await Users.findOne({username: 'johndoe'})).toEqual(null)
    expect(await Users.findOne({username: 'newuser'}, {})).toEqual(expect.objectContaining(attrs))
})

test('users/destroy', async () => {
    const user = await Users.findOne({username: 'johndoe'})
    const resp = await request(server).delete('/api/users/' + user._id)

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Users.count({})).toEqual(1)
    expect(await Users.findOne({username: 'johndoe'})).toEqual(null)
})

test('user not-found errors', async () => {
    let resp = await request(server).get('/api/users/invalid')
    expect(resp.status).toEqual(404)

    resp = await request(server).put('/api/users/invalid')
    expect(resp.status).toEqual(404)

    resp = await request(server).delete('/api/users/invalid')
    expect(resp.status).toEqual(404)
})


test('invalid attributes errors', async () => {
    let resp = await request(server).post('/api/users').send({invalid: true})
    expect(resp.status).toEqual(400)

    const user = await Users.findOne({username: 'johndoe'})
    resp = await request(server).put('/api/users/' + user._id).send({invalid: true})
    expect(resp.status).toEqual(400)
})

// ----- fixtures, helpers, setup & teardown -----
beforeEach(() => Users.reset())
afterEach(() => server.close())
