const { getConnection } = require('../src/api/db')

module.exports = { loadAllFixtures, loadFixtures }

async function loadAllFixtures() {
    const queryRunner = await getQueryRunner()

    await clearTables('measurements', queryRunner)
    await clearTables('meters', queryRunner)
    await clearTables('locations', queryRunner)
    await clearTables('users', queryRunner)
    await clearTables('customers', queryRunner)

    await loadFixtures('customers', queryRunner)
    await loadFixtures('users', queryRunner)
    await loadFixtures('locations', queryRunner)
    await loadFixtures('meters', queryRunner)
    await loadFixtures('measurements', queryRunner)

    queryRunner.release()
}

async function getQueryRunner() {
    const connection    = await getConnection()
    const queryRunner   = connection.createQueryRunner()
    queryRunner.builder = () => queryRunner.manager.createQueryBuilder()
    return queryRunner
}

async function clearTables(name, queryRunner) {
    await queryRunner.builder().delete().from(name).execute()
}

async function loadFixtures(name, queryRunner) {
    if (!queryRunner) {
        queryRunner = await getQueryRunner()
        queryRunner._created = true
    }

    const items = require(`./fixtures/${name}.json`)
    executeEnforcingIds(queryRunner.builder().insert().into(name).values(items))
    await updatePKSequenceVal(name, queryRunner)

    if (queryRunner._created)
        queryRunner.release()
}

async function updatePKSequenceVal(name, queryRunner) {
    await queryRunner.query(`SELECT setval('${name}_id_seq', (SELECT MAX(id) FROM ${name}))`)
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
