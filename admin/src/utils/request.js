// 封装Axios，统一发送请求

import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials:true，跨域请求时发送cookies
  timeout: 5000 // 请求超时
})

// 请求拦截器
// 通过axios请求拦截器，在请求头中添加Authorization字段.
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // 通过自定义状态确定请求状态
  response => {
    const res = response
    // 如果自定义状态不是200，则判断为错误。
    if (res.status !== 200) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008:非法token；50012:其他客户端登录；50014:token过期；
      if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
        // to re-login
        MessageBox.confirm('您已注销，可以取消以停留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }

      return Promise.reject(new Error(res.data.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) 
    return Promise.reject(error)
  }
)

export default service
