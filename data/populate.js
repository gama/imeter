const DataStore = require('../src/lib/nedb-promise')
const config    = require('../src/config')

module.exports = populate

async function populate(name, db=null, {verbose=true, autoload=true, ...opts}={}) {
    db = db || new DataStore({
        filename: `${config.dbBaseDir}/.${name}.db`,
        autoload: autoload,
        ...opts
    })

    const initialEntries = require(`${config.dbBaseDir}/${name}.js`)
    const entries = await db.insert(initialEntries)
    if (verbose)
        console.log('inserted %s: %o', name, entries)

    return db
}

// ----- main -----
if (require.main === module)
    Promise.all([
        populate('users'),
        // populate('xyz'), ...
    ]).catch((err) => { throw err })
