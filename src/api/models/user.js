const v8n = require('v8n')

module.exports = class User {
    constructor(id, email, password, firstName, lastName, role, authToken, customer) {
        this.id        = id
        this.email     = email
        this.password  = password
        this.firstName = firstName
        this.lastName  = lastName
        this.role      = role
        this.authToken = authToken
        this.customer  = customer
    }

    static validate(attrs) {
        return v8n().schema({
            id:        v8n().optional(v8n().number()),
            email:     v8n().string().maxLength(256),
            password:  v8n().string().maxLength(256),
            firstName: v8n().string().maxLength(64),
            lastName:  v8n().string().maxLength(64),
            role:      v8n().string(),
            authToken: v8n().optional(v8n().string().minLength(32))
        }).test(attrs)
    }
}
