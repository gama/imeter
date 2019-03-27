const { getRepository } = require('typeorm')
const Router            = require('koa-router')

module.exports = { mount, index, show, create, update, destroy }

function mount(parentRouter, prefix='/meters', locPrefix='/locations') {
    const router = new Router()

    router.get    (prefix, scopedModel, index)
    router.post   (prefix, scopedModel, create)
    router.get    (prefix + '/:id', scopedModel, show)
    router.put    (prefix + '/:id', scopedModel, update)
    router.delete (prefix + '/:id', scopedModel, destroy)
    router.get    (locPrefix + '/:locationId' + prefix, scopedModel, index)
    router.post   (locPrefix + '/:locationId' + prefix, scopedModel, create)

    parentRouter.use(router.routes())
}

// ---------- endpoints ----------
async function index(ctx) {
    const meters = await ctx.state.scope.getMany()
    ctx.body = { meters }
}

async function show(ctx) {
    const meter = await findById(ctx)
    ctx.assert(meter, 404, 'meter not found')
    ctx.body = { meter }
}

async function create(ctx) {
    const attrs = ctx.request.body.meter
    ctx.assert(attrs, 400, 'invalid meter attributes')

    attrs.locationId = +ctx.params.locationId || attrs.locationId
    ctx.assert(await validLocation(attrs.locationId, ctx), 400, 'invalid location')

    ctx.assert(Meters().target.validate(attrs), 400, 'invalid meter attributes')
    const meter = await Meters().save(Meters().create(attrs))

    ctx.status = 201
    ctx.body   = { meter }
}

async function update(ctx) {
    let meter = await findById(ctx)
    ctx.assert(meter, 404, 'meter not found')

    const attrs = { id: meter.id, ...ctx.request.body.meter, locationId: meter.locationId }
    ctx.assert(Meters().target.validate(attrs), 400, 'invalid meter attributes')
    meter = await Meters().save(attrs)

    ctx.body = { meter }
}

async function destroy(ctx) {
    const meter = await findById(ctx)
    ctx.assert(meter, 404, 'meter not found')

    await Meters().delete(meter.id)

    ctx.status = 204
    ctx.body   = null
}

// ---------- private functions and helpers ----------
function Meters() {
    return getRepository('Meter')
}

async function scopedModel(ctx, next) {
    let scope = Meters().createQueryBuilder('meter')

    const locationId = ctx.params && parseInt(ctx.params.locationId)
    if (locationId)
        scope = scope.andWhere('meter.locationId = :locationId', {locationId})

    const customerId = await getCustomerId(ctx, locationId)
    if (customerId)
        scope = scope.innerJoin('meter.location', 'location')
            .andWhere('location.customerId = :customerId', {customerId})

    ctx.state.scope = scope
    await next()
}

async function getCustomerId(ctx, locationId) {
    if (ctx.state.user.customerId)
        return ctx.state.user.customerId
    if (ctx.state.user.role === 'admin')
        return locationId && parseInt(await getRepository('Location').findOne(locationId))
    ctx.throw(404, 'meter\'s customer not found')
}

async function findById(ctx) {
    return ctx.state.scope.andWhere('meter.id = :id', {id: ctx.params.id}).getOne()
}

async function validLocation(locationId, ctx) {
    const location = await getRepository('Location').findOne(locationId)
    ctx.assert(location, 404, 'location not found')
    return (ctx.state.user.role === 'admin' || ctx.state.user.customerId === location.customerId)
}
