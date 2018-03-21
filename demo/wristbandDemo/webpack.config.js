module.exports = {
    entry: require('./webpack-config/entry.config'),
    output: require('./webpack-config/output.config'),
    module: require('./webpack-config/module.product.config'),
    resolve: require('./webpack-config/resolve.config'),
    plugins: require('./webpack-config/plugins.product.config'),
    externals: require('./webpack-config/externals.config'),
    devtool:'nosources-source-map'
}