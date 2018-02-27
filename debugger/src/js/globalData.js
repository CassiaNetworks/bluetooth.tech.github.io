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
		_commond: ''
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
	}
})


if (firstFlag) {
	firstFlag = false
	saved = readStorage(localStorageKey, savedInit)
}


const globalData = {
	neverSave,
	saved

}


export default globalData