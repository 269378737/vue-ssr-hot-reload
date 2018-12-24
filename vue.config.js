const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const merge = require('lodash.merge');

const TARGET_NODE = process.env.WEBPACK_TARGET === 'node';

const target = TARGET_NODE ? 'server' : 'client';

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  baseUrl: './',
  devServer: {
    disableHostCheck: true, // 解决热更新失效问题
    // headers: { 'Access-Control-Allow-Origin': '*' } // 可解决热更新文件不能正常访问问题
  },
  assetsDir: "static",
  productionSourceMap: false,
  configureWebpack: () => ({
    mode: 'production',
    entry: `./src/entry-${target}`,
    devtool: isDev ? 'source-map' : undefined, // 可能导致css样式无法正常渲染，部署到生产环境应屏蔽
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    plugins: [
      TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
      new CompressionPlugin({
        // 打包时启用gzip压缩
        minRatio: 1,
      }),
    ],
    externals: TARGET_NODE
      ? nodeExternals({
        whitelist: /\.css$/,
      })
      : undefined,
    output: {
      libraryTarget: TARGET_NODE ? 'commonjs2' : undefined,
    },
  }),
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => merge(options, {
        optimizeSSR: false,
      }));
  },
};
