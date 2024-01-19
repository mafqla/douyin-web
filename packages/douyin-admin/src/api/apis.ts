import request from './request'
import {
  LoginParams,
  LoginResponse,
  BaseResponse,
  UserInfo,
  RolePageResponse,
  PageParams,
  AddRoleParams,
  EditRoleParams
} from './types'
import urls from './urls'
import qs from 'query-string'

export default {
  /**
   * @description 登录
   */
  login: (params: LoginParams): Promise<BaseResponse<LoginResponse>> => {
    return request.post(urls.login, qs.stringify(params), {
      withCredentials: true
    })
  },

  /**
   * @description 登出
   */
  logout: (): Promise<BaseResponse<void>> => {
    return request.post(urls.logout, {
      withCredentials: true
    })
  },

  /**
   * @description 刷新token
   */
  refreshToken: (): Promise<BaseResponse<string>> => {
    return request.get(urls.refreshToken, {
      withCredentials: true
    })
  },

  /**
   * @description 获取用户信息
   */
  getUserInfo: (): Promise<BaseResponse<UserInfo>> => {
    return request.get(urls.getUserInfo)
  },

  /**
   * @description 获取角色列表
   */
  getRoleList: (
    params: PageParams
  ): Promise<BaseResponse<RolePageResponse>> => {
    return request.get(urls.getRoleList, {
      params
    })
  },
  /**
   * @description 新增角色
   */
  addRole: (params: AddRoleParams): Promise<BaseResponse<void>> => {
    return request.post(urls.addRole, qs.stringify(params))
  },
  /**
   * @description 编辑角色
   */
  editRole: (params: EditRoleParams): Promise<BaseResponse<void>> => {
    return request.put(`${urls.editRole}/${params.id}`, params.editRole)
  },
  /**
   * @description 删除角色
   */
  deleteRole: (id: number): Promise<BaseResponse<void>> => {
    return request.delete(`${urls.deleteRole}/${id}`)
  }
}
