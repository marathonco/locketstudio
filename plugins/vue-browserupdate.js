import Vue from 'vue'
import VueBrowserUpdate from 'vue-browserupdate'

Vue.use(VueBrowserUpdate, {
  options: {
    // Your browser update options
    container: document.body,
    required: { e: -1, f: -3, o: -3, s: -1, c: -3 },
    insecure: true,
    unsupported: true
  }
})
