const v8n = require('v8n')

module.exports = class User {
    constructor(id, customerId, email, password, firstName, lastName, role, authToken) {
        this.id         = id
        this.customerId = customerId
        this.email      = email
        this.password   = password
        this.firstName  = firstName
        this.lastName   = lastName
        this.role       = role
        this.authToken  = authToken
    }

    static validate(attrs) {
        return v8n().schema({
            id:         v8n().optional(v8n().number()),
            customerId: v8n().optional(v8n().number()),
            email:      v8n().string().maxLength(256),
            password:   v8n().string().maxLength(256),
            firstName:  v8n().string().maxLength(64),
            lastName:   v8n().string().maxLength(64),
            role:       v8n().string(),
            authToken:  v8n().optional(v8n().string().minLength(32))
        }).test(attrs)
    }
}
