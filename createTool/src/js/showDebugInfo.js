import { list } from "../../node_modules/postcss";

function debugHighlight(jsPlumbInstance, debugInfo) {
  console.log(debugInfo);
  const id = debugInfo.id;
  $('.newModle').removeClass('debug-newModle');
  $(`#${id}`).addClass('debug-newModle');
  jsPlumbInstance.repaintEverything();
  const li = `
    <p>
      ${JSON.stringify(debugInfo)}
    </p>
  `
  $('#debug-content').append(li);
};
export {
  debugHighlight
};