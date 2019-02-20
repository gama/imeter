/** @jest-environment node */

const _                   = require('lodash')
const request             = require('supertest')
const db                  = require('../../src/api/db')
const { loadAllFixtures } = require('../../data/seed.js')
const mocks               = require('./mocks')
const { loginAs }         = mocks

mocks.mock('config', 'authMiddleware')
const app    = require('./server')
const server = app.callback()

let Measurements
beforeAll(async () => Measurements = await db.getRepository('Measurement'))
afterAll(async  () => db.closeConnection())
afterEach(async () => await loadAllFixtures())


describe('logged in as customer', () => {
    beforeAll(() => loginAs('Emily'))

    test('measurements/index as customer', async () => {
        const expected = _.flatten(_.zip([1, 1, 2, 3, 5, 8], [2.1, 4.2, 6.3, 8.4, 10.5, 12.6]))

        const resp = await request(server).get('/api/measurements')

        expect(resp.status).toEqual(200)
        expect(_.sortBy(resp.body.measurements, m => m.timestamp).map(m => m.value)).toEqual(expected)
    })

    test('meter/:lid/measurements/index as customer', async () => {
        const expected = [2.1, 4.2, 6.3, 8.4, 10.5, 12.6]

        const resp = await request(server).get('/api/meters/50/measurements')

        expect(resp.status).toEqual(200)
        expect(_.sortBy(resp.body.measurements, m => m.timestamp).map(m => m.value)).toEqual(expected)
    })

    test('measurements/show as customer', async () => {
        const attrs = {
            id:         209,
            operatorId: 22,
            meterId:    50,
            timestamp:  '2018-12-05T08:05:00.000Z',
            value:      8.4
        }
        const resp = await request(server).get('/api/measurements/209')

        expect(resp.status).toEqual(200)
        expect(resp.body.measurement).toMatchObject(attrs)
    })

    test('measurements/{create,update,delete} fail with 401', async () => {
        let resp = await request(server).post('/api/measurements').send({})
        expect(resp.status).toEqual(401)

        resp = await request(server).put('/api/measurements/999').send({})
        expect(resp.status).toEqual(401)

        resp = await request(server).delete('/api/measurements/999').send({})
        expect(resp.status).toEqual(401)
    })

    test('measurement not-found errors as customer', async () => {
        let resp = await request(server).get('/api/measurements/999')
        expect(resp.status).toEqual(404)
    })

    test('measurement not-scoped error', async () => {
        let resp = await request(server).get('/api/measurements/40')
        expect(resp.status).toEqual(404)
    })
})

const userParams = [['operator', 'John'], ['admin', 'Admin']]
describe.each(userParams)('logged in as %s', (role, userName) => {
    beforeAll(() => loginAs(userName))

    test(`measurements/index as ${role} fails with 401`, async () => {
        const resp = await request(server).get('/api/measurements')
        expect(resp.status).toEqual(401)
    })

    test(`meters/:id/measurements/index as ${role}`, async () => {
        const expected = [2.1, 4.2, 6.3, 8.4, 10.5, 12.6]

        const resp = await request(server).get('/api/meters/50/measurements')

        expect(resp.status).toEqual(200)
        expect(_.sortBy(resp.body.measurements, m => m.timestamp).map(m => m.value)).toEqual(expected)
    })

    test(`measurements/show as ${role}`, async () => {
        const attrs = {
            id:         209,
            operatorId: 22,
            meterId:    50,
            timestamp:  '2018-12-05T08:05:00.000Z',
            value:      8.4
        }
        const resp = await request(server).get('/api/measurements/209')

        expect(resp.status).toEqual(200)
        expect(resp.body.measurement).toMatchObject(attrs)
    })

    test(`measurements/create as ${role}`, async () => {
        const timestamp = new Date('2019-01-10T08:00:00.000Z')
        jest.spyOn(Date, 'now').mockImplementationOnce(() => timestamp.getTime())
        const attrs = { value: 123.4, meterId: 49 }

        const resp = await request(server)
            .post('/api/measurements')
            .send({measurement: attrs})

        expect(resp.status).toEqual(201)
        expect(resp.body.measurement).toMatchObject({...attrs, timestamp: timestamp.toISOString()})
        expect(await Measurements.count({})).toEqual(115)
        expect(await Measurements.findOne(resp.body.measurement.id)).toMatchObject({...attrs, timestamp})
    })

    test(`measurements/update as ${role}`, async () => {
        const attrs = { value: 567.8 }

        const resp = await request(server)
            .put('/api/measurements/213')
            .send({measurement: attrs})

        expect(resp.status).toEqual(204)
        expect(resp.body).toEqual({})
        expect(await Measurements.count({})).toEqual(114)
        expect(await Measurements.findOne({value: 12.6})).toBeUndefined()
        expect(await Measurements.findOne(213)).toMatchObject({...attrs, meterId: 50})
    })

    test(`measurements/destroy as ${role}`, async () => {
        const resp = await request(server).delete('/api/measurements/213')

        expect(resp.status).toEqual(204)
        expect(resp.body).toEqual({})
        expect(await Measurements.count({})).toEqual(113)
        expect(await Measurements.findOne(213)).toBeUndefined()
    })

    test(`measurement not-found errors as ${role}`, async () => {
        let resp = await request(server).get('/api/measurements/999')
        expect(resp.status).toEqual(404)

        resp = await request(server).put('/api/measurements/999')
        expect(resp.status).toEqual(404)

        resp = await request(server).delete('/api/measurements/999')
        expect(resp.status).toEqual(404)
    })

    test(`invalid attributes errors as ${role}`, async () => {
        let resp = await request(server).post('/api/measurements').send({invalid: true})
        expect(resp.status).toEqual(400)

        resp = await request(server).post('/api/measurements').send({measurement: {invalid: true}})
        expect(resp.status).toEqual(400)

        resp = await request(server).put('/api/measurements/213').send({invalid: true})
        expect(resp.status).toEqual(400)
    })
})
