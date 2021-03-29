// import something here
import VueYoutube from 'vue-youtube'
import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default boot(({ Vue }) => {
  Vue.use(VueYoutube)
  // something to do
})
