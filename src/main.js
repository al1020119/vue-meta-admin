// 引入默认Vue
import Vue from "vue";
// 引入App作为index.html的app绑定
import App from "./App.vue";
// 路由管理
import router from "./router";
// 状态管理：数据存储
import store from "./store";
// UI布局
import elementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 引入网络请求框架
import axios from "axios";

// 引入Vue最新体验版
import VueCompositionApi from '@vue/composition-api';

// 自定义全局组件：
// SVG图展示
import "@/icons";
// 全局样式表
import '@/components/components.css'

// 引入D3.js做图表展示(前期主要用于仪表盘，后期会作为新版BI系统的核心)
import * as d3 from 'd3';
Object.defineProperty(Vue.prototype, '$d3', {value: d3});

// 解决在使用element-ui时出现警告：
// Added non-passive event listener to a scroll-blocking 'mousewheel' event. Consider marking event handler as 'passive' to make the page more responsive. 
// See https://www.chromestatus.com/feature/57455437
import 'default-passive-events'

// 使用新版Vue体验版
Vue.use(VueCompositionApi);

//设置axios为json
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

// 注入UI组件
Vue.use(elementUI);

// 将Axios注册为Vue的一个属性
Vue.prototype.$axios = axios;

// 产品环境提示关闭
Vue.config.productionTip = false;

// runtime（运行模式）
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
