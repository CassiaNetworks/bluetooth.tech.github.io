// 是否含有中文（也包含日文和韩文）
function isChineseChar (str) {
  const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
  return reg.test(str)
}
// 同理，是否含有全角符号的函数
function isFullwidthChar (str) {
  const reg = /[\uFF00-\uFFEF]/
  return reg.test(str)
}
// 将str转为unicode
function encodeUtf8 (data) {
  let val = ''
  for (let i = 0; i < data.length; i++) {
    let char = data[i]

    if (isChineseChar(char) || isFullwidthChar(char)) {
      if (val === '') {
        val = encodeURI(char)
          .split('%')
          .join(',')
      } else {
        val += encodeURI(char)
          .split('%')
          .join(',')
      }
    } else {
      if (val === '') {
        val = data.charCodeAt(i).toString(16)
      } else {
        val += ',' + data.charCodeAt(i).toString(16)
      }
    }
  }
  return val.split(',').join('')
}

export { encodeUtf8 }
