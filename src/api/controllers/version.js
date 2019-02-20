const { name, version, description } = require('../../../package.json')

async function show(ctx) {
    ctx.body = { name, version, description }
}

function mount(router) {
    router.get('/version', show)
}

module.exports = { mount, show }
