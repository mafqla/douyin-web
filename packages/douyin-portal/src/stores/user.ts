import { defineStore } from 'pinia'
import { videoStore } from './videos'
import apis from '@/api/apis'
import type { IUserDetailRes } from '@/api/tyeps/request_response/userDetailRes'

export const userStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    routerKey: 'updated',
    userInfo: {} as IUserDetailRes,
    isLogin: false,
    isLoading: true
  }),

  actions: {
    // 设置用户信息, 调用登录接口

    // 获取用户信息
    async getUserInfo() {
      const user_info = await apis.getUserInfo()
      // console.log(user_info)
      this.userInfo = user_info
      this.isLoading = false
    },

    //判断是否登录
    // isLogin() {
    //   return this.isLogin
    // },
    logout() {
      // 清空用户信息为空对象
      this.userInfo = {} as any
      this.token = ''
      // 清空本地存储
      localStorage.clear()
      this.routerKey = ''
      videoStore().$reset()
      // window.location.reload()
    },

    async postCode(email: string) {
      // const data = await PostAuthSendCode(email)
      // console.log(data)
    },
    async codeLogin(email: string, code: string) {
      // const data = await PostAuthLogin(email, code)
      // console.log(data)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'pinia-state',
        paths: ['userInfo'],
        storage: localStorage
      }
    ]
  }
})
