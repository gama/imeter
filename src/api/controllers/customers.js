const Router                     = require('koa-router')
const { getRepository }          = require('typeorm')
const { isAdmin }                = require('../auth')
const { filter, sort, paginate } = require('../typeorm-utils')

module.exports = { mount, index, show, create, update, destroy }

function mount(parentRouter, prefix='/customers') {
    const router = new Router({ prefix })
    router.use(isAdmin())

    router.get    ('/',    index)
    router.post   ('/',    create)
    router.get    ('/:id', show)
    router.put    ('/:id', update)
    router.delete ('/:id', destroy)

    parentRouter.use(router.routes())
}

// ---------- endpoints ----------
async function index(ctx) {
    // await new Promise(resolve => setTimeout(resolve, 250))
    const attrs     = ['name']
    const params    = Object.assign(filter(ctx, attrs), sort(ctx), paginate(ctx))
    const customers = await Customers().find(params)
    ctx.body        = { customers }
}

async function show(ctx) {
    const customer = await Customers().findOne(ctx.params.id)
    ctx.assert(customer, 404, 'customer not found')
    ctx.body = { customer }
}

async function create(ctx) {
    const attrs = ctx.request.body.customer
    ctx.assert(Customers().target.validate(attrs), 400, 'invalid customer attributes')
    const customer = await Customers().save(Customers().create(attrs))

    ctx.status = 201
    ctx.body   = { customer }
}

async function update(ctx) {
    let customer = await Customers().findOne(ctx.params.id)
    ctx.assert(customer, 404, 'customer not found')

    const attrs = { id: customer.id, ...ctx.request.body.customer }
    ctx.assert(Customers().target.validate(attrs), 400, 'invalid customer attributes')
    customer = await Customers().save(attrs)

    ctx.body = { customer }
}

async function destroy(ctx) {
    let customer = await Customers().findOne(ctx.params.id)
    ctx.assert(customer, 404, 'customer not found')

    await Customers().delete(customer.id)

    ctx.status = 204
    ctx.body   = null
}

// ---------- private functions and helpers ----------
function Customers() {
    return getRepository('Customer')
}
