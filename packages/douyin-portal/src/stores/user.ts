import {
  AuthLogin,
  AuthUserInfo,
  PostAuthLogin,
  PostAuthSendCode
} from '@/service/auth/auth'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { videoStore } from './videos'
import type { IUserInfoResult } from '@/service/auth/AuthType'

export const userStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    routerKey: 'updated',
    userInfo: {} as IUserInfoResult
  }),

  actions: {
    // 设置用户信息, 调用登录接口
    async login(userInfo: any) {
      try {
        const data = await AuthLogin(userInfo)
        const { token } = data.data

        // 存储到 localStorage
        localStorage.setItem('token', token)
        this.token = token

        //
        ElMessage({
          message: data.msg,
          type: 'success'
        })
        //获取用户信息
        this.getUserInfo()
        // window.location.reload()
        this.routerKey = 'update'
      } catch (e: any) {
        ElMessage({
          message: e || '登录失败',
          type: 'error'
        })
      }
    },

    // 获取用户信息
    async getUserInfo() {
      const data = await AuthUserInfo()
      this.userInfo = data.data
    },

    //判断是否登录
    isLogin() {
      return this.token !== ''
    },
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
      const data = await PostAuthSendCode(email)
      console.log(data)
    },
    async codeLogin(email: string, code: string) {
      const data = await PostAuthLogin(email, code)
      console.log(data)
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
