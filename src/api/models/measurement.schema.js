const { EntitySchema } = require('typeorm')
const Measurement      = require('./measurement')

module.exports = new EntitySchema({
    target:    Measurement,
    name:      'Measurement',
    tableName: 'measurements',
    columns:   {
        id:        { primary: true, type: 'int', generated: true },
        timestamp: { type: 'timestamp'                           },
        value:     { type: 'real'                                }
    },
    relations: {
        meter: {
            target: 'Meter',
            type:   'belongs-to'
        },
        operator: {
            target: 'User',
            type:   'belongs-to'
        },
    }
})
