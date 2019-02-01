const { resolve } = require('path')
const dataStore   = require('nedb-promise')

const baseDir = `${resolve(__dirname)}/../../data`
console.log('loading DB from: ', `${baseDir}/.users.db`)
const usersDb = dataStore({filename: `${baseDir}/.users.db`, autoload: true})

module.exports = { usersDb }
