function getType(data) {
	return Object.prototype.toString.call(data).match(/^\[object\s(.*)\]$/)[1]
}

function verifylocalStorageData(localData, expectationData, exclude) {
	let result = true

	function fn(localData, expectationData, exclude) {
		let type = getType(expectationData),
			type2 = getType(localData)
		if (type === 'Object' || type === 'Array') {
			if (type === type2) {
				for (let key in expectationData) {
					if (exclude && exclude.indexOf(key) > -1)
						continue
					if (localData.hasOwnProperty(key)) {
						if (getType(expectationData[key]) === getType(localData[key])) {
							fn(localData[key], expectationData[key])
						} else result = false
					} else result = false
				}
			} else
				result = false
		} else {
			// return true
		}
	}
	fn(localData, expectationData,exclude)
	return result
}

function storage(key, data) {

	if (!window.localStorage)
		return
	let storage = window.localStorage
	storage.setItem(key, JSON.stringify(data))

}

function readStorage(key, expectationData) {
	if (!window.localStorage)
		return expectationData
	let storage = window.localStorage,
		localData = JSON.parse(storage.getItem(key))
	// if (verifylocalStorageData(localData, expectationData))
	// 	return localData

	return Object.assign(expectationData,localData)

}


export {
	storage,
	readStorage
}