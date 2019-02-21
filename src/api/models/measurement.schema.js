const { EntitySchema } = require('typeorm')
const Measurement      = require('./measurement')

module.exports = new EntitySchema({
    target:    Measurement,
    name:      'Measurement',
    tableName: 'measurements',
    columns:   {
        id:         { type: 'int', primary: true, generated: true },
        meterId:    { type: 'int', name: 'meter_id'               },
        operatorId: { type: 'int', name: 'operator_id'            },
        timestamp:  { type: 'timestamp'                           },
        value:      { type: 'real'                                }
    },
    relations: {
        meter: {
            target:     'Meter',
            type:       'many-to-one',
            onDelete:   'CASCADE',
            joinColumn: { name: 'meter_id' },
            eager:      true
        },
        operator: {
            target:   'User',
            type:     'many-to-one',
            onDelete: 'SET NULL',
            joinColumn: { name: 'operator_id' }
        },
    }
})
