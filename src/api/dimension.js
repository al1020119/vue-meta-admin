import { getAxios, postAxios } from './services/http.js'

// 维度列表
export function List(params) {
  return getAxios('dimension/get-dimension-list.html', params)
}

// 插入维度
export function Insert(params) {
  return postAxios('dimension/insert-dimension.html', params)
}

// 查询维度
export function Query(params) {
  return getAxios('dimension/query-dimension.html', params)
}

// 更新维度
export function Update(params) {
  return postAxios('dimension/update-dimension.html', params)
}
// 删除维度
export function Delete(params) {
  return postAxios('dimension/deletae-dimension.html', params)
}