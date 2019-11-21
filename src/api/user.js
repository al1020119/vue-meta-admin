import { getAxios, postAxios } from './services/http.js'

// =============================== 管理员权限 =============================== 

// 登录
export function Login(params) {
  return postAxios('user/login.html', params)
}

// =============================== 超级管理员权限 =============================== 

// 列表
export function List(params) {
  return postAxios('user/list.html', params)
}