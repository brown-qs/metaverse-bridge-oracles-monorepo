const webpack = require('webpack');
//latest create-react-app uses webpack 5 which removes all nodejs poly fills
//until @web3 updates, we need to override the CRA webpack config
module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")
    })

    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        }),
    ])
    config.ignoreWarnings = (config.ignoreWarnings || []).concat([/Failed to parse source map/])
    return config;
}