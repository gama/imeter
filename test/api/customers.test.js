/** @jest-environment node */

const request          = require('supertest')
const db               = require('../../src/api/db')
const { loadFixtures } = require('../../data/seed.js')

require('./mocks').mock('config', 'authMiddleware')
const app    = require('./server')
const server = app.callback()

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
    const customer = await Customers.findOne({name: 'Park Royal Condo'})
    const resp = await request(server).get('/api/customers/' + customer.id)

    expect(resp.status).toEqual(200)
    expect(resp.body.customer).toBeTruthy()
    expect(resp.body.customer.name).toEqual('Park Royal Condo')
})

test('customers/create', async () => {
    const attrs = { 'name': 'New Condo' }
    const resp  = await request(server)
        .post('/api/customers')
        .send({customer: attrs})

    expect(resp.status).toEqual(201)
    expect(resp.body.customer).toBeTruthy()
    expect(resp.body.customer).toEqual(expect.objectContaining(attrs))
    expect(await Customers.count({})).toEqual(5)
    expect(await Customers.findOne({name: 'New Condo'})).toEqual(expect.objectContaining(attrs))
})

test('customers/update', async () => {
    const attrs    = { name: 'Edited Condo' }
    const customer = await Customers.findOne({name: 'Park Royal Condo'})
    const resp     = await request(server)
        .put('/api/customers/' + customer.id)
        .send({customer: attrs})

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Customers.count({})).toEqual(4)
    expect(await Customers.findOne({name: 'Park Royal Condo'})).toBeUndefined()
    expect(await Customers.findOne({name: 'Edited Condo'})).toEqual(expect.objectContaining(attrs))
})

test('customers/destroy', async () => {
    const customer = await Customers.findOne({name: 'Park Royal Condo'})
    const resp = await request(server).delete('/api/customers/' + customer.id)

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

    const customer = await Customers.findOne({name: 'Park Royal Condo'})
    resp = await request(server).put('/api/customers/' + customer.id).send({invalid: true})
    expect(resp.status).toEqual(400)
})

// ----- fixtures, helpers, setup & teardown ----
let Customers
beforeAll(async () => Customers = await db.getRepository('Customer'))
afterAll(async  () => db.closeConnection())
afterEach(async () => {
    await Customers.clear()
    await loadFixtures('customers')
})
