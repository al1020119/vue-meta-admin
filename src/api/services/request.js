import axios from 'axios'
import { getToken } from './cookie'
import { Message } from 'element-ui'
import router from '@/router'

const baseURL = process.env.NODE_ENV === 'production' ? 'http://api.meta.com' : '/meta'
const requset = axios.create({
  headers: { "Content-Type": "application/json;charset=utf-8" }, //即将被发送的自定义请求头
  // headers: { "Content-Type": "application/x-www-form-urlencoded" }, //即将被发送的自定义请求头
  withCredentials: true, //表示跨域请求时是否需要使用凭证
  timeout: 3000,
  baseURL
})

requset.interceptors.request.use(
  config => {
    if(getToken){
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

requset.interceptors.response.use(
  response => {
    const data = response.data // {code , message , data}
    if(data.code === 200){
      return Promise.resolve(data)
    }else {
      Message({
        type: 'error',
        message: data.message
      })
      return Promise.reject(data)
    }
  },
  error => {
    // 这里 可以根据 error做相应的处理后再返回
    Message({
      type: 'error',
      message: error.message
    })
    return Promise.reject(error)
  }
)

export default requset


