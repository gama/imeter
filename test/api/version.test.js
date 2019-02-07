const request = require('supertest')
const server  = require('./server')

test('version', async () => {
    const resp = await request(server).get('/api/version')

    expect(resp.status).toEqual(200)
    expect(resp.body).toEqual(expect.objectContaining({
        'name':        'nextjs-playground',
        'version':     expect.stringMatching(/^\d+\.\d+\.\d+$/),
        'description': expect.any(String),
    }))
})
