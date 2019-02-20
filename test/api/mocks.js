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

const firstName   = jest.fn(() => 'Admin')
const loginAs     = (name) => firstName.mockImplementation(() => name)
const loginOnceAs = (name) => firstName.mockImplementationOnce(() => name)

function authMiddleware() {
    jest.doMock('../../src/api/auth', () => {
        const { getRepository } = require('typeorm')
        return {
            ...jest.requireActual('../../src/api/auth'),
            verifyJwt: () => async (ctx, next) => {
                const user     = await getRepository('User').findOne({firstName: firstName()})
                ctx.state.jwt  = user.authToken
                ctx.state.user = user
                await next()
            },
            userAuth: () => async (ctx, next) => {
                await next()
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
    authMiddleware,
    loginAs,
    loginOnceAs,
    defaults,
    mock,
}
module.exports = mocks
