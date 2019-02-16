const { Table } = require('typeorm')

class CreateCustomers1550261578425 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name:    'customers',
            columns: [
                { name: 'id',   type: 'int',     isPrimary: true, isGenerated: true },
                { name: 'name', type: 'varchar',                                    },
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable('customers')
    }
}

module.exports = { CreateCustomers1550261578425 }
