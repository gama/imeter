const db = require('../../src/api/db')

module.exports = async () => {
    const connection = await db.getConnection()
    await connection.close()
}
