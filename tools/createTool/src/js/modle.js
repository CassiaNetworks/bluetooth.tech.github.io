import modleConfig from './modle.config.js';

const modles = {};
// 元素拖拽到画板上以后会创建一个新的 modle
function createModle(parent, ui) {
  // console.log('createModle', parent, ui);
  magic();
  let _newModle = newModleView(ui.draggable);
  _newModle.css({
    'top': ui.offset.top - $(parent).offset().top,
    'left': ui.offset.left - $(parent).offset().left,
    'position': 'absolute'
  });
  parent.append(_newModle);
  addModle(_newModle);
  return _newModle;
}

function magic() {
  $('body').find('.newModle').removeClass('newModle-selected');
};
function newModleView(dom) {
  let _newModle = dom.clone()
    .removeClass('palette_node')
    .addClass('newModle')
    .addClass('newModle-selected')
    .attr('id', Date.now());
    _newModle.find('.palette_port').remove();
  return _newModle;
}
function addModle (m) {
  console.log('addModle:', m, m.attr('id'),m.attr('name'));
  const modleType = m.attr('name');
  const modleId = m.attr('id');
  modles[modleId] = {
    id: modleId,
    type: modleType,
    name: '',
    editorContent: {
      content: []
    },
    flow: modleInit(modleType)
  };
}

function getModles() {
  return modles;
}

function getModle(id) {
  // console.log('getModle', modles[id]);
  return modles[id];
}
function removeModle(m) {
  // TODO
  const modleType = m.attr('name');
  const modleId = m.attr('id');
  modles[modleId] = null;
  delete modles[modleId];
}

function modleInit(type){
  let obj = {};
  obj.toolFile = type;
  obj.outputTypes = modleConfig[type].outputType;
  obj.inputType = modleConfig[type].inputType;
  obj.outputType = modleConfig[type].outputType[0];
  obj.todoList = [{
    'params': '',
    'function': '',
    'nextIds': {
      'success': [],
      'fail': []
    }
  }];
  return obj;
}

export {
  createModle,
  getModles,
  removeModle,
  getModle
};