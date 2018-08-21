import X from 'xlsx'
function doFile (files, outputType, fn) {
  const rABS =
    typeof FileReader !== 'undefined' &&
    (FileReader.prototype || {}).readAsBinaryString
  const f = files[0]
  const reader = new FileReader()
  reader.onload = function (e) {
    let data = e.target.result
    if (!rABS) {
      data = new Uint8Array(data)
    }
    const output = processWb(X.read(data, { type: rABS ? 'binary' : 'array' }), outputType)
    fn && fn(output)
  }
  if (rABS) {
    reader.readAsBinaryString(f)
  } else {
    reader.readAsArrayBuffer(f)
  }
}

const processWb = (() => {
  //   const get_format = (function () {
  //     // var radios = document.getElementsByName("format");
  //     return function () {
  //       // for (var i = 0; i < radios.length; ++i) if (radios[i].checked || radios.length === 1) return radios[i].value;
  //       return 'json';
  //     };
  //   })();

  const toJson = function toJson (workbook) {
    const result = {}
    workbook.SheetNames.forEach(sheetName => {
      const roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1
      })
      if (roa.length) result[sheetName] = roa
    })
    // return JSON.stringify(result, 2, 2);
    return result
  }

  // const to_csv = function to_csv(workbook) {
  //     var result = [];
  //     workbook.SheetNames.forEach(sheetName => {
  //         var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
  //         if (csv.length) {
  //             result.push("SHEET: " + sheetName);
  //             result.push("");
  //             result.push(csv);
  //         }
  //     });
  //     return result.join("\n");
  // };

  return function processWb (wb, outputType) {
    let output = ''
    switch (outputType) {
      case 'json':
        output = toJson(wb)
        break
      default:
        // output = to_csv()
        break
    }
    return output

    // let viewStr = ''
    // Object.keys(output).forEach(sheet => {
    //   const _ul = document.createElement('ul')
    //   output[sheet].forEach(el => {
    //     const _li = document.createElement('li')
    //     _li.innerHTML = JSON.stringify(el)
    //     _ul.appendChild(_li)
    //   })
    //   OUT.appendChild(_ul)
    // })
    // console.log(output)
    // if (typeof console !== 'undefined') console.log('output', new Date())
  }
})()

export { doFile }
