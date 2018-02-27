import checkProp from './properties'
function formatServicesData(data,deviceMac) {
	let nodes = []

	function key2name(obj) {
		Object.keys(obj).forEach(function(k) {
			//console.log('formatServicesData.js - - > key2name',k);
			if (typeof obj[k] === 'object') return
			if (k === 'uuid') return
			if (k === 'primary') return
			if (k === 'endHandle') return
			if (k === 'startHandle') {
				obj.children.push({
					name: 'handle:' + obj[k]
				})
				return
			}

			if (k === 'handle') {
				// debugger
				obj.children.push({
					name: 'handle:' + obj[k]
				})
				return
			}

			if (k === 'properties') {
				let method = checkProp(obj[k])
					// debugger
				obj.children.push({
					name: 'properties:' + `<span class='prop-msg'>&nbsp;&nbsp;${method}</span>`
				})
				if (method.indexOf('read') !== -1) {
					// obj.children.push({
					// 	name: `read:
					// 				<span class="layui-form-item">
					// 					<span class="layui-inline">
					// 						<span class="layui-input-inline" style="width: 100px;">
					// 							<input type="text" class="layui-input" readonly value='123332'>
					// 						</span>
					// 						<span class="layui-form-mid"></span>
					// 						<button class="layui-btn">read</button>
					// 					</span>
					// 				</span>
					// 			</span>`
					// })
				}
				if (method.indexOf('write without response') !== -1) {
					obj.children.push({
						name: `write without response:&nbsp;0x
									<span class="layui-form-item">
										<span class="layui-inline">
											<span class="layui-input-inline" style="width: 100px;">
												<input type="text" class="layui-input js${obj.valueHandle}"  placeholder='0100'>
											</span>
											<span class="layui-form-mid"></span>
											<button class="layui-btn js-try" lay-submit lay-filter='writeWithoutRes'  data-devicemac=${deviceMac}  data-action='writeWithoutRes' data-handle=${obj.valueHandle}>try</button>
										</span>
									</span>
								</span>`,
						flag: 'writeWithoutRes',
						valueHandle: obj.valueHandle
					})
					obj.children.push({
						name: `<span style="visibility:hidden">write without response:&nbsp;</span>(0x0100)</span>`
					})
				}
				if (method.indexOf('write with response') !== -1) {
					obj.children.push({
						name: `write with response:&nbsp;0x
									<span class="layui-form-item">
										<span class="layui-inline">
											<span class="layui-input-inline" style="width: 100px;">
												<input type="text" class="layui-input js${obj.valueHandle}"  placeholder='0F04'>
											</span>
											<span class="layui-form-mid"></span>
											<button class="layui-btn js-try" lay-submit lay-filter='writeWithRes' data-devicemac=${deviceMac} data-action='writeWithRes' data-handle=${obj.valueHandle}>try</button>
										</span>
									</span>
								</span>`,
						flag: 'writeWithRes',
						valueHandle: obj.valueHandle
					})
					obj.children.push({
						name: `<span style="visibility:hidden">write with response:&nbsp;</span>(0x0100)</span>`
					})
				}
				if (method.indexOf('notify') !== -1) {
					const realHandle = obj.descriptors.filter(function(item) {
						return item.uuid.indexOf('2902') !== -1
					});
					obj.children.push({
						name: `notify
									<span class="layui-form-item">
										<span class="layui-inline">
											<span class="layui-form-mid"></span>
											<input type="checkbox"  lay-skin="switch" class='js-switch' data-action='notify' data-devicemac=${deviceMac} data-handle=${realHandle[0]?realHandle[0].handle:'undefined'} lay-filter='notify'>
										</span>
									</span>
								</span>`,
						flag: 'notify',
						handle: realHandle[0]?realHandle[0].handle:'undefined'
					})
				}
				if (method.indexOf('indicate') !== -1) {
					const realHandle = obj.descriptors.filter(function(item) {
						return item.uuid.indexOf('2902') !== -1
					});
					obj.children.push({
						name: `indicate
									<span class="layui-form-item">
										<span class="layui-inline">
											<span class="layui-form-mid"></span>
											<input type="checkbox"  lay-skin="switch" class='js-switch' data-devicemac=${deviceMac} data-action='indicate' data-handle=${realHandle[0].handle} lay-filter='indicate'>
										</span>
									</span>
								</span>`,
						flag: 'indicate',
						handle: realHandle[0].handle
					})
				}
				// debugger

				return
			}
			obj.children.push({

				name: k + ':' + obj[k]
			})
		})
	}
	console.log('formatServicesData::',typeof data,"data::",data);
	if(typeof data === 'string') data = JSON.parse(data)
	//console.log("formatServicesData::",typeof data ,data);
	if(!data.services){
		data.forEach(function(s){
			//console.log("service UUID::", s.uuid);
			nodes.push(s)
			s.children = []
			key2name(s)
			//console.log("formatServicesData.js",s)
			s.name = s.uuid;
			if(!s.characteristics) s.characteristics = [];
			s.children.push({
				name: 'characteristics',
				children: s.characteristics.map(function(c) {
					if(c.handle){
						c.valueHandle = c.handle;
					}
					c.children = []
					key2name(c, 'c')
					if (c.descriptors.length !== 0) {
						c.children.push({

							name: 'descriptors',
							children: c.descriptors.map(function(d) {
								d.children = []
								key2name(d)
								d.name = 'uuid:' + d.uuid
								return d
							})
						})
					}
					delete c.descriptors
					c.name = 'uuid:' + c.uuid
					return c
				})
			})
		});
			// debugger
		return [{
			name: 'services',
			children: nodes
		}];
	}
	data.services.forEach(function(s) {
			nodes.push(s)
			s.children = []
			key2name(s)
			s.children.push({
				name: 'characteristics',
				children: s.characteristics.map(function(c) {
					c.children = [];
					key2name(c, 'c');
					if (c.descriptors.length !== 0) {
						c.children.push({

							name: 'descriptors',
							children: c.descriptors.map(function(d) {
								d.children = [];
								key2name(d);
								d.name = 'uuid:' + d.uuid;
								return d;
							})
						});
					}
					delete c.descriptors;
					c.name = 'uuid:' + c.uuid;
					return c;
				})
			});
			delete s.characteristics;
			s.name = 'uuid:' + s.uuid;
		});
		// debugger
	return [{
		name: 'services',
		children: nodes
	}];
}
export default formatServicesData