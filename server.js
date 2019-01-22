/* eslint-disable no-undef, no-console */

const port = parseInt(process.env.PORT, 10) || 3000
const dev  = process.env.NODE_ENV !== 'production'

require('@zeit/next-preact/alias')()
const { createServer } = require('http')
const { parse }        = require('url')
const next             = require('next')

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer((request, response) => {
        handle(request, response, parse(request.url, true))
    }).listen(port, (error) => {
        if (error)
            throw error
        console.log(`> Ready on http://localhost:${port}`)
    })
})
