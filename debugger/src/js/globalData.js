import {
	storage,
	readStorage
} from './localStorage'

let firstFlag = true,
	saved
const localStorageKey = 'cassiaSDKTool',
	neverSave = {
		notifySSE: {
			status: 'closed',
			es: ''
		},
		stateSSE: {
			status: 'closed',
			es: ''
		},
		scanSSE: {
			status: 'closed',
			es: '',
			timeOut: 5
		},
		scanData: [],
		length:null
	},
	savedInit = {
		_deviceMac: '',
		_hubMac: '',
		_hubIp: '',
		_chip: '0',
		_commond: '',
		_oAuth_dev:'',
		_secret:'',
		_acaddress:'',
		_adType: '0',
		_adData: '0201020416372A6007161C2A00000F30',
		_adRespData: '10094361737369612044656D6F20417070',
		_adChannelmap: '7',
		_adInterval: '500',
	}
Object.defineProperties(savedInit, {
	deviceMac: {
		get() {
			return this._deviceMac
		},
		set(newValue) {
			this._deviceMac = newValue
			storage(localStorageKey, this)
		}
	},
	hubMac: {
		get() {
			return this._hubMac
		},
		set(newValue) {
			this._hubMac = newValue
			storage(localStorageKey, this)
		}
	},
	hubIp: {
		get() {
			return this._hubIp
		},
		set(newValue) {
			this._hubIp = newValue
			storage(localStorageKey, this)
		}
	},
	chip: {
		get() {
			return this._chip
		},
		set(newValue) {
			this._chip = newValue
			storage(localStorageKey, this)
		}
	},
	commond: {
		get() {
			return this._commond
		},
		set(newValue) {
			this._commond = newValue
			storage(localStorageKey, this)
		}
	},
	oAuth_dev: {
		get() {
			return this._oAuth_dev
		},
		set(newValue) {
			this._oAuth_dev = newValue
			storage(localStorageKey, this)
		}
	},
	secret: {
		get() {
			return this._secret
		},
		set(newValue) {
			this._secret = newValue
			storage(localStorageKey, this)
		}
	},
	acaddress: {
		get() {
			return this._acaddress
		},
		set(newValue) {
			this._acaddress = newValue
			storage(localStorageKey, this)
		}
	},
	adType: {
		get() {
			return this._adType
		},
		set(newValue) {
			this._adType = newValue
			storage(localStorageKey, this)
		}
	},
	adData: {
		get() {
			return this._adData
		},
		set(newValue) {
			this._adData = newValue
			storage(localStorageKey, this)
		}
	},
	adRespData: {
		get() {
			return this._adRespData
		},
		set(newValue) {
			this._adRespData = newValue
			storage(localStorageKey, this)
		}
	},
	adChannelmap: {
		get() {
			return this._adChannelmap
		},
		set(newValue) {
			this._adChannelmap = newValue
			storage(localStorageKey, this)
		}
	},
	adInterval: {
		get() {
			return this._adInterval
		},
		set(newValue) {
			this._adInterval = newValue
			storage(localStorageKey, this)
		}
	},
})


if (firstFlag) {
	firstFlag = false
	saved = readStorage(localStorageKey, savedInit)
}

// 通过url判断当前使用的是http还是https，有全局参数配置则使用全局参数配置
function getCurProtocol() {
	var p = window.location.href.startsWith('https') ? 'https' : 'http';
	return p;
}

const globalData = {
	neverSave,
	saved,
	getCurProtocol,
}


export default globalData