const { getRepository } = require('typeorm')

module.exports = { mount, index, show, create, update, destroy }

function mount(router) {
    router.get    ('/customers',     index)
    router.post   ('/customers',     create)
    router.get    ('/customers/:id', show)
    router.put    ('/customers/:id', update)
    router.delete ('/customers/:id', destroy)
}

// ---------- endpoints ----------
async function index(ctx) {
    const customers = await Customers().find({})
    ctx.body = {customers: customers.map(serialize)}
}

async function show(ctx) {
    const customer = await Customers().findOne(ctx.params.id)
    ctx.assert(customer, 404, 'customer not found')
    ctx.body = {customer: serialize(customer)}
}

async function create(ctx) {
    const attrs = ctx.request.body.customer
    ctx.assert(Customers().target.validate(attrs), 400, 'invalid customer attributes')
    const customer = await Customers().save(Customers().create(attrs))

    ctx.status = 201
    ctx.body   = {customer: serialize(customer)}
}

async function update(ctx) {
    let customer = await Customers().findOne(ctx.params.id)
    ctx.assert(customer, 404, 'customer not found')

    const attrs = ctx.request.body.customer
    ctx.assert(Customers().target.validate(attrs), 400, 'invalid customer attributes')
    await Customers().update(customer.id, attrs)

    ctx.status = 204
    ctx.body   = null
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

function serialize(customer) {
    return customer
}
