import ApiRequest from './request'
const apiRequest = new ApiRequest({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: import.meta.env.VITE_TIMEOUT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Token: localStorage.getItem('token') || ''
  },
  interceptors: {
    requestInterceptor: (config: any) => {
      //携带token拦截
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Token = token
      }
      //解决Object is possibly 'undefined'.
      if (config.headers === undefined) {
        config.headers = {}
      }
      return config
    },
    requestInterceptorCatch: (error) => {
      return error
    },
    responseInterceptor: (res) => {
      // console.log(res);

      // ElMessage({
      //   message: res.data.msg,
      //   type: 'success'
      // })
      return res
    },
    responseInterceptorCatch: (error) => {
      return error
    }
  }
})

export default apiRequest
