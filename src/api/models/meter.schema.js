const EntitySchema = require('typeorm').EntitySchema
const Meter        = require('./meter')

module.exports = new EntitySchema({
    target:    Meter,
    name:      'Meter',
    tableName: 'meters',
    columns:   {
        id:           { primary: true, type: 'int', generated: true },
        serialNumber: { type: 'varchar' },
        kind:         { type: 'varchar' },
        model:        { type: 'varchar' }
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
