function config() {
    jest.doMock('../../src/config', () => {
        const { resolve } = require('path')
        return {
            ...jest.requireActual('../../src/config'),
            env:       'TEST',
            dbBaseDir: resolve(__dirname, '../data')
        }
    })
}

// function baseModel() {
//     jest.doMock('../../src/api/models/base', () => {
//         const populate  = require('../../data/populate')
//         const BaseModel = jest.requireActual('../../src/api/models/base')

//         class MockBaseModel extends BaseModel {
//             constructor(name, opts={}) {
//                 super(name, {...opts, inMemoryOnly: true, autoload: false})
//                 this._name = name
//                 this.reset()
//             }

//             reset() {
//                 this.remove({}, {multi: true})
//                 populate(this._name, this, {verbose: false}).catch((err) => { throw err })
//             }
//         }

//         return MockBaseModel
//     })
// }

function authMiddleware(username='admin') {
    jest.doMock('../../src/api/auth', () => {
        const { getRepository } = require('typeorm')
        return {
            ...jest.requireActual('../../src/api/auth'),
            verifyJwt: () => async (ctx, next) => {
                const Users = getRepository('User')
                const user  = await Users.findOne({username: username})
                ctx.state.jwt = user.token
                return next()
            }
        }
    })
}

function defaults() {
    config()
    // baseModel()
}

function mock(...names) {
    for (const name of names)
        mocks[name]()
}

const mocks = {
    config,
    // baseModel,
    authMiddleware,
    defaults,
    mock,
}
module.exports = mocks
