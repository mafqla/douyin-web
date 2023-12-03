import apiRequest from '../index'
import type {
  ILogin,
  ILoginResult,
  IUserInfoResult,
  IEditUserInfo
} from './AuthType'
import type { IDataType } from '../types'
enum AuthApi {
  //登录
  AuthLogin = '/auth/login',
  //退出登录
  AuthLogout = '/auth/logout',
  //注册
  AuthRegister = '/auth/register',
  //发送验证码
  AuthSendCode = '/auth/sendCode',
  //重置密码
  AuthResetPassword = '/auth/resetPassword',

  //获取用户信息
  AuthUserInfo = '/user/userInfo',
  //修改用户信息
  AuthEditUser = '/user/updateUser'
}

/**
 * 修改用户信息
 */
export function AuthEditUserInfo(params: IEditUserInfo) {
  return apiRequest.post<IDataType>({
    url: AuthApi.AuthEditUser,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取用户信息
 * @returns userId
 */
export function AuthUserInfo(userId?: number) {
  return apiRequest.get<IDataType<IUserInfoResult>>({
    url: AuthApi.AuthUserInfo,
    params: {
      userId
    }
  })
}
/**
 * 登录
 * @param ILogin
 */
export function AuthLogin(login: ILogin) {
  return apiRequest.post<IDataType<ILoginResult>>({
    url: AuthApi.AuthLogin,
    data: login
  })
}
/**
 * 发送验证码
 *
 */

export const PostAuthSendCode = (email: string) => {
  return apiRequest.post<IDataType>({
    url: AuthApi.AuthSendCode,
    data: {
      email
    }
  })
}

/**
 * 邮箱验证码登录
 */
export const PostAuthLogin = (email: string, code: string) => {
  return apiRequest.post<IDataType>({
    url: AuthApi.AuthLogin,
    data: {
      email,
      code
    }
  })
}

export function AuthLogut() {}

export function AuthRegister() {}

export function AuthSendCode() {}

export function AuthResetPassword() {}

export function AuthUpdateAvatar() {}
