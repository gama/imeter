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
    // await updatePKSequenceVal(name, connection, 1)
}

async function loadFixtures(name, connection) {
    connection = connection || await getConnection()

    const items = require(`./fixtures/${name}.json`)
    for (let item of items)
        executeEnforcingIds(connection.createQueryBuilder().insert().into(name).values(item))
    await updatePKSequenceVal(name, connection)
}

async function updatePKSequenceVal(name, connection, value) {
    if (value === undefined)
        value = `(SELECT MAX(id) FROM ${name})`
    const query = `SELECT setval('${name}_id_seq', ${value})`
    await connection.query(query)
}

async function executeEnforcingIds(query) {
    const columns = query.expressionMap.mainAlias.metadata.primaryColumns
    columns.forEach(col => { [col._orig, col.isGenerated] = [col.isGenerated, false] })
    await query.execute()
    columns.forEach(col => { col.isGenerated = col._orig; delete col._orig })
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
