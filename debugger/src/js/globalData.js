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
		_acaddress:''
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
	}
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