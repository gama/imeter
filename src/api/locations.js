const { getRepository } = require('typeorm')

module.exports = { mount, index, show, create, update, destroy }

function mount(router) {
    router.get    ('/locations',     index)
    router.post   ('/locations',     create)
    router.get    ('/locations/:id', show)
    router.put    ('/locations/:id', update)
    router.delete ('/locations/:id', destroy)
}

// ---------- endpoints ----------
async function index(ctx) {
    const locations = await Locations().find({customerId: customerId(ctx)})
    ctx.body = { locations: locations.map(serialize) }
}

async function show(ctx) {
    const location = await Locations().findOne(ctx.params.id)
    ctx.assert(location, 404, 'location not found')
    ctx.body = {location: serialize(location)}
}

async function create(ctx) {
    const attrs = ctx.request.body.location
    ctx.assert(Locations().target.validate(attrs), 400, 'invalid location attributes')
    const location = await Locations().save(Locations().create(attrs))

    ctx.status = 201
    ctx.body   = {location: serialize(location)}
}

async function update(ctx) {
    let location = await Locations().findOne(ctx.params.id)
    ctx.assert(location, 404, 'location not found')

    const attrs = ctx.request.body.location
    ctx.assert(Locations().target.validate(attrs), 400, 'invalid location attributes')
    await Locations().update(location.id, attrs)

    ctx.status = 204
    ctx.body   = null
}

async function destroy(ctx) {
    let location = await Locations().findOne(ctx.params.id)
    ctx.assert(location, 404, 'location not found')

    await Locations().delete(location.id)

    ctx.status = 204
    ctx.body   = null
}

// ---------- private functions and helpers ----------
function Locations() {
    return getRepository('Location')
}

function customerId(ctx) {
    if (ctx.state.user.customerId)
        return ctx.state.user.customerId
    if (ctx.state.user.role === 'admin')
        return ctx.params.customerId
    ctx.throw(404, 'locations or customer not found')
}

function serialize(location) {
    return location
}
