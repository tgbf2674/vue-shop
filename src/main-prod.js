import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
// import './plugins/element.js'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// 在请求拦截器中展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.filter('dataFormat', (originVal) => {
  const dt = new Date(originVal * 1000)
  const year = dt.getFullYear()
  const mouth = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${mouth}-${day} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
