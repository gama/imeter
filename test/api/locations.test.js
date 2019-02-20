/** @jest-environment node */

const request          = require('supertest')
const db               = require('../../src/api/db')
const { loadFixtures } = require('../../data/seed.js')

require('./mocks').mock('config', 'authMiddleware')
const app    = require('./server')
const server = app.callback()

test('locations/index (scoped by logged user)', async () => {
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
    const attrs    = { 'name': 'Apartment 401' }
    const expAttrs = { ...attrs, customerId: 10 }

    const resp = await request(server)
        .post('/api/locations')
        .send({location: attrs})

    expect(resp.status).toEqual(201)
    expect(resp.body.location).toBeTruthy()
    expect(resp.body.location).toEqual(expect.objectContaining(attrs))
    expect(await Locations.count({})).toEqual(5)
    expect(await Locations.findOne({name: 'New Condo'})).toEqual(expect.objectContaining(expAttrs))
})

test('locations/update', async () => {
    const attrs = { name: 'Edited Apartment' }
    const resp  = await request(server)
        .put('/api/locations/35')
        .send({location: attrs})

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Locations.count({})).toEqual(4)
    expect(await Locations.findOne({name: 'Apartment 102'})).toBeUndefined()
    expect(await Locations.findOne({name: 'Edited Apartment'})).toEqual(expect.objectContaining(attrs))
})

test('locations/destroy', async () => {
    const resp = await request(server).delete('/api/locations/35')

    expect(resp.status).toEqual(204)
    expect(resp.body).toEqual({})
    expect(await Locations.count({})).toEqual(3)
    expect(await Locations.findOne({name: 'Park Royal Condo'})).toBeUndefined()
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

// ----- fixtures, helpers, setup & teardown ----
let Locations
beforeAll(async () => Locations = await db.getRepository('Location'))
afterAll(async  () => db.closeConnection())
afterEach(async () => {
    await Locations.clear()
    await loadFixtures('locations')
})
