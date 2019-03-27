const { FindOperator } = require('typeorm')

// postgresql's case-insensite like
class ILikeOperator extends FindOperator {
    toSql(connection, aliasPath, parameters) {
        return aliasPath + ' ILIKE ' + parameters[0]
    }
}

function ILike(parameter) {
    return new ILikeOperator('like', parameter)
}

function filter(ctx, attrs) {
    const filter = ctx.query.filter ? ctx.query.filter.trim() : undefined
    return filter ? { where: attrs.map(attr => ({ [attr]: ILike(`%${filter}%`) })) } : {}
}

function sort(ctx) {
    const sort = ctx.query.sort ? ctx.query.sort.trim() : undefined
    if (!sort)
        return { order: { id: 'DESC' } }
    const [attr, direction] = (sort[0] === '-') ? [sort.slice(1), 'DESC'] : [sort, 'ASC']
    return { order: { [attr]: direction } }
}

function paginate(ctx, defaultPerPage=10) {
    const perPage = ctx.query.per_page ? parseInt(ctx.query.per_page) : defaultPerPage
    const page    = ctx.query.page     ? parseInt(ctx.query.page)     : 1
    return { take: perPage, skip: ((page - 1) * perPage) }
}

module.exports = { ILike, filter, sort, paginate }
