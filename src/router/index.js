import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 引入布局组件
import Layout from '@/views/Layout'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login/index.vue")
  },
  /*
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "控制台",
      icon: 'console'
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "首页"
        },
        component: () => import("../views/Console/index.vue")
      }
    ]
  },
  */
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      name: "用户管理",
      icon: 'user'
    },
    component: Layout,
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          name: "用户列表"
        },
        component: () => import("../views/User/index.vue")
      }
    ]
  },
  {
    path: "/meta",
    name: "Meta",
    meta: {
      name: "主数据管理",
      icon: 'meta'
    },
    component: Layout,
    children: [
      /*
      {
        path: "/metaIndex",
        name: "metaIndex",
        meta: {
          name: "同步&监控"
        },
        component: () => import("../views/Meta/index.vue")
      },
      */
      {
        path: "/metaDatabase",
        name: "MetaDatabase",
        meta: {
          name: "数据库元数据"
        },
        component: () => import("../views/Meta/database.vue")
      },
      /*
      {
        path: "/metaDimension",
        name: "MetaDimension",
        meta: {
          name: "维度表[不对外]"
        },
        component: () => import("../views/Meta/dimension.vue")
      }
      */
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
