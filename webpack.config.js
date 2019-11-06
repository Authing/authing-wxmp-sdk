const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

const commonBrowserConfig = {
    entry: "./src/index.js",
    target: 'web',
    module: {
        rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BUILD_TARGET': JSON.stringify('web'),
            'process.env.VERSION': JSON.stringify(packageJson.version)
        })
    ]
}

const commonNodeConfig = {
    entry: './src/index.js',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: 'commonjs'
                            }
                        ]
                    ]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BUILD_TARGET': JSON.stringify('node'),
            'process.env.VERSION': JSON.stringify(packageJson.version)
        })
    ]
}

module.exports = [
    // browser - production
    {
        ...commonBrowserConfig,
        mode: 'production',
        output: {
            filename: 'authing-wxmp-sdk-browser.min.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'umd',
            library: 'AuthingWxmp'
        },
    },

    // browser - development
    {
        ...commonBrowserConfig,
        mode: "development",
        output: {
            filename: 'authing-wxmp-sdk-browser.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'umd',
            library: 'AuthingWxmp'
        },
    },

    // node - production
    {
        ...commonNodeConfig,
        mode: "production",
        output: {
            filename: 'authing-wxmp-sdk-node.min.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'commonjs2',
            library: 'AuthingWxmp'
        }
    },

    // node - development
    {
        ...commonBrowserConfig,
        mode: "development",
        output: {
            filename: 'authing-wxmp-sdk-node.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'commonjs2',
            library: 'AuthingWxmp'
        }
    }
]