module.exports = {
    'type':        'postgres',
    'host':        process.env.TYPEORM_HOST           || 'localhost',
    'port':        +process.env.TYPEORM_PORT          || undefined,
    'username':    process.env.TYPEORM_USERNAME       || 'imeter',
    'password':    process.env.TYPEORM_PASSWORD       || 'imeter',
    'database':    process.env.TYPEORM_DATABASE       || 'imeter',
    'synchronize': ['true', '1', 'on'].includes(process.env.TYPEORM_SYNCHRONIZE || 'false'),
    'logging':     ['true', '1', 'on'].includes(process.env.TYPEORM_LOGGING || 'false'),
    'entities':    ['src/api/models/**/*.schema.js'],
    'migrations':  ['src/api/migrations/**/*.js'],
    'subscribers': ['src/api/subscriber/**/*.js'],
    'cli':         {
        'migrationsDir': 'src/api/migrations'
    }
}
