const path = require('path')
const env  = process.env.NODE_ENV || 'development'

module.exports = {
    mode:   env,
    cache:  false,
    entry:  ['index.js'],
    watch:  env === 'development',
    output: {
        path:     path.resolve(__dirname, `../.next/server/static/${env}`),
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: [path.resolve(__dirname)],
            loader: 'babel-loader',
            options: {
                // presets: ['es2017']
            }
        }]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname)
        ],
        extensions: ['.js', '.jsx', '.json', '.css', '.sass', '.scss', '.html']
    }
}
