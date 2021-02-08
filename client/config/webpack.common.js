const merge = require("webpack-merge")
const CircularDependencyPlugin = require("circular-dependency-plugin")
const webpack = require("webpack")
const ESLintPlugin = require("eslint-webpack-plugin")
const paths = require("./paths")

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.js.flow$/,
        loader: "ignore-loader"
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      },
      {
        test: /\.(m?js|jsx)$/,
        include: [paths.appSrc, paths.testSrc],
        use: [
          "thread-loader",
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              // see https://github.com/facebook/create-react-app/issues/6846
              cacheCompression: false
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        // Based on https://github.com/facebook/create-react-app/pull/3776
        include: /node_modules/,
        use: [
          "thread-loader",
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              compact: false,
              presets: [require.resolve("babel-preset-react-app/dependencies")],
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader"
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  }
}

module.exports = {
  clientConfig: merge.merge(commonConfig, {
    target: ["web", "es5"],
    resolve: {
      alias: { vm: "vm-browserify" }
    },
    entry: {
      anet: [require.resolve("./polyfills"), "./src/index.js"]
    },
    // A strange workaround for a strange compile-time bug:   Error in
    // ./~/xmlhttprequest/lib/XMLHttpRequest.js   Module not found: 'child_process'
    // in ./node_modules/xmlhttprequest/lib This fix suggested in:
    // https://github.com/webpack/webpack-dev-server/issues/66#issuecomment-61577531
    externals: [
      {
        xmlhttprequest: "{XMLHttpRequest:XMLHttpRequest}"
      }
    ],
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      }),
      new ESLintPlugin(),
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd()
      }) /* ,
      new CopyWebpackPlugin({
        patterns: [{ from: "public", globOptions: { ignore: ["index.html"] } }]
      }) */
    ],
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename]
      }
    }
  })
}
