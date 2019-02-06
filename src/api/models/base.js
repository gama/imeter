const DataStore = require('../../lib/nedb-promise')
const config    = require('../../config')

class BaseModel extends DataStore {
    constructor(name, opts={}) {
        super({filename: `${config.dbBaseDir}/.${name}.db`, autoload: true, ...opts})
    }

    save(record) {
        return this.update({ _id: record._id }, record)
    }
}

module.exports = BaseModel
