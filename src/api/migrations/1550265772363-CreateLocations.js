const { Table } = require('typeorm')

class CreateLocations1550265772363 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: 'locations',
            columns: [
                { name: 'id',          type: 'int',     isPrimary: true, isGenerated: true },
                { name: 'customer_id', type: 'int'                                         },
                { name: 'name',        type: 'varchar'                                     }
            ], 
            foreignKeys: [
                { columnNames: ['customer_id'], referencedTableName: 'customers', referencedColumnNames: ['id'] }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable('locations')
    }
}

module.exports = { CreateLocations1550265772363 } 
