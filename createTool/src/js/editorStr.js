import modleConfig from './modle.config.js';
const editorStr = {};

editorStr.scan = {
  contentStr: function() {

  },
  itemStr: function(idx) {

    let str = `<li class="red-ui-editableList-item-sortable red-ui-editableList-item-removable">
            <div class="red-ui-editableList-item-content" style="overflow: hidden; white-space: nowrap;">
              <div>
                <bottun class="red-ui-editableList-button-logic" style="${idx ? '' : 'visibility:hidden;'}">|</bottun>
                <select style="width: 74px; margin-left: 5px; text-align: center;">
                    <option value="deviceMac">deviceMac</option>
                    <option value="routerMac">routerMac</option>
                    <option value="name">Name</option>
                    <option value="rssi">Rssi</option>
                    <option value="type">Type</option>
                    <option value="evt_type">evt_type</option>
                    <option value="adData">AdData</option>
                    <option value="scanData">ScanData</option>
                 
                </select>
             
                <select style="width: 74px; margin-left: 5px; text-align: center;">
                  <optgroup>
                    <option value="eq">==</option>
                    <option value="neq">!=</option>
                    <option value="lt">&lt</option>
                    <option value="lte">&lt=</option>
                    <option value="gt">&gt</option>
                    <option value="gte">&gt=</option>
                    <option value="match">match()</option>
                    
                  </optgroup>
                </select>

                <div class="red-ui-typedInput-container" style="width: 196px; margin-right: 0px; margin-left: 5px;">
                  <div class="red-ui-typedInput-input" style="left: 0px;right: 0px;">
                    <input class="node-input-rule-value red-ui-typedInput" type="text" style="margin-left: 0px; margin-right: 0px;">
                  </div>
                </div>
              </div>
            </div>
            <a href="#" class="red-ui-editableList-item-remove editor-button editor-button-small">
              <i class="fa fa-remove"></i>
            </a>
          </li>`;
    return str;
  }
};

editorStr.write = {
  contentStr: function() {

  },
  itemStr: function(len) {
    let str = 
      `<li class="red-ui-editableList-item-sortable red-ui-editableList-item-removable">
        <div class="red-ui-editableList-item-content" style="overflow: hidden; white-space: nowrap;">
          <div>
            <span class="red-ui-typedInput-span-handle">
              handle:
            </span>
            <div class="red-ui-typedInput-container" style="width: 50px;; margin-right: 0px; margin-left: 5px;">
              <div class="red-ui-typedInput-input" style="left: 0px;right: 0px;">
                <input class="node-input-rule-value red-ui-typedInput-handle" type="text" style="margin-left: 0px; margin-right: 0px;">
              </div>
            </div>
            <span class="red-ui-typedInput-span-value">
              value:
            </span>
            <div class="red-ui-typedInput-container" style="width: 196px; margin-right: 0px; margin-left: 5px;">
              <button style="padding-left:0px" type="button">
                <select class="red-ui-typed-select">
                  <optgroup>
                    <option value="default">default</option>
                    <option value="store">store.</option>
                    <option value="fn_arr">fn_arr.</option>
                    <option value="fn_obj">fn_obj.</option>
                    <option value="fn_str">fn_str.</option>

                  </optgroup>
                </select>
              </button>
              <div class="red-ui-typedInput-input" style="left: 47px;right: 0px;">
                <input class="node-input-rule-value red-ui-typedInput-value" type="text" style="margin-left: 0px; margin-right: 0px;">
              </div>
            </div>
          </div>
        </div>
        <a href="#" class="red-ui-editableList-item-remove editor-button editor-button-small">
          <i class="fa fa-remove"></i>
        </a>
      </li>`;
    return str;
  }
};


editorStr.connect = {
  contentStr: function() {

  },
  itemStr: function(idx) {
    
    let str = `<li class="red-ui-editableList-item-sortable red-ui-editableList-item-removable">
            <div class="red-ui-editableList-item-content" style="overflow: hidden; white-space: nowrap;">
              <div>
                <bottun class="red-ui-editableList-button-logic" style="${idx ? '' : 'visibility:hidden;'}">|</bottun>
                <select style="width: 74px; margin-left: 5px; text-align: center;">
            
                    <option value="deviceMac">deviceMac</option>
                    <option value="routerMac">routerMac</option>
                    <option value="name">Name</option>
                    <option value="rssi">Rssi</option>
                    <option value="type">Type</option>
                    <option value="evt_type">evt_type</option>
                    <option value="adData">AdData</option>
                    <option value="scanData">ScanData</option>
                 
                </select>
             
                <select style="width: 74px; margin-left: 5px; text-align: center;">
                  <optgroup>
                    <option value="eq">==</option>
                    <option value="neq">!=</option>
                    <option value="lt">&lt</option>
                    <option value="lte">&lt=</option>
                    <option value="gt">&gt</option>
                    <option value="gte">&gt=</option>
                    <option value="match">match</option>
                    
                  </optgroup>
                </select>

                <div class="red-ui-typedInput-container" style="width: 196px; margin-right: 0px; margin-left: 5px;">
                  <div class="red-ui-typedInput-input" style="left: 0px;right: 0px;">
                    <input class="node-input-rule-value red-ui-typedInput" type="text" style="margin-left: 0px; margin-right: 0px;">
                  </div>
                </div>
              </div>
            </div>
            <a href="#" class="red-ui-editableList-item-remove editor-button editor-button-small">
              <i class="fa fa-remove"></i>
            </a>
          </li>`;
    return str;
  }
};


editorStr.function = {
  contentStr: function() {

  },
  itemStr: function(inputType) {

    let obj = modleConfig.function.inputTypes2value;
    let str = ``;
    if(!obj[inputType]){
      obj.scanData.forEach(function(item,idx,arr){
        str += `<label class="editor_fn_params_item">${item}</label>`;
      });
    }else{
      obj[inputType].forEach(function(item,idx,arr){
        str += `<label class="editor_fn_params_item">${item}</label>`;
      });
    }
    return str;
  }
};
export default editorStr;      