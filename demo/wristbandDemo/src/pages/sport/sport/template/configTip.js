var addSrc = require('publicDir/imgs/addback.jpg')
 module.exports = ` <ul class="layui-form config-tip">
                            <li class="hub-item">
                            <div class="layui-form-item">
                                <label class="layui-form-label" i18n="control"><%= control %></label>
                                <div>
                                    <input type="radio" name="control" value="0" i18n="local"  title = <%= local %> >
                                    <input type="radio" name="control" value="1" i18n="remote" checked title = <%= remote %>>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">Location</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="location" placeholder="输入位置信息" value=<%= cid %> class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">HubMac</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="hubMac" placeholder="CC:1B:E0:E0:1B:04" value=<%= hubMac %> class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">HubIp</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="hubMac" placeholder="192.168.1.100" value=<%= hubIp %> class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">Server</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="server" placeholder="api.cassianetworks.com" value=<%= server %> class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">Developer</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="developer" placeholder="tester" value=<%= developer %> class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <label class="layui-form-label">Password</label>
                                <div class="layui-input-inline">
                                    <input type="password" name="password" placeholder="tester" value="" class="layui-input">
                                </div>
                            </div>

                            <div class="layui-form-item test">
                                <button class="layui-btn layui-btn-small  " lay-submit="" class="test"><%= test %></button>
                                <div class="layui-input-inline">
                                    <i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop">&#x1002;</i>
                                 </div>
                            </div>
                            
                        </li>

                        <li class="hub-item addhub">
                            <a href="javascript:void(0)"><img src="${addSrc}" alt="add"></a>
                        </li>
                        <li class="layui-form-item">
                            <div class="layui-button">
                                <button class="layui-btn" id="finsh">完成</button>
                                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                            </div>
                        </li>
                    </ul>`