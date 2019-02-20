/** @jest-environment node */

const request             = require('supertest')
const db                  = require('../../src/api/db')
const { loadAllFixtures } = require('../../data/seed.js')
const mocks               = require('./mocks')
const { loginAs }         = mocks

mocks.mock('config', 'authMiddleware')
const app    = require('./server')
const server = app.callback()

let Meters
beforeAll(async () => Meters = await db.getRepository('Meter'))
afterAll(async  () => db.closeConnection())
afterEach(async () => await loadAllFixtures())


describe('logged in as customer', () => {
    beforeAll(() => loginAs('Emily'))

    test('meters/index as customer', async () => {
        const expected = ['000008', '000009', '000010', '000011', '000012', '000013', '000014', '000015', '000016']

        const resp = await request(server).get('/api/meters')

        expect(resp.status).toEqual(200)
        expect(resp.body.meters.map((u) => u.serialNumber).sort()).toEqual(expected)
    })

    test('locations/:lid/meters/index as customer', async () => {
        const expected = ['000010', '000011']
        const resp = await request(server).get('/api/locations/35/meters')

        expect(resp.status).toEqual(200)
        expect(resp.body.meters.map((u) => u.serialNumber).sort()).toEqual(expected)
    })

    test('meters/show as customer', async () => {
        const attrs = { serialNumber: '000010', kind: 'water', model: 'M1' }
        const resp  = await request(server).get('/api/meters/49')

        expect(resp.status).toEqual(200)
        expect(resp.body.meter).toMatchObject(attrs)
    })

    test('meters/create as customer', async () => {
        const attrs = { serialNumber: '000050', kind: 'gas', model: 'M4', locationId: 39 }
        const resp  = await request(server)
            .post('/api/meters')
            .send({meter: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.meter).toMatchObject(attrs)
        expect(await Meters.count({})).toEqual(17)
        expect(await Meters.findOne({order: {id: 'DESC'}})).toMatchObject(attrs)
    })

    test('meters/update as customer', async () => {
        const attrs = { serialNumber: '000051', kind: 'gas', model: 'M5', locationId: 10 }
        const expected = {...attrs, locationId: 35}

        const resp  = await request(server)
            .put('/api/meters/49')
            .send({meter: attrs})

        expect(resp.status).toEqual(204)
        expect(resp.body).toEqual({})
        expect(await Meters.count({})).toEqual(16)
        expect(await Meters.findOne({serialNumber: '000010'})).toBeUndefined()
        expect(await Meters.findOne(49)).toMatchObject(expected)
    })

    test('meters/destroy as customer', async () => {
        const resp = await request(server).delete('/api/meters/49')

        expect(resp.status).toEqual(204)
        expect(resp.body).toEqual({})
        expect(await Meters.count({})).toEqual(15)
        expect(await Meters.findOne(49)).toBeUndefined()
    })

    test('meter not-found errors', async () => {
        let resp = await request(server).get('/api/meters/999')
        expect(resp.status).toEqual(404)

        resp = await request(server).put('/api/meters/999')
        expect(resp.status).toEqual(404)

        resp = await request(server).delete('/api/meters/999')
        expect(resp.status).toEqual(404)
    })

    test('meter not-scoped errors', async () => {
        let resp = await request(server).get('/api/meters/40')
        expect(resp.status).toEqual(404)

        resp = await request(server).put('/api/meters/40')
        expect(resp.status).toEqual(404)

        resp = await request(server).delete('/api/meters/40')
        expect(resp.status).toEqual(404)
    })

    test('invalid attributes errors', async () => {
        let resp = await request(server).post('/api/meters').send({invalid: true})
        expect(resp.status).toEqual(400)

        resp = await request(server).post('/api/meters').send({meter: {invalid: true}})
        expect(resp.status).toEqual(400)

        resp = await request(server).put('/api/meters/49').send({invalid: true})
        expect(resp.status).toEqual(400)
    })
})

describe('logged in as admin', () => {
    beforeEach(() => loginAs('Admin'))

    test('meters/index as admin', async () => {
        const resp = await request(server).get('/api/meters')

        expect(resp.status).toEqual(200)
        expect(resp.body.meters).toHaveLength(16)
    })

    test('locations/:lid/meters/index', async () => {
        const resp = await request(server).get('/api/locations/35/meters')

        expect(resp.status).toEqual(200)
        expect(resp.body.meters).toHaveLength(2)
    })

    test('meters/create', async () => {
        const attrs = { serialNumber: '000052', kind: 'gas', model: 'M6', locationId: 39 }
        const resp  = await request(server).post('/api/meters').send({meter: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.meter).toMatchObject(attrs)
        expect(await Meters.count({})).toEqual(17)
        expect(await Meters.findOne({serialNumber: '000052'})).toMatchObject(attrs)
    })

    test('locations/:lid/meters/create', async () => {
        const attrs = { serialNumber: '000053', kind: 'gas', model: 'M7', locationId: 99 }
        const resp  = await request(server)
            .post('/api/locations/39/meters')
            .send({meter: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.meter).toMatchObject({...attrs, locationId: 39})
        expect(await Meters.count({})).toEqual(17)
        expect(await Meters.findOne({serialNumber: '000053'})).toMatchObject(resp.body.meter)
    })
})
