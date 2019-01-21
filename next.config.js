const getLocalIdent = require('css-loader/lib/getLocalIdent')
const withPreact    = require('@zeit/next-preact')
const withSass      = require('@zeit/next-sass')

module.exports = withPreact(withSass({
    cssLoaderOptions: {
        modules:        true,
        importLoaders:  1,
        localIdentName: "[local]___[hash:base64:5]",
        getLocalIdent:  (loaderContext, localIdentName, localName, options) => {
            return loaderContext.resourcePath.includes('.global.') ?
                   localName :
                   getLocalIdent(loaderContext, localIdentName, localName, options);
        }
    }
}))
