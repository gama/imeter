const { resolve} = require('path')
const baseDir    = resolve(__dirname)
const dataStore  = require('nedb-promise')

populate('users')

async function populate(name) {
    const db = dataStore({filename: `${baseDir}/.${name}.db`, autoload: true})
    const initialEntries = require(`./${name}.js`)

    try {
        let entries = await db.find({})
        if (entries.length)
            printObj(`existing ${name}`, entries)
        else {
            entries = await db.insert(initialEntries)
            printObj(`inserted ${name}`, entries)
        }
    } catch (error) {
        console.log(error)
    }
}

function printObj(msg, obj) {
    console.log('%s: %o', msg, obj)
}
