/** @jest-environment node */

const request = require('supertest')
const app     = require('./server')
const server  = app.callback()

beforeAll(async () => await app.init())
afterAll(async  () => await app.finish())

test('version', async () => {
    const resp = await request(server).get('/api/version')
    expect(resp.status).toEqual(200)
    expect(resp.body).toMatchObject({
        'name':        'ivmeter',
        'version':     expect.stringMatching(/^\d+\.\d+\.\d+$/),
        'description': expect.any(String),
    })
})
