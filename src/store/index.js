import Vue from "vue";
import Vuex from "vuex";

// 日志组件处理
import createLogger from 'vuex/dist/logger';

// 注册Vuex
Vue.use(Vuex);

// 通用App模块
import app from "./app.js";
// 用户信息模块
import users from "./users";

const debug = process.env.NODE_ENV !== "production";
export default new Vuex.Store({
    modules: {
        app,
        users
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
});
