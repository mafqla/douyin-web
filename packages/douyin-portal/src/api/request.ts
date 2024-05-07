import axios, { type AxiosRequestHeaders } from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: import.meta.env.VITE_TIMEOUT,
  withCredentials: true,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    config.headers = {
      authorization: token || ''
    } as unknown as AxiosRequestHeaders

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

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code !== 200) {
        // Message.error(response.data.msg)
      }
      return response.data
    }
  },

  async (err) => {
    if (err.response.status === 401) {
      // 登录异常或超时，刷新token
      // return refreshToken(err)
    }
    return Promise.reject(err)
  }
)

export default request
