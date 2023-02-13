import Vue from 'vue'
import App from './App.vue'
import index from './store'

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/style.css"
import 'bootstrap-icons/font/bootstrap-icons.css'

Vue.config.productionTip = false

new Vue({
  store: index,
  render: h => h(App),
}).$mount('#app')
