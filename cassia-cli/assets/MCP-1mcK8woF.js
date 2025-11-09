import{j as e}from"./jsx-runtime-u17CrQMm.js";const d={title:"MCP Server",order:2};function r(n){const s={a:"a",code:"code",figure:"figure",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...n.components},{Info:a}=s;return a||l("Info"),e.jsxs(e.Fragment,{children:[e.jsx(s.h1,{id:"mcp-server",children:e.jsx(s.a,{href:"#mcp-server",children:"MCP Server"})}),`
`,e.jsx(s.p,{children:"增加MCP协议Server支持(HTTP方式)，可以使用其他LLM Agent直接通过自然语言操作网关。"}),`
`,e.jsx(s.h2,{id:"启动命令",children:e.jsx(s.a,{href:"#启动命令",children:"启动命令"})}),`
`,e.jsxs(s.p,{children:["这里以",e.jsx(s.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{children:"网关容器"})})})}),"内作为示例说明使用方式。"]}),`
`,e.jsx(a,{children:e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"下载命令"}),"、",e.jsx(s.strong,{children:"本地PC运行"})," 访问操作其他网关请根据",e.jsx(s.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{children:"快速开始"})})})}),"配置环境变量即可"]})}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# 容器内启动HTTP服务"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#6F42C1"},children:"./cassia"}),e.jsx(s.span,{style:{color:"#032F62"},children:" ai"}),e.jsx(s.span,{style:{color:"#032F62"},children:" mcp"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" --port"}),e.jsx(s.span,{style:{color:"#005CC5"},children:" 3000"})]})]})})}),`
`,e.jsx(s.h2,{id:"cursor使用",children:e.jsx(s.a,{href:"#cursor使用",children:"Cursor使用"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"配置MCP"}),`
`]}),`
`,e.jsx("img",{src:"/cassia-cli/cursor-1.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"填写内容"}),`
`]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{children:"192.168.0.22"})})})}),"为网关IP地址"]}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"json","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"json","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"{"})}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'  "mcpServers"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'    "CassiaGateway"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": {"})]}),`
`,e.jsxs(s.span,{"data-line":"",children:[e.jsx(s.span,{style:{color:"#005CC5"},children:'      "url"'}),e.jsx(s.span,{style:{color:"#24292E"},children:": "}),e.jsx(s.span,{style:{color:"#032F62"},children:'"http://192.168.0.22:3000/mcp"'})]}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"    }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"  }"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#24292E"},children:"}"})})]})})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"手动开启"}),`
`]}),`
`,e.jsx(s.p,{children:"启动后，正常可以看到这里显示有61个tools"}),`
`,e.jsx("img",{src:"/cassia-cli/cursor-2.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"测试消息"}),`
`]}),`
`,e.jsx("img",{src:"/cassia-cli/cursor-3.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx(s.h2,{id:"n8n使用",children:e.jsx(s.a,{href:"#n8n使用",children:"n8n使用"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"新建工作流"}),`
`]}),`
`,e.jsx("img",{src:"/cassia-cli/n8n-1.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"配置MCP Client"}),`
`]}),`
`,e.jsx("img",{src:"/cassia-cli/n8n-2.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsxs(s.p,{children:[e.jsx(s.span,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.code,{"data-language":"text","data-theme":"github-light",children:e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{children:"192.168.0.22"})})})}),"为网关IP地址"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"测试消息"}),`
`]}),`
`,e.jsx("img",{src:"/cassia-cli/n8n-3.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx(s.h2,{id:"vscode使用",children:e.jsx(s.a,{href:"#vscode使用",children:"VSCode使用"})}),`
`,e.jsx(a,{children:e.jsx(s.p,{children:"初步测试可能需要权限，可以尝试使用自己的账号尝试，方式如下"})}),`
`,e.jsx("img",{src:"/cassia-cli/vscode-1.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"/cassia-cli/vscode-2.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"/cassia-cli/vscode-3.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx("br",{}),`
`,e.jsx("img",{src:"/cassia-cli/vscode-4.png",alt:"Example",width:"100%",style:{borderRadius:"8px"},className:"border"}),`
`,e.jsx(s.h2,{id:"其他说明",children:e.jsx(s.a,{href:"#其他说明",children:"其他说明"})}),`
`,e.jsx(s.p,{children:"支持配置单独子MCP服务，可以配置子路径方式使用部分工具调用"}),`
`,e.jsx(s.figure,{"data-rehype-pretty-code-figure":"",children:e.jsx(s.pre,{tabIndex:"0","data-language":"bash","data-theme":"github-light",children:e.jsxs(s.code,{"data-language":"bash","data-theme":"github-light",style:{display:"grid"},children:[e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# ble操作"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6F42C1"},children:"http://IP:3000/mcp/gateway/ble"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# 网关容器"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6F42C1"},children:"http://IP:3000/mcp/gateway/container"})}),`
`,e.jsx(s.span,{"data-line":"",children:" "}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# 更多子命令/工具"})}),`
`,e.jsx(s.span,{"data-line":"",children:e.jsx(s.span,{style:{color:"#6A737D"},children:"# ..."})})]})})}),`
`,e.jsx("br",{}),`
`,e.jsx("br",{})]})}function c(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(r,{...n})}):r(n)}function l(n,s){throw new Error("Expected component `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}export{c as default,d as frontmatter};
