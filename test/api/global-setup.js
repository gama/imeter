const { loadAllFixtures } = require('../../data/seed')
const db                  = require('../../src/api/db')

async function initDatabase() {
    const connection = await db.getConnection()
    await connection.synchronize(true)
}

module.exports = async () => {
    process.env.NODE_ENV = 'test'
    process.env.TYPEORM_DATABASE = 'imeter_test'
    await initDatabase()
    await loadAllFixtures()
}
