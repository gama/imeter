const v8n = require('v8n')

module.exports = class Measurement {
    constructor(id, meterId, operatorId, timestamp, value) {
        this.id         = id
        this.meterId    = meterId
        this.operatorId = operatorId
        this.timestamp  = timestamp
        this.value      = value
    }

    static validate(attrs) {
        return v8n().schema({
            id:           v8n().optional(v8n().number()),
            meterId:      v8n().number(),
            operatorId:   v8n().number(),
            timestamp:    v8n().string().maxLength(24),
            value:        v8n().number()
        }).test(attrs)
    }
}
