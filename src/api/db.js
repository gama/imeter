const typeorm = require('typeorm')

module.exports = { ensureConnection, getConnection, closeConnection, getRepository }

async function ensureConnection() {
    if (!typeorm.getConnectionManager().has('default')) {
        await typeorm.createConnection()
    }
}

async function getConnection() {
    await ensureConnection()
    return await typeorm.getConnection()
}

async function closeConnection() {
    if (typeorm.getConnectionManager().has('default')) {
        const connection = await typeorm.getConnection()
        const index      = typeorm.getConnectionManager().connections.indexOf(connection)
        typeorm.getConnectionManager().connections.splice(index)
        await connection.close()
    }
}

async function getRepository(...args) {
    await ensureConnection()
    return await typeorm.getRepository(...args)
}
