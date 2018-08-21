const config = {
  interface: {
    name: 'Interface',
    items: [
      {
        type: 'Http Server',
        name: 'httpServer',
        iconfont: '&#xe62e;',
        backgroundColor: 'rgba(242,135,135,1)',
        ports: ['palette_port_output']
      },
      {
        type: 'Http Client',
        name: 'httpClient',
        iconfont: '&#xe62e;',
        backgroundColor: 'rgba(135,172,242,1)',
        ports: ['palette_port_input']
      },
      {
        type: 'Charts',
        name: 'charts',
        iconfont: '&#xe620;',
        backgroundColor: 'rgba(255,192,203,1)',
        ports: ['palette_port_input']
      }
    ]
  },
  bluetooth: {
    name: 'Bluetooth',
    items: [
      {
        type: 'Scan',
        name: 'scan',
        iconfont: '&#xe626;',
        backgroundColor: 'rgba(156,205,221,1)',
        ports: ['palette_port_output', 'palette_port_input']
      },
      {
        type: 'Notify',
        name: 'notification',
        iconfont: '&#xe60a;',
        backgroundColor: 'rgba(220,208,131,1)',
        ports: ['palette_port_output', 'palette_port_input']
      },
      {
        type: 'Connect',
        name: 'connect',
        iconfont: '&#xe61e;',
        backgroundColor: 'rgba(221,187,156,1)',
        ports: ['palette_port_output', 'palette_port_input']
      },
      {
        type: 'Write',
        name: 'write',
        iconfont: '&#xe612;',
        backgroundColor: 'rgba(155,221,156,1)',
        ports: ['palette_port_output', 'palette_port_input']
      },
      {
        type: 'Disconnect',
        name: 'disconnect',
        iconfont: '&#xe78a;',
        backgroundColor: 'rgba(205,169,204,1)',
        ports: ['palette_port_output', 'palette_port_input']
      }
    ]
  },
  'function': {
    name: 'Function',
    items: [
      {
        type: 'Function',
        name: 'function',
        iconfont: '&#xe88a;',
        backgroundColor: 'rgba(192,192,192,1)',
        ports: ['palette_port_output', 'palette_port_input']
      }
    ]
  }

}

const paletteInit = (function(config) {
  const paletteContainer = $('#palette-container')
  function itemPortsInit(ports) {
    let t = ``
    ports.forEach(el => {
      t += `<div class="palette_port ${el}" style="top: 10px;"></div>`
    })
    return t
  }
  function itemInit(o) {
    let tempStr = ``
    o.forEach(({ type, name, iconfont, backgroundColor, ports }) => {
      tempStr += `
            <div class="palette_node ui-draggable" style="background-color: ${backgroundColor}" name="${name}">
                <div class="palette_label" dir>${type}</div>
                <div class="palette_icon_container">
                    <div class="palette_icon">
                        <i class="iconfont">${iconfont}</i>
                    </div>
                </div>
                ${itemPortsInit(ports)}
            </div>
            `
    })
    return tempStr
  }
  return function paletteInit() {
    console.log(config)
    Object.keys(config).forEach(el => {
      config[el]
      const str = `
            <div id="palette-container-${el}" class="palette-category">
            <!-- palette-container-${el}-header-->
            <div id="palette-container-${el}-header" class="palette-container-header">
              <i class="fa fa-angle-down expanded"></i>
              <span>${config[el].name}</span>
            </div>
            <!-- palette-container-content -->
            <div id="palette-container-${el}-content" class="palette-container-content">
              <!-- palette-Interface -->
              <div id="palette-${el}">
                ${itemInit(config[el].items)}
              </div>
            </div>
          </div> 
            `
      paletteContainer.append(str)
    })
  }
})(config)

export default paletteInit
