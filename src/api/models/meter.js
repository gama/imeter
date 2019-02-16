module.exports = class Meter {
    constructor(id, serialNumber, kind, model, location, measurements) {
        this.id           = id
        this.serialNumber = serialNumber
        this.kind         = kind
        this.model        = model
        this.location     = location
        this.measurements = measurements
    }
}
