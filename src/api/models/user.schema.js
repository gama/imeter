const EntitySchema = require('typeorm').EntitySchema
const User        = require('./user')

module.exports = new EntitySchema({
    name:      'User',
    target:    User,
    tableName: 'users',
    omitAttrs: ['password'],
    columns:   {
        id:         { type: 'int',     primary: true,       generated: true },
        customerId: { type: 'int',     name: 'customer_id', nullable: true  },
        email:      { type: 'varchar'                                       },
        password:   { type: 'varchar'                                       },
        firstName:  { type: 'varchar', name: 'first_name'                   },
        lastName:   { type: 'varchar', name: 'last_name'                    },
        role:       { type: 'varchar'                                       },
        authToken:  { type: 'varchar', name: 'auth_token', nullable: true   }
    },
    relations: {
        customer: {
            target:  'Customer',
            type:    'belongs-to',
        }
    }
})
