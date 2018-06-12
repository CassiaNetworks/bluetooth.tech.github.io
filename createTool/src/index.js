import jqui from './lib/jquery-ui-1.12.1.custom/jquery-ui.min.css';
import css from './css/index.css';
import jsPconfig from './js/jsPlumb.config.js';
import modleConfig from './js/modle.config.js';
import editors from './js/editor.js';
import editorStr from './js/editorStr.js';

import {
  createModle,
  getModles,
  removeModle,
  getModle
} from './js/modle.js';

// import reseauInit from './js/reseauInit.js';

const firstInstance = jsPlumb.getInstance({});



firstInstance.bind("click", function (conn, originalEvent) {
  console.log('connector --> click', $(this), '\n conn:', conn);

  /*
    TODO
    firstInstance.deleteConnection(conn);
  */
});

/*
  连接事件
*/
firstInstance.bind('connection', function (connInfo, originalEvent) {
  let sourceId = connInfo.sourceId;
  let targetId = connInfo.targetId;
  let sourceType = $(`#${sourceId}`).attr('name');
  let targetType = $(`#${targetId}`).attr('name');
  let downstreams = modleConfig[sourceType].downstream;
  let downstreamId = modleConfig[targetType].id;

  console.log('info,info', connInfo);
  // console.log(
  //   'sourceType:', sourceType,
  //   '\n sourceId:', sourceId,
  //   '\n targetType:', targetType,
  //   '\n targetId:', targetId,
  //   '\n downstreams', downstreams,
  //   '\n downstreamId', downstreamId);

  if (sourceId == targetId) {
    firstInstance.deleteConnection(connInfo.connection);
    alert("不能连接自己！");
  }
  if (!downstreams.includes(downstreamId)) {
    firstInstance.deleteConnection(connInfo.connection);
    alert('这两个模块不能连接！');
    return;
  }
  let n = 0;
  firstInstance.getAllConnections().forEach(function (item, idx, arr) {
    if (item.sourceId === sourceId && item.targetId === targetId) {
      n++;
    }
  });
  if (n > 1) {
    firstInstance.deleteConnection(connInfo.connection);
    alert('请不要重复连接');
    return;
  }
  let sourceModle = getModle(sourceId);
  let targetModle = getModle(targetId);

  targetModle.flow.inputType = sourceModle.flow.outputType;
  // console.log('-----------------------', sourceModle, targetModle, sourceModle.outputType);
  !sourceModle.flow.todoList[0].nextIds.success.includes(Number(targetId)) && sourceModle.flow.todoList[0].nextIds.success.push(Number(targetId));

});

/*
  删除事件
*/
firstInstance.bind("connectionDetached", function (conn, originalEvent) {
  if (conn.sourceId === conn.targetId) {  //自己连接自己时会自动取消连接
    return;
    console.log('童心未泯的广言，看我龟派气功');

  }
  alert("删除连接从" + conn.sourceId + "到" + conn.targetId + "！");
});




// reseauInit(); // svg wang ge 
// 左侧list item开启关闭动画
$('.palette-container-header').on('click', function () {
  $(this).next().toggle('blind', {}, 300);
  $(this).find('i').toggleClass("expanded", 3000);
  // console.log($(this).find('i'));
});

// 模块拖动
$('.ui-draggable').draggable({
  helper: "clone",
  scope: "plant",
  scroll: true,
  zIndex: 1
});

// 放入事件
$('.ui-droppable').droppable({
  accept: '.ui-draggable',
  scope: "plant",
  drop: function (event, ui) {
    let _newModle = createModle($('#innerCanvas'), ui);
    jsPmodleInit(_newModle);
  }
});


function jsPmodleInit(m) {
  // console.log('jsPmodleInit', m);
  const modleType = m.attr('name');
  jsPconfig.input.Scope = modleType;
  jsPconfig.output.Scope = modleType;
  switch (modleConfig[m.attr('name')].point) {
    case '00':
      firstInstance.addEndpoint(m, {
        anchors: "LeftMiddle"
      }, jsPconfig.input);
      break;
    case '01':
      firstInstance.addEndpoint(m, {
        anchors: "RightMiddle"
      }, jsPconfig.output);
      break;
    case 'FF':
      firstInstance.addEndpoint(m, {
        anchors: "LeftMiddle"
      }, jsPconfig.input);
      firstInstance.addEndpoint(m, {
        anchors: "RightMiddle"
      }, jsPconfig.output);
      // firstInstance.addEndpoint(m, {
      //   anchors: "TopRight"
      // }, jsPconfig.output);
      break;
  }
  firstInstance.draggable(m);
  // m.draggable({
  //   containment: "parent",
  //   drag: function(event, ui) {
  //     firstInstance.repaintEverything();
  //   },
  //   stop: function() {
  //     firstInstance.repaintEverything();
  //   }
  // });
}

// // 连接线的点击事件
// $('body').on('click', '.jtk-connector', function(a) {
//   console.log(a);
//   alert('TODO');
//   // firstInstance.remove($(this));
//   // $(this).remove();
// });
/*
  取消editor
*/
$(".shade").on('click', function () {
  $("#editor-stack").hide();
  $(".shade").hide();
  return false;
});

/*
  新元素双击事件
*/
$('body').on('dblclick', '.newModle', function () {
  let s = firstInstance.select();
  //TODO
  $("#editor-stack").show();
  $(".shade").show();
  editors.selected = $(this);
  const modleType = $(this).attr('name');
  const modleId = $(this).attr('id');
  const _modle = getModle(modleId)
  let str = editors[modleType].show(_modle); // 传入之前保存的信息
  $('#dialog-form').empty().append(str);
  $('#editor_title').html(`编辑${modleType}节点`);
  $('#node-input-name').val(_modle.name);
  let that = $(this);
});

/*
    dialog 删除事件
*/
$('#node-dialog-delete').on('click', function () {
  $("#editor-stack").hide();
  $(".shade").hide();
  removeModle(editors.selected);
  firstInstance.remove(editors.selected);
  let allConnections = firstInstance.getAllConnections();
  return false;
});
/*
  dialog 取消事件
*/
$('#node-dialog-cancel').on('click', function () {
  $("#editor-stack").hide();
  $(".shade").hide();
});
/*
  dialog 保存事件
*/
$('#node-dialog-ok').on('click', function () {
  let mId = editors.selected.attr('id');
  let mType = editors.selected.attr('name');
  let mName = $('#node-input-name').val();
  // console.log('dailog - save', mId, mType, mName, editors[mType]);
  if (mName !== '') {
    editors.selected.find('.palette_label').html(mName);
  }
  const _modle = getModle(mId);
  _modle.name = mName;
  _modle.editorContent.content = editors[mType].html2Obj($('#dialog-form'));
  editors[mType].final(_modle);
  $("#editor-stack").hide();
  $(".shade").hide();
});
/*
  editor item remove
*/
$('body').on('click', '.red-ui-editableList-item-remove', function () {
  $(this).parent().remove();
});
/*
  editor item add
*/
$('body').on('click', '.red-ui-editableList-addButton', function () {
  let m = editors.selected;
  let type = m.attr('name');
  let list = $(this).parent().find('ol').find('li');
  $(this).parent().find('ol').append(editorStr[type].itemStr(list.length));
});
/*
scan write  & | 切换
*/
$('body').on('click', '.red-ui-editableList-button-logic', function () {
  $(this).html() === '&amp;' ? $(this).html('|') : $(this).html('&amp;');
});
/*
  function 模块选择outputType
*/
$('body').on('change', '.ace_editor_text_output select', function () {
  $('.red-ui-editor-fn-outputType').html($(this).val());
  console.log($('.red-ui-editor-fn-outputType'))
  console.log($(this).val());
});
/*
  function return content
*/
$('body').on('keyup', '.ace_editor_text_input input', function () {
  $('.red-ui-editor-fn-content').html($(this).val());
});

function urlSearch2obj(str) {  
  if(str == undefined) return  
  str = str.substr(1)  
  var arr = str.split("&"),  
      obj = {},  
      newArr = []  
  arr.map(function(value,index,arr){  
   newArr = value.split("=")  
   if(newArr[0] != undefined) {  
    obj[newArr[0]] = newArr[1]  
  }  
})  
return obj  
} 

$('#test').on('click', function () {
  const tree = saveTree();
  const id = urlSearch2obj(window.location.search).id;
  const body = {
    id,
    enable: 1
  }
  startBi(body).then(data => {
    startTest(tree);
  });
  
})

function startBi(body){
  return $.ajax({
    type: 'put',
    data: JSON.stringify(body),
    url: `/bi/${body.id}`,
    timeout: 10000,
    success: function(data){
      console.log('test send ok',data);
    },
    error: function(err) {
      console.log('test send err', err);
    }
  })
}
function startTest(tree){
  setTimeout(function(){
    $.ajax({
      type: 'post',
      data: JSON.stringify(tree),
      url: 'http://127.0.0.1:8081/bi/api',
      timeout: 10000,
      success: function(data){
        console.log('startTest send ok',data);
      },
      error: function(err) {
        console.log('startTest send err', err);
      }
    })
  },3000)
 
}

/*
  最后点击save生成的代码
*/
$('#save').on('click', function () {
  console.log('save,save,save',saveTree())
});
function saveTree(){
  let _modles = getModles();
  let result = {
    'startId': []
  };
  for (let item in _modles) {
    result[item] = {
      "toolFile": _modles[item].flow.toolFile,
      "inputType": _modles[item].flow.inputType,
      "outputType": _modles[item].flow.outputType,
      "todoList": _modles[item].flow.todoList
    };
    if (!_modles[item].flow.inputType || _modles[item].flow.inputType === 'auto') {
      result.startId.push(_modles[item].id);
    }
  }
  return resule;
  // console.log('save-save-save', JSON.stringify(result, null, 2));
  // console.log('hahaha',result)
}

// TODO
$('.body').on('click', '.newModle', function (event) {
  console.log(event.target);
  // let selectedModle = $(this).find('.newModle-selected');
  if (event.keyCode === 8) {
    console.log('不管怎么样，先删了再说', selectedModle);
    // removeModle(editors.selected);
    // firstInstance.remove(editors.selected);
  }
});



/*jsPlumb.ready(function() {
  console.log('jsPlumb init', jsPlumb);
});*/