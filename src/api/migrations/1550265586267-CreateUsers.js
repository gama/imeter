const { Table } = require('typeorm')

class CreateUsers1550265586267 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id',          type: 'int',       isPrimary: true,    isGenerated: true },
                { name: 'customer_id', type: 'int',       isNullable: true                      },
                { name: 'email',       type: 'varchar'                                          },
                { name: 'password',    type: 'varchar'                                          },
                { name: 'first_name',  type: 'varchar'                                          },
                { name: 'last_name',   type: 'varchar'                                          },
                { name: 'role',        type: 'varchar'                                          },
                { name: 'auth_token',  type: 'varchar',   isNullable: true                      },
            ],
            foreignKeys: [
                { columnNames: ['customer_id'], referencedTableName: 'customers', referencedColumnNames: ['id'] }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable('users')
    }
}

module.exports = { CreateUsers1550265586267 }
