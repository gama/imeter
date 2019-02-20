const db = require('../../src/api/db')

module.exports = async () => {
    if (!process.argv.includes('--watch')) {
        console.log('globa-teardown; closing connection')
        await db.closeConnection()
    }
}
