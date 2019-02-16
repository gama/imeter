const { Table } = require('typeorm')

class CreateMeters1550265786157 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: 'meters',
            columns: [
                { name: 'id',           type: 'int',     isPrimary: true, isGenerated: true },
                { name: 'serialNumber', type: 'varchar'                                     },
                { name: 'kind',         type: 'varchar'                                     },
                { name: 'model',        type: 'varchar'                                     },
                { name: 'location_id',  type: 'int'                                         }
            ],
            foreignKeys: [
                { columnNames: ['location_id'], referencedTableName: 'locations', referencedColumnNames: ['id'] }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable('meters')
    }
}

module.exports = { CreateMeters1550265786157 } 
