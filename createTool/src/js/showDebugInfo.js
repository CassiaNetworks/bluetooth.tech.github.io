import { list } from "../../node_modules/postcss";
import {
  getModle
} from './modle.js';
const debugInfo = {
  defaultHistory: []
};

function debugHighlight(jsPlumbInstance, info) {
  console.log('showDebugInfo.js debugHighlight', info);
  const id = info.id + '';
  const state = info.state;
  const modle = getModle(id);
  const endpoints = modle.endpoints.map(el => el.canvas);

  if (!debugInfo[id]) {
    debugInfo[id] = { timer: null, historyData: [] };
  };
  debugInfo[id].historyData.push(info);
  debugInfo.defaultHistory.push(info);

  if (state === 'start') {
    if (!debugInfo[id].timer) {
      debugInfo[id].timer = _startBlank($(`#${id}`), endpoints);
    };
  }
  if (state === 'end') {
    debugInfo[id].timer && clearInterval(debugInfo[id].timer);
    debugInfo[id].timer = null;
  }
  $(`#debug-help`).find('.debug-help-none').remove();
  if ($('.newModle-selected').length) {
    if($('.newModle-selected').attr('id') === id){
      const str = `<p>${JSON.stringify(info, null, 2)}</p>`
      $('#debug-help').append(str);
    }
  } else {
    const str = `<p>${JSON.stringify(info, null, 2)}</p>`
    $('#debug-help').append(str);
  }
};

/**
 * @param {* $dom} modle 
 * @param {* dom} endpoints \
 * 当有debug信息到来时，让对应的模块闪烁；
 */
function _startBlank(modle, endpoints) {
  const blankCss = { opacity: 0.4 };
  const firstCss = { opacity: 1 };
  function _blank(m, p) {
    $(m).animate(blankCss, "slow").animate(firstCss, "slow");
    p.forEach(el => {
      $(el).animate(blankCss, "slow").animate(firstCss, "slow");
    });
  }
  
  _blank(modle, endpoints);
  const timer = setInterval(_blank, 1000, modle, endpoints);
  return timer;
}``

function showDebug() {

}

function defaultDebugInfo() {
  const dom = `
    <table class="node-info">
      <tbody>
        <tr class="node-info-node-row">
          <td>流程</td>
          <td>
            <span class="debug-message-element debug-message-top-level">
              <span class="debug-message-row">
                <span class="debug-message-object-value">
                  <span class="debug-message-type-string debug-message-object-header">"0000000000000"</span>
                </span>
              </span>
            </span>
          </td>
        </tr>
        <tr class="node-info-node-row">
          <td>名称</td>
          <td>流程1</td>
        </tr>
        <tr class="node-info-node-row">
          <td>状态</td>
          <td>启用</td>
        </tr>
      </tbody>
    </table>
  `
  $('#debug-content-info').empty().append(dom);

  let helpDom = '';
  if (debugInfo.defaultHistory.length) {
    debugInfo.defaultHistory.forEach( el => {
      helpDom += `<p>${JSON.stringify(el,null,2)}</p>`;
    })
  } else {
    helpDom = `<p class="debug-help-none">无</p>`;
  }

  $(`#debug-help`).empty().append(helpDom);
}
function nodeDebugInfo(node) {
  const dom = `
    <table class="node-info">
      <tbody>
        <tr class="node-info-node-row">
          <td>节点</td>
          <td>
            <span class="debug-message-element debug-message-top-level">
              <span class="debug-message-row">
                <span class="debug-message-object-value">
                  <span class="debug-message-type-string debug-message-object-header">"${node.id}"</span>
                </span>
              </span>
            </span>
          </td>
        </tr>
        <tr class="node-info-node-row">
          <td>类型</td>
          <td>${node.type}</td>
        </tr>
      </tbody>
    </table>
  `
  $('#debug-content-info').empty().append(dom);
  let helpDom = '';
  if (debugInfo[node.id] && debugInfo[node.id].historyData.length) {
    debugInfo[node.id].historyData.forEach( el => {
      helpDom += `<p>${JSON.stringify(el,null,2)}</p>`;
    })
  } else {
    helpDom = `<p class="debug-help-none">无</p>`;
  }

  $(`#debug-help`).empty().append(helpDom);
}

function getDebugInfo() {
  return debugInfo;
}


export {
  defaultDebugInfo,
  debugHighlight,
  getDebugInfo,
  nodeDebugInfo
};