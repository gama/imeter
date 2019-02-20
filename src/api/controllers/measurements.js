const { getRepository } = require('typeorm')
const Router            = require('koa-router')

module.exports = { mount, index, show, create, update, destroy }

function mount(parentRouter, prefix='/measurements', meterPrefix='/meters') {
    const router = new Router()

    router.get    (prefix, onlyCustomers, scopedModel, index)
    router.post   (prefix, exceptCustomers, scopedModel, create)
    router.get    (prefix + '/:id', scopedModel, show)
    router.put    (prefix + '/:id', exceptCustomers, scopedModel, update)
    router.delete (prefix + '/:id', exceptCustomers, scopedModel, destroy)
    router.get    (meterPrefix + '/:meterId' + prefix, scopedModel, index)
    router.post   (meterPrefix + '/:meterId' + prefix, exceptCustomers, scopedModel, create)

    parentRouter.use(router.routes())
}

// ---------- endpoints ----------
async function index(ctx) {
    const measurements = await ctx.state.scope.getMany()
    ctx.body = { measurements }
}

async function show(ctx) {
    const measurement = await findById(ctx)
    ctx.assert(measurement, 404, 'measurement not found')
    ctx.body = { measurement }
}

async function create(ctx) {
    let attrs = ctx.request.body.measurement
    ctx.assert(attrs, 400, 'invalid measurement attributes')

    attrs = {
        ...attrs,
        meterId:    parseInt(ctx.params.meterId) || attrs.meterId,
        operatorId: ctx.state.user.id,
        timestamp:  (new Date(Date.now())).toISOString()
    }

    ctx.assert(await getRepository('Meter').findOne(attrs.meterId), 404, 'meter not found')
    ctx.assert(Measurements().target.validate(attrs), 400, 'invalid measurement attributes')
    const measurement = await Measurements().save(Measurements().create(attrs))

    ctx.status = 201
    ctx.body   = { measurement }
}

async function update(ctx) {
    const measurement = await findById(ctx)
    ctx.assert(measurement, 404, 'measurement not found')

    const attrs = {
        ...ctx.request.body.measurement,
        operatorId: ctx.state.user.id,
        meterId:    measurement.meterId,
        timestamp:  measurement.timestamp.toISOString()
    }
    ctx.assert(Measurements().target.validate(attrs), 400, 'invalid measurement attributes')
    await Measurements().update(measurement.id, attrs)

    ctx.status = 204
}

async function destroy(ctx) {
    const measurement = await findById(ctx)
    ctx.assert(measurement, 404, 'measurement not found')

    await Measurements().delete(measurement.id)

    ctx.status = 204
    ctx.body   = null
}

// ---------- private functions and helpers ----------
function Measurements() {
    return getRepository('Measurement')
}

async function onlyCustomers(ctx, next) {
    ctx.assert(ctx.state.user.isCustomer(), 401, 'permission denied')
    await next()
}

async function exceptCustomers(ctx, next) {
    ctx.assert(!ctx.state.user.isCustomer(), 401, 'permission denied')
    await next()
}

async function scopedModel(ctx, next) {
    let scope = Measurements().createQueryBuilder('measurement')

    const meterId = ctx.params && parseInt(ctx.params.meterId)
    if (meterId)
        scope = scope.andWhere('measurement.meterId = :meterId', {meterId})

    const customerId = ctx.state.user.customerId  //  await getCustomerId(ctx, meterId)
    if (customerId)
        scope = scope
            .innerJoin('measurement.meter', 'meter')
            .innerJoin('meter.location', 'location')
            .andWhere('location.customerId = :customerId', {customerId})

    ctx.state.scope = scope
    await next()
}

async function findById(ctx) {
    return ctx.state.scope.andWhere('measurement.id = :id', {id: ctx.params.id}).getOne()
}
