import { getAxios, postAxios } from './services/http.js'

// 登录
export function Login(params) {
  return postAxios('user/login.html', params)
}

// 用户列表
export function List(params) {
  return getAxios('user/get-user-list.html', params)
}

// 插入用户
export function Insert(params) {
  return postAxios('user/insert-user.html', params)
}

// 查询用户
export function Query(params) {
  return getAxios('user/query-user.html', params)
}

// 更新用户
export function Update(params) {
  return postAxios('user/update-user.html', params)
}

// 删除用户
export function Switch(params) {
  return postAxios('user/forbidden-user.html', params)
}

// 删除用户
export function Delete(params) {
  return postAxios('user/deletae-user.html', params)
}
