//编写axios请求

import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: '/douyin', // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器

service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key
    // }
    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    }
  },

  (error) => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
