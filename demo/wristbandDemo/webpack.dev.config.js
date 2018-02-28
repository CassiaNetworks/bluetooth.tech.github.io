module.exports = {
    entry: require('./webpack-config/entry.config'),
    output: require('./webpack-config/output.config'),
    module: require('./webpack-config/module.dev.config'),
    resolve: require('./webpack-config/resolve.config'),
    plugins: require('./webpack-config/plugins.dev.config'),
    externals: require('./webpack-config/externals.config'),
    devServer: require('./webpack-config/vendor/devServer.config'),
    devtool: 'source-map'
}