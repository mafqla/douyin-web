import type { IAwemeInfo } from '../common/aweme'

export interface IUserLikeRes {
  //状态码
  status_code: number
  // 最大游标
  max_cursor: number
  // 是否还有更多
  has_more: boolean
  // 视频列表
  aweme_list: IAwemeInfo[]
}
