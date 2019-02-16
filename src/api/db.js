const findUp = require('find-up')
const typeorm = require('typeorm')  // { getConnectionManager, createConnection } = require('typeorm')

module.exports = { ensureConnection, getConnection, closeConnection, getRepository }

async function ensureConnection() {
    if (!typeorm.getConnectionManager().has('default')) {
        const options = await connectionOptions()
        await typeorm.createConnection(options)
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

async function connectionOptions() {
    const configPath = await findUp('ormconfig.json')
    const config     = require(configPath)
    return config[process.env.NODE_ENV || 'development']
}
