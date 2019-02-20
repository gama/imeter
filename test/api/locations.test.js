/** @jest-environment node */

const request          = require('supertest')
const db               = require('../../src/api/db')
const { loadFixtures } = require('../../data/seed.js')
const mocks            = require('./mocks')

const userNameFn = jest.fn(() => 'Emily')
const loginAs    = (name) => userNameFn.mockImplementationOnce(() => name)
mocks.authMiddleware(userNameFn)
mocks.config()

const app      = require('./server')
const server   = app.callback()


test('locations/index', async () => {
    const resp = await request(server).get('/api/locations')

    expect(resp.status).toEqual(200)
    expect(resp.body.locations).toHaveLength(6)
    expect(resp.body.locations.map((u) => u.name).sort()).toEqual([
        'Apartment 101', 'Apartment 102', 'Apartment 201', 'Apartment 202', 'Apartment 301', 'Apartment 302'
    ].sort())
})

test('locations/show', async () => {
    const resp = await request(server).get('/api/locations/35')

    expect(resp.status).toEqual(200)
    expect(resp.body.location).toBeTruthy()
    expect(resp.body.location.name).toEqual('Apartment 102')
})

test('locations/create', async () => {
    const attrs    = { 'name': 'Apartment 401', customerId: 10 }
    const expAttrs = { ...attrs, customerId: 11 }

    const resp = await request(server)
        .post('/api/locations')
        .send({location: attrs})

    expect(resp.status).toEqual(201)
    expect(resp.body.location).toBeTruthy()
    expect(resp.body.location).toEqual(expect.objectContaining(expAttrs))
    expect(await Locations.count({})).toEqual(11)
    expect(await Locations.findOne({name: 'Apartment 401'})).toEqual(expect.objectContaining(expAttrs))
})


test('locations/update', async () => {
    const attrs = { name: 'Edited Apartment' }
    const resp  = await request(server)
        .put('/api/locations/35')
        .send({location: attrs})


    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Locations.count({})).toEqual(10)
    expect(await Locations.findOne({name: 'Apartment 102'})).toBeUndefined()
    expect(await Locations.findOne({name: 'Edited Apartment'})).toEqual(expect.objectContaining(attrs))
})

test('locations/destroy', async () => {
    const resp = await request(server).delete('/api/locations/35')

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Locations.count({})).toEqual(9)
    expect(await Locations.findOne({name: 'Apartment 102'})).toBeUndefined()
})

test('location not-found errors', async () => {
    let resp = await request(server).get('/api/locations/999')
    expect(resp.status).toEqual(404)

    resp = await request(server).put('/api/locations/999')
    expect(resp.status).toEqual(404)

    resp = await request(server).delete('/api/locations/999')
    expect(resp.status).toEqual(404)
})

test('location not-scoped errors', async () => {
    let resp = await request(server).get('/api/locations/30')
    expect(resp.status).toEqual(404)

    resp = await request(server).put('/api/locations/30')
    expect(resp.status).toEqual(404)

    resp = await request(server).delete('/api/locations/30')
    expect(resp.status).toEqual(404)
})


test('invalid attributes errors', async () => {
    let resp = await request(server).post('/api/locations').send({invalid: true})
    expect(resp.status).toEqual(400)

    resp = await request(server).post('/api/locations').send({location: {invalid: true}})
    expect(resp.status).toEqual(400)

    resp = await request(server).put('/api/locations/35').send({invalid: true})
    expect(resp.status).toEqual(400)
})

describe('>> logged in as admin', () => {
    beforeEach(() => loginAs('Admin'))

    test('locations/index', async () => {
        const resp = await request(server).get('/api/locations')

        expect(resp.status).toEqual(200)
        expect(resp.body.locations).toHaveLength(10)
    })

    test('customers/:cid/locations/index', async () => {
        const resp = await request(server).get('/api/customers/10/locations')

        expect(resp.status).toEqual(200)
        expect(resp.body.locations).toHaveLength(4)
    })

    test('locations/create', async () => {
        const attrs = { 'name': 'Apartment 402', customerId: 13 }

        const resp = await request(server)
            .post('/api/locations')
            .send({location: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.location).toBeTruthy()
        expect(resp.body.location).toEqual(expect.objectContaining(attrs))
        expect(await Locations.count({})).toEqual(11)
        expect(await Locations.findOne({name: 'Apartment 402'})).toEqual(expect.objectContaining(attrs))
    })

    test('customers/:cid/locations/create', async () => {
        const attrs    = { 'name': 'Apartment 402' }
        const expAttrs = {...attrs, customerId: 12 }

        const resp = await request(server)
            .post('/api/customers/12/locations')
            .send({location: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.location).toBeTruthy()
        expect(resp.body.location).toEqual(expect.objectContaining(expAttrs))
        expect(await Locations.count({})).toEqual(11)
        expect(await Locations.findOne({name: 'Apartment 402'})).toEqual(expect.objectContaining(expAttrs))
    })
})

// ----- fixtures, helpers, setup & teardown ----
let Locations
beforeAll(async () => Locations = await db.getRepository('Location'))
afterAll(async  () => db.closeConnection())
afterEach(async () => {
    await Locations.clear()
    await loadFixtures('locations')
})
