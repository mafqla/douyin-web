import request from './request'
import { LoginParams, LoginResponse, BaseResponse, UserInfo } from './types'
import urls from './urls'
import qs from 'query-string'

export default {
  /**
   * @description 登录
   */
  login: (params: LoginParams): Promise<BaseResponse<LoginResponse>> => {
    return request.post(urls.login, qs.stringify(params), {
      withCredentials: true,
    })
  },

  /**
   * @description 登出
   */
  logout: (): Promise<BaseResponse<void>> => {
    return request.post(urls.logout, {
      withCredentials: true,
    })
  },

  /**
   * @description 刷新token
   */
  refreshToken: (): Promise<BaseResponse<string>> => {
    return request.get(urls.refreshToken, {
      withCredentials: true,
    })
  },

  /**
   * @description 获取用户信息
   */
  getUserInfo: (): Promise<BaseResponse<UserInfo>> => {
    return request.get(urls.getUserInfo)
  },
}
