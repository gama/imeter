const { Table } = require('typeorm')

class CreateMeasurements1550265832118 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: 'measurements',
            columns: [
                { name: 'id',           type: 'int',     isPrimary: true, isGenerated: true },
                { name: 'meter_id',     type: 'int'                                         },
                { name: 'operator_id',  type: 'int'                                         },
                { name: 'timestamp',    type: 'timestamp'                                   },
                { name: 'value',        type: 'real'                                        }
            ],
            foreignKeys: [
                { columnNames: ['meter_id'],    referencedTableName: 'meters', referencedColumnNames: ['id'] },
                { columnNames: ['operator_id'], referencedTableName: 'users',  referencedColumnNames: ['id'] }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable('measurements')
    }
}

module.exports = { CreateMeasurements1550265832118 } 
