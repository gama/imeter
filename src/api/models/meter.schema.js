const EntitySchema = require('typeorm').EntitySchema
const Meter        = require('./meter')

module.exports = new EntitySchema({
    target:    Meter,
    name:      'Meter',
    tableName: 'meters',
    columns:   {
        id:            { type: 'int', primary: true, generated: true },
        location_id:   { type: 'int' },
        serial_number: { type: 'varchar' },
        kind:          { type: 'varchar' },
        model:         { type: 'varchar' }
    },
    relations: {
        location: {
            target:  'Location',
            type:    'belongs-to'
        },
        measurements: {
            target:  'Measurement',
            type:    'one-to-many',
            cascade: true
        }
    }
})
