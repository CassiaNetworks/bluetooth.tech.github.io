var addSrc = require('publicDir/imgs/addback.jpg')

//hubitem外的字符串
module.exports.ul = ` <ul class='config-tip-hub config-tip'></ul>`

//每个hubitem的字符串          
module.exports.liItem = ` <li class="hub-item layui-form" data-cid=<%= cid %> >
                            <div class="layui-form-item">
                                <label class="layui-form-label"   i18n="control"><%= control %></label>
                                <div>
                                    <input type="radio" data-cid='<%- cid%>' name=<%= cid %> lay-filter='<%= cid %>'  value="0" i18n="local"   <%- method==0?'checked':'' %> title = '<%= local %>' >
                                    <input type="radio" data-cid='<%- cid%>' name=<%= cid %> lay-filter='<%= cid %>'  value="1" i18n="remote"  <%- method==1?'checked':'' %> title = '<%= remote %>'>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">Location</label>
                                <div class="layui-input-inline">
                                    <input type="text" data-cid='<%- cid%>' name="location" lay-verify="location" placeholder="请输入位置信息"  value='<%= location %>' class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">HubMac</label>
                                <div class="layui-input-inline">
                                    <input type="text" data-cid='<%- cid%>' name="mac" lay-verify="mac" placeholder="CC:1B:E0:E0:1B:04" value='<%= mac %>' class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">HubIp</label>
                                <div class="layui-input-inline">
                                    <input type="text" data-cid='<%- cid%>' name="ip" lay-verify="ip" placeholder="192.168.1.100" value='<%= ip %>' class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">Server</label>
                                <div class="layui-input-inline">
                                    <input type="text" data-cid='<%- cid%>' name="server" lay-verify="server" placeholder="api.cassianetworks.com" value='<%= server %>' class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">Developer</label>
                                <div class="layui-input-inline">
                                    <input type="text" data-cid='<%- cid%>' name="developer"  lay-verify="developer" placeholder="tester" value='<%= developer %>' class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">Password</label>
                                <div class="layui-input-inline">
                                    <input type="text" data-cid='<%- cid%>' name="password" lay-verify="required" placeholder="tester" value='<%= password %>' class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item test">
                                <button class="layui-btn layui-btn-small" lay-submit lay-filter="testHub" lay-select=<%= cid %>  data-cid='<%- cid %>'><%= test %></button>
                                <div class="layui-input-inline">
                                    <i data-cid=<%= cid %> ></i>
                                </div>
                            </div>
                            <div class="layui-form-item delete">
                                <button class="layui-btn layui-btn-small" data-cid=<%- cid %> class="test"><%= deletes %></button>
                            </div>
                            
                        </li> `


module.exports.footer = `<li class="hub-item addhub">
                            <a href="javascript:void(0)"><img src="${addSrc}" alt="add"></a>
                        </li>
                        <li class="layui-form-item last-li">
                            <div class="layui-button">
                                <button class="layui-btn finsh" >完成</button>
                                <button type="reset" class="layui-btn reset layui-btn-primary">重置</button>
                            </div>
                        </li>`