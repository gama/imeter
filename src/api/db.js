const typeorm = require('typeorm')  // { getConnectionManager, createConnection } = require('typeorm')

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
    if (typeorm.getConnectionManager().has('default'))
        await (await typeorm.getConnection()).close()
}

async function getRepository(...args) {
    await ensureConnection()
    return await typeorm.getRepository(...args)
}
