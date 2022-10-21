### webpack配置中的loader及其作用
Loader就是将Webpack不认识的内容转化为认识的内容,因为webpack 默认支持处理JS与JSON文件，其他类型都处理不了，这里必须借助Loader来对不同类型的文件的进行处理,如常见:
  1. css-loader 处理css
  2. style-loader 以style标签的形式将css样式加载到页面上
  3. postcss-loader 自动添加css3部分属性的浏览器前缀
  4. sass-loader/less-loader 处理less和sass
  5. file-loader 解决图片引入问题，将图片拷贝到指定目录，默认为dist
  6. url-loader 与file-loader类似，图片小于limit值时，将图片转为base64编码
  7. img-loader 压缩图片
  8. babel-loader 使用babel加载es2015+代码并转化为es5

> webpack5 新增资源模块(asset module)，允许使用资源文件（字体，图标等）而无需配置额外的 loader
> 1. asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
> 2. asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
> 3. asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能.
> 4. asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource

### webpack配置中的plugin及其作用
与Loader用于转换特定类型的文件不同，插件（Plugin）可以贯穿Webpack打包的生命周期，执行不同的任务
  1. html-webpack-plugin 用于将css或js文件自动引入到html中
  2. clean-webpack-plugin 每次打包的时候，打包目录都会遗留上次打包的文件，为了保持打包目录的纯净，我们需要在打包前将打包目录清空
  3. mini-css-extract-plugin 以css文件的形式将css样式加载到页面上(MiniCssExtractPlugin.loader)
  4. optimize-css-assets-webpack-plugin 压缩css
  5. purgecss-webpack-plugin 单独提取 CSS 并清除用不到的 CSS

### webpack配置中的plugin和loader的区别
### 如何编写 Loader ? 介绍一下思路？
### 如何编写 Plugin ? 介绍一下思路？
### Webpack optimize 有配置过吗？可以简单说说吗？
### Webpack 层面如何性能优化？
### Webpack 打包流程是怎样的？
### tree-shaking 实现原理是怎样的？

### Webpack 热更新（HMR）是如何实现？
webpack-dev-server提供了一个基本的 web server，并且具有实时重新加载功能
```
module.export = {
    devServer: {
        contentBase: './dist',
        hot: true, // 热更新
      },
}
```

### Webpack 打包中 Babel 插件是如何工作的？
### Webpack 和 Rollup 有什么相同点与不同点？
### Webpack5 更新了哪些新特性？

### prefetch和preload
  + prefetch(预获取) : 浏览器空闲的时候进行资源的拉取
  ```
  // 但是如果需要异步加载的文件比较大时，在点击的时候去加载也会影响到我们的体验，这个时候我们就可以考虑使用 prefetch 来进行预拉取
  img.addEventListener('click', () => {
    import( /* webpackPrefetch: true */ './desc').then(({ default: element }) => {
      console.log(element)
      document.body.appendChild(element)
    })
  })
  ```
  + preload（预加载） : 提前加载后面会用到的关键资源，因为会提前拉取资源，如果不是特殊需要，谨慎使用