const EntitySchema = require('typeorm').EntitySchema
const User        = require('./user')

module.exports = new EntitySchema({
    name:      'User',
    target:    User,
    tableName: 'users',
    omitAttrs: ['password'],
    columns:   {
        id:         { type: 'int', primary: true, generated: true },
        email:      { type: 'varchar' },
        password:   { type: 'varchar' },
        firstName:  { type: 'varchar' },
        lastName:   { type: 'varchar' },
        role:       { type: 'varchar' },
        authToken:  { type: 'varchar', nullable: true }
    },
    relations: {
        customer: {
            target:  'Customer',
            type:    'belongs-to',
        }
    }
})
