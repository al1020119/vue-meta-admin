import { getAxios, postAxios } from './services/http.js'

export function Login(params) {
  return postAxios('user/login.html', params)
}