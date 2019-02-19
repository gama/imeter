const v8n = require('v8n')

module.exports = class Customer {
    constructor(id, name, locations, users) {
        this.id        = id
        this.name      = name
        this.locations = locations
        this.users     = users
    }

    static validate(attrs) {
        return v8n().schema({
            id:   v8n().optional(v8n().number()),
            name: v8n().string().maxLength(256),
        }).test(attrs)
    }
}
