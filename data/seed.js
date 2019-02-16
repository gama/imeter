const { getConnection } = require('../src/api/db')

module.exports = { loadAllFixtures, loadFixtures }

async function loadAllFixtures() {
    const connection = await getConnection()

    await clearTables('measurements', connection)
    await clearTables('meters', connection)
    await clearTables('locations', connection)
    await clearTables('users', connection)
    await clearTables('customers', connection)

    await loadFixtures('customers', connection)
    await loadFixtures('users', connection)
    await loadFixtures('locations', connection)
    await loadFixtures('meters', connection)
    await loadFixtures('measurements', connection)
}

async function clearTables(name, connection) {
    await connection.createQueryBuilder().delete().from(name).execute()
}

async function loadFixtures(name, connection) {
    connection = connection || await getConnection()

    const items = require(`./fixtures/${name}.json`)
    for (let item of items) {
        await connection.createQueryBuilder().insert().into(name).values(item).execute()
    }
    await updatePKSequenceVal(name, connection)
}

async function updatePKSequenceVal(name, connection) {
    const query = `SELECT setval('${name}_id_seq', (SELECT MAX(id) FROM ${name}))`
    await connection.query(query)
}

if (require.main === module) {
    loadAllFixtures()
        .then(() => {
            process.exit(0)
        }).catch((error) => {
            console.error(error)
            process.exit(1)
        })
}
