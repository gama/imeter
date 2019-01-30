const USERS = require('./db/users')

module.exports = {
    ids() {
        return USERS.map(user => user.id)
    },
    names() {
        return USERS.map(user => user.name)
    },
}
