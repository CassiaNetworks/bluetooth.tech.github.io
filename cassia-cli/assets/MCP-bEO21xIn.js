import{j as e}from"./jsx-runtime-u17CrQMm.js";const t={title:"MCP Server",order:2};function r(s){const n={a:"a",code:"code",figure:"figure",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...s.components},{Info:a}=n;return a||i("Info"),e.jsxs(e.Fragment,{children:[e.jsxs(n.h1,{id:"mcp-server",children:["MCP Server",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#mcp-server",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsx(n.p,{children:"Adds MCP protocol server support (via HTTP), allowing other LLM Agents to directly control the gateway through natural language."}),`
`,e.jsxs(n.h2,{id:"start-command",children:["Start Command",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#start-command",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsxs(n.p,{children:["The following example demonstrates usage ",e.jsx(n.strong,{children:"inside a gateway container"}),"."]}),`
`,e.jsx(a,{children:e.jsxs(n.p,{children:["For ",e.jsx(n.strong,{children:"downloading the command-line tool"})," or ",e.jsx(n.strong,{children:"running locally on a PC"})," to access other gateways, please refer to the ",e.jsx(n.strong,{children:"Quick Start"})," guide for environment variable configuration."]})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Start the HTTP service inside the container"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"./cassia"}),e.jsx(n.span,{style:{color:"#032F62"},children:" ai"}),e.jsx(n.span,{style:{color:"#032F62"},children:" mcp"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --port"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" 3000"})]})]})})}),`
`,e.jsxs(n.h2,{id:"using-with-cursor",children:["Using with Cursor",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#using-with-cursor",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Configure MCP"}),`
`]}),`
`,e.jsx("img",{src:"./cursor-1.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Fill in the configuration"}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{children:"192.168.0.22"})})})})," is the IP address of your gateway."]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'  "mcpServers"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "CassiaGateway"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'      "url"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"http://192.168.0.22:3000/mcp"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Enable manually"}),`
`]}),`
`,e.jsxs(n.p,{children:["After starting, you should see that ",e.jsx(n.strong,{children:"61 tools"})," are available."]}),`
`,e.jsx("img",{src:"./cursor-2.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Test messages"}),`
`]}),`
`,e.jsx("img",{src:"./cursor-3.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.h2,{id:"using-with-n8n",children:["Using with n8n",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#using-with-n8n",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Create a new workflow"}),`
`]}),`
`,e.jsx("img",{src:"./n8n-1.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Configure the MCP Client"}),`
`]}),`
`,e.jsx("img",{src:"./n8n-2.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{children:"192.168.0.22"})})})})," is the IP address of your gateway."]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Test messages"}),`
`]}),`
`,e.jsx("img",{src:"./n8n-3.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.h2,{id:"using-with-vscode",children:["Using with VSCode",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#using-with-vscode",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsx(a,{children:e.jsx(n.p,{children:`Initial testing may require permissions.
You can try using your own account following the steps below.`})}),`
`,e.jsx("img",{src:"./vscode-1.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"./vscode-2.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"./vscode-3.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"./vscode-4.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.h2,{id:"additional-notes",children:["Additional Notes",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#additional-notes",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsx(n.p,{children:"You can configure dedicated sub-MCP services by using subpaths to access specific tools."}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# BLE operations"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"http://IP:3000/mcp/gateway/ble"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# Gateway container management"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"http://IP:3000/mcp/gateway/container"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# More subcommands / tools"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# ..."})})]})})}),`
`,e.jsx("br",{}),`
`,e.jsx("br",{})]})}function d(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}function i(s,n){throw new Error("Expected component `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}export{d as default,t as frontmatter};
