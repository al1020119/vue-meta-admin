import { getAxios, postAxios } from './services/http.js'

// =============================== 查看权限 =============================== 

// 元数据列表
export function List(params) {
  return getAxios('database/list.html', params)
}