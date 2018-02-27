const checkProp = (value) => {
	const msg = [],
		msgBox = {
			0X01: 'broadcasts',
			0X02: 'read',
			0X04: 'write without response',
			0X08: 'write with response',
			0X10: 'notify',
			0X20: 'indicate',
			0X40: 'authen',
			0X80: 'extended'
		}
	if (!Number.isInteger(value))
		return 'properties value must be integer'
	for (let i in msgBox) {
		if (value & i)
			msg.push(msgBox[i])
	}
	return msg.join(',')
}
export default checkProp