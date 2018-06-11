function reseauInit() {
  console.log('reseauInit');
  let lineX = '';
  let lineY = '';
  for(let i = 0; i < 5000; i+= 20){
    lineX += `<line class="horizontal" x1="0" x2="5000" y1="${i}" y2="${i}" fill="none" shape-rendering="crispEdges" stroke="#eee" stroke-width="1px"></line>`;
    lineY += `<line class="horizontal" x1="${i}" x2="${i}" y1="0" y2="5000" fill="none" shape-rendering="crispEdges" stroke="#eee" stroke-width="1px"></line>`;
  }

  $('#chart').append(`
	<svg width="5000" height="5000" pointer-events="all" style="cursor:crosshair" id="chart_svg">
	  <g>
	    <g class="innerCanvas" transorm="scale(1)">
	      <rect width="5000" height="5000" fill="#fff"></rect>
	      <g style="visibility: visible;" id="reseau">${lineX}${lineY}</g>	     
	    </g>
	  </g>
	</svg>
    `);
}
export default 	reseauInit;
/*
	创建图形
	document.createElementNS(ns,tagName)

	添加图形
	element.appendChild(childElement)

	设置/获取属性
	element.setAttribute(name, value)
	element.getAttribute(name)

*/