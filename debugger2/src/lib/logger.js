
// 生成带模块名称的日志对象, TODO: 使用logger
function genModuleLogger(moduleName) {
  return {
    debug: console.log.bind(this, `[${moduleName}]`),
    info: console.log.bind(this, `[${moduleName}]`),
    warn: console.log.bind(this, `[${moduleName}]`),
    error: console.log.bind(this, `[${moduleName}]`)
  };
}

export default {
  genModuleLogger,
}