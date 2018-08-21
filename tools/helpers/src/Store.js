const STORAGE_KEY = 'helpers'
export default {
  fetch () {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  },
  save (data) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}
