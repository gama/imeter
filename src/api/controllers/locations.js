const { pickBy, identity} = require('lodash')
const { getRepository }   = require('typeorm')
const Router              = require('koa-router')

module.exports = { mount, index, show, create, update, destroy }

function mount(parentRouter, prefix='/locations', customersPrefix='/customers') {
    const router = new Router()

    router.get    (prefix, index)
    router.post   (prefix, create)
    router.get    (prefix + '/:id', show)
    router.put    (prefix + '/:id', update)
    router.delete (prefix + '/:id', destroy)
    router.get    (customersPrefix + '/:customerId' + prefix, index)
    router.post   (customersPrefix + '/:customerId' + prefix, create)

    parentRouter.use(router.routes())
}

// ---------- endpoints ----------
async function index(ctx) {
    // const filter = (ctx.state.user.role === 'admin') ? {} : { customerId: customerId(ctx) }
    const filter = pickBy({ customerId: customerId(ctx, { throwNotFound: false }) }, identity)
    const locations = await Locations().find(filter)
    ctx.body = { locations: locations.map(serialize) }
}

async function show(ctx) {
    const location = await Locations().findOne(ctx.params.id)
    ctx.assert(location && location.customerId === customerId(ctx), 404, 'location not found')
    ctx.body = {location: serialize(location)}
}

async function create(ctx) {
    const attrs = ctx.request.body.location
    ctx.assert(attrs, 400, 'invalid location attributes')

    if (ctx.state.user.role === 'admin')
        attrs.customerId = +ctx.params.customerId || attrs.customerId
    else
        attrs.customerId = ctx.state.user.customerId
    ctx.assert(Locations().target.validate(attrs), 400, 'invalid location attributes')
    const location = await Locations().save(Locations().create(attrs))

    ctx.status = 201
    ctx.body   = {location: serialize(location)}
}

async function update(ctx) {
    let location = await Locations().findOne(ctx.params.id)
    ctx.assert(location && location.customerId === customerId(ctx), 404, 'location not found')

    const attrs = { id: location.id, ...ctx.request.body.location, customerId: location.customerId }
    ctx.assert(Locations().target.validate(attrs), 400, 'invalid location attributes')
    location = await Locations().save(attrs)

    ctx.body = { location } 
}

async function destroy(ctx) {
    let location = await Locations().findOne(ctx.params.id)
    ctx.assert(location && location.customerId === customerId(ctx), 404, 'location not found')

    await Locations().delete(location.id)

    ctx.status = 204
    ctx.body   = null
}

// ---------- private functions and helpers ----------
function Locations() {
    return getRepository('Location')
}

function customerId(ctx, {throwNotFound = true} = {}) {
    if (ctx.state.user.customerId)
        return ctx.state.user.customerId
    if (ctx.state.user.role === 'admin')
        return parseInt(ctx.params.customerId)
    if (throwNotFound)
        ctx.throw(404, 'locations or customer not found')
}

function serialize(location) {
    return location
}
