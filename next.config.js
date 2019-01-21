const withPreact = require('@zeit/next-preact')
const withSass   = require('@zeit/next-sass')

module.exports = withPreact(withSass({
    webpack(config, options) {
        // further custom configuration here
        return config
    }
}))
