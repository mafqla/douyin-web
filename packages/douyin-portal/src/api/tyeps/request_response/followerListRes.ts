import type { IFollowingUser, IFollowingExtra } from './followingListRes'

/**
 * @description 粉丝列表响应
 */
export interface IFollowerListRes {
  /**
   * @description 额外信息
   */
  extra?: IFollowingExtra
  /**
   * @description 粉丝用户列表
   */
  followers: IFollowingUser[]
  /**
   * @description 是否还有更多
   */
  has_more?: boolean
  /**
   * @description 最小时间
   */
  min_time?: number
  /**
   * @description 最大时间
   */
  max_time?: number
  /**
   * @description 总数
   */
  total?: number
  /**
   * @description 状态码
   */
  status_code?: number
}
