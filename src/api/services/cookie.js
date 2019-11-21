import Cookie from 'js-cookie'

let tokenKey = 'Token'

// 获取Token
export function getToken(){
  return Cookie.get(tokenKey)
}

// 设置Token
export function setToken(val){
  return Cookie.set(tokenKey, val)
}

// 移除Token
export function removeToken(){
  return Cookie.remove(tokenKey)
}