// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import router from './router'
import TDesign from 'tdesign-vue'
// 引入组件库的少量全局样式变量
import 'tdesign-vue/es/style/index.css'
import Vue from 'vue'
import ECharts from 'vue-echarts'
import dataV from '@jiaminghi/data-view'
// 引入百度地图API
import BaiduMap from 'vue-baidu-map'
Vue.use(dataV)
Vue.use(BaiduMap, {
  ak: 'fnppIqYtsg8hx6ap3KbZn6wuCRQnqFqd' // 替换为你的API密钥
})
// 全局注册 ECharts 组件
Vue.component('chart', ECharts)
Vue.use(ECharts)
Vue.use(TDesign)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
