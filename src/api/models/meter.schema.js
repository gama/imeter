const EntitySchema = require('typeorm').EntitySchema
const Meter        = require('./meter')

module.exports = new EntitySchema({
    target:    Meter,
    name:      'Meter',
    tableName: 'meters',
    columns:   {
        id:           { type: 'int',     primary: true, generated: true },
        locationId:   { type: 'int',     name: 'location_id'            },
        serialNumber: { type: 'varchar', name: 'serial_number'          },
        kind:         { type: 'varchar'                                 },
        model:        { type: 'varchar'                                 }
    },
    relations: {
        location: {
            target:     'Location',
            type:       'many-to-one',
            onDelete:   'CASCADE',
            joinColumn: { name: 'location_id' },
            eager:      true
        },
        measurements: {
            target:  'Measurement',
            type:    'one-to-many',
            cascade: true
        }
    }
})
