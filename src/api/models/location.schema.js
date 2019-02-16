const EntitySchema = require('typeorm').EntitySchema
const Location     = require('./location')

module.exports = new EntitySchema({
    target:    Location,
    name:      'Location',
    tableName: 'locations',
    columns:   {
        id:   { primary: true, type: 'int', generated: true },
        name: { type: 'varchar' }
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
