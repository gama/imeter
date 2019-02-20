/** @jest-environment node */

const request = require('supertest')
const app     = require('./server')

test.only('version', async () => {
    const resp = await request(app.callback()).get('/api/version')
    expect(resp.status).toEqual(200)
    expect(resp.body).toEqual(expect.objectContaining({
        'name':        'nextjs-playground',
        'version':     expect.stringMatching(/^\d+\.\d+\.\d+$/),
        'description': expect.any(String),
    }))
})
