import type { IAwemeInfo } from '../common/aweme'

export interface IUserCollectVideo {
  //状态码
  status_code: number
  // 游标
  cursor: string
  // 是否还有更多
  has_more: number
  // 视频列表
  aweme_list: IAwemeInfo[]
}
