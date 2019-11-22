import { getAxios, postAxios } from './services/http.js'

// 元数据列表
export function List(params) {
  return getAxios('database/get-database-list.html', params)
}

// 插入元数据
export function Insert(params) {
  return postAxios('database/insert-database.html', params)
}

// 查询元数据
export function Query(params) {
  return getAxios('database/query-database.html', params)
}

// 更新元数据
export function Update(params) {
  return postAxios('database/update-database.html', params)
}
// 删除元数据
export function Delete(params) {
  return postAxios('database/deletae-database.html', params)
}