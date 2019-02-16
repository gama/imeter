module.exports = class Measurement {
    constructor(id, meter, timestamp, value, operator) {
        this.id        = id
        this.meter     = meter
        this.timestamp = timestamp
        this.value     = value
        this.operator  = operator
    }
}
