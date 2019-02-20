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

function authMiddleware(userName='Admin') {
    jest.doMock('../../src/api/auth', () => {
        const { getRepository } = require('typeorm')
        return {
            ...jest.requireActual('../../src/api/auth'),
            verifyJwt: () => async (ctx, next) => {
                const firstName = (typeof(userName) === 'function') ? userName() : userName
                const user      = await getRepository('User').findOne({firstName: firstName})
                ctx.state.jwt   = user.authToken
                ctx.state.user  = user
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
    // baseModel,
    authMiddleware,
    defaults,
    mock,
}
module.exports = mocks
