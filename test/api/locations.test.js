/** @jest-environment node */

const request             = require('supertest')
const db                  = require('../../src/api/db')
const { loadAllFixtures } = require('../data/seed')
const mocks               = require('./mocks')
const { loginAs }         = mocks

mocks.mock('authMiddleware', 'config')
const app    = require('./server')
const server = app.callback()

describe('logged in as customer', () => {
    beforeAll(() => loginAs('Emily'))

    test('locations/index as customer', async () => {
        const resp = await request(server).get('/api/locations')

        expect(resp.status).toEqual(200)
        expect(resp.body.locations).toHaveLength(6)
        expect(resp.body.locations.map((u) => u.name).sort()).toEqual([
            'Apartment 101', 'Apartment 102', 'Apartment 201', 'Apartment 202', 'Apartment 301', 'Apartment 302'
        ].sort())
    })

    test('locations/show as customer', async () => {
        const attrs = { name: 'Apartment 102' }
        const resp  = await request(server).get('/api/locations/35')

        expect(resp.status).toEqual(200)
        expect(resp.body.location).toBeTruthy()
        expect(resp.body.location).toMatchObject(attrs)
    })

    test('locations/create as customer', async () => {
        const attrs    = { 'name': 'Apartment 401', customerId: 10 }
        const expected = { ...attrs, customerId: 11 }

        const resp = await request(server)
            .post('/api/locations')
            .send({location: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.location).toBeTruthy()
        expect(resp.body.location).toMatchObject(expected)
        expect(await Locations.count({})).toEqual(11)
        expect(await Locations.findOne({order: {id: 'DESC'}})).toMatchObject(expected)
    })

    test('locations/update as customer', async () => {
        const attrs = { name: 'Edited Apartment' }
        const resp  = await request(server)
            .put('/api/locations/35')
            .send({location: attrs})

        expect(resp.status).toEqual(204)
        expect(resp.body).toEqual({})
        expect(await Locations.count({})).toEqual(10)
        expect(await Locations.findOne({name: 'Apartment 102'})).toBeUndefined()
        expect(await Locations.findOne(35)).toMatchObject(attrs)
    })

    test('locations/destroy as customer', async () => {
        const resp = await request(server).delete('/api/locations/35')

        expect(resp.status).toEqual(204)
        expect(resp.body).toEqual({})
        expect(await Locations.count({})).toEqual(9)
        expect(await Locations.findOne(35)).toBeUndefined()
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
})

describe('logged in as admin', () => {
    // beforeEach(() => mocks.loginAs('Admin'))
    beforeAll(() => loginAs('Admin'))

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
        expect(resp.body.location).toMatchObject(attrs)
        expect(await Locations.count({})).toEqual(11)
        expect(await Locations.findOne({order: {id: 'DESC'}})).toMatchObject(attrs)
    })

    test('customers/:cid/locations/create', async () => {
        const attrs    = { name: 'Apartment 402' }
        const expected = {...attrs, customerId: 12 }

        const resp = await request(server)
            .post('/api/customers/12/locations')
            .send({location: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.location).toBeTruthy()
        expect(resp.body.location).toMatchObject(expected)
        expect(await Locations.count({})).toEqual(11)
        expect(await Locations.findOne({order: {id: 'DESC'}})).toMatchObject(expected)
    })
})

// ----- fixtures, helpers, setup & teardown ----
let Locations
beforeAll(async () => Locations = await db.getRepository('Location'))
afterAll(async  () => db.closeConnection())
afterEach(async () => {
    // await (await db.getRepository('Measurement')).clear()
    // await (await db.getRepository('Meter')).clear()
    // await (await db.getRepository('Location')).clear()
    // await (await db.getRepository('User')).clear()
    // await (await db.getRepository('Customer')).clear()
    // await loadFixtures('locations')
    // await loadFixtures('meters')
    await loadAllFixtures()
})
