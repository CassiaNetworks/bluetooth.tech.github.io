import {
  getModles
} from './modle.js';
import editorStr from './editorStr.js';
import modleConfig from './modle.config.js';

const editorSelect = {
  '&amp;': '&&',
  '|': '||',
  'deviceMac': 'deviceMac',
  'routerMac': 'routerMac',

  'name': 'name',
  'rssi': 'rssi',
  'type': 'type',
  'evt_type': 'evt_type',
  'adData': 'adData',
  'scanData': 'scanData',
  'eq': '==',
  'neq': '!=',
  'lt': '<',
  'lte': '<=',
  'gt': '>',
  'gte': '>=',
  'nmatch': '!match()',
  'match': 'match()',
  'default': '',
  'store': 'store.',
  'fn_arr': 'fn_arr.',
  'fn_obj': 'fn_obj.',
  'fn_str': 'fn_str',
  'fn_bool': 'fn_bool'
};

const editor = {
  selected: null
};

let nameStr = `
  <div class="form-row">
    <label for="node-input-name">
      <span>名称</span>
    </label>
    <input type="text" id="node-input-name" data-i18n="[placeholder]node-red:common.label.name" dir="" placeholder="名称">
  </div>
`;

editor.httpServer = {
  final: function(modle) {
    let content = modle.editorContent.content;
    let params = `[{'path': '${content[0].url}'}]`;
    modle.flow.todoList[0].params = params;
  },
  html2Obj: function(dom) {
    let url = dom.find('.editor-httpServer-url').val();
    let obj = [{
      'url': url
    }];
    return obj;
  },
  obj2Html: function(obj) {

  },
  show: function(modle) {
    let contentStr = `
      <div class="form-row">
        <label>Triger:</label>
        <label style="margin-left: 100px;">${modle.flow.inputType || 'aotu'}</label>
      </div>
      <div class="form-row">
        <label>Input Content:</label>
        <label  style="margin-left: 100px;">auto</label>
      </div>
      
      
        <div class="form-row">
          <label for="node-input-name">
            <span>URL:</span>
          </label>
          <input class="editor-httpServer-url" type="text"  data-i18n="[placeholder]node-red:common.label.url" dir="" placeholder="http://127.0.0.1:8081/bi/api/xxx">
        </div>
      

      <div class="form-row">
        <label>Output Type:</label>
        <label style="margin-left: 100px;">httpServer</label>
      </div>
      <div class="form-row">
        <label>Output Content:</label>
        <label style="margin-left: 100px;" >httpServer</label>
      </div>
    `
    let dom = $(nameStr + contentStr);
    let content = modle.editorContent.content;
    content.length && dom.find('.editor-httpClient-url').val(content[0].url);
    return dom;
  }
};
editor.httpClient = {
  final: function(modle) {
    let content = modle.editorContent.content;
    let params = `[{'path': '${content[0].url}'}]`;
    modle.flow.todoList[0].params = params;
  },
  html2Obj: function(dom) {
    let url = dom.find('.editor-httpClient-url').val();
    let obj = [{
      'url': url
    }];
    return obj;
  },
  obj2Html: function(obj) {},
  show: function(modle) {
    let contentStr = `
      <div class="form-row">
        <label>Triger:</label>
        <label style="margin-left: 100px;">${modle.flow.inputType || '未指定'}</label>
      </div>
      <div class="form-row">
        <label>Input Content:</label>
        <label  style="margin-left: 100px;">未指定</label>
      </div>
      
      <div class="form-row">
        <label for="node-input-name">
          <span>URL:</span>
        </label>
        <input type="text" class="editor-httpClient-url" data-i18n="[placeholder]node-red:common.label.name" dir="" placeholder="http://127.0.0.1:8081/bi/api/xxx">
      </div>
      
      <div class="form-row">
        <label>Output Type:</label>
        <label style="margin-left: 100px;">httpServer</label>
      </div>
      <div class="form-row">
        <label>Output Content:</label>
        <label style="margin-left: 100px;" >httpServer</label>
      </div>
    `
    let dom = $(nameStr + contentStr);
    let content = modle.editorContent.content;
    content.length && dom.find('.editor-httpClient-url').val(content[0].url);
    return dom;
  }
};
editor.scan = {
  final: function(modle) {
    let content = modle.editorContent.content;
    let p = ``;
    content.forEach(function(item, idx, arr) {
      let tempStr = '';
      if (item.judge === 'match') {
        tempStr = item.filterType + `.match('${item.input}')`;
      } else {
        tempStr = item.filterType + editorSelect[item.judge] + `'${item.input}'`;
      }

      if (!idx) {
        p += tempStr;
        (item.filterType + editorSelect[item.judge] + item.input);
        //TODO
      } else {
        p += (editorSelect[item.logic] + tempStr);
      }
    });
    if(!content.length){
      p = `return true`;
    }
    let fn = `if(${p}){return true}`;
    console.log('scan final', fn);
    modle.flow.todoList[0].function = fn;
  },
  html2Obj: function(dom) {
    let lis = dom.find('ol').find('li');
    let obj = [];
    for (let item of lis) {
      obj.push({
        'logic': $(item).find('.red-ui-editableList-button-logic').html(),
        'filterType': $(item).find('select').eq(0).val(),
        'judge': $(item).find('select').eq(1).val(),
        'input': $(item).find('.node-input-rule-value').val()
      });
    }
    return obj;
  },
  obj2Html: function(obj) {},
  show: function(modle) {
    console.log(modle.flow.inputType);
    let contentStr = `
    <div class="form-row">
      <label>Triger:</label>
      <label style="margin-left: 100px;">${modle.flow.inputType || 'auto'}</label>
    </div>
    <div class="form-row">
      <label>Input Content:</label>
      <label  style="margin-left: 100px;">未指定</label>
    </div>

    <div class="form-row node-input-rule-container-row">
      <div class="red-ui-editableList">
        <div class="red-ui-editableList-border red-ui-editableList-container" style="min-height: 250px; max-height: none;overflow-y: scroll; height: 270px;">
          <ol id="node-input-rule-container" class="red-ui-editableList-list ui-sortable" style="min-height: 0px; min-width: 410px; height: auto;">
          
          </ol>
        </div>

        <a href="#" class="editor-button red-ui-editableList-addButton" style="margin-top: 4px;">
          <i class="fa fa-plus"></i> 
          +添加条件
        </a>
      </div>
    </div>

    <div class="form-row">
      <label>Output Type:</label>
      <label style="margin-left: 100px;">${modle.outputType || 'ScanData'}</label>
    </div>
    <div class="form-row">
      <label>Output Content:</label>
      <label style="margin-left: 100px;"  >ScanData</label>
    </div>`;
    let dom = $(nameStr + contentStr);
    const content = modle.editorContent.content;

    if (content.length === 0) {
      dom.find('ol').append(editorStr.scan.itemStr(0));
    } else {
      content.forEach(function(item, idx, arr) {
        dom.find('ol').append(editorStr.scan.itemStr(idx));
        dom.find('li').eq(idx).find('.red-ui-editableList-button-logic').html(item.logic);
        dom.find('li').eq(idx).find('select').eq(0).val(item.filterType);
        dom.find('li').eq(idx).find('select').eq(1).val(item.judge);
        dom.find('li').eq(idx).find('.node-input-rule-value').val(item.input);
      });
    }
    return dom;
  }
};
editor.notify = {
  final: function(modle) {
    let fn = `return true`;
    modle.flow.todoList[0].function = fn;
  },
  html2Obj: function(dom) {},
  obj2Html: function(obj) {},
  show: function(modle) {
    let contentStr = `
      <div class="form-row">
        <label>Triger:</label>
        <label style="margin-left: 100px;">${modle.flow.inputType || 'auto'}</label>
      </div>
      <div class="form-row">
        <label>Input Content:</label>
        <label  style="margin-left: 100px;">未指定</label>
      </div>
      <div class="form-row">
        <label>Output Type:</label>
        <label style="margin-left: 100px;">NofificationData</label>
      </div>
      <div class="form-row">
        <label>Output Content:</label>
        <label style="margin-left: 100px;"  >NofificationData</label>
      </div>
    `
    let str = nameStr + contentStr;

    return str;
  }
};
editor.connect = {
  final: function(modle) {
    let content = modle.editorContent.content;
    let p = ``;
    content.forEach(function(item, idx, arr) {
      let tempStr = '';
      if (item.judge === 'match') {
        tempStr = item.filterType + `.match('${item.input}')`;
      } else {
        tempStr = item.filterType + editorSelect[item.judge] + `'${item.input}'`;
      }

      if (!idx) {
        p += tempStr;
        (item.filterType + editorSelect[item.judge] + item.input);
        //TODO
      } else {
        p += (editorSelect[item.logic] + tempStr);
      }
    });
    if(!content.length){
      p = `return true`;
    }
    let fn = `if(${p}){return true}`;
    console.log('scan final', fn);
    modle.flow.todoList[0].function = fn;
  },

  html2Obj: function(dom) {
    let lis = dom.find('ol').find('li');
    let obj = [];
    for (let item of lis) {
      obj.push({
        'logic': $(item).find('.red-ui-editableList-button-logic').html(),
        'filterType': $(item).find('select').eq(0).val(),
        'judge': $(item).find('select').eq(1).val(),
        'input': $(item).find('.node-input-rule-value').val()
      });
    }
    return obj;
  },
  obj2Html: function(obj) {},
  show: function(modle) {
    let contentStr = `
    <div class="form-row">
      <label>Triger:</label>
      <label style="margin-left: 100px;">${modle.flow.inputType || '未指定'}</label>
    </div>
    <div class="form-row">
      <label>Input Content:</label>
      <label  style="margin-left: 100px;">未指定</label>
    </div>

    <div class="form-row node-input-rule-container-row">
      <div class="red-ui-editableList">
        <div class="red-ui-editableList-border red-ui-editableList-container" style="min-height: 250px; max-height: none;overflow-y: scroll; height: 270px;">
          <ol id="node-input-rule-container" class="red-ui-editableList-list ui-sortable" style="min-height: 0px; min-width: 410px; height: auto;">
          
          </ol>
        </div>

        <a href="#" class="editor-button red-ui-editableList-addButton" style="margin-top: 4px;">
          <i class="fa fa-plus"></i> 
          +添加条件
        </a>
      </div>
    </div>

    <div class="form-row">
      <label>Output Type:</label>
      <label style="margin-left: 100px;">${modle.outputType || 'ScanData'}</label>
    </div>
    <div class="form-row">
      <label>Output Content:</label>
      <label style="margin-left: 100px;"  >ScanData</label>
    </div>`;
    let dom = $(nameStr + contentStr);
    const content = modle.editorContent.content;

    if (content.length === 0) {
      dom.find('ol').append(editorStr.connect.itemStr(0));
    } else {
      content.forEach(function(item, idx, arr) {
        dom.find('ol').append(editorStr.connect.itemStr(idx));
        dom.find('li').eq(idx).find('.red-ui-editableList-button-logic').html(item.logic);
        dom.find('li').eq(idx).find('select').eq(0).val(item.filterType);
        dom.find('li').eq(idx).find('select').eq(1).val(item.judge);
        dom.find('li').eq(idx).find('.node-input-rule-value').val(item.input);
      });
    }
    return dom;
  }
};

editor.write = {
  final: function(modle) {
    let content = modle.editorContent.content;
    let p = [];
    content.forEach(function(item, idx, arr) {
      p.push(
        {
          'handle': item.handle,
          'value': editorSelect[item.valueSource] + item.value
        }
      );
    });
    console.log('write final', JSON.stringify(p,null,2));
    let fn = `return ${p.toString()}`;
   
    modle.flow.todoList[0].function = fn;
  },
  html2Obj: function(dom) {
    let lis = dom.find('ol').find('li');
    let obj = [];
    for (let item of lis) {
      obj.push({
        'handle': $(item).find('.red-ui-typedInput-handle').val(),
        'valueSource': $(item).find('select').val(),
        'value': $(item).find('.red-ui-typedInput-value').val()
      });
    }
    return obj;
  },
  obj2Html: function(obj) {},
  show: function(modle) {

    let contentStr = `
      <div class="form-row">
        <label>Triger:</label>
        <label style="margin-left: 100px;">${modle.flow.inputType || '未指定'}</label>
      </div>
      <div class="form-row">
        <label>Input Content:</label>
        <label  style="margin-left: 100px;">未指定</label>
      </div>

     <div class="form-row node-input-rule-container-row">
      <div class="red-ui-editableList" name="">
        <div class="red-ui-editableList-border red-ui-editableList-container" style="min-height: 250px; max-height: none;overflow-y: scroll; height: 270px;">
          <ol id="node-input-rule-container" class="red-ui-editableList-list ui-sortable" style="min-height: 0px; min-width: 410px; height: auto;">

          </ol>
        </div>
        <a href="#" class="editor-button red-ui-editableList-addButton" style="margin-top: 4px;">
          <i class="fa fa-plus"></i> 
          +添加条件
        </a>
      </div>
    </div>

      <div class="form-row">
        <label>Output Type:</label>
        <label style="margin-left: 100px;">Status</label>
      </div>
      <div class="form-row">
        <label>Output Content:</label>
        <label style="margin-left: 100px;"  >Status</label>
      </div>`;
    // ${editorStr.write.itemStr(0)};
    let dom = $(nameStr + contentStr);

    const content = modle.editorContent.content;
    if (content.length === 0) {
      dom.find('ol').append(editorStr.write.itemStr(0));
    } else {
      content.forEach(function(item, idx, arr) {
        dom.find('ol').append(editorStr.write.itemStr(idx));
        dom.find('li').eq(idx).find('.red-ui-typedInput-handle').val(item.handle);
        dom.find('li').eq(idx).find('select').val(item.valueSource);
        dom.find('li').eq(idx).find('.red-ui-typedInput-value').eq(1).val(item.value);
      });
    }
    return dom;
  }

};
editor.disconnect = {
  final: function(modle) {
    let fn = `return true`;
    modle.flow.todoList[0].function = fn;
  },
  html2Obj: function(dom) {},
  obj2Html: function(obj) {},
  show: function(modle) {
    let contentStr = `
      <div class="form-row">
        <label>Triger:</label>
        <label style="margin-left: 100px;">${modle.flow.inputType || '未指定'}</label>
      </div>
      <div class="form-row">
        <label>Input Content:</label>
        <label  style="margin-left: 100px;">未指定</label>
      </div>
      <div class="form-row">
        <label>Output Type:</label>
        <label style="margin-left: 100px;">Status</label>
      </div>
      <div class="form-row">
        <label>Output Content:</label>
        <label style="margin-left: 100px;"  >Status</label>
      </div>
    `
    let str = nameStr + contentStr;

    return str;
  }
};
editor.fn = {
  final: function(modle) {
    let content = modle.editorContent.content;
    let params = modleConfig.fn.inputTypes2value[modle.flow.inputType];
    let fn_content = content[0].fn_content.split('\n');
    let str = ''
    fn_content.forEach(function(item,idx,arr){
        str += item;
    });
    let fn = `${str.replace(/\s+/g, ' ')} return ${content[0].outputContent};`;
    
    modle.flow.todoList[0].function = fn;
    console.log(fn_content);
  },
  html2Obj: function(dom) {
    let obj = [];
    obj.push({
      outputType: dom.find('.red-ui-editor-fn-outputType').html(),
      outputContent: dom.find('.red-ui-editor-fn-content').html(),
      fn_content: dom.find('textarea').val(),
    });
    return obj;
  },
  obj2Html: function(obj) {},
  show: function(modle) {

    let param = editorStr.fn.itemStr(modle.flow.inputType);
    let contentStr = `
      <div class="form-row">
        <label>Triger:</label>
        <label style="margin-left: 100px;">${modle.flow.inputType || '未指定'}</label>
      </div>

      <div class="form-row editor_fn_params">
        <label>Input Params:</label>
        ${param}
      </div>
      
      
      <div class="form-row node-input-rule-container-row">
        <div class="red-ui-editableList">

          <div class="form-row" style="margin-bottom: 0px;">
            <label for="node-input-func"><i class="fa fa-wrench"></i> <span data-i18n="node-red:function.label.function">function ( ) {</span></label>
            <input type="hidden" id="node-input-func" autofocus="autofocus" value=" return ;" dir="">
            <input type="hidden" id="node-input-noerr" value="0" dir="" class="input-error">
          </div>


          <div class="form-row node-text-editor-row">
            <div style="height: 244px; min-height: 150px;" class="node-text-editor ace_editor ace-tomorrow" id="node-input-func-editor">
              <div class="ace_gutter"></div>

              <div class="ace_editor_textarea">
                <textarea></textarea>
              </div>
              
              <div class="ace_editor_text_output">
                <div class="ace_editor_text_output_return">
                  <label style="width:auto">return</label>
                </div>

                <div class="red-ui-typedInput-container ace_editor_text_input" style="width: 94px; margin-right: 0px; margin-left: 5px;">
                  <div class="red-ui-typedInput-input" style="left: 0px;right: 0px;">
                    <input class="node-input-rule-value red-ui-typedInput" type="text" style="margin-left: 0px; margin-right: 0px;" value="msg">
                  </div>
                </div>

                <div class="ace_editor_text_output_type">
                  <label style="width:auto">outputType</label>
                </div>

                <select style="width: 94px; margin-left: 5px; text-align: center; id="">
                  <optgroup>
                    <option value="fn_obj">fn_obj</option>
                    <option value="fn_arr">fn_arr</option>
                    <option value="fn_str">fn_str</option>
                    <option value="fn_bool">fn_bool</option>
                    
                  </optgroup>
                </select>
                
              </div>
            </div>
          </div>

          <div class="form-row" style="margin-top: 0px;">
            <label for="node-input-func"><i class="fa fa-wrench"></i> <span>}</span></label>
          </div>
          

        </div>
      </div>

      <div class="form-row">
        <label>Output Type:</label>
        <label style="margin-left: 100px;" class="red-ui-editor-fn-outputType">fn_obj</label>
      </div>
      <div class="form-row">
        <label>Output Content:</label>
        <label style="margin-left: 100px;" class="red-ui-editor-fn-content">msg</label>
      </div>`;

    let dom = $(nameStr + contentStr);


    const content = modle.editorContent.content;
    if (content.length !== 0) {
      dom.find('.red-ui-editor-fn-outputType').html(content[0].outputType);
      dom.find('.ace_editor_text_output select').val(content[0].outputType);
      dom.find('.red-ui-editor-fn-content').html(content[0].outputContent);
      dom.find('.ace_editor_text_input input').val(content[0].outputContent);
      dom.find('textarea').val(content[0].fn_content);
    }

    console.log(dom);
    return dom;
  }
};

export default editor;