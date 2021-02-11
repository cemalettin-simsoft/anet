const merge = require("webpack-merge")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const common = require("./webpack.common.js")
const paths = require("./paths")

module.exports = merge.merge(common.clientConfig, {
  mode: "development",
  target: ["web"],
  resolve: {
    modules: [paths.appSrc, "node_modules"]
  },
  // not using source maps due to https://github.com/facebook/create-react-app/issues/343#issuecomment-237241875
  // switched from 'eval' to 'cheap-module-source-map' to address https://github.com/facebook/create-react-app/issues/920
  devtool: "cheap-module-source-map",
  output: {
    pathinfo: true,
    publicPath: "/",
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js"
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    contentBase: "public",
    port: 3000
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    new HtmlWebpackPlugin({
      publicUrl: "/",
      inject: true,
      template: "public/index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
})
