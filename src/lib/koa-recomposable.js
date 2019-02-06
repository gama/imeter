const compose = require('koa-compose')
const Koa     = require('koa')

class RecomposableKoa extends Koa {
    callback() {
        this.recompose()

        if (!this.listenerCount('error')) this.on('error', this.onerror)

        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, this.fn)
        }

        return handleRequest
    }

    recompose() {
        this.fn = compose(this.middleware)
    }
}

module.exports = RecomposableKoa
