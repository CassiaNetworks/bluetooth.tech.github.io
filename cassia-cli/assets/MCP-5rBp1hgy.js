import{j as e}from"./jsx-runtime-u17CrQMm.js";const d={title:"MCP Server",order:2};function r(s){const n={a:"a",code:"code",figure:"figure",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...s.components},{Info:a}=n;return a||l("Info"),e.jsxs(e.Fragment,{children:[e.jsxs(n.h1,{id:"mcp-server",children:["MCP Server",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#mcp-server",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsx(n.p,{children:"增加MCP协议Server支持(HTTP方式)，可以使用其他LLM Agent直接通过自然语言操作网关。"}),`
`,e.jsxs(n.h2,{id:"启动命令",children:["启动命令",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#启动命令",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsxs(n.p,{children:["这里以",e.jsx(n.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{children:"网关容器"})})})}),"内作为示例说明使用方式。"]}),`
`,e.jsx(a,{children:e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"下载命令"}),"、",e.jsx(n.strong,{children:"本地PC运行"})," 访问操作其他网关请根据",e.jsx(n.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{children:"快速开始"})})})}),"配置环境变量即可"]})}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# 容器内启动HTTP服务"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#6F42C1"},children:"./cassia"}),e.jsx(n.span,{style:{color:"#032F62"},children:" ai"}),e.jsx(n.span,{style:{color:"#032F62"},children:" mcp"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" --port"}),e.jsx(n.span,{style:{color:"#005CC5"},children:" 3000"})]})]})})}),`
`,e.jsxs(n.h2,{id:"cursor使用",children:["Cursor使用",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#cursor使用",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"配置MCP"}),`
`]}),`
`,e.jsx("img",{src:"./cursor-1.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"填写内容"}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{children:"192.168.0.22"})})})}),"为网关IP地址"]}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'  "mcpServers"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'    "CassiaGateway"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(n.span,{"data-line":"",children:[e.jsx(n.span,{style:{color:"#005CC5"},children:'      "url"'}),e.jsx(n.span,{style:{color:"#24292E"},children:": "}),e.jsx(n.span,{style:{color:"#032F62"},children:'"http://192.168.0.22:3000/mcp"'})]}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"手动开启"}),`
`]}),`
`,e.jsx(n.p,{children:"启动后，正常可以看到这里显示有61个tools"}),`
`,e.jsx("img",{src:"./cursor-2.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"测试消息"}),`
`]}),`
`,e.jsx("img",{src:"./cursor-3.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.h2,{id:"n8n使用",children:["n8n使用",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#n8n使用",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"新建工作流"}),`
`]}),`
`,e.jsx("img",{src:"./n8n-1.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"配置MCP Client"}),`
`]}),`
`,e.jsx("img",{src:"./n8n-2.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{children:"192.168.0.22"})})})}),"为网关IP地址"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"测试消息"}),`
`]}),`
`,e.jsx("img",{src:"./n8n-3.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.h2,{id:"vscode使用",children:["VSCode使用",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#vscode使用",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsx(a,{children:e.jsx(n.p,{children:"初步测试可能需要权限，可以尝试使用自己的账号尝试，方式如下"})}),`
`,e.jsx("img",{src:"./vscode-1.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"./vscode-2.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"./vscode-3.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"./vscode-4.png",alt:"Example",width:"80%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(n.h2,{id:"其他说明",children:["其他说明",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#其他说明",children:e.jsx(n.span,{className:"icon icon-link"})})]}),`
`,e.jsx(n.p,{children:"支持配置单独子MCP服务，可以配置子路径方式使用部分工具调用"}),`
`,e.jsx(n.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(n.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(n.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# ble操作"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"http://IP:3000/mcp/gateway/ble"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# 网关容器"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6F42C1"},children:"http://IP:3000/mcp/gateway/container"})}),`
`,e.jsx(n.span,{"data-line":"",children:" "}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# 更多子命令/工具"})}),`
`,e.jsx(n.span,{"data-line":"",children:e.jsx(n.span,{style:{color:"#6A737D"},children:"# ..."})})]})})}),`
`,e.jsx("br",{}),`
`,e.jsx("br",{})]})}function t(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}function l(s,n){throw new Error("Expected component `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}export{t as default,d as frontmatter};
