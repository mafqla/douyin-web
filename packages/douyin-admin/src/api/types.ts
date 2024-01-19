/**
 * @description 基础响应结构
 */
export type BaseResponse<T = unknown> = {
  /**
   * @description 状态码
   */
  code: number
  /**
   * @description 消息
   */
  msg: string
  /**
   * @description 数据
   */
  data: T
  /**
   * @description 请求id
   */
  requestId: string
}

/**
 * @description 登录参数
 */
export type LoginParams = {
  /**
   * @description 手机号或者用户名
   */
  cellPhone: string
  /**
   * @description 密码 | 验证码
   */
  password: string
  /**
   * @description 登录类型 1:密码登录 2:验证码登录
   */
  type: number
  /**
   * @description 是否记住
   */
  rememberMe: boolean
}

/**
 * @description 登录返回
 */
export type LoginResponse = {
  /**
   * @description token
   */
  token: string
}

/**
 * @description 用户信息
 */
export type UserInfo = {
  /**
   * @description 昵称
   */
  nickname?: string
  /**
   * @description uid
   */
  uid?: number
  /**
   * @description 唯一id
   */
  unique_id?: number
  /**
   * @description 手机号
   */
  cellPhone?: number
  /**
   * @description 头像
   */
  avatar_thumb?: string
  /**
   * @description 作品数量
   */
  aweme_count?: number
  /**
   * @description 生日
   */
  birthday?: string
  /**
   * @description 签名
   */
  signature?: string
  /**
   * @description 封面
   */
  cover_url?: string

  /**
   * @description 国家
   */
  country?: string

  /**
   * @description 省份
   */
  province?: string
  /**
   * @description 城市
   */
  city?: string
  /**
   * @description 地区
   */
  district?: string

  /**
   * @description 性别
   */
  gender?: number
  /**
   * @description ip地址
   */
  ip_location?: string

  /**
   * @description 角色 0-普通用户 1-管理员 2-超级管理员
   */
  roleId?: number

  /**
   * @description 学校
   */
  school?: string
  /**
   * @description 自定义验证
   */
  custom_verify?: string

  /**
   * @description 企业验证
   */
  enterprise_verify_reason?: number
  /**
   * @description 验证类型 0-普通用户 1-custom_verify 2-enterprise_verify_reason
   */
  verification_type?: number
  /**
   * @description 喜欢数量
   */
  favoriting_count?: number
  /**
   * @description 粉丝数量
   */
  follower_count?: number
  /**
   * @description 关注数量
   */
  following_count?: number

  /**
   * @description 最大粉丝数量
   */
  max_follower_count?: number
  /**
   * @description 获赞数量
   */
  total_favorited?: number

  /**
   * @description 状态
   */
  status?: number

  /**
   * @description 创建时间
   */
  createTime?: string
}

/**
 * @description 分页参数
 */
export type PageParams = {
  /**
   * @description 页码
   */
  pageNo?: number
  /**
   * @description 页数
   */
  pageSize: number

  /**
   * @description 排序
   */
  isAsc?: string

  /**
   * @description 排序字段
   */
  sortBy?: string
}

/**
 * @description 角色分页返回
 */
export type RolePageResponse = {
  /**
   * @description 角色列表
   */
  list: Role[]

  /**
   * @description 总页码数
   */
  pages: number
  /**
   * @description 总数
   */
  total: number
}

/**
 * @description 角色
 */
export type Role = {
  /**
   * @description 角色id
   */
  id: number
  /**
   * @description 角色名称
   */
  name: string
  /**
   * @description 角色类型
   */
  type: string
  /**
   * @description 角色代码
   */
  code: number
  /**
   * @description 创建人
   */
  creater: string
  /**
   * @description 更新人
   */
  updater: string
  /**
   * @description 创建时间
   */
  createTime: string
  /**
   * @description 更新时间
   */
  updateTime: string
}

/**
 * @description 新增角色
 */
export type AddRoleParams = {
  /**
   * @description 角色id
   */
  id: number
  /**
   * @description 角色名称
   */
  name: string
  /**
   * @description 角色类型
   */
  type: string
  /**
   * @description 角色代码
   */
  code: number
}

/**
 * @description 编辑角色
 */

export type EditRoleParams = {
  /**
   * @description id
   */
  id: number
  editRole: AddRoleParams
}
