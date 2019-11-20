import Vue from "vue";
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

import VueCompositionApi from '@vue/composition-api';

// 自定义全局组件
import "./icons";

Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

//设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

// 注入
Vue.use(elementUI);
// 将Axios注册为Vue的一个属性
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

// runtime（运行模式）
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
