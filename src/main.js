// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import router from './router'

window.$ = window.jQuery = require('jquery');
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.min.js'
import SuiVue from 'semantic-ui-vue'

import VueTouch from 'vue-touch'

VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})

Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(SuiVue)
Vue.use(VueTouch, {name: 'v-touch'})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
