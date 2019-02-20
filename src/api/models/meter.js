const v8n = require('v8n')

module.exports = class Meter {
    constructor(id, locationId, serialNumber, kind, model, measurements) {
        this.id           = id
        this.locationId   = locationId
        this.serialNumber = serialNumber
        this.kind         = kind
        this.model        = model
        this.measurements = measurements
    }

    static validate(attrs) {
        return v8n().schema({
            id:           v8n().optional(v8n().number()),
            locationId:   v8n().number(),
            serialNumber: v8n().string().maxLength(64),
            kind:         v8n().string().maxLength(16),
            model:        v8n().string().maxLength(64)
        }).test(attrs)
    }
}
