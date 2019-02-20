const v8n = require('v8n')

module.exports = class Location {
    constructor(id, customerId, name, meters) {
        this.id         = id
        this.name       = name
        this.customerId = customerId
        this.meters     = meters
    }

    static validate(attrs) {
        return v8n().schema({
            id:         v8n().optional(v8n().number()),
            customerId: v8n().number(),
            name:       v8n().string().maxLength(256)
        }).test(attrs)
    }
}
