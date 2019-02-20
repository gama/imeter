const EntitySchema = require('typeorm').EntitySchema
const Customer     = require('./customer')

module.exports = new EntitySchema({
    target:    Customer,
    name:      'Customer',
    tableName: 'customers',
    columns:   {
        id:   { primary: true, type: 'int', generated: true },
        name: { type: 'varchar'                             }
    },
    relations: {
        locations: {
            target:  'Location',
            type:    'one-to-many',
            cascade: true
        },
        users: {
            target:  'User',
            type:    'one-to-many',
            cascade: true
        },
    }
})
