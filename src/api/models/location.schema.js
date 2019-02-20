const EntitySchema = require('typeorm').EntitySchema
const Location     = require('./location')

module.exports = new EntitySchema({
    target:    Location,
    name:      'Location',
    tableName: 'locations',
    columns:   {
        id:         { type: 'int', primary: true, generated: true },
        customerId: { type: 'int', name: 'customer_id'            },
        name:       { type: 'varchar'                             }
    },
    relations: {
        customer: {
            target:  'Customer',
            type:    'belongs-to'
        },
        meters: {
            target:  'Meter',
            type:    'one-to-many',
            cascade: true
        }
    }
})
