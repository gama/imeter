/* eslint-disable no-undef, no-console */

const port = parseInt(process.env.PORT, 10) || 3000
const dev  = process.env.NODE_ENV !== 'production'

require('@zeit/next-preact/alias')()
const next    = require('next')
const express = require('express')

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    server.get('/tv-show/:id', (req, res) => app.render(req, res, '/tv-show', {id: req.params.id}))
    server.get('*',            (req, res) => handle(req, res))
    server.listen(port, (error) => {
        if (error)
            throw error
        console.log(`> Ready on http://localhost:${port}`)
    })
})
