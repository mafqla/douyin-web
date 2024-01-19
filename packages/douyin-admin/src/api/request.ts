import { Message, Modal } from '@arco-design/web-react'
import axios from 'axios'
import { tryRefreshToken } from './refreshToken'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: import.meta.env.VITE_TIME_OUT,
  withCredentials: false
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    config.headers = {
      authorization: token
    }

    //等于post请求，且请求参数为对象
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

async function refreshToken(err) {
  // 尝试刷新token
  const success = await tryRefreshToken()
  if (success) {
    return request(err.config)
  }

  Modal.confirm({
    title: '登录超时，请重新登录',
    onOk: () => {
      window.location.pathname = '/login'
    }
  })
  //清空localstorage
  localStorage.clear()
  // window.location.pathname = '/login'
  return true
}
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code !== 200) {
        Message.error(response.data.msg)
      }
      return response.data
    }
  },

  async (err) => {
    if (err.response.status === 401) {
      // 登录异常或超时，刷新token
      return refreshToken(err)
    }
    return Promise.reject(err)
  }
)

export default request
