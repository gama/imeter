const { resolve } = require('path')
const dataStore   = require('nedb-promise')
const baseDir     = `${resolve(__dirname)}/../../data`

const loadDb = (name, opts = {}) => {
    return dataStore({filename: `${baseDir}/.${name}.db`, autoload: true, ...opts})
}

module.exports = {dataStore, baseDir, loadDb}
