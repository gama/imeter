/** @jest-environment node */

const request = require('supertest')
const app     = require('./server')

test('version', async () => {
    const resp = await request(app.callback()).get('/api/version')
    expect(resp.status).toEqual(200)
    expect(resp.body).toMatchObject({
        'name':        'ivmeter',
        'version':     expect.stringMatching(/^\d+\.\d+\.\d+$/),
        'description': expect.any(String),
    })
})
