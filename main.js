import Vue from 'vue'
import App from './App'
import Toast from './utils/common/toast'
import Http from './utils/http'

Vue.config.productionTip = false
Vue.prototype.$toast = Toast
Vue.prototype.$http = Http

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
