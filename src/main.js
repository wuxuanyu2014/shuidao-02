import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import dataV from '@jiaminghi/data-view';
// 引入全局css
import './assets/scss/style.scss';
import './assets/scss/tableLeft/index.scss';
// 按需引入vue-awesome图标
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/chart-bar.js';
import 'vue-awesome/icons/chart-area.js';
import 'vue-awesome/icons/chart-pie.js';
import 'vue-awesome/icons/chart-line.js';
import 'vue-awesome/icons/align-left.js';

// 弹窗
import dataPopover from '@/components/dataPopover'

// 弹窗
import dataDialog from '@/components/dataDialog'

// 表格滚动
import elTableInfiniteScroll from "el-table-infinite-scroll";
import ElementUI from 'element-ui'
// 在main.js  引入 Element 样式
import 'element-ui/lib/theme-chalk/index.css'


// svg-icon
import "./icons/index.js"
//引入echart
//4.x 引用方式
import echarts from 'echarts'
//5.x 引用方式为按需引用
//希望使用5.x版本的话,需要在package.json中更新版本号,并切换引用方式
//import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;

// 全局注册
Vue.component('icon', Icon);
Vue.component('dataPopover', dataPopover);
Vue.component('dataDialog', dataDialog);
Vue.use(elTableInfiniteScroll);
Vue.use(dataV);
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
