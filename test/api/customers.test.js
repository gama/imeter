/** @jest-environment node */

const request             = require('supertest')
const db                  = require('../../src/api/db')
const { loadAllFixtures } = require('../../data/seed.js')
const mocks               = require('./mocks')
    
mocks.mock('config', 'authMiddleware')
const app    = require('./server')
const server = app.callback()

let Customers
beforeAll(async () => Customers = await db.getRepository('Customer'))
afterAll(async  () => db.closeConnection())
afterEach(async () => await loadAllFixtures())

test('customers/index', async () => {
    const resp = await request(server).get('/api/customers')

    expect(resp.status).toEqual(200)
    expect(resp.body.customers).toHaveLength(4)
    expect(resp.body.customers.map((u) => u.name).sort()).toEqual([
        'Alphaville',
        'Grand Olympus Village',
        'Mrs. Bayard Residence Service',
        'Park Royal Condo'
    ].sort())
})

test('customers/show', async () => {
    const attrs = { name:  'Park Royal Condo' }
    const resp  = await request(server).get('/api/customers/13')

    expect(resp.status).toEqual(200)
    expect(resp.body.customer).toBeTruthy()
    expect(resp.body.customer).toMatchObject(attrs)
})

test('customers/create', async () => {
    const attrs = { 'name': 'New Condo' }
    const resp  = await request(server)
        .post('/api/customers')
        .send({customer: attrs})

    expect(resp.status).toEqual(201)
    expect(resp.body.customer).toBeTruthy()
    expect(resp.body.customer).toMatchObject(attrs)
    expect(await Customers.count({})).toEqual(5)
    expect(await Customers.findOne({order: {id: 'DESC'}})).toMatchObject(attrs)
})

test('customers/update', async () => {
    const attrs = { name: 'Edited Condo' }
    const resp  = await request(server)
        .put('/api/customers/13')
        .send({customer: attrs})

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Customers.count({})).toEqual(4)
    expect(await Customers.findOne({name: 'Park Royal Condo'})).toBeUndefined()
    expect(await Customers.findOne(13)).toMatchObject(attrs)
})

test('customers/destroy', async () => {
    const resp = await request(server).delete('/api/customers/13')

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Customers.count({})).toEqual(3)
    expect(await Customers.findOne({name: 'Park Royal Condo'})).toBeUndefined()
})

test('customer not-found errors', async () => {
    let resp = await request(server).get('/api/customers/999')
    expect(resp.status).toEqual(404)

    resp = await request(server).put('/api/customers/999')
    expect(resp.status).toEqual(404)

    resp = await request(server).delete('/api/customers/999')
    expect(resp.status).toEqual(404)
})


test('invalid attributes errors', async () => {
    let resp = await request(server).post('/api/customers').send({invalid: true})
    expect(resp.status).toEqual(400)

    resp = await request(server).post('/api/customers').send({customer: {invalid: true}})
    expect(resp.status).toEqual(400)

    resp = await request(server).put('/api/customers/13').send({invalid: true})
    expect(resp.status).toEqual(400)
})

test.each([['customer', 'Emily'], ['operator', 'John']])('permission denied when logged in as %s', async (role, user) => {
    mocks.loginAs(user)
    const expect401 = (resp) => expect(resp.status).toEqual(401)

    expect401(await request(server).get('/api/customers'))
    expect401(await request(server).get('/api/customers/13'))
    expect401(await request(server).post('/api/customers').send({}))
    expect401(await request(server).put('/api/customers/13').send({}))
    expect401(await request(server).delete('/api/customers/13'))
})
