import request from './request'

// ================== 封装 axios  ================== 

// GET 请求，直接传递URL和参数
export function getAxios(url, params){
  return request({
    url,
    params,
    method: 'get'
  })
}

// POST 请求，直接传递URL和参数
export function postAxios(url, params){
  return request({
    url,
    data: params,
    method: 'post'
  })
}