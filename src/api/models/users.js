const BaseModel = require('./base')

class UsersModel extends BaseModel {
    constructor(opts={}) {
        super('users', opts)
    }

    validateAttrs(attrs) {
        return attrs && attrs.username && attrs.password && attrs.firstName &&
               attrs.lastName && attrs.dateOfBirth && attrs.admin != null
    }

    find(query, projection={password:0}) {
        return super.find(query, projection)
    }

    findOne(query, projection={password:0}) {
        return super.findOne(query, projection)
    }
}

module.exports = new UsersModel()
