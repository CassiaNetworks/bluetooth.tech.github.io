var config = {
  visoTemplate: {}
};
// 连接线样式

// 鼠标放在连接线上的样式

// 端点颜色样式 
const paintStyle = {
  strokeStyle: '#000',
  stroke: '#999', // border颜色
  fill: '#d9d9d9',// 端点颜色
  fillStyle: '#000',
  radius: 5, // 大小
  lineWidth: 20
};

// 鼠标放在端点上的样式 
const hoverPaintStyle = {
  outlineStroke: '#ff7f0e', 
  stroke: '#ff7f0e' 
};
// 连接线的样式
const connectorStyle = {
  stroke: '#36648B',
  strokeWidth: 3
};
// 鼠标防砸爱连接点上的样式
const connectorHoverStyle = { 
  stroke: '#43CD80'
};

// 箭头等
const connectorOverlays = [
    ['Arrow', {
      width: 12,
      length: 12,
      location: 1
    }],
    // ['Arrow', {
    //   width: 10,
    //   length: 10,
    //   location: 0.2
    // }],
    // ['Arrow', {
    //   width: 10,
    //   length: 10,
    //   location: 0.7
    // }],
    ['Label', {
      label: '',
      cssClass: '',
      labelStyle: {
        color: 'red'
      },
      events: {
        click: function (labelOverlay, originalEvent) {
          console.log('click on label overlay for :' + labelOverlay.component);
          console.log(labelOverlay);
          console.log(originalEvent);
        }
      }
    }]
  ];


config.baseStyle = {
  connector: ['Bezier', { }],
  paintStyle: paintStyle, // 端点的颜色样式
  hoverPaintStyle: hoverPaintStyle,// 鼠标在端点上的颜色
  isSource: true, // 是否可以拖动（作为连线起点）
  isTarget: true, // 是否可以放置（连线终点）
  maxConnections: -1, // 设置连接点最多可以连接几条线
  connectorOverlays: connectorOverlays
};

config.baseArchors = ['RightMiddle', 'LeftMiddle'];

config.input = {
  // scope:['123','456'],
  connectorStyle: connectorStyle,
  connectorHoverStyle: connectorHoverStyle,
  connector: ['Bezier', { }],
  paintStyle: paintStyle, // 端点的颜色样式
  hoverPaintStyle: hoverPaintStyle,// 鼠标在端点上的颜色
  isSource: false, // 是否可以拖动（作为连线起点）
  isTarget: true, // 是否可以放置（连线终点）
  maxConnections: 1, // 设置连接点最多可以连接几条线
  connectorOverlays: connectorOverlays
};
config.output = {
  // scope:['123','456'],
  connectorStyle: connectorStyle,
  connectorHoverStyle: connectorHoverStyle,
  connector: ['Bezier', { }],
  paintStyle: paintStyle, // 端点的颜色样式
  hoverPaintStyle: hoverPaintStyle,// 鼠标在端点上的颜色
  isSource: true, // 是否可以拖动（作为连线起点）
  isTarget: false, // 是否可以放置（连线终点）
  maxConnections: -1, // 设置连接点最多可以连接几条线
  connectorOverlays: connectorOverlays
}

export default config
