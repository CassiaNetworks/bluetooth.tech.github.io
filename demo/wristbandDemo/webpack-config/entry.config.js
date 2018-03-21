var path = require('path')
var dirVars = require('./base/dir-vars.config')
var pageArr = require('./base/page-entries.config')
var entry = {}
pageArr.forEach((page) => {
    entry[page] = path.resolve(dirVars.pagesDir, page + '/page')
})
module.exports = entry