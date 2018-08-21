import $ from 'jQuery'
$('body').append('<style>.wb-scr { width:65px; background:#000; color:#fff; font-family:Tahoma; font-size:14px; position:absolute; z-index:-1 ;visibility: hidden;}</style><div class="wb-scr"></div>'
)

function typograph (str) {
  function _space (l) {
    let s = ''
    for (let i = 0; i < l; i++) s += ' '
    return s
  }
  let MAX_WIDTH = 64
  let SPACE_WIDTH = 65 / 16
  let s = ''
  if (String(str).match('\r\n')) {
    s = String(str).split('\r\n')
  } else {
    s = String(str).split('\n')
  }
  $('.wb-scr').html('')
  for (let i of s) {
    $('.wb-scr').append('<div style="display:inline-block">' + i + '</div>')
  }
  let ls = $('.wb-scr')[0].children
  console.log(ls)
  for (let i = 0; i < ls.length; i++) {
    try {
      let w = $(ls[i]).width()
      console.log('wwwwwwwwwwww', ls, w)
      if (s[i].match('7')) w += 2
      //   /*if (s[i].match('B')) w += 2;
      //         if (s[i].match('M')) w += 2;
      //         if (s[i].match('W')) w += 2;
      //         if (s[i].match('Y')) w += 2;*/
      let suffix = parseInt((MAX_WIDTH - w) / SPACE_WIDTH)
      if (suffix > 0 && i < ls.length - 1) {
        s[i] += _space(suffix)
      }
    } catch (e) {
      continue
    }
  }
  return s.join('')
}

// const t = temp.map(el => {
//   return typograph(el)
// })
// console.log(t.join('\n'))
export default typograph
