const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 打包后的js、css资源文件自动引入html
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css
const TerserPlugin = require('terser-webpack-plugin');  // 在生成环境下打包默认会开启 js 压缩，但是当我们手动配置 optimization 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置
// const PurgeCSSPlugin = require('purgecss-webpack-plugin') // 单独提取 CSS 并清除用不到的 CSS
const glob = require('glob'); // 文件匹配模式

const { resolve } = require('path')
const isProd = process.env.NODE_ENV === 'prod'
const configuration = {
  mode : 'development', // 模式 development/production/none
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname,'dist') // 输出文件目录
  },
  devtool: isProd ? 'eval-cheap-module-source-map': false,
  module: {
    /**
     * 1.不需要解析依赖的第三方大型类库以及一般使用.min.js结尾的文件，都是已经经过模块化处理的，那么这个时候就没必要在进行loder或者webpack分析了等，可以通过这个字段进行配置，以提高构建速度
     * 2.使用 noParse 进行忽略的模块文件中不会解析 import、require 等语法
     */
    // noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          fileName: '[name][hash:8][ext]'
        },
        parser: {
          dataUrlCondition:{
            maxSize: 50 * 1024 // 超过50kb不转base64
          } 
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过100kb不转 base64
          }
        }
      },
      {
        test: /\.js$/i,
        include: resolve('src'), // 精确指定loader的作用目录或需要排除的目录
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', // 1.开启多进程打包,配置在 thread-loader 之后的 loader 都会在一个单独的 worker 池（worker pool）中运行 2.实际上在小型项目中，开启多进程打包反而会增加时间成本，因为启动进程和进程间通信都会有一定开销
            options: {
              worker: 3,
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true // babel 在转译 js 过程中时间开销比价大，将 babel-loader 的执行结果缓存起来，重新打包的时候，直接读取缓存
            }
          }
        ]
      }
    ]
  },
  externals:{ //从输出的 bundle 中排除依赖,通常用于排除cdn,我们可以用这样的方法来剥离不需要改动的一些依赖，大大节省打包构建的时间
    // vue: 'Vue'
  },
  resolve: {
    // 配置别名
    alias:{
      '@': resolve('src')
    },
    extensions: ['.js','...'], // 引入模块时没带扩展名,按照extensions配置的数组从左到右的顺序去尝试解析模块,可以用 ... 扩展运算符代表默认配置
    modules: [resolve('src'), 'node_modules'] // 告诉 webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
  },
  cache: {
    type: 'filesystem' // 缓存生成的 webpack 模块和 chunk，来改善构建速度
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCssAssetsPlugin({}),
      new TerserPlugin({})
    ],
    /**
     * optimization.splitChunks 是基于 SplitChunksPlugin 插件实现的
     * webpack 将根据以下条件自动拆分 chunks：
        1. 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
        2. 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
        3. 当按需加载 chunks 时，并行请求的最大数量<=30
        4. 当加载初始化页面时，并发请求的最大数量<=30
     */
    splitChunks: {
      cacheGroups: { // 配置提取模块的方案
        default: false,
        styles: {
          name: 'styles',
          test: /\.(s?css|less|sass)$/,
          chunks: 'all',
          enforce: true,
          priority: 10,
        },
        common: {
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          enforce: true,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 2,
          enforce: true,
          reuseExistingChunk: true,
        },
         // ... 根据不同项目再细化拆分内容
      },
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    // new webpack.IgnorePlugin({
      // resourceRegExp: /^\.\/locale$/, //  按照匹配条件，按需引入
      // contextRegExp: /moment$/,
    // }),
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${resolve('src')}/**/*`, {nodir: true})
    // }),
  ],
  devServer: {
    static: true,
    compress: true,
    port: 'auto'
  }
}

module.exports = (env, config) => {
  console.log(process.env.NODE_ENV, config.mode)
  return configuration
}