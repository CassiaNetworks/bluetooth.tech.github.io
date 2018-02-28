#  demo项目说明
## 项目介绍
- 使用nodejs+express实现web服务，后台主要作用是向浏览器发送静态网页，在浏览器端向hub发送指令（连接，读取数据，断开连接，等等）。本项目支持多台hub与手环交互，采用云端+本地方式控制hub
-  hub与各个蓝牙设备的控制逻辑采用模块化思想编写
## 前端主要技术：
- 使用webpack打包前端资源
- 使用npm管理第三方包依赖
- babel转换es6语法
- 使用mvc框架backbone框架进行数据与视图分离
- 使用jquery工具库简化js操作
- 使用自己编写的工具库api.js简化hub SDK调用
##  后端技术
- 
- 


## 前端目录结构说明
```
├─build # 编译后生成的所有代码、资源（图片、字体等，虽然只是简单的从源目录迁移过来）
├─node_modules # 利用npm管理的所有包及其依赖
├─vendor # 所有不能用npm管理的第三方库
├─.babelrc # babel的配置文件
├─.eslintrc # ESLint的配置文件
├─index.html # 仅作为重定向使用
├─package.json # npm的配置文件
├─webpack.config.js # webpack的配置文件
├─src # 当前项目的源码
    ├─pages # 各个页面独有的部分，如入口文件、只有该页面使用到的css、模板文件等
    │  ├─alert # 业务模块
    │  │  └─index # 具体页面
    │  ├─index # 业务模块
    │  │  ├─index # 具体页面
    │  │  └─login # 具体页面
    │  │      └─templates # 如果一个页面的HTML比较复杂，可以分成多块再拼在一起
    │  └─user # 业务模块
    │      ├─edit-password # 具体页面
    │      └─modify-info # 具体页面
    └─public-resource # 各个页面使用到的公共资源
        ├─components # 组件，可以是纯HTML，也可以包含js/css/image等
        │  ├─footer # 页尾
        │  ├─header # 页头
        │  ├─side-menu # 侧边栏
        │  └─top-nav # 顶部菜单
        ├─config # 各种配置文件
        ├─iconfont # iconfont的字体文件
        ├─imgs # 公用的图片资源
        ├─layout # UI布局，组织各个组件拼起来，因应需要可以有不同的布局套路
        │  ├─layout # 具体的布局
        │  └─layout-without-nav # 具体的布局
        ├─sass # sass文件，sass或纯css文件
        │  ├─base-dir
        │  ├─components-dir # 如果组件本身不需要js的，要加载组件的css比较困难，可以直接用sass来加载
        │  └─base.sass# 组织所有的sass文件
        ├─libs # 与业务逻辑无关的库都放到这里
        └─logic # 业务逻辑
```
## CLI命令（npm scripts）
|命令|作用&效果|
|---------------- |---------------|
|`npm install`    |根据`package.json`，安装项目依赖 |
|`npm run build`  |根据`webpack.config.js`，build出一份生产环境的代码 |
| `npm run dev`   | 根据`webpack.dev.config.js`，build出一份开发环境的代码 |
| `npm run start` | 开启webpack-dev-server并自动打开浏览器，自动监测源码变动并实现LiveReload，**实际开发时使用此项** |


## 使用说明
- 下载本项目所有依赖
```
npm install
```
- 启动服务器
```
npm run start
```