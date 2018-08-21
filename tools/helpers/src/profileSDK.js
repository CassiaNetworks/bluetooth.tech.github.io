import I6IA from './profiles/I6IA'
import HW330 from './profiles/HW330'
const profiles = {
  I6IA,
  HW330
}
// const config = [
//   { type: 'I6IA', name: '埃微手环' },
//   { type: 'HW330', name: '酷思手环' }
// ]
class ProfileSDK {
  constructor (profiles) {
    this.deviceGroup = Object.keys(profiles).map(el => {
      return {
        type: profiles[el].type,
        name: profiles[el].name
      }
    })
    this.profiles = profiles
  }
  infoScreen (devicetype, option, fn) {
    this.profiles[devicetype].infoScreen(option, fn)
  }
}
export default new ProfileSDK(profiles)
