# debugger-vue

## Project setup
```
nvm use 10
yarn install
npm update --depth 5 @babel/compat-data
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
此版本为ac打包debugger2专用版本，做了如下修改：
1. 修改cdn方式为本地缓存文件方式
2. 右上角增加old version链接
3. 支持ac web上网关点击后自动填写为ac方式、dev配置、网关mac、语言

### Electron 桌面应用构建

环境准备（首次需要）：
```
nvm use 18
yarn electron:install
```

开发调试：
```
yarn electron:dev
```

正式打包（产物输出到 release/ 目录）：
```
yarn electron:build
```