# webpack-koa-hot-reload

## 为什么做了个

准备开发一个koa应用 应用技术为 koa + prisma + mysql 然后就是各种中间件来实现我的api服务。但是在开发阶段发现 koa-webpack 和web的一些插件
对于我来说好像不适用，因为我需要webpack来打包ts代码 然后输出为node平台运行。其他的中间件需要在koa中编写代码，这不是我想要的 我想要的只是一个
热重载，于是制作了这个小插件，如果你跟我一样希望使用webpack来打包koa应用 希望有热重载来方便开发 但又不想写侵入式代码 那就来试试吧

## 怎么使用

打开你的webpack.config.js 我用的是 webpack.config.ts

对应的引用方式为   

 ``` const WebpackKoaHotReload = require('webpack-koa-hot-reload')  ``` | ```  import WebpackKoaHotReload from 'webpack-koa-hot-reload' ``` 


### 完整示例

1.webpack.config.ts
 
```js
  import WebpackKoaHotReload from 'webpack-koa-hot-reload';
  
  
  const config: webpack.Configuration = {
  target:"node",
  ....
  watchOptions: {
    poll:1000,//监测修改的时间(ms)
    aggregateTimeout:500,//500毫秒内算按键一次
    ignored: /node_modules/,
  },
  plugins:[
    new WebpackKoaHotReload({
      main:'/dist/index.js',
      port:'3000',
    })
  ],
  module:{
    rules:[
      {
        test:/\.ts$/,
        use:'ts-loader',
        exclude:/node_modules/
      },
      {
        test: /\.ts$/,
        loader: 'lodash-ts-webpack-plugin',
        exclude: /node_modules/,
        enforce: 'pre'
      },
    ]
  },
  resolve:{
    extensions:['.ts','.js']
  }
};

export default config;
```
2.koa应用入口文件 一般为index.js/index.ts 最后一行app.listen请注意
```js
  import Koa from 'koa';
  import Router from 'koa-router'
  const app = new Koa();
  const router = new Router()
  router.get('/', async (ctx)=>{
    ctx.body = 'hello'
  })
  app.use(async ctx => {
    ctx.body = 'Hello';
  });
  app.listen(process.argv[2]);
```
需要其他配置请给我留言

### 插件参数

| 参数名 |  类型  | 默认值 | 必填 | 描述     |
| :----: | :----: | :----: | :--: | -------- |
|  main  | string |   无   |  是  | 入口文件                                                                                                               |
|  port  | number |  8573  |  否  | 端口                                                |
| delay  | number |   0    |  否  | 延迟重载                                                           |


--- enjoy ---

