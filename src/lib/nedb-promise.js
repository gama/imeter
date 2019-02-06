// adapted from https://github.com/jrop/nedb-promise

const NedbDatastore = require('nedb')
const { promisify } = require('util')

class NedbPromiseDatastore extends NedbDatastore {
    constructor(options) {
        super({...options, autoload: false})
        this.autoload = options.autoload || false
        if (this.autoload)
            this.loadDatabase().then(options.onload || ((err) => { if (err) throw err }))
    }

    cfind(query, projections) {
        const cursor = this.find(query, projections)
        cursor.exec  = promisify(cursor.exec.bind(cursor))
        return cursor
    }

    cfindOne(query, projections) {
        const cursor = this.findOne(query, projections)
        cursor.exec  = promisify(cursor.exec.bind(cursor))
        return cursor
    }

    ccount(query) {
        const cursor = this.count(query)
        cursor.exec  = promisify(cursor.exec.bind(cursor))
        return cursor
    }
}

const PROMISIFIABLE_METHODS = [
    'loadDatabase', 'insert', 'find', 'findOne', 'count', 'update',
    'remove', 'ensureIndex', 'removeIndex'
]
for (let method of PROMISIFIABLE_METHODS)
    NedbPromiseDatastore.prototype[method] = promisify(NedbDatastore.prototype[method])

module.exports = NedbPromiseDatastore
