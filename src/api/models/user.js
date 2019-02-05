const { loadDb } = require('../db')

const UsersDb = loadDb('users')
UsersDb.save  = (user) => UsersDb.update({ _id: user._id }, user)

module.exports = UsersDb
